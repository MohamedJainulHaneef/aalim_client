import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useEdit } from '../../../hooks/useEdit';
const apiUrl = import.meta.env.VITE_API_URL;

function EditPopup({ onClose, selectedLeave }) 
{
    const [formData, setFormData] = useState({ _id: '',leaveFromDate: '', leaveToDate: '', reason: '' });

    useEffect(() => {
        if (selectedLeave) {
            setFormData({
                _id: selectedLeave._id,
                leaveFromDate: selectedLeave.leaveFromDate,
                leaveToDate: selectedLeave.leaveToDate,
                reason: selectedLeave.reason
            })
        }
    }, [selectedLeave]);

    const formatDateForInput = (dateStr) => {
        return dateStr ? new Date(dateStr).toISOString().split('T')[0] : '';
    };

    const { editData, loading, error } = useEdit()

    const handleChange = async (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }) }

    const handleSubmit = async () => {
        if (!formData.leaveFromDate || !formData.leaveToDate || !formData.reason) return alert('Fill all the fields');
        const data = await editData(`${apiUrl}/api/leave/leaveEdit`, formData);
        if (data !== null) { alert('Data updated sucessfully'); onClose() }
    }

    return (
        <div className="p-6 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
                <h2 className="text-lg font-semibold text-blue-700 mb-4 text-center border-b pb-2">Edit Leave</h2>
                {error && <span className='text-red-600 mb-4 block'>{error}</span>}
                <div className="space-y-3 mt-4">
                    <label className="block text-sm text-gray-600 uppercase font-semibold">From Date :</label>
                    <input
                        type="date" name="leaveFromDate"
                        value={formatDateForInput(formData.leaveFromDate)}
                        onChange={handleChange}
                        autoComplete='off'
                        className="p-2 mb-5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <label className="block text-sm text-gray-600 uppercase font-semibold">To Date :</label>
                    <input
                        type="date" name="leaveToDate"
                        value={formatDateForInput(formData.leaveToDate)}
                        onChange={handleChange}
                        autoComplete='off'
                        className="p-2 mb-5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <label className="block text-sm text-gray-600 uppercase font-semibold">Reason : </label>
                    <input
                        type="text" name="reason"
                        autoComplete='off'
                        value={formData.reason}
                        onChange={handleChange}
                        className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="flex justify-between gap-4 pt-3">
                    <button
                        onClick={onClose}
                        className="w-1/2 cursor-pointer bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 rounded-md transition duration-200"
                    >
                        <FontAwesomeIcon icon={faTimes} className="mr-2" />
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-1/2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
                    >
                        <FontAwesomeIcon icon={faSave} className="mr-2" />
                        {loading ? 'Saving' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditPopup;