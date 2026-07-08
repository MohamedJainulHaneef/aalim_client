import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useFetch } from '../../../hooks/useFetch';
import EditPopup from './EditPopup';
import DeletePopup from './DeletePopup';
const apiUrl = import.meta.env.VITE_API_URL;

function UserTable() {

    const { fetchData, loading, error, data } = useFetch();
    const [isEditPopupOpen, setIsEditModalOpen] = useState(false);
    const [isDeletePopupOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const getAvatarColor = (string) => {
        const colors = [
            'bg-blue-500 text-white',
            'bg-emerald-500 text-white',
            'bg-indigo-500 text-white',
            'bg-violet-500 text-white',
            'bg-amber-500 text-white',
            'bg-cyan-500 text-white',
            'bg-rose-500 text-white',
            'bg-teal-500 text-white'
        ];
        if (!string) return colors[0];
        let hash = 0;
        for (let i = 0; i < string.length; i++) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    const handleEdit = async (details) => {
        setIsEditModalOpen(true);
        setSelectedUser(details);
    };

    const handleDelete = async (id) => {
        setIsDeleteModalOpen(true);
        setSelectedUser(id);
    };

    useEffect(() => {
        fetchData(`${apiUrl}/api/users/fetchStaff`);
    }, []);

    const sortedData = data ? [...data].sort((a, b) => {
        return a.staffId.localeCompare(b.staffId, undefined, { numeric: true, sensitivity: 'base' });
    }) : [];

    return (
        <>
            {loading && (
                <div className="flex justify-center items-center py-12 text-blue-600 font-semibold gap-2 text-sm tracking-normal">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading users...</span>
                </div>
            )}
            {error && (
                <div className="text-center py-8 text-red-500 font-semibold text-sm tracking-normal bg-red-50/50 border border-red-100 rounded-xl">
                    Error: {error}
                </div>
            )}
            {!loading && !error && (
                <div className="w-full overflow-hidden bg-white rounded-xl border border-slate-200/80 shadow-xs">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                            <tr>
                                {/* User Details - Aligned Left */}
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                                    User Details
                                </th>
                                {/* Password - Centered */}
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                                    Password
                                </th>
                                {/* Actions - Centered */}
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {sortedData.length > 0 ? (
                                sortedData.map((details) => (
                                    <tr key={details.staffId} className="hover:bg-slate-50/60 transition-colors duration-150">

                                        {/* User Info Stack - Aligned Left */}
                                        <td className="px-6 py-3.5 text-left">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-md flex items-center justify-center text-xs font-bold shadow-2xs select-none ${getAvatarColor(details.staffId)}`}>
                                                    {details.fullName ? details.fullName.charAt(0).toUpperCase() : details.staffId.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-800 tracking-normal text-sm">
                                                        {details.staffId}
                                                    </span>
                                                    <span className="text-xs text-slate-400 font-medium tracking-normal mt-0.5">
                                                        {details.fullName || "No Name Provided"}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Password - Centered */}
                                        <td className="px-6 py-3.5 text-center text-sm text-slate-700 font-medium select-all">
                                            {details.password}
                                        </td>

                                        {/* Actions - Centered */}
                                        <td className="px-6 py-3.5 text-center whitespace-nowrap">
                                            <div className="inline-flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(details)}
                                                    className="cursor-pointer inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border border-transparent shadow-2xs"
                                                >
                                                    <FontAwesomeIcon icon={faEdit} className="text-[11px]" />
                                                    <span>Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(details.staffId)}
                                                    className="cursor-pointer inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-600 text-red-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border border-transparent shadow-2xs"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} className="text-[11px]" />
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="py-12 text-center text-slate-400 font-medium tracking-normal">
                                        No accounts or users registered on this server.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {isEditPopupOpen && (
                <EditPopup
                    onClose={() => { setIsEditModalOpen(false); fetchData(`${apiUrl}/api/users/fetchStaff`); }}
                    selectedUser={selectedUser}
                />
            )}
            {isDeletePopupOpen && (
                <DeletePopup
                    onClose={() => { setIsDeleteModalOpen(false); fetchData(`${apiUrl}/api/users/fetchStaff`); }}
                    selectedUser={selectedUser}
                />
            )}
        </>
    );
}

export default UserTable;