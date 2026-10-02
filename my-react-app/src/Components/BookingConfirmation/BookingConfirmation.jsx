import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookingConfirmation.css";

function BookingConfirmation() {

    const location = useLocation();
    const navigate = useNavigate();

    /* =========================================================
       DATA FROM PAYMENT PAGE
    ========================================================= */

    const {
        bookingReference,
        finalTotalPrice,

        passengers = [],

        selectedDeparture,
        selectedReturn,

        contactInfo,
        paymentDetails,

        selectedSeats = {},
        totalSeatCharges = 0,

        selectedAddOns = {},
        baggageTotal = 0,
        mealTotal = 0,
        priorityPrice = 0,
        insurancePrice = 0,
        totalAddOnCharges = 0,

        searchData,
        selectedFromCity,
        selectedToCity,
        pricing,
    } = location.state || {};


    /* =========================================================
       ALIASES
    ========================================================= */

    const pnr = bookingReference;

    const departureFlight = selectedDeparture;
    const returnFlight = selectedReturn;

    const totalPrice =
        Number(finalTotalPrice || 0);

    const formatUSD = (val) => {
        const num = Number(val || 0);
        return num.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };


    /* =========================================================
       SESSION CHECK
    ========================================================= */

    if (
        !bookingReference ||
        !selectedDeparture ||
        !passengers.length
    ) {

        return (
            <main className="confirmation-page">

                <div className="confirmation-error-card">

                    <div
                        style={{
                            fontSize: "40px",
                            marginBottom: "10px",
                        }}
                    >
                        !
                    </div>

                    <h2>
                        No Active Booking
                    </h2>

                    <p>
                        We could not find any active booking
                        session. Please search and book again.
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


    /* =========================================================
       SAFE PASSENGER NAME
    ========================================================= */

    const getPassengerName = (passenger) => {

        const fullName = [
            passenger?.firstName,
            passenger?.lastName,
        ]
            .filter(Boolean)
            .join(" ");

        return (
            fullName ||
            passenger?.name ||
            passenger?.fullName ||
            passenger?.label ||
            "Traveler"
        );
    };


    /* =========================================================
       SAFE PASSENGER TYPE
    ========================================================= */

    const getPassengerType = (passenger) => {

        return (
            passenger?.passengerType ||
            passenger?.type ||
            "Adult"
        );
    };


    /* =========================================================
       SAFE CITY NAME HELPER
    ========================================================= */

    const getCityDisplayName = (city) => {

        if (!city) return "";

        if (typeof city === "string") {
            return city;
        }

        if (typeof city === "object") {
            return (
                city.cityName ||
                city.airportCode ||
                city.name ||
                city.code ||
                ""
            );
        }

        return String(city);
    };


    /* =========================================================
       SAFE SEAT DISPLAY HELPER
    ========================================================= */

    const getSeatDisplay = (seat) => {

        if (!seat) {
            return "Auto-assigned at Check-in";
        }

        if (typeof seat === "string") {
            return seat;
        }

        if (typeof seat === "object") {
            return (
                seat.designator ||
                seat.seatNumber ||
                seat.seat ||
                seat.number ||
                "Auto-assigned at Check-in"
            );
        }

        return String(seat);
    };


    /* =========================================================
       SAFE DATE
    ========================================================= */

    const getDate = (flight) => {

        return (
            flight?.departureDate ||
            flight?.date ||
            flight?.departureDateTime ||
            "—"
        );
    };


    /* =========================================================
       GET JWT TOKEN
    ========================================================= */

    const getAuthToken = () => {

        const token =
            localStorage.getItem("token") ||
            localStorage.getItem("jwtToken") ||
            localStorage.getItem("authToken") ||
            localStorage.getItem("accessToken");

        if (
            token === "null" ||
            token === "undefined"
        ) {
            return null;
        }

        return token;
    };


    /* =========================================================
       DOWNLOAD PDF
    ========================================================= */

    const handleDownloadPDF = async () => {

        try {

            const token = getAuthToken();


            /* =====================================================
               TOKEN CHECK
            ===================================================== */

            if (!token) {

                alert(
                    "Your login session has expired. Please login again."
                );

                navigate("/login");

                return;
            }


            /* =====================================================
               PDF API REQUEST
            ===================================================== */

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/bookings/pdf/${pnr}`,
                {
                    method: "GET",

                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            /* =====================================================
               UNAUTHORIZED
            ===================================================== */

            if (response.status === 401) {

                alert(
                    "Your login session is invalid or expired. Please login again."
                );

                navigate("/login");

                return;
            }


            /* =====================================================
               FORBIDDEN
            ===================================================== */

            if (response.status === 403) {

                alert(
                    "You are not authorized to download this ticket."
                );

                return;
            }


            /* =====================================================
               BOOKING NOT FOUND
            ===================================================== */

            if (response.status === 404) {

                alert(
                    "Booking or ticket was not found."
                );

                return;
            }


            /* =====================================================
               OTHER SERVER ERROR
            ===================================================== */

            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "PDF DOWNLOAD ERROR:",
                    response.status,
                    errorText
                );

                alert(
                    "Unable to download the ticket PDF. Please try again."
                );

                return;
            }


            /* =====================================================
               CONVERT RESPONSE TO BLOB
            ===================================================== */

            const blob =
                await response.blob();


            /* =====================================================
               CREATE TEMPORARY DOWNLOAD URL
            ===================================================== */

            const downloadUrl =
                window.URL.createObjectURL(blob);


            /* =====================================================
               CREATE DOWNLOAD LINK
            ===================================================== */

            const link =
                document.createElement("a");

            link.href =
                downloadUrl;

            link.download =
                `ticket_${pnr}.pdf`;

            document.body.appendChild(link);

            link.click();

            link.remove();


            /* =====================================================
               CLEANUP
            ===================================================== */

            window.URL.revokeObjectURL(
                downloadUrl
            );

        } catch (error) {

            console.error(
                "PDF DOWNLOAD ERROR:",
                error
            );

            alert(
                "Something went wrong while downloading the ticket."
            );
        }
    };


    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <main className="confirmation-page">

            <div className="confirmation-container">


                {/* =================================================
                    SUCCESS HEADER
                ================================================= */}

                <div className="success-header-card">

                    {/* LEFT / CENTER CONTENT */}

                    <div className="success-header-content">

                        <div className="success-tick-icon">

                            <svg
                                viewBox="0 0 24 24"
                                width="48"
                                height="48"
                            >

                                <path
                                    fill="#22c55e"
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                                />

                            </svg>

                        </div>


                        <h1>
                            Booking Confirmed!
                        </h1>


                        <p className="sub-pnr-text">

                            Your flight booking has been
                            successfully processed.
                            Your booking reference is shown below.

                        </p>


                        {/* PNR */}

                        <div className="pnr-highlight-box">

                            <span>
                                BOOKING REFERENCE (PNR)
                            </span>

                            <strong>
                                {pnr}
                            </strong>

                        </div>

                    </div>


                    {/* =================================================
                        DOWNLOAD PDF - TOP RIGHT SIDE
                    ================================================= */}

                    <div className="confirmation-download-wrapper">

                        <button
                            type="button"
                            className="confirm-download-btn"
                            onClick={handleDownloadPDF}
                        >
                            <span className="download-icon">
                                📥
                            </span>

                            <span>
                                DOWNLOAD PDF TICKET
                            </span>
                        </button>

                    </div>

                </div>


                {/* =================================================
                    DETAILS GRID
                ================================================= */}

                <div className="confirmation-details-grid">


                    {/* =================================================
                        LEFT COLUMN
                    ================================================= */}

                    <div className="confirm-left-column">


                        {/* =================================================
                            FLIGHT DETAILS
                        ================================================= */}

                        <div className="confirm-section-card">

                            <h3>
                                Flight Details
                            </h3>


                            {/* DEPARTURE */}

                            {departureFlight && (

                                <div className="confirm-flight-block">

                                    <div className="confirm-flight-header">

                                        <span className="confirm-badge departure">
                                            DEPARTURE
                                        </span>

                                        <strong>

                                            {departureFlight.airline ||
                                                "Flight"}

                                            {departureFlight.flightNumber
                                                ? ` (${departureFlight.flightNumber})`
                                                : ""}

                                        </strong>

                                    </div>


                                    <div className="confirm-route-times">

                                        <div className="time-location">

                                            <strong>
                                                {departureFlight.departureTime ||
                                                    "—"}
                                            </strong>

                                            <span>

                                                {departureFlight.from ||
                                                    getCityDisplayName(selectedFromCity) ||
                                                    "—"}

                                            </span>

                                        </div>


                                        <div className="direction-line">

                                            <span>

                                                {departureFlight.duration ||
                                                    "—"}

                                            </span>

                                            <div className="line-bar">
                                                ✈
                                            </div>

                                            <span>
                                                Non-stop
                                            </span>

                                        </div>


                                        <div className="time-location">

                                            <strong>

                                                {departureFlight.arrivalTime ||
                                                    "—"}

                                            </strong>

                                            <span>

                                                {departureFlight.to ||
                                                    getCityDisplayName(selectedToCity) ||
                                                    "—"}

                                            </span>

                                        </div>

                                    </div>


                                    <div className="confirm-date-row">

                                        Date:{" "}

                                        {getDate(
                                            departureFlight
                                        )}

                                    </div>

                                </div>
                            )}


                            {/* RETURN */}

                            {returnFlight && (

                                <div className="confirm-flight-block return-confirm-block">

                                    <div className="confirm-flight-header">

                                        <span className="confirm-badge return">
                                            RETURN
                                        </span>

                                        <strong>

                                            {returnFlight.airline ||
                                                "Flight"}

                                            {returnFlight.flightNumber
                                                ? ` (${returnFlight.flightNumber})`
                                                : ""}

                                        </strong>

                                    </div>


                                    <div className="confirm-route-times">

                                        <div className="time-location">

                                            <strong>

                                                {returnFlight.departureTime ||
                                                    "—"}

                                            </strong>

                                            <span>

                                                {returnFlight.from ||
                                                    getCityDisplayName(selectedToCity) ||
                                                    "—"}

                                            </span>

                                        </div>


                                        <div className="direction-line">

                                            <span>

                                                {returnFlight.duration ||
                                                    "—"}

                                            </span>

                                            <div className="line-bar">
                                                ✈
                                            </div>

                                            <span>
                                                Non-stop
                                            </span>

                                        </div>


                                        <div className="time-location">

                                            <strong>

                                                {returnFlight.arrivalTime ||
                                                    "—"}

                                            </strong>

                                            <span>

                                                {returnFlight.to ||
                                                    getCityDisplayName(selectedFromCity) ||
                                                    "—"}

                                            </span>

                                        </div>

                                    </div>


                                    <div className="confirm-date-row">

                                        Date:{" "}

                                        {getDate(
                                            returnFlight
                                        )}

                                    </div>

                                </div>
                            )}

                        </div>


                        {/* =================================================
                            PASSENGERS
                        ================================================= */}

                        <div className="confirm-section-card">

                            <h3>
                                Passengers
                            </h3>


                            <div className="passengers-table-wrapper">

                                <table className="passengers-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                Name
                                            </th>

                                            <th>
                                                Gender
                                            </th>

                                            <th>
                                                Date of Birth
                                            </th>

                                            <th>
                                                Type
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {passengers.map(
                                            (
                                                passenger,
                                                index
                                            ) => (

                                                <tr
                                                    key={index}
                                                >

                                                    <td>

                                                        <strong>

                                                            {
                                                                getPassengerName(
                                                                    passenger
                                                                )
                                                            }

                                                        </strong>

                                                    </td>


                                                    <td>

                                                        {
                                                            passenger?.gender ||
                                                            "—"
                                                        }

                                                    </td>


                                                    <td>

                                                        {
                                                            passenger?.dateOfBirth ||
                                                            passenger?.dob ||
                                                            "—"
                                                        }

                                                    </td>


                                                    <td>

                                                        <span className="p-type-badge">

                                                            {
                                                                getPassengerType(
                                                                    passenger
                                                                )
                                                            }

                                                        </span>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>


                        {/* =================================================
                            SEAT DETAILS
                        ================================================= */}

                        <div className="confirm-section-card">

                            <h3>
                                Seat Assignment
                            </h3>

                            <div className="confirmation-seat-list">

                                {passengers.map(
                                    (passenger, index) => {

                                        const departureSeat =
                                            selectedSeats[
                                            `${index}-departure`
                                            ];

                                        const returnSeat =
                                            selectedSeats[
                                            `${index}-return`
                                            ];

                                        return (

                                            <div
                                                className="confirmation-seat-row"
                                                key={index}
                                            >

                                                <strong>
                                                    {
                                                        getPassengerName(
                                                            passenger
                                                        )
                                                    }
                                                </strong>

                                                <div>

                                                    <span>
                                                        Departure:{" "}
                                                        <b>
                                                            {
                                                                getSeatDisplay(
                                                                    departureSeat
                                                                )
                                                            }
                                                        </b>
                                                    </span>

                                                    {selectedReturn && (

                                                        <span>
                                                            Return:{" "}
                                                            <b>
                                                                {
                                                                    getSeatDisplay(
                                                                        returnSeat
                                                                    )
                                                                }
                                                            </b>
                                                        </span>

                                                    )}

                                                </div>

                                            </div>

                                        );
                                    }
                                )}

                            </div>

                        </div>


                        {/* =================================================
                            BACK TO HOMEPAGE
                            BELOW SEAT ASSIGNMENT
                        ================================================= */}

                        <button
                            type="button"
                            className="confirm-home-btn"
                            onClick={() =>
                                navigate("/")
                            }
                        >
                            BACK TO HOMEPAGE
                        </button>


                    </div>


                    {/* =================================================
                        RIGHT COLUMN
                    ================================================= */}

                    <div className="confirm-right-column">


                        {/* =================================================
                            PAYMENT SUMMARY
                        ================================================= */}

                        <div className="confirm-summary-card">

                            <h3>
                                Payment Summary
                            </h3>


                            <div className="payment-row">

                                <span>
                                    Booking Status
                                </span>

                                <span className="status-confirmed">
                                    PAID & CONFIRMED
                                </span>

                            </div>


                            <div className="payment-row">

                                <span>
                                    Payment Method
                                </span>

                                <span>

                                    {paymentDetails?.method ===
                                        "card"
                                        ? "Credit / Debit Card"
                                        : paymentDetails?.method ===
                                            "upi"
                                            ? "UPI"
                                            : paymentDetails?.method ===
                                                "netbanking"
                                                ? "Net Banking"
                                                : paymentDetails?.method ===
                                                    "paypal"
                                                    ? "PayPal"
                                                    : "Online Payment"}

                                </span>

                            </div>


                            {paymentDetails?.transactionId && (

                                <div className="payment-row">

                                    <span>
                                        Transaction ID
                                    </span>

                                    <span>

                                        {
                                            paymentDetails.transactionId
                                        }

                                    </span>

                                </div>

                            )}


                            <div className="payment-row">

                                <span>
                                    Total Price Paid
                                </span>

                                <strong>

                                    $
                                    {formatUSD(totalPrice)}

                                </strong>

                            </div>

                        </div>


                        {/* =================================================
                            PRICE BREAKDOWN
                        ================================================= */}

                        <div className="confirm-summary-card">

                            <h3>
                                Price Details
                            </h3>


                            <div className="payment-row">

                                <span>
                                    Flight Fare
                                </span>

                                <span>

                                    $
                                    {formatUSD(pricing?.grandTotalPrice || 0)}

                                </span>

                            </div>


                            <div className="payment-row">

                                <span>
                                    Seat Charges
                                </span>

                                <span>

                                    $
                                    {formatUSD(totalSeatCharges || 0)}

                                </span>

                            </div>


                            <div className="payment-row">

                                <span>
                                    Add-ons
                                </span>

                                <span>

                                    $
                                    {formatUSD(totalAddOnCharges || 0)}

                                </span>

                            </div>


                            <div className="confirmation-price-divider"></div>


                            <div className="payment-row confirmation-final-price">

                                <span>
                                    Total Paid
                                </span>

                                <strong>

                                    $
                                    {formatUSD(totalPrice)}

                                </strong>

                            </div>

                        </div>


                        {/* =================================================
                            SUPPORT
                        ================================================= */}

                        <div className="confirm-summary-card support-card">

                            <h3>
                                Need Assistance?
                            </h3>


                            <p>

                                For cancellations,
                                rescheduling or specific
                                requests regarding this
                                booking, please contact us:

                            </p>


                            <div className="support-phone">

                                📞{" "}

                                <strong>
                                    +1-844-317-9052
                                </strong>

                            </div>


                            <p className="support-sub">

                                Toll-free 24/7 customer
                                assistance

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </main>
    );
}


export default BookingConfirmation;