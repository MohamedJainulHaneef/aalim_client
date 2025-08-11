import React from 'react';
import { faTools } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFetch } from '../hooks/useFetch';

function StaffReport() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const { loading, error, data, fetchData } = useFetch();

    const getStaffReport = () => { fetchData(`${apiUrl}/api/report/staff`) };

    return (
        <div className='p-6 w-full space-y-6'>

            {/* Button */}
            <div className='flex justify-end'>
                <button
                    onClick={getStaffReport}
                    className="bg-blue-600 w-40 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Get Staff Report
                </button>
            </div>

            {/* Loading */}
            {loading && (
                <div className="text-center py-4 text-blue-600 font-semibold">
                    Loading Staff Report ...
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="text-center py-4 text-red-500 font-semibold">
                    Error: {error}
                </div>
            )}

            {/* Table */}
            {!loading && !error && data?.length > 0 && (
                <div className="overflow-x-auto flex flex-col items-end">
                    <button
                        className="mb-6 w-40 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                    >
                        Download Excel
                    </button>
                    <table className="text-center w-full bg-white rounded shadow-md border border-gray-300 border-collapse">
                        <thead className="bg-blue-500 text-white">
                            <tr>
                                <th className="px-4 py-2 border border-gray-300 whitespace-nowrap">S No</th>
                                <th className="px-4 py-2 border border-gray-300 whitespace-nowrap">Staff ID</th>
                                <th className="px-4 py-2 border border-gray-300 whitespace-nowrap">Full Name</th>
                                <th className="px-4 py-2 border border-gray-300 whitespace-nowrap">Attendance Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((staff, index) => (
                                <tr key={index} className="border">
                                    <td className="px-2 py-2 border border-gray-300 whitespace-nowrap">
                                        {index+1}
                                    </td>
                                    <td className="px-2 py-2 border border-gray-300 whitespace-nowrap">
                                        {staff.staffId}
                                    </td>
                                    <td className="px-2 py-2 border border-gray-300 whitespace-nowrap">
                                        {staff.fullName}
                                    </td>
                                    <td className="px-2 py-2 border border-gray-300 whitespace-nowrap text-green-600 font-semibold">
                                        {staff.attendanceCount}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* No Data */}
            {!loading && !error && data?.length === 0 && (
                <div className="text-center text-gray-500 py-4">No staff report available.</div>
            )}

        </div>
    )
}

export default StaffReport