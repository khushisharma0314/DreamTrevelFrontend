import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import PhoneInput from "../Common/PhoneInput";
import "./ContactUs.css";

// =========================================================
// CONTACT BANNER IMAGE
// =========================================================
import contactBanner from "../../assets/contact-banner.jpg";

function ContactUs() {
    /* =========================================================
       FORM DATA
    ========================================================= */

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        countryCode: "+1",
        countryISO: "US",
        subject: "",
        message: "",
        agreement: false,
    });

    /* =========================================================
       VALIDATION ERRORS
    ========================================================= */

    const [errors, setErrors] = useState({});

    /* =========================================================
       CONFIRMATION POPUP
    ========================================================= */

    const [showConfirmPopup, setShowConfirmPopup] = useState(false);

    /* =========================================================
       SUCCESS MESSAGE
    ========================================================= */

    const [showSuccess, setShowSuccess] = useState(false);

    /* =========================================================
       API LOADING STATE
    ========================================================= */

    const [isSubmitting, setIsSubmitting] = useState(false);

    /* =========================================================
       INPUT CHANGE
    ========================================================= */

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: type === "checkbox" ? checked : value,
        }));

        setErrors((previousErrors) => ({
            ...previousErrors,
            [name]: "",
        }));
    };

    /* =========================================================
       FORM VALIDATION
    ========================================================= */

    const validateForm = () => {
        const newErrors = {};

        /* ================= NAME ================= */

        const nameValue = formData.name.trim();

        if (!nameValue) {
            newErrors.name = "Please enter your name.";
        } else if (nameValue.length < 2) {
            newErrors.name = "Name must contain at least 2 characters.";
        } else if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nameValue)) {
            newErrors.name = "Please enter a valid name.";
        }

        /* ================= EMAIL ================= */

        const emailValue = formData.email.trim();

        if (!emailValue) {
            newErrors.email = "Please enter your email address.";
        } else if (
            !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailValue)
        ) {
            newErrors.email = "Please enter a valid email address.";
        }

        /* ================= PHONE ================= */

        const cleanPhone = formData.phone.trim().replace(/[\s-]/g, "");

        if (!cleanPhone) {
            newErrors.phone = "Please enter your phone number.";
        } else if (cleanPhone.length < 7 || cleanPhone.length > 15) {
            newErrors.phone = "Please enter a valid phone number (7-15 digits).";
        }

        /* ================= SUBJECT ================= */

        const subjectValue = formData.subject.trim();

        if (!subjectValue) {
            newErrors.subject = "Please enter a subject.";
        } else if (subjectValue.length < 3) {
            newErrors.subject = "Subject must contain at least 3 characters.";
        }

        /* ================= MESSAGE ================= */

        const messageValue = formData.message.trim();

        if (!messageValue) {
            newErrors.message = "Please enter your message.";
        } else if (messageValue.length < 10) {
            newErrors.message = "Message must contain at least 10 characters.";
        }

        /* ================= AGREEMENT ================= */

        if (!formData.agreement) {
            newErrors.agreement =
                "Please agree to the Privacy Policy and Terms & Conditions.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    /* =========================================================
       FORM SUBMIT
    ========================================================= */

    const handleSubmit = (e) => {
        e.preventDefault();

        setShowSuccess(false);

        const isValid = validateForm();

        if (!isValid) {
            return;
        }

        setShowConfirmPopup(true);
    };

    /* =========================================================
       CONFIRM SEND
    ========================================================= */

    const handleConfirmSubmit = async () => {
        setIsSubmitting(true);

        try {
            const payload = {
                ...formData,
                phone: `${formData.countryCode || "+1"} ${formData.phone.trim()}`,
            };

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/contact`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error("Backend Error:", data);

                if (data.errors) {
                    setErrors(data.errors);
                }

                setShowConfirmPopup(false);

                alert(
                    data.message ||
                    "Unable to send message. Please try again."
                );

                return;
            }

            console.log("Message saved successfully:", data);

            setShowConfirmPopup(false);
            setShowSuccess(true);

            /* Clear Form */
            setFormData({
                name: "",
                email: "",
                phone: "",
                countryCode: "+1",
                countryISO: "US",
                subject: "",
                message: "",
                agreement: false,
            });

            setErrors({});

            setTimeout(() => {
                setShowSuccess(false);
            }, 6000);
        } catch (error) {
            console.error("Contact API Error:", error);
            setShowConfirmPopup(false);
            alert("Backend server is not running. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    /* =========================================================
       CANCEL POPUP
    ========================================================= */

    const handleCancelSubmit = () => {
        if (!isSubmitting) {
            setShowConfirmPopup(false);
        }
    };

    return (
        <>
            <main className="contact-page">
                {/* =================================================
                    CONTACT BANNER - FULL WIDTH
                ================================================= */}
                <section
                    className="contact-banner"
                    style={{ backgroundImage: `url(${contactBanner})` }}
                >
                    <div className="contact-banner-overlay"></div>
                    <div className="contact-banner-content">
                        <h1 className="contact-banner-title">Contact Us</h1>
                    </div>
                </section>

                {/* =================================================
                    MAIN CONTACT CONTENT - 2 CARDS
                ================================================= */}
                <div className="contact-main-wrapper">
                    <section className="contact-content">
                        {/* =================================================
                            LEFT CONTACT INFO BOX
                        ================================================= */}
                        <div className="contact-info-box">
                            <h2 className="contact-section-title">Contact us</h2>

                            <div className="contact-address-block">
                                <h3 className="contact-sub-title">Address</h3>

                                <div className="contact-detail">
                                    <strong className="contact-detail-label">
                                        Corporate Office:
                                    </strong>
                                    <p className="contact-detail-text">
                                        520 Skyway Boulevard
                                        <br />
                                        Albany,
                                        <br />
                                        NY 12207
                                    </p>
                                </div>

                                <div className="contact-detail">
                                    <strong className="contact-detail-label">
                                        Registered Office:
                                    </strong>
                                    <p className="contact-detail-text">
                                        86 Traveler Lane
                                        <br />
                                        Albany,
                                        <br />
                                        NY 12207
                                    </p>
                                </div>
                            </div>

                            <div className="contact-email-block">
                                <h3 className="contact-sub-title">Contact Email</h3>
                                <p className="contact-email-text">
                                    info@dreamtravel.com
                                </p>
                            </div>
                        </div>

                        {/* =================================================
                            RIGHT FORM BOX
                        ================================================= */}
                        <div className="contact-form-box">
                            <h2 className="contact-section-title">Send us a Message</h2>

                            {showSuccess && (
                                <div className="contact-success-banner">
                                    <CheckCircle2 size={24} className="success-icon" />
                                    <div className="success-text">
                                        <strong>Message sent successfully!</strong>
                                        <span>Thank you for contacting us.</span>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} noValidate className="contact-form">
                                {/* =========================
                                    ROW 1: NAME + EMAIL
                                ========================= */}
                                <div className="form-row">
                                    <div className="form-field-wrapper">
                                        <label className="contact-form-label">
                                            Your Name*
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Please enter..."
                                            autoComplete="name"
                                            className={`contact-form-input ${errors.name ? "input-error" : ""
                                                }`}
                                        />
                                        {errors.name && (
                                            <span className="validation-error">
                                                {errors.name}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-field-wrapper">
                                        <label className="contact-form-label">
                                            Email Address*
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Please enter..."
                                            autoComplete="email"
                                            className={`contact-form-input ${errors.email ? "input-error" : ""
                                                }`}
                                        />
                                        {errors.email && (
                                            <span className="validation-error">
                                                {errors.email}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* =========================
                                    ROW 2: PHONE + SUBJECT
                                ========================= */}
                                <div className="form-row">
                                    <div className="form-field-wrapper">
                                        <label className="contact-form-label">
                                            Phone Number*
                                        </label>
                                        <div
                                            className={`contact-phone-wrapper ${errors.phone ? "input-error" : ""
                                                }`}
                                        >
                                            <PhoneInput
                                                countryCode={formData.countryCode || "+1"}
                                                countryISO={formData.countryISO || "US"}
                                                onCountryCodeChange={(code, country) => {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        countryCode: code,
                                                        countryISO: country?.code || "US",
                                                    }));
                                                }}
                                                value={formData.phone}
                                                onChange={handleChange}
                                                name="phone"
                                                placeholder="Please enter..."
                                                error={errors.phone}
                                            />
                                        </div>
                                        {errors.phone && (
                                            <span className="validation-error">
                                                {errors.phone}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-field-wrapper">
                                        <label className="contact-form-label">
                                            Subject*
                                        </label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder="Please enter..."
                                            className={`contact-form-input ${errors.subject ? "input-error" : ""
                                                }`}
                                        />
                                        {errors.subject && (
                                            <span className="validation-error">
                                                {errors.subject}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* =========================
                                    ROW 3: YOUR MESSAGE
                                ========================= */}
                                <div className="form-field-wrapper message-field-wrapper">
                                    <label className="contact-form-label">
                                        Your Message*
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Write message here"
                                        rows="4"
                                        className={`contact-form-textarea ${errors.message ? "input-error" : ""
                                            }`}
                                    />
                                    {errors.message && (
                                        <span className="validation-error">
                                            {errors.message}
                                        </span>
                                    )}
                                </div>

                                {/* =========================
                                    AGREEMENT CHECKBOX
                                ========================= */}
                                <div
                                    className={`agreement-wrapper ${errors.agreement ? "agreement-error" : ""
                                        }`}
                                >
                                    <div className="agreement-row">
                                        <input
                                            type="checkbox"
                                            id="agreement"
                                            name="agreement"
                                            checked={formData.agreement}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="agreement">
                                            By checking this box, you agree to our{" "}
                                            <a href="/privacy-policy" className="agreement-link">
                                                Privacy Policy
                                            </a>{" "}
                                            and{" "}
                                            <a href="/terms-and-conditions" className="agreement-link">
                                                Terms &amp; Conditions
                                            </a>
                                        </label>
                                    </div>

                                    {errors.agreement && (
                                        <span className="validation-error agreement-validation-error">
                                            {errors.agreement}
                                        </span>
                                    )}
                                </div>

                                {/* =========================
                                    SEND MESSAGE BUTTON
                                ========================= */}
                                <div className="form-btn-wrapper">
                                    <button
                                        type="submit"
                                        className="send-message-btn"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>

                    {/* =================================================
                        MAP SECTION
                    ================================================= */}
                    <section className="contact-map-section">
                        <div className="contact-map-card">
                            <iframe
                                title="Dream Travel Office Location"
                                src="https://maps.google.com/maps?q=134+S+Street,+Windham,+NY+12496&t=&z=14&ie=UTF8&iwloc=&output=embed"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="contact-map-iframe"
                            />
                        </div>
                    </section>
                </div>
            </main>

            {/* =================================================
                CONFIRMATION POPUP
            ================================================= */}
            {showConfirmPopup && (
                <div
                    className="confirmation-overlay"
                    onClick={handleCancelSubmit}
                >
                    <div
                        className="confirmation-popup"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="confirmation-icon">?</div>

                        <h3>Send Message?</h3>
                        <p>Are you sure you want to send this message?</p>

                        <div className="confirmation-buttons">
                            <button
                                type="button"
                                className="confirmation-cancel-btn"
                                onClick={handleCancelSubmit}
                                disabled={isSubmitting}
                            >
                                CANCEL
                            </button>

                            <button
                                type="button"
                                className="confirmation-send-btn"
                                onClick={handleConfirmSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ContactUs;