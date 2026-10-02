
import React, {
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    useLocation,
    useNavigate,
} from "react-router-dom";
import { getBookingSession } from "../../utils/flightUtils";
import "./SeatSelection.css";

function SeatSelection() {
    const location = useLocation();
    const navigate = useNavigate();

    const activeState = location.state || getBookingSession()?.state || {};

    const {
        selectedDeparture,
        selectedReturn,
        searchData,
        selectedFromCity,
        selectedToCity,
        passengers = [],
        contactInfo,
        pricing,
    } = activeState;

    const [activePassenger, setActivePassenger] = useState(0);
    const [selectedSeats, setSelectedSeats] = useState(
        activeState.selectedSeats || {}
    );
    const [isReturnSeatMode, setIsReturnSeatMode] = useState(false);

    // =========================================================
    // DUFFEL SEAT MAP STATE
    // =========================================================

    const [seatMaps, setSeatMaps] = useState([]);
    const [isSeatMapLoading, setIsSeatMapLoading] = useState(false);
    const [seatMapError, setSeatMapError] = useState(null);

    // =========================================================
    // SESSION CHECK
    // =========================================================

    if (
        !searchData ||
        !selectedDeparture ||
        !passengers.length
    ) {
        return (
            <main className="seat-selection-page">
                <div className="seat-error-card">
                    <h2>Session Expired</h2>

                    <p>
                        We could not retrieve your passenger
                        and flight details. Please start again.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        Go to Search
                    </button>
                </div>
            </main>
        );
    }

    // =========================================================
    // CURRENT FLIGHT
    // =========================================================

    const currentFlight = isReturnSeatMode
        ? selectedReturn
        : selectedDeparture;

    const duffelOfferId =
        currentFlight?.duffelOfferId ||
        currentFlight?.offerId ||
        "";

    // =========================================================
    // FALLBACK AIRCRAFT SEAT MAP GENERATOR
    // =========================================================

    const generateFallbackSeatMap = (flight) => {
        const rows = [];
        const totalRows = 24;

        for (let r = 1; r <= totalRows; r++) {
            const leftElements = [];
            const rightElements = [];

            ["A", "B", "C"].forEach((col) => {
                const designator = `${r}${col}`;
                const isPremium = r <= 3;
                const isExit = r === 12 || r === 13;
                const price = isPremium ? 20 : isExit ? 15 : (col === "A" || col === "F") ? 10 : 0;
                // Periodic unavailable seats for realistic display
                const isOccupied = (r * 7 + col.charCodeAt(0)) % 7 === 0;

                leftElements.push({
                    type: "seat",
                    designator: designator,
                    name: `Seat ${designator}`,
                    available: !isOccupied,
                    available_services: isOccupied ? [] : [{
                        id: `srv_flb_${designator}_${flight?.id || "fl"}`,
                        total_amount: String(price),
                        total_currency: "USD",
                    }],
                });
            });

            ["D", "E", "F"].forEach((col) => {
                const designator = `${r}${col}`;
                const isPremium = r <= 3;
                const isExit = r === 12 || r === 13;
                const price = isPremium ? 20 : isExit ? 15 : (col === "A" || col === "F") ? 10 : 0;
                const isOccupied = (r * 11 + col.charCodeAt(0)) % 8 === 0;

                rightElements.push({
                    type: "seat",
                    designator: designator,
                    name: `Seat ${designator}`,
                    available: !isOccupied,
                    available_services: isOccupied ? [] : [{
                        id: `srv_flb_${designator}_${flight?.id || "fl"}`,
                        total_amount: String(price),
                        total_currency: "USD",
                    }],
                });
            });

            rows.push({
                sections: [
                    { elements: leftElements },
                    { elements: rightElements },
                ],
            });
        }

        return [{
            cabins: [{
                rows: rows,
            }],
        }];
    };

    // =========================================================
    // GET DUFFEL SEAT MAP
    // =========================================================

    useEffect(() => {
        let isMounted = true;

        const fetchSeatMap = async () => {
            try {
                setIsSeatMapLoading(true);
                setSeatMapError(null);
                setSeatMaps([]);

                if (!duffelOfferId) {
                    if (isMounted) {
                        setSeatMaps(generateFallbackSeatMap(currentFlight));
                        setIsSeatMapLoading(false);
                    }
                    return;
                }

                console.log(
                    "Fetching Duffel Seat Map for Offer ID:",
                    duffelOfferId
                );

                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/duffel/seat-map/${encodeURIComponent(
                        duffelOfferId
                    )}`
                );

                const responseText = await response.text();

                let data = null;
                if (response.ok && responseText && !responseText.startsWith("Duffel Error:")) {
                    try {
                        data = JSON.parse(responseText);
                    } catch (e) {
                        data = null;
                    }
                }

                console.log(
                    "Duffel Seat Map Response:",
                    data
                );

                let maps = [];

                if (Array.isArray(data)) {
                    maps = data;
                } else if (
                    data &&
                    Array.isArray(data.data)
                ) {
                    maps = data.data;
                } else if (
                    data &&
                    data.data &&
                    Array.isArray(data.data.seat_maps)
                ) {
                    maps = data.data.seat_maps;
                } else if (
                    data &&
                    Array.isArray(data.seat_maps)
                ) {
                    maps = data.seat_maps;
                }

                if (!isMounted) return;

                if (maps.length > 0) {
                    setSeatMaps(maps);
                } else {
                    console.log("No live seat map from Duffel, generating fallback aircraft layout.");
                    setSeatMaps(generateFallbackSeatMap(currentFlight));
                }
            } catch (error) {
                console.error(
                    "Duffel seat map error, using fallback layout:",
                    error
                );

                if (!isMounted) return;
                setSeatMaps(generateFallbackSeatMap(currentFlight));
            } finally {
                if (isMounted) {
                    setIsSeatMapLoading(false);
                }
            }
        };

        fetchSeatMap();

        return () => {
            isMounted = false;
        };
    }, [duffelOfferId, isReturnSeatMode, currentFlight]);

    // =========================================================
    // CURRENT PASSENGER KEY
    // =========================================================

    const passengerKey = isReturnSeatMode
        ? `${activePassenger}-return`
        : `${activePassenger}-departure`;

    const currentSelectedSeat =
        selectedSeats[passengerKey]?.designator || "";

    // =========================================================
    // EXTRACT DUFFEL SEATS
    // =========================================================

    const allDuffelSeats = useMemo(() => {
        const result = [];

        const addSeat = (element) => {
            if (
                !element ||
                typeof element !== "object"
            ) {
                return;
            }

            const designator =
                element.designator ||
                element.seat_designator ||
                "";

            if (
                designator &&
                (
                    element.type === "seat" ||
                    Array.isArray(element.available_services)
                )
            ) {
                result.push({
                    ...element,
                    designator,
                });
            }
        };

        seatMaps.forEach((seatMap) => {
            const cabins =
                seatMap?.cabins || [];

            cabins.forEach((cabin) => {
                const rows =
                    cabin?.rows || [];

                rows.forEach((row) => {
                    const sections =
                        row?.sections || [];

                    sections.forEach((section) => {
                        const elements =
                            section?.elements || [];

                        elements.forEach(addSeat);
                    });
                });
            });
        });

        // Remove duplicate seat numbers
        const uniqueSeats = new Map();

        result.forEach((seat) => {
            uniqueSeats.set(
                seat.designator,
                seat
            );
        });

        const finalSeats = Array.from(
            uniqueSeats.values()
        );

        console.log(
            "ALL DUFFEL SEATS:",
            finalSeats
        );

        return finalSeats;
    }, [seatMaps]);

    // =========================================================
    // GROUP SEATS INTO CABIN ROWS
    // =========================================================

    const seatRows = useMemo(() => {
        const rowMap = new Map();
        allDuffelSeats.forEach((seat) => {
            const designator = seat.designator || "";
            const match = designator.match(/^(\d+)([A-Z])$/i);
            const rowNum = match ? parseInt(match[1], 10) : 1;
            const colLetter = match ? match[2].toUpperCase() : designator;

            if (!rowMap.has(rowNum)) {
                rowMap.set(rowNum, {});
            }
            rowMap.get(rowNum)[colLetter] = seat;
        });

        const sortedRowNums = Array.from(rowMap.keys()).sort((a, b) => a - b);
        return sortedRowNums.map((rowNum) => ({
            rowNum,
            seats: rowMap.get(rowNum),
        }));
    }, [allDuffelSeats]);

    // =========================================================
    // GET AVAILABLE SERVICE
    // =========================================================

    const getAvailableService = (seat) => {
        if (!seat) {
            return null;
        }

        const services =
            Array.isArray(
                seat.available_services
            )
                ? seat.available_services
                : [];

        const passenger =
            passengers?.[activePassenger];

        const passengerId =
            passenger?.id ||
            passenger?.passengerId ||
            passenger?.duffelPassengerId;

        if (passengerId && services.length > 0) {
            const matchingService =
                services.find(
                    (service) =>
                        service?.passenger_id ===
                        passengerId
                );

            if (matchingService) {
                return matchingService;
            }
        }

        if (services.length > 0) {
            return services[0];
        }

        return {
            id: `srv_${seat.designator}`,
            total_amount: "0",
            total_currency: "USD",
        };
    };

    // =========================================================
    // SEAT AVAILABLE
    // =========================================================

    const isSeatAvailable = (seat) => {
        if (!seat) {
            return false;
        }

        const type =
            String(
                seat.type ||
                seat.status ||
                seat.availability ||
                ""
            ).toLowerCase();

        if (
            type.includes("unavailable") ||
            type.includes("occupied") ||
            type.includes("blocked")
        ) {
            return false;
        }

        if (
            seat.available === false ||
            seat.is_available === false
        ) {
            return false;
        }

        return true;
    };

    // =========================================================
    // GET SEAT PRICE
    // =========================================================

    const getSeatPrice = (seat) => {
        if (!seat) {
            return 0;
        }

        const service =
            getAvailableService(seat);

        if (!service) {
            return 0;
        }

        /*
         * Duffel:
         *
         * available_services[0].total_amount
         */

        const amount =
            Number(
                service.total_amount || 0
            );

        return Number.isFinite(amount)
            ? amount
            : 0;
    };

    // =========================================================
    // GET SEAT CURRENCY
    // =========================================================

    const getSeatCurrency = (seat) => {
        if (!seat) {
            return "";
        }

        const service =
            getAvailableService(seat);

        return (
            service?.total_currency ||
            ""
        );
    };

    // =========================================================
    // TOTAL SEAT CHARGES
    // =========================================================

    const totalSeatCharges =
        Object.values(selectedSeats)
            .reduce(
                (total, selectedSeat) => {
                    if (
                        !selectedSeat ||
                        !selectedSeat.designator
                    ) {
                        return total;
                    }

                    /*
                     * We already saved the actual
                     * Duffel price at selection time.
                     *
                     * Therefore use selectedSeat.price
                     * directly.
                     */

                    const savedPrice =
                        Number(
                            selectedSeat.price || 0
                        );

                    return total + savedPrice;
                },
                0
            );

    // =========================================================
    // PASSENGER SEAT
    // =========================================================

    const getPassengerSeat = (index) => {
        const key = isReturnSeatMode
            ? `${index}-return`
            : `${index}-departure`;

        return (
            selectedSeats[key]
                ?.designator || ""
        );
    };

    // =========================================================
    // SELECT SEAT
    // =========================================================

    const handleSeatSelect = (seat) => {
        if (!seat) {
            return;
        }

        if (!isSeatAvailable(seat)) {
            return;
        }

        const seatNumber =
            seat.designator;

        const service =
            getAvailableService(seat);

        const price =
            getSeatPrice(seat);

        const currency =
            getSeatCurrency(seat);

        if (!service) {
            return;
        }

        const seatData = {
            designator: seatNumber,
            serviceId: service?.id || null,
            price: price,
            currency: currency,
        };

        setSelectedSeats((prev) => ({
            ...prev,

            [passengerKey]:
                prev[passengerKey]
                    ?.designator === seatNumber
                    ? null
                    : seatData,
        }));

        console.log(
            "SELECTED SEAT:",
            {
                seat: seatNumber,
                price: price,
                currency: currency,
                serviceId: service?.id,
            }
        );
    };

    // =========================================================
    // SAVE AND RETURN TO REVIEW
    // =========================================================

    const handleContinue = () => {
        console.log(
            "Selected Seats:",
            selectedSeats
        );

        console.log(
            "Total Seat Charges:",
            totalSeatCharges
        );

        navigate("/booking-review", {
            state: {
                ...location.state,
                selectedSeats,
                totalSeatCharges,
            },
        });
    };

    // =========================================================
    // SKIP SEATS (FREE AUTO-ASSIGNED)
    // =========================================================

    const handleSkipSeats = () => {
        navigate("/booking-review", {
            state: {
                ...location.state,
                selectedSeats: {},
                totalSeatCharges: 0,
            },
        });
    };

    // =========================================================
    // BACK TO REVIEW
    // =========================================================

    const handleBackToReview = () => {
        navigate("/booking-review", {
            state: {
                ...location.state,
            },
        });
    };

    // =========================================================
    // RENDER DUFFEL SEAT
    // =========================================================

    const renderDuffelSeat = (seat) => {
        const seatNumber =
            seat?.designator;

        if (!seatNumber) {
            return null;
        }

        const available =
            isSeatAvailable(seat);

        const selected =
            currentSelectedSeat ===
            seatNumber;

        const price =
            getSeatPrice(seat);

        const currency =
            getSeatCurrency(seat);

        return (
            <button
                key={seatNumber}
                type="button"
                disabled={!available}
                className={[
                    "aircraft-seat",

                    !available
                        ? "seat-occupied"
                        : "",

                    selected
                        ? "seat-selected"
                        : "",
                ]
                    .filter(Boolean)
                    .join(" ")}

                onClick={() =>
                    handleSeatSelect(seat)
                }

                title={
                    !available
                        ? `Seat ${seatNumber} - Unavailable`
                        : price > 0
                            ? `Seat ${seatNumber} - ${currency} ${price}`
                            : `Seat ${seatNumber} - Free`
                }
            >
                <span>
                    {seatNumber}
                </span>

                {available && (
                    <small>
                        {price > 0
                            ? `${currency} ${price}`
                            : "Free"}
                    </small>
                )}

                {!available && (
                    <small>
                        Unavailable
                    </small>
                )}
            </button>
        );
    };

    // =========================================================
    // RENDER SEAT MAP
    // =========================================================

    const renderSeatMap = () => {
        if (isSeatMapLoading) {
            return (
                <div className="filter-no-results">

                    <div className="filter-no-results-icon">
                        ✈
                    </div>

                    <h3>
                        Loading Seat Map...
                    </h3>

                    <p>
                        Please wait while we fetch
                        available seats from the airline.
                    </p>

                </div>
            );
        }

        if (seatMapError) {
            return (
                <div className="filter-no-results">

                    <div className="filter-no-results-icon">
                        ⚠️
                    </div>

                    <h3>
                        Seat Map Unavailable
                    </h3>

                    <p>
                        {seatMapError}
                    </p>

                    <small>
                        Offer ID: {duffelOfferId}
                    </small>

                </div>
            );
        }

        if (allDuffelSeats.length === 0) {
            return (
                <div className="filter-no-results">

                    <div className="filter-no-results-icon">
                        ✈
                    </div>

                    <h3>
                        No Seats Available
                    </h3>

                    <p>
                        This flight does not currently
                        provide a seat map.
                    </p>

                </div>
            );
        }

        return (
            <div className="aircraft-wrapper">

                <div className="aircraft-body">

                    <div className="cockpit">

                        <div className="cockpit-window"></div>

                        <span>
                            FRONT
                        </span>

                    </div>

                    <div className="seat-map">

                        {seatRows.map(({ rowNum, seats }) => (
                            <div className="seat-row" key={rowNum}>
                                <span className="row-number">{rowNum}</span>
                                <div className="seat-group">
                                    {["A", "B", "C"].map((col) => {
                                        const seat = seats[col];
                                        return seat ? (
                                            renderDuffelSeat(seat)
                                        ) : (
                                            <div key={col} className="seat-placeholder" style={{ width: 32, height: 31 }} />
                                        );
                                    })}
                                </div>
                                <span className="seat-aisle"></span>
                                <div className="seat-group">
                                    {["D", "E", "F"].map((col) => {
                                        const seat = seats[col];
                                        return seat ? (
                                            renderDuffelSeat(seat)
                                        ) : (
                                            <div key={col} className="seat-placeholder" style={{ width: 32, height: 31 }} />
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                    </div>

                    <div className="aircraft-back">

                        <span>
                            REAR
                        </span>

                    </div>

                </div>

            </div>
        );
    };

    // =========================================================
    // PAGE
    // =========================================================

    return (
        <main className="seat-selection-page">

            {/* PROGRESS */}

            <div className="seat-progress-container">

                <div className="seat-progress">

                    <div className="seat-progress-step completed">
                        <div className="seat-progress-number">
                            ✓
                        </div>
                        <span>
                            Flight Selection
                        </span>
                    </div>

                    <div className="seat-progress-line completed-line"></div>

                    <div className="seat-progress-step completed">
                        <div className="seat-progress-number">
                            ✓
                        </div>
                        <span>
                            Traveler Details
                        </span>
                    </div>

                    <div className="seat-progress-line active-line"></div>

                    <div className="seat-progress-step active">
                        <div className="seat-progress-number">
                            3
                        </div>
                        <span>
                            Review & Customise (Seats)
                        </span>
                    </div>

                    <div className="seat-progress-line"></div>

                    <div className="seat-progress-step">
                        <div className="seat-progress-number">
                            4
                        </div>
                        <span>
                            Payment
                        </span>
                    </div>

                </div>

            </div>

            {/* HEADER */}

            <div className="seat-page-header">

                <h1>
                    Select Your Seat
                </h1>

                <p>
                    Choose your preferred seat for each
                    passenger.
                </p>

            </div>

            {/* MAIN */}

            <div className="seat-layout-container">

                {/* LEFT */}

                <section className="seat-main-section">

                    {/* PASSENGERS */}

                    <div className="seat-card">

                        <h2>
                            Passengers
                        </h2>

                        <div className="passenger-seat-tabs">

                            {passengers.map(
                                (
                                    passenger,
                                    index
                                ) => (

                                    <button
                                        key={index}
                                        type="button"

                                        className={
                                            activePassenger ===
                                                index
                                                ? "passenger-seat-tab active"
                                                : "passenger-seat-tab"
                                        }

                                        onClick={() =>
                                            setActivePassenger(
                                                index
                                            )
                                        }
                                    >

                                        <span className="tab-person-icon">
                                            👤
                                        </span>

                                        <span>
                                            {
                                                passenger.label
                                            }
                                        </span>

                                        {getPassengerSeat(
                                            index
                                        ) && (

                                                <span className="tab-seat-number">

                                                    {
                                                        getPassengerSeat(
                                                            index
                                                        )
                                                    }

                                                </span>
                                            )}

                                    </button>
                                )
                            )}

                        </div>

                    </div>

                    {/* RETURN / DEPARTURE */}

                    {selectedReturn && (

                        <div className="trip-seat-switch">

                            <button
                                type="button"

                                className={
                                    !isReturnSeatMode
                                        ? "trip-switch active"
                                        : "trip-switch"
                                }

                                onClick={() =>
                                    setIsReturnSeatMode(
                                        false
                                    )
                                }
                            >
                                Departure
                            </button>

                            <button
                                type="button"

                                className={
                                    isReturnSeatMode
                                        ? "trip-switch active"
                                        : "trip-switch"
                                }

                                onClick={() =>
                                    setIsReturnSeatMode(
                                        true
                                    )
                                }
                            >
                                Return
                            </button>

                        </div>
                    )}

                    {/* FLIGHT INFO */}

                    <div className="seat-card flight-seat-info">

                        <div>

                            <span className="seat-flight-label">

                                {isReturnSeatMode
                                    ? "RETURN FLIGHT"
                                    : "DEPARTURE FLIGHT"}

                            </span>

                            <h3>

                                {currentFlight?.airline ||
                                    "Airline"}

                                {" "}

                                (
                                {currentFlight?.flightNumber ||
                                    "Flight"}
                                )

                            </h3>

                        </div>

                        <div className="seat-route-info">

                            <strong>
                                {currentFlight?.from ||
                                    (!isReturnSeatMode
                                        ? (searchData?.fromCity || searchData?.from || selectedFromCity?.airportCode || selectedFromCity?.cityName)
                                        : (searchData?.toCity || searchData?.to || selectedToCity?.airportCode || selectedToCity?.cityName)) ||
                                    "—"}
                            </strong>

                            <span>
                                →
                            </span>

                            <strong>
                                {currentFlight?.to ||
                                    (!isReturnSeatMode
                                        ? (searchData?.toCity || searchData?.to || selectedToCity?.airportCode || selectedToCity?.cityName)
                                        : (searchData?.fromCity || searchData?.from || selectedFromCity?.airportCode || selectedFromCity?.cityName)) ||
                                    "—"}
                            </strong>

                        </div>

                    </div>

                    {/* AIRCRAFT */}

                    <div className="seat-card aircraft-card">

                        <div className="aircraft-title">

                            <div>

                                <h2>
                                    Aircraft Seat Map
                                </h2>

                                <p>

                                    Select a seat for{" "}

                                    <strong>
                                        {
                                            passengers[
                                                activePassenger
                                            ].label
                                        }
                                    </strong>

                                </p>

                            </div>

                        </div>

                        {/* LEGEND */}

                        <div className="seat-legend">

                            <div className="legend-item">

                                <span className="legend-seat available"></span>

                                Available

                            </div>

                            <div className="legend-item">

                                <span className="legend-seat selected"></span>

                                Selected

                            </div>

                            <div className="legend-item">

                                <span className="legend-seat occupied"></span>

                                Unavailable

                            </div>

                        </div>

                        {renderSeatMap()}

                    </div>

                </section>

                {/* RIGHT SUMMARY */}

                <aside className="seat-summary-section">

                    {/* SELECTED SEATS */}

                    <div className="seat-summary-card">

                        <h3>
                            Seat Selection
                        </h3>

                        {passengers.map(
                            (
                                passenger,
                                index
                            ) => {

                                const departureSeat =
                                    selectedSeats[
                                    `${index}-departure`
                                    ];

                                const returnSeat =
                                    selectedSeats[
                                    `${index}-return`
                                    ];

                                const departurePrice =
                                    departureSeat
                                        ? Number(
                                            departureSeat.price ||
                                            0
                                        )
                                        : 0;

                                const returnPrice =
                                    returnSeat
                                        ? Number(
                                            returnSeat.price ||
                                            0
                                        )
                                        : 0;

                                const passengerCost =
                                    departurePrice +
                                    returnPrice;

                                return (
                                    <div
                                        className="selected-passenger-row"
                                        key={index}
                                    >

                                        <div>

                                            <strong>
                                                {
                                                    passenger.label
                                                }
                                            </strong>

                                            <span>

                                                {departureSeat
                                                    ? `Departure: ${departureSeat.designator}`
                                                    : "Departure: Not selected"}

                                                {selectedReturn &&
                                                    ` • ${returnSeat
                                                        ? `Return: ${returnSeat.designator}`
                                                        : "Return: Not selected"
                                                    }`}

                                            </span>

                                        </div>

                                        <span className="mini-seat-price">

                                            {passengerCost > 0
                                                ? `${departureSeat?.currency || returnSeat?.currency || "USD"} ${passengerCost.toLocaleString(
                                                    "en-IN"
                                                )}`
                                                : "USD 0"}

                                        </span>

                                    </div>
                                );
                            }
                        )}

                    </div>

                    {/* PRICE */}

                    <div className="seat-summary-card">

                        <h3>
                            Price Details
                        </h3>

                        <div className="seat-price-row">

                            <span>
                                Flight Fare
                            </span>

                            <span>
                                $
                                {Number(
                                    pricing?.grandTotalPrice ||
                                    0
                                ).toLocaleString(
                                    "en-US",
                                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                                )}
                            </span>

                        </div>

                        <div className="seat-price-row">

                            <span>
                                Seat Charges
                            </span>

                            <span>
                                $
                                {totalSeatCharges.toLocaleString(
                                    "en-US",
                                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                                )}
                            </span>

                        </div>

                        <hr />

                        <div className="seat-total-row">

                            <span>
                                Current Total
                            </span>

                            <strong>
                                $
                                {(
                                    Number(pricing?.grandTotalPrice || 0) + totalSeatCharges
                                ).toLocaleString(
                                    "en-US",
                                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                                )}
                            </strong>

                        </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="seat-action-buttons">
                        <button
                            type="button"
                            className="continue-addons-btn"
                            onClick={handleContinue}
                        >
                            Save & Return to Review
                            <span>
                                →
                            </span>
                        </button>

                        <button
                            type="button"
                            className="skip-seats-btn"
                            onClick={handleSkipSeats}
                        >
                            Skip & Use Free Auto-Assigned Seats
                        </button>

                        <button
                            type="button"
                            className="back-review-btn"
                            onClick={handleBackToReview}
                        >
                            ← Back to Review
                        </button>
                    </div>

                </aside>

            </div>

        </main>
    );
}

export default SeatSelection;
