import React from 'react';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFetch } from '../hooks/useFetch';

function ClassReport() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const { loading, error, data, fetchData } = useFetch();

    const getStudentReport = () => { fetchData(`${apiUrl}/api/report/student`)};

    return (
        <div className='p-6 w-full space-y-6'>
            <div className='flex justify-end'>
                <button
                    onClick={getStudentReport}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Get Student Report
                </button>
            </div>

            {/* LOADING */}
            {loading && (
                <div className="text-center py-4 text-blue-600 font-semibold">
                    Loading Report ...
                </div>
            )}

            {/* ERROR */}
            {error && (
                <div className="text-center py-4 text-red-500 font-semibold">
                    Error: {error}
                </div>
            )}

            {/* REPORT TABLE */}
            {!loading && !error && data?.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="text-center w-full bg-white rounded shadow-md border border-gray-300 border-collapse">
                        <thead className="bg-blue-500 text-white">
                            <tr>
                                <th className="px-4 py-2 border border-gray-300 whitespace-nowrap">Reg No</th>
                                <th className="px-4 py-2 border border-gray-300 whitespace-nowrap">Roll No</th>
                                <th className="px-4 py-2 border border-gray-300 whitespace-nowrap">Total Classes</th>
                                <th className="px-4 py-2 border border-gray-300 whitespace-nowrap">Present</th>
                                <th className="px-4 py-2 border border-gray-300 whitespace-nowrap">Absent</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((student, index) => (
                                <tr key={index} className="border">
                                    <td className="px-2 py-2 border border-gray-300 whitespace-nowrap">
                                        {student.reg_no}
                                    </td>
                                    <td className="px-2 py-2 border border-gray-300 whitespace-nowrap">
                                        {student.roll_no}
                                    </td>
                                    <td className="px-2 py-2 border border-gray-300 whitespace-nowrap">
                                        {student.total}
                                    </td>
                                    <td className="px-2 py-2 border border-gray-300 whitespace-nowrap text-green-600 font-semibold">
                                        {student.present}
                                    </td>
                                    <td className="px-2 py-2 border border-gray-300 whitespace-nowrap text-red-500 font-semibold">
                                        {student.absent}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* NO DATA */}
            {!loading && !error && data?.length === 0 && (
                <div className="text-center text-gray-500 py-4">No student report available.</div>
            )}
        </div>
    )
}

export default ClassReport;