import React, { useState } from "react";
import "./TravelFAQ.css";

const faqData = [
    {
        question: "New to Dream Travel — how does it work?",
        answer:
            "Simply search your destination, choose a suitable flight, and complete your booking in a few easy steps. Your confirmation and booking details are shared right away.",
    },

    {
        question: "What makes your flight search different?",
        answer:
            "Our search brings flight options together in one place, making it easier to compare schedules, airlines, prices, and travel details.",
    },

    {
        question: "How can I find the right flight for my trip?",
        answer:
            "Enter your destination, travel dates, and preferences, then compare the available flights to find an option that fits your journey.",
    },

    {
        question: "What happens after I complete my booking?",
        answer:
            "You receive your booking confirmation and ticket details after the booking is successfully completed.",
    },

    {
        question: "How is my information kept protected?",
        answer:
            "Your personal and booking information is handled using secure practices designed to protect your data during the booking process.",
    },

    {
        question: "Plans changed — can I update my booking?",
        answer:
            "Changes depend on the airline and fare conditions. Check your booking details or contact support to understand the available options.",
    },

    {
        question: "Need assistance with a reservation — who can I reach?",
        answer:
            "Our support team can help with reservation-related questions, booking details, and other travel assistance.",
    },

    {
        question: "What should I know before cancelling my ticket?",
        answer:
            "Cancellation rules and refund amounts depend on your airline and fare type. Always check the applicable cancellation conditions before confirming.",
    },

    {
        question: "Can I pick my seat or add meals before flying?",
        answer:
            "Seat selection and meal options may be available depending on the airline and ticket type. These options can usually be added before your journey.",
    },

    {
        question: "Will the final price be clear before checkout?",
        answer:
            "Yes. The booking details and applicable charges are shown before you complete the payment so you can review the total.",
    },

    {
        question: "What payment methods can I use?",
        answer:
            "Available payment methods may include cards, online payment options, and other supported methods shown during checkout.",
    },

    {
        question: "Planning a trip for a group — can you help?",
        answer:
            "Yes, group travel requirements can be discussed with our support team so suitable flight options can be explored.",
    },

    {
        question: "Can I arrange a ticket for another person?",
        answer:
            "Yes. You can book a ticket for another traveler by entering their correct passenger details during the booking process.",
    },

    {
        question: "What happens when an airline delays or cancels my flight?",
        answer:
            "If an airline changes or cancels a flight, available options depend on the airline's policy. You can contact support for assistance.",
    },

    {
        question: "Where can I find special fares and flight offers?",
        answer:
            "Special fares and available flight offers can be displayed during your flight search, so you can compare eligible options before booking.",
    },

    {
        question: "Do you provide travel support after booking?",
        answer:
            "Yes. You can reach our support team for help with your booking, travel details, or other reservation-related questions.",
    },
];


// =====================================================
// FAQ ITEM
// =====================================================

const FAQItem = ({ item, isOpen, onClick }) => {
    return (
        <div className={`faq-item ${isOpen ? "active" : ""}`}>

            <button
                className="faq-question"
                onClick={onClick}
                type="button"
                aria-expanded={isOpen}
            >

                {/* Question Mark Icon */}
                <span className="faq-icon">
                    ?
                </span>

                {/* Question */}
                <span className="faq-question-text">
                    {item.question}
                </span>

                {/* Dropdown Arrow */}
                <span
                    className={`faq-arrow ${isOpen ? "rotate" : ""}`}
                >
                    ⌄
                </span>

            </button>


            {/* Answer */}
            <div
                className={`faq-answer-wrapper ${isOpen ? "show" : ""
                    }`}
            >
                <div className="faq-answer">
                    {item.answer}
                </div>
            </div>

        </div>
    );
};


// =====================================================
// TRAVEL FAQ COMPONENT
// =====================================================

const TravelFAQ = () => {

    // First question will be open by default
    const [openIndex, setOpenIndex] = useState(0);


    // ===================================================
    // TOGGLE FAQ
    // ===================================================

    const handleToggle = (index) => {

        setOpenIndex(
            openIndex === index ? null : index
        );

    };


    // ===================================================
    // SPLIT FAQS INTO TWO COLUMNS
    // 16 Questions = 8 Left + 8 Right
    // ===================================================

    const leftFAQs = faqData.slice(0, 8);

    const rightFAQs = faqData.slice(8);


    return (

        <section className="travel-faq-section">

            {/* =================================================
          FAQ HEADER
      ================================================= */}

            <div className="faq-header">

                <div className="faq-small-title">
                    GOT QUESTIONS?
                </div>


                <h2>
                    TRAVEL MADE <span>CLEAR</span>
                </h2>


                <h3>
                    Before You Take Off
                </h3>


                <p>
                    A few quick answers to help you book your next
                    journey with confidence.
                </p>

            </div>


            {/* =================================================
          FAQ CONTAINER
      ================================================= */}

            <div className="faq-container">


                {/* =================================================
            LEFT COLUMN
        ================================================= */}

                <div className="faq-column">

                    {leftFAQs.map((item, index) => (

                        <FAQItem
                            key={index}
                            item={item}
                            isOpen={openIndex === index}
                            onClick={() => handleToggle(index)}
                        />

                    ))}

                </div>


                {/* =================================================
            RIGHT COLUMN
        ================================================= */}

                <div className="faq-column">

                    {rightFAQs.map((item, index) => {

                        // Because right column starts from index 8
                        const actualIndex = index + 8;


                        return (

                            <FAQItem
                                key={actualIndex}
                                item={item}
                                isOpen={
                                    openIndex === actualIndex
                                }
                                onClick={() =>
                                    handleToggle(actualIndex)
                                }
                            />

                        );

                    })}

                </div>

            </div>

        </section>

    );
};


export default TravelFAQ;