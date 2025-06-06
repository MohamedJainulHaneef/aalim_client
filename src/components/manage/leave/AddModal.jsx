import React from 'react';
import Button from '../../common/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faClose } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useAdd } from '../../../hooks/useAdd';
const apiUrl = import.meta.env.VITE_API_URL;

function AddModal({ onSuccess }) 
{
    const { error, loading, addData } = useAdd();

    const buttonObject1 = { name: "Cancel", icon: faClose, design: "bg-gray-400 hover:bg-gray-500 w-full" };
    const buttonObject2 = { name: loading ? 'Saving' : 'Save', icon: faSave, design: "bg-blue-500 hover:bg-blue-600 w-full" };

    const [data, setData] = useState({ leaveFromDate: '', leaveToDate: ''});

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const handleSave = async () => {
        if (!data.leaveFromDate || !data.leaveToDate) { return alert('Fill all the fields') }
        const response = await addData(`${apiUrl}/api/leave/addData`, data);
        if (response) { alert("Leave Added Successfully"); onSuccess() }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl w-full mt-1 space-y-4">
            <h2 className="text-xl font-semibold text-blue-700 text-center border-b pb-3">Leave Management</h2>
            {error && <span className='text-red-600 mb-5 block'>{error}</span>}
            <div className="grid grid-cols-1 gap-4">
                <div className='space-y-2.5'>
                    <label className="block text-sm font-medium text-gray-600">From Date</label>
                    <input
                        type="date"
                        name='leaveFromDate'
                        onChange={handleChange}
                        value={data.leaveFromDate}
                        className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                </div>
                <div className="space-y-2.5">
                    <label className="block text-sm font-medium text-gray-600">To Date</label>
                    <input
                        type="date"
                        name='leaveToDate'
                        onChange={handleChange}
                        value={data.leaveToDate}
                        className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                </div>
                <div className='flex justify-between gap-5 mt-3'>
                    <Button buttonObject={buttonObject1} />
                    <Button buttonObject={buttonObject2} onClick={handleSave} />
                </div>
            </div>
        </div>
    )
}

export default AddModal;