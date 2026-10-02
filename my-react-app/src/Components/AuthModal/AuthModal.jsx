import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase.jsx";
import "./AuthModal.css";

const AuthModal = ({
    isOpen = true,
    isModal = true,
    onClose,
    initialMode = "login",
    initialEmail = "",
    initialName = "",
    onSuccess,
    customTitle,
    customSubtitle,
}) => {
    const navigate = useNavigate();

    const [authMode, setAuthMode] = useState(initialMode); // "login" | "register"
    const [name, setName] = useState(initialName);
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setAuthMode(initialMode);
    }, [initialMode]);

    useEffect(() => {
        if (initialEmail) setEmail(initialEmail);
    }, [initialEmail]);

    useEffect(() => {
        if (initialName) setName(initialName);
    }, [initialName]);

    // Close on Escape key if it is a modal
    useEffect(() => {
        if (!isModal || !isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && onClose) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isModal, isOpen, onClose]);

    if (!isOpen && isModal) return null;

    // Standard login or register submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const apiBase = import.meta.env.VITE_API_BASE_URL || "";

        try {
            if (authMode === "register") {
                // Register
                const res = await axios.post(`${apiBase}/api/auth/register`, {
                    name: name.trim(),
                    email: email.trim(),
                    password: password,
                });

                // Auto login immediately
                try {
                    const loginRes = await axios.post(`${apiBase}/api/auth/login`, {
                        email: email.trim(),
                        password: password,
                    });
                    const token = loginRes.data?.token || loginRes.data?.jwt || loginRes.data?.accessToken;
                    if (token) {
                        const userData = loginRes.data?.user || {
                            name: name.trim() || email.split("@")[0],
                            email: email.trim(),
                        };
                        localStorage.setItem("token", token);
                        localStorage.setItem("user", JSON.stringify(userData));
                        window.dispatchEvent(new Event("authChange"));
                        if (onSuccess) {
                            onSuccess(userData, token);
                        } else {
                            if (onClose) onClose();
                        }
                        return;
                    }
                } catch {
                    // Fallback to switching tab to login
                    setAuthMode("login");
                    setError("Account created successfully! Please login with your password.");
                    setLoading(false);
                    return;
                }
            } else {
                // Login
                const res = await axios.post(`${apiBase}/api/auth/login`, {
                    email: email.trim(),
                    password: password,
                });

                const token = res.data?.token || res.data?.jwt || res.data?.accessToken;
                if (!token) {
                    setError("Login failed: Authentication token was not returned.");
                    setLoading(false);
                    return;
                }

                const userData = res.data?.user || {
                    name: res.data?.name || email.split("@")[0],
                    email: email.trim(),
                };

                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(userData));
                window.dispatchEvent(new Event("authChange"));

                if (onSuccess) {
                    onSuccess(userData, token);
                } else {
                    if (onClose) onClose();
                }
            }
        } catch (err) {
            console.error("Auth error:", err);
            const msg =
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Authentication failed. Please check your credentials.";
            setError(typeof msg === "string" ? msg : JSON.stringify(msg));
        } finally {
            setLoading(false);
        }
    };

    // Google Sign-In with Firebase
    const handleGoogleAuth = async () => {
        setError("");
        setLoading(true);

        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const apiBase = import.meta.env.VITE_API_BASE_URL || "";
            const res = await axios.post(`${apiBase}/api/auth/google`, {
                email: user.email,
                name: user.displayName,
            });

            const token = res.data?.token || res.data?.jwt || res.data?.accessToken;
            if (!token) {
                setError("Google Login failed: No auth token returned.");
                setLoading(false);
                return;
            }

            const userData = res.data?.user || {
                name: user.displayName || user.email.split("@")[0],
                email: user.email,
            };

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("googleUser", JSON.stringify({
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
            }));

            window.dispatchEvent(new Event("authChange"));

            if (onSuccess) {
                onSuccess(userData, token);
            } else {
                if (onClose) onClose();
            }
        } catch (err) {
            console.error("Google Auth error:", err);
            if (err.code === "auth/popup-closed-by-user") {
                setLoading(false);
                return;
            }
            if (err.code === "auth/popup-blocked") {
                setError("Browser blocked the Google popup. Please enable popups.");
                setLoading(false);
                return;
            }
            setError("Google sign-in was unsuccessful. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const cardContent = (
        <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Close Button if modal */}
            {isModal && onClose && (
                <button
                    type="button"
                    className="auth-modal-close-btn"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    ✕
                </button>
            )}

            {/* Header */}
            <div className="auth-modal-header">
                <span className="auth-modal-badge">
                    {authMode === "login" ? "Welcome Back" : "New Account"}
                </span>
                <h3 className="auth-modal-title">
                    {customTitle || (authMode === "login" ? "Sign In" : "Register")}
                </h3>
                <p className="auth-modal-subtitle">
                    {customSubtitle ||
                        (authMode === "login"
                            ? "Sign in to access your bookings and faster checkout"
                            : "Create an account for quick booking & special flight fares")}
                </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="auth-modal-tabs">
                <button
                    type="button"
                    className={`auth-modal-tab ${authMode === "login" ? "active" : ""}`}
                    onClick={() => {
                        setAuthMode("login");
                        setError("");
                    }}
                >
                    Sign In
                </button>
                <button
                    type="button"
                    className={`auth-modal-tab ${authMode === "register" ? "active" : ""}`}
                    onClick={() => {
                        setAuthMode("register");
                        setError("");
                    }}
                >
                    Sign Up
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="auth-modal-error">
                    <span>⚠️</span>
                    <span>{error}</span>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="auth-modal-form">
                {authMode === "register" && (
                    <div className="auth-form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            placeholder="e.g. John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                )}

                <div className="auth-form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        placeholder="e.g. name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="auth-form-group">
                    <label>Password</label>
                    <div className="auth-input-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder={authMode === "register" ? "Create a secure password" : "Enter your password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="auth-password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? "👁️" : "🔒"}
                        </button>
                    </div>
                </div>

                {authMode === "login" && (
                    <div className="auth-forgot-link-wrap">
                        <button
                            type="button"
                            className="auth-forgot-link"
                            onClick={() => {
                                if (onClose) onClose();
                                navigate("/forgot-password");
                            }}
                        >
                            Forgot password?
                        </button>
                    </div>
                )}

                <button
                    type="submit"
                    className="auth-submit-btn"
                    disabled={loading}
                >
                    {loading ? (
                        <span>Please wait...</span>
                    ) : (
                        <>
                            <span>{authMode === "login" ? "Sign In" : "Create Account"}</span>
                            <span>→</span>
                        </>
                    )}
                </button>
            </form>

            {/* Divider */}
            <div className="auth-modal-divider">
                <span>OR</span>
            </div>

            {/* Google Sign-in */}
            <button
                type="button"
                className="auth-google-btn"
                onClick={handleGoogleAuth}
                disabled={loading}
            >
                <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    <path fill="none" d="M0 0h48v48H0z" />
                </svg>
                <span>Continue with Google</span>
            </button>

            {/* Footer switcher */}
            <div className="auth-modal-footer">
                {authMode === "login" ? (
                    <p>
                        Don't have an account?{" "}
                        <button
                            type="button"
                            className="auth-link-btn"
                            onClick={() => {
                                setAuthMode("register");
                                setError("");
                            }}
                        >
                            Sign up here
                        </button>
                    </p>
                ) : (
                    <p>
                        Already have an account?{" "}
                        <button
                            type="button"
                            className="auth-link-btn"
                            onClick={() => {
                                setAuthMode("login");
                                setError("");
                            }}
                        >
                            Sign in here
                        </button>
                    </p>
                )}
            </div>
        </div>
    );

    if (!isModal) {
        return <div className="auth-page-wrapper">{cardContent}</div>;
    }

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            {cardContent}
        </div>
    );
};

export default AuthModal;
