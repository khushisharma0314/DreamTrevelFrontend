import React, { useEffect, useState } from "react";
import "./MyProfile.css";

function MyProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setError("You are not logged in.");
                    setLoading(false);
                    return;
                }

                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/auth/profile`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch profile");
                }

                const data = await response.json();

                setProfile(data);
                setName(data.name || "");
                setPhone(data.phone || "");

                // Header ke user data ko latest profile data se update karo
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        id: data.id,
                        name: data.name,
                        email: data.email,
                        role: data.role,
                        phone: data.phone,
                    })
                );
            } catch (err) {
                console.error("Profile error:", err);
                setError("Unable to load profile. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleEdit = () => {
        setName(profile?.name || "");
        setPhone(profile?.phone || "");
        setSuccess("");
        setError("");
        setIsEditing(true);
    };

    const handleCancel = () => {
        setName(profile?.name || "");
        setPhone(profile?.phone || "");
        setError("");
        setSuccess("");
        setIsEditing(false);
    };

    const handleSave = async () => {
        setError("");
        setSuccess("");

        if (!name.trim()) {
            setError("Full name is required.");
            return;
        }

        if (phone && !/^[0-9]{10,15}$/.test(phone)) {
            setError("Please enter a valid phone number.");
            return;
        }

        try {
            setSaving(true);

            const token = localStorage.getItem("token");

            if (!token) {
                setError("You are not logged in.");
                return;
            }

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/profile`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: name.trim(),
                        phone: phone.trim(),
                    }),
                }
            );

            if (!response.ok) {
                let message = "Failed to update profile.";

                try {
                    const errorData = await response.json();

                    if (errorData?.message) {
                        message = errorData.message;
                    }
                } catch {
                    // Response JSON nahi hua to default message use hoga
                }

                throw new Error(message);
            }

            const updatedProfile = await response.json();

            setProfile(updatedProfile);
            setName(updatedProfile.name || "");
            setPhone(updatedProfile.phone || "");

            // Header/localStorage ko bhi latest data se update karo
            localStorage.setItem(
                "user",
                JSON.stringify({
                    id: updatedProfile.id,
                    name: updatedProfile.name,
                    email: updatedProfile.email,
                    role: updatedProfile.role,
                    phone: updatedProfile.phone,
                })
            );

            setSuccess("Profile updated successfully.");
            setIsEditing(false);
        } catch (err) {
            console.error("Update profile error:", err);
            setError(err.message || "Unable to update profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="my-profile-page">
                <div className="profile-loading">
                    Loading profile...
                </div>
            </div>
        );
    }

    if (error && !profile) {
        return (
            <div className="my-profile-page">
                <div className="profile-error">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="my-profile-page">

            <div className="my-profile-container">

                <div className="profile-heading">
                    <h1>My Profile</h1>
                    <p>View and manage your account information</p>
                </div>

                <div className="profile-card">

                    {/* PROFILE HEADER */}
                    <div className="profile-card-header">

                        <div className="profile-avatar">
                            {profile?.name
                                ? profile.name.charAt(0).toUpperCase()
                                : "U"}
                        </div>

                        <div className="profile-header-info">
                            <h2>{profile?.name}</h2>
                            <p>{profile?.email}</p>
                        </div>

                    </div>

                    <div className="profile-divider"></div>

                    {/* SUCCESS MESSAGE */}
                    {success && (
                        <div className="profile-success">
                            {success}
                        </div>
                    )}

                    {/* ERROR MESSAGE */}
                    {error && profile && (
                        <div className="profile-error">
                            {error}
                        </div>
                    )}

                    {/* PROFILE DETAILS */}
                    <div className="profile-details">

                        {/* FULL NAME */}
                        <div className="profile-field">
                            <span className="profile-label">
                                Full Name
                            </span>

                            {isEditing ? (
                                <input
                                    type="text"
                                    className="profile-input"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    placeholder="Enter your full name"
                                />
                            ) : (
                                <span className="profile-value">
                                    {profile?.name || "-"}
                                </span>
                            )}
                        </div>

                        {/* EMAIL */}
                        <div className="profile-field">
                            <span className="profile-label">
                                Email Address
                            </span>

                            <span className="profile-value">
                                {profile?.email || "-"}
                            </span>
                        </div>

                        {/* PHONE */}
                        <div className="profile-field">
                            <span className="profile-label">
                                Phone Number
                            </span>

                            {isEditing ? (
                                <input
                                    type="tel"
                                    className="profile-input"
                                    value={phone}
                                    onChange={(e) =>
                                        setPhone(
                                            e.target.value.replace(
                                                /\D/g,
                                                ""
                                            )
                                        )
                                    }
                                    placeholder="Enter your phone number"
                                    maxLength="15"
                                />
                            ) : (
                                <span className="profile-value">
                                    {profile?.phone || "Not added"}
                                </span>
                            )}
                        </div>

                        {/* ACCOUNT TYPE */}
                        <div className="profile-field">
                            <span className="profile-label">
                                Account Type
                            </span>

                            <span className="profile-value profile-role">
                                {profile?.role || "-"}
                            </span>
                        </div>

                        {/* USER ID */}
                        <div className="profile-field">
                            <span className="profile-label">
                                User ID
                            </span>

                            <span className="profile-value">
                                #{profile?.id}
                            </span>
                        </div>

                    </div>

                    {/* BUTTONS */}
                    <div className="profile-actions">

                        {!isEditing ? (
                            <button
                                type="button"
                                className="edit-profile-btn"
                                onClick={handleEdit}
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    className="cancel-profile-btn"
                                    onClick={handleCancel}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="save-profile-btn"
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>
                            </>
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default MyProfile;