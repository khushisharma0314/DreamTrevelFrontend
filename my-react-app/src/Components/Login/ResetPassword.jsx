
import { useState } from "react";
import axios from "axios";

const ResetPassword = () => {

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    // Get token from email reset link
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");


    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");


        if (!token) {
            setError("Invalid or expired reset link.");
            return;
        }


        if (!newPassword.trim()) {
            setError("Please enter your new password.");
            return;
        }


        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }


        if (!confirmPassword.trim()) {
            setError("Please confirm your password.");
            return;
        }


        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }


        setLoading(true);


        try {

            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password`,
                {
                    token: token,
                    newPassword: newPassword
                }
            );


            setMessage(
                response.data ||
                "Password reset successful."
            );


            setNewPassword("");
            setConfirmPassword("");


            // Go to login after successful reset
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);


        } catch (error) {

            console.error(
                "RESET PASSWORD ERROR:",
                error
            );


            if (error.response) {

                setError(
                    error.response.data?.message ||
                    error.response.data ||
                    "Unable to reset password. Please try again."
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
                    Reset Password
                </h2>


                <p
                    style={{
                        textAlign: "center",
                        color: "#666",
                        marginBottom: "30px"
                    }}
                >
                    Enter your new password below.
                </p>


                <form onSubmit={handleSubmit}>

                    {/* New Password */}

                    <div
                        style={{
                            marginBottom: "20px",
                            position: "relative"
                        }}
                    >

                        <label
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontWeight: "500"
                            }}
                        >
                            New Password
                        </label>


                        <input
                            type={
                                showNewPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(e.target.value)
                            }
                            required
                            style={{
                                width: "100%",
                                height: "48px",
                                padding: "12px 70px 12px 14px",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                fontSize: "15px",
                                boxSizing: "border-box"
                            }}
                        />


                        <span
                            onClick={() =>
                                setShowNewPassword(
                                    !showNewPassword
                                )
                            }
                            style={{
                                position: "absolute",
                                right: "14px",
                                bottom: "14px",
                                color: "#1677ff",
                                fontSize: "13px",
                                cursor: "pointer",
                                fontWeight: "500"
                            }}
                        >
                            {showNewPassword
                                ? "Hide"
                                : "Show"}
                        </span>

                    </div>


                    {/* Confirm Password */}

                    <div
                        style={{
                            marginBottom: "20px",
                            position: "relative"
                        }}
                    >

                        <label
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontWeight: "500"
                            }}
                        >
                            Confirm Password
                        </label>


                        <input
                            type={
                                showConfirmPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                            required
                            style={{
                                width: "100%",
                                height: "48px",
                                padding: "12px 70px 12px 14px",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                fontSize: "15px",
                                boxSizing: "border-box"
                            }}
                        />


                        <span
                            onClick={() =>
                                setShowConfirmPassword(
                                    !showConfirmPassword
                                )
                            }
                            style={{
                                position: "absolute",
                                right: "14px",
                                bottom: "14px",
                                color: "#1677ff",
                                fontSize: "13px",
                                cursor: "pointer",
                                fontWeight: "500"
                            }}
                        >
                            {showConfirmPassword
                                ? "Hide"
                                : "Show"}
                        </span>

                    </div>


                    {/* Reset Button */}

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
                            opacity: loading
                                ? 0.7
                                : 1
                        }}
                    >

                        {loading
                            ? "Resetting..."
                            : "Reset Password"}

                    </button>

                </form>


                {/* Success Message */}

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


                {/* Error Message */}

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


                {/* Back to Login */}

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


export default ResetPassword;
