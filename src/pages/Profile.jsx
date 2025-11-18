import { useEffect, useState } from "react";
import UsersApi from "../apis/users";
import { getStoredUser } from "../context/AuthContext";


export default function Profile() {
    const userId = JSON.parse(getStoredUser());

    const [profileForm, setProfileForm] = useState({
        name: "",
        email: "",
        roleId: "",
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    const [loadingProfile, setLoadingProfile] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    const [profileMessage, setProfileMessage] = useState(null); // { type: "success" | "error", text: string }
    const [passwordMessage, setPasswordMessage] = useState(null);


    //Initail fetch of profile data
    useEffect(() => {
        async function fetchProfile() {
            try {

                setLoadingProfile(true);
                setProfileMessage(null);

                const response = await UsersApi.getById(userId);

                console.log("Fetched profile data:", response);

                //Adjust field names if your backend is different
                setProfileForm({
                    name: response.name ?? "",
                    email: response.email ?? "",
                    roleId: response.roleId ?? "",
                });


            } catch (err) {
                setProfileMessage({ type: "error", text: "Could not load profile data." });
            } finally {
                setLoadingProfile(false);
            }
        }

        fetchProfile();
    }, [userId]);


    function handleProfileChange(e) {
        const { name, value } = e.target;
        setProfileForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        console.log("Profile form set to:", profileForm);

    }

    function handlePasswordChange(e) {
        const { name, value } = e.target;
        setPasswordForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleProfileSubmit(e) {
        e.preventDefault();
        setProfileMessage(null);
        setSavingProfile(true);

        try {
            const response = await UsersApi.update(userId, profileForm);

            setProfileMessage({
                type: "success",
                text: "Profile updated successfully.",
            });
        } catch (err) {
            setProfileMessage({
                type: "error",
                text: "Something went wrong while updating your profile.",
            });
        } finally {
            setSavingProfile(false);
        }
    }

    async function handlePasswordSubmit(e) {
        e.preventDefault();
        setPasswordMessage(null);

        if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
            setPasswordMessage({
                type: "error",
                text: "New password and confirmation do not match.",
            });
            return;
        }

        setSavingPassword(true);

        try {
            const response = await fetch(`${API_BASE_URL}/users/me/password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword,
                }),
            });

            if (!response.ok) {
                if (response.status === 400 || response.status === 401) {
                    setPasswordMessage({
                        type: "error",
                        text: "Current password is incorrect.",
                    });
                    setSavingPassword(false);
                    return;
                }
                throw new Error("Failed to change password");
            }

            setPasswordMessage({
                type: "success",
                text: "Password changed successfully.",
            });

            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: "",
            });
        } catch (err) {
            setPasswordMessage({
                type: "error",
                text: "Something went wrong while changing your password.",
            });
        } finally {
            setSavingPassword(false);
        }
    }

    return (
        <div className="min-h-screen flex justify-center px-4">
            <div className="w-full max-w-3xl space-y-8">
                <header className="pb-2 mb-4">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Account settings
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage your personal information and password.
                    </p>
                </header>

                {/* Profile section */}
                <section className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-medium text-gray-900">
                                Personal information
                            </h2>
                            <p className="text-sm text-gray-500">
                                Update your name and email address.
                            </p>
                        </div>
                    </div>

                    {profileMessage && (
                        <div
                            className={`mb-4 rounded-lg px-4 py-2 text-sm ${profileMessage.type === "success"
                                ? "bg-green-50 text-green-800 border border-green-200"
                                : "bg-red-50 text-red-800 border border-red-200"
                                }`}
                        >
                            {profileMessage.text}
                        </div>
                    )}

                    {/* First Form */}
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="given-name"
                                    value={profileForm.name}
                                    onChange={handleProfileChange}
                                    disabled={loadingProfile || savingProfile}
                                    className="form-input"
                                />
                            </div>

                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={profileForm.email}
                                onChange={handleProfileChange}
                                disabled={loadingProfile || savingProfile}
                                className="form-input"
                            />
                        </div>

                        <div className="flex items-center justify-end pt-2">
                            <button
                                type="submit"
                                disabled={loadingProfile || savingProfile}
                                className="btn-save"
                            >
                                {savingProfile ? "Saving..." : "Save changes"}
                            </button>
                        </div>
                    </form>
                </section>

                {/* Password section */}
                <section className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-medium text-gray-900">
                                Change password
                            </h2>
                            <p className="text-sm text-gray-500">
                                Use a strong password that you don’t reuse elsewhere.
                            </p>
                        </div>
                    </div>

                    {passwordMessage && (
                        <div
                            className={`mb-4 rounded-lg px-4 py-2 text-sm ${passwordMessage.type === "success"
                                ? "bg-green-50 text-green-800 border border-green-200"
                                : "bg-red-50 text-red-800 border border-red-200"
                                }`}
                        >
                            {passwordMessage.text}
                        </div>
                    )}

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="currentPassword"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Current password
                            </label>
                            <input
                                id="currentPassword"
                                name="currentPassword"
                                type="password"
                                autoComplete="current-password"
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordChange}
                                disabled={savingPassword}
                                className="form-input"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="newPassword"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    New password
                                </label>
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordChange}
                                    disabled={savingPassword}
                                    className="form-input"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="confirmNewPassword"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Confirm new password
                                </label>
                                <input
                                    id="confirmNewPassword"
                                    name="confirmNewPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    value={passwordForm.confirmNewPassword}
                                    onChange={handlePasswordChange}
                                    disabled={savingPassword}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end pt-2">
                            <button
                                type="submit"
                                disabled={savingPassword}
                                className="btn-save"
                            >
                                {savingPassword ? "Saving..." : "Update password"}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}
