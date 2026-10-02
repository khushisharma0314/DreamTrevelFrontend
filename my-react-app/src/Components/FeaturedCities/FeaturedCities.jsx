import React from "react";
import "./FeaturedCities.css";

import aboutImg from "../../assets/about-img.jpg";

const FeaturedCities = () => {
    return (
        <section className="fly-anywhere-section">
            <div className="fly-anywhere-container">

                {/* LEFT CONTENT */}
                <div className="fly-anywhere-content">

                    <h1>
                        Discover Great Flights, &amp;
                        <br />
                        Anywhere You Want To Go
                    </h1>

                    {/* Heading Line */}
                    <div className="fly-heading-line">
                        <span className="fly-blue-line"></span>
                        <span className="fly-orange-line"></span>
                    </div>

                    {/* First Paragraph */}
                    <p>
                        Welcome to Dream Travel, a USA-based travel agency dedicated to
                        helping travelers find affordable flights, convenient travel
                        solutions, and exceptional customer service. Whether you're
                        planning a family vacation, business trip, last-minute getaway,
                        or international journey, our goal is to make travel planning
                        simple, reliable, and stress-free.
                    </p>

                    {/* Second Paragraph */}
                    <p>
                        At Dream Travel, we believe that travel should be accessible,
                        convenient, and affordable for everyone. Our experienced travel
                        specialists work tirelessly to help customers secure competitive
                        airfare options and personalized travel assistance tailored to
                        their needs.
                    </p>

                    {/* Call Button */}
                    <a
                        href="tel:+18887526024"
                        className="fly-call-button"
                    >
                        <span className="fly-phone-icon">☎</span>
                        <span>Call Now: +1-844-317-9052</span>
                    </a>

                </div>

                {/* RIGHT IMAGE */}
                <div className="fly-anywhere-images">
                    <div className="fly-single-image">
                        <img
                            src={aboutImg}
                            alt="Travel destination"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default FeaturedCities;