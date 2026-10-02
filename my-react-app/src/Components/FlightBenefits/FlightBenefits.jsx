import React from "react";
import "./FlightBenefits.css";

import fbimg from "../../assets/fb-img.png";
import fbCalender from "../../assets/fb-calendar.png";
import fbLocation from "../../assets/fb-location.png";
import fbTicket from "../../assets/fb-ticket.png";

const FlightBenefits = () => {
    return (
        <section className="flight-benefits-section">
            <div className="flight-benefits-container">

                {/* LEFT CONTENT */}
                <div className="flight-benefits-content">

                    <div className="flight-benefits-small-title">
                        YOUR JOURNEY STARTS HERE
                    </div>

                    <h2>
                        Discover Your Next Flight with Dream Travel
                    </h2>

                    <p className="flight-benefits-description">
                        Find convenient flights, explore new destinations, and book your journey with ease.
                    </p>


                    {/* FEATURE 1 */}
                    <div className="flight-benefit-card">

                        <div className="flight-benefit-icon">
                            <img
                                src={fbLocation}
                                alt="Location"
                            />
                        </div>

                        <div className="flight-benefit-text">
                            <h3>Global Flight Choices</h3>

                            <p>
                                Explore multiple airlines, routes, and destinations for your next trip.
                            </p>
                        </div>

                    </div>


                    {/* FEATURE 2 */}
                    <div className="flight-benefit-card">

                        <div className="flight-benefit-icon">
                            <img
                                src={fbCalender}
                                alt="Calendar"
                            />
                        </div>

                        <div className="flight-benefit-text">
                            <h3>Competitive Airfares</h3>

                            <p>
                                Discover attractive flight fares designed to fit your travel budget.
                            </p>
                        </div>

                    </div>


                    {/* FEATURE 3 */}
                    <div className="flight-benefit-card">

                        <div className="flight-benefit-icon">
                            <img
                                src={fbTicket}
                                alt="Flight ticket"
                            />
                        </div>

                        <div className="flight-benefit-text">
                            <h3>Simple Flight Booking</h3>

                            <p>
                                Search, compare, and book your flight in just a few easy steps.
                            </p>
                        </div>

                    </div>

                </div>


                {/* RIGHT IMAGE */}
                <div className="flight-benefits-image-area">

                    {/* Decorative dashed circle */}
                    <div className="flight-benefits-dashed-circle"></div>

                    {/* Plane */}
                    <div className="flight-benefits-plane">
                        ✈
                    </div>

                    {/* Main image */}
                    <div className="flight-benefits-main-image">
                        <img
                            src={fbimg}
                            alt="Travel experience"
                        />
                    </div>

                </div>

            </div>
        </section>
    );
};

export default FlightBenefits;