import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faClose } from '@fortawesome/free-solid-svg-icons';
import { useAdd } from '../../../hooks/useAdd';
const apiUrl = import.meta.env.VITE_API_URL;

function AddPopup({ onSuccess }) 
{
    const [formData, setFormData] = useState({ staffId: '', fullName: '', password: '' });

    const Url = `${apiUrl}/api/users/addStaff`

    const { addData, loading, error } = useAdd(); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        if (!formData.staffId || !formData.fullName || !formData.password) {
            alert('Fill all the fields'); return false;
        }
        const data = await addData(Url, formData);
        if (data) { alert('User Added Sucessfully'); onSuccess() }
    } 

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl w-full mt-1 mb-4">
            <h2 className="text-xl font-semibold text-blue-700 text-center border-b pb-3 mb-6">Add New User</h2>
            {error && <span className='text-red-600 mb-6 block'>{error}</span>}
            <div className="grid grid-cols-1 gap-6">
                <input
                    autoComplete='off'
                    type="text"
                    value={formData.staffId} 
                    name='staffId'
                    placeholder="User Id"
                    onChange={handleChange}
                    className="p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    autoComplete='off'
                    type="text"
                    value={formData.fullName}
                    placeholder="Full Name"
                    name='fullName'
                    onChange={handleChange}
                    className="p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    autoComplete='off'
                    type="password"
                    value={formData.password}
                    name='password'
                    placeholder="Password"
                    onChange={handleChange}
                    className="p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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