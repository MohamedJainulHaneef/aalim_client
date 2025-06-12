import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useFetch } from '../../../hooks/useFetch';
import DeletePopup from './DeletePopup';
const apiUrl = import.meta.env.VITE_API_URL;

function LeaveTable() 
{
    const { fetchData, loading, error, data } = useFetch();

    const [isDeletePopupOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSubstitution, setSelectedSubstitution] = useState(null);

    const handleDelete = async (id) => {
        setIsDeleteModalOpen(true);
        setSelectedSubstitution(id);
    }

    useEffect(() => { fetchData(`${apiUrl}/api/substitution/substitutionInfo`) }, []);

    return (
        <>
            {loading && (
                <div className="text-center py-4 text-blue-600 font-semibold"> Loading users ... </div>
            )}
            {error && (
                <div className="text-center py-4 text-red-500 font-semibold"> Error : {error} </div>
            )}
            {!loading && !error && (
                <table className="text-center w-full bg-white rounded shadow-md border border-gray-300 border-collapse">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="px-4 py-2 border border-gray-300 whitespace-nowrap">Date</th>
                            <th className="px-4 py-2 border border-gray-300 whitespace-nowrap">Absent</th>
                            <th className="px-4 py-2 border border-gray-300 whitespace-nowrap">Replacement</th>
                            <th className="px-4 py-2 border border-gray-300 whitespace-nowrap">Year</th>
                            <th className="px-4 py-2 border border-gray-300 whitespace-nowrap">Session</th>
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
                                            {formatDate(details.date)}
                                        </td>
                                        <td className="px-2 w-[16%] py-2 border border-gray-300 whitespace-nowrap">{details.absentStaffId}</td>
                                        <td className="px-2 w-[16%] py-2 border border-gray-300 whitespace-nowrap">{details.replacementStaffId}</td>
                                        <td className="px-2 w-[16%] py-2 border border-gray-300 whitespace-nowrap">{details.year}</td>
                                        <td className="px-2 w-[16%] py-2 border border-gray-300 whitespace-nowrap">{details.session}</td>
                                        <td className="border border-gray-300 w-[16%] py-2 px-2 whitespace-nowrap">
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
                                <td colSpan={6} className="py-4 text-gray-500 text-center">No substitution found.</td>
                            </tr>
                        )}
                    </tbody>

                </table>
            )}
            {isDeletePopupOpen && <DeletePopup
                onClose={() => { setIsDeleteModalOpen(false); fetchData(`${apiUrl}/api/leave/leaveInfo`) }}
                selectedSubstitution={selectedSubstitution} 
            />}
        </>
    )
}

export default LeaveTable;