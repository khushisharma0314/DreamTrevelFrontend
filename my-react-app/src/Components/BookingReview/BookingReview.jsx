import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../Firebase.jsx";
import PhoneInput from "../Common/PhoneInput";
import {
    detectIsInternational,
    saveBookingSession,
    getBookingSession
} from "../../utils/flightUtils";
import bookingRevBg from "../../assets/bookingRev.png";
import AuthModal from "../AuthModal/AuthModal";
import "./BookingReview.css";

function BookingReview() {
    const location = useLocation();
    const navigate = useNavigate();

    const activeState =
        location.state ||
        getBookingSession()?.state ||
        {};

    const {
        selectedDeparture,
        selectedReturn,
        searchData,
        selectedFromCity,
        selectedToCity,
        isInternational: passedIsInternational,
        passengers = [],
        contactInfo,
        pricing,
        appliedPromo: initialPromo,
        selectedSeats: initialSeats = {},
        totalSeatCharges: initialSeatCharges = 0,
        selectedAddOns: initialAddOns = {
            baggage: [],
            meals: [],
            priority: false,
            insurance: false,
        },
        baggageTotal: initialBaggageTotal = 0,
        mealTotal: initialMealTotal = 0,
        priorityPrice: initialPriorityPrice = 0,
        insurancePrice: initialInsurancePrice = 0,
        totalAddOnCharges: initialTotalAddOnCharges = 0,
        finalTotalPrice: initialFinalTotalPrice = 0,
    } = activeState;

    const [appliedPromo, setAppliedPromo] = useState(initialPromo || null);

    // =========================================================
    // INTERNATIONAL FLIGHT CHECK
    // =========================================================
    const isInternational =
        typeof passedIsInternational === "boolean"
            ? passedIsInternational
            : detectIsInternational(
                selectedFromCity,
                selectedToCity,
                searchData,
                selectedDeparture
            );

    // =========================================================
    // PASSENGER & CONTACT STATE
    // =========================================================
    const [editablePassengers, setEditablePassengers] = useState(passengers);
    const [editingIndex, setEditingIndex] = useState(null);
    const [tempPassenger, setTempPassenger] = useState(null);

    const [editableContactInfo, setEditableContactInfo] = useState(
        contactInfo || {
            email: "",
            phone: "",
            countryCode: "+1",
        }
    );
    const [isEditingContact, setIsEditingContact] = useState(false);
    const [tempContactInfo, setTempContactInfo] = useState({
        email: "",
        phone: "",
        countryCode: "+1",
    });

    const [editErrors, setEditErrors] = useState({});

    // =========================================================
    // SEATS STATE
    // =========================================================
    const [currentSelectedSeats, setCurrentSelectedSeats] = useState(initialSeats || {});

    // =========================================================
    // POPUP AUTH MODAL STATE (NO IMAGES, GREY & ORANGE)
    // =========================================================
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState("login"); // "login" or "register"
    const [authName, setAuthName] = useState("");
    const [authEmail, setAuthEmail] = useState("");
    const [authPassword, setAuthPassword] = useState("");
    const [showAuthPassword, setShowAuthPassword] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState("");

    // =========================================================
    // SESSION CHECK
    // =========================================================
    if (!searchData || !selectedDeparture || !passengers.length) {
        return (
            <main
                className="booking-review-page"
                style={{
                    backgroundImage: `url(${bookingRevBg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center center",
                    backgroundAttachment: "fixed",
                }}
            >
                <div className="review-error-card">
                    <h2>Session Expired</h2>
                    <p>
                        We could not retrieve your booking details. Please start your flight search again.
                    </p>
                    <button type="button" className="review-proceed-btn" onClick={() => navigate("/")}>
                        Go to Search
                    </button>
                </div>
            </main>
        );
    }

    // =========================================================
    // EDIT PASSENGER HANDLERS
    // =========================================================
    const handleStartEditPassenger = (index) => {
        setEditingIndex(index);
        setTempPassenger({ ...editablePassengers[index] });
        setEditErrors({});
    };

    const handlePassengerInputChange = (field, value) => {
        let sanitizedValue = value;
        if (field === "dateOfBirth" && sanitizedValue) {
            const parts = sanitizedValue.split("-");
            if (parts[0] && parts[0].length > 4) {
                parts[0] = parts[0].slice(0, 4);
                sanitizedValue = parts.join("-");
            }
        }
        setTempPassenger((prev) => ({
            ...prev,
            [field]: sanitizedValue,
        }));
        setEditErrors((prev) => ({
            ...prev,
            [field]: "",
        }));
    };

    const handleSavePassenger = (index) => {
        const errors = {};

        const trimmedFirstName = (tempPassenger?.firstName || "").trim();
        if (!trimmedFirstName) {
            errors.firstName = "First name is required.";
        } else if (trimmedFirstName.length < 2 || trimmedFirstName.length > 50) {
            errors.firstName = "First name must be between 2 and 50 characters.";
        } else if (!/^[a-zA-Z\s'-]+$/.test(trimmedFirstName)) {
            errors.firstName = "First name can only contain letters, spaces, hyphens, and apostrophes.";
        }

        const trimmedLastName = (tempPassenger?.lastName || "").trim();
        if (!trimmedLastName) {
            errors.lastName = "Last name is required.";
        } else if (trimmedLastName.length < 2 || trimmedLastName.length > 50) {
            errors.lastName = "Last name must be between 2 and 50 characters.";
        } else if (!/^[a-zA-Z\s'-]+$/.test(trimmedLastName)) {
            errors.lastName = "Last name can only contain letters, spaces, hyphens, and apostrophes.";
        }

        if (!tempPassenger?.gender) {
            errors.gender = "Gender is required.";
        } else if (!["Male", "Female", "Other"].includes(tempPassenger.gender)) {
            errors.gender = "Please select a valid gender (Male, Female, or Other).";
        }

        if (!tempPassenger?.dateOfBirth) {
            errors.dateOfBirth = "Date of birth is required.";
        } else {
            const dobParts = tempPassenger.dateOfBirth.split("-");
            const birthYear = parseInt(dobParts[0], 10);
            const today = new Date();
            const todayStr = today.toISOString().split("T")[0];
            const currentYear = today.getFullYear();
            const birthDate = new Date(tempPassenger.dateOfBirth);

            if (
                dobParts[0].length !== 4 ||
                isNaN(birthYear) ||
                birthYear < 1900 ||
                birthYear > currentYear ||
                isNaN(birthDate.getTime())
            ) {
                errors.dateOfBirth = "Year must be a valid 4-digit year.";
            } else if (tempPassenger.dateOfBirth > todayStr) {
                errors.dateOfBirth = "Date of birth cannot be in the future.";
            } else {
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }

                const pType = (tempPassenger.passengerType || "ADULT").toUpperCase();
                if (pType === "ADULT" && age < 12) {
                    errors.dateOfBirth = "Adult passenger must be at least 12 years old.";
                } else if (pType === "CHILD" && (age < 2 || age >= 12)) {
                    errors.dateOfBirth = "Child passenger must be between 2 and 11 years old.";
                } else if (pType === "INFANT" && (age < 0 || age >= 2)) {
                    errors.dateOfBirth = "Infant passenger must be under 2 years old.";
                }
            }
        }

        if (isInternational) {
            const trimmedNationality = (tempPassenger?.nationality || "").trim();
            if (!trimmedNationality) {
                errors.nationality = "Nationality is required.";
            } else if (trimmedNationality.length < 2 || trimmedNationality.length > 50) {
                errors.nationality = "Nationality must be between 2 and 50 characters.";
            } else if (!/^[a-zA-Z\s'-]+$/.test(trimmedNationality)) {
                errors.nationality = "Nationality can only contain letters, spaces, and hyphens.";
            }

            const trimmedPassportNumber = (tempPassenger?.passportNumber || "").trim();
            if (!trimmedPassportNumber) {
                errors.passportNumber = "Passport number is required.";
            } else if (!/^[a-zA-Z0-9]{6,15}$/.test(trimmedPassportNumber)) {
                errors.passportNumber = "Passport number must be 6 to 15 alphanumeric characters.";
            }

            if (!tempPassenger?.passportExpiry) {
                errors.passportExpiry = "Passport expiry is required.";
            } else {
                const todayStr = new Date().toISOString().split("T")[0];
                const depDate = selectedDeparture?.departureDate || selectedDeparture?.date || searchData?.departureDate;

                if (tempPassenger.passportExpiry <= todayStr) {
                    errors.passportExpiry = "Passport must be valid for a future date.";
                } else if (depDate && tempPassenger.passportExpiry <= depDate) {
                    errors.passportExpiry = "Passport must not be expired at travel date.";
                }
            }

            const trimmedIssuingCountry = (tempPassenger?.passportIssuingCountry || "").trim();
            if (!trimmedIssuingCountry) {
                errors.passportIssuingCountry = "Passport issuing country is required.";
            } else if (trimmedIssuingCountry.length < 2 || trimmedIssuingCountry.length > 50) {
                errors.passportIssuingCountry = "Passport issuing country must be between 2 and 50 characters.";
            } else if (!/^[a-zA-Z\s'-]+$/.test(trimmedIssuingCountry)) {
                errors.passportIssuingCountry = "Passport issuing country can only contain letters, spaces, and hyphens.";
            }
        }

        if (Object.keys(errors).length > 0) {
            setEditErrors(errors);
            return;
        }

        const updated = [...editablePassengers];
        updated[index] = { ...tempPassenger };
        setEditablePassengers(updated);
        setEditingIndex(null);
        setTempPassenger(null);
        setEditErrors({});
    };

    const handleCancelEditPassenger = () => {
        setEditingIndex(null);
        setTempPassenger(null);
        setEditErrors({});
    };

    // =========================================================
    // EDIT CONTACT HANDLERS
    // =========================================================
    const handleStartEditContact = () => {
        setIsEditingContact(true);
        setTempContactInfo({ ...editableContactInfo });
        setEditErrors({});
    };

    const handleContactInputChange = (field, value) => {
        setTempContactInfo((prev) => ({
            ...prev,
            [field]: value,
        }));
        setEditErrors((prev) => ({
            ...prev,
            [field]: "",
        }));
    };

    const handleSaveContact = () => {
        const errors = {};

        if (!tempContactInfo.email || !tempContactInfo.email.trim()) {
            errors.email = "Email is required.";
        } else if (tempContactInfo.email.trim().length > 100) {
            errors.email = "Email cannot exceed 100 characters.";
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(tempContactInfo.email.trim())) {
            errors.email = "Please enter a valid email address.";
        }

        const rawPhone = tempContactInfo.phone || "";
        const cleanDigits = rawPhone.replace(/\D/g, "");

        if (!rawPhone.trim()) {
            errors.phone = "Phone number is required.";
        } else if (cleanDigits.length < 7 || cleanDigits.length > 15) {
            errors.phone = "Please enter a valid phone number (7-15 digits).";
        } else if (!/^\+?[0-9\s-]+$/.test(rawPhone.trim())) {
            errors.phone = "Please enter a valid phone number.";
        }

        if (Object.keys(errors).length > 0) {
            setEditErrors(errors);
            return;
        }

        setEditableContactInfo({
            ...tempContactInfo,
            countryCode: tempContactInfo.countryCode || "+1",
            fullPhone: `${tempContactInfo.countryCode || "+1"} ${(tempContactInfo.phone || "").trim()}`,
        });

        setIsEditingContact(false);
        setEditErrors({});
    };

    const handleCancelEditContact = () => {
        setIsEditingContact(false);
        setEditErrors({});
    };

    // =========================================================
    // SEAT HELPERS
    // =========================================================
    const getSeatObject = (index, type) => {
        const key = `${type}_${index}`;
        const seat = currentSelectedSeats[key];
        if (!seat) return null;

        if (typeof seat === "object") return seat;

        return {
            designator: String(seat),
            serviceId: "",
            price: 0,
            currency: "USD",
        };
    };

    const getPassengerSeat = (index, type) => {
        const seat = getSeatObject(index, type);
        if (!seat) return null;
        return seat.designator || seat.seat || null;
    };

    const getSeatPrice = (index, type) => {
        const seat = getSeatObject(index, type);
        if (!seat) return 0;

        let price = 0;
        if (typeof seat.price === "number" || typeof seat.price === "string") {
            price = Number(seat.price);
        } else if (seat.price && typeof seat.price === "object") {
            price = Number(seat.price.amount || seat.price.value || 0);
        } else if (seat.total_amount && typeof seat.total_amount === "object") {
            price = Number(seat.total_amount.amount || 0);
        } else if (seat.amount !== undefined) {
            price = Number(seat.amount);
        }

        return Number.isFinite(price) ? price : 0;
    };

    // =========================================================
    // PRICE CALCULATION IN USD ($)
    // =========================================================
    const formatPrice = (price) => {
        const numericPrice = Number(price || 0);
        return Number.isFinite(numericPrice)
            ? numericPrice.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
            })
            : "0";
    };

    const calculatedSeatCharges = editablePassengers.reduce((total, _, index) => {
        const departurePrice = getSeatPrice(index, "departure");
        const returnPrice = selectedReturn ? getSeatPrice(index, "return") : 0;
        return total + departurePrice + returnPrice;
    }, 0);

    const hasAnySeatsSelected = editablePassengers.some((_, index) => {
        return (
            Boolean(getPassengerSeat(index, "departure")) ||
            Boolean(selectedReturn && getPassengerSeat(index, "return"))
        );
    });

    const flightFare = Number(
        pricing?.subtotalPrice ||
        pricing?.grandTotalPrice ||
        0
    );

    const promoDiscountAmount = Number(appliedPromo?.discountAmount || 0);

    const grandTotalPrice = Math.max(
        0,
        flightFare + calculatedSeatCharges - promoDiscountAmount
    );

    // =========================================================
    // HUB NAVIGATION STATE BUILDER
    // =========================================================
    const buildHubState = () => {
        const cleanSeats = {};

        Object.keys(currentSelectedSeats || {}).forEach((key) => {
            const seat = currentSelectedSeats[key];
            if (!seat) return;

            if (typeof seat === "object") {
                cleanSeats[key] = {
                    designator: seat.designator || seat.seat || "",
                    serviceId: seat.serviceId || "",
                    price: Number(seat.price || 0),
                    currency: seat.currency || "USD",
                };
            } else {
                cleanSeats[key] = {
                    designator: String(seat),
                    serviceId: "",
                    price: 0,
                    currency: "USD",
                };
            }
        });

        return {
            selectedDeparture,
            selectedReturn,
            searchData,
            selectedFromCity,
            selectedToCity,
            isInternational,
            appliedPromo,
            passengers: editablePassengers,
            contactInfo: editableContactInfo,
            pricing: {
                ...pricing,
                discountAmount: promoDiscountAmount,
                promoCode: appliedPromo?.code || null,
                grandTotalPrice: grandTotalPrice,
                currency: "USD",
            },
            selectedSeats: cleanSeats,
            totalSeatCharges: calculatedSeatCharges,
            selectedAddOns: {
                baggage: [],
                meals: [],
                priority: false,
                insurance: false,
            },
            baggageTotal: 0,
            mealTotal: 0,
            priorityPrice: 0,
            insurancePrice: 0,
            totalAddOnCharges: 0,
            finalTotalPrice: grandTotalPrice,
        };
    };

    // Persist to session
    useEffect(() => {
        if (selectedDeparture && editablePassengers.length > 0) {
            saveBookingSession("/booking-review", buildHubState());
        }
    }, [
        selectedDeparture,
        selectedReturn,
        searchData,
        selectedFromCity,
        selectedToCity,
        isInternational,
        editablePassengers,
        editableContactInfo,
        pricing,
        currentSelectedSeats,
        grandTotalPrice,
    ]);

    // Navigation Handlers
    const handleSelectSeats = () => {
        navigate("/seat-selection", {
            state: buildHubState(),
        });
    };

    const handleResetSeats = () => {
        setCurrentSelectedSeats({});
    };

    const handleBackToTravelerDetails = () => {
        navigate("/flight-details", {
            state: {
                selectedDeparture,
                selectedReturn,
                searchData,
                selectedFromCity,
                selectedToCity,
                isInternational,
                passengers: editablePassengers,
                contactInfo: editableContactInfo,
                pricing,
            },
        });
    };

    const handleContinuePayment = () => {
        const paymentState = buildHubState();
        saveBookingSession("/payment", paymentState);

        const token =
            localStorage.getItem("token") ||
            localStorage.getItem("jwtToken") ||
            localStorage.getItem("authToken") ||
            localStorage.getItem("accessToken");

        if (!token || token === "null" || token === "undefined") {
            setAuthError("");
            setAuthEmail(editableContactInfo?.email || "");
            setAuthName(
                editablePassengers?.[0]?.firstName
                    ? `${editablePassengers[0].firstName} ${editablePassengers[0].lastName || ""}`.trim()
                    : ""
            );
            setIsAuthModalOpen(true);
            return;
        }

        navigate("/payment", {
            state: paymentState,
        });
    };

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setAuthLoading(true);
        setAuthError("");

        const paymentState = buildHubState();

        try {
            if (authMode === "register") {
                const trimmedName = authName.trim();
                const trimmedEmail = authEmail.trim();

                if (!trimmedName) {
                    setAuthError("Name is required.");
                    setAuthLoading(false);
                    return;
                }
                if (!trimmedEmail) {
                    setAuthError("Email is required.");
                    setAuthLoading(false);
                    return;
                }
                if (!authPassword || authPassword.length < 6) {
                    setAuthError("Password must be at least 6 characters.");
                    setAuthLoading(false);
                    return;
                }

                await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`,
                    {
                        name: trimmedName,
                        email: trimmedEmail,
                        password: authPassword,
                    }
                );

                // Auto login after registration
                try {
                    const loginRes = await axios.post(
                        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
                        {
                            email: trimmedEmail,
                            password: authPassword,
                        }
                    );

                    const token =
                        loginRes.data?.token ||
                        loginRes.data?.jwt ||
                        loginRes.data?.accessToken;

                    if (token) {
                        localStorage.setItem("token", token);
                        if (loginRes.data?.user) {
                            localStorage.setItem("user", JSON.stringify(loginRes.data.user));
                        } else {
                            localStorage.setItem(
                                "user",
                                JSON.stringify({
                                    name: trimmedName,
                                    email: trimmedEmail,
                                })
                            );
                        }
                        window.dispatchEvent(new Event("authChange"));
                        setIsAuthModalOpen(false);
                        navigate("/payment", { state: paymentState });
                        return;
                    }
                } catch {
                    setAuthMode("login");
                    setAuthError("Registration successful! Please sign in with your password.");
                    setAuthLoading(false);
                    return;
                }
            } else {
                // LOGIN MODE
                const trimmedEmail = authEmail.trim();
                if (!trimmedEmail) {
                    setAuthError("Email is required.");
                    setAuthLoading(false);
                    return;
                }
                if (!authPassword) {
                    setAuthError("Password is required.");
                    setAuthLoading(false);
                    return;
                }

                const response = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
                    {
                        email: trimmedEmail,
                        password: authPassword,
                    }
                );

                const token =
                    response.data?.token ||
                    response.data?.jwt ||
                    response.data?.accessToken;

                if (!token) {
                    setAuthError("Login failed: token not received from server.");
                    setAuthLoading(false);
                    return;
                }

                localStorage.setItem("token", token);
                if (response.data?.user) {
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                } else {
                    localStorage.setItem(
                        "user",
                        JSON.stringify({
                            name: response.data?.name || trimmedEmail.split("@")[0],
                            email: trimmedEmail,
                        })
                    );
                }

                window.dispatchEvent(new Event("authChange"));
                setIsAuthModalOpen(false);
                navigate("/payment", { state: paymentState });
            }
        } catch (err) {
            console.error("AUTH ERROR:", err);
            const msg =
                err.response?.data?.message ||
                err.response?.data?.error ||
                (authMode === "register" ? "Registration failed. Try again." : "Invalid email or password.");
            setAuthError(msg);
        } finally {
            setAuthLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        setAuthLoading(true);
        setAuthError("");
        const paymentState = buildHubState();

        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const backendResponse = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/google`,
                {
                    email: user.email,
                    name: user.displayName || user.email.split("@")[0],
                }
            );

            const token =
                backendResponse.data?.token ||
                backendResponse.data?.jwt ||
                backendResponse.data?.accessToken;

            if (token) {
                localStorage.setItem("token", token);
            }

            const googleUserData = {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                photo: user.photoURL,
            };
            localStorage.setItem("googleUser", JSON.stringify(googleUserData));
            localStorage.setItem(
                "user",
                JSON.stringify({
                    name: user.displayName || user.email.split("@")[0],
                    email: user.email,
                })
            );

            window.dispatchEvent(new Event("authChange"));
            setIsAuthModalOpen(false);
            navigate("/payment", { state: paymentState });
        } catch (err) {
            console.error("GOOGLE AUTH ERROR:", err);
            setAuthError(err.response?.data?.message || err.message || "Google sign-in failed.");
        } finally {
            setAuthLoading(false);
        }
    };

    // Helper for airline code/logo
    const getAirlineCode = (flight) => {
        if (!flight) return "";
        return flight.airlineCode || (flight.flightNumber ? flight.flightNumber.slice(0, 2) : "FL");
    };

    return (
        <main
            className="booking-review-page"
            style={{
                backgroundImage: `url(${bookingRevBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
                backgroundAttachment: "fixed",
            }}
        >
            <div className="booking-review-container">
                {/* =================================================
                    TOP STEPPER BAR (MATCHING FLIGHT DETAILS)
                ================================================= */}
                <div className="review-stepper-wrapper">
                    <div className="review-stepper">
                        {/* Step 1 */}
                        <div className="review-step completed">
                            <span className="step-circle step-circle-completed">✓</span>
                            <span className="step-label">Flight Selection</span>
                        </div>
                        <div className="stepper-line completed-line"></div>

                        {/* Step 2 */}
                        <div className="review-step completed">
                            <span className="step-circle step-circle-completed">✓</span>
                            <span className="step-label">Traveler Details</span>
                        </div>
                        <div className="stepper-line completed-line"></div>

                        {/* Step 3 (Active) */}
                        <div className="review-step active">
                            <span className="step-circle step-circle-active">3</span>
                            <span className="step-label active-label">Review Booking</span>
                        </div>
                        <div className="stepper-line"></div>

                        {/* Step 4 */}
                        <div className="review-step">
                            <span className="step-circle">4</span>
                            <span className="step-label">Payment</span>
                        </div>
                    </div>
                </div>

                {/* =================================================
                    1. FLIGHT ITINERARY (SABSE UPR)
                ================================================= */}
                <section className="review-glass-card flight-itinerary-card">
                    <div className="review-card-header">
                        <div className="header-icon-title">
                            <span className="review-heading-icon">✈️</span>
                            <div>
                                <h2>Flight Itinerary</h2>
                                <p className="review-header-sub">Your confirmed flight route and schedule</p>
                            </div>
                        </div>
                        <span className="itinerary-class-badge">
                            {searchData?.flightClass || "Economy"} Class
                        </span>
                    </div>

                    {/* DEPARTURE FLIGHT BLOCK */}
                    <div className="itinerary-flight-block">
                        <div className="itinerary-top-row">
                            <div className="itinerary-tag-group">
                                <span className="flight-direction-badge departure-badge">DEPARTURE</span>
                                <span className="airline-meta-name">
                                    {selectedDeparture?.airline || "Airline"} • {selectedDeparture?.flightNumber || "Flight"}
                                </span>
                            </div>
                            {selectedDeparture?.fareTierName && (
                                <span className="itinerary-tier-badge">
                                    🏷️ {selectedDeparture.fareTierName}
                                    {selectedDeparture.checkedBagsIncluded > 0
                                        ? ` • ${selectedDeparture.checkedBagsIncluded}x 23kg Bag`
                                        : " • Cabin Bag Only"}
                                </span>
                            )}
                        </div>

                        <div className="itinerary-route-grid">
                            {/* Origin */}
                            <div className="route-endpoint origin">
                                <span className="route-airport-code">
                                    {selectedDeparture?.fromAirportCode || selectedDeparture?.from || searchData?.fromCity || "ORIGIN"}
                                </span>
                                <span className="route-city-name">
                                    {selectedDeparture?.fromCity || selectedDeparture?.from || searchData?.fromCity || "Departure City"}
                                </span>
                                <span className="route-time-val">
                                    {selectedDeparture?.departureTime || "--:--"}
                                </span>
                                <span className="route-date-val">
                                    📅 {selectedDeparture?.departureDate || searchData?.departureDate || "Date"}
                                </span>
                            </div>

                            {/* Middle flight path */}
                            <div className="route-middle-path">
                                <span className="flight-duration-pill">
                                    ⏱️ {selectedDeparture?.duration || "Direct"}
                                </span>
                                <div className="flight-path-visual">
                                    <span className="path-dot origin-dot"></span>
                                    <span className="path-line"></span>
                                    <span className="path-plane-icon">✈</span>
                                    <span className="path-line"></span>
                                    <span className="path-dot dest-dot"></span>
                                </div>
                                <span className="flight-stops-note">
                                    {selectedDeparture?.stops !== undefined
                                        ? (selectedDeparture.stops === 0 ? "Non-stop" : `${selectedDeparture.stops} Stop`)
                                        : "Direct Flight"}
                                </span>
                            </div>

                            {/* Destination */}
                            <div className="route-endpoint destination">
                                <span className="route-airport-code">
                                    {selectedDeparture?.toAirportCode || selectedDeparture?.to || searchData?.toCity || "DEST"}
                                </span>
                                <span className="route-city-name">
                                    {selectedDeparture?.toCity || selectedDeparture?.to || searchData?.toCity || "Arrival City"}
                                </span>
                                <span className="route-time-val">
                                    {selectedDeparture?.arrivalTime || "--:--"}
                                </span>
                                <span className="route-date-val">
                                    📅 {selectedDeparture?.arrivalDate || selectedDeparture?.departureDate || searchData?.departureDate || "Date"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* RETURN FLIGHT BLOCK (IF ROUND-TRIP) */}
                    {selectedReturn && (
                        <div className="itinerary-flight-block return-flight-block">
                            <div className="itinerary-top-row">
                                <div className="itinerary-tag-group">
                                    <span className="flight-direction-badge return-badge">RETURN</span>
                                    <span className="airline-meta-name">
                                        {selectedReturn?.airline || "Airline"} • {selectedReturn?.flightNumber || "Flight"}
                                    </span>
                                </div>
                                {selectedReturn?.fareTierName && (
                                    <span className="itinerary-tier-badge">
                                        🏷️ {selectedReturn.fareTierName}
                                        {selectedReturn.checkedBagsIncluded > 0
                                            ? ` • ${selectedReturn.checkedBagsIncluded}x 23kg Bag`
                                            : " • Cabin Bag Only"}
                                    </span>
                                )}
                            </div>

                            <div className="itinerary-route-grid">
                                {/* Origin (Return) */}
                                <div className="route-endpoint origin">
                                    <span className="route-airport-code">
                                        {selectedReturn?.fromAirportCode || selectedReturn?.from || searchData?.toCity || "ORIGIN"}
                                    </span>
                                    <span className="route-city-name">
                                        {selectedReturn?.fromCity || selectedReturn?.from || searchData?.toCity || "Departure City"}
                                    </span>
                                    <span className="route-time-val">
                                        {selectedReturn?.departureTime || "--:--"}
                                    </span>
                                    <span className="route-date-val">
                                        📅 {selectedReturn?.departureDate || searchData?.returnDate || "Date"}
                                    </span>
                                </div>

                                {/* Middle flight path */}
                                <div className="route-middle-path">
                                    <span className="flight-duration-pill">
                                        ⏱️ {selectedReturn?.duration || "Direct"}
                                    </span>
                                    <div className="flight-path-visual">
                                        <span className="path-dot origin-dot"></span>
                                        <span className="path-line"></span>
                                        <span className="path-plane-icon">✈</span>
                                        <span className="path-line"></span>
                                        <span className="path-dot dest-dot"></span>
                                    </div>
                                    <span className="flight-stops-note">
                                        {selectedReturn?.stops !== undefined
                                            ? (selectedReturn.stops === 0 ? "Non-stop" : `${selectedReturn.stops} Stop`)
                                            : "Direct Flight"}
                                    </span>
                                </div>

                                {/* Destination (Return) */}
                                <div className="route-endpoint destination">
                                    <span className="route-airport-code">
                                        {selectedReturn?.toAirportCode || selectedReturn?.to || searchData?.fromCity || "DEST"}
                                    </span>
                                    <span className="route-city-name">
                                        {selectedReturn?.toCity || selectedReturn?.to || searchData?.fromCity || "Arrival City"}
                                    </span>
                                    <span className="route-time-val">
                                        {selectedReturn?.arrivalTime || "--:--"}
                                    </span>
                                    <span className="route-date-val">
                                        📅 {selectedReturn?.arrivalDate || selectedReturn?.departureDate || searchData?.returnDate || "Date"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* =================================================
                    2. PASSENGER & CONTACT DETAILS (SIDE-BY-SIDE COMPACT)
                ================================================= */}
                <div className="passenger-contact-side-by-side">
                    {/* LEFT: PASSENGER DETAILS */}
                    <section className="review-glass-card compact-card passenger-compact-card">
                        <div className="review-card-header">
                            <div className="header-icon-title">
                                <span className="review-heading-icon">👤</span>
                                <div>
                                    <h2>Passenger Details</h2>
                                    <p className="review-header-sub">
                                        {editablePassengers.length} Traveler{editablePassengers.length > 1 ? "s" : ""}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="compact-passengers-list">
                            {editablePassengers.map((passenger, index) => {
                                const isEditing = editingIndex === index;

                                return (
                                    <div className="compact-passenger-item" key={index}>
                                        <div className="compact-passenger-top">
                                            <div className="passenger-title-group">
                                                <span className="passenger-num-pill">P{index + 1}</span>
                                                <strong className="passenger-display-name">
                                                    {passenger?.firstName || passenger?.lastName
                                                        ? `${passenger?.firstName || ""} ${passenger?.lastName || ""}`.trim()
                                                        : passenger?.label || `Passenger ${index + 1}`}
                                                </strong>
                                                <span className="passenger-type-pill">
                                                    {passenger?.passengerType || "Adult"}
                                                </span>
                                            </div>

                                            {!isEditing && (
                                                <button
                                                    type="button"
                                                    className="review-edit-btn"
                                                    onClick={() => handleStartEditPassenger(index)}
                                                >
                                                    ✏️ Edit
                                                </button>
                                            )}
                                        </div>

                                        {isEditing ? (
                                            /* INLINE EDIT FORM */
                                            <div className="compact-edit-form">
                                                <div className="compact-edit-grid">
                                                    <div className="edit-field">
                                                        <label>First Name*</label>
                                                        <input
                                                            type="text"
                                                            value={tempPassenger?.firstName || ""}
                                                            onChange={(e) => handlePassengerInputChange("firstName", e.target.value)}
                                                            className={editErrors.firstName ? "input-err" : ""}
                                                            placeholder="First Name"
                                                        />
                                                        {editErrors.firstName && <span className="err-msg">{editErrors.firstName}</span>}
                                                    </div>

                                                    <div className="edit-field">
                                                        <label>Last Name*</label>
                                                        <input
                                                            type="text"
                                                            value={tempPassenger?.lastName || ""}
                                                            onChange={(e) => handlePassengerInputChange("lastName", e.target.value)}
                                                            className={editErrors.lastName ? "input-err" : ""}
                                                            placeholder="Last Name"
                                                        />
                                                        {editErrors.lastName && <span className="err-msg">{editErrors.lastName}</span>}
                                                    </div>

                                                    <div className="edit-field">
                                                        <label>Gender*</label>
                                                        <select
                                                            value={tempPassenger?.gender || ""}
                                                            onChange={(e) => handlePassengerInputChange("gender", e.target.value)}
                                                            className={editErrors.gender ? "input-err" : ""}
                                                        >
                                                            <option value="">Select Gender</option>
                                                            <option value="Male">Male</option>
                                                            <option value="Female">Female</option>
                                                            <option value="Other">Other</option>
                                                        </select>
                                                        {editErrors.gender && <span className="err-msg">{editErrors.gender}</span>}
                                                    </div>

                                                    <div className="edit-field">
                                                        <label>Date of Birth*</label>
                                                        <input
                                                            type="date"
                                                            min="1900-01-01"
                                                            max={new Date().toISOString().split("T")[0]}
                                                            value={tempPassenger?.dateOfBirth || ""}
                                                            onChange={(e) => handlePassengerInputChange("dateOfBirth", e.target.value)}
                                                            className={editErrors.dateOfBirth ? "input-err" : ""}
                                                        />
                                                        {editErrors.dateOfBirth && <span className="err-msg">{editErrors.dateOfBirth}</span>}
                                                    </div>

                                                    {isInternational && (
                                                        <>
                                                            <div className="edit-field">
                                                                <label>Nationality*</label>
                                                                <input
                                                                    type="text"
                                                                    value={tempPassenger?.nationality || ""}
                                                                    onChange={(e) => handlePassengerInputChange("nationality", e.target.value)}
                                                                    className={editErrors.nationality ? "input-err" : ""}
                                                                    placeholder="e.g. American / Indian"
                                                                />
                                                                {editErrors.nationality && <span className="err-msg">{editErrors.nationality}</span>}
                                                            </div>

                                                            <div className="edit-field">
                                                                <label>Passport No.*</label>
                                                                <input
                                                                    type="text"
                                                                    value={tempPassenger?.passportNumber || ""}
                                                                    onChange={(e) => handlePassengerInputChange("passportNumber", e.target.value)}
                                                                    className={editErrors.passportNumber ? "input-err" : ""}
                                                                    placeholder="Passport number"
                                                                />
                                                                {editErrors.passportNumber && <span className="err-msg">{editErrors.passportNumber}</span>}
                                                            </div>

                                                            <div className="edit-field">
                                                                <label>Passport Expiry*</label>
                                                                <input
                                                                    type="date"
                                                                    value={tempPassenger?.passportExpiry || ""}
                                                                    onChange={(e) => handlePassengerInputChange("passportExpiry", e.target.value)}
                                                                    className={editErrors.passportExpiry ? "input-err" : ""}
                                                                />
                                                                {editErrors.passportExpiry && <span className="err-msg">{editErrors.passportExpiry}</span>}
                                                            </div>

                                                            <div className="edit-field">
                                                                <label>Issuing Country*</label>
                                                                <input
                                                                    type="text"
                                                                    value={tempPassenger?.passportIssuingCountry || ""}
                                                                    onChange={(e) => handlePassengerInputChange("passportIssuingCountry", e.target.value)}
                                                                    className={editErrors.passportIssuingCountry ? "input-err" : ""}
                                                                    placeholder="Issuing country"
                                                                />
                                                                {editErrors.passportIssuingCountry && <span className="err-msg">{editErrors.passportIssuingCountry}</span>}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>

                                                <div className="compact-edit-actions">
                                                    <button
                                                        type="button"
                                                        className="compact-cancel-btn"
                                                        onClick={handleCancelEditPassenger}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="compact-save-btn"
                                                        onClick={() => handleSavePassenger(index)}
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            /* VIEW MODE */
                                            <div className="compact-passenger-meta-grid">
                                                <div className="passenger-meta-item">
                                                    <span className="meta-label">Gender</span>
                                                    <span className="meta-val">{passenger?.gender || "—"}</span>
                                                </div>
                                                <div className="passenger-meta-item">
                                                    <span className="meta-label">Date of Birth</span>
                                                    <span className="meta-val">{passenger?.dateOfBirth || "—"}</span>
                                                </div>
                                                {isInternational && (
                                                    <>
                                                        <div className="passenger-meta-item">
                                                            <span className="meta-label">Nationality</span>
                                                            <span className="meta-val">{passenger?.nationality || "—"}</span>
                                                        </div>
                                                        <div className="passenger-meta-item">
                                                            <span className="meta-label">Passport No.</span>
                                                            <span className="meta-val">{passenger?.passportNumber || "—"}</span>
                                                        </div>
                                                        <div className="passenger-meta-item">
                                                            <span className="meta-label">Expires</span>
                                                            <span className="meta-val">{passenger?.passportExpiry || "—"}</span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* RIGHT: CONTACT DETAILS */}
                    <section className="review-glass-card compact-card contact-compact-card">
                        <div className="review-card-header">
                            <div className="header-icon-title">
                                <span className="review-heading-icon">📞</span>
                                <div>
                                    <h2>Contact Details</h2>
                                    <p className="review-header-sub">E-ticket & updates recipient</p>
                                </div>
                            </div>
                            {!isEditingContact && (
                                <button
                                    type="button"
                                    className="review-edit-btn"
                                    onClick={handleStartEditContact}
                                >
                                    ✏️ Edit
                                </button>
                            )}
                        </div>

                        {isEditingContact ? (
                            /* INLINE EDIT CONTACT */
                            <div className="compact-edit-form">
                                <div className="edit-field" style={{ marginBottom: "12px" }}>
                                    <label>Email Address*</label>
                                    <input
                                        type="email"
                                        maxLength={100}
                                        value={tempContactInfo.email || ""}
                                        onChange={(e) => handleContactInputChange("email", e.target.value)}
                                        className={editErrors.email ? "input-err" : ""}
                                        placeholder="name@example.com"
                                    />
                                    {editErrors.email && <span className="err-msg">{editErrors.email}</span>}
                                </div>

                                <div className="edit-field" style={{ marginBottom: "16px" }}>
                                    <label>Mobile Number*</label>
                                    <PhoneInput
                                        countryCode={tempContactInfo.countryCode || "+1"}
                                        onCountryCodeChange={(code) => {
                                            setTempContactInfo((prev) => ({
                                                ...prev,
                                                countryCode: code,
                                            }));
                                        }}
                                        value={tempContactInfo.phone || ""}
                                        onChange={(e) => handleContactInputChange("phone", e.target.value)}
                                        name="phone"
                                        placeholder="Phone number"
                                        error={editErrors.phone}
                                    />
                                    {editErrors.phone && <span className="err-msg">{editErrors.phone}</span>}
                                </div>

                                <div className="compact-edit-actions">
                                    <button
                                        type="button"
                                        className="compact-cancel-btn"
                                        onClick={handleCancelEditContact}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="compact-save-btn"
                                        onClick={handleSaveContact}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* VIEW MODE */
                            <div className="compact-contact-view">
                                <div className="contact-detail-row">
                                    <div className="contact-item-icon">✉️</div>
                                    <div className="contact-item-info">
                                        <span className="meta-label">Email Address</span>
                                        <strong className="contact-item-val">{editableContactInfo?.email || "—"}</strong>
                                    </div>
                                </div>

                                <div className="contact-detail-row">
                                    <div className="contact-item-icon">📱</div>
                                    <div className="contact-item-info">
                                        <span className="meta-label">Mobile Phone</span>
                                        <strong className="contact-item-val">
                                            {editableContactInfo?.countryCode ? `${editableContactInfo.countryCode} ` : ""}
                                            {editableContactInfo?.phone || "—"}
                                        </strong>
                                    </div>
                                </div>

                                <div className="contact-safety-note">
                                    <span>🔒</span>
                                    <p>Your e-ticket & flight alerts will be sent here instantly after payment confirmation.</p>
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                {/* =================================================
                    3. SEAT SELECTION & FLIGHT SUMMARY (SIDE-BY-SIDE)
                ================================================= */}
                <div className="seat-summary-side-by-side">
                    {/* LEFT COLUMN: SEAT SELECTION + ACTION BUTTONS */}
                    <div className="seat-selection-column">
                        <section className="review-glass-card seat-selection-card">
                            <div className="review-card-header">
                                <div className="header-icon-title">
                                    <span className="review-heading-icon">💺</span>
                                    <div>
                                        <h2>Seat Selection</h2>
                                        <p className="review-header-sub">
                                            Select seats or fly with free auto-assigned seating
                                        </p>
                                    </div>
                                </div>

                                <div className="seat-actions-group">
                                    <button
                                        type="button"
                                        className="seat-action-btn primary-seat-btn"
                                        onClick={handleSelectSeats}
                                    >
                                        {hasAnySeatsSelected ? "💺 Change Seats" : "💺 Choose Seats"}
                                    </button>
                                    {hasAnySeatsSelected && (
                                        <button
                                            type="button"
                                            className="seat-action-btn reset-seat-btn"
                                            onClick={handleResetSeats}
                                            title="Clear chosen seats and use free auto-assigned seats"
                                        >
                                            ✕ Reset
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="review-seat-passengers-list">
                                {editablePassengers.map((passenger, index) => {
                                    const departureSeat = getPassengerSeat(index, "departure");
                                    const returnSeat = selectedReturn ? getPassengerSeat(index, "return") : null;
                                    const departurePrice = getSeatPrice(index, "departure");
                                    const returnPrice = selectedReturn ? getSeatPrice(index, "return") : 0;

                                    return (
                                        <div className="review-seat-passenger-row" key={index}>
                                            <div className="seat-passenger-info">
                                                <span className="seat-passenger-num">P{index + 1}</span>
                                                <div>
                                                    <strong className="seat-passenger-name">
                                                        {passenger?.firstName || passenger?.lastName
                                                            ? `${passenger?.firstName || ""} ${passenger?.lastName || ""}`.trim()
                                                            : passenger?.label || `Passenger ${index + 1}`}
                                                    </strong>
                                                    <span className="seat-passenger-tag">
                                                        {passenger?.passengerType || "Adult"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="seat-assignments-group">
                                                {/* Departure Seat */}
                                                <div className="seat-badge-wrapper">
                                                    <span className="seat-leg-label">Departure:</span>
                                                    {departureSeat ? (
                                                        <span className="seat-badge selected-seat">
                                                            Seat {departureSeat}{" "}
                                                            {departurePrice > 0 ? `($${departurePrice})` : "(Free)"}
                                                        </span>
                                                    ) : (
                                                        <span className="seat-badge auto-seat">
                                                            Auto-assigned (Free)
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Return Seat */}
                                                {selectedReturn && (
                                                    <div className="seat-badge-wrapper">
                                                        <span className="seat-leg-label">Return:</span>
                                                        {returnSeat ? (
                                                            <span className="seat-badge selected-seat">
                                                                Seat {returnSeat}{" "}
                                                                {returnPrice > 0 ? `($${returnPrice})` : "(Free)"}
                                                            </span>
                                                        ) : (
                                                            <span className="seat-badge auto-seat">
                                                                Auto-assigned (Free)
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* BUTTONS DIRECTLY UNDER SEAT SELECTION BOX (DESKTOP) */}
                        <div className="seat-column-actions desktop-only-actions">
                            <button
                                type="button"
                                className="review-back-btn"
                                onClick={handleBackToTravelerDetails}
                            >
                                ← Back to Traveler Details
                            </button>

                            <button
                                type="button"
                                className="review-proceed-btn"
                                onClick={handleContinuePayment}
                            >
                                Proceed to Payment
                                <span className="btn-arrow-icon">→</span>
                            </button>
                        </div>
                    </div>

                    {/* RIGHT: FLIGHT SUMMARY (ALL IN USD $) */}
                    <aside className="review-glass-card flight-summary-card">
                        <div className="review-card-header">
                            <div className="header-icon-title">
                                <span className="review-heading-icon">🧾</span>
                                <div>
                                    <h2>Fare Summary</h2>
                                    <p className="review-header-sub">Prices in USD ($)</p>
                                </div>
                            </div>
                        </div>

                        <div className="summary-breakdown-body">
                            <div className="summary-line-item">
                                <span className="summary-item-label">Flight Base Fare & Taxes</span>
                                <span className="summary-item-value">$ {formatPrice(flightFare)}</span>
                            </div>

                            <div className="summary-line-item">
                                <span className="summary-item-label">Seat Selection</span>
                                <span className="summary-item-value">
                                    {calculatedSeatCharges > 0
                                        ? `$ ${formatPrice(calculatedSeatCharges)}`
                                        : "$0 (Free Auto-assigned)"}
                                </span>
                            </div>

                            {appliedPromo && promoDiscountAmount > 0 && (
                                <div className="summary-line-item promo-discount-line">
                                    <span className="summary-item-label">🏷️ Promo Discount ({appliedPromo.code})</span>
                                    <span className="summary-item-value discount-val">
                                        - $ {formatPrice(promoDiscountAmount)}
                                    </span>
                                </div>
                            )}

                            <div className="summary-price-divider"></div>

                            <div className="summary-grand-total-row">
                                <div className="total-label-stack">
                                    <span className="grand-total-title">Total Amount</span>
                                    <span className="grand-total-sub">Includes all taxes & carrier fees</span>
                                </div>
                                <span className="grand-total-price">
                                    $ {formatPrice(grandTotalPrice)}
                                </span>
                            </div>

                            <div className="summary-trust-bullets">
                                <div className="trust-bullet">
                                    <span className="trust-check">✓</span>
                                    <span>Instant Duffel E-Ticket Confirmation</span>
                                </div>
                                <div className="trust-bullet">
                                    <span className="trust-check">✓</span>
                                    <span>Guaranteed USD Pricing (No Hidden Fees)</span>
                                </div>
                                <div className="trust-bullet">
                                    <span className="trust-check">✓</span>
                                    <span>24/7 Dedicated Support Assistance</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* =================================================
                        MOBILE ONLY: PROCEED BUTTON AT VERY LAST OF ALL SECTIONS
                    ================================================= */}
                    <div className="seat-column-actions mobile-only-actions">
                        <button
                            type="button"
                            className="review-back-btn"
                            onClick={handleBackToTravelerDetails}
                        >
                            ← Back to Traveler Details
                        </button>

                        <button
                            type="button"
                            className="review-proceed-btn"
                            onClick={handleContinuePayment}
                        >
                            Proceed to Payment
                            <span className="btn-arrow-icon">→</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* =================================================
                COMPACT POPUP AUTH MODAL (NO IMAGES, GREY & ORANGE)
            ================================================= */}
            {/* COMPACT AUTH MODAL (CLEAN GREY & ORANGE) */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode={authMode}
                initialEmail={authEmail}
                initialName={authName}
                onSuccess={() => {
                    setIsAuthModalOpen(false);
                    const paymentState = buildHubState();
                    navigate("/payment", { state: paymentState });
                }}
            />
        </main>
    );
}

export default BookingReview;