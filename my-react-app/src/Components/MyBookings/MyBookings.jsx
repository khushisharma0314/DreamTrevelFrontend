
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyBookings.css";

function MyBookings() {

    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [flightDetails, setFlightDetails] = useState({});
    const [expandedBookings, setExpandedBookings] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    // =====================================================
    // FETCH MY BOOKINGS
    // =====================================================

    useEffect(() => {

        const fetchMyBookings = async () => {

            try {

                setIsLoading(true);
                setError("");

                if (!token) {
                    setError("Please login to view your bookings.");
                    setIsLoading(false);
                    return;
                }

                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/bookings/my-bookings`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data?.message ||
                        "Failed to fetch bookings."
                    );
                }

                const bookingList =
                    Array.isArray(data?.bookings)
                        ? data.bookings
                        : [];

                setBookings(bookingList);

                // =====================================================
                // FETCH FLIGHT DETAILS
                // =====================================================

                const flightIds = [];

                bookingList.forEach((booking) => {

                    if (booking.departureFlightId) {
                        flightIds.push(
                            booking.departureFlightId
                        );
                    }

                    if (booking.returnFlightId) {
                        flightIds.push(
                            booking.returnFlightId
                        );
                    }

                });

                const uniqueFlightIds =
                    [...new Set(flightIds)];

                const details = {};

                await Promise.all(
                    uniqueFlightIds.map(async (flightId) => {

                        try {

                            const flightResponse =
                                await fetch(
                                    `${import.meta.env.VITE_API_BASE_URL}/api/flights/${flightId}`,
                                    {
                                        method: "GET",
                                        headers: {
                                            Authorization:
                                                `Bearer ${token}`,
                                            "Content-Type":
                                                "application/json"
                                        }
                                    }
                                );

                            if (
                                flightResponse.ok
                            ) {

                                const flight =
                                    await flightResponse.json();

                                details[flightId] =
                                    flight;
                            }

                        } catch (flightError) {

                            console.error(
                                "Flight details error:",
                                flightError
                            );

                        }

                    })
                );

                setFlightDetails(details);

            } catch (err) {

                console.error(
                    "My bookings error:",
                    err
                );

                setError(
                    err.message ||
                    "Something went wrong while loading bookings."
                );

            } finally {

                setIsLoading(false);

            }

        };

        fetchMyBookings();

    }, [token]);


    // =====================================================
    // VIEW / HIDE DETAILS
    // =====================================================

    const toggleDetails = (pnr) => {

        setExpandedBookings((previous) => ({
            ...previous,
            [pnr]: !previous[pnr]
        }));

    };


    // =====================================================
    // DOWNLOAD TICKET
    // =====================================================

    const downloadTicket = async (pnr) => {

        try {

            if (!token) {
                alert("Please login first.");
                return;
            }

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/bookings/pdf/${pnr}`,
                {
                    method: "GET",
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "PDF download error:",
                    errorText
                );

                alert(
                    "Unable to download ticket."
                );

                return;
            }

            const blob =
                await response.blob();

            const url =
                window.URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;
            link.download =
                `Ticket-${pnr}.pdf`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {

            console.error(
                "Download ticket error:",
                error
            );

            alert(
                "Something went wrong while downloading the ticket."
            );

        }

    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (dateValue) => {

        if (!dateValue) {
            return "—";
        }

        try {

            const date =
                new Date(dateValue);

            if (Number.isNaN(date.getTime())) {
                return dateValue;
            }

            return date.toLocaleDateString(
                "en-GB",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );

        } catch {
            return dateValue;
        }

    };


    // =====================================================
    // FORMAT TIME
    // =====================================================

    const formatTime = (timeValue) => {

        if (!timeValue) {
            return "—";
        }

        try {

            const parts =
                timeValue.split(":");

            const hours =
                parseInt(parts[0], 10);

            const minutes =
                parts[1] || "00";

            if (Number.isNaN(hours)) {
                return timeValue;
            }

            const suffix =
                hours >= 12
                    ? "pm"
                    : "am";

            const displayHour =
                hours % 12 || 12;

            return `${String(displayHour).padStart(2, "0")}:${minutes} ${suffix}`;

        } catch {
            return timeValue;
        }

    };


    // =====================================================
    // FLIGHT CARD
    // =====================================================

    const renderFlight = (
        flightId,
        label
    ) => {

        const flight =
            flightDetails[flightId];

        if (!flight) {

            return (
                <div className="flight-loading">
                    Loading flight details...
                </div>
            );

        }

        return (
            <div className="booking-flight-section">

                {label && (
                    <div className="flight-type-label">
                        {label}
                    </div>
                )}

                {/* Airline */}
                <div className="booking-airline-row">

                    <div className="booking-airline">

                        <strong>
                            {flight.airline || "Airline"}
                        </strong>

                        <span>
                            {flight.flightNumber || "—"}
                        </span>

                    </div>

                </div>


                {/* Route */}
                <div className="booking-route">

                    <div className="booking-airport">

                        <strong>
                            {flight.from || "—"}
                        </strong>

                        <span>
                            {formatTime(
                                flight.departureTime
                            )}
                        </span>

                    </div>


                    <div className="booking-route-middle">

                        <div className="route-line">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>

                        <div className="booking-duration">
                            {flight.duration || "—"}
                        </div>

                        <div className="booking-stops">

                            {flight.stops === 0
                                ? "Non-stop"
                                : `${flight.stops} Stop${flight.stops > 1 ? "s" : ""}`
                            }

                        </div>

                    </div>


                    <div className="booking-airport">

                        <strong>
                            {flight.to || "—"}
                        </strong>

                        <span>
                            {formatTime(
                                flight.arrivalTime
                            )}
                        </span>

                    </div>

                </div>


                {/* Date */}
                <div className="booking-flight-date">

                    📅{" "}

                    {formatDate(
                        flight.departureDate
                    )}

                </div>

            </div>
        );

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (isLoading) {

        return (
            <div className="my-bookings-page">

                <div className="my-bookings-container">

                    <div className="bookings-loading">
                        Loading your bookings...
                    </div>

                </div>

            </div>
        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (
            <div className="my-bookings-page">

                <div className="my-bookings-container">

                    <div className="bookings-error">

                        <h2>
                            Unable to load bookings
                        </h2>

                        <p>
                            {error}
                        </p>

                        <button
                            onClick={() =>
                                navigate("/")
                            }
                        >
                            Go Home
                        </button>

                    </div>

                </div>

            </div>
        );

    }


    // =====================================================
    // NO BOOKINGS
    // =====================================================

    if (bookings.length === 0) {

        return (
            <div className="my-bookings-page">

                <div className="my-bookings-container">

                    <div className="bookings-header">

                        <h1>
                            My Bookings
                        </h1>

                    </div>

                    <div className="no-bookings">

                        <h2>
                            No bookings found
                        </h2>

                        <p>
                            You haven't made any flight
                            bookings yet.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/")
                            }
                        >
                            Search Flights
                        </button>

                    </div>

                </div>

            </div>
        );

    }


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <div className="my-bookings-page">

            <div className="my-bookings-container">

                {/* HEADER */}

                <div className="bookings-header">

                    <div>

                        <h1>
                            My Bookings
                        </h1>

                        <p>
                            View and manage your flight bookings
                        </p>

                    </div>

                </div>


                {/* BOOKINGS */}

                <div className="bookings-list">

                    {bookings.map((booking) => {

                        const departureFlight =
                            flightDetails[
                            booking.departureFlightId
                            ];

                        const returnFlight =
                            booking.returnFlightId
                                ? flightDetails[
                                booking.returnFlightId
                                ]
                                : null;

                        const isExpanded =
                            expandedBookings[
                            booking.pnr
                            ] || false;

                        return (

                            <div
                                className="booking-card"
                                key={booking.id || booking.pnr}
                            >

                                {/* =================================================
                                    FLIGHT DETAILS
                                ================================================= */}

                                {renderFlight(
                                    booking.departureFlightId,
                                    ""
                                )}


                                {/* RETURN FLIGHT */}

                                {booking.returnFlightId &&
                                    renderFlight(
                                        booking.returnFlightId,
                                        "Return Flight"
                                    )
                                }


                                {/* =================================================
                                    EXPANDABLE BOOKING DETAILS
                                ================================================= */}

                                {isExpanded && (

                                    <div className="booking-extra-details">

                                        <div className="booking-detail-item">

                                            <span className="detail-icon">
                                                📅
                                            </span>

                                            <div>

                                                <small>
                                                    Booked On
                                                </small>

                                                <strong>
                                                    {formatDate(
                                                        booking.createdAt
                                                    )}
                                                </strong>

                                            </div>

                                        </div>


                                        <div className="booking-detail-item">

                                            <span className="detail-icon">
                                                👥
                                            </span>

                                            <div>

                                                <small>
                                                    Passengers
                                                </small>

                                                <strong>
                                                    {booking.passengers?.length || 0}
                                                </strong>

                                            </div>

                                        </div>


                                        <div className="booking-detail-item">

                                            <span className="detail-icon">
                                                ◷
                                            </span>

                                            <div>

                                                <small>
                                                    Class
                                                </small>

                                                <strong>
                                                    {departureFlight?.flightClass || "economy"}
                                                </strong>

                                            </div>

                                        </div>


                                        <div className="booking-detail-item">

                                            <span className="detail-icon">
                                                ✈
                                            </span>

                                            <div>

                                                <small>
                                                    PNR
                                                </small>

                                                <strong>
                                                    {booking.pnr || "—"}
                                                </strong>

                                            </div>

                                        </div>

                                    </div>

                                )}


                                {/* =================================================
                                    TOTAL AMOUNT
                                ================================================= */}

                                {isExpanded && (

                                    <div className="booking-total-section">

                                        <div>

                                            <span>
                                                Total Amount
                                            </span>

                                            <strong>
                                                ₹
                                                {Number(
                                                    booking.totalPrice || 0
                                                ).toLocaleString(
                                                    "en-IN",
                                                    {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    }
                                                )}
                                            </strong>

                                        </div>

                                    </div>

                                )}


                                {/* =================================================
                                    ACTION BUTTONS
                                ================================================= */}

                                <div className="booking-actions">

                                    <button
                                        className="view-details-btn"
                                        onClick={() =>
                                            toggleDetails(
                                                booking.pnr
                                            )
                                        }
                                    >

                                        {isExpanded
                                            ? "Hide Details"
                                            : "View Details"
                                        }

                                    </button>


                                    <button
                                        className="download-ticket-btn"
                                        onClick={() =>
                                            downloadTicket(
                                                booking.pnr
                                            )
                                        }
                                    >
                                        Download Ticket
                                    </button>

                                </div>

                            </div>

                        );

                    })}

                </div>

            </div>

        </div>

    );

}

export default MyBookings;
