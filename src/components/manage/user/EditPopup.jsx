import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useEdit } from '../../../hooks/useEdit';

function EditPopup({ onClose, selectedUser }) 
{
    const [formData, setFormData] = useState({ staffId: '', fullName: '', password: '' });

    useEffect(() => {
        if (selectedUser) {
            setFormData({
                staffId: selectedUser.staffId,
                fullName: selectedUser.fullName,
                password: selectedUser.password
            })
        }
    }, [selectedUser]);

    const { editData, loading, error } = useEdit()

    const handleChange = async (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }) }

    const handleSubmit = async () => {
        if (!formData.staffId || !formData.fullName || !formData.password) return alert('Fill all the fields');
        const data = await editData('http://localhost:5000/api/users/editStaff', formData);
        if (data !== null) { alert('Data updated sucessfully'); onClose() }
    }

    return (
        <div className="p-6 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
                <h2 className="text-lg font-semibold text-blue-700 mb-4 text-center border-b pb-2">Edit User</h2>
                {error && <span className='text-red-600 mb-4 block'>{error}</span>}
                <div className="space-y-3 mt-4">
                    <label className="block text-sm text-gray-600 uppercase font-semibold">User Id :</label>
                    <input 
                        type="text" name="staffId"
                        value={formData.staffId}
                        readOnly autoComplete='off'
                        className="p-2 mb-5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <label className="block text-sm text-gray-600 uppercase font-semibold">Full Name :</label>
                    <input
                        type="text" name="fullName"
                        autoComplete='off'
                        value={formData.fullName}
                        onChange={handleChange}
                        className="p-2 mb-5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <label className="block text-sm text-gray-600 uppercase font-semibold">Password : </label>
                    <input
                        type="text" name="password"
                        autoComplete='off'
                        value={formData.password}
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