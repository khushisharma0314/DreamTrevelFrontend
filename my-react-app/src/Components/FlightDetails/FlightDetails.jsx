import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PhoneInput from "../Common/PhoneInput";
import {
    detectIsInternational,
    saveBookingSession,
    getBookingSession
} from "../../utils/flightUtils";
import userDetailsBg from "../../assets/userdetails.png";
import "./FlightDetails.css";

function FlightDetails() {
    const location = useLocation();
    const navigate = useNavigate();

    const sessionState = getBookingSession()?.state || {};
    const locationState = location.state || {};

    const activeState = {
        ...sessionState,
        ...locationState,
    };

    const {
        selectedDeparture,
        selectedReturn,
        searchData,
        selectedFromCity,
        selectedToCity,
    } = activeState;

    const initialSavedPassengers =
        (Array.isArray(locationState.passengers) && locationState.passengers.length > 0)
            ? locationState.passengers
            : (Array.isArray(sessionState.passengers) && sessionState.passengers.length > 0)
                ? sessionState.passengers
                : null;

    const initialSavedContact =
        (locationState.contactInfo && (locationState.contactInfo.email || locationState.contactInfo.phone))
            ? locationState.contactInfo
            : (sessionState.contactInfo && (sessionState.contactInfo.email || sessionState.contactInfo.phone))
                ? sessionState.contactInfo
                : null;

    const initialSavedPromo =
        locationState.appliedPromo !== undefined
            ? locationState.appliedPromo
            : sessionState.appliedPromo || null;

    const [contactInfo, setContactInfo] = useState(
        initialSavedContact || {
            email: "",
            phone: "",
            countryCode: "+1",
        }
    );

    const [passengers, setPassengers] = useState(() => {
        if (Array.isArray(initialSavedPassengers) && initialSavedPassengers.length > 0) {
            return initialSavedPassengers;
        }
        return [];
    });
    const [appliedPromo, setAppliedPromo] = useState(initialSavedPromo || null);
    const [errors, setErrors] = useState({});

    // Offers Modal State
    const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
    const [customPromoInput, setCustomPromoInput] = useState("");
    const [promoFeedback, setPromoFeedback] = useState({ error: "", success: "" });

    const adults = Number(searchData?.adults || 1);
    const children = Number(searchData?.children || 0);
    const infants = Number(searchData?.infants || 0);

    const totalPassengersCount = adults + children + infants;

    // International Flight Check
    const isInternational = detectIsInternational(
        selectedFromCity,
        selectedToCity,
        searchData,
        selectedDeparture
    );

    // Available Travel Offers
    const availableOffers = [
        {
            code: "FLYHIGH15",
            title: "Instant Flight Savings",
            discount: 15,
            minBooking: 50,
            desc: "Get $15 off on all domestic & international bookings",
            tag: "POPULAR",
        },
        {
            code: "DREAM25",
            title: "Special Traveler Discount",
            discount: 25,
            minBooking: 100,
            desc: "Save $25 on bookings over $100",
            tag: "BEST VALUE",
        },
        {
            code: "GLOBAL40",
            title: "International Explorer Deal",
            discount: 40,
            minBooking: 150,
            desc: "Save $40 on all long-haul international flights",
            tag: "LIMITED TIME",
        },
    ];

    /* =========================================================
       INITIALIZE PASSENGERS
    ========================================================= */
    useEffect(() => {
        if (!searchData) return;

        if (passengers.length === totalPassengersCount && passengers.some(p => p.firstName || p.lastName || p.dateOfBirth)) {
            return;
        }

        const initialPassengers = [];

        // Adults
        for (let i = 0; i < adults; i++) {
            const saved = (initialSavedPassengers || []).find((p, idx) => p.passengerType === "ADULT" && idx === i) || (initialSavedPassengers || [])[i];
            initialPassengers.push({
                firstName: saved?.firstName || "",
                lastName: saved?.lastName || "",
                gender: saved?.gender || "",
                dateOfBirth: saved?.dateOfBirth || "",
                passengerType: "ADULT",
                label: `Adult ${i + 1}`,
                nationality: saved?.nationality || "",
                passportNumber: saved?.passportNumber || "",
                passportExpiry: saved?.passportExpiry || "",
                passportIssuingCountry: saved?.passportIssuingCountry || "",
            });
        }

        // Children
        for (let i = 0; i < children; i++) {
            const saved = (initialSavedPassengers || []).find((p, idx) => p.passengerType === "CHILD" && idx === (adults + i)) || (initialSavedPassengers || [])[adults + i];
            initialPassengers.push({
                firstName: saved?.firstName || "",
                lastName: saved?.lastName || "",
                gender: saved?.gender || "",
                dateOfBirth: saved?.dateOfBirth || "",
                passengerType: "CHILD",
                label: `Child ${i + 1}`,
                nationality: saved?.nationality || "",
                passportNumber: saved?.passportNumber || "",
                passportExpiry: saved?.passportExpiry || "",
                passportIssuingCountry: saved?.passportIssuingCountry || "",
            });
        }

        // Infants
        for (let i = 0; i < infants; i++) {
            const saved = (initialSavedPassengers || []).find((p, idx) => p.passengerType === "INFANT" && idx === (adults + children + i)) || (initialSavedPassengers || [])[adults + children + i];
            initialPassengers.push({
                firstName: saved?.firstName || "",
                lastName: saved?.lastName || "",
                gender: saved?.gender || "",
                dateOfBirth: saved?.dateOfBirth || "",
                passengerType: "INFANT",
                label: `Infant ${i + 1}`,
                nationality: saved?.nationality || "",
                passportNumber: saved?.passportNumber || "",
                passportExpiry: saved?.passportExpiry || "",
                passportIssuingCountry: saved?.passportIssuingCountry || "",
            });
        }

        setPassengers(initialPassengers);
    }, [searchData, adults, children, infants]);

    /* =========================================================
       PERSIST BOOKING STATE
    ========================================================= */
    useEffect(() => {
        if (searchData && selectedDeparture) {
            saveBookingSession("/flight-details", {
                selectedDeparture,
                selectedReturn,
                searchData,
                selectedFromCity,
                selectedToCity,
                passengers,
                contactInfo,
                isInternational,
                appliedPromo,
            });
        }
    }, [
        selectedDeparture,
        selectedReturn,
        searchData,
        selectedFromCity,
        selectedToCity,
        passengers,
        contactInfo,
        isInternational,
        appliedPromo,
    ]);

    /* =========================================================
       SESSION CHECK
    ========================================================= */
    if (!searchData || !selectedDeparture) {
        return (
            <main className="flight-details-page">
                <div className="details-error-card">
                    <h2>Session Expired</h2>
                    <p>
                        We could not retrieve your flight selection. Please search for a flight again.
                    </p>
                    <button type="button" onClick={() => navigate("/")}>
                        Go to Search
                    </button>
                </div>
            </main>
        );
    }

    /* =========================================================
       USD PRICE CALCULATIONS
    ========================================================= */
    const toUSD = (val) => {
        let num = Number(val || 0);
        if (num > 500) {
            // Convert INR mock to realistic USD
            num = Math.round((num / 83.5) * 100) / 100;
        }
        return num;
    };

    const depPriceUSD = toUSD(selectedDeparture.price);
    const retPriceUSD = selectedReturn ? toUSD(selectedReturn.price) : 0;
    const basePricePerPersonUSD = depPriceUSD + retPriceUSD;

    const totalBasePrice = Math.round(basePricePerPersonUSD * totalPassengersCount * 100) / 100;
    const taxesAndFees = Math.round((totalBasePrice * 0.12 + 14 * totalPassengersCount) * 100) / 100;
    const subtotalPrice = Math.round((totalBasePrice + taxesAndFees) * 100) / 100;

    const promoDiscountAmount = Number(appliedPromo?.discountAmount || 0);
    const grandTotalPrice = Math.max(0, Math.round((subtotalPrice - promoDiscountAmount) * 100) / 100);

    const formatUSD = (amount) => {
        return `$${Number(amount || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    /* =========================================================
       HANDLERS: CHANGE FLIGHTS
    ========================================================= */
    const handleChangeDeparture = () => {
        navigate("/flight-results", {
            state: {
                searchData,
                selectedFromCity,
                selectedToCity,
                selectedDeparture: null,
                selectedReturn: selectedReturn || null,
                changeFlight: "departure",
            },
        });
    };

    const handleChangeReturn = () => {
        navigate("/flight-results", {
            state: {
                searchData,
                selectedFromCity,
                selectedToCity,
                selectedDeparture,
                selectedReturn: null,
                changeFlight: "return",
            },
        });
    };

    /* =========================================================
       CONTACT & PASSENGER HANDLERS
    ========================================================= */
    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setContactInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handlePassengerChange = (index, field, value) => {
        let sanitizedValue = value;
        if (field === "dateOfBirth" && sanitizedValue) {
            const parts = sanitizedValue.split("-");
            const currentYear = new Date().getFullYear();
            if (parts[0]) {
                if (parts[0].length > 4) {
                    parts[0] = parts[0].slice(0, 4);
                }
                const yr = parseInt(parts[0], 10);
                if (!isNaN(yr) && parts[0].length === 4 && yr > currentYear) {
                    parts[0] = String(currentYear);
                }
                sanitizedValue = parts.join("-");
            }
        } else if ((field === "firstName" || field === "lastName") && sanitizedValue) {
            sanitizedValue = sanitizedValue.replace(/[^A-Za-z\s'-]/g, "");
        }

        setPassengers((prev) => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                [field]: sanitizedValue,
            };
            return updated;
        });

        setErrors((prev) => ({
            ...prev,
            [`p_${index}_${field}`]: "",
        }));
    };

    /* =========================================================
       PROMO / OFFERS APPLY & REMOVE
    ========================================================= */
    const handleApplyOffer = (offer) => {
        if (subtotalPrice < (offer.minBooking || 0)) {
            setPromoFeedback({
                error: `Minimum booking of ${formatUSD(offer.minBooking)} required for code ${offer.code}.`,
                success: "",
            });
            return;
        }

        setAppliedPromo({
            code: offer.code,
            title: offer.title,
            discountAmount: offer.discount,
        });

        setPromoFeedback({
            error: "",
            success: `Awesome! Promo ${offer.code} applied. You saved ${formatUSD(offer.discount)}!`,
        });

        setTimeout(() => {
            setIsOffersModalOpen(false);
            setPromoFeedback({ error: "", success: "" });
        }, 800);
    };

    const handleApplyCustomCode = (e) => {
        if (e) e.preventDefault();
        const code = customPromoInput.trim().toUpperCase();
        if (!code) {
            setPromoFeedback({ error: "Please enter a valid coupon code.", success: "" });
            return;
        }

        const found = availableOffers.find((o) => o.code.toUpperCase() === code);
        if (found) {
            handleApplyOffer(found);
            setCustomPromoInput("");
        } else {
            if (code.length >= 4) {
                const disc = Math.min(30, Math.round(subtotalPrice * 0.1));
                setAppliedPromo({
                    code: code,
                    title: "Special Promotional Offer",
                    discountAmount: disc > 0 ? disc : 10,
                });
                setPromoFeedback({
                    error: "",
                    success: `Promo ${code} applied successfully!`,
                });
                setCustomPromoInput("");
                setTimeout(() => {
                    setIsOffersModalOpen(false);
                    setPromoFeedback({ error: "", success: "" });
                }, 800);
            } else {
                setPromoFeedback({
                    error: "Invalid or expired promo code. Please try another code.",
                    success: "",
                });
            }
        }
    };

    const handleRemovePromo = () => {
        setAppliedPromo(null);
        setPromoFeedback({ error: "", success: "" });
    };

    /* =========================================================
       VALIDATION
    ========================================================= */
    const validateForm = () => {
        const newErrors = {};

        // Contact Email
        if (!contactInfo.email || !contactInfo.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(contactInfo.email.trim())) {
            newErrors.email = "Please enter a valid email address.";
        }

        // Contact Phone
        const rawPhone = contactInfo.phone || "";
        const cleanDigits = rawPhone.replace(/\D/g, "");
        if (!rawPhone.trim()) {
            newErrors.phone = "Phone number is required.";
        } else if (cleanDigits.length < 7 || cleanDigits.length > 15) {
            newErrors.phone = "Please enter a valid phone number (7-15 digits).";
        }

        // Passenger Details
        passengers.forEach((passenger, index) => {
            const trimmedFirstName = (passenger.firstName || "").trim();
            if (!trimmedFirstName) {
                newErrors[`p_${index}_firstName`] = "First name is required.";
            } else if (trimmedFirstName.length < 2) {
                newErrors[`p_${index}_firstName`] = "First name must be at least 2 characters.";
            } else if (!/^[A-Za-z\s'-]+$/.test(trimmedFirstName)) {
                newErrors[`p_${index}_firstName`] = "First name can only contain letters and spaces.";
            }

            const trimmedLastName = (passenger.lastName || "").trim();
            if (!trimmedLastName) {
                newErrors[`p_${index}_lastName`] = "Last name is required.";
            } else if (trimmedLastName.length < 2) {
                newErrors[`p_${index}_lastName`] = "Last name must be at least 2 characters.";
            } else if (!/^[A-Za-z\s'-]+$/.test(trimmedLastName)) {
                newErrors[`p_${index}_lastName`] = "Last name can only contain letters and spaces.";
            }

            if (!passenger.gender) {
                newErrors[`p_${index}_gender`] = "Gender is required.";
            }

            if (!passenger.dateOfBirth) {
                newErrors[`p_${index}_dateOfBirth`] = "Date of birth is required.";
            } else {
                const dobParts = passenger.dateOfBirth.split("-");
                const birthYear = parseInt(dobParts[0], 10);
                const currentYear = new Date().getFullYear();
                const today = new Date();
                const todayStr = today.toISOString().split("T")[0];
                const birthDate = new Date(passenger.dateOfBirth);

                if (
                    dobParts[0].length !== 4 ||
                    isNaN(birthYear) ||
                    birthYear < 1900 ||
                    birthYear > currentYear ||
                    isNaN(birthDate.getTime())
                ) {
                    newErrors[`p_${index}_dateOfBirth`] = `Birth year cannot exceed ${currentYear} and must be after 1900.`;
                } else if (passenger.dateOfBirth > todayStr) {
                    newErrors[`p_${index}_dateOfBirth`] = "Date of birth cannot be in the future.";
                } else {
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const monthDiff = today.getMonth() - birthDate.getMonth();
                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }

                    const pType = (passenger.passengerType || "ADULT").toUpperCase();
                    if (pType === "ADULT" && age < 12) {
                        newErrors[`p_${index}_dateOfBirth`] = "Adult passenger must be at least 12 years old.";
                    } else if (pType === "CHILD" && (age < 2 || age >= 12)) {
                        newErrors[`p_${index}_dateOfBirth`] = "Child passenger must be between 2 and 11 years old.";
                    } else if (pType === "INFANT" && (age < 0 || age >= 2)) {
                        newErrors[`p_${index}_dateOfBirth`] = "Infant passenger must be under 2 years old.";
                    }
                }
            }

            // International details
            if (isInternational) {
                if (!passenger.nationality || !passenger.nationality.trim()) {
                    newErrors[`p_${index}_nationality`] = "Nationality is required.";
                }
                if (!passenger.passportNumber || !passenger.passportNumber.trim()) {
                    newErrors[`p_${index}_passportNumber`] = "Passport number is required.";
                } else if (!/^[A-Za-z0-9]{6,15}$/.test(passenger.passportNumber.trim())) {
                    newErrors[`p_${index}_passportNumber`] = "Passport number must be 6-15 alphanumeric characters.";
                }
                const todayStr = new Date().toISOString().split("T")[0];
                if (!passenger.passportExpiry) {
                    newErrors[`p_${index}_passportExpiry`] = "Passport expiry date is required.";
                } else if (passenger.passportExpiry <= todayStr) {
                    newErrors[`p_${index}_passportExpiry`] = "Passport has expired or must be a future date.";
                }
                if (!passenger.passportIssuingCountry || !passenger.passportIssuingCountry.trim()) {
                    newErrors[`p_${index}_passportIssuingCountry`] = "Passport issuing country is required.";
                }
            }
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setTimeout(() => {
                const firstErrorKey = Object.keys(newErrors)[0];
                const element = document.getElementsByName(firstErrorKey)[0];
                if (element) {
                    element.focus();
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }, 0);
            return false;
        }

        return true;
    };

    /* =========================================================
       SUBMIT & PROCEED
    ========================================================= */
    const handleSubmitBooking = (e) => {
        e.preventDefault();

        const isValid = validateForm();
        if (!isValid) return;

        const passengerData = passengers.map((passenger) => ({
            firstName: passenger.firstName.trim(),
            lastName: passenger.lastName.trim(),
            gender: passenger.gender,
            dateOfBirth: passenger.dateOfBirth,
            passengerType: passenger.passengerType,
            label: passenger.label,
            ...(isInternational && {
                nationality: passenger.nationality.trim(),
                passportNumber: passenger.passportNumber.trim(),
                passportExpiry: passenger.passportExpiry,
                passportIssuingCountry: passenger.passportIssuingCountry.trim(),
            }),
        }));

        const contactData = {
            email: contactInfo.email.trim(),
            phone: contactInfo.phone.trim(),
            countryCode: contactInfo.countryCode || "+1",
            fullPhone: `${contactInfo.countryCode || "+1"} ${contactInfo.phone.trim()}`,
        };

        const pricingData = {
            totalBasePrice,
            taxesAndFees,
            subtotalPrice,
            discountAmount: promoDiscountAmount,
            promoCode: appliedPromo?.code || null,
            grandTotalPrice,
            currency: "USD",
        };

        navigate("/booking-review", {
            state: {
                selectedDeparture,
                selectedReturn,
                searchData,
                selectedFromCity,
                selectedToCity,
                isInternational,
                appliedPromo,
                passengers: passengerData,
                contactInfo: contactData,
                pricing: pricingData,
                selectedSeats: {},
                totalSeatCharges: 0,
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
                finalTotalPrice: pricingData.grandTotalPrice,
            },
        });
    };

    return (
        <main
            className="flight-details-page"
            style={{
                backgroundImage: `url(${userDetailsBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
                backgroundAttachment: "fixed",
            }}
        >
            <div className="flight-details-container">
                {/* =================================================
                    STEPPER BAR (MATCHING SCREENSHOT)
                ================================================= */}
                <div className="details-stepper-wrapper">
                    <div className="details-stepper">
                        {/* Step 1 */}
                        <div className="stepper-step completed">
                            <span className="step-circle step-circle-completed">1</span>
                            <span className="step-label">Flight Selection</span>
                        </div>
                        <div className="stepper-line completed-line"></div>

                        {/* Step 2 (Active) */}
                        <div className="stepper-step active">
                            <span className="step-circle step-circle-active">2</span>
                            <span className="step-label active-label">Traveler Details</span>
                        </div>
                        <div className="stepper-line"></div>

                        {/* Step 3 */}
                        <div className="stepper-step">
                            <span className="step-circle">3</span>
                            <span className="step-label">Review & Customise</span>
                        </div>
                        <div className="stepper-line"></div>

                        {/* Step 4 */}
                        <div className="stepper-step">
                            <span className="step-circle">4</span>
                            <span className="step-label">Payment</span>
                        </div>
                    </div>
                </div>

                {/* =================================================
                    HORIZONTAL FLIGHT SUMMARY STRIP (TOP) + VIEW OFFERS
                ================================================= */}
                <section className="horizontal-flight-summary-strip">
                    <div className="summary-left-flights">
                        {/* Departure Summary */}
                        <div className="summary-segment">
                            <div className="segment-badge-row">
                                <span className="flight-tag-badge">DEPARTURE</span>
                                <button
                                    type="button"
                                    className="summary-change-btn"
                                    onClick={handleChangeDeparture}
                                >
                                    Change
                                </button>
                            </div>
                            <div className="segment-main-info">
                                <h4 className="segment-airline">
                                    {selectedDeparture.airline || "Airline"} ({selectedDeparture.flightNumber || "Flight"})
                                </h4>
                                <div className="segment-route">
                                    <strong>{selectedDeparture.from || searchData?.fromCity || "Origin"}</strong>
                                    <span className="route-arrow">→</span>
                                    <strong>{selectedDeparture.to || searchData?.toCity || "Dest"}</strong>
                                </div>
                                <div className="segment-time-pill">
                                    <span>📅 {selectedDeparture.departureDate || searchData?.departureDate || ""} • {selectedDeparture.departureTime || "--:--"}</span>
                                    {selectedDeparture.fareTierName && (
                                        <span className="segment-fare-tier">
                                            🏷️ {selectedDeparture.fareTierName}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Return Summary (if roundtrip) */}
                        {selectedReturn && (
                            <div className="summary-segment return-segment">
                                <div className="segment-badge-row">
                                    <span className="flight-tag-badge return-tag-badge">RETURN</span>
                                    <button
                                        type="button"
                                        className="summary-change-btn"
                                        onClick={handleChangeReturn}
                                    >
                                        Change
                                    </button>
                                </div>
                                <div className="segment-main-info">
                                    <h4 className="segment-airline">
                                        {selectedReturn.airline || "Airline"} ({selectedReturn.flightNumber || "Flight"})
                                    </h4>
                                    <div className="segment-route">
                                        <strong>{selectedReturn.from || "Origin"}</strong>
                                        <span className="route-arrow">→</span>
                                        <strong>{selectedReturn.to || "Dest"}</strong>
                                    </div>
                                    <div className="segment-time-pill">
                                        <span>📅 {selectedReturn.departureDate || ""} • {selectedReturn.departureTime || "--:--"}</span>
                                        {selectedReturn.fareTierName && (
                                            <span className="segment-fare-tier">
                                                🏷️ {selectedReturn.fareTierName}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* View Offers Button + Applied Promo Badge */}
                    <div className="summary-right-actions">
                        {appliedPromo ? (
                            <div className="applied-offer-pill">
                                <div className="offer-pill-info">
                                    <span className="offer-pill-check">✓</span>
                                    <span className="offer-pill-code">{appliedPromo.code}</span>
                                    <span className="offer-pill-save">(-{formatUSD(appliedPromo.discountAmount)})</span>
                                </div>
                                <button
                                    type="button"
                                    className="offer-pill-remove"
                                    onClick={handleRemovePromo}
                                    title="Remove promo"
                                >
                                    ✕
                                </button>
                            </div>
                        ) : null}

                        <button
                            type="button"
                            className="view-offers-action-btn"
                            onClick={() => {
                                setPromoFeedback({ error: "", success: "" });
                                setIsOffersModalOpen(true);
                            }}
                        >
                            <span className="offer-btn-sparkle">🏷️</span>
                            <span>{appliedPromo ? "Change Offer" : "View Offers"}</span>
                        </button>
                    </div>
                </section>

                {/* =================================================
                    MAIN CONTENT: UNIFIED FORM WITH EMBEDDED PRICE DETAILS
                ================================================= */}
                <form className="details-form-card" onSubmit={handleSubmitBooking} noValidate>
                    {/* FORM HEADER */}
                    <div className="form-card-header">
                        <h2>Traveler Details</h2>
                        <p className="form-card-sub">
                            Please enter traveler information exactly as it appears on their official government-issued ID.
                        </p>
                        {isInternational && (
                            <div className="intl-passport-alert">
                                <span className="alert-dot">🔵</span>
                                <span>International flight: Passport details are required for all travelers.</span>
                            </div>
                        )}
                    </div>

                    {/* =================================================
                        PASSENGER (LEFT) & CONTACT (RIGHT)
                    ================================================= */}
                    <div className="traveler-contact-side-by-side">
                        {/* LEFT SECTION: PASSENGER FORMS */}
                        <div className="passenger-section-column">
                            <div className="passengers-list-wrapper">
                                {passengers.map((passenger, index) => (
                                    <div className="passenger-entry-box" key={index}>
                                        <div className="passenger-box-title">
                                            <span className="passenger-icon">👤</span>
                                            <h3>
                                                {passenger.label} ({passenger.passengerType})
                                            </h3>
                                        </div>

                                        <div className="details-inputs-grid">
                                            {/* FIRST NAME */}
                                            <div className="custom-form-group">
                                                <label>First Name*</label>
                                                <input
                                                    type="text"
                                                    placeholder="First name"
                                                    name={`p_${index}_firstName`}
                                                    maxLength={50}
                                                    value={passenger.firstName}
                                                    onChange={(e) => handlePassengerChange(index, "firstName", e.target.value)}
                                                    className={errors[`p_${index}_firstName`] ? "input-err" : ""}
                                                />
                                                {errors[`p_${index}_firstName`] && (
                                                    <span className="field-err-msg">{errors[`p_${index}_firstName`]}</span>
                                                )}
                                            </div>

                                            {/* LAST NAME */}
                                            <div className="custom-form-group">
                                                <label>Last Name*</label>
                                                <input
                                                    type="text"
                                                    placeholder="Last name"
                                                    name={`p_${index}_lastName`}
                                                    maxLength={50}
                                                    value={passenger.lastName}
                                                    onChange={(e) => handlePassengerChange(index, "lastName", e.target.value)}
                                                    className={errors[`p_${index}_lastName`] ? "input-err" : ""}
                                                />
                                                {errors[`p_${index}_lastName`] && (
                                                    <span className="field-err-msg">{errors[`p_${index}_lastName`]}</span>
                                                )}
                                            </div>

                                            {/* GENDER */}
                                            <div className="custom-form-group">
                                                <label>Gender*</label>
                                                <select
                                                    name={`p_${index}_gender`}
                                                    value={passenger.gender}
                                                    onChange={(e) => handlePassengerChange(index, "gender", e.target.value)}
                                                    className={errors[`p_${index}_gender`] ? "input-err" : ""}
                                                >
                                                    <option value="">Select Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                {errors[`p_${index}_gender`] && (
                                                    <span className="field-err-msg">{errors[`p_${index}_gender`]}</span>
                                                )}
                                            </div>

                                            {/* DATE OF BIRTH */}
                                            <div className="custom-form-group">
                                                <label>Date of Birth*</label>
                                                <input
                                                    type="date"
                                                    name={`p_${index}_dateOfBirth`}
                                                    min="1900-01-01"
                                                    max={new Date().toISOString().split("T")[0]}
                                                    value={passenger.dateOfBirth}
                                                    onChange={(e) => handlePassengerChange(index, "dateOfBirth", e.target.value)}
                                                    className={errors[`p_${index}_dateOfBirth`] ? "input-err" : ""}
                                                />
                                                {errors[`p_${index}_dateOfBirth`] && (
                                                    <span className="field-err-msg">{errors[`p_${index}_dateOfBirth`]}</span>
                                                )}
                                            </div>

                                            {/* INTERNATIONAL FIELDS */}
                                            {isInternational && (
                                                <>
                                                    {/* NATIONALITY */}
                                                    <div className="custom-form-group">
                                                        <label>Nationality*</label>
                                                        <input
                                                            type="text"
                                                            placeholder="e.g. Indian"
                                                            name={`p_${index}_nationality`}
                                                            maxLength={50}
                                                            value={passenger.nationality}
                                                            onChange={(e) => handlePassengerChange(index, "nationality", e.target.value)}
                                                            className={errors[`p_${index}_nationality`] ? "input-err" : ""}
                                                        />
                                                        {errors[`p_${index}_nationality`] && (
                                                            <span className="field-err-msg">{errors[`p_${index}_nationality`]}</span>
                                                        )}
                                                    </div>

                                                    {/* PASSPORT NUMBER */}
                                                    <div className="custom-form-group">
                                                        <label>Passport Number*</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter passport number"
                                                            name={`p_${index}_passportNumber`}
                                                            maxLength={15}
                                                            value={passenger.passportNumber}
                                                            onChange={(e) => handlePassengerChange(index, "passportNumber", e.target.value)}
                                                            className={errors[`p_${index}_passportNumber`] ? "input-err" : ""}
                                                        />
                                                        {errors[`p_${index}_passportNumber`] && (
                                                            <span className="field-err-msg">{errors[`p_${index}_passportNumber`]}</span>
                                                        )}
                                                    </div>

                                                    {/* PASSPORT EXPIRY */}
                                                    <div className="custom-form-group">
                                                        <label>Passport Expiry*</label>
                                                        <input
                                                            type="date"
                                                            name={`p_${index}_passportExpiry`}
                                                            min={new Date().toISOString().split("T")[0]}
                                                            value={passenger.passportExpiry}
                                                            onChange={(e) => handlePassengerChange(index, "passportExpiry", e.target.value)}
                                                            className={errors[`p_${index}_passportExpiry`] ? "input-err" : ""}
                                                        />
                                                        {errors[`p_${index}_passportExpiry`] && (
                                                            <span className="field-err-msg">{errors[`p_${index}_passportExpiry`]}</span>
                                                        )}
                                                    </div>

                                                    {/* PASSPORT ISSUING COUNTRY */}
                                                    <div className="custom-form-group">
                                                        <label>Passport Issuing Country*</label>
                                                        <input
                                                            type="text"
                                                            placeholder="e.g. India"
                                                            name={`p_${index}_passportIssuingCountry`}
                                                            maxLength={50}
                                                            value={passenger.passportIssuingCountry}
                                                            onChange={(e) => handlePassengerChange(index, "passportIssuingCountry", e.target.value)}
                                                            className={errors[`p_${index}_passportIssuingCountry`] ? "input-err" : ""}
                                                        />
                                                        {errors[`p_${index}_passportIssuingCountry`] && (
                                                            <span className="field-err-msg">{errors[`p_${index}_passportIssuingCountry`]}</span>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT SECTION: CONTACT DETAILS ONLY */}
                        <div className="contact-and-price-column">
                            <div className="passenger-entry-box contact-entry-box">
                                <div className="passenger-box-title">
                                    <span className="passenger-icon">📞</span>
                                    <h3>Contact Details</h3>
                                </div>

                                <p className="contact-box-note">
                                    Your booking confirmation, e-tickets and itinerary updates will be sent here.
                                </p>

                                <div className="details-inputs-grid contact-inputs-grid">
                                    {/* EMAIL */}
                                    <div className="custom-form-group">
                                        <label>Email Address*</label>
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            name="email"
                                            maxLength={100}
                                            value={contactInfo.email}
                                            onChange={handleContactChange}
                                            className={errors.email ? "input-err" : ""}
                                        />
                                        {errors.email && <span className="field-err-msg">{errors.email}</span>}
                                    </div>

                                    {/* PHONE */}
                                    <div className="custom-form-group">
                                        <label>Phone Number*</label>
                                        <PhoneInput
                                            countryCode={contactInfo.countryCode || "+1"}
                                            onCountryCodeChange={(code) => {
                                                setContactInfo((prev) => ({
                                                    ...prev,
                                                    countryCode: code,
                                                }));
                                            }}
                                            value={contactInfo.phone}
                                            onChange={handleContactChange}
                                            name="phone"
                                            placeholder="Phone Number"
                                            error={errors.phone}
                                        />
                                        {errors.phone && <span className="field-err-msg">{errors.phone}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        PRICE DETAILS - BELOW PASSENGER + CONTACT SECTION
                    ================================================= */}
                    <div className="passenger-entry-box price-embedded-box">
                        <div className="passenger-box-title">
                            <span className="passenger-icon">💳</span>
                            <h3>Price Details</h3>
                        </div>

                        <div className="price-breakdown-table">
                            <div className="price-line-row">
                                <span className="price-label">
                                    Base Fare ({totalPassengersCount} traveler{totalPassengersCount !== 1 ? "s" : ""})
                                </span>
                                <span className="price-val">{formatUSD(totalBasePrice)}</span>
                            </div>

                            <div className="price-line-row">
                                <span className="price-label">Taxes, Surcharges & Fees</span>
                                <span className="price-val">{formatUSD(taxesAndFees)}</span>
                            </div>

                            {appliedPromo && promoDiscountAmount > 0 && (
                                <div className="price-line-row promo-savings-row">
                                    <span className="price-label">
                                        🏷️ Promo Discount ({appliedPromo.code})
                                    </span>
                                    <span className="price-val-discount">
                                        -{formatUSD(promoDiscountAmount)}
                                    </span>
                                </div>
                            )}

                            <hr className="price-divider" />

                            <div className="price-line-row total-amount-row">
                                <span className="total-label">Total Amount</span>
                                <span className="total-val">{formatUSD(grandTotalPrice)}</span>
                            </div>
                        </div>

                        <div className="price-card-perks">
                            <span>✓ Guaranteed lowest fares • Instant confirmation</span>
                        </div>
                    </div>

                    {/* PROCEED BUTTON (SPANNING FULL WIDTH AT BOTTOM) */}
                    <div className="form-submit-row">
                        <button type="submit" className="custom-proceed-btn">
                            <span>PROCEED TO REVIEW & CUSTOMISE</span>
                            <span className="btn-arrow-icon">→</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* =================================================
                OFFERS & COUPONS MODAL
            ================================================= */}
            {isOffersModalOpen && (
                <div className="offers-modal-overlay" onClick={() => setIsOffersModalOpen(false)}>
                    <div className="offers-modal-container" onClick={(e) => e.stopPropagation()}>
                        <div className="offers-modal-header">
                            <div className="offers-header-title">
                                <h3>🏷️ Available Offers & Coupons</h3>
                                <p>Apply a promotional coupon code to get instant savings on your flight booking in USD.</p>
                            </div>
                            <button
                                type="button"
                                className="offers-modal-close"
                                onClick={() => setIsOffersModalOpen(false)}
                            >
                                ✕
                            </button>
                        </div>

                        {/* ENTER CUSTOM PROMO CODE */}
                        <form className="offers-promo-input-box" onSubmit={handleApplyCustomCode}>
                            <input
                                type="text"
                                placeholder="Enter coupon code (e.g. FLYHIGH15)"
                                value={customPromoInput}
                                onChange={(e) => {
                                    setCustomPromoInput(e.target.value.toUpperCase());
                                    setPromoFeedback({ error: "", success: "" });
                                }}
                            />
                            <button type="submit" className="offers-apply-input-btn">
                                Apply
                            </button>
                        </form>

                        {promoFeedback.error && (
                            <div className="offers-alert offers-alert-error">
                                ⚠️ {promoFeedback.error}
                            </div>
                        )}
                        {promoFeedback.success && (
                            <div className="offers-alert offers-alert-success">
                                ✓ {promoFeedback.success}
                            </div>
                        )}

                        {/* AVAILABLE OFFERS GRID */}
                        <div className="offers-cards-list">
                            {availableOffers.map((offer) => {
                                const isCurrent = appliedPromo?.code === offer.code;
                                const isEligible = subtotalPrice >= (offer.minBooking || 0);

                                return (
                                    <div
                                        key={offer.code}
                                        className={`offer-deal-card ${isCurrent ? "offer-deal-active" : ""}`}
                                    >
                                        <div className="offer-deal-top">
                                            <div className="offer-deal-code-wrap">
                                                <span className="offer-coupon-code">{offer.code}</span>
                                                {offer.tag && <span className="offer-deal-tag">{offer.tag}</span>}
                                            </div>
                                            <button
                                                type="button"
                                                className={`offer-deal-apply-btn ${isCurrent ? "btn-applied" : ""}`}
                                                disabled={isCurrent || !isEligible}
                                                onClick={() => handleApplyOffer(offer)}
                                            >
                                                {isCurrent ? "✓ Applied" : "Apply Code"}
                                            </button>
                                        </div>

                                        <h4 className="offer-deal-title">{offer.title}</h4>
                                        <p className="offer-deal-desc">{offer.desc}</p>
                                        <div className="offer-deal-footer">
                                            <span>Instant Savings: <strong>{formatUSD(offer.discount)}</strong></span>
                                            {offer.minBooking > 0 && (
                                                <small className="offer-min-req">
                                                    *Min booking: {formatUSD(offer.minBooking)}
                                                </small>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default FlightDetails;
