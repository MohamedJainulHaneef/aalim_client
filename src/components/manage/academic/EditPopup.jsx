import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useEdit } from '../../../hooks/useEdit';
const apiUrl = import.meta.env.VITE_API_URL;

function EditPopup({ onClose, selectedAcademic }) 
{
    const [formData, setFormData] = useState({ _id: '',academicFromDate: '', academicToDate: '', year: '', semester: '' });

    useEffect(() => {
        if (selectedAcademic) {
            setFormData({
                _id: selectedAcademic._id,
                academicFromDate: selectedAcademic.academicFromDate,
                academicToDate: selectedAcademic.academicToDate,
                year: selectedAcademic.year,
                semester: selectedAcademic.semester,
            })
        }
    }, [selectedAcademic]);

    const formatDateForInput = (dateStr) => {
        return dateStr ? new Date(dateStr).toISOString().split('T')[0] : '';
    };

    const { editData, loading, error } = useEdit()

    const handleChange = async (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }) }

    const handleSubmit = async () => {
        if (!formData.academicFromDate || !formData.academicToDate) return alert('Fill all the fields');
        const data = await editData(`${apiUrl}/api/academic/academicEdit`, formData);
        if (data !== null) { alert('Data updated sucessfully'); onClose() }
    }

    return (
        <div className="p-6 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
                <h2 className="text-lg font-semibold text-blue-700 mb-4 text-center border-b pb-2">Edit Academic</h2>
                {error && <span className='text-red-600 mb-4 block'>{error}</span>}
                <div className="space-y-3 mt-4">
                    <label className="block text-sm text-gray-600 uppercase font-semibold">From Date :</label>
                    <input
                        type="date" name="academicFromDate"
                        value={formatDateForInput(formData.academicFromDate)}
                        onChange={handleChange}
                        autoComplete='off'
                        className="p-2 mb-5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <label className="block text-sm text-gray-600 uppercase font-semibold">To Date :</label>
                    <input
                        type="date" name="academicToDate"
                        value={formatDateForInput(formData.academicToDate)}
                        onChange={handleChange}
                        autoComplete='off'
                        className="p-2 mb-5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <label className="block text-sm text-gray-600 uppercase font-semibold">Academic Year :</label>
                    <input
                        type="text" name="year"
                        value={formData.year}
                        onChange={handleChange}
                        autoComplete='off'
                        className="p-2 mb-5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <label className="block text-sm text-gray-600 uppercase font-semibold">Semester :</label>
                    <select
                        value={formData.semester}
                        name="semester"
                        onChange={handleChange}
                        className="w-full p-2 h-10 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    >
                        <option value="">Select</option>
                        <option value="Odd Semester">Odd Semester</option>
                        <option value="Even Semester">Even Semester</option>

                    </select>
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