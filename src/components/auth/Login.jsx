import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../hooks/useAuth';

const LoginForm = () => {

    const navigate = useNavigate();
    const { loginUser, error, loading } = useAuth();
    const [staffId, setStaffId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const passwordRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!staffId || !password) {
            alert('User Id and Password must be filled.');
            return;
        }
        const data = await loginUser(staffId, password);
        if (data) navigate(`/layout/${staffId}/home`);
    };

    return (
        <div className="min-h-screen flex flex-col justify-center bg-linear-to-br from-cyan-500 via-blue-500 to-indigo-700 px-6 py-12 lg:px-8 items-center gap-8 selection:bg-indigo-500 selection:text-white">

            {/* Header / Department Info */}
            <div className="text-center text-white/90 max-w-md tracking-wide space-y-1">
                <p className="text-sm font-bold tracking-wider sm:text-base lg:text-lg text-white">
                    PG & RESEARCH DEPARTMENT OF ARABIC
                </p>
                <p className="text-sm font-semibold text-white sm:text-base lg:text-md">
                    JAMAL MOHAMED COLLEGE ( AUTONOMOUS )
                </p>
                <p className="text-xs font-medium tracking-wide text-white sm:text-sm">
                    TIRUCHIRAPPALLI - 620 020.
                </p>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md rounded-2xl shadow-2xl border border-white/10 text-slate-800 bg-white/95 backdrop-blur-md py-8 px-6 sm:px-10 transition-all duration-300">

                <h1 className="text-lg font-extrabold text-center tracking-tight text-slate-900 mb-2 sm:text-xl">
                    AALIM SANAD ATTENDANCE
                </h1>

                <p className="text-xs text-slate-500 text-center mb-8 sm:text-sm">
                    Enter your credentials to access the platform.
                </p>

                {error && (
                    <div className="bg-red-100 text-red-600 text-xs font-semibold sm:text-sm p-3 rounded-lg mb-6 border border-red-200 animate-pulse">
                        {error}
                    </div>
                )}

                {/* Wrapped inside a semantic HTML form element */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Username Field */}
                    <div className="relative flex items-center border-b border-slate-300 focus-within:border-indigo-600 transition-colors duration-200 pb-2">
                        <FontAwesomeIcon icon={faUser} className="text-slate-400 mr-3 text-sm sm:text-base" />
                        <input
                            type="text"
                            className="w-full bg-transparent outline-none placeholder:text-slate-400 text-slate-900 text-sm sm:text-base pr-8"
                            placeholder="Username"
                            value={staffId}
                            onChange={(e) => setStaffId(e.target.value.toUpperCase())}
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div className="relative flex items-center border-b border-slate-300 focus-within:border-indigo-600 transition-colors duration-200 pb-2">
                        <FontAwesomeIcon icon={faLock} className="text-slate-400 mr-3 text-sm sm:text-base" />
                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full bg-transparent outline-none placeholder:text-slate-400 text-slate-900 text-sm sm:text-base pr-8"
                            placeholder="Password"
                            ref={passwordRef}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            tabIndex="-1"
                            className="absolute right-1 text-slate-400 hover:text-indigo-600 transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full text-white h-10 sm:h-11 bg-orange-500 hover:bg-orange-600 active:scale-[0.99] disabled:bg-slate-400 font-semibold rounded-lg flex items-center justify-center transition-all duration-200 mt-8"
                    >
                        <FontAwesomeIcon icon={faLock} className="mr-2 text-xs sm:text-sm" />
                        <span className="text-xs sm:text-sm tracking-wider uppercase font-medium">
                            {loading ? "Logging In..." : "Login"}
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;