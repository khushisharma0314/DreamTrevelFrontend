
import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        if (!email.trim()) {
            setError("Please enter your email.");
            return;
        }

        setLoading(true);

        try {

            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password`,
                {
                    email: email.trim()
                }
            );

            setMessage(
                response.data ||
                "If an account exists with this email, a password reset link has been sent."
            );

            setEmail("");

        } catch (error) {

            console.error(
                "FORGOT PASSWORD ERROR:",
                error
            );

            if (error.response) {

                setError(
                    error.response.data?.message ||
                    error.response.data ||
                    "Something went wrong. Please try again."
                );

            } else {

                setError(
                    "Server se connection nahi ho raha."
                );

            }

        } finally {

            setLoading(false);

        }
    };


    return (

        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f7f7f7",
                padding: "20px"
            }}
        >

            <div
                style={{
                    width: "100%",
                    maxWidth: "450px",
                    background: "#ffffff",
                    padding: "40px",
                    borderRadius: "16px",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.08)"
                }}
            >

                <h2
                    style={{
                        textAlign: "center",
                        marginBottom: "10px"
                    }}
                >
                    Forgot Password?
                </h2>


                <p
                    style={{
                        textAlign: "center",
                        color: "#666",
                        marginBottom: "30px"
                    }}
                >
                    Enter your registered email address and
                    we will send you a password reset link.
                </p>


                <form onSubmit={handleSubmit}>

                    <div
                        style={{
                            marginBottom: "20px"
                        }}
                    >

                        <label
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontWeight: "500"
                            }}
                        >
                            Email
                        </label>


                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                            style={{
                                width: "100%",
                                height: "48px",
                                padding: "12px 14px",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                fontSize: "15px",
                                boxSizing: "border-box"
                            }}
                        />

                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            height: "48px",
                            border: "none",
                            borderRadius: "8px",
                            background: "#ff8a00",
                            color: "#ffffff",
                            fontSize: "16px",
                            fontWeight: "600",
                            cursor: loading
                                ? "not-allowed"
                                : "pointer",
                            opacity: loading ? 0.7 : 1
                        }}
                    >

                        {loading
                            ? "Sending..."
                            : "Send Reset Link"}

                    </button>

                </form>


                {message && (

                    <p
                        style={{
                            marginTop: "20px",
                            padding: "12px",
                            borderRadius: "8px",
                            background: "#e8f7ee",
                            color: "#16803c",
                            textAlign: "center"
                        }}
                    >
                        {message}
                    </p>

                )}


                {error && (

                    <p
                        style={{
                            marginTop: "20px",
                            padding: "12px",
                            borderRadius: "8px",
                            background: "#fff0f0",
                            color: "#d32f2f",
                            textAlign: "center"
                        }}
                    >
                        {error}
                    </p>

                )}


                <div
                    style={{
                        textAlign: "center",
                        marginTop: "25px"
                    }}
                >

                    <button
                        type="button"
                        onClick={() => {
                            window.location.href = "/login";
                        }}
                        style={{
                            border: "none",
                            background: "none",
                            color: "#1677ff",
                            cursor: "pointer",
                            fontSize: "14px"
                        }}
                    >
                        ← Back to Login
                    </button>

                </div>

            </div>

        </div>

    );

};


export default ForgotPassword;
