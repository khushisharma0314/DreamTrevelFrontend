import React, { useState, useEffect } from "react";
import "./PromoCodeBox.css";

function PromoCodeBox({
    bookingAmount = 0,
    appliedPromo = null,
    onApplyPromo,
    onRemovePromo,
}) {
    const [inputCode, setInputCode] = useState("");
    const [availableOffers, setAvailableOffers] = useState([]);
    const [isLoadingOffers, setIsLoadingOffers] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showOffers, setShowOffers] = useState(false);

    // Fetch available promo codes on mount
    useEffect(() => {
        let isMounted = true;
        const fetchOffers = async () => {
            try {
                setIsLoadingOffers(true);
                const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
                const response = await fetch(`${baseUrl}/api/promos/available`);
                if (response.ok) {
                    const data = await response.json();
                    if (isMounted && Array.isArray(data)) {
                        setAvailableOffers(data);
                    }
                }
            } catch (err) {
                console.warn("Could not load promo offers from server:", err);
            } finally {
                if (isMounted) setIsLoadingOffers(false);
            }
        };

        fetchOffers();
        return () => {
            isMounted = false;
        };
    }, []);

    // Apply promo code via backend validation
    const handleApply = async (codeToApply) => {
        const code = (codeToApply || inputCode).trim().toUpperCase();
        if (!code) {
            setErrorMsg("Please enter a promo code.");
            setSuccessMsg("");
            return;
        }

        if (bookingAmount <= 0) {
            setErrorMsg("Booking amount is invalid.");
            setSuccessMsg("");
            return;
        }

        try {
            setIsApplying(true);
            setErrorMsg("");
            setSuccessMsg("");

            const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
            const response = await fetch(`${baseUrl}/api/promos/validate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code: code,
                    bookingAmount: Number(bookingAmount),
                }),
            });

            const data = await response.json();

            if (response.ok && data.valid) {
                setSuccessMsg(data.message || `Code ${data.code} applied successfully!`);
                setInputCode("");
                if (onApplyPromo) {
                    onApplyPromo(data);
                }
            } else {
                setErrorMsg(data.message || "Invalid or ineligible promo code.");
            }
        } catch (err) {
            console.error("Promo validation error:", err);
            setErrorMsg("Unable to validate promo code. Please try again.");
        } finally {
            setIsApplying(false);
        }
    };

    const handleRemove = () => {
        setErrorMsg("");
        setSuccessMsg("");
        setInputCode("");
        if (onRemovePromo) {
            onRemovePromo();
        }
    };

    return (
        <div className="promo-box-container">
            <div className="promo-box-header">
                <div className="promo-title-wrapper">
                    <span className="promo-icon">🏷️</span>
                    <h4 className="promo-title">Have a Promo Code?</h4>
                </div>
                {availableOffers.length > 0 && (
                    <button
                        type="button"
                        className="toggle-offers-btn"
                        onClick={() => setShowOffers(!showOffers)}
                    >
                        {showOffers ? "Hide Offers" : "View Offers"}
                    </button>
                )}
            </div>

            {/* APPLIED STATE */}
            {appliedPromo ? (
                <div className="promo-applied-badge">
                    <div className="applied-left">
                        <span className="applied-check">✓</span>
                        <div>
                            <strong>{appliedPromo.code} Applied</strong>
                            <p className="applied-desc">
                                Saved ₹{Number(appliedPromo.discountAmount || 0).toLocaleString("en-IN")} on your booking!
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="promo-remove-btn"
                        onClick={handleRemove}
                    >
                        Remove
                    </button>
                </div>
            ) : (
                /* INPUT STATE */
                <div className="promo-input-group">
                    <input
                        type="text"
                        className="promo-input"
                        placeholder="Enter coupon code (e.g. FLYFIRST)"
                        value={inputCode}
                        onChange={(e) => {
                            setInputCode(e.target.value.toUpperCase());
                            setErrorMsg("");
                            setSuccessMsg("");
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleApply();
                            }
                        }}
                    />
                    <button
                        type="button"
                        className="promo-apply-btn"
                        disabled={!inputCode.trim() || isApplying}
                        onClick={() => handleApply()}
                    >
                        {isApplying ? "Applying..." : "Apply"}
                    </button>
                </div>
            )}

            {/* FEEDBACK MESSAGES */}
            {errorMsg && <div className="promo-msg promo-error">{errorMsg}</div>}
            {successMsg && !appliedPromo && <div className="promo-msg promo-success">{successMsg}</div>}

            {/* AVAILABLE OFFERS LIST */}
            {showOffers && availableOffers.length > 0 && (
                <div className="promo-offers-list">
                    <p className="offers-heading">Available Offers for You:</p>
                    <div className="offers-grid">
                        {availableOffers.map((offer) => {
                            const isCurrentApplied = appliedPromo?.code === offer.code;
                            const isEligible = bookingAmount >= (offer.minBookingAmount || 0);

                            return (
                                <div
                                    key={offer.code}
                                    className={`offer-card ${isCurrentApplied ? "offer-card-active" : ""}`}
                                >
                                    <div className="offer-code-row">
                                        <span className="offer-tag">{offer.code}</span>
                                        <button
                                            type="button"
                                            className="offer-quick-apply"
                                            disabled={isCurrentApplied || isApplying}
                                            onClick={() => handleApply(offer.code)}
                                        >
                                            {isCurrentApplied ? "Applied" : "Apply"}
                                        </button>
                                    </div>
                                    <p className="offer-title">{offer.title}</p>
                                    <p className="offer-desc">{offer.description}</p>
                                    {!isEligible && (
                                        <small className="offer-min-note">
                                            *Min. booking: ₹{Number(offer.minBookingAmount).toLocaleString("en-IN")}
                                        </small>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default PromoCodeBox;
