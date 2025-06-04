import React from 'react';
import Button from '../../components/common/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrash } from '@fortawesome/free-solid-svg-icons';

function Leave() 
{
    const buttonObject = {name: "Save", icon: faSave, design:"bg-blue-500 hover:bg-blue-600 w-full"};
    
    return (
        <div className="p-8 min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-8">
                <h2 className="text-lg font-semibold text-blue-700 mb-4 text-center border-b pb-2">Leave Management</h2>
                <div className="space-y-6 mt-8">
                    <div className='space-y-2.5'>
                        <label className="block text-sm font-medium text-gray-600">From Date</label>
                        <input
                            type="date"
                            className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                    </div>
                    <div className="space-y-2.5">
                        <label className="block text-sm font-medium text-gray-600">To Date</label>
                        <input
                            type="date"
                            className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                    </div>
                </div>
                <Button buttonObject={buttonObject}/>
            </div>
        </div>
    )
}

export default Leave;
