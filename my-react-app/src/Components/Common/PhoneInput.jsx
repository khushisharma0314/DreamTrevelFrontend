import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import {
    COUNTRIES,
    POPULAR_COUNTRIES,
    getCountryByDialCode
} from "./countriesData";
import "./PhoneInput.css";

const PhoneInput = ({
    countryCode = "+1",
    countryISO = "US",
    onCountryCodeChange,
    value = "",
    onChange,
    name = "phone",
    placeholder = "Enter phone number",
    error = null,
    disabled = false,
    id = "phone-input",
    required = false,
    maxLength = 15,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    /*
       Keep the exact selected country internally.
       This is important because USA and Canada both use +1.
    */
    const [internalSelectedCountry, setInternalSelectedCountry] =
        useState(() =>
            getCountryByDialCode(countryCode, countryISO)
        );

    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    /*
       Update selected country when parent changes
       the country ISO/code.
    */
    useEffect(() => {
        const country = getCountryByDialCode(
            countryCode,
            countryISO
        );

        setInternalSelectedCountry(country);
    }, [countryCode, countryISO]);

    /*
       Current selected country.
       Internal selected country is preferred so that
       same dial codes like +1 remain distinguishable.
    */
    const selectedCountry =
        internalSelectedCountry ||
        getCountryByDialCode(countryCode, countryISO);

    /*
       Filter popular countries based on search term
    */
    const filteredPopular = POPULAR_COUNTRIES.filter(
        (c) =>
            c.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            c.dialCode.includes(searchTerm) ||
            c.code
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    /*
       Filter all countries based on search term
    */
    const filteredCountries = COUNTRIES.filter(
        (c) =>
            c.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            c.dialCode.includes(searchTerm) ||
            c.code
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    /*
       Close dropdown on outside click
    */
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
                setSearchTerm("");
            }
        };

        if (isOpen) {
            document.addEventListener(
                "mousedown",
                handleClickOutside
            );

            document.addEventListener(
                "touchstart",
                handleClickOutside
            );
        }

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

            document.removeEventListener(
                "touchstart",
                handleClickOutside
            );
        };
    }, [isOpen]);

    /*
       Auto focus search input when opened
    */
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 50);
        }
    }, [isOpen]);

    /*
       Select country
    */
    const handleSelectCountry = (country) => {
        /*
           IMPORTANT:
           Save complete country object internally.
           This solves +1 USA/Canada problem.
        */
        setInternalSelectedCountry(country);

        if (onCountryCodeChange) {
            onCountryCodeChange(
                country.dialCode,
                country
            );
        }

        setIsOpen(false);
        setSearchTerm("");
    };

    /*
       Phone number change
    */
    const handlePhoneChange = (e) => {
        // Allow digits, spaces, and hyphens only
        const rawValue = e.target.value.replace(
            /[^\d\s-]/g,
            ""
        );

        if (onChange) {
            // Forward event with sanitized value
            e.target.value = rawValue;
            onChange(e);
        }
    };

    return (
        <div
            className={`phone-input-container ${error ? "has-error" : ""
                } ${disabled ? "is-disabled" : ""
                }`}
            ref={dropdownRef}
        >
            <div className="phone-input-group">

                {/* COUNTRY CODE SELECTOR BUTTON */}

                <button
                    type="button"
                    className={`country-code-btn ${isOpen ? "active" : ""
                        }`}
                    onClick={() =>
                        !disabled &&
                        setIsOpen((prev) => !prev)
                    }
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    disabled={disabled}
                    title="Select country code"
                >
                    <span className="country-flag">
                        {selectedCountry?.flag || "🌐"}
                    </span>

                    <span className="country-dial-code">
                        {selectedCountry?.dialCode ||
                            countryCode ||
                            "+1"}
                    </span>

                    <ChevronDown
                        className={`country-chevron ${isOpen ? "rotate" : ""
                            }`}
                        size={14}
                    />
                </button>

                {/* PHONE NUMBER INPUT FIELD */}

                <input
                    type="tel"
                    id={id}
                    name={name}
                    value={value}
                    onChange={handlePhoneChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    maxLength={maxLength}
                    inputMode="numeric"
                    autoComplete="tel-national"
                    className="phone-number-field"
                />
            </div>

            {/* DROPDOWN MENU */}

            {isOpen && (
                <div
                    className="country-dropdown-menu"
                    role="listbox"
                >

                    {/* SEARCH BOX */}

                    <div className="country-search-box">
                        <Search
                            size={14}
                            className="search-icon"
                        />

                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search country or code..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(
                                    e.target.value
                                )
                            }
                            className="country-search-input"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        />
                    </div>

                    <div className="country-list-scroll">

                        {/* POPULAR COUNTRIES */}

                        {!searchTerm &&
                            filteredPopular.length > 0 && (
                                <div className="country-group">

                                    <div className="country-group-title">
                                        Popular Countries
                                    </div>

                                    {filteredPopular.map(
                                        (c) => {
                                            const isSelected =
                                                selectedCountry?.dialCode ===
                                                c.dialCode &&
                                                selectedCountry?.code ===
                                                c.code;

                                            return (
                                                <button
                                                    key={`pop-${c.code}-${c.dialCode}`}
                                                    type="button"
                                                    className={`country-option ${isSelected
                                                            ? "selected"
                                                            : ""
                                                        }`}
                                                    onClick={() =>
                                                        handleSelectCountry(
                                                            c
                                                        )
                                                    }
                                                    role="option"
                                                    aria-selected={
                                                        isSelected
                                                    }
                                                >
                                                    <span className="country-option-flag">
                                                        {c.flag}
                                                    </span>

                                                    <span className="country-option-name">
                                                        {c.name}
                                                    </span>

                                                    <span className="country-option-code">
                                                        {c.dialCode}
                                                    </span>

                                                    {isSelected && (
                                                        <Check
                                                            size={14}
                                                            className="selected-check"
                                                        />
                                                    )}
                                                </button>
                                            );
                                        }
                                    )}
                                </div>
                            )}

                        {/* ALL COUNTRIES */}

                        <div className="country-group">

                            {!searchTerm && (
                                <div className="country-group-title">
                                    All Countries
                                </div>
                            )}

                            {filteredCountries.length > 0 ? (
                                filteredCountries.map(
                                    (c) => {
                                        const isSelected =
                                            selectedCountry?.dialCode ===
                                            c.dialCode &&
                                            selectedCountry?.code ===
                                            c.code;

                                        return (
                                            <button
                                                key={`${c.code}-${c.dialCode}`}
                                                type="button"
                                                className={`country-option ${isSelected
                                                        ? "selected"
                                                        : ""
                                                    }`}
                                                onClick={() =>
                                                    handleSelectCountry(
                                                        c
                                                    )
                                                }
                                                role="option"
                                                aria-selected={
                                                    isSelected
                                                }
                                            >
                                                <span className="country-option-flag">
                                                    {c.flag}
                                                </span>

                                                <span className="country-option-name">
                                                    {c.name}
                                                </span>

                                                <span className="country-option-code">
                                                    {c.dialCode}
                                                </span>

                                                {isSelected && (
                                                    <Check
                                                        size={14}
                                                        className="selected-check"
                                                    />
                                                )}
                                            </button>
                                        );
                                    }
                                )
                            ) : (
                                <div className="country-no-results">
                                    No countries found for "
                                    {searchTerm}"
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhoneInput;