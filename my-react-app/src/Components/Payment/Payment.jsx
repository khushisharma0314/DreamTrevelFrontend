import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    getBookingSession,
    clearBookingSession,
    saveBookingSession,
} from "../../utils/flightUtils";
import paymentPageBg from "../../assets/paymentPage.png";
import "./Payment.css";

function Payment() {
    const location = useLocation();
    const navigate = useNavigate();

    const activeState =
        location.state || getBookingSession()?.state || {};

    const {
        selectedDeparture,
        selectedReturn,
        searchData,
        selectedFromCity,
        selectedToCity,
        passengers = [],
        contactInfo,
        pricing,
        appliedPromo: initialPromo,
        selectedSeats = {},
        totalSeatCharges = 0,
        selectedAddOns = {},
        baggageTotal = 0,
        mealTotal = 0,
        priorityPrice = 0,
        insurancePrice = 0,
        totalAddOnCharges = 0,
        finalTotalPrice = 0,
    } = activeState;

    const [appliedPromo, setAppliedPromo] =
        useState(initialPromo || null);

    const [paymentMethod, setPaymentMethod] =
        useState("card");

    const [isProcessing, setIsProcessing] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState("");

    // =========================================================
    // REALISTIC PAYMENT FORM STATES
    // =========================================================

    const [cardNumber, setCardNumber] =
        useState("4532 8921 4452 7890");

    const [cardHolder, setCardHolder] =
        useState(
            passengers?.[0]?.firstName
                ? `${passengers[0].firstName} ${passengers[0].lastName || ""
                    }`.trim()
                : "Rajesh Kumar"
        );

    const [cardExpiry, setCardExpiry] =
        useState("12/28");

    const [cardCvv, setCardCvv] =
        useState("892");

    const [upiId, setUpiId] =
        useState("traveler@okhdfcbank");

    const [selectedBank, setSelectedBank] =
        useState("HDFC Bank");

    // =========================================================
    // FORMAT CARD NUMBER
    // =========================================================

    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, "");

        if (value.length > 16) {
            value = value.slice(0, 16);
        }

        const formatted =
            value.match(/.{1,4}/g)?.join(" ") || value;

        setCardNumber(formatted);
    };

    // =========================================================
    // FORMAT EXPIRY
    // =========================================================

    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, "");

        if (value.length > 4) {
            value = value.slice(0, 4);
        }

        if (value.length > 2) {
            value =
                value.slice(0, 2) +
                "/" +
                value.slice(2);
        }

        setCardExpiry(value);
    };

    // =========================================================
    // SESSION CHECK
    // =========================================================

    if (
        !searchData ||
        !selectedDeparture ||
        !passengers.length
    ) {
        return (
            <main className="payment-page">
                <div className="payment-error-card">
                    <h2>Session Expired</h2>

                    <p>
                        We could not retrieve your booking details.
                        Please start your flight search again.
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
    // PAYMENT METHODS
    // =========================================================

    const paymentMethods = [
        {
            id: "card",
            title: "Credit / Debit Card",
            icon: "💳",
        },
        {
            id: "upi",
            title: "UPI / QR Code",
            icon: "📱",
        },
        {
            id: "netbanking",
            title: "Net Banking",
            icon: "🏦",
        },
        {
            id: "paypal",
            title: "Wallets / PayPal",
            icon: "🅿️",
        },
    ];

    // =========================================================
    // SEAT HELPER
    // =========================================================

    const getSeatDesignator = (index, type) => {
        const seat =
            selectedSeats?.[`${index}-${type}`];

        if (!seat) {
            return null;
        }

        if (typeof seat === "string") {
            return seat;
        }

        if (typeof seat === "object") {
            return (
                seat.designator ||
                seat.seatNumber ||
                seat.seat ||
                null
            );
        }

        return null;
    };

    // =========================================================
    // SEAT PRICE HELPER
    // =========================================================

    const getSeatPrice = (index, type) => {
        const seat =
            selectedSeats?.[`${index}-${type}`];

        if (!seat || typeof seat !== "object") {
            return 0;
        }

        const price = Number(
            seat.price ??
            seat.amount ??
            seat.total_amount?.amount ??
            seat.price?.amount ??
            0
        );

        return Number.isFinite(price)
            ? price
            : 0;
    };

    // =========================================================
    // GET JWT TOKEN
    // =========================================================

    const getAuthToken = () => {
        const token =
            localStorage.getItem("token") ||
            localStorage.getItem("jwtToken") ||
            localStorage.getItem("authToken") ||
            localStorage.getItem("accessToken");

        if (
            !token ||
            token === "null" ||
            token === "undefined"
        ) {
            return null;
        }

        return token;
    };

    // =========================================================
    // INITIAL AUTH CHECK
    // =========================================================

    useEffect(() => {
        const token = getAuthToken();

        if (!token) {
            saveBookingSession("/payment", activeState);

            navigate("/login", {
                state: {
                    from: {
                        pathname: "/payment",
                        state: activeState,
                    },
                    contactEmail:
                        contactInfo?.email || "",
                },
                replace: true,
            });
        }
    }, []);

    // =========================================================
    // PRICING
    // =========================================================

    const flightFare = Number(
        pricing?.subtotalPrice ||
        pricing?.grandTotalPrice ||
        0
    );

    const totalSeats =
        Number(totalSeatCharges || 0);

    const totalAddons =
        Number(totalAddOnCharges || 0);

    const subtotalBeforeDiscount =
        flightFare +
        totalSeats +
        totalAddons;

    const promoDiscountAmount =
        Number(
            appliedPromo?.discountAmount || 0
        );

    const payableAmount = Math.max(
        0,
        subtotalBeforeDiscount -
        promoDiscountAmount
    );

    const formatUSD = (val) => {
        const num = Number(val || 0);
        return num.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    // =========================================================
    // CREATE BOOKING REQUEST
    // =========================================================

    const createBookingRequest = () => {
        return {
            departureFlightId:
                selectedDeparture?.id,

            returnFlightId:
                selectedReturn?.id || null,

            contactEmail:
                contactInfo?.email || "",

            contactPhone:
                contactInfo?.fullPhone ||
                (contactInfo?.countryCode &&
                    contactInfo?.phone
                    ? `${contactInfo.countryCode} ${contactInfo.phone}`
                    : contactInfo?.phone ||
                    contactInfo?.phoneNumber ||
                    ""),

            totalPrice:
                payableAmount,

            promoCode:
                appliedPromo?.code || null,

            discountAmount:
                promoDiscountAmount,

            passengers:
                passengers.map(
                    (passenger, idx) => ({
                        firstName:
                            passenger?.firstName ||
                            "",

                        lastName:
                            passenger?.lastName ||
                            "",

                        gender:
                            passenger?.gender ||
                            "",

                        dateOfBirth:
                            passenger?.dateOfBirth ||
                            passenger?.dob ||
                            "",

                        passengerType:
                            passenger?.passengerType ||
                            passenger?.type ||
                            "ADULT",

                        seatNumber:
                            getSeatDesignator(
                                idx,
                                "departure"
                            ) || null,
                    })
                ),
        };
    };

    // =========================================================
    // CREATE BOOKING
    // =========================================================

    const createBookingAfterPayment = async ({
        paymentId,
        orderId,
    }) => {
        const token = getAuthToken();

        if (!token) {
            throw new Error(
                "Your login session has expired. Please login again."
            );
        }

        const bookingRequest =
            createBookingRequest();

        console.log(
            "SUBMITTING BOOKING TO BACKEND:",
            bookingRequest
        );

        const bookingResponse =
            await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/bookings`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        ...bookingRequest,

                        paymentId:
                            paymentId,

                        razorpayOrderId:
                            orderId,

                        paymentStatus:
                            "PAID",
                    }),
                }
            );

        let bookingData = null;

        try {
            bookingData =
                await bookingResponse.json();
        } catch (error) {
            console.error(
                "Unable to parse booking response:",
                error
            );
        }

        console.log(
            "BOOKING CREATED IN DATABASE:",
            bookingResponse.status,
            bookingData
        );

        if (
            bookingResponse.status === 401 ||
            bookingResponse.status === 403
        ) {
            localStorage.removeItem("token");
            localStorage.removeItem("jwtToken");
            localStorage.removeItem("authToken");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");

            window.dispatchEvent(
                new Event("authChange")
            );

            const authErr =
                new Error(
                    "Your login session has expired. Redirecting to Login/Register..."
                );

            authErr.isAuth = true;

            throw authErr;
        }

        if (!bookingResponse.ok) {
            throw new Error(
                bookingData?.message ||
                bookingData?.error ||
                "Booking creation failed. Please check passenger details."
            );
        }

        if (
            !bookingData ||
            bookingData.success !== true
        ) {
            throw new Error(
                bookingData?.message ||
                "Booking could not be confirmed."
            );
        }

        return bookingData;
    };

    // =========================================================
    // HANDLE PAYMENT
    // =========================================================

    const handlePayment = async () => {
        setErrorMessage("");

        const token = getAuthToken();

        if (!token) {
            setErrorMessage(
                "Please login or register to complete your booking. Redirecting..."
            );

            saveBookingSession(
                "/payment",
                activeState
            );

            setTimeout(() => {
                navigate("/login", {
                    state: {
                        from: {
                            pathname: "/payment",
                            state: activeState,
                        },
                        contactEmail:
                            contactInfo?.email || "",
                    },
                });
            }, 800);

            return;
        }

        if (!selectedDeparture?.id) {
            setErrorMessage(
                "Selected departure flight information is missing."
            );
            return;
        }

        if (!contactInfo?.email) {
            setErrorMessage(
                "Contact email is missing."
            );
            return;
        }

        if (paymentMethod === "card") {
            const rawCard =
                cardNumber.replace(/\s/g, "");

            if (rawCard.length < 15) {
                setErrorMessage(
                    "Please enter a valid 16-digit card number."
                );
                return;
            }

            if (!cardHolder.trim()) {
                setErrorMessage(
                    "Please enter the cardholder name."
                );
                return;
            }

            if (cardExpiry.length < 5) {
                setErrorMessage(
                    "Please enter card expiry in MM/YY format."
                );
                return;
            }

            if (cardCvv.length < 3) {
                setErrorMessage(
                    "Please enter a valid 3-digit CVV."
                );
                return;
            }
        } else if (paymentMethod === "upi") {
            if (
                !upiId.trim() ||
                !upiId.includes("@")
            ) {
                setErrorMessage(
                    "Please enter a valid UPI ID (e.g. name@okhdfcbank)."
                );
                return;
            }
        }

        setIsProcessing(true);

        try {
            await new Promise(
                (resolve) =>
                    setTimeout(resolve, 1200)
            );

            const simulatedPaymentId =
                "PAY_" +
                paymentMethod.toUpperCase() +
                "_" +
                Date.now();

            const simulatedOrderId =
                "ORD_SIM_" +
                Date.now();

            const bookingData =
                await createBookingAfterPayment({
                    paymentId:
                        simulatedPaymentId,

                    orderId:
                        simulatedOrderId,
                });

            const realPNR =
                bookingData?.pnr;

            if (!realPNR) {
                throw new Error(
                    "Booking was created but PNR was not received from server."
                );
            }

            const paymentDetails = {
                method:
                    paymentMethod === "card"
                        ? "Credit/Debit Card"
                        : paymentMethod.toUpperCase(),

                status: "Paid",

                amount:
                    Number(
                        finalTotalPrice ||
                        payableAmount ||
                        0
                    ),

                transactionId:
                    simulatedPaymentId,

                orderId:
                    simulatedOrderId,

                paidAt:
                    new Date().toISOString(),
            };

            setIsProcessing(false);

            clearBookingSession();

            navigate(
                "/booking-confirmation",
                {
                    state: {
                        bookingReference:
                            realPNR,

                        bookingId:
                            bookingData.bookingId,

                        pnr: realPNR,

                        selectedDeparture,

                        selectedReturn,

                        searchData,

                        selectedFromCity,

                        selectedToCity,

                        passengers,

                        contactInfo,

                        pricing,

                        finalTotalPrice:
                            payableAmount,

                        selectedSeats,

                        totalSeatCharges,

                        selectedAddOns,

                        baggageTotal,

                        mealTotal,

                        priorityPrice,

                        insurancePrice,

                        totalAddOnCharges,

                        paymentDetails,
                    },
                }
            );
        } catch (error) {
            console.error(
                "PAYMENT / BOOKING ERROR:",
                error
            );

            setIsProcessing(false);

            if (
                error.isAuth ||
                error.message
                    ?.toLowerCase()
                    .includes("login") ||
                error.message
                    ?.toLowerCase()
                    .includes("session") ||
                error.message
                    ?.toLowerCase()
                    .includes("unauthorized")
            ) {
                setErrorMessage(
                    "Your login session has expired. Redirecting to Login / Register..."
                );

                saveBookingSession(
                    "/payment",
                    activeState
                );

                setTimeout(() => {
                    navigate("/login", {
                        state: {
                            from: {
                                pathname:
                                    "/payment",
                                state:
                                    activeState,
                            },

                            contactEmail:
                                contactInfo?.email ||
                                "",
                        },
                    });
                }, 1200);
            } else {
                setErrorMessage(
                    error?.message ||
                    "Unable to process booking. Please verify your details and try again."
                );
            }
        }
    };

    // =========================================================
    // GO BACK TO REVIEW
    // =========================================================

    const handleBackToReview = () => {
        navigate(
            "/booking-review",
            {
                state: {
                    selectedDeparture,
                    selectedReturn,
                    searchData,
                    selectedFromCity,
                    selectedToCity,
                    passengers,
                    contactInfo,
                    pricing,
                    appliedPromo,
                    selectedSeats,
                    totalSeatCharges,
                    selectedAddOns,
                    baggageTotal,
                    mealTotal,
                    priorityPrice,
                    insurancePrice,
                    totalAddOnCharges,
                    finalTotalPrice:
                        payableAmount,
                },
            }
        );
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <main
            className="payment-page"
            style={{
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05)), url(${paymentPageBg})`
            }}
        >

            {/* =================================================
                PROGRESS
            ================================================= */}

            <div className="payment-progress-container">

                <div className="payment-progress">

                    <div className="payment-progress-step completed">
                        <div className="payment-progress-number">
                            ✓
                        </div>

                        <span>
                            Flight Selection
                        </span>
                    </div>

                    <div className="payment-progress-line completed-line"></div>

                    <div className="payment-progress-step completed">
                        <div className="payment-progress-number">
                            ✓
                        </div>

                        <span>
                            Traveler Details
                        </span>
                    </div>

                    <div className="payment-progress-line completed-line"></div>

                    <div className="payment-progress-step completed">
                        <div className="payment-progress-number">
                            ✓
                        </div>

                        <span>
                            Review & Customise
                        </span>
                    </div>

                    <div className="payment-progress-line active-line"></div>

                    <div className="payment-progress-step active">
                        <div className="payment-progress-number">
                            4
                        </div>

                        <span>
                            Payment
                        </span>
                    </div>

                </div>

            </div>

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="payment-page-header">

                <h1>
                    Secure Payment
                </h1>

                <p>
                    Enter your payment details to confirm your
                    flight booking and generate your e-ticket.
                </p>

            </div>

            {/* =================================================
                MAIN LAYOUT
            ================================================= */}

            <div className="payment-layout-container">

                {/* =================================================
                    LEFT SECTION
                ================================================= */}

                <section className="payment-main-section">

                    {/* PAYMENT METHOD SELECTOR */}

                    <div className="payment-card">

                        <div className="payment-card-heading">

                            <div>

                                <h2>
                                    Choose Payment Method
                                </h2>

                                <p>
                                    Select your preferred payment method.
                                </p>

                            </div>

                        </div>

                        <div className="payment-method-list">

                            {paymentMethods.map(
                                (method) => {

                                    const isSelected =
                                        paymentMethod ===
                                        method.id;

                                    return (
                                        <button
                                            key={method.id}
                                            type="button"
                                            className={
                                                isSelected
                                                    ? "payment-method selected"
                                                    : "payment-method"
                                            }
                                            onClick={() => {
                                                setPaymentMethod(
                                                    method.id
                                                );

                                                setErrorMessage("");
                                            }}
                                        >

                                            <span className="payment-method-icon">
                                                {method.icon}
                                            </span>

                                            <span className="payment-method-title">
                                                {method.title}
                                            </span>

                                            <span
                                                className={
                                                    isSelected
                                                        ? "payment-method-radio checked"
                                                        : "payment-method-radio"
                                                }
                                            >
                                                {isSelected
                                                    ? "✓"
                                                    : ""}
                                            </span>

                                        </button>
                                    );
                                }
                            )}

                        </div>

                    </div>

                    {/* PAYMENT FORM */}

                    <div className="payment-card">

                        <div className="payment-section-title">

                            <div>

                                <h2>
                                    {paymentMethod === "card" &&
                                        "Card Details"}

                                    {paymentMethod === "upi" &&
                                        "UPI Payment"}

                                    {paymentMethod === "netbanking" &&
                                        "Select Your Bank"}

                                    {paymentMethod === "paypal" &&
                                        "PayPal Details"}
                                </h2>

                                <p>
                                    {paymentMethod === "card" &&
                                        "Enter your credit/debit card information."}

                                    {paymentMethod === "upi" &&
                                        "Enter your Virtual Payment Address (VPA)."}

                                    {paymentMethod === "netbanking" &&
                                        "Choose your bank to pay via NetBanking."}

                                    {paymentMethod === "paypal" &&
                                        "Pay via your PayPal account."}
                                </p>

                            </div>

                            <span>
                                🔒 256-bit SSL Encrypted
                            </span>

                        </div>

                        {/* CARD FORM */}

                        {paymentMethod === "card" && (
                            <div className="payment-form">

                                <div className="payment-form-group full-width">

                                    <label>
                                        Card Number
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="4532 1234 5678 9010"
                                        value={cardNumber}
                                        onChange={
                                            handleCardNumberChange
                                        }
                                        maxLength="19"
                                    />

                                </div>

                                <div className="payment-form-group full-width">

                                    <label>
                                        Cardholder Name
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Name on card"
                                        value={cardHolder}
                                        onChange={(e) =>
                                            setCardHolder(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                                <div className="payment-form-row">

                                    <div className="payment-form-group">

                                        <label>
                                            Expiry Date
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            value={cardExpiry}
                                            onChange={
                                                handleExpiryChange
                                            }
                                            maxLength="5"
                                        />

                                    </div>

                                    <div className="payment-form-group">

                                        <label>
                                            CVV / CVC
                                        </label>

                                        <input
                                            type="password"
                                            placeholder="•••"
                                            value={cardCvv}
                                            onChange={(e) => {
                                                const val =
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        ""
                                                    );

                                                if (
                                                    val.length <=
                                                    4
                                                ) {
                                                    setCardCvv(
                                                        val
                                                    );
                                                }
                                            }}
                                            maxLength="4"
                                        />

                                    </div>

                                </div>

                            </div>
                        )}

                        {/* UPI FORM */}

                        {paymentMethod === "upi" && (
                            <div className="payment-form">

                                <div className="payment-form-group full-width">

                                    <label>
                                        Virtual Payment Address
                                        (UPI ID)
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="mobileNumber@upi or username@okhdfcbank"
                                        value={upiId}
                                        onChange={(e) =>
                                            setUpiId(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <small>
                                        Supported: Google Pay,
                                        PhonePe, Paytm, BHIM,
                                        etc.
                                    </small>

                                </div>

                            </div>
                        )}

                        {/* NETBANKING FORM */}

                        {paymentMethod === "netbanking" && (
                            <div className="payment-form">

                                <div className="payment-form-group full-width">

                                    <label>
                                        Select Bank
                                    </label>

                                    <select
                                        value={selectedBank}
                                        onChange={(e) =>
                                            setSelectedBank(
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="HDFC Bank">
                                            HDFC Bank
                                        </option>

                                        <option value="State Bank of India (SBI)">
                                            State Bank of India
                                            (SBI)
                                        </option>

                                        <option value="ICICI Bank">
                                            ICICI Bank
                                        </option>

                                        <option value="Axis Bank">
                                            Axis Bank
                                        </option>

                                        <option value="Kotak Mahindra Bank">
                                            Kotak Mahindra Bank
                                        </option>

                                        <option value="Punjab National Bank (PNB)">
                                            Punjab National Bank
                                            (PNB)
                                        </option>

                                        <option value="Bank of Baroda">
                                            Bank of Baroda
                                        </option>

                                    </select>

                                </div>

                            </div>
                        )}

                        {/* PAYPAL */}

                        {paymentMethod === "paypal" && (
                            <div className="payment-form">

                                <div className="payment-form-group full-width">

                                    <label>
                                        PayPal / Wallet Account
                                    </label>

                                    <input
                                        type="email"
                                        placeholder="your-paypal-email@example.com"
                                        defaultValue={
                                            contactInfo?.email ||
                                            "traveler@example.com"
                                        }
                                    />

                                </div>

                            </div>
                        )}

                    </div>

                    {/* SECURITY BADGE */}

                    <div className="payment-security-card">

                        <span className="security-icon">
                            🛡️
                        </span>

                        <div>

                            <strong>
                                Safe & Instant Confirmation
                            </strong>

                            <p>
                                Your booking is instantly
                                recorded and your e-ticket
                                with PNR is generated
                                automatically.
                            </p>

                        </div>

                    </div>

                    {/* ERROR */}

                    {errorMessage && (
                        <div
                            className="payment-error-message"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent:
                                    "space-between",
                                flexWrap: "wrap",
                                gap: "10px",
                            }}
                        >

                            <span>
                                {errorMessage}
                            </span>

                            {(
                                errorMessage
                                    .toLowerCase()
                                    .includes("login") ||
                                errorMessage
                                    .toLowerCase()
                                    .includes("session") ||
                                errorMessage
                                    .toLowerCase()
                                    .includes("register")
                            ) && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            saveBookingSession(
                                                "/payment",
                                                activeState
                                            );

                                            navigate(
                                                "/login",
                                                {
                                                    state: {
                                                        from: {
                                                            pathname:
                                                                "/payment",
                                                            state:
                                                                activeState,
                                                        },

                                                        contactEmail:
                                                            contactInfo?.email ||
                                                            "",
                                                    },
                                                }
                                            );
                                        }}
                                        style={{
                                            backgroundColor:
                                                "#e05638",
                                            color: "#ffffff",
                                            border: "none",
                                            padding:
                                                "7px 15px",
                                            borderRadius:
                                                "6px",
                                            fontWeight:
                                                "600",
                                            cursor:
                                                "pointer",
                                            fontSize:
                                                "13px",
                                        }}
                                    >
                                        Login / Register Now →
                                    </button>
                                )}

                        </div>
                    )}

                    {/* ACTIONS (DESKTOP) */}

                    <div className="payment-actions desktop-only-actions">

                        <button
                            type="button"
                            className="back-review-btn"
                            onClick={
                                handleBackToReview
                            }
                            disabled={
                                isProcessing
                            }
                        >
                            ← Back to Review
                        </button>

                        <button
                            type="button"
                            className="pay-now-btn"
                            onClick={
                                handlePayment
                            }
                            disabled={
                                isProcessing
                            }
                        >

                            {isProcessing ? (
                                <>
                                    <span className="payment-spinner"></span>
                                    Processing Payment...
                                </>
                            ) : (
                                <>
                                    Pay $
                                    {formatUSD(payableAmount)}

                                    <span>
                                        →
                                    </span>
                                </>
                            )}

                        </button>

                    </div>

                </section>

                {/* =================================================
                    RIGHT SIDE
                ================================================= */}

                <aside className="payment-summary-section">

                    {/* FLIGHT */}

                    <div className="payment-summary-card">

                        <h3>
                            Flight Summary
                        </h3>

                        <div className="payment-flight-summary">

                            <div>

                                <span>
                                    Departure
                                </span>

                                <strong>
                                    {selectedDeparture?.from ||
                                        searchData?.fromCity ||
                                        searchData?.from ||
                                        selectedFromCity?.airportCode ||
                                        selectedFromCity?.cityName ||
                                        "—"}
                                </strong>

                            </div>

                            <span className="flight-arrow">
                                →
                            </span>

                            <div>

                                <span>
                                    Arrival
                                </span>

                                <strong>
                                    {selectedDeparture?.to ||
                                        searchData?.toCity ||
                                        searchData?.to ||
                                        selectedToCity?.airportCode ||
                                        selectedToCity?.cityName ||
                                        "—"}
                                </strong>

                            </div>

                        </div>

                        <div className="payment-flight-name">

                            <strong>
                                {selectedDeparture?.airline}
                            </strong>

                            {selectedDeparture?.flightNumber && (
                                <span>
                                    {
                                        selectedDeparture.flightNumber
                                    }
                                </span>
                            )}

                        </div>

                    </div>

                    {/* PASSENGERS */}

                    <div className="payment-summary-card">

                        <h3>
                            Travelers
                        </h3>

                        <div className="payment-passenger-list">

                            {passengers.map(
                                (
                                    passenger,
                                    index
                                ) => {

                                    const departureSeat =
                                        getSeatDesignator(
                                            index,
                                            "departure"
                                        );

                                    const returnSeat =
                                        getSeatDesignator(
                                            index,
                                            "return"
                                        );

                                    return (
                                        <div
                                            className="payment-passenger-row"
                                            key={
                                                index
                                            }
                                        >

                                            <span>
                                                👤
                                            </span>

                                            <div>

                                                <strong>
                                                    {
                                                        passenger.label ||
                                                        [
                                                            passenger.firstName,
                                                            passenger.lastName,
                                                        ]
                                                            .filter(
                                                                Boolean
                                                            )
                                                            .join(
                                                                " "
                                                            ) ||
                                                        "Traveler"
                                                    }
                                                </strong>

                                                <small>
                                                    Seat:{" "}
                                                    {departureSeat ||
                                                        "Auto-assigned at Check-in (Free)"}
                                                </small>

                                                {selectedReturn && (
                                                    <small>
                                                        Return Seat:{" "}
                                                        {returnSeat ||
                                                            "Auto-assigned at Check-in (Free)"}
                                                    </small>
                                                )}

                                            </div>

                                        </div>
                                    );
                                }
                            )}

                        </div>

                    </div>

                    {/* =================================================
                        PRICE DETAILS
                        PROMO BOX REMOVED
                    ================================================= */}

                    <div className="payment-summary-card">

                        <h3>
                            Price Details
                        </h3>

                        <div className="payment-price-row">

                            <span>
                                Flight Fare
                            </span>

                            <span>
                                $
                                {formatUSD(flightFare)}
                            </span>

                        </div>

                        <div className="payment-price-row">

                            <span>
                                Seat Charges
                            </span>

                            <span>
                                $
                                {formatUSD(totalSeatCharges)}
                            </span>

                        </div>

                        <div className="payment-price-row">

                            <span>
                                Add-ons
                            </span>

                            <span>
                                $
                                {formatUSD(totalAddOnCharges)}
                            </span>

                        </div>

                        <hr />

                        <div className="payment-total-row">

                            <span>
                                Total Payable
                            </span>

                            <strong>
                                $
                                {formatUSD(payableAmount)}
                            </strong>

                        </div>

                    </div>

                    {/* NOTE */}

                    <div className="payment-note">

                        <span>
                            🔐
                        </span>

                        <p>
                            By clicking Pay Now, you
                            agree to complete the booking
                            and authorize the payment for
                            the amount shown above.
                        </p>

                    </div>

                </aside>

                {/* =================================================
                    MOBILE ONLY: ACTIONS AT VERY END OF ALL SECTIONS
                ================================================= */}

                <div className="payment-actions mobile-only-actions">

                    <button
                        type="button"
                        className="back-review-btn"
                        onClick={handleBackToReview}
                        disabled={isProcessing}
                    >
                        ← Back to Review
                    </button>

                    <button
                        type="button"
                        className="pay-now-btn"
                        onClick={handlePayment}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <>
                                <span className="payment-spinner"></span>
                                Processing Payment...
                            </>
                        ) : (
                            <>
                                Pay ${formatUSD(payableAmount)}
                                <span>→</span>
                            </>
                        )}
                    </button>

                </div>

            </div>

        </main>
    );
}

export default Payment;