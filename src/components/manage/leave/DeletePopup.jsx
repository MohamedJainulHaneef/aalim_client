import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useDelete } from '../../../hooks/useDelete';
const apiUrl = import.meta.env.VITE_API_URL;

function DeletePopup({ onClose, selectedLeave }) 
{
    const { deleteData, loading, error } = useDelete();

    const handleSubmit = async () => {
        const id = selectedLeave;
        const response = await deleteData(`${apiUrl}/api/leave/deleteSubstitution`, id)
        if (response !== null) { alert('Data deleted succesfully'); onClose(); }
    }

    return (
        <div className="p-6 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md space-y-6">
                <div className="text-center">
                    <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 text-2xl mb-2" />
                    <h2 className="text-xl font-semibold text-gray-800">Confirm Deletion</h2>
                    <p className="text-gray-600 mt-2">
                        Are you sure you want to delete this Leave ?
                    </p>
                </div>
                <div className="flex justify-between gap-4">
                    <button
                        onClick={onClose}
                        className="w-1/2 cursor-pointer bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 rounded-md transition"
                    >
                        <FontAwesomeIcon icon={faTimes} className="mr-2" />
                        <span>Cancel</span>
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="w-1/2 cursor-pointer bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-md transition"
                    >
                        <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                        <span>{loading ? 'Deleting' : 'Delete'}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeletePopup;