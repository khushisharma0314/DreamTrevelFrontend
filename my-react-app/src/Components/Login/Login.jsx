import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthModal from "../AuthModal/AuthModal";
import { getBookingSession } from "../../utils/flightUtils";

const Login = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // If already logged in, redirect immediately
    useEffect(() => {
        const currentToken = localStorage.getItem("token");
        if (currentToken) {
            const fromPath = location.state?.from?.pathname;
            const fromState = location.state?.from?.state;

            if (fromPath && fromPath !== "/login") {
                navigate(fromPath, { state: fromState, replace: true });
                return;
            }

            const savedSession = getBookingSession();
            if (savedSession?.path && savedSession?.state) {
                navigate(savedSession.path, { state: savedSession.state, replace: true });
                return;
            }

            navigate("/", { replace: true });
        }
    }, [location.state, navigate]);

    // Handle successful login/registration
    const handleLoginSuccess = () => {
        const fromPath = location.state?.from?.pathname;
        const fromState = location.state?.from?.state;

        let targetPath = "/";
        let targetState = null;

        if (fromPath && fromPath !== "/login") {
            targetPath = fromPath;
            targetState = fromState;
        } else {
            const savedSession = getBookingSession();
            if (savedSession?.path && savedSession?.state) {
                targetPath = savedSession.path;
                targetState = savedSession.state;
            }
        }

        navigate(targetPath, { state: targetState, replace: true });
        window.dispatchEvent(new Event("authChange"));
    };

    const initialMode =
        location.state?.mode === "register" ||
        new URLSearchParams(window.location.search).get("mode") === "register"
            ? "register"
            : "login";

    const initialEmail = location.state?.contactEmail || "";

    return (
        <AuthModal
            isModal={false}
            initialMode={initialMode}
            initialEmail={initialEmail}
            onSuccess={handleLoginSuccess}
        />
    );
};

export default Login;
