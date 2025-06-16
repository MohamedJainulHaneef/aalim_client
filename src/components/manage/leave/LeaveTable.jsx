import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useFetch } from '../../../hooks/useFetch';
import EditPopup from './EditPopup';
import DeletePopup from './DeletePopup';
const apiUrl = import.meta.env.VITE_API_URL;

function LeaveTable() 
{
    const { fetchData, loading, error, data } = useFetch();

    const [isEditPopupOpen, setIsEditModalOpen] = useState(false);
    const [isDeletePopupOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);

    const handleEdit = async (details) => {
        setIsEditModalOpen(true);
        setSelectedLeave(details);
    }

    const handleDelete = async (id) => {
        setIsDeleteModalOpen(true);
        setSelectedLeave(id);
    }

    useEffect(() => { fetchData(`${apiUrl}/api/leave/leaveInfo`) }, []);

    return (
        <>
            {loading && (
                <div className="text-center py-4 text-blue-600 font-semibold"> Loading Leaves ... </div>
            )}
            {error && (
                <div className="text-center py-4 text-red-500 font-semibold"> Error : {error} </div>
            )}
            {!loading && !error && (
                <table className="text-center w-full bg-white rounded shadow-md border border-gray-300 border-collapse">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="px-4 py-2 border border-gray-300 whitespace-nowrap">From Date</th>
                            <th className="px-4 py-2 border border-gray-300 whitespace-nowrap">To Date</th>
                            <th className="px-4 py-2 border border-gray-300 whitespace-nowrap">Reason</th>
                            <th colSpan={2} className="px-4 py-2 border border-gray-300">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((details, index) => {
                                const formatDate = (dateString) => {
                                    const date = new Date(dateString);
                                    const day = String(date.getDate()).padStart(2, '0');
                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                    const year = date.getFullYear();
                                    return `${day}-${month}-${year}`;
                                }
                                return (
                                    <tr key={index} className="border">
                                        <td className="px-2 py-2 border border-gray-300 whitespace-nowrap">
                                            {formatDate(details.leaveFromDate)}
                                        </td>
                                        <td className="px-2 py-2 border border-gray-300 whitespace-nowrap">
                                            {formatDate(details.leaveToDate)}
                                        </td>
                                        <td className="px-2 py-2 border border-gray-300 whitespace-nowrap">{details.reason}</td>
                                        <td className="border border-gray-300 w-[15%] py-2 px-2 whitespace-nowrap">
                                            <button
                                                onClick={() => handleEdit(details)}
                                                className="cursor-pointer bg-blue-500 text-white w-full p-2 flex items-center rounded justify-center"
                                            >
                                                <FontAwesomeIcon icon={faEdit} className="mr-2" /> <span>Edit</span>
                                            </button>
                                        </td>
                                        <td className="border border-gray-300 w-[15%] py-2 px-2 whitespace-nowrap">
                                            <button
                                                onClick={() => handleDelete(details._id)}
                                                className="cursor-pointer bg-red-500 text-white w-full p-2 flex items-center rounded justify-center"
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="mr-2" /> <span>Delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={5} className="py-4 text-gray-500 text-center">No leave found.</td>
                            </tr>
                        )}
                    </tbody>

                </table>
            )}
            {isEditPopupOpen && <EditPopup
                onClose={() => { setIsEditModalOpen(false); fetchData(`${apiUrl}/api/leave/leaveInfo`) }}
                selectedLeave={selectedLeave}
            />}
            {isDeletePopupOpen && <DeletePopup
                onClose={() => { setIsDeleteModalOpen(false); fetchData(`${apiUrl}/api/leave/leaveInfo`) }}
                selectedLeave={selectedLeave} 
            />}
        </>
    )
}

export default LeaveTable;