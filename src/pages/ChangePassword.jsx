import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faShieldAlt, faSpinner, faCheckCircle, faKey, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const apiUrl = import.meta.env.VITE_API_URL;

function ChangePassword() {

    const { staffId } = useParams();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        password: "",
        confirmPassword: "",
    });
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        setForm({
            ...form, [e.target.name]: e.target.value,
        });
        setStatus({ type: '', message: '' });
    };

    const handleSubmit = async () => {
        if (!form.password || !form.confirmPassword) {
            setStatus({ type: 'error', message: 'Both password fields are required!' });
            return;
        }

        if (form.password !== form.confirmPassword) {
            setStatus({ type: 'error', message: 'Passwords do not match!' });
            return;
        }

        const formData = { password: form.password, staffId };
        setLoading(true);
        setStatus({ type: 'info', message: 'Validating security credentials...' });

        try {
            const response = await axios.post(
                `${apiUrl}/api/users/changePassword`,
                formData
            );

            if (response.data.success) {
                setStatus({ type: 'success', message: 'Password updated successfully!' });
                setForm({ password: "", confirmPassword: "" });
            } else {
                setStatus({ type: 'error', message: 'Failed to update password. Please try again.' });
            }
        } catch (error) {
            console.error(error);
            setStatus({ type: 'error', message: 'An error occurred while updating password.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="selection:bg-blue-500 selection:text-white p-3">
            <div className="bg-white rounded-2xl border border-slate-100 w-full max-w-md overflow-hidden transform transition-all">

                {/* Visual Accent Header Banner - Blue Theme */}
                <div className="px-6 pt-8 pb-6 border-b border-slate-50 bg-linear-to-b from-blue-50/50 to-white">
                    <div className="flex items-center justify-center">
                        <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100/50 text-blue-600 shadow-2xs">
                            <FontAwesomeIcon icon={faShieldAlt} className="text-xl" />
                        </div>
                    </div>
                    <h2 className="mt-4 text-center text-xl font-bold text-slate-800 tracking-tight">
                        Security Access Gateway
                    </h2>
                    <p className="mt-1.5 text-center text-xs text-slate-500 max-w-xs mx-auto">
                        Please establish your identity update by setting a secure, cryptographic password entry configuration.
                    </p>
                </div>

                {/* Form Wrapper Body */}
                <div className="p-6 md:p-8 space-y-5">

                    {/* Input Element: New Password */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                            New Password
                        </label>
                        <div className="relative group">
                            <FontAwesomeIcon
                                icon={faLock}
                                className="absolute left-3.5 top-3.5 text-slate-400 text-sm group-focus-within:text-blue-500 transition-colors duration-200"
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••••••"
                                value={form.password}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-sm rounded-lg font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition duration-200 disabled:opacity-60"
                            />
                        </div>
                    </div>

                    {/* Input Element: Confirm Password */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                            Confirm Password
                        </label>
                        <div className="relative group">
                            <FontAwesomeIcon
                                icon={faLock}
                                className="absolute left-3.5 top-3.5 text-slate-400 text-sm group-focus-within:text-blue-500 transition-colors duration-200"
                            />
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="••••••••••••"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-sm rounded-lg font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition duration-200 disabled:opacity-60"
                            />
                        </div>
                    </div>

                    {/* Runtime Status Alerts */}
                    {status.message && (
                        <div className={`p-4 rounded-xl border flex items-start text-sm transition-all animate-fadeIn ${status.type === 'success'
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-200/60'
                            : status.type === 'error'
                                ? 'bg-rose-50 text-rose-900 border-rose-200/60'
                                : 'bg-blue-50 text-blue-900 border-blue-200/60'
                            }`}>
                            <div className="mt-0.5 mr-3 shrink-0">
                                {status.type === 'success' && <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600" />}
                                {status.type === 'error' && <FontAwesomeIcon icon={faTriangleExclamation} className="text-rose-600" />}
                                {status.type === 'info' && <FontAwesomeIcon icon={faSpinner} className="text-blue-600 animate-spin" />}
                            </div>
                            <p className="font-medium tracking-wide">{status.message}</p>
                        </div>
                    )}

                    {/* Action Button Segment - Blue Theme */}
                    <div className="pt-3">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white py-2.5 text-sm font-semibold rounded-lg shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} className="animate-spin text-sm" />
                                    <span>Updating Password...</span>
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-sm opacity-90" />
                                    <span>Update Password</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Security Footer Note */}
                    <div className="pt-2 text-center">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                            <FontAwesomeIcon icon={faShieldAlt} className="mr-1.5" />
                            Secure credential rotation protocol
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ChangePassword;