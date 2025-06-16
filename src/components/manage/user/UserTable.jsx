import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useFetch } from '../../../hooks/useFetch';
import EditPopup from './EditPopup';
import DeletePopup from './DeletePopup';
const apiUrl = import.meta.env.VITE_API_URL;

function UserTable() 
{
    const { fetchData, loading, error, data } = useFetch();

    const [isEditPopupOpen, setIsEditModalOpen] = useState(false);
    const [isDeletePopupOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleEdit = async (details) => {
        setIsEditModalOpen(true);
        setSelectedUser(details);
    }

    const handleDelete = async (id) => {
        setIsDeleteModalOpen(true);
        setSelectedUser(id);
    }

    useEffect(() => { fetchData(`${apiUrl}/api/users/fetchStaff`) }, [])

    return (
        <>
            {loading && (
                <div className="text-center py-4 text-blue-600 font-semibold"> Loading Users ... </div>
            )}
            {error && (
                <div className="text-center py-4 text-red-500 font-semibold"> Error : {error} </div>
            )}
            {!loading && !error && (
                <table className="text-center w-full bg-white rounded shadow-md border border-gray-300 border-collapse">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="px-4 py-2 border border-gray-300">User Id</th>
                            <th colSpan={2} className="px-4 py-2 border border-gray-300">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((details) => (
                                <tr key={details.staffId} className="border">
                                    <td className="px-2 py-2 border border-gray-300 w-[30%]">{details.staffId}</td>
                                    <td className="border border-gray-300 w-[35%] py-2 px-2">
                                        <button onClick={() => handleEdit(details)}
                                            className="cursor-pointer bg-blue-500 text-white w-full p-2 flex items-center rounded justify-center"
                                        >
                                            <FontAwesomeIcon icon={faEdit} className='mr-2' /> <span>Edit</span>
                                        </button>
                                    </td>
                                    <td className="border border-gray-300 w-[35%] py-2 px-2">
                                        <button
                                            onClick={() => handleDelete(details.staffId)}
                                            className="cursor-pointer bg-red-500 text-white w-full p-2 flex items-center rounded justify-center"
                                        >
                                            <FontAwesomeIcon icon={faTrash} className='mr-2' /> <span>Delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="py-4 text-gray-500">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
            {isEditPopupOpen && <EditPopup
                onClose={() => { setIsEditModalOpen(false); fetchData(`${apiUrl}/api/users/fetchStaff`) }}
                selectedUser={selectedUser}
            />}
            {isDeletePopupOpen && <DeletePopup
                onClose={() => { setIsDeleteModalOpen(false); fetchData(`${apiUrl}/api/users/fetchStaff`) }}
                selectedUser={selectedUser} 
            />}
        </>
    )
}

export default UserTable;