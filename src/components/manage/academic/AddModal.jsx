import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faCalendarAlt, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { useAdd } from '../../../hooks/useAdd';
const apiUrl = import.meta.env.VITE_API_URL;

function AddModal({ onSuccess, onClose }) {

    const { error, loading, addData } = useAdd();
    const [data, setData] = useState({ academicFromDate: '', academicToDate: '', year: '', semester: '' });
    const [touched, setTouched] = useState({ academicFromDate: false, academicToDate: false, year: false, semester: false });
    const [fieldErrors, setFieldErrors] = useState({});

    const validateField = (name, value) => {
        const errors = {};
        if (!value || (typeof value === 'string' && !value.trim())) {
            errors[name] = `${name === 'academicFromDate' ? 'From Date' : name === 'academicToDate' ? 'To Date' : name === 'year' ? 'Year' : 'Semester'} is required`;
        }
        if (name === 'academicToDate' && data.academicFromDate && value && new Date(value) < new Date(data.academicFromDate)) {
            errors[name] = 'To Date cannot be earlier than From Date';
        }
        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
        if (touched[name]) {
            const errors = validateField(name, value);
            setFieldErrors((prev) => ({ ...prev, ...errors }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        const errors = validateField(name, value);
        setFieldErrors((prev) => ({ ...prev, ...errors }));
    };

    const handleSave = async () => {
        const errors = {};
        Object.keys(data).forEach((key) => {
            const fieldErrors = validateField(key, data[key]);
            Object.assign(errors, fieldErrors);
        });

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setTouched({ academicFromDate: true, academicToDate: true, year: true, semester: true });
            return;
        }

        const response = await addData(`${apiUrl}/api/academic/addData`, data);
        if (response) {
            onSuccess?.();
            onClose?.();
        }
    };

    const formFieldGroups = [
        [
            { name: 'academicFromDate', label: 'From Date', type: 'date', icon: faCalendarAlt },
            { name: 'academicToDate', label: 'To Date', type: 'date', icon: faCalendarAlt },
        ],
        [
            { name: 'year', label: 'Academic Year', type: 'text', placeholder: 'Example: 2024-2025', icon: faGraduationCap },
            { name: 'semester', label: 'Semester', type: 'select', icon: faGraduationCap, options: ['Select', 'Odd Semester', 'Even Semester'] },
        ],
    ];

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={(e) => e.target === e.currentTarget && onClose?.()}
        >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden transform transition-all">
                <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <FontAwesomeIcon icon={faGraduationCap} className="text-white text-lg" />
                            </div>
                            <h2 className="text-lg font-bold text-white">Add Academic</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/20"
                        >
                            <FontAwesomeIcon icon={faTimes} className="text-lg" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 rounded-md">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="space-y-5">
                        {formFieldGroups.map((group, groupIndex) => (
                            <div key={groupIndex} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {group.map((field) => (
                                    <div key={field.name}>
                                        <label className="block text-sm font-medium text-slate-600 mb-1.5">{field.label}</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FontAwesomeIcon icon={field.icon} className="text-gray-400" />
                                            </div>
                                            {field.type === 'select' ? (
                                                <select
                                                    name={field.name}
                                                    value={data[field.name]}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    disabled={loading}
                                                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 bg-white ${touched[field.name] && fieldErrors[field.name]
                                                        ? 'border-red-300 focus:ring-red-400 focus:border-red-400'
                                                        : 'border-gray-300 focus:ring-blue-400 focus:border-blue-400'}`}
                                                >
                                                    {field.options.map((option) => (
                                                        <option key={option} value={option === 'Select' ? '' : option}>{option}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type={field.type}
                                                    name={field.name}
                                                    value={data[field.name]}
                                                    placeholder={field.placeholder}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    disabled={loading}
                                                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${touched[field.name] && fieldErrors[field.name]
                                                        ? 'border-red-300 focus:ring-red-400 focus:border-red-400'
                                                        : 'border-gray-300 focus:ring-blue-400 focus:border-blue-400'}`}
                                                />
                                            )}
                                        </div>
                                        {touched[field.name] && fieldErrors[field.name] && (
                                            <p className="mt-2 text-sm text-red-600">{fieldErrors[field.name]}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}

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
                                onClick={handleSave}
                                disabled={loading}
                                className="flex-1 px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                                        Save Academic
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddModal;