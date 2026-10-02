import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FareTierModal from "./FareTierModal";
import parisLandmarkImg from "../../assets/paris_landmark.jpg";
import "./FlightResults.css";

function FlightResults() {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        tripType = "oneway",
        searchData,
        selectedFromCity,
        selectedToCity,
        fromDisplay,
        toDisplay,
    } = location.state || {};

    const [isLoading, setIsLoading] = useState(true);
    const [loadingStep, setLoadingStep] = useState(1);
    const [departureFlights, setDepartureFlights] = useState([]);
    const [returnFlights, setReturnFlights] = useState([]);
    const [searchError, setSearchError] = useState(null);

    const [selectedDeparture, setSelectedDeparture] = useState(null);
    const [selectedReturn, setSelectedReturn] = useState(null);
    const [activeTab, setActiveTab] = useState("departure");

    const [realtimeMatrix, setRealtimeMatrix] = useState([]);
    const [isMatrixLoading, setIsMatrixLoading] = useState(false);

    // Dynamic loading stage ticker
    useEffect(() => {
        if (!isLoading) return;
        const interval = setInterval(() => {
            setLoadingStep((prev) => (prev < 4 ? prev + 1 : 1));
        }, 1300);
        return () => clearInterval(interval);
    }, [isLoading]);

    // Fare Tier Selection Modal State
    const [activeTierFlight, setActiveTierFlight] = useState(null);
    const [activeTierType, setActiveTierType] = useState("departure");

    // =========================================================
    // SIDEBAR FILTER & SORT STATES
    // =========================================================
    const [selectedAirlines, setSelectedAirlines] = useState([]);
    const [selectedStops, setSelectedStops] = useState([]); // [0, 1, 2] (2 = 2+ stops)
    const [selectedDepTimes, setSelectedDepTimes] = useState([]); // ['early', 'morning', 'afternoon', 'evening']
    const [selectedArrTimes, setSelectedArrTimes] = useState([]); // ['early', 'morning', 'afternoon', 'evening']
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });
    const [sortBy, setSortBy] = useState("best");
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Scroll to top on mount / loading change
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, [isLoading]);

    // =========================================================
    // FETCH FLIGHTS FROM DUFFEL BACKEND
    // =========================================================
    useEffect(() => {
        if (!searchData) {
            setIsLoading(false);
            return;
        }

        let isMounted = true;

        const fetchFlights = async () => {
            try {
                setIsLoading(true);
                setSearchError(null);

                const fromCode =
                    selectedFromCity?.airportCode ||
                    searchData?.fromCity;

                const toCode =
                    selectedToCity?.airportCode ||
                    searchData?.toCity;

                const rawCabin =
                    searchData?.cabinClass ||
                    searchData?.flightClass ||
                    "economy";

                let formattedCabin = "economy";
                const cabinLower = String(rawCabin).trim().toLowerCase();

                if (cabinLower.includes("prem")) {
                    formattedCabin = "premium_economy";
                } else if (cabinLower.includes("bus")) {
                    formattedCabin = "business";
                } else if (cabinLower.includes("first")) {
                    formattedCabin = "first";
                } else {
                    formattedCabin = "economy";
                }

                const duffelRequest = {
                    from: fromCode,
                    to: toCode,
                    departureDate: searchData?.departureDate,
                    returnDate: tripType === "round" ? searchData?.returnDate : null,
                    adults: Number(searchData?.adults || 1),
                    children: Number(searchData?.children || 0),
                    infants: Number(searchData?.infants || 0),
                    cabinClass: formattedCabin,
                };

                console.log("Duffel Search Request:", duffelRequest);

                const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
                const response = await fetch(`${apiBase}/api/duffel/search`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(duffelRequest),
                });

                const responseText = await response.text();

                if (!response.ok) {
                    let errMsg = `Duffel search failed: ${response.status}`;
                    try {
                        const parsed = JSON.parse(responseText);
                        errMsg = parsed.message || parsed.error || responseText || errMsg;
                    } catch {
                        errMsg = responseText || errMsg;
                    }
                    throw new Error(errMsg);
                }

                if (!responseText) {
                    throw new Error("Duffel returned an empty response.");
                }

                let data;
                try {
                    data = JSON.parse(responseText);
                } catch {
                    throw new Error("Invalid response received from Duffel backend.");
                }

                console.log("Duffel Search Response:", data);

                let depFlights = [];
                let retFlights = [];

                if (data && typeof data === "object" && !Array.isArray(data)) {
                    depFlights = Array.isArray(data.departureFlights) ? data.departureFlights : [];
                    retFlights = Array.isArray(data.returnFlights) ? data.returnFlights : [];
                    if (depFlights.length === 0 && Array.isArray(data.flights)) {
                        depFlights = data.flights;
                    }
                } else if (Array.isArray(data)) {
                    depFlights = data;
                }

                const deduplicateFlights = (flights) => {
                    if (!Array.isArray(flights)) return [];
                    const map = new Map();
                    flights.forEach((f, idx) => {
                        if (!f) return;
                        const key = `${f.airline || ""}|${f.flightNumber || ""}|${f.departureTime || ""}|${f.arrivalTime || ""}|${f.from || ""}|${f.to || ""}`;
                        if (!map.has(key)) {
                            map.set(key, {
                                ...f,
                                uniqueId: f.duffelOfferId || `${f.id || "flight"}-${idx}`,
                            });
                        } else {
                            const existing = map.get(key);
                            if (Number(f.price || 0) < Number(existing.price || Infinity)) {
                                map.set(key, {
                                    ...f,
                                    uniqueId: f.duffelOfferId || `${f.id || "flight"}-${idx}`,
                                });
                            }
                        }
                    });
                    return Array.from(map.values());
                };

                const cleanDep = deduplicateFlights(depFlights);
                const cleanRet = deduplicateFlights(retFlights);

                if (isMounted) {
                    setDepartureFlights(cleanDep);
                    setReturnFlights(cleanRet);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Duffel flight search error:", error);
                if (isMounted) {
                    setSearchError(error?.message || "Unable to search flights. Please try again later.");
                    setIsLoading(false);
                }
            }
        };

        fetchFlights();

        return () => {
            isMounted = false;
        };
    }, [searchData, selectedFromCity, selectedToCity, tripType]);

    // =========================================================
    // DATE FORMATTERS
    // =========================================================
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString + "T00:00:00");
        if (Number.isNaN(date.getTime())) {
            return dateString;
        }
        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const totalTravelers =
        Number(searchData?.adults || 0) +
        Number(searchData?.children || 0) +
        Number(searchData?.infants || 0);

    // =========================================================
    // TIME & DURATION PARSING HELPERS
    // =========================================================
    const getTimeHour = (timeStr) => {
        if (!timeStr) return -1;
        const str = String(timeStr).trim();
        if (str.includes("T")) {
            const d = new Date(str);
            if (!isNaN(d.getTime())) return d.getHours();
        }
        const match = str.match(/(\d{1,2}):(\d{2})/);
        if (!match) return -1;
        let hour = parseInt(match[1], 10);
        const lower = str.toLowerCase();
        if (lower.includes("pm") && hour !== 12) hour += 12;
        if (lower.includes("am") && hour === 12) hour = 0;
        return hour;
    };

    const getDepartureSlot = (flight) => {
        const hour = getTimeHour(flight.departureTime);
        if (hour < 0) return null;
        if (hour < 6) return "early";
        if (hour < 12) return "morning";
        if (hour < 18) return "afternoon";
        return "evening";
    };

    const getArrivalSlot = (flight) => {
        const hour = getTimeHour(flight.arrivalTime);
        if (hour < 0) return null;
        if (hour < 6) return "early";
        if (hour < 12) return "morning";
        if (hour < 18) return "afternoon";
        return "evening";
    };

    const formatDurationDisplay = (rawDuration) => {
        if (!rawDuration) return "N/A";
        const str = String(rawDuration).trim();

        if (str.startsWith("P") || str.startsWith("p")) {
            const temp = str.toUpperCase();
            const dMatch = temp.match(/(\d+)D/);
            const hMatch = temp.match(/(\d+)H/);
            const mMatch = temp.match(/(\d+)M/);

            const d = dMatch ? Number(dMatch[1]) : 0;
            const h = hMatch ? Number(hMatch[1]) : 0;
            const m = mMatch ? Number(mMatch[1]) : 0;

            let res = "";
            if (d > 0) res += `${d}d `;
            if (h > 0 || d > 0) res += `${h}h `;
            if (m > 0 || (d === 0 && h === 0)) res += `${m}m`;
            return res.trim();
        }

        return str;
    };

    const getDurationMinutes = (duration) => {
        if (!duration) return 999999;
        const str = String(duration).trim();

        if (str.startsWith("P") || str.startsWith("p")) {
            const temp = str.toUpperCase();
            const dMatch = temp.match(/(\d+)D/);
            const hMatch = temp.match(/(\d+)H/);
            const mMatch = temp.match(/(\d+)M/);

            const d = dMatch ? Number(dMatch[1]) : 0;
            const h = hMatch ? Number(hMatch[1]) : 0;
            const m = mMatch ? Number(mMatch[1]) : 0;

            return d * 24 * 60 + h * 60 + m;
        }

        const text = str.toLowerCase();
        const daysMatch = text.match(/(\d+)\s*d/);
        const hoursMatch = text.match(/(\d+)\s*h/);
        const minutesMatch = text.match(/(\d+)\s*m/);

        const days = daysMatch ? Number(daysMatch[1]) : 0;
        const hours = hoursMatch ? Number(hoursMatch[1]) : 0;
        const minutes = minutesMatch ? Number(minutesMatch[1]) : 0;

        return days * 24 * 60 + hours * 60 + minutes;
    };

    const getStopsValue = (flight) => {
        if (!flight) return 0;
        if (flight.stops !== undefined && flight.stops !== null && !isNaN(Number(flight.stops))) {
            return Number(flight.stops);
        }
        if (flight.stopCount !== undefined && flight.stopCount !== null && !isNaN(Number(flight.stopCount))) {
            return Number(flight.stopCount);
        }
        const stopStr = String(flight.stop || flight.stops || "").toLowerCase();
        if (stopStr.includes("non") || stopStr.includes("direct") || stopStr === "0") return 0;
        const match = stopStr.match(/(\d+)/);
        if (match) return Number(match[1]);
        return 0;
    };

    // =========================================================
    // AIRLINE OPTIONS & FILTER STATS (DYNAMIC COUNTS)
    // =========================================================
    const rawActiveFlights = activeTab === "departure" ? departureFlights : returnFlights;

    const airlineOptions = useMemo(() => {
        const allFlights = [...departureFlights, ...returnFlights];
        return [
            ...new Set(
                allFlights
                    .map((flight) => flight.airline)
                    .filter(Boolean)
            ),
        ];
    }, [departureFlights, returnFlights]);

    const filterStats = useMemo(() => {
        const flights = rawActiveFlights || [];
        const airlinesMap = {};
        let nonstop = 0;
        let oneStop = 0;
        let twoPlus = 0;
        let depEarly = 0,
            depMorning = 0,
            depAfternoon = 0,
            depEvening = 0;
        let arrEarly = 0,
            arrMorning = 0,
            arrAfternoon = 0,
            arrEvening = 0;
        let minP = Infinity;
        let maxP = -Infinity;

        flights.forEach((f) => {
            if (!f) return;
            if (f.airline) {
                airlinesMap[f.airline] = (airlinesMap[f.airline] || 0) + 1;
            }
            const stops = getStopsValue(f);
            if (stops === 0) nonstop++;
            else if (stops === 1) oneStop++;
            else twoPlus++;

            const depSlot = getDepartureSlot(f);
            if (depSlot === "early") depEarly++;
            else if (depSlot === "morning") depMorning++;
            else if (depSlot === "afternoon") depAfternoon++;
            else if (depSlot === "evening") depEvening++;

            const arrSlot = getArrivalSlot(f);
            if (arrSlot === "early") arrEarly++;
            else if (arrSlot === "morning") arrMorning++;
            else if (arrSlot === "afternoon") arrAfternoon++;
            else if (arrSlot === "evening") arrEvening++;

            const price = Number(f.price || 0);
            if (price > 0) {
                if (price < minP) minP = price;
                if (price > maxP) maxP = price;
            }
        });

        return {
            airlinesMap,
            stops: { nonstop, oneStop, twoPlus },
            depTime: { early: depEarly, morning: depMorning, afternoon: depAfternoon, evening: depEvening },
            arrTime: { early: arrEarly, morning: arrMorning, afternoon: arrAfternoon, evening: arrEvening },
            minPrice: minP === Infinity ? 0 : minP,
            maxPrice: maxP === -Infinity ? 50000 : maxP,
        };
    }, [rawActiveFlights]);

    // Active filter badge count
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (selectedAirlines.length > 0) count += selectedAirlines.length;
        if (selectedStops.length > 0) count += selectedStops.length;
        if (selectedDepTimes.length > 0) count += selectedDepTimes.length;
        if (selectedArrTimes.length > 0) count += selectedArrTimes.length;
        if (priceRange.min || priceRange.max) count += 1;
        return count;
    }, [selectedAirlines, selectedStops, selectedDepTimes, selectedArrTimes, priceRange]);

    // Filter toggling actions
    const toggleAirlineFilter = (airline) => {
        setSelectedAirlines((prev) =>
            prev.includes(airline) ? prev.filter((a) => a !== airline) : [...prev, airline]
        );
    };

    const toggleStopFilter = (stopNum) => {
        setSelectedStops((prev) =>
            prev.includes(stopNum) ? prev.filter((s) => s !== stopNum) : [...prev, stopNum]
        );
    };

    const toggleDepTimeFilter = (slot) => {
        setSelectedDepTimes((prev) =>
            prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
        );
    };

    const toggleArrTimeFilter = (slot) => {
        setSelectedArrTimes((prev) =>
            prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
        );
    };

    const handleClearAllFilters = () => {
        setSelectedAirlines([]);
        setSelectedStops([]);
        setSelectedDepTimes([]);
        setSelectedArrTimes([]);
        setPriceRange({ min: "", max: "" });
    };

    const handleClearAirlines = () => setSelectedAirlines([]);
    const handleClearStops = () => setSelectedStops([]);
    const handleClearDepTimes = () => setSelectedDepTimes([]);
    const handleClearArrTimes = () => setSelectedArrTimes([]);
    const handleClearPrice = () => setPriceRange({ min: "", max: "" });

    // =========================================================
    // FILTER FUNCTION
    // =========================================================
    const filterFlights = (flights) => {
        return flights.filter((flight) => {
            // Airline filter
            if (selectedAirlines.length > 0 && !selectedAirlines.includes(flight.airline)) {
                return false;
            }

            // Stops filter
            const stops = getStopsValue(flight);
            if (selectedStops.length > 0) {
                const matchesNonstop = selectedStops.includes(0) && stops === 0;
                const matchesOne = selectedStops.includes(1) && stops === 1;
                const matchesTwoPlus = selectedStops.includes(2) && stops >= 2;
                if (!matchesNonstop && !matchesOne && !matchesTwoPlus) {
                    return false;
                }
            }

            // Departure time filter
            const depSlot = getDepartureSlot(flight);
            if (selectedDepTimes.length > 0 && (!depSlot || !selectedDepTimes.includes(depSlot))) {
                return false;
            }

            // Arrival time filter
            const arrSlot = getArrivalSlot(flight);
            if (selectedArrTimes.length > 0 && (!arrSlot || !selectedArrTimes.includes(arrSlot))) {
                return false;
            }

            // Price range filter
            const price = Number(flight.price || 0);
            if (priceRange.min !== "" && price < Number(priceRange.min)) {
                return false;
            }
            if (priceRange.max !== "" && price > Number(priceRange.max)) {
                return false;
            }

            return true;
        });
    };

    // =========================================================
    // BEST FLIGHT SCORE & SORTING
    // =========================================================
    const getBestFlightScore = (flight, flights) => {
        if (!Array.isArray(flights) || flights.length === 0) return 0;

        const prices = flights.map((item) => Number(item.price || 0));
        const durations = flights.map((item) => getDurationMinutes(item.duration));
        const stops = flights.map((item) => getStopsValue(item));

        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const minDuration = Math.min(...durations);
        const maxDuration = Math.max(...durations);
        const minStops = Math.min(...stops);
        const maxStops = Math.max(...stops);

        const price = Number(flight.price || 0);
        const duration = getDurationMinutes(flight.duration);
        const stopCount = getStopsValue(flight);

        const priceScore = maxPrice === minPrice ? 0 : (price - minPrice) / (maxPrice - minPrice);
        const durationScore = maxDuration === minDuration ? 0 : (duration - minDuration) / (maxDuration - minDuration);
        const stopsScore = maxStops === minStops ? 0 : (stopCount - minStops) / (maxStops - minStops);

        return priceScore * 0.5 + durationScore * 0.3 + stopsScore * 0.2;
    };

    const sortFlights = (flights) => {
        const sorted = [...flights];

        switch (sortBy) {
            case "best":
            case "recommended":
                return sorted.sort(
                    (a, b) => getBestFlightScore(a, flights) - getBestFlightScore(b, flights)
                );
            case "price-low":
                return sorted.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
            case "price-high":
                return sorted.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
            case "earliest":
                return sorted.sort(
                    (a, b) => getTimeHour(a.departureTime) - getTimeHour(b.departureTime)
                );
            case "latest":
                return sorted.sort(
                    (a, b) => getTimeHour(b.departureTime) - getTimeHour(a.departureTime)
                );
            case "shortest":
                return sorted.sort(
                    (a, b) => getDurationMinutes(a.duration) - getDurationMinutes(b.duration)
                );
            default:
                return sorted;
        }
    };

    const filteredDepartureFlights = sortFlights(filterFlights(departureFlights));
    const filteredReturnFlights = sortFlights(filterFlights(returnFlights));

    // =========================================================
    // QUICK SORT STATS
    // =========================================================
    const activeFlightList =
        activeTab === "departure" ? filteredDepartureFlights : filteredReturnFlights;

    const sortStats = useMemo(() => {
        if (!activeFlightList || activeFlightList.length === 0) {
            return { minPrice: null, minDuration: null };
        }

        let minP = Infinity;
        let minD = Infinity;
        let minDText = "";

        activeFlightList.forEach((f) => {
            const p = Number(f.price || 0);
            if (p > 0 && p < minP) minP = p;

            const dMins = getDurationMinutes(f.duration);
            if (dMins > 0 && dMins < minD) {
                minD = dMins;
                minDText = f.duration || "";
            }
        });

        return {
            minPrice: minP === Infinity ? null : minP,
            minDuration: minDText || null,
        };
    }, [activeFlightList]);

    // =========================================================
    // DATE MATRIX / LOW FARE CALENDAR STRIP (±3 DAYS)
    // =========================================================
    const dateMatrixItems = useMemo(() => {
        if (!searchData?.departureDate) return [];

        const baseFare =
            sortStats.minPrice ||
            (departureFlights?.[0]?.price ? Number(departureFlights[0].price) : 0);

        if (!baseFare || baseFare <= 0) return [];

        const currentDepDate = searchData.departureDate;
        let target = new Date(currentDepDate + "T00:00:00");
        if (Number.isNaN(target.getTime())) {
            target = new Date();
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let start = new Date(target);
        start.setDate(start.getDate() - 3);
        if (start < today) {
            start = new Date(today);
        }

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];

        const items = [];
        let minPrice = Infinity;

        for (let i = 0; i < 7; i++) {
            const d = new Date(start);
            d.setDate(d.getDate() + i);

            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");
            const dateStr = `${yyyy}-${mm}-${dd}`;

            const dayOfWeek = days[d.getDay()];
            const formattedDate = `${d.getDate()} ${months[d.getMonth()]}`;

            let price;
            if (dateStr === currentDepDate && sortStats.minPrice) {
                price = Number(sortStats.minPrice);
            } else {
                const dow = d.getDay();
                let mult = 1.0;
                if (dow === 2 || dow === 3) mult = 0.94;
                else if (dow === 1 || dow === 4) mult = 0.98;
                else if (dow === 6) mult = 1.04;
                else if (dow === 5 || dow === 0) mult = 1.1;

                const varianceFactor = 1 + (((d.getDate() * 7) % 9) - 4) / 100;
                const rawPrice = baseFare * mult * varianceFactor;

                if (baseFare >= 1000) {
                    price = Math.round(rawPrice / 50) * 50;
                } else {
                    price = Math.round(rawPrice * 100) / 100;
                }
            }

            if (price < minPrice) minPrice = price;

            items.push({
                date: dateStr,
                dayOfWeek,
                formattedDate,
                price,
                isSelected: dateStr === currentDepDate,
                isCheapest: false,
            });
        }

        items.forEach((item) => {
            if (item.price === minPrice) {
                item.isCheapest = true;
            }
        });

        return items;
    }, [searchData?.departureDate, sortStats.minPrice, departureFlights]);

    // Live Date Matrix API Fetch
    useEffect(() => {
        if (!searchData?.departureDate) return;

        const fromCode =
            selectedFromCity?.airportCode || searchData?.fromCity || searchData?.from;
        const toCode =
            selectedToCity?.airportCode || searchData?.toCity || searchData?.to;

        if (!fromCode || !toCode) return;

        let isMounted = true;
        setIsMatrixLoading(true);

        const baseFare =
            sortStats.minPrice ||
            (departureFlights?.[0]?.price ? Number(departureFlights[0].price) : 0);

        const rawCabin =
            searchData?.cabinClass || searchData?.flightClass || "economy";

        let formattedCabin = "economy";
        const cabinLower = String(rawCabin).trim().toLowerCase();
        if (cabinLower.includes("prem")) formattedCabin = "premium_economy";
        else if (cabinLower.includes("bus")) formattedCabin = "business";
        else if (cabinLower.includes("first")) formattedCabin = "first";

        const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
        const params = new URLSearchParams({
            from: fromCode,
            to: toCode,
            departureDate: searchData.departureDate,
            basePrice: baseFare ? String(baseFare) : "0",
            cabinClass: formattedCabin,
        });

        if (tripType === "round" && searchData?.returnDate) {
            params.append("returnDate", searchData.returnDate);
        }

        fetch(`${apiBase}/api/flights/date-matrix?${params.toString()}`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (isMounted && Array.isArray(data) && data.length > 0) {
                    setRealtimeMatrix(data);
                }
            })
            .catch((err) => {
                console.warn("Live date matrix fetch error:", err);
            })
            .finally(() => {
                if (isMounted) setIsMatrixLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [
        searchData?.departureDate,
        searchData?.returnDate,
        searchData?.fromCity,
        searchData?.toCity,
        selectedFromCity?.airportCode,
        selectedToCity?.airportCode,
        sortStats.minPrice,
        departureFlights?.length,
    ]);

    const displayMatrixItems = useMemo(() => {
        if (realtimeMatrix && realtimeMatrix.length > 0) {
            return realtimeMatrix;
        }
        return dateMatrixItems;
    }, [realtimeMatrix, dateMatrixItems]);

    const handleDateMatrixSelect = (selectedDate) => {
        if (!selectedDate || selectedDate === searchData?.departureDate) return;

        const updatedSearchData = {
            ...searchData,
            departureDate: selectedDate,
        };

        if (tripType === "round" && searchData?.returnDate) {
            if (new Date(selectedDate) >= new Date(searchData.returnDate)) {
                const nextDay = new Date(selectedDate + "T00:00:00");
                nextDay.setDate(nextDay.getDate() + 3);
                const yyyy = nextDay.getFullYear();
                const mm = String(nextDay.getMonth() + 1).padStart(2, "0");
                const dd = String(nextDay.getDate()).padStart(2, "0");
                updatedSearchData.returnDate = `${yyyy}-${mm}-${dd}`;
            }
        }

        setSelectedDeparture(null);
        setSelectedReturn(null);

        navigate("/flight-results", {
            replace: true,
            state: {
                ...location.state,
                searchData: updatedSearchData,
            },
        });
    };

    const handleQuickSort = (type) => {
        setSortBy(type);
    };

    // ========================================================= 
    // FARE TIER MODAL HANDLERS 
    // ========================================================= 
    const handleOpenTierModal = (flight, type) => {
        setActiveTierFlight(flight);
        setActiveTierType(type);
    };

    const handleSelectTierFromModal = (flightWithTier) => {
        handleSelectFlight(flightWithTier, activeTierType);
        setActiveTierFlight(null);
    };

    const handleSelectFlight = (flight, type) => {
        if (type === "departure") {
            setSelectedDeparture(flight);
            if (tripType === "round" && !selectedReturn) {
                setActiveTab("return");
            }
        } else {
            setSelectedReturn(flight);
        }
    };

    const handleContinue = () => {
        if (!selectedDeparture) {
            alert("Please select a departure flight.");
            setActiveTab("departure");
            return;
        }

        if (tripType === "round" && !selectedReturn) {
            alert("Please select a return flight.");
            setActiveTab("return");
            return;
        }

        navigate("/flight-details", {
            state: {
                selectedDeparture,
                selectedReturn,
                searchData,
                selectedFromCity,
                selectedToCity,
            },
        });
    };

    const isFlightMatch = (selected, target) => {
        if (!selected || !target) return false;
        if (selected.duffelOfferId && target.duffelOfferId) {
            return selected.duffelOfferId === target.duffelOfferId;
        }
        if (selected.uniqueId && target.uniqueId) {
            return selected.uniqueId === target.uniqueId;
        }
        if (selected.id && target.id && selected.id === target.id) {
            return (
                selected.airline === target.airline &&
                selected.flightNumber === target.flightNumber &&
                selected.departureTime === target.departureTime
            );
        }
        return (
            selected.airline === target.airline &&
            selected.flightNumber === target.flightNumber &&
            selected.departureTime === target.departureTime &&
            selected.from === target.from &&
            selected.to === target.to
        );
    };

    // ========================================================= 
    // FLIGHT CARD RENDERER 
    // ========================================================= 
    const renderFlightCard = (flight, type, index) => {
        const isSelected =
            type === "departure"
                ? isFlightMatch(selectedDeparture, flight)
                : isFlightMatch(selectedReturn, flight);

        const flightKey = `${type}-${flight.duffelOfferId ?? flight.uniqueId ?? flight.id ?? flight.flightNumber ?? "flight"}-${index}`;

        return (
            <article
                className={`flight-card ${isSelected ? "flight-card-selected" : ""}`}
                key={flightKey}
            >
                {/* AIRLINE */}
                <div className="airline-block">
                    <div className="airline-logo">✈</div>
                    <div>
                        <h3>{flight.airline || "Airline"}</h3>
                        <span>{flight.flightNumber || "Flight"}</span>
                    </div>
                </div>

                {/* DEPARTURE */}
                <div className="time-block">
                    <strong>{flight.departureTime || "--:--"}</strong>
                    <span>
                        {flight.from ||
                            searchData?.fromCity ||
                            searchData?.from ||
                            selectedFromCity?.airportCode ||
                            "—"}
                    </span>
                </div>

                {/* DURATION & STOPS */}
                <div className="duration-block">
                    <span>{formatDurationDisplay(flight.duration) || "Duration unavailable"}</span>
                    <div className="flight-line">
                        <span></span>
                        <b>✈</b>
                        <span></span>
                    </div>
                    <span>
                        {getStopsValue(flight) === 0 ? "Non-stop" : `${getStopsValue(flight)} Stop`}
                    </span>
                </div>

                {/* ARRIVAL */}
                <div className="time-block">
                    <strong>{flight.arrivalTime || "--:--"}</strong>
                    <span>
                        {flight.to ||
                            searchData?.toCity ||
                            searchData?.to ||
                            selectedToCity?.airportCode ||
                            "—"}
                    </span>
                </div>

                {/* PRICE & SELECT ACTION */}
                <div className="price-block">
                    <small>Per traveler</small>
                    <strong>
                        ₹{Number(flight.price || 0).toLocaleString("en-IN")}
                    </strong>

                    {isSelected && flight.fareTierName && (
                        <span className="flight-selected-tier-badge">
                            🏷️ {flight.fareTierName}
                        </span>
                    )}

                    <button
                        type="button"
                        className={isSelected ? "selected-flight-button" : ""}
                        onClick={() => handleOpenTierModal(flight, type)}
                    >
                        {isSelected
                            ? `✓ ${flight.fareTierName ? flight.fareTierName.replace(/^Economy\s*/i, "") || "Selected" : "Selected"}`
                            : "Select Flight"}
                    </button>
                </div>
            </article>
        );
    };

    // ========================================================= 
    // LOADER SCREEN 
    // ========================================================= 
    if (isLoading) {
        const originCode =
            selectedFromCity?.airportCode || searchData?.fromCity || searchData?.from || "DEL";
        const destCode =
            selectedToCity?.airportCode || searchData?.toCity || searchData?.to || "BOM";

        const originCityName =
            selectedFromCity?.cityName || fromDisplay || searchData?.fromCity || searchData?.from || "Delhi";
        const destCityName =
            selectedToCity?.cityName || toDisplay || searchData?.toCity || searchData?.to || "Mumbai";

        const formatLoadingDate = (dateStr) => {
            if (!dateStr) return "";
            try {
                const parts = String(dateStr).split("-");
                if (parts.length === 3) {
                    const dateObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
                    return dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                }
                const d = new Date(dateStr);
                if (isNaN(d.getTime())) return dateStr;
                return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
            } catch {
                return dateStr;
            }
        };

        const totalPassengers =
            (Number(searchData?.adults) || 1) +
            (Number(searchData?.children) || 0) +
            (Number(searchData?.infants) || 0);

        const rawClass = searchData?.cabinClass || searchData?.flightClass || "economy";
        let cabinDisplay = "Economy";
        const cLower = String(rawClass).toLowerCase();
        if (cLower.includes("prem")) cabinDisplay = "Premium Economy";
        else if (cLower.includes("bus")) cabinDisplay = "Business";
        else if (cLower.includes("first")) cabinDisplay = "First Class";

        const depDateFormatted = formatLoadingDate(searchData?.departureDate) || "Sep 29, 2026";
        const retDateFormatted = searchData?.returnDate ? formatLoadingDate(searchData.returnDate) : null;
        const dateDisplay = tripType === "round" && retDateFormatted
            ? `${depDateFormatted} - ${retDateFormatted}`
            : depDateFormatted;

        const handleModifySearch = () => {
            navigate("/", {
                state: {
                    tripType,
                    searchData,
                    selectedFromCity,
                    selectedToCity,
                    fromDisplay,
                    toDisplay,
                },
            });
        };

        return (
            <main className="search-loading-page">
                <div className="search-loading-bg-glow"></div>

                <div className="loading-top-bar">
                    <div className="loading-search-strip">
                        <div className="strip-trip-type">
                            <span className="strip-radio-dot"></span>
                            <span className="strip-trip-text">
                                {tripType === "round" ? "Round Trip" : "One Way"}
                            </span>
                        </div>

                        <div className="strip-divider"></div>

                        <div className="strip-col">
                            <div className="strip-icon-box origin-icon">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                                </svg>
                            </div>
                            <div className="strip-info">
                                <span className="strip-label">Flying from</span>
                                <span className="strip-value">
                                    {originCityName} ({originCode}) <span className="strip-chevron">⌵</span>
                                </span>
                            </div>
                        </div>

                        <div className="strip-divider"></div>

                        <div className="strip-col">
                            <div className="strip-icon-box dest-icon">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                </svg>
                            </div>
                            <div className="strip-info">
                                <span className="strip-label">Flying to</span>
                                <span className="strip-value">
                                    {destCityName} ({destCode}) <span className="strip-chevron">⌵</span>
                                </span>
                            </div>
                        </div>

                        <div className="strip-divider"></div>

                        <div className="strip-col">
                            <div className="strip-icon-box date-icon">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                            </div>
                            <div className="strip-info">
                                <span className="strip-label">{tripType === "round" ? "Departing - Returning" : "Departing"}</span>
                                <span className="strip-value">
                                    {dateDisplay} <span className="strip-chevron">⌵</span>
                                </span>
                            </div>
                        </div>

                        <div className="strip-divider"></div>

                        <div className="strip-col">
                            <div className="strip-icon-box pax-icon">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                            </div>
                            <div className="strip-info">
                                <span className="strip-label">{totalPassengers} Traveler{totalPassengers > 1 ? "s" : ""}</span>
                                <span className="strip-value">
                                    {cabinDisplay} <span className="strip-chevron">⌵</span>
                                </span>
                            </div>
                        </div>

                        <button type="button" className="strip-modify-btn" onClick={handleModifySearch}>
                            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <span>Modify Search</span>
                        </button>
                    </div>
                </div>

                <div className="loading-main-stage">
                    <div className="loading-orbit-wrapper">
                        <div className="orbit-radar-ring outer-dashed"></div>
                        <div className="orbit-radar-ring mid-arc"></div>
                        <div className="orbit-radar-ring inner-solid"></div>
                        <div className="orbit-pulse-core"></div>
                        <div className="orbit-plane-track">
                            <div className="orbit-plane-carrier">
                                <svg className="orbit-plane-svg" viewBox="0 0 24 24" width="38" height="38" fill="#0284c7">
                                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <h1 className="loading-hero-title">
                        Finding the best flights for your <span className="journey-accent">journey...</span>
                    </h1>
                    <p className="loading-hero-subtitle">
                        We're searching thousands of flights, comparing prices, and checking availability — so you don't have to.
                    </p>

                    <div className="loading-stepper">
                        <div className="stepper-track-bg">
                            <div
                                className="stepper-track-fill"
                                style={{ width: `${((loadingStep - 1) / 3) * 100}%` }}
                            ></div>
                        </div>

                        <div className={`stepper-step ${loadingStep >= 1 ? "active" : ""} ${loadingStep > 1 ? "done" : ""}`}>
                            <div className="step-circle">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                            </div>
                            <div className="step-text">
                                <span className="step-title">Searching</span>
                                <span className="step-desc">Looking for the best options</span>
                            </div>
                        </div>

                        <div className={`stepper-step ${loadingStep >= 2 ? "active" : ""} ${loadingStep > 2 ? "done" : ""}`}>
                            <div className="step-circle">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="8" y1="6" x2="21" y2="6" />
                                    <line x1="8" y1="12" x2="21" y2="12" />
                                    <line x1="8" y1="18" x2="21" y2="18" />
                                    <line x1="3" y1="6" x2="3.01" y2="6" />
                                    <line x1="3" y1="12" x2="3.01" y2="12" />
                                    <line x1="3" y1="18" x2="3.01" y2="18" />
                                </svg>
                            </div>
                            <div className="step-text">
                                <span className="step-title">Comparing</span>
                                <span className="step-desc">Prices & airlines</span>
                            </div>
                        </div>

                        <div className={`stepper-step ${loadingStep >= 3 ? "active" : ""} ${loadingStep > 3 ? "done" : ""}`}>
                            <div className="step-circle">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    <path d="M9 12l2 2 4-4" />
                                </svg>
                            </div>
                            <div className="step-text">
                                <span className="step-title">Verifying</span>
                                <span className="step-desc">Exclusive deals</span>
                            </div>
                        </div>

                        <div className={`stepper-step ${loadingStep >= 4 ? "active" : ""}`}>
                            <div className="step-circle">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                                </svg>
                            </div>
                            <div className="step-text">
                                <span className="step-title">Results</span>
                                <span className="step-desc">Almost there...</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="loading-bottom-bar">
                    <div className="boarding-pass-badge">
                        <div className="pass-top-bar">
                            <span className="pass-plane-icon">✈</span>
                            <span className="pass-title">BOARDING PASS</span>
                        </div>
                        <div className="pass-body">
                            <div className="pass-route-row">
                                <span className="pass-sub-plane">✈</span>
                                <span className="pass-route">{originCode} ➔ {destCode}</span>
                                <span className="pass-sub-plane orange">✈</span>
                            </div>
                            <div className="pass-barcode-lines">
                                <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                            </div>
                        </div>
                    </div>

                    <div className="loading-trust-badges">
                        <div className="badge compliassure">
                            <svg className="badge-icon" viewBox="0 0 24 24" width="28" height="28">
                                <path fill="#0284c7" d="M12,2A10,10,0,0,0,2,12a10,10,0,0,0,10,10,10,10,0,0,0,10-10A10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" />
                                <path fill="#0284c7" d="M16.5,8.5l-6,6L7.5,11.5l-1.5,1.5,4.5,4.5,7.5-7.5Z" />
                            </svg>
                            <div className="badge-text">
                                <strong>CompliAssure®</strong>
                                <span>SECURED</span>
                                <small>powered by Asperia</small>
                            </div>
                        </div>

                        <div className="badge norton">
                            <div className="norton-seal">
                                <svg viewBox="0 0 24 24" width="28" height="28">
                                    <circle cx="12" cy="12" r="10" fill="#ffc72c" />
                                    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="#000" />
                                </svg>
                                <div className="badge-text text-black">
                                    <strong>Norton</strong>
                                    <span>SECURED</span>
                                    <small>powered by digicert</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="destination-landmark-badge">
                        <div className="landmark-img-wrap">
                            <img src={parisLandmarkImg} alt="Destination Landmark" className="landmark-img" />
                            <div className="landmark-img-fade"></div>
                        </div>
                        <div className="landmark-overlay">
                            <div className="landmark-trail-svg">
                                <svg viewBox="0 0 160 70" width="140" height="60" fill="none">
                                    <path d="M10 50 C 40 20, 70 55, 95 35 C 105 20, 125 25, 115 45 C 105 55, 85 35, 110 15"
                                        stroke="#0284c7" strokeWidth="1.8" strokeDasharray="3 3" />
                                    <path d="M112 13 L118 15 L114 19 Z" fill="#0284c7" />
                                </svg>
                            </div>
                            <div className="landmark-script-tag">
                                <span className="tag-city">{destCityName || "Destination"}</span>
                                <span className="tag-sub">Here We Come 🧡 📍</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    // ========================================================= 
    // NO SEARCH DATA SCREEN 
    // ========================================================= 
    if (!searchData) {
        return (
            <main className="flight-results-page">
                <div className="results-empty">
                    <div className="empty-icon">✈</div>
                    <h2>No flight search found</h2>
                    <p>Please search for a flight first.</p>
                    <button type="button" onClick={() => navigate("/")}>
                        Back to Search
                    </button>
                </div>
            </main>
        );
    }

    // ========================================================= 
    // ERROR SCREEN 
    // ========================================================= 
    if (searchError) {
        return (
            <main className="flight-results-page">
                <div className="results-container">
                    <div className="results-header">
                        <button
                            type="button"
                            className="back-search-btn"
                            onClick={() => navigate("/")}
                        >
                            ← Modify Search
                        </button>
                    </div>

                    <div className="no-flights-alert error-alert">
                        <div className="alert-warning-icon">⚠️</div>
                        <p className="alert-warning-text">{searchError}</p>
                    </div>
                </div>
            </main>
        );
    }

    const noDepartureFlights = filteredDepartureFlights.length === 0;
    const noReturnFlights = tripType === "round" && filteredReturnFlights.length === 0;

    // ========================================================= 
    // MAIN SEARCH RESULTS WITH SIDEBAR LAYOUT 
    // ========================================================= 
    return (
        <main className="flight-results-page">
            <div className="results-container">
                {/* 1. TOP HEADER SUMMARY */}
                <div className="results-header">
                    <div className="results-header-info">
                        <div className="route-title">
                            <h1>
                                {fromDisplay ||
                                    searchData?.fromCity ||
                                    searchData?.from ||
                                    selectedFromCity?.cityName ||
                                    selectedFromCity?.airportCode ||
                                    "Departure"}
                                <span>→</span>
                                {toDisplay ||
                                    searchData?.toCity ||
                                    searchData?.to ||
                                    selectedToCity?.cityName ||
                                    selectedToCity?.airportCode ||
                                    "Destination"}
                            </h1>
                        </div>

                        <div className="search-summary">
                            <span>{formatDate(searchData.departureDate)}</span>
                            {tripType === "round" && searchData.returnDate && (
                                <span>Return: {formatDate(searchData.returnDate)}</span>
                            )}
                            <span>
                                {totalTravelers} Traveler{totalTravelers !== 1 ? "s" : ""}
                            </span>
                            <span>{searchData.flightClass || "Economy"}</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="back-search-btn"
                        onClick={() => navigate("/")}
                    >
                        ← Modify Search
                    </button>
                </div>

                {/* 2. MAIN 2-COLUMN LAYOUT: SIDEBAR + RESULTS */}
                <div className="flight-results-layout">
                    {/* ================================================= 
                        LEFT SIDEBAR FILTERS (Tripozo Style) 
                    ================================================= */}
                    <aside className={`flight-sidebar ${isMobileFilterOpen ? "mobile-open" : ""}`}>
                        {/* Sidebar Header */}
                        <div className="sidebar-header">
                            <div className="sidebar-title-wrap">
                                <span className="sidebar-filter-icon">⚙️</span>
                                <h2>Filters</h2>
                                {activeFilterCount > 0 && (
                                    <span className="sidebar-active-count">{activeFilterCount}</span>
                                )}
                            </div>
                            <div className="sidebar-header-actions">
                                {activeFilterCount > 0 && (
                                    <button
                                        type="button"
                                        className="sidebar-reset-btn"
                                        onClick={handleClearAllFilters}
                                    >
                                        Clear All
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="mobile-sidebar-close"
                                    onClick={() => setIsMobileFilterOpen(false)}
                                    aria-label="Close filters"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* SECTION: SORT BY */}
                        <div className="sidebar-section">
                            <div className="sidebar-section-header">
                                <h3>
                                    <span className="sec-icon">⇅</span> Sort By
                                </h3>
                            </div>
                            <div className="sidebar-sort-box">
                                <select
                                    id="sidebarSortBy"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="sidebar-sort-select"
                                >
                                    <option value="best">🏆 Best Value</option>
                                    <option value="price-low">💰 Price: Low to High</option>
                                    <option value="price-high">💎 Price: High to Low</option>
                                    <option value="earliest">🌅 Earliest Departure</option>
                                    <option value="latest">🌙 Latest Departure</option>
                                    <option value="shortest">⚡ Fastest Duration</option>
                                </select>
                            </div>
                        </div>

                        {/* SECTION: STOPS */}
                        <div className="sidebar-section">
                            <div className="sidebar-section-header">
                                <h3>
                                    <span className="sec-icon">✈</span> Stops
                                </h3>
                                {selectedStops.length > 0 && (
                                    <button
                                        type="button"
                                        className="section-clear-btn"
                                        onClick={handleClearStops}
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                            <div className="sidebar-checkbox-list">
                                <label className={`sidebar-check-item ${selectedStops.includes(0) ? "checked" : ""}`}>
                                    <input
                                        type="checkbox"
                                        checked={selectedStops.includes(0)}
                                        onChange={() => toggleStopFilter(0)}
                                    />
                                    <span className="custom-check-box"></span>
                                    <span className="check-label">Non-stop</span>
                                    <span className="check-count">({filterStats.stops.nonstop})</span>
                                </label>
                                <label className={`sidebar-check-item ${selectedStops.includes(1) ? "checked" : ""}`}>
                                    <input
                                        type="checkbox"
                                        checked={selectedStops.includes(1)}
                                        onChange={() => toggleStopFilter(1)}
                                    />
                                    <span className="custom-check-box"></span>
                                    <span className="check-label">1 Stop</span>
                                    <span className="check-count">({filterStats.stops.oneStop})</span>
                                </label>
                                <label className={`sidebar-check-item ${selectedStops.includes(2) ? "checked" : ""}`}>
                                    <input
                                        type="checkbox"
                                        checked={selectedStops.includes(2)}
                                        onChange={() => toggleStopFilter(2)}
                                    />
                                    <span className="custom-check-box"></span>
                                    <span className="check-label">2+ Stops</span>
                                    <span className="check-count">({filterStats.stops.twoPlus})</span>
                                </label>
                            </div>
                        </div>

                        {/* SECTION: DEPARTURE TIME */}
                        <div className="sidebar-section">
                            <div className="sidebar-section-header">
                                <h3>
                                    <span className="sec-icon">🛫</span> Departure Time
                                </h3>
                                {selectedDepTimes.length > 0 && (
                                    <button
                                        type="button"
                                        className="section-clear-btn"
                                        onClick={handleClearDepTimes}
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                            <div className="time-slots-grid">
                                <button
                                    type="button"
                                    className={`time-slot-card ${selectedDepTimes.includes("early") ? "active" : ""}`}
                                    onClick={() => toggleDepTimeFilter("early")}
                                >
                                    <span className="slot-icon">🌅</span>
                                    <span className="slot-title">Before 6 AM</span>
                                    <span className="slot-count">({filterStats.depTime.early})</span>
                                </button>

                                <button
                                    type="button"
                                    className={`time-slot-card ${selectedDepTimes.includes("morning") ? "active" : ""}`}
                                    onClick={() => toggleDepTimeFilter("morning")}
                                >
                                    <span className="slot-icon">☀️</span>
                                    <span className="slot-title">6 AM - 12 PM</span>
                                    <span className="slot-count">({filterStats.depTime.morning})</span>
                                </button>

                                <button
                                    type="button"
                                    className={`time-slot-card ${selectedDepTimes.includes("afternoon") ? "active" : ""}`}
                                    onClick={() => toggleDepTimeFilter("afternoon")}
                                >
                                    <span className="slot-icon">🌤️</span>
                                    <span className="slot-title">12 PM - 6 PM</span>
                                    <span className="slot-count">({filterStats.depTime.afternoon})</span>
                                </button>

                                <button
                                    type="button"
                                    className={`time-slot-card ${selectedDepTimes.includes("evening") ? "active" : ""}`}
                                    onClick={() => toggleDepTimeFilter("evening")}
                                >
                                    <span className="slot-icon">🌙</span>
                                    <span className="slot-title">After 6 PM</span>
                                    <span className="slot-count">({filterStats.depTime.evening})</span>
                                </button>
                            </div>
                        </div>

                        {/* SECTION: ARRIVAL TIME */}
                        <div className="sidebar-section">
                            <div className="sidebar-section-header">
                                <h3>
                                    <span className="sec-icon">🛬</span> Arrival Time
                                </h3>
                                {selectedArrTimes.length > 0 && (
                                    <button
                                        type="button"
                                        className="section-clear-btn"
                                        onClick={handleClearArrTimes}
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                            <div className="time-slots-grid">
                                <button
                                    type="button"
                                    className={`time-slot-card ${selectedArrTimes.includes("early") ? "active" : ""}`}
                                    onClick={() => toggleArrTimeFilter("early")}
                                >
                                    <span className="slot-icon">🌅</span>
                                    <span className="slot-title">Before 6 AM</span>
                                    <span className="slot-count">({filterStats.arrTime.early})</span>
                                </button>

                                <button
                                    type="button"
                                    className={`time-slot-card ${selectedArrTimes.includes("morning") ? "active" : ""}`}
                                    onClick={() => toggleArrTimeFilter("morning")}
                                >
                                    <span className="slot-icon">☀️</span>
                                    <span className="slot-title">6 AM - 12 PM</span>
                                    <span className="slot-count">({filterStats.arrTime.morning})</span>
                                </button>

                                <button
                                    type="button"
                                    className={`time-slot-card ${selectedArrTimes.includes("afternoon") ? "active" : ""}`}
                                    onClick={() => toggleArrTimeFilter("afternoon")}
                                >
                                    <span className="slot-icon">🌤️</span>
                                    <span className="slot-title">12 PM - 6 PM</span>
                                    <span className="slot-count">({filterStats.arrTime.afternoon})</span>
                                </button>

                                <button
                                    type="button"
                                    className={`time-slot-card ${selectedArrTimes.includes("evening") ? "active" : ""}`}
                                    onClick={() => toggleArrTimeFilter("evening")}
                                >
                                    <span className="slot-icon">🌙</span>
                                    <span className="slot-title">After 6 PM</span>
                                    <span className="slot-count">({filterStats.arrTime.evening})</span>
                                </button>
                            </div>
                        </div>

                        {/* SECTION: AIRLINES */}
                        {airlineOptions.length > 0 && (
                            <div className="sidebar-section">
                                <div className="sidebar-section-header">
                                    <h3>
                                        <span className="sec-icon">🏢</span> Airlines
                                    </h3>
                                    {selectedAirlines.length > 0 && (
                                        <button
                                            type="button"
                                            className="section-clear-btn"
                                            onClick={handleClearAirlines}
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                                <div className="sidebar-checkbox-list">
                                    {airlineOptions.map((airline) => (
                                        <label
                                            key={airline}
                                            className={`sidebar-check-item ${selectedAirlines.includes(airline) ? "checked" : ""}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedAirlines.includes(airline)}
                                                onChange={() => toggleAirlineFilter(airline)}
                                            />
                                            <span className="custom-check-box"></span>
                                            <span className="check-label">{airline}</span>
                                            <span className="check-count">
                                                ({filterStats.airlinesMap[airline] || 0})
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* SECTION: PRICE RANGE */}
                        <div className="sidebar-section">
                            <div className="sidebar-section-header">
                                <h3>
                                    <span className="sec-icon">💳</span> Price Range
                                </h3>
                                {(priceRange.min || priceRange.max) && (
                                    <button
                                        type="button"
                                        className="section-clear-btn"
                                        onClick={handleClearPrice}
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                            <div className="sidebar-price-filter">
                                <div className="price-inputs-row">
                                    <div className="price-field">
                                        <span className="price-currency">₹</span>
                                        <input
                                            type="number"
                                            placeholder={filterStats.minPrice ? String(filterStats.minPrice) : "Min"}
                                            value={priceRange.min}
                                            onChange={(e) =>
                                                setPriceRange({ ...priceRange, min: e.target.value })
                                            }
                                        />
                                    </div>
                                    <span className="price-to-divider">—</span>
                                    <div className="price-field">
                                        <span className="price-currency">₹</span>
                                        <input
                                            type="number"
                                            placeholder={filterStats.maxPrice ? String(filterStats.maxPrice) : "Max"}
                                            value={priceRange.max}
                                            onChange={(e) =>
                                                setPriceRange({ ...priceRange, max: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>
                                {filterStats.minPrice > 0 && filterStats.maxPrice > filterStats.minPrice && (
                                    <div className="sidebar-price-slider-wrap">
                                        <input
                                            type="range"
                                            min={filterStats.minPrice}
                                            max={filterStats.maxPrice}
                                            value={priceRange.max || filterStats.maxPrice}
                                            onChange={(e) =>
                                                setPriceRange({ ...priceRange, max: e.target.value })
                                            }
                                            className="sidebar-price-slider"
                                        />
                                        <div className="price-slider-labels">
                                            <small>₹{Number(filterStats.minPrice).toLocaleString("en-IN")}</small>
                                            <small>₹{Number(filterStats.maxPrice).toLocaleString("en-IN")}</small>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* MOBILE FILTER OVERLAY BACKDROP */}
                    {isMobileFilterOpen && (
                        <div
                            className="mobile-filter-backdrop"
                            onClick={() => setIsMobileFilterOpen(false)}
                        ></div>
                    )}

                    {/* ================================================= 
                        RIGHT MAIN RESULTS CONTENT 
                    ================================================= */}
                    <div className="flight-results-main">
                        {/* Mobile Filter Button */}
                        <div className="mobile-filter-bar">
                            <button
                                type="button"
                                className="mobile-filter-btn"
                                onClick={() => setIsMobileFilterOpen(true)}
                            >
                                <span className="mobile-btn-icon">⚙️</span>
                                <span>Filters & Sort</span>
                                {activeFilterCount > 0 && (
                                    <span className="mobile-filter-badge">{activeFilterCount}</span>
                                )}
                            </button>
                        </div>

                        {/* DATE MATRIX / LOW FARE CALENDAR STRIP (±3 DAYS) */}
                        {displayMatrixItems.length > 0 && (
                            <div className="date-matrix-strip">
                                <div className="date-matrix-top-row">
                                    <div className="date-matrix-title-badge">
                                        <span className="matrix-icon">📅</span>
                                        <span>Flexible Dates Matrix (±3 Days)</span>
                                        {isMatrixLoading && (
                                            <span className="matrix-live-sync-badge">
                                                <span className="live-pulse-dot"></span>
                                                Live Duffel Fares Syncing...
                                            </span>
                                        )}
                                    </div>
                                    <span className="date-matrix-hint">Click any date to view live fares</span>
                                </div>
                                <div className="date-matrix-grid">
                                    {displayMatrixItems.map((item) => (
                                        <button
                                            key={item.date}
                                            type="button"
                                            className={`date-matrix-card ${item.isSelected ? "matrix-card-selected" : ""} ${item.isCheapest ? "matrix-card-cheapest" : ""}`}
                                            onClick={() => handleDateMatrixSelect(item.date)}
                                        >
                                            {item.isCheapest && (
                                                <span className="matrix-badge-pill cheapest-pill">Cheapest</span>
                                            )}
                                            {item.isSelected && !item.isCheapest && (
                                                <span className="matrix-badge-pill selected-pill">Selected</span>
                                            )}
                                            <span className="matrix-day-name">{item.dayOfWeek}</span>
                                            <span className="matrix-date-text">{item.formattedDate}</span>
                                            <strong className="matrix-fare-amount">
                                                ₹{Number(item.price).toLocaleString("en-IN")}
                                            </strong>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* QUICK SORT BAR */}
                        <div className="quick-sort-bar">
                            <button
                                type="button"
                                className={`quick-sort-btn ${sortBy === "best" || sortBy === "recommended" ? "active" : ""}`}
                                onClick={() => handleQuickSort("best")}
                            >
                                <span className="quick-sort-icon">🏆</span>
                                <span>
                                    <strong>Best</strong>
                                    <small>Best value</small>
                                </span>
                            </button>

                            <button
                                type="button"
                                className={`quick-sort-btn ${sortBy === "price-low" ? "active" : ""}`}
                                onClick={() => handleQuickSort("price-low")}
                            >
                                <span className="quick-sort-icon">💰</span>
                                <span>
                                    <strong>Cheapest</strong>
                                    <small>
                                        {sortStats.minPrice
                                            ? `₹${sortStats.minPrice.toLocaleString("en-IN")}`
                                            : "Lowest price"}
                                    </small>
                                </span>
                            </button>

                            <button
                                type="button"
                                className={`quick-sort-btn ${sortBy === "shortest" ? "active" : ""}`}
                                onClick={() => handleQuickSort("shortest")}
                            >
                                <span className="quick-sort-icon">⚡</span>
                                <span>
                                    <strong>Fastest</strong>
                                    <small>
                                        {sortStats.minDuration
                                            ? formatDurationDisplay(sortStats.minDuration)
                                            : "Shortest duration"}
                                    </small>
                                </span>
                            </button>
                        </div>

                        {/* ROUND TRIP TAB SWITCHER */}
                        {tripType === "round" && (
                            <div className="round-trip-tab-bar">
                                <button
                                    type="button"
                                    className={`round-trip-tab-btn ${activeTab === "departure" ? "active" : ""}`}
                                    onClick={() => setActiveTab("departure")}
                                >
                                    <span className="tab-icon">🛫</span>
                                    <div className="tab-info">
                                        <strong>1. Departure Flight</strong>
                                        <small>
                                            {fromDisplay ||
                                                searchData?.fromCity ||
                                                selectedFromCity?.cityName ||
                                                "Origin"}{" "}
                                            →{" "}
                                            {toDisplay ||
                                                searchData?.toCity ||
                                                selectedToCity?.cityName ||
                                                "Destination"}
                                        </small>
                                    </div>
                                    {selectedDeparture ? (
                                        <span className="tab-status-badge selected">
                                            ✓ {selectedDeparture.airline} ({selectedDeparture.departureTime})
                                        </span>
                                    ) : (
                                        <span className="tab-status-badge pending">
                                            Select Flight
                                        </span>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    className={`round-trip-tab-btn ${activeTab === "return" ? "active" : ""}`}
                                    onClick={() => setActiveTab("return")}
                                >
                                    <span className="tab-icon">🛬</span>
                                    <div className="tab-info">
                                        <strong>2. Return Flight</strong>
                                        <small>
                                            {toDisplay ||
                                                searchData?.toCity ||
                                                selectedToCity?.cityName ||
                                                "Destination"}{" "}
                                            →{" "}
                                            {fromDisplay ||
                                                searchData?.fromCity ||
                                                selectedFromCity?.cityName ||
                                                "Origin"}
                                        </small>
                                    </div>
                                    {selectedReturn ? (
                                        <span className="tab-status-badge selected">
                                            ✓ {selectedReturn.airline} ({selectedReturn.departureTime})
                                        </span>
                                    ) : (
                                        <span className="tab-status-badge pending">
                                            Select Flight
                                        </span>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* OUTBOUND FLIGHTS SECTION */}
                        {(tripType !== "round" || activeTab === "departure") && (
                            <section className="results-section">
                                <div className="section-heading">
                                    <div>
                                        <h2>
                                            {tripType === "round"
                                                ? "Departure Flights"
                                                : "Available Flights"}
                                        </h2>
                                        <p>
                                            {fromDisplay ||
                                                searchData?.fromCity ||
                                                searchData?.from ||
                                                selectedFromCity?.cityName ||
                                                selectedFromCity?.airportCode}
                                            {" → "}
                                            {toDisplay ||
                                                searchData?.toCity ||
                                                searchData?.to ||
                                                selectedToCity?.cityName ||
                                                selectedToCity?.airportCode}
                                            {" • "}
                                            {formatDate(searchData.departureDate)}
                                        </p>
                                    </div>
                                    <div className="results-count">
                                        {filteredDepartureFlights.length} flight
                                        {filteredDepartureFlights.length !== 1 ? "s" : ""} found
                                    </div>
                                </div>

                                {noDepartureFlights ? (
                                    <div className="filter-no-results">
                                        <div className="filter-no-results-icon">✈</div>
                                        <h3>No flights found</h3>
                                        <p>No flights match your selected filters.</p>
                                        <button type="button" onClick={handleClearAllFilters}>
                                            Reset All Filters
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flight-list">
                                        {filteredDepartureFlights.map((flight, index) =>
                                            renderFlightCard(flight, "departure", index)
                                        )}
                                    </div>
                                )}
                            </section>
                        )}

                        {/* RETURN FLIGHTS SECTION */}
                        {tripType === "round" && activeTab === "return" && (
                            <section className="results-section return-section">
                                <div className="section-heading">
                                    <div>
                                        <h2>Return Flights</h2>
                                        <p>
                                            {toDisplay ||
                                                searchData?.toCity ||
                                                searchData?.to ||
                                                selectedToCity?.cityName ||
                                                selectedToCity?.airportCode}
                                            {" → "}
                                            {fromDisplay ||
                                                searchData?.fromCity ||
                                                searchData?.from ||
                                                selectedFromCity?.cityName ||
                                                selectedFromCity?.airportCode}
                                            {" • "}
                                            {formatDate(searchData.returnDate)}
                                        </p>
                                    </div>
                                    <div className="results-count">
                                        {filteredReturnFlights.length} flight
                                        {filteredReturnFlights.length !== 1 ? "s" : ""} found
                                    </div>
                                </div>

                                {noReturnFlights ? (
                                    <div className="filter-no-results">
                                        <div className="filter-no-results-icon">✈</div>
                                        <h3>No return flights found</h3>
                                        <p>No return flights match your selected filters.</p>
                                        <button type="button" onClick={handleClearAllFilters}>
                                            Reset All Filters
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flight-list">
                                        {filteredReturnFlights.map((flight, index) =>
                                            renderFlightCard(flight, "return", index)
                                        )}
                                    </div>
                                )}
                            </section>
                        )}

                        {/* SELECTED SUMMARY STICKY BAR */}
                        {(selectedDeparture || selectedReturn) && (
                            <div
                                className="selected-summary selected-summary-sticky"
                                style={{
                                    position: "fixed",
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    zIndex: 9999,
                                    boxSizing: "border-box"
                                }}
                            >
                                <div className="summary-details-box">
                                    <div className="summary-heading-col">
                                        <strong>Your Selection</strong>
                                    </div>
                                    {selectedDeparture && (
                                        <span
                                            className="summary-flight-tag"
                                            onClick={() => setActiveTab("departure")}
                                            title="Click to view departure flight"
                                        >
                                            🛫 Outbound: {selectedDeparture.airline} {selectedDeparture.flightNumber} ({selectedDeparture.departureTime})
                                        </span>
                                    )}
                                    {tripType === "round" && !selectedReturn && (
                                        <span
                                            className="summary-flight-tag warning-tag"
                                            onClick={() => setActiveTab("return")}
                                        >
                                            🛬 Return flight not selected (Click to choose)
                                        </span>
                                    )}
                                    {selectedReturn && (
                                        <span
                                            className="summary-flight-tag"
                                            onClick={() => setActiveTab("return")}
                                            title="Click to view return flight"
                                        >
                                            🛬 Inbound: {selectedReturn.airline} {selectedReturn.flightNumber} ({selectedReturn.departureTime})
                                        </span>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    className="summary-continue-btn"
                                    onClick={handleContinue}
                                >
                                    {tripType === "round" && !selectedReturn
                                        ? "Select Return Flight →"
                                        : "Continue →"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* FARE TIER SELECTION MODAL */}
                {activeTierFlight && (
                    <FareTierModal
                        flight={activeTierFlight}
                        tripType={tripType}
                        isReturn={activeTierType === "return"}
                        onClose={() => setActiveTierFlight(null)}
                        onSelectTier={handleSelectTierFromModal}
                    />
                )}
            </div>
        </main>
    );
}

export default FlightResults;