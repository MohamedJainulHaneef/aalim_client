import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faCalendarAlt, faUserAlt, faUserCog } from '@fortawesome/free-solid-svg-icons';
import { useAdd } from '../../../hooks/useAdd';
import { useFetch } from '../../../hooks/useFetch';

const apiUrl = import.meta.env.VITE_API_URL;

function AddModal({ onSuccess, onClose }) {
    const { error: addError, loading: addLoading, addData } = useAdd();
    const [staffName, setStaffName] = useState('');
    const { error: fetchError, loading: fetchLoading, fetchData, data } = useFetch();
    const [formData, setFormData] = useState({
        date: '', absentStaffId: '', replacementStaffId: '', year: '', session: ''
    });
    const [touched, setTouched] = useState({ date: false, year: false, session: false, replacementStaffId: false });
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        fetchData(`${apiUrl}/api/substitution/StaffInfo`);
    }, []);

    useEffect(() => {
        if (formData.date && formData.year && formData.session) {
            fetchSubstitutionStaffId();
        }
    }, [formData.date, formData.year, formData.session]);

    const fetchSubstitutionStaffId = async () => {
        const response = await axios.post(`${apiUrl}/api/substitution/StaffId`, formData);
        setStaffName(response.data);
        setFormData((prevData) => ({ ...prevData, absentStaffId: response.data }));
    };

    const validateField = (name, value) => {
        const errors = {};
        if (!value || (typeof value === 'string' && !value.trim())) {
            errors[name] = `${name === 'date' ? 'Date' : name === 'year' ? 'Year' : name === 'session' ? 'Session' : 'Replacement Staff'} is required`;
        }
        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
        ['date', 'year', 'session', 'replacementStaffId'].forEach((key) => {
            const fieldErrors = validateField(key, formData[key]);
            Object.assign(errors, fieldErrors);
        });

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setTouched({ date: true, year: true, session: true, replacementStaffId: true });
            return;
        }

        const response = await addData(`${apiUrl}/api/substitution/addData`, formData);
        if (response) {
            onSuccess?.();
            onClose?.();
        }
    };

    const formFieldGroups = [
        [
            { name: 'date', label: 'Date', type: 'date', icon: faCalendarAlt },
        ],
        [
            { name: 'year', label: 'Year', type: 'select', icon: faUserAlt, options: ['Select', 'I Year', 'II Year', 'III Year', 'IV Year', 'V Year'] },
            { name: 'session', label: 'Session', type: 'select', icon: faUserAlt, options: ['Select', 'I Hour', 'II Hour'] },
        ],
        [
            { name: 'absentStaffId', label: 'Absent Staff', type: 'text', icon: faUserCog, readOnly: true },
            { name: 'replacementStaffId', label: 'Replacement Staff', type: 'select', icon: faUserCog, options: data ? data.map((detail) => detail.staffId) : [] },
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
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-white text-lg" />
                            </div>
                            <h2 className="text-lg font-bold text-white">Add Substitution</h2>
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
                    {(addError || fetchError) && (
                        <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 rounded-md">
                            <p className="text-red-700 text-sm">{addError || fetchError}</p>
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
                                                    value={field.name === 'absentStaffId' ? staffName || '' : formData[field.name]}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    disabled={field.readOnly || addLoading || fetchLoading}
                                                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 bg-white ${touched[field.name] && fieldErrors[field.name]
                                                        ? 'border-red-300 focus:ring-red-400 focus:border-red-400'
                                                        : 'border-gray-300 focus:ring-blue-400 focus:border-blue-400'}`}
                                                >
                                                    <option value="">Select</option>
                                                    {field.options.map((option) => (
                                                        <option key={option} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type={field.type}
                                                    name={field.name}
                                                    value={field.readOnly ? staffName || '' : formData[field.name]}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    readOnly={field.readOnly}
                                                    disabled={addLoading || fetchLoading}
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
                                disabled={addLoading || fetchLoading}
                                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={addLoading || fetchLoading}
                                className="flex-1 px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {addLoading || fetchLoading ? (
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
                                        Save Substitution
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