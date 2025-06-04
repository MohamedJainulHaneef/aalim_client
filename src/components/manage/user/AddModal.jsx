import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faClose } from '@fortawesome/free-solid-svg-icons';
import { useAdd } from '../../../hooks/useAdd';

function AddPopup({ onSuccess }) 
{
    const [formData, setFormData] = useState({ staffId: '', fullName: '', password: '' });

    const apiUrl = 'http://localhost:5000/api/users/addStaff'

    const { addData, loading, error } = useAdd(); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        if (!formData.staffId || !formData.fullName || !formData.password) {
            alert('Fill all the fields'); return false;
        }
        const data = await addData(formData, apiUrl);
        if (data) {
            alert('User Added Sucessfully'); onSuccess();
        }
    } 

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl w-full mt-2 mb-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">Add New User</h2>
            {error && <span className='text-red-600 mb-5 block'>{error}</span>}
            <div className="grid grid-cols-1 gap-4">
                <input
                    autoComplete='off'
                    type="text"
                    value={formData.staffId}
                    name='staffId'
                    placeholder="User Id"
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    autoComplete='off'
                    type="text"
                    value={formData.fullName}
                    placeholder="Full Name"
                    name='fullName'
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    autoComplete='off'
                    type="password"
                    value={formData.password}
                    name='password'
                    placeholder="Password"
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <div className='flex justify-between gap-5'>
                    <button onClick={onSuccess}
                        className="mt-2 w-full bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 rounded-md transition">
                        <FontAwesomeIcon icon={faClose} className='mr-2' />
                        <span>Cancel</span>
                    </button>
                    <button onClick={handleSubmit}
                        className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition">
                        <FontAwesomeIcon icon={faSave} className='mr-2' />
                        <span>{loading ? 'Saving' : 'Save'}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddPopup;