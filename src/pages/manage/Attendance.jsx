import React, { useState } from "react";
import {useParams } from 'react-router-dom'
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

function ChangePassword() {

    const { staffId } = useParams();

    const [form, setForm] = useState({
        password: "",
        confirmPassword: ""
    });


    const handleChange = (e) => {
        setForm({
            ...form, [e.target.name]: e.target.value
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
            const response = await axios.post(`${apiUrl}/api/users/changePassword`, formData);

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
    }

    return (
        <div className="bg-white p-6 space-y-3">

            <h2 className="text-2xl font-bold text-center mb-5">Change Password</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <input
                    type="password"
                    name="password"
                    placeholder="Enter New Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />

                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <button
                onClick={handleSubmit}
                className="w-[150px] bg-blue-600 text-white py-2 font-semibold rounded-lg hover:bg-blue-700 active:scale-95 transition"
            >
                Submit
            </button>
        </div>
    );
}

export default ChangePassword;