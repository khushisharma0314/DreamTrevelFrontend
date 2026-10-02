import "./Footer.css";

import footerLogo from "../../assets/footer-logo.png";
import paymentImage from "../../assets/payment.png";

function Footer() {
    return (
        <footer className="footer-section">

            <div className="footer-container">

                {/* =====================================================
                    LEFT COLUMN
                ===================================================== */}

                <div className="footer-left">

                    <img
                        src={footerLogo}
                        alt="Dream Travel - Flight of Dream"
                        className="footer-logo"
                    />


                    {/* CORPORATE OFFICE */}

                    <div className="footer-contact-item">

                        <div className="footer-icon">
                            <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
                            </svg>
                        </div>

                        <div className="footer-contact-text">

                            <strong>
                                Corporate Office:
                            </strong>

                            <span>
                                520 Skyway Boulevard, Albany, NY 12207
                            </span>

                        </div>

                    </div>


                    {/* REGISTERED OFFICE */}

                    <div className="footer-contact-item">

                        <div className="footer-icon">
                            <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
                            </svg>
                        </div>

                        <div className="footer-contact-text">

                            <strong>
                                Registered Office:
                            </strong>

                            <span>
                                86 Traveler Lane, Albany, NY 12207
                            </span>

                        </div>

                    </div>


                    {/* EMAIL */}

                    <div className="footer-contact-item footer-simple-contact">

                        <div className="footer-icon">

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                aria-hidden="true"
                            >
                                <rect
                                    x="3"
                                    y="5"
                                    width="18"
                                    height="14"
                                    rx="1"
                                />

                                <polyline points="3,7 12,13 21,7" />
                            </svg>

                        </div>

                        <a
                            href="mailto:info@dreamtravel.com"
                            className="footer-email-link"
                        >
                            info@dreamtravel.com
                        </a>

                    </div>


                    {/* PHONE */}

                    <div className="footer-contact-item footer-simple-contact">

                        <div className="footer-icon">

                            <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M6.62 10.79a15.46 15.46 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                            </svg>

                        </div>

                        <a
                            href="tel:+18887526024"
                            className="footer-phone-link"
                        >
                            +1-844-317-9052
                        </a>

                    </div>


                    {/* PAYMENT */}

                    <img
                        src={paymentImage}
                        alt="Accepted payment methods"
                        className="payment-image"
                    />

                </div>


                {/* =====================================================
                    IMPORTANT LINKS
                ===================================================== */}

                <div className="footer-column">

                    <h3>
                        Travel Essentials
                    </h3>

                    <div className="footer-links">

                        <a href="/advertiser-disclosure">
                            Advertising &amp; Partner Disclosure
                        </a>

                        <a href="/cancellation-refund-policy">
                            Flight Cancellation &amp; Refund
                        </a>

                        <a href="/fare-disclosure-policy">
                            Fare Transparency
                        </a>

                        <a href="/california-consumer-privacy-notice">
                            California Privacy Rights
                        </a>

                        <a href="/cookies-policy">
                            Cookies &amp; Tracking
                        </a>

                    </div>

                </div>


                {/* =====================================================
                    QUICK LINKS
                ===================================================== */}

                <div className="footer-column">

                    <h3>
                        Booking & Support
                    </h3>

                    <div className="footer-links">

                        <a href="/privacy-policy">
                            Privacy &amp; Data Protection
                        </a>

                        <a href="/terms-and-conditions">
                            Booking Terms &amp; Conditions
                        </a>

                        <a href="/disclaimer">
                            Flight Booking Disclaimer
                        </a>

                        <a href="/about">
                            About Us
                        </a>

                        <a href="/contact-us">
                            Contact Us
                        </a>

                    </div>

                </div>

            </div>


            {/* =====================================================
                DIVIDER
            ===================================================== */}

            <div className="footer-divider"></div>


            {/* =====================================================
                DISCLAIMER
            ===================================================== */}

            <div className="footer-disclaimer">

                <p>
                    Disclaimer: Dream Travel is an independent flight booking
                    platform and is not affiliated with or operated by any
                    airline unless specifically stated. All trademarks belong
                    to their respective owners. Flight fares, availability,
                    schedules, and travel information are subject to change
                    without notice. By using this website, you agree to our
                    Terms &amp; Conditions and Privacy Policy.
                </p>

            </div>


            {/* =====================================================
                COPYRIGHT
            ===================================================== */}

            <div className="footer-copyright">

                <p>
                    Copyright © 2026. All Rights Reserved.
                </p>

            </div>

        </footer>
    );
}

export default Footer;