import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

const apiUrl = import.meta.env.VITE_API_URL;

function ChangePassword() {

    const { staffId } = useParams();

    const [form, setForm] = useState({
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form, [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        
        if (!form.password || !form.confirmPassword) {
            alert("Both fields are required!");
            return;
        }

        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const formData = { password: form.password, staffId };

        try {
            const response = await axios.post(
                `${apiUrl}/api/users/changePassword`,
                formData
            );

            if (response.data.success) {
                alert("Password changed successfully!");
                setForm({ password: "", confirmPassword: "" });
            } else {
                alert("Failed to change password. Try again.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while changing password.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10">

            <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl border border-gray-200">

                <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6 tracking-wide">
                    Change Password
                </h2>

                <p className="text-center text-gray-600 mb-8">
                    Update your account password below.
                </p>

                <div className="grid grid-cols-1 gap-7">

                    {/* New Password */}
                    <div className="relative">
                        <FontAwesomeIcon
                            icon={faLock}
                            className="absolute left-4 top-4 text-gray-500 text-lg"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter New Password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <FontAwesomeIcon
                            icon={faLock}
                            className="absolute left-4 top-4 text-gray-500 text-lg"
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm New Password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                    </div>
                </div>

                <div className="flex justify-center mt-10">
                    <button
                        onClick={handleSubmit}
                        className="w-[180px] bg-blue-600 text-white py-3 font-semibold rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-xl active:scale-95 transition-all"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;