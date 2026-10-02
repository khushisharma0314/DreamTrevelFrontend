import React from "react";
import "./FareTierModal.css";

function FareTierModal({ flight, tripType, isReturn, onClose, onSelectTier }) {
    if (!flight) return null;

    const basePrice = Number(flight.price || 0);

    // Calculate realistic incremental pricing for Classic & Flex tiers
    let classicPrice;
    let flexPrice;

    if (basePrice >= 1000) {
        // INR Scale (e.g. ₹4,500 -> +₹1,150 for Classic, +₹2,400 for Flex)
        classicPrice = Math.round((basePrice + 1150) / 50) * 50;
        flexPrice = Math.round((basePrice + 2400) / 50) * 50;
    } else {
        // Currency / Duffel Scale (e.g. 78.76 -> 92.94 -> 108.69)
        classicPrice = Math.round((basePrice * 1.18) * 100) / 100;
        flexPrice = Math.round((basePrice * 1.38) * 100) / 100;
    }

    const cabin = String(flight.flightClass || "economy").toLowerCase();
    const isBusiness = cabin.includes("bus") || cabin.includes("first");
    const isPremEcon = cabin.includes("prem");
    const classNameTitle = flight.flightClass ? flight.flightClass.toLowerCase() : "economy";

    let tiers = [];

    if (isBusiness) {
        tiers = [
            {
                id: "basic",
                name: `${classNameTitle} Basic`,
                subtitle: "Essential Business luxury with base fare",
                price: basePrice,
                isPopular: false,
                badge: null,
                checkedBags: Math.max(1, flight.checkedBagsIncluded || 1),
                carryOn: flight.carryOnWeightKg || "12 kg",
                isRefundable: false,
                isChangeable: false,
                seatSelection: "Standard Business Seat",
                boarding: "Priority Boarding",
                perks: [
                    { text: "No refunds on cancellation", included: false },
                    { text: "Ticket changes not allowed", included: false },
                    { text: "Seat selection for a fee", included: false },
                    { text: `1x Cabin Bag (${flight.carryOnWeightKg || "12 kg"}) free`, included: true },
                    { text: "1x 32kg Checked Bag included", included: true },
                    { text: "Standard Business lie-flat seat", included: true },
                ],
            },
            {
                id: "classic",
                name: `${classNameTitle} Classic`,
                subtitle: "Most popular choice with baggage",
                price: classicPrice,
                isPopular: true,
                badge: "★ MOST POPULAR",
                checkedBags: Math.max(2, flight.checkedBagsIncluded || 2),
                carryOn: flight.carryOnWeightKg || "14 kg",
                isRefundable: false,
                isChangeable: true,
                seatSelection: "Preferred Business Suite",
                boarding: "SkyPriority Boarding",
                perks: [
                    { text: "No refunds on cancellation", included: false },
                    { text: "Free date change (fare diff only)", included: true },
                    { text: "Free standard seat selection", included: true },
                    { text: `1x Cabin Bag (${flight.carryOnWeightKg || "14 kg"}) free`, included: true },
                    { text: "2x 32kg Checked Bags FREE included", included: true },
                    { text: "Complimentary Airport Lounge Access", included: true },
                ],
            },
            {
                id: "flex",
                name: `${classNameTitle} Flex`,
                subtitle: "Full flexibility & peace of mind",
                price: flexPrice,
                isPopular: false,
                badge: "★ MAXIMUM FLEXIBILITY",
                checkedBags: Math.max(2, flight.checkedBagsIncluded || 2),
                carryOn: flight.carryOnWeightKg || "16 kg",
                isRefundable: true,
                isChangeable: true,
                seatSelection: "Any First/Business Suite",
                boarding: "VIP Chauffeur & Boarding",
                perks: [
                    { text: "100% Full Refund on cancellation", included: true },
                    { text: "Unlimited Free date changes", included: true },
                    { text: "Free preferred & extra legroom seat", included: true },
                    { text: `1x Cabin Bag (${flight.carryOnWeightKg || "16 kg"}) free`, included: true },
                    { text: "2x 32kg Checked Bags FREE included", included: true },
                    { text: "Priority check-in & boarding", included: true },
                ],
            },
        ];
    } else if (isPremEcon) {
        tiers = [
            {
                id: "basic",
                name: `${classNameTitle} Basic`,
                subtitle: "Lowest fare, essential travel",
                price: basePrice,
                isPopular: false,
                badge: null,
                checkedBags: flight.checkedBagsIncluded || 0,
                carryOn: flight.carryOnWeightKg || "8 kg",
                isRefundable: false,
                isChangeable: false,
                seatSelection: "Standard Premium Seat",
                boarding: "General Boarding",
                perks: [
                    { text: "No refunds on cancellation", included: false },
                    { text: "Ticket changes not allowed", included: false },
                    { text: "Seat selection for a fee", included: false },
                    { text: `1x Cabin Bag (${flight.carryOnWeightKg || "8 kg"}) free`, included: true },
                    { text: flight.checkedBagsIncluded > 0 ? `${flight.checkedBagsIncluded}x Checked Bag (${flight.checkedBagWeightKg || "23 kg"})` : "0 Checked Bags included", included: flight.checkedBagsIncluded > 0 },
                    { text: "Standard general boarding", included: true },
                ],
            },
            {
                id: "classic",
                name: `${classNameTitle} Classic`,
                subtitle: "Most popular choice with baggage",
                price: classicPrice,
                isPopular: true,
                badge: "★ MOST POPULAR",
                checkedBags: Math.max(1, flight.checkedBagsIncluded || 1),
                carryOn: flight.carryOnWeightKg || "10 kg",
                isRefundable: false,
                isChangeable: true,
                seatSelection: "Free Premium Seat Selection",
                boarding: "Priority Boarding",
                perks: [
                    { text: "No refunds on cancellation", included: false },
                    { text: "Free date change (fare diff only)", included: true },
                    { text: "Free standard seat selection", included: true },
                    { text: `1x Cabin Bag (${flight.carryOnWeightKg || "10 kg"}) free`, included: true },
                    { text: "1x Checked Bag (23 kg) FREE included", included: true },
                    { text: "Standard general boarding", included: true },
                ],
            },
            {
                id: "flex",
                name: `${classNameTitle} Flex`,
                subtitle: "Full flexibility & peace of mind",
                price: flexPrice,
                isPopular: false,
                badge: "★ MAXIMUM FLEXIBILITY",
                checkedBags: Math.max(2, flight.checkedBagsIncluded || 2),
                carryOn: flight.carryOnWeightKg || "12 kg",
                isRefundable: true,
                isChangeable: true,
                seatSelection: "Free Front Row / Bulkhead Seat",
                boarding: "Priority Boarding",
                perks: [
                    { text: "100% Full Refund on cancellation", included: true },
                    { text: "Unlimited Free date changes", included: true },
                    { text: "Free preferred & extra legroom seat", included: true },
                    { text: `1x Cabin Bag (${flight.carryOnWeightKg || "12 kg"}) free`, included: true },
                    { text: "1x Checked Bag (23 kg) FREE included", included: true },
                    { text: "Priority check-in & boarding", included: true },
                ],
            },
        ];
    } else {
        tiers = [
            {
                id: "basic",
                name: `${classNameTitle} Basic`,
                subtitle: "Lowest fare, essential travel",
                price: basePrice,
                isPopular: false,
                badge: null,
                checkedBags: flight.checkedBagsIncluded || 0,
                carryOn: flight.carryOnWeightKg || "7 kg",
                isRefundable: false,
                isChangeable: false,
                seatSelection: "Paid seat selection",
                boarding: "Standard boarding",
                perks: [
                    { text: "No refunds on cancellation", included: false },
                    { text: "Ticket changes not allowed", included: false },
                    { text: "Seat selection for a fee", included: false },
                    { text: `1x Cabin Bag (${flight.carryOnWeightKg || "7 kg"}) free`, included: true },
                    { text: flight.checkedBagsIncluded > 0 ? `${flight.checkedBagsIncluded}x Checked Bag (${flight.checkedBagWeightKg || "23 kg"}) included` : "0 Checked Bags included", included: flight.checkedBagsIncluded > 0 },
                    { text: "Standard general boarding", included: true },
                ],
            },
            {
                id: "classic",
                name: `${classNameTitle} Classic`,
                subtitle: "Most popular choice with baggage",
                price: classicPrice,
                isPopular: true,
                badge: "★ MOST POPULAR",
                checkedBags: Math.max(1, flight.checkedBagsIncluded || 1),
                carryOn: flight.carryOnWeightKg || "7 kg",
                isRefundable: false,
                isChangeable: true,
                seatSelection: "Free standard seat selection",
                boarding: "Standard boarding",
                perks: [
                    { text: "No refunds on cancellation", included: false },
                    { text: "Free date change (fare diff only)", included: true },
                    { text: "Free standard seat selection", included: true },
                    { text: `1x Cabin Bag (${flight.carryOnWeightKg || "7 kg"}) free`, included: true },
                    { text: `1x Checked Bag (${flight.checkedBagWeightKg || "23 kg"}) FREE included`, included: true },
                    { text: "Standard general boarding", included: true },
                ],
            },
            {
                id: "flex",
                name: `${classNameTitle} Flex`,
                subtitle: "Full flexibility & peace of mind",
                price: flexPrice,
                isPopular: false,
                badge: "★ MAXIMUM FLEXIBILITY",
                checkedBags: Math.max(1, flight.checkedBagsIncluded || 1),
                carryOn: flight.carryOnWeightKg || "7 kg",
                isRefundable: true,
                isChangeable: true,
                seatSelection: "Free preferred / extra legroom seat",
                boarding: "Priority boarding",
                perks: [
                    { text: "100% Full Refund on cancellation", included: true },
                    { text: "Unlimited Free date changes", included: true },
                    { text: "Free preferred & extra legroom seat", included: true },
                    { text: `1x Cabin Bag (${flight.carryOnWeightKg || "7 kg"}) free`, included: true },
                    { text: `1x Checked Bag (${flight.checkedBagWeightKg || "23 kg"}) FREE included`, included: true },
                    { text: "Priority check-in & boarding", included: true },
                ],
            },
        ];
    }

    const handleSelect = (tier) => {
        const updatedFlight = {
            ...flight,
            price: tier.price,
            originalBasePrice: basePrice,
            fareTierId: tier.id,
            fareTierName: tier.name,
            fareTierSubtitle: tier.subtitle,
            checkedBagsIncluded: tier.checkedBags,
            isRefundable: tier.isRefundable,
            isChangeable: tier.isChangeable,
            seatSelectionPerk: tier.seatSelection,
            boardingPerk: tier.boarding,
        };
        onSelectTier(updatedFlight);
    };

    return (
        <div className="fare-tier-modal-overlay" onClick={onClose}>
            <div className="fare-tier-modal-container" onClick={(e) => e.stopPropagation()}>
                {/* MODAL HEADER */}
                <div className="fare-tier-modal-header">
                    <div className="fare-tier-header-info">
                        <h2>
                            Select your {isReturn ? "Return" : "Departure"} Fare Option
                        </h2>
                        <div className="fare-tier-route-line">
                            <span>
                                {flight.from || "Origin"} to {flight.to || "Destination"} | {flight.departureTime || "--:--"} - {flight.arrivalTime || "--:--"} ({flight.duration || ""})
                            </span>
                            <div className="fare-route-dash"></div>
                            <span className="fare-route-plane">✈</span>
                        </div>
                    </div>
                    <button type="button" className="fare-tier-close-btn" onClick={onClose} aria-label="Close">
                        ✕
                    </button>
                </div>

                {/* MODAL BODY (3-TIER GRID) */}
                <div className="fare-tier-grid">
                    {tiers.map((tier) => (
                        <div
                            key={tier.id}
                            className={`fare-tier-card card-${tier.id} ${tier.isPopular ? "fare-tier-card-popular" : ""}`}
                        >
                            {tier.badge && (
                                <div className={`fare-tier-top-badge badge-${tier.id}`}>
                                    {tier.badge}
                                </div>
                            )}

                            {/* CARD TOP BANNER */}
                            <div className={`fare-tier-card-header header-${tier.id}`}>
                                <h3 className="fare-tier-name">{tier.name}</h3>
                                <p className="fare-tier-sub">{tier.subtitle}</p>
                            </div>

                            {/* PRICE */}
                            <div className="fare-tier-price-section">
                                <div className="fare-tier-price-box">
                                    <span className={`fare-currency currency-${tier.id}`}>₹</span>
                                    <strong className={`fare-amount amount-${tier.id}`}>
                                        {Number(tier.price).toLocaleString("en-IN")}
                                    </strong>
                                    <small className="fare-per-person">/ traveler</small>
                                </div>
                            </div>

                            {/* PERKS LIST */}
                            <ul className="fare-tier-perks-list">
                                {tier.perks.map((perk, idx) => (
                                    <li key={idx} className={`perk-item ${perk.included ? "perk-included" : "perk-excluded"}`}>
                                        <span className={`perk-symbol ${perk.included ? "symbol-check" : "symbol-cross"}`}>
                                            {perk.included ? "✓" : "✕"}
                                        </span>
                                        <span className="perk-label">
                                            {perk.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* SELECT CTA BUTTON */}
                            <div className="fare-tier-card-footer">
                                <button
                                    type="button"
                                    className={`fare-tier-select-btn btn-${tier.id}`}
                                    onClick={() => handleSelect(tier)}
                                >
                                    Select {tier.name.split(" ")[1] || "Fare"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FOOTER NOTICE */}
                <div className="fare-tier-modal-footer">
                    <span>
                        ℹ️ All fare rules and baggage allowances are governed by {flight.airline || "the airline"}. Taxes and carrier surcharges included.
                    </span>
                </div>
            </div>
        </div>
    );
}

export default FareTierModal;
