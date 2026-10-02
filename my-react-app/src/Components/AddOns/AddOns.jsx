import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getBookingSession } from "../../utils/flightUtils";
import "./AddOns.css";

function AddOns() {
    const location = useLocation();
    const navigate = useNavigate();

    const activeState = location.state || getBookingSession()?.state || {};

    const {
        selectedDeparture,
        selectedReturn,
        searchData,
        selectedFromCity,
        selectedToCity,
        passengers = [],
        contactInfo,
        pricing,
        selectedSeats = {},
        totalSeatCharges = 0,
        selectedAddOns: initialAddOns = {},
    } = activeState;

    const defaultPet = {
        selected: false,
        type: "",
        name: "",
        weight: "",
        travelType: "cabin",
        passengerIndex: 0,
        carrierAvailable: "",
    };

    const [selectedAddOns, setSelectedAddOns] = useState({
        baggage: Array.isArray(initialAddOns?.baggage)
            ? initialAddOns.baggage
            : [],
        meals: Array.isArray(initialAddOns?.meals)
            ? initialAddOns.meals
            : [],
        pet: {
            ...defaultPet,
            ...(initialAddOns?.pet || {}),
        },
        priority: Boolean(initialAddOns?.priority),
        insurance: Boolean(initialAddOns?.insurance),
    });

    const baggageOptions = [
        {
            id: "bag-15",
            title: "15 kg Checked Baggage",
            description: "1 standard checked bag up to 15 kg",
            price: 1800,
        },
        {
            id: "bag-20",
            title: "20 kg Checked Baggage",
            description: "1 standard checked bag up to 20 kg",
            price: 2400,
        },
        {
            id: "bag-30",
            title: "30 kg Checked Baggage",
            description: "1 heavy checked bag up to 30 kg",
            price: 3500,
        },
    ];

    const mealOptions = [
        {
            id: "veg-meal",
            title: "Vegetarian Meal",
            description: "Fresh warm vegetarian meal & drink",
            price: 450,
        },
        {
            id: "nonveg-meal",
            title: "Non-Vegetarian Meal",
            description: "Fresh chicken/meat hot meal & drink",
            price: 550,
        },
        {
            id: "snack-meal",
            title: "Snack & Beverage",
            description: "Light snack combo with drink",
            price: 300,
        },
    ];

    const priorityUnitPrice = 750;
    const insuranceUnitPrice = 650;

    if (!searchData || !selectedDeparture || !passengers.length) {
        return (
            <main className="addons-page">
                <div className="addons-error-card">
                    <h2>Session Expired</h2>

                    <p>
                        We could not retrieve your booking details.
                        Please start your flight search again.
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

    const formatPrice = (price) => {
        const value = Number(price || 0);

        return Number.isFinite(value)
            ? value.toLocaleString("en-IN")
            : "0";
    };

    const baggageTotal = useMemo(() => {
        return selectedAddOns.baggage.reduce(
            (total, item) => total + Number(item?.price || 0),
            0
        );
    }, [selectedAddOns.baggage]);

    const mealTotal = useMemo(() => {
        return selectedAddOns.meals.reduce(
            (total, item) => total + Number(item?.price || 0),
            0
        );
    }, [selectedAddOns.meals]);

    const priorityPrice = selectedAddOns.priority
        ? priorityUnitPrice
        : 0;

    const insurancePrice = selectedAddOns.insurance
        ? insuranceUnitPrice
        : 0;

    /*
     * Pet pricing is not added because the current flow does not
     * receive a confirmed airline pet-service price.
     */
    const petPrice = 0;

    const totalAddOnCharges =
        baggageTotal +
        mealTotal +
        priorityPrice +
        insurancePrice +
        petPrice;

    const flightFare = Number(
        pricing?.grandTotalPrice || 0
    );

    const seatCharges = Number(
        totalSeatCharges || 0
    );

    const finalTotalPrice =
        flightFare +
        seatCharges +
        totalAddOnCharges;

    const petDetailsComplete =
        selectedAddOns.pet.selected &&
        Boolean(selectedAddOns.pet.type) &&
        Boolean(selectedAddOns.pet.name?.trim()) &&
        Number(selectedAddOns.pet.weight) > 0;

    const buildState = () => ({
        selectedDeparture,
        selectedReturn,
        searchData,
        selectedFromCity,
        selectedToCity,
        passengers,
        contactInfo,
        pricing,
        selectedSeats,
        totalSeatCharges: seatCharges,

        selectedAddOns,

        baggageTotal,
        mealTotal,
        priorityPrice,
        insurancePrice,
        totalAddOnCharges,
        finalTotalPrice,
    });

    const handleBaggageSelect = (option) => {
        setSelectedAddOns((prev) => {
            const alreadySelected = prev.baggage.some(
                (item) => item.id === option.id
            );

            return {
                ...prev,
                baggage: alreadySelected
                    ? []
                    : [option],
            };
        });
    };

    const handleMealSelect = (option) => {
        setSelectedAddOns((prev) => {
            const alreadySelected = prev.meals.some(
                (item) => item.id === option.id
            );

            return {
                ...prev,
                meals: alreadySelected
                    ? []
                    : [option],
            };
        });
    };

    const handlePetToggle = () => {
        setSelectedAddOns((prev) => ({
            ...prev,

            pet: {
                ...prev.pet,
                selected: !prev.pet.selected,
            },
        }));
    };

    const handlePetChange = (field, value) => {
        setSelectedAddOns((prev) => ({
            ...prev,

            pet: {
                ...prev.pet,
                [field]: value,
            },
        }));
    };

    const handleBack = () => {
        navigate("/booking-review", {
            state: buildState(),
        });
    };

    const handleSaveAndReturn = () => {
        if (selectedAddOns.pet.selected && !petDetailsComplete) {
            return;
        }

        navigate("/booking-review", {
            state: buildState(),
        });
    };

    return (
        <main className="addons-page">

            {/* =====================================================
                PROGRESS
            ===================================================== */}

            <div className="addons-progress-container">
                <div className="addons-progress">

                    <div className="addons-progress-step completed">
                        <div className="addons-progress-number">
                            ✓
                        </div>

                        <span>Flight Selection</span>
                    </div>

                    <div className="addons-progress-line completed-line" />

                    <div className="addons-progress-step completed">
                        <div className="addons-progress-number">
                            ✓
                        </div>

                        <span>Traveler Details</span>
                    </div>

                    <div className="addons-progress-line active-line" />

                    <div className="addons-progress-step active">
                        <div className="addons-progress-number">
                            3
                        </div>

                        <span>Review & Customise</span>
                    </div>

                    <div className="addons-progress-line" />

                    <div className="addons-progress-step">
                        <div className="addons-progress-number">
                            4
                        </div>

                        <span>Payment</span>
                    </div>

                </div>
            </div>


            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="addons-header">

                <div className="addons-header-content">
                    <h1>Add-ons & Extras</h1>

                    <p>
                        Customize your journey with extra baggage,
                        meals, pet travel, priority services and
                        travel protection.
                    </p>
                </div>

                <button
                    type="button"
                    className="addons-back-top-btn"
                    onClick={handleBack}
                >
                    ← Back to Review
                </button>

            </div>


            {/* =====================================================
                MAIN LAYOUT
            ===================================================== */}

            <div className="addons-layout">

                {/* =================================================
                    LEFT SECTION
                ================================================= */}

                <section className="addons-main-section">


                    {/* =================================================
                        BAGGAGE
                    ================================================= */}

                    <div className="addons-card">

                        <div className="addons-card-heading">

                            <div className="addons-heading-icon">
                                🧳
                            </div>

                            <div>
                                <h2>Extra Checked Baggage</h2>

                                <p>
                                    Add checked baggage in addition
                                    to your included baggage allowance.
                                </p>
                            </div>

                        </div>


                        <div className="addons-note">
                            <strong>Included:</strong>{" "}
                            Standard cabin baggage allowance is already
                            included with your flight.
                        </div>


                        <div className="addons-option-grid">

                            {/* NONE */}

                            <button
                                type="button"
                                className={`addons-option-card ${selectedAddOns.baggage.length === 0
                                        ? "selected"
                                        : ""
                                    }`}
                                onClick={() =>
                                    setSelectedAddOns((prev) => ({
                                        ...prev,
                                        baggage: [],
                                    }))
                                }
                            >

                                <div className="addons-option-check">
                                    {selectedAddOns.baggage.length === 0
                                        ? "✓"
                                        : ""}
                                </div>

                                <div className="addons-option-content">
                                    <strong>
                                        No Extra Baggage
                                    </strong>

                                    <p>
                                        Use the included baggage allowance
                                    </p>
                                </div>

                                <span className="addons-option-price">
                                    ₹0
                                </span>

                            </button>


                            {/* OPTIONS */}

                            {baggageOptions.map((option) => {

                                const selected =
                                    selectedAddOns.baggage.some(
                                        (item) =>
                                            item.id === option.id
                                    );

                                return (
                                    <button
                                        type="button"
                                        key={option.id}
                                        className={`addons-option-card ${selected ? "selected" : ""
                                            }`}
                                        onClick={() =>
                                            handleBaggageSelect(option)
                                        }
                                    >

                                        <div className="addons-option-check">
                                            {selected ? "✓" : ""}
                                        </div>

                                        <div className="addons-option-content">
                                            <strong>
                                                {option.title}
                                            </strong>

                                            <p>
                                                {option.description}
                                            </p>
                                        </div>

                                        <span className="addons-option-price">
                                            +₹{formatPrice(option.price)}
                                        </span>

                                    </button>
                                );
                            })}

                        </div>

                    </div>


                    {/* =================================================
                        PET
                    ================================================= */}

                    <div className="addons-card">

                        <div className="addons-card-heading">

                            <div className="addons-heading-icon">
                                🐾
                            </div>

                            <div>
                                <h2>Pet Travel</h2>

                                <p>
                                    Request pet travel service for an
                                    eligible passenger and flight.
                                </p>
                            </div>

                        </div>


                        <div className="pet-toggle-row">

                            <div className="pet-toggle-content">
                                <strong>
                                    Are you travelling with a pet?
                                </strong>

                                <p>
                                    Pet travel depends on airline,
                                    route, aircraft and availability.
                                </p>
                            </div>


                            <button
                                type="button"
                                className={`pet-switch ${selectedAddOns.pet.selected
                                        ? "on"
                                        : ""
                                    }`}
                                onClick={handlePetToggle}
                                aria-pressed={
                                    selectedAddOns.pet.selected
                                }
                            >
                                <span />

                                {selectedAddOns.pet.selected
                                    ? "Yes"
                                    : "No"}
                            </button>

                        </div>


                        {selectedAddOns.pet.selected && (

                            <div className="pet-form">

                                <div className="pet-warning">
                                    <strong>Important:</strong>{" "}
                                    Pet travel requires airline
                                    confirmation. The airline-specific
                                    pet fee is not included in the total
                                    until a confirmed fee is available.
                                </div>


                                <div className="pet-form-grid">

                                    {/* TYPE */}

                                    <div className="addons-field">
                                        <label>
                                            Pet Type*
                                        </label>

                                        <select
                                            value={
                                                selectedAddOns.pet.type
                                            }
                                            onChange={(e) =>
                                                handlePetChange(
                                                    "type",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">
                                                Select pet type
                                            </option>

                                            <option value="Dog">
                                                Dog
                                            </option>

                                            <option value="Cat">
                                                Cat
                                            </option>

                                            <option value="Other">
                                                Other
                                            </option>
                                        </select>
                                    </div>


                                    {/* TRAVEL TYPE */}

                                    <div className="addons-field">
                                        <label>
                                            Travel Type*
                                        </label>

                                        <select
                                            value={
                                                selectedAddOns.pet
                                                    .travelType
                                            }
                                            onChange={(e) =>
                                                handlePetChange(
                                                    "travelType",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="cabin">
                                                In Cabin
                                            </option>

                                            <option value="hold">
                                                Checked / Cargo Hold
                                            </option>
                                        </select>
                                    </div>


                                    {/* NAME */}

                                    <div className="addons-field">
                                        <label>
                                            Pet Name*
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                selectedAddOns.pet.name
                                            }
                                            onChange={(e) =>
                                                handlePetChange(
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter pet name"
                                        />
                                    </div>


                                    {/* WEIGHT */}

                                    <div className="addons-field">
                                        <label>
                                            Pet Weight (kg)*
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={
                                                selectedAddOns.pet.weight
                                            }
                                            onChange={(e) =>
                                                handlePetChange(
                                                    "weight",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="e.g. 6.5"
                                        />
                                    </div>


                                    {/* PASSENGER */}

                                    <div className="addons-field">
                                        <label>
                                            Travelling Passenger*
                                        </label>

                                        <select
                                            value={
                                                selectedAddOns.pet
                                                    .passengerIndex
                                            }
                                            onChange={(e) =>
                                                handlePetChange(
                                                    "passengerIndex",
                                                    Number(
                                                        e.target.value
                                                    )
                                                )
                                            }
                                        >

                                            {passengers.map(
                                                (passenger, index) => (
                                                    <option
                                                        key={index}
                                                        value={index}
                                                    >
                                                        {passenger?.firstName ||
                                                            `Passenger ${index + 1
                                                            }`}{" "}
                                                        {passenger?.lastName ||
                                                            ""}
                                                    </option>
                                                )
                                            )}

                                        </select>
                                    </div>


                                    {/* CARRIER */}

                                    <div className="addons-field">
                                        <label>
                                            Carrier Available?
                                        </label>

                                        <select
                                            value={
                                                selectedAddOns.pet
                                                    .carrierAvailable
                                            }
                                            onChange={(e) =>
                                                handlePetChange(
                                                    "carrierAvailable",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">
                                                Select
                                            </option>

                                            <option value="yes">
                                                Yes
                                            </option>

                                            <option value="no">
                                                No
                                            </option>
                                        </select>
                                    </div>

                                </div>


                                {!petDetailsComplete && (
                                    <div className="addons-validation-message">
                                        Please complete Pet Type,
                                        Pet Name and Pet Weight before
                                        saving.
                                    </div>
                                )}

                            </div>
                        )}

                    </div>


                    {/* =================================================
                        MEALS
                    ================================================= */}

                    <div className="addons-card">

                        <div className="addons-card-heading">

                            <div className="addons-heading-icon">
                                🍽️
                            </div>

                            <div>
                                <h2>In-Flight Meals</h2>

                                <p>
                                    Select a meal or snack option for
                                    your journey.
                                </p>
                            </div>

                        </div>


                        <div className="addons-option-grid">

                            {/* NONE */}

                            <button
                                type="button"
                                className={`addons-option-card ${selectedAddOns.meals.length === 0
                                        ? "selected"
                                        : ""
                                    }`}
                                onClick={() =>
                                    setSelectedAddOns((prev) => ({
                                        ...prev,
                                        meals: [],
                                    }))
                                }
                            >

                                <div className="addons-option-check">
                                    {selectedAddOns.meals.length === 0
                                        ? "✓"
                                        : ""}
                                </div>

                                <div className="addons-option-content">
                                    <strong>
                                        No Meal
                                    </strong>

                                    <p>
                                        Do not add an in-flight meal
                                    </p>
                                </div>

                                <span className="addons-option-price">
                                    ₹0
                                </span>

                            </button>


                            {mealOptions.map((option) => {

                                const selected =
                                    selectedAddOns.meals.some(
                                        (item) =>
                                            item.id === option.id
                                    );

                                return (
                                    <button
                                        type="button"
                                        key={option.id}
                                        className={`addons-option-card ${selected ? "selected" : ""
                                            }`}
                                        onClick={() =>
                                            handleMealSelect(option)
                                        }
                                    >

                                        <div className="addons-option-check">
                                            {selected ? "✓" : ""}
                                        </div>

                                        <div className="addons-option-content">
                                            <strong>
                                                {option.title}
                                            </strong>

                                            <p>
                                                {option.description}
                                            </p>
                                        </div>

                                        <span className="addons-option-price">
                                            +₹{formatPrice(option.price)}
                                        </span>

                                    </button>
                                );
                            })}

                        </div>

                    </div>


                    {/* =================================================
                        PRIORITY + INSURANCE
                    ================================================= */}

                    <div className="addons-card">

                        <div className="addons-card-heading">

                            <div className="addons-heading-icon">
                                ⭐
                            </div>

                            <div>
                                <h2>
                                    Priority & Travel Protection
                                </h2>

                                <p>
                                    Add optional airport convenience
                                    and protection services.
                                </p>
                            </div>

                        </div>


                        <div className="addons-toggle-list">

                            {/* PRIORITY */}

                            <label
                                className={`addons-toggle-card ${selectedAddOns.priority
                                        ? "selected"
                                        : ""
                                    }`}
                            >

                                <input
                                    type="checkbox"
                                    checked={
                                        selectedAddOns.priority
                                    }
                                    onChange={(e) =>
                                        setSelectedAddOns(
                                            (prev) => ({
                                                ...prev,
                                                priority:
                                                    e.target.checked,
                                            })
                                        )
                                    }
                                />

                                <div className="addons-toggle-content">

                                    <strong>
                                        ⚡ Priority Boarding & Check-in
                                    </strong>

                                    <p>
                                        Skip standard queues where
                                        the service is available.
                                    </p>

                                </div>

                                <span>
                                    +₹{formatPrice(priorityUnitPrice)}
                                </span>

                            </label>


                            {/* INSURANCE */}

                            <label
                                className={`addons-toggle-card ${selectedAddOns.insurance
                                        ? "selected"
                                        : ""
                                    }`}
                            >

                                <input
                                    type="checkbox"
                                    checked={
                                        selectedAddOns.insurance
                                    }
                                    onChange={(e) =>
                                        setSelectedAddOns(
                                            (prev) => ({
                                                ...prev,
                                                insurance:
                                                    e.target.checked,
                                            })
                                        )
                                    }
                                />

                                <div className="addons-toggle-content">

                                    <strong>
                                        🛡️ Comprehensive Travel Protection
                                    </strong>

                                    <p>
                                        Coverage for eligible
                                        cancellation, baggage and
                                        emergency situations.
                                    </p>

                                </div>

                                <span>
                                    +₹{formatPrice(insuranceUnitPrice)}
                                </span>

                            </label>

                        </div>

                    </div>


                    {/* =================================================
                        BOTTOM BUTTONS (DESKTOP)
                    ================================================= */}

                    <div className="addons-bottom-actions desktop-only-actions">

                        <button
                            type="button"
                            className="addons-secondary-btn"
                            onClick={handleBack}
                        >
                            ← Back to Review
                        </button>

                        <button
                            type="button"
                            className="addons-primary-btn"
                            onClick={handleSaveAndReturn}
                            disabled={
                                selectedAddOns.pet.selected &&
                                !petDetailsComplete
                            }
                        >
                            Save & Return to Review →
                        </button>

                    </div>

                </section>


                {/* =================================================
                    RIGHT SUMMARY
                ================================================= */}

                <aside className="addons-summary-section">

                    {/* ADD-ON SUMMARY */}

                    <div className="addons-summary-card">

                        <h3>
                            Your Add-ons
                        </h3>


                        <div className="addons-summary-row">
                            <span>
                                Extra Baggage
                            </span>

                            <strong>
                                ₹{formatPrice(baggageTotal)}
                            </strong>
                        </div>


                        <div className="addons-summary-row">
                            <span>
                                In-Flight Meals
                            </span>

                            <strong>
                                ₹{formatPrice(mealTotal)}
                            </strong>
                        </div>


                        <div className="addons-summary-row">
                            <span>
                                Priority
                            </span>

                            <strong>
                                ₹{formatPrice(priorityPrice)}
                            </strong>
                        </div>


                        <div className="addons-summary-row">
                            <span>
                                Travel Protection
                            </span>

                            <strong>
                                ₹{formatPrice(insurancePrice)}
                            </strong>
                        </div>


                        <div className="addons-summary-row">
                            <span>
                                Pet Travel
                            </span>

                            <strong
                                className={
                                    selectedAddOns.pet.selected
                                        ? "summary-warning"
                                        : ""
                                }
                            >
                                {selectedAddOns.pet.selected
                                    ? "Confirmation required"
                                    : "Not selected"}
                            </strong>
                        </div>


                        <hr />


                        <div className="addons-summary-row addons-summary-total">
                            <span>
                                Add-ons Total
                            </span>

                            <strong>
                                ₹{formatPrice(totalAddOnCharges)}
                            </strong>
                        </div>

                    </div>


                    {/* FARE SUMMARY */}

                    <div className="addons-summary-card">

                        <h3>
                            Fare Summary
                        </h3>


                        <div className="addons-summary-row">
                            <span>
                                Flight Base Fare & Taxes
                            </span>

                            <strong>
                                ₹{formatPrice(flightFare)}
                            </strong>
                        </div>


                        <div className="addons-summary-row">
                            <span>
                                Seat Selection
                            </span>

                            <strong>
                                ₹{formatPrice(seatCharges)}
                            </strong>
                        </div>


                        <div className="addons-summary-row">
                            <span>
                                Add-ons
                            </span>

                            <strong>
                                ₹{formatPrice(totalAddOnCharges)}
                            </strong>
                        </div>


                        <hr />


                        <div className="addons-total-row">

                            <span>
                                Total Amount
                            </span>

                            <strong>
                                ₹{formatPrice(finalTotalPrice)}
                            </strong>

                        </div>

                    </div>


                    {/* INFO */}

                    <div className="addons-info-card">

                        <strong>
                            ✓ Flexible Customisation
                        </strong>

                        <p>
                            You can change your add-on selections
                            before proceeding to payment.
                        </p>

                    </div>

                </aside>

                {/* =================================================
                    BOTTOM BUTTONS (MOBILE - AT VERY LAST OF ALL SECTIONS)
                ================================================= */}

                <div className="addons-bottom-actions mobile-only-actions">

                    <button
                        type="button"
                        className="addons-secondary-btn"
                        onClick={handleBack}
                    >
                        ← Back to Review
                    </button>

                    <button
                        type="button"
                        className="addons-primary-btn"
                        onClick={handleSaveAndReturn}
                        disabled={
                            selectedAddOns.pet.selected &&
                            !petDetailsComplete
                        }
                    >
                        Save & Return to Review →
                    </button>

                </div>

            </div>

        </main>
    );
}

export default AddOns;