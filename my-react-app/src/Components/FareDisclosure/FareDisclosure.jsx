import "./FareDisclosure.css";

function FareDisclosure() {
    return (
        <main className="fare-disclosure-page">

            {/* =========================================================
                PAGE HEADING + BREADCRUMB
            ========================================================= */}

            <section className="fare-disclosure-heading-section">

                <h1>Fare Transparency & Disclosure</h1>

                <div className="fare-disclosure-breadcrumb">
                    <a href="/">Home</a>
                    <span>&gt;</span>
                    <span>Fare Disclosure Policy</span>
                </div>

            </section>


            {/* =========================================================
                MAIN CONTENT
            ========================================================= */}

            <section className="fare-disclosure-content">

                <p className="fare-disclosure-effective-date">
                    Effective Date: October 2, 2026
                </p>

                <p>
                    DREAM TRAVEL is committed to presenting flight prices as
                    clearly and accurately as reasonably possible. This Fare
                    Disclosure Policy explains how fares, taxes, fees, optional
                    services, and other booking charges may be displayed during
                    the flight search and booking process.
                </p>

                <p>
                    Because airline fares and seat availability can change
                    dynamically, the price shown during a search may not always
                    remain available until the booking is completed. Customers
                    should review the final fare and applicable conditions before
                    submitting payment.
                </p>


                {/* =====================================================
                    1. FARE TRANSPARENCY
                ===================================================== */}

                <div className="fare-disclosure-section">

                    <h2>1. Fare Transparency</h2>

                    <p>
                        We aim to provide customers with a clear view of the
                        applicable cost of a flight before they complete their
                        booking.
                    </p>

                    <p>
                        Where applicable, the booking flow may display:
                    </p>

                    <ul>
                        <li>Base airfare</li>
                        <li>Taxes and government charges</li>
                        <li>Airport and carrier-imposed charges</li>
                        <li>Applicable booking or service fees</li>
                        <li>Optional flight services</li>
                        <li>Total amount payable</li>
                    </ul>

                    <p>
                        The exact components of a fare depend on the airline,
                        itinerary, passenger type, selected services, and fare
                        conditions.
                    </p>

                </div>


                {/* =====================================================
                    2. DISPLAYED FARE
                ===================================================== */}

                <div className="fare-disclosure-section">

                    <h2>2. What the Displayed Fare Represents</h2>

                    <p>
                        The fare displayed in flight search results represents
                        the available pricing information returned for the
                        selected itinerary at the time of the search.
                    </p>

                    <p>
                        Depending on the selected flight and fare type, the
                        displayed price may include the applicable mandatory
                        taxes and charges available at that time.
                    </p>

                    <p>
                        Optional services may be priced separately. These can
                        include:
                    </p>

                    <ul>
                        <li>Preferred seat selection</li>
                        <li>Checked or additional baggage</li>
                        <li>Meals and other onboard services</li>
                        <li>Priority or fast-track services</li>
                        <li>Other airline-provided optional services</li>
                    </ul>

                    <p>
                        Any applicable additional amount should be reviewed
                        before the final booking is submitted.
                    </p>

                </div>


                {/* =====================================================
                    3. DYNAMIC AIRFARES
                ===================================================== */}

                <div className="fare-disclosure-section">

                    <h2>3. Dynamic Flight Pricing</h2>

                    <p>
                        Airline fares are dynamic and may change frequently.
                        Pricing can depend on several factors, including:
                    </p>

                    <ul>
                        <li>Remaining seat inventory</li>
                        <li>Demand for a particular flight</li>
                        <li>Travel date and route</li>
                        <li>Selected cabin class</li>
                        <li>Fare class availability</li>
                        <li>Airline pricing rules</li>
                        <li>Taxes, fees, and other applicable charges</li>
                    </ul>

                    <p>
                        As a result, a fare displayed during an earlier search
                        may differ from the fare available when the customer
                        proceeds to booking.
                    </p>

                </div>


                {/* =====================================================
                    4. PRICE AT BOOKING
                ===================================================== */}

                <div className="fare-disclosure-section">

                    <h2>4. Fare at the Time of Booking</h2>

                    <p>
                        Selecting a flight or viewing a fare does not reserve
                        the price indefinitely. The applicable fare is subject
                        to availability until the booking process has been
                        successfully completed.
                    </p>

                    <p>
                        If the airline or booking system returns a different
                        fare before ticket issuance, the updated amount may be
                        presented before the transaction is completed.
                    </p>

                    <p>
                        Customers should review the final price and booking
                        details before confirming payment.
                    </p>

                </div>


                {/* =====================================================
                    5. FARE DIFFERENCES
                ===================================================== */}

                <div className="fare-disclosure-section">

                    <h2>5. Fare Differences and Availability Changes</h2>

                    <p>
                        A flight may become unavailable or its price may change
                        while a customer is completing a booking. This can occur
                        when another customer purchases the remaining seats or
                        when the airline updates its inventory.
                    </p>

                    <p>
                        If the originally displayed fare is no longer available,
                        the booking process may require the customer to review
                        the newly available fare before proceeding.
                    </p>

                    <p>
                        No fare should be considered finally secured until the
                        applicable booking and ticketing process has been
                        successfully completed.
                    </p>

                </div>


                {/* =====================================================
                    6. TAXES AND FEES
                ===================================================== */}

                <div className="fare-disclosure-section">

                    <h2>6. Taxes, Fees and Surcharges</h2>

                    <p>
                        Flight prices may contain taxes, airport charges,
                        government-imposed fees, carrier surcharges, and other
                        applicable charges.
                    </p>

                    <p>
                        The amount and type of these charges can vary depending
                        on the itinerary, departure and arrival locations,
                        airline, passenger type, and applicable regulations.
                    </p>

                    <p>
                        Changes imposed by airlines, airports, government
                        authorities, or other applicable entities may affect
                        pricing where permitted by the applicable fare rules
                        and regulations.
                    </p>

                </div>


                {/* =====================================================
                    7. OPTIONAL SERVICES
                ===================================================== */}

                <div className="fare-disclosure-section">

                    <h2>7. Optional Services and Additional Charges</h2>

                    <p>
                        Some services are not included in the basic flight fare
                        and may carry an additional charge.
                    </p>

                    <p>
                        Examples include:
                    </p>

                    <ul>
                        <li>Seat selection</li>
                        <li>Additional baggage</li>
                        <li>Special meals</li>
                        <li>Priority services</li>
                        <li>Other airline ancillary services</li>
                    </ul>

                    <p>
                        Availability and pricing for these services are
                        determined by the applicable airline and may vary by
                        flight and fare type.
                    </p>

                </div>


                {/* =====================================================
                    8. PROMOTIONAL FARES
                ===================================================== */}

                <div className="fare-disclosure-section">

                    <h2>8. Promotional and Special Fares</h2>

                    <p>
                        DREAM TRAVEL may display promotional, discounted, or
                        limited-time flight fares when such offers are
                        available.
                    </p>

                    <p>
                        Promotional fares may have specific conditions,
                        including:
                    </p>

                    <ul>
                        <li>Limited seat availability</li>
                        <li>Specific travel dates</li>
                        <li>Advance purchase requirements</li>
                        <li>Restricted changes or cancellations</li>
                        <li>Limited refund eligibility</li>
                        <li>Other airline-specific restrictions</li>
                    </ul>

                    <p>
                        Customers should review the applicable fare conditions
                        before completing a purchase.
                    </p>

                </div>


                {/* =====================================================
                    9. PRICING ERRORS
                ===================================================== */}

                <div className="fare-disclosure-section">

                    <h2>9. Pricing Errors</h2>

                    <p>
                        Although we take reasonable steps to maintain accurate
                        fare information, technical or data-related errors may
                        occasionally result in an incorrect price being
                        displayed.
                    </p>

                    <p>
                        Such errors may result from:
                    </p>

                    <ul>
                        <li>Airline system updates</li>
                        <li>Temporary synchronization issues</li>
                        <li>Technical problems</li>
                        <li>Incorrect supplier data</li>
                        <li>Other system-related circumstances</li>
                    </ul>

                    <p>
                        If an apparent pricing error materially affects a
                        booking before ticket issuance, we may need to contact
                        the customer or take appropriate corrective action in
                        accordance with applicable rules.
                    </p>

                </div>


                {/* =====================================================
                    10. FARE RULES
                ===================================================== */}

                <div className="fare-disclosure-section">

                    <h2>10. Fare Conditions and Restrictions</h2>

                    <p>
                        Every flight fare is subject to conditions established
                        by the applicable airline and fare class.
                    </p>

                    <p>
                        Depending on the selected fare, restrictions may apply
                        to:
                    </p>

                    <ul>
                        <li>Changes to travel dates</li>
                        <li>Cancellation</li>
                        <li>Refunds</li>
                        <li>Passenger name corrections</li>
                        <li>Route changes</li>
                        <li>Baggage allowance</li>
                        <li>Seat selection</li>
                    </ul>

                    <p>
                        Customers should review the fare conditions associated
                        with their selected flight before completing payment.
                    </p>

                </div>


                {/* =====================================================
                    11. CURRENCY
                ===================================================== */}

                <div className="fare-disclosure-section">

                    <h2>11. Currency and Final Amount</h2>

                    <p>
                        Flight prices may be displayed in the currency selected
                        or supported during the booking process.
                    </p>

                    <p>
                        Where currency conversion is involved, the final
                        amount may be affected by applicable exchange rates,
                        payment provider processing, or other applicable
                        charges.
                    </p>

                    <p>
                        Customers should verify the final amount shown before
                        completing payment.
                    </p>

                </div>


                {/* =====================================================
                    12. TICKET ISSUANCE
                ===================================================== */}

                <div className="fare-disclosure-section">

                    <h2>12. Ticket Issuance and Booking Confirmation</h2>

                    <p>
                        A fare displayed during flight search does not by itself
                        constitute a confirmed ticket.
                    </p>

                    <p>
                        The booking becomes subject to the applicable ticketing
                        process after the required payment and confirmation
                        steps have been successfully completed.
                    </p>

                    <p>
                        Customers should retain their booking confirmation,
                        reservation reference, and ticket details for future
                        travel and support requests.
                    </p>

                </div>


                {/* =====================================================
                    13. CUSTOMER RESPONSIBILITY
                ===================================================== */}

                <div className="fare-disclosure-section">

                    <h2>13. Customer Responsibility</h2>

                    <p>
                        Before completing a flight booking, customers are
                        responsible for carefully reviewing:
                    </p>

                    <ul>
                        <li>Passenger names and details</li>
                        <li>Travel dates</li>
                        <li>Departure and arrival airports</li>
                        <li>Flight times</li>
                        <li>Cabin class</li>
                        <li>Baggage allowance</li>
                        <li>Fare conditions</li>
                        <li>Cancellation and refund conditions</li>
                        <li>Optional services</li>
                        <li>Final booking amount</li>
                    </ul>

                    <p>
                        Any correction, cancellation, or additional service
                        requested after booking may be subject to applicable
                        airline rules and charges.
                    </p>

                </div>


                {/* =====================================================
                    14. POLICY UPDATES
                ===================================================== */}

                <div className="fare-disclosure-section">

                    <h2>14. Updates to This Policy</h2>

                    <p>
                        DREAM TRAVEL may update this Fare Disclosure Policy from
                        time to time to reflect changes in our services,
                        booking processes, pricing practices, or applicable
                        requirements.
                    </p>

                    <p>
                        The updated version will be published on this page with
                        the applicable effective date.
                    </p>

                    <p>
                        Customers are encouraged to review this policy
                        periodically.
                    </p>

                </div>


                {/* =====================================================
                    CONTACT US
                ===================================================== */}

                <div className="fare-disclosure-section fare-disclosure-contact">

                    <h2>Questions About Your Fare?</h2>

                    <p>
                        If you have questions about a displayed fare, booking
                        amount, taxes, optional services, or other pricing
                        information, please contact DREAM TRAVEL.
                    </p>

                    <p className="fare-disclosure-company">
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
                            +1-844-317-9052
                        </a>
                    </p>

                    <p className="fare-disclosure-final-text">
                        DREAM TRAVEL aims to provide clear fare information so
                        that customers can review the applicable price and
                        booking conditions before completing their flight
                        purchase.
                    </p>

                </div>

            </section>

        </main>
    );
}

export default FareDisclosure;