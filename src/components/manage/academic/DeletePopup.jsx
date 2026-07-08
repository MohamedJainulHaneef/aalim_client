import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useDelete } from '../../../hooks/useDelete';
const apiUrl = import.meta.env.VITE_API_URL;

function DeletePopup({ onClose, selectedAcademic }) {

    const { deleteData, loading } = useDelete();

    const handleSubmit = async () => {
        const response = await deleteData(`${apiUrl}/api/academic/deleteAcademic`, selectedAcademic);
        if (response !== null) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={(e) => e.target === e.currentTarget && onClose?.()}
        >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all">
                <div className="px-6 py-5 border-b border-slate-100">
                    <div className="flex items-center justify-center">
                        <div className="bg-red-50 p-3 rounded-full">
                            <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 text-xl" />
                        </div>
                    </div>
                    <h2 className="mt-4 text-center text-lg font-bold text-slate-800">Confirm Deletion</h2>
                    <p className="mt-2 text-center text-sm text-slate-500">
                        Are you sure you want to delete this academic record?
                    </p>
                </div>

                <div className="p-6">
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FontAwesomeIcon icon={faTimes} className="mr-2" />
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                            {loading ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeletePopup;