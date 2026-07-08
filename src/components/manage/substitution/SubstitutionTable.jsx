import React, { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { useFetch } from '../../../hooks/useFetch';
import DeletePopup from './DeletePopup';
const apiUrl = import.meta.env.VITE_API_URL;

function SubstitutionTable() {

    const { fetchData, loading, error, data } = useFetch();
    const { fetchData: fetchStaffData, data: staffData } = useFetch();
    const [isDeletePopupOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSubstitution, setSelectedSubstitution] = useState(null);

    const handleDelete = (id) => {
        setIsDeleteModalOpen(true);
        setSelectedSubstitution(id);
    };

    useEffect(() => {
        fetchData(`${apiUrl}/api/substitution/substitutionInfo`);
        fetchStaffData(`${apiUrl}/api/users/fetchStaff`);
    }, [fetchData, fetchStaffData]);

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return dateString;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const sortedData = data ? [...data].sort((a, b) => new Date(a.date) - new Date(b.date)) : [];

    const staffMap = useMemo(() => {
        const map = new Map();
        (staffData || []).forEach((staff) => {
            if (staff?.staffId) map.set(staff.staffId, staff);
        });
        return map;
    }, [staffData]);

    const formatStaffLabel = (staffId) => {
        const staff = staffMap.get(staffId);
        if (!staffId) return '—';
        if (staff?.fullName) return `${staffId} • ${staff.fullName}`;
        return staffId;
    };

    return (
        <>
            {loading && (
                <div className="flex justify-center items-center py-12 text-blue-600 font-semibold gap-2 text-sm tracking-normal">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading substitutions...</span>
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
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                                    Date
                                </th>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                                    Year
                                </th>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                                    Session
                                </th>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                                    Absent Staff
                                </th>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                                    Replace Staff
                                </th>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {sortedData.length > 0 ? (
                                sortedData.map((details) => (
                                    <tr key={details._id} className="hover:bg-slate-50/60 transition-colors duration-150">
                                        <td className="px-6 py-3.5 text-left">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shadow-2xs select-none bg-blue-100 text-blue-600">
                                                    <FontAwesomeIcon icon={faCalendarAlt} className="text-sm" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-800 tracking-normal text-sm">
                                                        {formatDate(details.date)}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-3.5 text-center text-sm text-slate-700 font-medium">
                                            {details.year || '—'}
                                        </td>

                                        <td className="px-6 py-3.5 text-center text-sm text-slate-700 font-medium">
                                            {details.session || '—'}
                                        </td>

                                        <td className="px-6 py-3.5 text-center text-sm text-slate-700 font-medium">
                                            {formatStaffLabel(details.absentStaffId)}
                                        </td>

                                        <td className="px-6 py-3.5 text-center text-sm text-slate-700 font-medium">
                                            {formatStaffLabel(details.replacementStaffId)}
                                        </td>

                                        <td className="px-6 py-3.5 text-center whitespace-nowrap">
                                            <button
                                                onClick={() => handleDelete(details._id)}
                                                className="cursor-pointer inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-600 text-red-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border border-transparent shadow-2xs"
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="text-[11px]" />
                                                <span>Delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400 font-medium tracking-normal">
                                        No substitution records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {isDeletePopupOpen && (
                <DeletePopup
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        fetchData(`${apiUrl}/api/substitution/substitutionInfo`);
                    }}
                    selectedSubstitution={selectedSubstitution}
                />
            )}
        </>
    );
}

export default SubstitutionTable;