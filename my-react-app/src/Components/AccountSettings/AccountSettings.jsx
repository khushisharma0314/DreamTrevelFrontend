
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AccountSettings.css";

function AccountSettings() {
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [showDeleteConfirmation, setShowDeleteConfirmation] =
        useState(false);

    const [deletePassword, setDeletePassword] = useState("");
    const [showDeletePassword, setShowDeletePassword] = useState(false);

    // =====================================================
    // CHANGE PASSWORD TOGGLE
    // =====================================================

    const [showChangePassword, setShowChangePassword] = useState(false);

    // =====================================================
    // CHANGE PASSWORD
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSuccessMessage("");
        setErrorMessage("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setErrorMessage("Please fill all the fields.");
            return;
        }

        if (newPassword.length < 6) {
            setErrorMessage(
                "New password must be at least 6 characters."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage("New passwords do not match.");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/change-password`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        currentPassword,
                        newPassword,
                        confirmPassword,
                    }),
                }
            );

            const data = await response.text();

            if (!response.ok) {
                setErrorMessage(
                    data || "Failed to change password."
                );
                return;
            }

            setSuccessMessage(
                data || "Password changed successfully."
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (error) {
            console.error("Change password error:", error);

            setErrorMessage(
                "Unable to connect to the server. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // DELETE ACCOUNT
    // =====================================================

    const handleDeleteAccount = async () => {
        setSuccessMessage("");
        setErrorMessage("");

        if (!deletePassword.trim()) {
            setErrorMessage(
                "Please enter your current password to delete your account."
            );
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            window.location.replace("/login");
            return;
        }

        try {
            setDeleteLoading(true);

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/delete-account`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        currentPassword: deletePassword,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(
                    data?.message ||
                    "Failed to delete account."
                );
                return;
            }

            // =================================================
            // ACCOUNT DELETED SUCCESSFULLY
            // =================================================

            if (data?.success === true) {

                // Remove authentication token
                localStorage.removeItem("token");

                // Clear delete-related state
                setDeletePassword("");
                setShowDeletePassword(false);
                setShowDeleteConfirmation(false);

                // Force complete redirect to login page
                window.location.replace("/login");

                return;
            }

            setErrorMessage(
                data?.message ||
                "Something went wrong. Please try again."
            );

        } catch (error) {
            console.error("Delete account error:", error);

            setErrorMessage(
                "Unable to connect to the server. Please try again."
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    // =====================================================
    // CANCEL DELETE
    // =====================================================

    const handleCancelDelete = () => {
        setShowDeleteConfirmation(false);
        setDeletePassword("");
        setShowDeletePassword(false);
        setErrorMessage("");
    };

    // =====================================================
    // TOGGLE CHANGE PASSWORD
    // =====================================================

    const handleChangePasswordToggle = () => {
        setShowChangePassword(!showChangePassword);

        // Clear old messages when opening/closing
        setSuccessMessage("");
        setErrorMessage("");
    };

    return (
        <div className="account-settings-page">

            <div className="account-settings-container">

                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <div className="account-settings-header">

                    <button
                        className="back-button"
                        onClick={() => navigate("/manage-account")}
                    >
                        ← Back
                    </button>

                    <div>
                        <h1>Account Settings</h1>

                        <p>
                            Manage your account security and password
                        </p>
                    </div>

                </div>


                {/* =================================================
                    CHANGE PASSWORD CARD
                ================================================= */}

                <div className="settings-card">

                    {/* TOGGLE HEADER */}

                    <button
                        type="button"
                        className="settings-card-toggle"
                        onClick={handleChangePasswordToggle}
                    >

                        <div className="settings-card-header">

                            <div className="settings-icon">
                                🔐
                            </div>

                            <div className="settings-card-title">
                                <h2>Change Password</h2>

                                <p>
                                    Update your password to keep your
                                    account secure.
                                </p>
                            </div>

                        </div>

                        <span className="toggle-arrow">
                            {showChangePassword ? "▲" : "▼"}
                        </span>

                    </button>


                    {/* CHANGE PASSWORD FORM */}

                    {showChangePassword && (

                        <form
                            onSubmit={handleSubmit}
                            className="change-password-form"
                        >

                            {/* CURRENT PASSWORD */}

                            <div className="form-group">

                                <label>
                                    Current Password
                                </label>

                                <div className="password-input-wrapper">

                                    <input
                                        type={
                                            showCurrent
                                                ? "text"
                                                : "password"
                                        }
                                        value={currentPassword}
                                        onChange={(e) =>
                                            setCurrentPassword(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter current password"
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowCurrent(
                                                !showCurrent
                                            )
                                        }
                                        title={
                                            showCurrent
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showCurrent ? "🔓" : "🔒"}
                                    </button>

                                </div>

                            </div>


                            {/* NEW PASSWORD */}

                            <div className="form-group">

                                <label>
                                    New Password
                                </label>

                                <div className="password-input-wrapper">

                                    <input
                                        type={
                                            showNew
                                                ? "text"
                                                : "password"
                                        }
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter new password"
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowNew(!showNew)
                                        }
                                        title={
                                            showNew
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showNew ? "🔓" : "🔒"}
                                    </button>

                                </div>

                            </div>


                            {/* CONFIRM PASSWORD */}

                            <div className="form-group">

                                <label>
                                    Confirm New Password
                                </label>

                                <div className="password-input-wrapper">

                                    <input
                                        type={
                                            showConfirm
                                                ? "text"
                                                : "password"
                                        }
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Confirm new password"
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowConfirm(
                                                !showConfirm
                                            )
                                        }
                                        title={
                                            showConfirm
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showConfirm ? "🔓" : "🔒"}
                                    </button>

                                </div>

                            </div>


                            {/* SUCCESS MESSAGE */}

                            {successMessage && (
                                <div className="success-message">
                                    ✓ {successMessage}
                                </div>
                            )}


                            {/* ERROR MESSAGE */}

                            {errorMessage &&
                                !showDeleteConfirmation && (
                                    <div className="error-message">
                                        ✕ {errorMessage}
                                    </div>
                                )}


                            {/* CHANGE PASSWORD BUTTON */}

                            <button
                                type="submit"
                                className="change-password-btn"
                                disabled={loading}
                            >
                                {loading
                                    ? "Changing Password..."
                                    : "Change Password"}
                            </button>

                        </form>

                    )}

                </div>


                {/* =================================================
                    DELETE ACCOUNT
                ================================================= */}

                <div className="delete-account-card">

                    <div className="delete-account-header">

                        <div className="delete-account-icon">
                            ⚠️
                        </div>

                        <div>
                            <h2>Delete Account</h2>

                            <p>
                                Permanently delete your account
                                and associated account access.
                            </p>
                        </div>

                    </div>


                    {!showDeleteConfirmation ? (

                        <button
                            type="button"
                            className="delete-account-btn"
                            onClick={() => {
                                setSuccessMessage("");
                                setErrorMessage("");
                                setShowDeleteConfirmation(true);
                            }}
                        >
                            Delete My Account
                        </button>

                    ) : (

                        <div className="delete-confirmation">

                            <div className="delete-warning">

                                <strong>
                                    Are you sure you want to delete
                                    your account?
                                </strong>

                                <p>
                                    This action cannot be undone.
                                    You will be logged out after your
                                    account is deleted.
                                </p>

                            </div>


                            {/* DELETE PASSWORD */}

                            <div className="form-group">

                                <label>
                                    Enter Current Password
                                </label>

                                <div className="password-input-wrapper">

                                    <input
                                        type={
                                            showDeletePassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={deletePassword}
                                        onChange={(e) =>
                                            setDeletePassword(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter current password"
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowDeletePassword(
                                                !showDeletePassword
                                            )
                                        }
                                        title={
                                            showDeletePassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showDeletePassword
                                            ? "🔓"
                                            : "🔒"}
                                    </button>

                                </div>

                            </div>


                            {/* DELETE ERROR */}

                            {errorMessage && (
                                <div className="error-message">
                                    ✕ {errorMessage}
                                </div>
                            )}


                            {/* DELETE BUTTONS */}

                            <div className="delete-confirmation-buttons">

                                <button
                                    type="button"
                                    className="cancel-delete-btn"
                                    onClick={handleCancelDelete}
                                    disabled={deleteLoading}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="confirm-delete-btn"
                                    onClick={handleDeleteAccount}
                                    disabled={deleteLoading}
                                >
                                    {deleteLoading
                                        ? "Deleting Account..."
                                        : "Yes, Delete My Account"}
                                </button>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default AccountSettings;
