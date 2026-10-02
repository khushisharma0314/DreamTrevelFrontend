import "./Disclaimer.css";

function Disclaimer() {
    return (
        <main className="disclaimer-page">

            {/* =========================================================
                PAGE HEADING + BREADCRUMB
            ========================================================= */}

            <section className="disclaimer-heading-section">

                <h1>Flight Booking Disclaimer</h1>

                <div className="disclaimer-breadcrumb">
                    <a href="/">Home</a>
                    <span>&gt;</span>
                    <span>Disclaimer</span>
                </div>

                <div className="disclaimer-heading-line"></div>

            </section>


            {/* =========================================================
                MAIN CONTENT
            ========================================================= */}

            <section className="disclaimer-content">

                {/* =====================================================
                    INTRODUCTION
                ===================================================== */}

                <p className="disclaimer-effective-date">
                    <strong>Effective Date: October 2, 2026</strong>
                </p>

                <p className="disclaimer-intro">
                    Welcome to DREAM TRAVEL. This Disclaimer explains the
                    limitations and responsibilities associated with using our
                    flight search, booking, payment, and travel information
                    services. By accessing our website or making a flight
                    booking through our platform, you acknowledge and agree to
                    the information provided in this Disclaimer.
                </p>


                {/* =====================================================
                    GENERAL INFORMATION
                ===================================================== */}

                <div className="disclaimer-section">

                    <h2>General Flight Information</h2>

                    <p>
                        DREAM TRAVEL provides flight search and booking
                        information intended to help travelers compare available
                        flights, fares, schedules, routes, and related booking
                        details.
                    </p>

                    <p>
                        While we make reasonable efforts to display accurate and
                        up-to-date information, flight schedules, fares,
                        availability, baggage rules, seat availability, and
                        airline policies may change at any time.
                    </p>

                    <p>
                        Information displayed on our website should therefore be
                        considered subject to confirmation at the time of
                        booking.
                    </p>

                </div>


                {/* =====================================================
                    FLIGHT BOOKING PLATFORM
                ===================================================== */}

                <div className="disclaimer-section">

                    <h2>Flight Booking Platform</h2>

                    <p>
                        DREAM TRAVEL is an online flight booking platform that
                        allows users to search, compare, and book available
                        flights through our website.
                    </p>

                    <p>
                        DREAM TRAVEL is not an airline and does not operate,
                        control, or manage the aircraft, flight crew, airport
                        operations, or airline services associated with your
                        booking.
                    </p>

                    <p>
                        Airline names, logos, flight numbers, and trademarks
                        displayed on our platform belong to their respective
                        owners.
                    </p>

                </div>


                {/* =====================================================
                    AIRLINE SERVICES
                ===================================================== */}

                <div className="disclaimer-section">

                    <h2>Airline Services and Responsibilities</h2>

                    <p>
                        Flights booked through DREAM TRAVEL are operated by the
                        respective airlines shown during the booking process.
                        Each airline is responsible for the operation and
                        delivery of its flight services.
                    </p>

                    <p>
                        This includes matters such as:
                    </p>

                    <ul>
                        <li>Flight operations</li>
                        <li>Departure and arrival schedules</li>
                        <li>Aircraft changes</li>
                        <li>Flight delays and cancellations</li>
                        <li>Baggage handling</li>
                        <li>Onboard services</li>
                        <li>Airline check-in procedures</li>
                        <li>Operational decisions</li>
                    </ul>

                    <p>
                        Airline-specific terms and conditions may apply to every
                        booking.
                    </p>

                </div>


                {/* =====================================================
                    FARES AND AVAILABILITY
                ===================================================== */}

                <div className="disclaimer-section">

                    <h2>Flight Fares and Availability</h2>

                    <p>
                        Flight fares and seat availability shown on DREAM TRAVEL
                        are based on the information available to us at the time
                        of the search or booking process.
                    </p>

                    <p>
                        Fares may change due to airline availability, fare
                        inventory, taxes, fees, currency fluctuations, or other
                        airline pricing conditions.
                    </p>

                    <p>
                        DREAM TRAVEL cannot guarantee that a displayed fare or
                        seat will remain available until the booking has been
                        successfully completed and confirmation has been issued.
                    </p>

                    <ul>
                        <li>Displayed fares may change before booking completion</li>
                        <li>Available seats may change without notice</li>
                        <li>Fare conditions may vary by airline and ticket type</li>
                        <li>Additional airline charges may apply</li>
                    </ul>

                </div>


                {/* =====================================================
                    BOOKING CONFIRMATION
                ===================================================== */}

                <div className="disclaimer-section">

                    <h2>Booking Confirmation</h2>

                    <p>
                        A flight booking is considered confirmed only after the
                        booking process has been successfully completed and
                        DREAM TRAVEL provides a booking confirmation or
                        reservation reference.
                    </p>

                    <p>
                        A temporary fare display, selected flight, payment
                        initiation, or seat selection does not by itself
                        guarantee that a ticket has been issued.
                    </p>

                    <p>
                        Customers should carefully review their confirmation
                        details, including passenger names, travel dates,
                        flight numbers, airports, baggage allowance, and fare
                        conditions.
                    </p>

                </div>


                {/* =====================================================
                    PASSENGER INFORMATION
                ===================================================== */}

                <div className="disclaimer-section">

                    <h2>Passenger Information</h2>

                    <p>
                        Travelers are responsible for providing correct and
                        complete passenger information during the booking
                        process.
                    </p>

                    <p>
                        This may include:
                    </p>

                    <ul>
                        <li>Passenger name</li>
                        <li>Date of birth</li>
                        <li>Contact information</li>
                        <li>Passport or identification details</li>
                        <li>Other information required by the airline</li>
                    </ul>

                    <p>
                        Incorrect or incomplete information may result in booking
                        issues, additional charges, denied boarding, or other
                        travel complications.
                    </p>

                </div>


                {/* =====================================================
                    TRAVEL DOCUMENTATION
                ===================================================== */}

                <div className="disclaimer-section">

                    <h2>Travel Documents and Entry Requirements</h2>

                    <p>
                        Travelers are responsible for ensuring that they have all
                        documents required for their journey.
                    </p>

                    <ul>
                        <li>Valid passport or government-issued identification</li>
                        <li>Required visas</li>
                        <li>Transit permits, where applicable</li>
                        <li>Entry authorizations</li>
                        <li>Required health or travel documents</li>
                    </ul>

                    <p>
                        DREAM TRAVEL does not guarantee entry into any country
                        or territory. Travelers should verify applicable
                        requirements with the relevant government authorities,
                        embassy, consulate, or airline before traveling.
                    </p>

                </div>


                {/* =====================================================
                    FLIGHT CHANGES AND DISRUPTIONS
                ===================================================== */}

                <div className="disclaimer-section">

                    <h2>Flight Changes and Disruptions</h2>

                    <p>
                        Airlines may change flight schedules, departure times,
                        routes, aircraft, or other operational details after a
                        booking has been completed.
                    </p>

                    <p>
                        Flight delays, cancellations, missed connections,
                        weather conditions, airport restrictions, operational
                        issues, and other disruptions may occur.
                    </p>

                    <p>
                        Any available rebooking, cancellation, refund, or
                        compensation options will depend on the applicable
                        airline rules and the conditions of the purchased fare.
                    </p>

                </div>


                {/* =====================================================
                    SEATS AND ADDITIONAL SERVICES
                ===================================================== */}

                <div className="disclaimer-section">

                    <h2>Seats and Additional Flight Services</h2>

                    <p>
                        Seat selection, baggage, meals, priority services, and
                        other optional services may be subject to availability
                        and additional charges.
                    </p>

                    <p>
                        Selecting a seat or requesting an additional service
                        through the website does not guarantee that the airline
                        will provide the exact service if operational or
                        availability changes occur.
                    </p>

                    <p>
                        Airline-specific conditions may apply to all optional
                        services purchased with a flight booking.
                    </p>

                </div>


                {/* =====================================================
                    EXTERNAL LINKS
                ===================================================== */}

                <div className="disclaimer-section">

                    <h2>Third-Party Websites and Services</h2>

                    <p>
                        DREAM TRAVEL may provide links or references to airline,
                        airport, payment, or other third-party websites and
                        services.
                    </p>

                    <p>
                        These third-party websites operate independently from
                        DREAM TRAVEL. We do not control their content,
                        availability, security, privacy practices, or policies.
                    </p>

                    <p>
                        Users should review the applicable terms and policies of
                        any third-party service before using it.
                    </p>

                </div>


                {/* =====================================================
                    TRAVEL ADVISORIES
                ===================================================== */}

                <div className="disclaimer-section">

                    <h2>Travel Advisories and Regulations</h2>

                    <p>
                        Travel restrictions, immigration requirements, airport
                        rules, security procedures, and government travel
                        advisories may change without notice.
                    </p>

                    <p>
                        Travelers should independently verify current
                        requirements with relevant government authorities,
                        airports, embassies, consulates, and airlines before
                        departure.
                    </p>

                    <p>
                        Information displayed on DREAM TRAVEL should not be
                        treated as a substitute for official government or
                        airline information.
                    </p>

                </div>


                {/* =====================================================
                    NO PROFESSIONAL ADVICE
                ===================================================== */}

                <div className="disclaimer-section">

                    <h2>Information Is Not Professional Advice</h2>

                    <p>
                        Information available through DREAM TRAVEL is provided
                        for general travel and flight-booking purposes only.
                    </p>

                    <p>
                        Nothing on our website should be considered legal,
                        immigration, medical, financial, tax, or other
                        professional advice.
                    </p>

                    <p>
                        Travelers should consult the appropriate qualified
                        authority or professional when specialized advice is
                        required.
                    </p>

                </div>


                {/* =====================================================
                    LIMITATION OF LIABILITY
                ===================================================== */}

                <div className="disclaimer-section">

                    <h2>Limitation of Liability</h2>

                    <p>
                        To the fullest extent permitted by applicable law,
                        DREAM TRAVEL shall not be responsible for losses or
                        damages arising from circumstances outside our
                        reasonable control, including:
                    </p>

                    <ul>
                        <li>Airline delays or cancellations</li>
                        <li>Flight schedule changes</li>
                        <li>Missed connections</li>
                        <li>Lost, delayed, or damaged baggage</li>
                        <li>Airline operational decisions</li>
                        <li>Airport disruptions</li>
                        <li>Weather-related disruptions</li>
                        <li>Government restrictions</li>
                        <li>Incorrect passenger information</li>
                        <li>Technical interruptions</li>
                        <li>Website availability issues</li>
                    </ul>

                    <p>
                        Nothing in this Disclaimer is intended to exclude or
                        limit any rights or responsibilities that cannot
                        lawfully be excluded or limited under applicable law.
                    </p>

                </div>


                {/* =====================================================
                    WEBSITE AVAILABILITY
                ===================================================== */}

                <div className="disclaimer-section">

                    <h2>Website and System Availability</h2>

                    <p>
                        We aim to keep DREAM TRAVEL available and functioning
                        reliably, but we cannot guarantee uninterrupted access
                        to the website or booking services at all times.
                    </p>

                    <p>
                        Temporary interruptions may occur because of maintenance,
                        technical problems, connectivity issues, airline system
                        availability, payment processing issues, or other
                        circumstances beyond our reasonable control.
                    </p>

                </div>


                {/* =====================================================
                    PRICING AND PROMOTIONAL CONTENT
                ===================================================== */}

                <div className="disclaimer-section">

                    <h2>Promotional and Fare Information</h2>

                    <p>
                        DREAM TRAVEL may display promotional fares, special
                        offers, discounts, or featured flight options from time
                        to time.
                    </p>

                    <p>
                        Promotional offers may have specific eligibility,
                        availability, travel-date, booking, or cancellation
                        conditions.
                    </p>

                    <p>
                        The final applicable fare and conditions will be shown
                        during the booking process and are subject to the
                        relevant airline or fare rules.
                    </p>

                </div>


                {/* =====================================================
                    CHANGES TO THIS DISCLAIMER
                ===================================================== */}

                <div className="disclaimer-section">

                    <h2>Changes to This Disclaimer</h2>

                    <p>
                        DREAM TRAVEL may update or revise this Disclaimer from
                        time to time to reflect changes to our flight booking
                        services, website features, or applicable requirements.
                    </p>

                    <p>
                        Updated versions will be posted on this page with a
                        revised effective date where appropriate.
                    </p>

                    <p>
                        We encourage users to review this Disclaimer
                        periodically.
                    </p>

                </div>


                {/* =====================================================
                    CONTACT US
                ===================================================== */}

                <div className="disclaimer-section disclaimer-contact">

                    <h2>Questions About Your Flight Booking?</h2>

                    <p>
                        If you have questions about flight information,
                        booking details, cancellations, refunds, or services
                        available through DREAM TRAVEL, please contact us.
                    </p>

                    <p className="disclaimer-company">
                        DREAM TRAVEL
                    </p>

                    <p>
                        <strong>Corporate Office:</strong>{" "}
                        134 S Street, Windham, NY 12496
                    </p>

                    <p>
                        <strong>Registered Office:</strong>{" "}
                        31 Scandinavian Dr Windham, NY 12496
                    </p>

                    <p>
                        Email:{" "}
                        <a href="mailto:info@dreamtravel.com">
                            info@dreamtravel.com
                        </a>
                    </p>

                    <p>
                        Toll-Free:{" "}
                        <a href="tel:+18887526024">
                            +1-844-317-905224
                        </a>
                    </p>

                </div>


                {/* =====================================================
                    FINAL STATEMENT
                ===================================================== */}

                <p className="disclaimer-final">
                    By using the DREAM TRAVEL website or booking a flight
                    through our platform, you acknowledge that you have read
                    and understood this Disclaimer and agree to use the
                    information and services provided through the platform
                    responsibly.
                </p>

            </section>

        </main>
    );
}

export default Disclaimer;