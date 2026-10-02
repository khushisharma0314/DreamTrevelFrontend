import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FlightForm.css";

function FlightForm() {
  const navigate = useNavigate();

  // =========================================================
  // BASIC FORM STATES
  // =========================================================

  const getSavedSearchForm = () => {
    try {
      const saved = sessionStorage.getItem("flight_search_form_data");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  };

  const initialSearchData = getSavedSearchForm();

  const [tripType, setTripType] = useState(initialSearchData?.tripType || "round");

  const [fromCity, setFromCity] = useState(initialSearchData?.fromCity || "");
  const [toCity, setToCity] = useState(initialSearchData?.toCity || "");

  const [selectedFromCity, setSelectedFromCity] = useState(initialSearchData?.selectedFromCity || null);
  const [selectedToCity, setSelectedToCity] = useState(initialSearchData?.selectedToCity || null);

  const [departureDate, setDepartureDate] = useState(initialSearchData?.departureDate || "");
  const [returnDate, setReturnDate] = useState(initialSearchData?.returnDate || "");

  const [adults, setAdults] = useState(initialSearchData?.adults ?? 1);
  const [children, setChildren] = useState(initialSearchData?.children ?? 0);
  const [infants, setInfants] = useState(initialSearchData?.infants ?? 0);

  const [flightClass, setFlightClass] = useState(initialSearchData?.flightClass || "Economy");

  useEffect(() => {
    try {
      const payload = {
        tripType,
        fromCity,
        toCity,
        selectedFromCity,
        selectedToCity,
        departureDate,
        returnDate,
        adults,
        children,
        infants,
        flightClass,
      };
      sessionStorage.setItem("flight_search_form_data", JSON.stringify(payload));
    } catch (e) {
      // ignore
    }
  }, [
    tripType,
    fromCity,
    toCity,
    selectedFromCity,
    selectedToCity,
    departureDate,
    returnDate,
    adults,
    children,
    infants,
    flightClass,
  ]);

  const [showTravelerDropdown, setShowTravelerDropdown] =
    useState(false);

  // =========================================================
  // CITY SUGGESTIONS
  // =========================================================

  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  const [showFromSuggestions, setShowFromSuggestions] =
    useState(false);

  const [showToSuggestions, setShowToSuggestions] =
    useState(false);

  const [loadingFrom, setLoadingFrom] = useState(false);
  const [loadingTo, setLoadingTo] = useState(false);

  // =========================================================
  // SEARCH LOADING
  // =========================================================

  const [searchingFlights, setSearchingFlights] = useState(false);

  // =========================================================
  // DATE & AUTOCOMPLETE REFS
  // =========================================================

  const fromAbortControllerRef = useRef(null);
  const toAbortControllerRef = useRef(null);
  const fromDebounceTimerRef = useRef(null);
  const toDebounceTimerRef = useRef(null);

  // =========================================================
  // CUSTOM CALENDAR STATES
  // =========================================================

  const [showDepartCalendar, setShowDepartCalendar] = useState(false);
  const [showReturnCalendar, setShowReturnCalendar] = useState(false);
  const [departCalendarMonth, setDepartCalendarMonth] = useState(new Date());
  const [returnCalendarMonth, setReturnCalendarMonth] = useState(new Date());

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const monthsList = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = (setter) => {
    setter((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = (setter) => {
    setter((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const isPrevMonthDisabled = (currentMonth) => {
    const todayDate = new Date();
    return (
      currentMonth.getFullYear() < todayDate.getFullYear() ||
      (currentMonth.getFullYear() === todayDate.getFullYear() &&
        currentMonth.getMonth() <= todayDate.getMonth())
    );
  };

  const generateCalendarDays = (monthDate, selectedDateStr, minDateStr, onSelect) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(<div key={`empty-${i}`} className="cal-day empty" />);
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const isPast = minDateStr ? dateStr < minDateStr : dateStr < today;
      const isSelected = dateStr === selectedDateStr;
      const isToday = dateStr === today;
      const isInRange =
        tripType === "round" &&
        departureDate &&
        returnDate &&
        dateStr > departureDate &&
        dateStr < returnDate;

      cells.push(
        <button
          key={dateStr}
          type="button"
          disabled={isPast}
          className={`cal-day ${isPast ? "disabled" : ""} ${isSelected ? "selected" : ""} ${isToday ? "today" : ""} ${isInRange ? "in-range" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            if (!isPast) {
              onSelect(dateStr);
            }
          }}
        >
          {d}
        </button>
      );
    }

    return cells;
  };

  // =========================================================
  // TODAY
  // =========================================================

  const today = new Date().toISOString().split("T")[0];

  // =========================================================
  // DEFAULT DATES
  // =========================================================

  useEffect(() => {
    const todayDate = new Date();

    const departure = new Date(todayDate);
    departure.setDate(departure.getDate() + 1);

    const returnD = new Date(todayDate);
    returnD.setDate(returnD.getDate() + 5);

    const formatForInput = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    setDepartureDate(formatForInput(departure));
    setReturnDate(formatForInput(returnD));
    setDepartCalendarMonth(new Date(departure));
    setReturnCalendarMonth(new Date(returnD));
  }, []);

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) {
      return "Pick a date";
    }

    const d = new Date(dateStr + "T00:00:00");

    if (isNaN(d.getTime())) {
      return "Pick a date";
    }

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

    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };

  // =========================================================
  // CHANGE TRIP TYPE
  // =========================================================

  const handleTripTypeChange = (type) => {
    setTripType(type);

    if (type === "oneway") {
      setReturnDate("");
      setShowReturnCalendar(false);
    } else if (!returnDate) {
      const date = new Date();

      date.setDate(date.getDate() + 5);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      const newReturn = `${year}-${month}-${day}`;
      setReturnDate(newReturn);
      setReturnCalendarMonth(new Date(newReturn + "T00:00:00"));
    }
  };

  // =========================================================
  // SWAP FROM / TO
  // =========================================================

  const handleSwap = () => {
    if (fromDebounceTimerRef.current)
      clearTimeout(fromDebounceTimerRef.current);

    if (toDebounceTimerRef.current)
      clearTimeout(toDebounceTimerRef.current);

    if (fromAbortControllerRef.current)
      fromAbortControllerRef.current.abort();

    if (toAbortControllerRef.current)
      toAbortControllerRef.current.abort();

    const temp = fromCity;
    const tempSelected = selectedFromCity;

    setFromCity(toCity);
    setToCity(temp);

    setSelectedFromCity(selectedToCity);
    setSelectedToCity(tempSelected);

    setFromSuggestions([]);
    setToSuggestions([]);

    setShowFromSuggestions(false);
    setShowToSuggestions(false);
  };

  // =========================================================
  // TOTAL TRAVELERS
  // =========================================================

  const totalTravelers = adults + children + infants;

  const travelerText =
    totalTravelers === 1
      ? "1 TRAVELER"
      : `${totalTravelers} TRAVELERS`;

  // =========================================================
  // ADULT COUNTER
  // =========================================================

  const increaseAdults = () => {
    if (adults < 9) {
      setAdults((prev) => prev + 1);
    }
  };

  const decreaseAdults = () => {
    if (adults > 1) {
      setAdults((prev) => prev - 1);
    }
  };

  // =========================================================
  // CHILD COUNTER
  // =========================================================

  const increaseChildren = () => {
    if (children < 9) {
      setChildren((prev) => prev + 1);
    }
  };

  const decreaseChildren = () => {
    if (children > 0) {
      setChildren((prev) => prev - 1);
    }
  };

  // =========================================================
  // INFANT COUNTER
  // =========================================================

  const increaseInfants = () => {
    if (infants < 9) {
      setInfants((prev) => prev + 1);
    }
  };

  const decreaseInfants = () => {
    if (infants > 0) {
      setInfants((prev) => prev - 1);
    }
  };

  // =========================================================
  // CLOSE TRAVELER DROPDOWN
  // =========================================================

  const closeTravelerDropdown = () => {
    setShowTravelerDropdown(false);
  };

  // =========================================================
  // LOCATION DISPLAY
  // =========================================================

  const getLocationDisplayName = (location) => {
    if (typeof location === "string") {
      return location;
    }

    if (!location) {
      return "";
    }

    if (location.cityName && location.airportCode) {
      return `${location.cityName} (${location.airportCode})`;
    }

    if (location.cityName) {
      return location.cityName;
    }

    if (location.airportName) {
      return location.airportName;
    }

    return "";
  };

  // =========================================================
  // CITY SEARCH WITH DEBOUNCE & ABORT CONTROLLER
  // GET /api/cities/search?keyword=delhi
  // =========================================================

  const searchCities = async (query, type) => {
    const trimmedQuery = (query || "").trim();

    if (!trimmedQuery) {
      if (type === "from") {
        setFromSuggestions([]);
        setShowFromSuggestions(false);
        setLoadingFrom(false);
      } else {
        setToSuggestions([]);
        setShowToSuggestions(false);
        setLoadingTo(false);
      }
      return;
    }

    if (type === "from") {
      if (fromAbortControllerRef.current) {
        fromAbortControllerRef.current.abort();
      }

      fromAbortControllerRef.current = new AbortController();

      setLoadingFrom(true);
      setShowFromSuggestions(true);
    } else {
      if (toAbortControllerRef.current) {
        toAbortControllerRef.current.abort();
      }

      toAbortControllerRef.current = new AbortController();

      setLoadingTo(true);
      setShowToSuggestions(true);
    }

    const currentController =
      type === "from"
        ? fromAbortControllerRef.current
        : toAbortControllerRef.current;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/cities/search?keyword=${encodeURIComponent(
          trimmedQuery
        )}`,
        { signal: currentController.signal }
      );

      if (!response.ok) {
        throw new Error(
          `City search failed: ${response.status}`
        );
      }

      const data = await response.json();

      console.log("CITY SEARCH RESPONSE:", data);

      if (!Array.isArray(data)) {
        throw new Error("Invalid city search response");
      }

      if (type === "from") {
        setFromSuggestions(data);
      } else {
        setToSuggestions(data);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("City search error:", error);

        if (type === "from") {
          setFromSuggestions([]);
        } else {
          setToSuggestions([]);
        }
      }
    } finally {
      if (type === "from") {
        setLoadingFrom(false);
      } else {
        setLoadingTo(false);
      }
    }
  };

  // =========================================================
  // FROM INPUT WITH DEBOUNCE (300ms)
  // =========================================================

  const handleFromChange = (e) => {
    const value = e.target.value;

    setFromCity(value);
    setSelectedFromCity(null);

    if (fromDebounceTimerRef.current) {
      clearTimeout(fromDebounceTimerRef.current);
    }

    if (!value.trim()) {
      setFromSuggestions([]);
      setShowFromSuggestions(false);
      setLoadingFrom(false);
      return;
    }

    setShowFromSuggestions(true);
    setLoadingFrom(true);

    fromDebounceTimerRef.current = setTimeout(() => {
      searchCities(value, "from");
    }, 300);
  };

  // =========================================================
  // TO INPUT WITH DEBOUNCE (300ms)
  // =========================================================

  const handleToChange = (e) => {
    const value = e.target.value;

    setToCity(value);
    setSelectedToCity(null);

    if (toDebounceTimerRef.current) {
      clearTimeout(toDebounceTimerRef.current);
    }

    if (!value.trim()) {
      setToSuggestions([]);
      setShowToSuggestions(false);
      setLoadingTo(false);
      return;
    }

    setShowToSuggestions(true);
    setLoadingTo(true);

    toDebounceTimerRef.current = setTimeout(() => {
      searchCities(value, "to");
    }, 300);
  };

  // =========================================================
  // SELECT FROM CITY
  // =========================================================

  const selectFromCity = (city) => {
    if (!city?.airportCode) {
      alert("Selected location does not have an airport code.");
      return;
    }

    if (fromDebounceTimerRef.current) {
      clearTimeout(fromDebounceTimerRef.current);
    }

    setSelectedFromCity(city);
    setFromCity(getLocationDisplayName(city));

    setFromSuggestions([]);
    setShowFromSuggestions(false);
  };

  // =========================================================
  // SELECT TO CITY
  // =========================================================

  const selectToCity = (city) => {
    if (!city?.airportCode) {
      alert("Selected location does not have an airport code.");
      return;
    }

    if (toDebounceTimerRef.current) {
      clearTimeout(toDebounceTimerRef.current);
    }

    setSelectedToCity(city);
    setToCity(getLocationDisplayName(city));

    setToSuggestions([]);
    setShowToSuggestions(false);
  };

  // =========================================================
  // CLOSE SUGGESTIONS OUTSIDE CLICK & CLEANUP
  // =========================================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        !event.target.closest(
          ".location-autocomplete-wrapper"
        ) &&
        !event.target.closest(
          ".mobile-autocomplete-wrapper"
        )
      ) {
        setShowFromSuggestions(false);
        setShowToSuggestions(false);
      }

      if (
        !event.target.closest(".fieldset-date") &&
        !event.target.closest(".custom-calendar-popup") &&
        !event.target.closest(".mobile-date-wrapper") &&
        !event.target.closest(".mobile-box-cell")
      ) {
        setShowDepartCalendar(false);
        setShowReturnCalendar(false);
      }

      if (
        !event.target.closest(".traveler-selector") &&
        !event.target.closest(".traveler-dropdown") &&
        !event.target.closest(".mobile-pax-button") &&
        !event.target.closest(".mobile-traveler-dropdown")
      ) {
        setShowTravelerDropdown(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

      if (fromDebounceTimerRef.current)
        clearTimeout(fromDebounceTimerRef.current);

      if (toDebounceTimerRef.current)
        clearTimeout(toDebounceTimerRef.current);

      if (fromAbortControllerRef.current)
        fromAbortControllerRef.current.abort();

      if (toAbortControllerRef.current)
        toAbortControllerRef.current.abort();
    };
  }, []);

  // =========================================================
  // SEARCH FLIGHTS WITH DUFFEL
  // =========================================================

  const handleSearchFlight = async () => {
    // -------------------------------------------------------
    // VALIDATION
    // -------------------------------------------------------

    if (!selectedFromCity?.airportCode) {
      alert(
        "Please select Flight From from the suggestion list."
      );
      return;
    }

    if (!selectedToCity?.airportCode) {
      alert(
        "Please select Flight To from the suggestion list."
      );
      return;
    }

    if (
      selectedFromCity.airportCode.toUpperCase() ===
      selectedToCity.airportCode.toUpperCase()
    ) {
      alert(
        "Flight From and Flight To cannot be the same."
      );
      return;
    }

    if (!departureDate) {
      alert("Please select departure date.");
      return;
    }

    if (departureDate < today) {
      alert("Departure date cannot be in the past.");
      return;
    }

    if (tripType === "round" && !returnDate) {
      alert("Please select return date.");
      return;
    }

    if (
      tripType === "round" &&
      returnDate < departureDate
    ) {
      alert(
        "Return date cannot be before departure date."
      );
      return;
    }

    // -------------------------------------------------------
    // DUFFEL REQUEST
    // -------------------------------------------------------

    const duffelRequest = {
      from: selectedFromCity.airportCode.toUpperCase(),
      to: selectedToCity.airportCode.toUpperCase(),
      departureDate: departureDate,
      returnDate:
        tripType === "oneway"
          ? null
          : returnDate,
      adults: Number(adults) || 1,
      children: Number(children) || 0,
      infants: Number(infants) || 0,
      cabinClass: flightClass,
      flightClass: flightClass
    };

    console.log(
      "DUFFEL SEARCH REQUEST:",
      duffelRequest
    );

    // -------------------------------------------------------
    // NAVIGATE IMMEDIATELY TO FLIGHT RESULTS
    // -------------------------------------------------------

    navigate("/flight-results", {
      state: {
        tripType,

        searchData: {
          ...duffelRequest,
          fromCity: selectedFromCity.airportCode.toUpperCase(),
          toCity: selectedToCity.airportCode.toUpperCase(),
          from: selectedFromCity.airportCode.toUpperCase(),
          to: selectedToCity.airportCode.toUpperCase(),
        },

        selectedFromCity,

        selectedToCity,

        fromDisplay: fromCity,

        toDisplay: toCity
      }
    });
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <section
      className="flight-section"
      id="flight-search"
    >
      <div className="flight-container">

        {/* =====================================================
            DESKTOP FORM
        ===================================================== */}

        <div className="desktop-flight-form">

          <div className="hero-form-tabs" role="tablist" aria-label="Search type">
            <span className="hero-form-tab is-active" role="tab" aria-selected="true">
              Flights
            </span>
          </div>

          {/* TOP BAR */}

          <div className="form-top-bar">

            {/* TRIP TYPE */}

            <div className="top-selector-item">

              <span className="selector-icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
              </span>

              <select
                value={tripType}
                onChange={(e) =>
                  handleTripTypeChange(
                    e.target.value
                  )
                }
                className="top-select trip-select"
              >
                <option value="round">
                  ROUND TRIP
                </option>

                <option value="oneway">
                  ONE WAY
                </option>
              </select>

            </div>

            {/* TRAVELER */}

            <div className="top-selector-item traveler-selector">

              <button
                type="button"
                className="traveler-main-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTravelerDropdown((prev) => !prev);
                  setShowDepartCalendar(false);
                  setShowReturnCalendar(false);
                  setShowFromSuggestions(false);
                  setShowToSuggestions(false);
                }}
              >
                <span className="selector-icon traveler-icon">

                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>

                </span>

                <span className="traveler-main-text">
                  {travelerText}
                </span>

                <span className="traveler-arrow">
                  ▾
                </span>
              </button>

              {showTravelerDropdown && (
                <div className="traveler-dropdown" onClick={(e) => e.stopPropagation()}>

                  {/* HEADER */}
                  <div className="traveler-dropdown-header">
                    <span className="traveler-dropdown-title">Select Travelers</span>
                    <button
                      type="button"
                      className="traveler-header-close-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowTravelerDropdown(false);
                      }}
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>

                  {/* ADULT */}

                  <div className="traveler-option">

                    <div className="traveler-option-left">
                      <span className="traveler-option-title">
                        Adult
                      </span>

                      <span className="traveler-option-subtitle">
                        12+ years
                      </span>
                    </div>

                    <div className="traveler-counter">

                      <button
                        type="button"
                        className="counter-button"
                        onClick={decreaseAdults}
                      >
                        −
                      </button>

                      <span className="counter-number">
                        {adults}
                      </span>

                      <button
                        type="button"
                        className="counter-button"
                        onClick={increaseAdults}
                      >
                        +
                      </button>

                    </div>

                  </div>

                  {/* CHILD */}

                  <div className="traveler-option">

                    <div className="traveler-option-left">

                      <span className="traveler-option-title">
                        Child
                      </span>

                      <span className="traveler-option-subtitle">
                        2–11 years
                      </span>

                    </div>

                    <div className="traveler-counter">

                      <button
                        type="button"
                        className="counter-button"
                        onClick={decreaseChildren}
                      >
                        −
                      </button>

                      <span className="counter-number">
                        {children}
                      </span>

                      <button
                        type="button"
                        className="counter-button"
                        onClick={increaseChildren}
                      >
                        +
                      </button>

                    </div>

                  </div>

                  {/* INFANT */}

                  <div className="traveler-option">

                    <div className="traveler-option-left">

                      <span className="traveler-option-title">
                        Infant
                      </span>

                      <span className="traveler-option-subtitle">
                        0–2 years
                      </span>

                    </div>

                    <div className="traveler-counter">

                      <button
                        type="button"
                        className="counter-button"
                        onClick={decreaseInfants}
                      >
                        −
                      </button>

                      <span className="counter-number">
                        {infants}
                      </span>

                      <button
                        type="button"
                        className="counter-button"
                        onClick={increaseInfants}
                      >
                        +
                      </button>

                    </div>

                  </div>

                  <button
                    type="button"
                    className="traveler-close-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTravelerDropdown(false);
                    }}
                  >
                    Done
                  </button>

                </div>
              )}

            </div>

            {/* CLASS */}

            <div className="top-selector-item">

              <span className="selector-icon">

                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M4 18v3h3v-3h10v3h3v-3c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2h-1V4c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v7c0 1.1.89 2 2 2zm3-14h10v3H7V4zm-3 7h16v5H4v-5z" />
                </svg>

              </span>

              <select
                value={flightClass}
                onChange={(e) =>
                  setFlightClass(e.target.value)
                }
                className="top-select class-select"
              >
                <option value="Economy">
                  Economy
                </option>

                <option value="Premium Economy">
                  Premium Economy
                </option>

                <option value="Business">
                  Business
                </option>

                <option value="First">
                  First Class
                </option>
              </select>

            </div>

          </div>

          {/* MAIN FORM */}

          <div className="desktop-form-row">

            {/* LOCATION */}

            <div className="location-group">

              {/* FROM */}

              <fieldset className="input-fieldset fieldset-from">

                <legend>
                  Flight From
                </legend>

                <div className="fieldset-input-wrapper location-autocomplete-wrapper">

                  <span className="field-icon pin-icon">

                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="#666"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>

                  </span>

                  <input
                    type="text"
                    value={fromCity}
                    onChange={handleFromChange}
                    onFocus={() => {
                      if (fromCity) {
                        setShowFromSuggestions(true);
                      }
                    }}
                    placeholder="City or Airport"
                    className="text-input"
                    autoComplete="off"
                  />

                  {showFromSuggestions && (
                    <div className="city-suggestions">

                      {loadingFrom ? (
                        <div className="suggestion-loading">
                          Searching...
                        </div>
                      ) : fromSuggestions.length > 0 ? (

                        fromSuggestions.map(
                          (city, index) => (
                            <button
                              type="button"
                              className="city-suggestion-item"
                              key={
                                city.id ||
                                city.airportCode ||
                                index
                              }
                              onClick={() =>
                                selectFromCity(city)
                              }
                            >

                              <span className="suggestion-pin">
                                📍
                              </span>

                              <span className="suggestion-content">

                                <strong>
                                  {city.cityName ||
                                    city.airportName}
                                </strong>

                                {city.airportCode && (
                                  <small>
                                    {city.airportCode}
                                  </small>
                                )}

                                {city.airportName &&
                                  city.cityName && (
                                    <small>
                                      {city.airportName}
                                    </small>
                                  )}

                              </span>

                            </button>
                          )
                        )

                      ) : (
                        <div className="no-suggestion">
                          No city or airport found
                        </div>
                      )}

                    </div>
                  )}

                </div>

              </fieldset>

              {/* SWAP */}

              <button
                type="button"
                onClick={handleSwap}
                className="swap-icon-btn"
                title="Swap origin and destination"
              >

                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="#666"
                >
                  <path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z" />
                </svg>

              </button>

              {/* TO */}

              <fieldset className="input-fieldset fieldset-to">

                <legend>
                  Flight To
                </legend>

                <div className="fieldset-input-wrapper location-autocomplete-wrapper">

                  <span className="field-icon pin-icon">

                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="#666"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>

                  </span>

                  <input
                    type="text"
                    value={toCity}
                    onChange={handleToChange}
                    onFocus={() => {
                      if (toCity) {
                        setShowToSuggestions(true);
                      }
                    }}
                    placeholder="City or Airport"
                    className="text-input"
                    autoComplete="off"
                  />

                  {showToSuggestions && (
                    <div className="city-suggestions">

                      {loadingTo ? (
                        <div className="suggestion-loading">
                          Searching...
                        </div>
                      ) : toSuggestions.length > 0 ? (

                        toSuggestions.map(
                          (city, index) => (
                            <button
                              type="button"
                              className="city-suggestion-item"
                              key={
                                city.id ||
                                city.airportCode ||
                                index
                              }
                              onClick={() =>
                                selectToCity(city)
                              }
                            >

                              <span className="suggestion-pin">
                                📍
                              </span>

                              <span className="suggestion-content">

                                <strong>
                                  {city.cityName ||
                                    city.airportName}
                                </strong>

                                {city.airportCode && (
                                  <small>
                                    {city.airportCode}
                                  </small>
                                )}

                                {city.airportName &&
                                  city.cityName && (
                                    <small>
                                      {city.airportName}
                                    </small>
                                  )}

                              </span>

                            </button>
                          )
                        )

                      ) : (
                        <div className="no-suggestion">
                          No city or airport found
                        </div>
                      )}

                    </div>
                  )}

                </div>

              </fieldset>

            </div>

            {/* DEPART */}

            <fieldset className="input-fieldset fieldset-date">

              <legend>
                Depart
              </legend>

              <div
                className="fieldset-input-wrapper date-clickable"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDepartCalendar((prev) => !prev);
                  setShowReturnCalendar(false);
                  setShowFromSuggestions(false);
                  setShowToSuggestions(false);
                  setShowTravelerDropdown(false);
                  if (!showDepartCalendar && departureDate) {
                    setDepartCalendarMonth(new Date(departureDate + "T00:00:00"));
                  }
                }}
              >

                <span className="field-icon cal-icon">

                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="#666"
                  >
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.89-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                  </svg>

                </span>

                <span className="date-display-text">
                  {formatDateDisplay(departureDate)}
                </span>

              </div>

              {showDepartCalendar && (
                <div className="custom-calendar-popup" onClick={(e) => e.stopPropagation()}>
                  <div className="calendar-header">
                    <button
                      type="button"
                      className="cal-nav-btn"
                      disabled={isPrevMonthDisabled(departCalendarMonth)}
                      onClick={() => handlePrevMonth(setDepartCalendarMonth)}
                    >
                      &#8249;
                    </button>
                    <span className="cal-month-title">
                      {monthsList[departCalendarMonth.getMonth()]} {departCalendarMonth.getFullYear()}
                    </span>
                    <button
                      type="button"
                      className="cal-nav-btn"
                      onClick={() => handleNextMonth(setDepartCalendarMonth)}
                    >
                      &#8250;
                    </button>
                  </div>
                  <div className="calendar-weekdays">
                    {daysOfWeek.map((day) => (
                      <span key={day} className="cal-weekday">{day}</span>
                    ))}
                  </div>
                  <div className="calendar-days-grid">
                    {generateCalendarDays(
                      departCalendarMonth,
                      departureDate,
                      today,
                      (selected) => {
                        setDepartureDate(selected);
                        setShowDepartCalendar(false);
                        if (tripType === "round") {
                          if (returnDate && selected > returnDate) {
                            setReturnDate(selected);
                          }
                          setShowReturnCalendar(true);
                          setReturnCalendarMonth(new Date(selected + "T00:00:00"));
                        }
                      }
                    )}
                  </div>
                </div>
              )}

            </fieldset>

            {/* RETURN */}

            <fieldset
              className={`input-fieldset fieldset-date ${tripType === "oneway"
                  ? "disabled-fieldset"
                  : ""
                }`}
            >

              <legend>
                Return
              </legend>

              {tripType === "oneway" ? (

                <div className="fieldset-input-wrapper">

                  <span className="field-icon cal-icon">

                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="#aaa"
                    >
                      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.89-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                    </svg>

                  </span>

                  <span className="date-display-text text-muted">
                    One Way
                  </span>

                </div>

              ) : (

                <div
                  className="fieldset-input-wrapper date-clickable"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowReturnCalendar((prev) => !prev);
                    setShowDepartCalendar(false);
                    setShowFromSuggestions(false);
                    setShowToSuggestions(false);
                    setShowTravelerDropdown(false);
                    if (!showReturnCalendar && returnDate) {
                      setReturnCalendarMonth(new Date(returnDate + "T00:00:00"));
                    } else if (!showReturnCalendar && departureDate) {
                      setReturnCalendarMonth(new Date(departureDate + "T00:00:00"));
                    }
                  }}
                >

                  <span className="field-icon cal-icon">

                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="#666"
                    >
                      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.89-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                    </svg>

                  </span>

                  <span className="date-display-text">
                    {formatDateDisplay(returnDate)}
                  </span>

                </div>
              )}

              {tripType !== "oneway" && showReturnCalendar && (
                <div className="custom-calendar-popup" onClick={(e) => e.stopPropagation()}>
                  <div className="calendar-header">
                    <button
                      type="button"
                      className="cal-nav-btn"
                      disabled={isPrevMonthDisabled(returnCalendarMonth)}
                      onClick={() => handlePrevMonth(setReturnCalendarMonth)}
                    >
                      &#8249;
                    </button>
                    <span className="cal-month-title">
                      {monthsList[returnCalendarMonth.getMonth()]} {returnCalendarMonth.getFullYear()}
                    </span>
                    <button
                      type="button"
                      className="cal-nav-btn"
                      onClick={() => handleNextMonth(setReturnCalendarMonth)}
                    >
                      &#8250;
                    </button>
                  </div>
                  <div className="calendar-weekdays">
                    {daysOfWeek.map((day) => (
                      <span key={day} className="cal-weekday">{day}</span>
                    ))}
                  </div>
                  <div className="calendar-days-grid">
                    {generateCalendarDays(
                      returnCalendarMonth,
                      returnDate,
                      departureDate || today,
                      (selected) => {
                        setReturnDate(selected);
                        setShowReturnCalendar(false);
                      }
                    )}
                  </div>
                </div>
              )}

            </fieldset>

            {/* SEARCH BUTTON */}

            <div className="search-btn-wrapper">

              <button
                type="button"
                className="desktop-search-btn"
                onClick={handleSearchFlight}
                disabled={searchingFlights}
              >

                <span className="search-icon">

                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                  </svg>

                </span>

                {searchingFlights
                  ? "Searching..."
                  : "Search Flights"}

              </button>

            </div>

          </div>

        </div>

        {/* =====================================================
            MOBILE FORM
        ===================================================== */}

        <div className="mobile-flight-form">

          {/* TRIP TYPE */}

          <div className="mobile-radio-group">

            <label className="mobile-radio-label">

              <input
                type="radio"
                name="mobileTrip"
                value="round"
                checked={tripType === "round"}
                onChange={() =>
                  handleTripTypeChange("round")
                }
              />

              <span>
                Round Trip
              </span>

            </label>

            <label className="mobile-radio-label">

              <input
                type="radio"
                name="mobileTrip"
                value="oneway"
                checked={tripType === "oneway"}
                onChange={() =>
                  handleTripTypeChange("oneway")
                }
              />

              <span>
                One Way
              </span>

            </label>

          </div>

          {/* MOBILE FORM BOX */}

          <div className="mobile-form-box">

            {/* FROM + TO */}

            <div className="mobile-box-row">

              {/* FROM */}

              <div className="mobile-box-cell left-cell">

                <span className="cell-label">
                  From
                </span>

                <div className="mobile-autocomplete-wrapper">

                  <input
                    type="text"
                    placeholder="City or Airport"
                    value={fromCity}
                    onChange={handleFromChange}
                    onFocus={() => {
                      if (fromCity) {
                        setShowFromSuggestions(true);
                      }
                    }}
                    className="mobile-cell-input text-left"
                    autoComplete="off"
                  />

                  {showFromSuggestions && (
                    <div className="mobile-city-suggestions">

                      {loadingFrom ? (
                        <div className="suggestion-loading">
                          Searching...
                        </div>
                      ) : fromSuggestions.length > 0 ? (

                        fromSuggestions.map(
                          (city, index) => (
                            <button
                              type="button"
                              className="city-suggestion-item"
                              key={
                                city.id ||
                                city.airportCode ||
                                index
                              }
                              onClick={() =>
                                selectFromCity(city)
                              }
                            >

                              <span className="suggestion-pin">
                                📍
                              </span>

                              <span className="suggestion-content">

                                <strong>
                                  {city.cityName ||
                                    city.airportName}
                                </strong>

                                {city.airportCode && (
                                  <small>
                                    {city.airportCode}
                                  </small>
                                )}

                                {city.airportName &&
                                  city.cityName && (
                                    <small>
                                      {city.airportName}
                                    </small>
                                  )}

                              </span>

                            </button>
                          )
                        )

                      ) : (
                        <div className="no-suggestion">
                          No city or airport found
                        </div>
                      )}

                    </div>
                  )}

                </div>

              </div>

              {/* TO */}

              <div className="mobile-box-cell right-cell">

                <span className="cell-label text-right">
                  To
                </span>

                <div className="mobile-autocomplete-wrapper">

                  <input
                    type="text"
                    placeholder="City or Airport"
                    value={toCity}
                    onChange={handleToChange}
                    onFocus={() => {
                      if (toCity) {
                        setShowToSuggestions(true);
                      }
                    }}
                    className="mobile-cell-input text-right"
                    autoComplete="off"
                  />

                  {showToSuggestions && (
                    <div className="mobile-city-suggestions to-mobile-suggestions">

                      {loadingTo ? (
                        <div className="suggestion-loading">
                          Searching...
                        </div>
                      ) : toSuggestions.length > 0 ? (

                        toSuggestions.map(
                          (city, index) => (
                            <button
                              type="button"
                              className="city-suggestion-item"
                              key={
                                city.id ||
                                city.airportCode ||
                                index
                              }
                              onClick={() =>
                                selectToCity(city)
                              }
                            >

                              <span className="suggestion-pin">
                                📍
                              </span>

                              <span className="suggestion-content">

                                <strong>
                                  {city.cityName ||
                                    city.airportName}
                                </strong>

                                {city.airportCode && (
                                  <small>
                                    {city.airportCode}
                                  </small>
                                )}

                                {city.airportName &&
                                  city.cityName && (
                                    <small>
                                      {city.airportName}
                                    </small>
                                  )}

                              </span>

                            </button>
                          )
                        )

                      ) : (
                        <div className="no-suggestion">
                          No city or airport found
                        </div>
                      )}

                    </div>
                  )}

                </div>

              </div>

            </div>

            {/* DEPART + RETURN */}

            <div className="mobile-box-row">

              {/* DEPART */}

              <div className="mobile-box-cell left-cell" style={{ position: "relative" }}>

                <span className="cell-label">
                  Depart
                </span>

                <div
                  className="mobile-date-wrapper text-left"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDepartCalendar((prev) => !prev);
                    setShowReturnCalendar(false);
                    setShowFromSuggestions(false);
                    setShowToSuggestions(false);
                    setShowMobilePax(false);
                    if (!showDepartCalendar && departureDate) {
                      setDepartCalendarMonth(new Date(departureDate + "T00:00:00"));
                    }
                  }}
                >

                  <span className="mobile-date-val">
                    {formatDateDisplay(
                      departureDate
                    )}
                  </span>

                </div>

                {showDepartCalendar && (
                  <div className="custom-calendar-popup mobile-cal-popup mobile-cal-left" onClick={(e) => e.stopPropagation()}>
                    <div className="calendar-header">
                      <button
                        type="button"
                        className="cal-nav-btn"
                        disabled={isPrevMonthDisabled(departCalendarMonth)}
                        onClick={() => handlePrevMonth(setDepartCalendarMonth)}
                      >
                        &#8249;
                      </button>
                      <span className="cal-month-title">
                        {monthsList[departCalendarMonth.getMonth()]} {departCalendarMonth.getFullYear()}
                      </span>
                      <button
                        type="button"
                        className="cal-nav-btn"
                        onClick={() => handleNextMonth(setDepartCalendarMonth)}
                      >
                        &#8250;
                      </button>
                    </div>
                    <div className="calendar-weekdays">
                      {daysOfWeek.map((day) => (
                        <span key={day} className="cal-weekday">{day}</span>
                      ))}
                    </div>
                    <div className="calendar-days-grid">
                      {generateCalendarDays(
                        departCalendarMonth,
                        departureDate,
                        today,
                        (selected) => {
                          setDepartureDate(selected);
                          setShowDepartCalendar(false);
                          if (tripType === "round") {
                            if (returnDate && selected > returnDate) {
                              setReturnDate(selected);
                            }
                            setShowReturnCalendar(true);
                            setReturnCalendarMonth(new Date(selected + "T00:00:00"));
                          }
                        }
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* RETURN */}

              <div className="mobile-box-cell right-cell" style={{ position: "relative" }}>

                <span className="cell-label text-right">
                  Return
                </span>

                {tripType === "oneway" ? (

                  <span className="mobile-date-val text-muted text-right">
                    One Way
                  </span>

                ) : (

                  <div
                    className="mobile-date-wrapper text-right"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowReturnCalendar((prev) => !prev);
                      setShowDepartCalendar(false);
                      setShowFromSuggestions(false);
                      setShowToSuggestions(false);
                      setShowMobilePax(false);
                      if (!showReturnCalendar && returnDate) {
                        setReturnCalendarMonth(new Date(returnDate + "T00:00:00"));
                      } else if (!showReturnCalendar && departureDate) {
                        setReturnCalendarMonth(new Date(departureDate + "T00:00:00"));
                      }
                    }}
                  >

                    <span className="mobile-date-val">
                      {formatDateDisplay(
                        returnDate
                      )}
                    </span>

                  </div>

                )}

                {tripType !== "oneway" && showReturnCalendar && (
                  <div className="custom-calendar-popup mobile-cal-popup mobile-cal-right" onClick={(e) => e.stopPropagation()}>
                    <div className="calendar-header">
                      <button
                        type="button"
                        className="cal-nav-btn"
                        disabled={isPrevMonthDisabled(returnCalendarMonth)}
                        onClick={() => handlePrevMonth(setReturnCalendarMonth)}
                      >
                        &#8249;
                      </button>
                      <span className="cal-month-title">
                        {monthsList[returnCalendarMonth.getMonth()]} {returnCalendarMonth.getFullYear()}
                      </span>
                      <button
                        type="button"
                        className="cal-nav-btn"
                        onClick={() => handleNextMonth(setReturnCalendarMonth)}
                      >
                        &#8250;
                      </button>
                    </div>
                    <div className="calendar-weekdays">
                      {daysOfWeek.map((day) => (
                        <span key={day} className="cal-weekday">{day}</span>
                      ))}
                    </div>
                    <div className="calendar-days-grid">
                      {generateCalendarDays(
                        returnCalendarMonth,
                        returnDate,
                        departureDate || today,
                        (selected) => {
                          setReturnDate(selected);
                          setShowReturnCalendar(false);
                        }
                      )}
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* CLASS + PAX */}

            <div className="mobile-box-row no-bottom-border">

              {/* CLASS */}

              <div className="mobile-box-cell left-cell">

                <span className="cell-label">
                  Class
                </span>

                <select
                  value={flightClass}
                  onChange={(e) =>
                    setFlightClass(e.target.value)
                  }
                  className="mobile-cell-select text-left"
                >

                  <option value="Economy">
                    Economy
                  </option>

                  <option value="Premium Economy">
                    Premium Economy
                  </option>

                  <option value="Business">
                    Business
                  </option>

                  <option value="First">
                    First
                  </option>

                </select>

              </div>

              {/* PAX */}

              <div className="mobile-box-cell right-cell">

                <span className="cell-label text-right">
                  Pax
                </span>

                <button
                  type="button"
                  className="mobile-pax-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTravelerDropdown((prev) => !prev);
                    setShowDepartCalendar(false);
                    setShowReturnCalendar(false);
                    setShowFromSuggestions(false);
                    setShowToSuggestions(false);
                  }}
                >

                  <span>
                    {travelerText}
                  </span>

                  <span>
                    ▾
                  </span>

                </button>

              </div>

            </div>

          </div>

          {/* MOBILE TRAVELER DROPDOWN */}

          {showTravelerDropdown && (
            <div className="mobile-traveler-dropdown" onClick={(e) => e.stopPropagation()}>

              {/* HEADER */}
              <div className="traveler-dropdown-header">
                <span className="traveler-dropdown-title">Select Travelers</span>
                <button
                  type="button"
                  className="traveler-header-close-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTravelerDropdown(false);
                  }}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="traveler-option">

                <div className="traveler-option-left">

                  <span className="traveler-option-title">
                    Adult
                  </span>

                  <span className="traveler-option-subtitle">
                    12+ years
                  </span>

                </div>

                <div className="traveler-counter">

                  <button
                    type="button"
                    className="counter-button"
                    onClick={decreaseAdults}
                  >
                    −
                  </button>

                  <span className="counter-number">
                    {adults}
                  </span>

                  <button
                    type="button"
                    className="counter-button"
                    onClick={increaseAdults}
                  >
                    +
                  </button>

                </div>

              </div>

              <div className="traveler-option">

                <div className="traveler-option-left">

                  <span className="traveler-option-title">
                    Child
                  </span>

                  <span className="traveler-option-subtitle">
                    2–11 years
                  </span>

                </div>

                <div className="traveler-counter">

                  <button
                    type="button"
                    className="counter-button"
                    onClick={decreaseChildren}
                  >
                    −
                  </button>

                  <span className="counter-number">
                    {children}
                  </span>

                  <button
                    type="button"
                    className="counter-button"
                    onClick={increaseChildren}
                  >
                    +
                  </button>

                </div>

              </div>

              <div className="traveler-option">

                <div className="traveler-option-left">

                  <span className="traveler-option-title">
                    Infant
                  </span>

                  <span className="traveler-option-subtitle">
                    0–2 years
                  </span>

                </div>

                <div className="traveler-counter">

                  <button
                    type="button"
                    className="counter-button"
                    onClick={decreaseInfants}
                  >
                    −
                  </button>

                  <span className="counter-number">
                    {infants}
                  </span>

                  <button
                    type="button"
                    className="counter-button"
                    onClick={increaseInfants}
                  >
                    +
                  </button>

                </div>

              </div>

              <button
                type="button"
                className="traveler-close-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTravelerDropdown(false);
                }}
              >
                Done
              </button>

            </div>
          )}

          {/* MOBILE SEARCH */}

          <button
            type="button"
            className="mobile-search-btn"
            onClick={handleSearchFlight}
            disabled={searchingFlights}
          >

            <span className="search-icon">

              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>

            </span>

            {searchingFlights
              ? "Searching..."
              : "Search Flights"}

          </button>

        </div>

      </div>
    </section>
  );
}

export default FlightForm;