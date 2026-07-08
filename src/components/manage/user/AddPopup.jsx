import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faUserPlus, faUser, faLock, faIdBadge } from '@fortawesome/free-solid-svg-icons';
import { useAdd } from '../../../hooks/useAdd';
const apiUrl = import.meta.env.VITE_API_URL;

function AddPopup({ onSuccess, onClose }) {

    const [formData, setFormData] = useState({ staffId: '', fullName: '', password: '' });
    const [touched, setTouched] = useState({ staffId: false, fullName: false, password: false });
    const [fieldErrors, setFieldErrors] = useState({});
    const Url = `${apiUrl}/api/users/addStaff`;
    const { addData, loading, error } = useAdd();

    const validateField = (name, value) => {
        const errors = {};
        if (!value.trim()) {
            errors[name] = `${name === 'staffId' ? 'Staff ID' : name === 'fullName' ? 'Full Name' : 'Password'} is required`;
        } else if (name === 'staffId' && value.length < 3) {
            errors[name] = 'Staff ID must be at least 3 characters';
        } else if (name === 'password' && value.length < 6) {
            errors[name] = 'Password must be at least 6 characters';
        }
        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (touched[name]) {
            const errors = validateField(name, value);
            setFieldErrors(prev => ({ ...prev, ...errors }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        const errors = validateField(name, value);
        setFieldErrors(prev => ({ ...prev, ...errors }));
    };

    const handleSubmit = async () => {
        const errors = {};
        Object.keys(formData).forEach(key => {
            const fieldErrors = validateField(key, formData[key]);
            Object.assign(errors, fieldErrors);
        });

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setTouched({ staffId: true, fullName: true, password: true });
            return;
        }

        const data = await addData(Url, formData);
        if (data) {
            onSuccess?.();
            onClose?.();
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
        if (e.key === 'Escape') {
            onClose?.();
        }
    };

    const inputFields = [
        {
            name: 'staffId',
            type: 'text',
            placeholder: 'Staff ID',
            icon: faIdBadge,
            autoComplete: 'off'
        },
        {
            name: 'fullName',
            type: 'text',
            placeholder: 'Full Name',
            icon: faUser,
            autoComplete: 'off'
        },
        {
            name: 'password',
            type: 'password',
            placeholder: 'Password',
            icon: faLock,
            autoComplete: 'off'
        }
    ];

    return (
        <div
            className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
            onClick={(e) => e.target === e.currentTarget && onClose?.()}
        >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all">
                {/* Header */}
                <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <FontAwesomeIcon icon={faUserPlus} className="text-white text-lg" />
                            </div>
                            <h2 className="text-lg font-bold text-white">Add New User</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/20"
                        >
                            <FontAwesomeIcon icon={faTimes} className="text-lg" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    {/* Error Alert */}
                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 rounded-md">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <form onKeyDown={handleKeyPress} className="space-y-5">
                        {inputFields.map((field) => (
                            <div key={field.name}>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FontAwesomeIcon
                                            icon={field.icon}
                                            className={`text-gray-400`}
                                        />
                                    </div>
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={formData[field.name]}
                                        placeholder={field.placeholder}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        autoComplete={field.autoComplete}
                                        className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200
                                            ${touched[field.name] && fieldErrors[field.name]
                                                ? 'border-red-300 focus:ring-red-400 focus:border-red-400'
                                                : 'border-gray-300 focus:ring-blue-400 focus:border-blue-400'
                                            }`}
                                        disabled={loading}
                                    />
                                </div>
                                {touched[field.name] && fieldErrors[field.name] && (
                                    <p className="mt-2 text-sm text-red-600 animate-fadeIn">
                                        {fieldErrors[field.name]}
                                    </p>
                                )}
                            </div>
                        ))}

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faSave} className="mr-2" />
                                        Save User
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddPopup;