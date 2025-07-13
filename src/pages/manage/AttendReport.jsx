import React from 'react';
import { faTools } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
const apiUrl = import.meta.env.VITE_API_URL;

function AttendReport() {

    const [date, setDate] = useState('')
    const { fetchData, loading, error, data } = useFetch();
    const get = async () => { fetchData(`${apiUrl}/api/attendance/report`, { date }) };

    return (
        <div className="p-6 w-full mt-4 space-y-6">

            {/* Year & Date Filter */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        onChange={(e) => setDate(e.target.value)}
                        className="h-10 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    <button
                        onClick={get}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Get
                    </button>
                </div>
            </div>

            {/* Loader / Error / Table */}
            {loading && (
                <div className="text-center py-4 text-blue-600 font-semibold">Loading Substitution...</div>
            )}
            {error && (
                <div className="text-center py-4 text-red-500 font-semibold">Error: {error}</div>
            )}
            {!loading && !error && (
                <div className="overflow-x-auto">
                    <table className="text-center w-full bg-white rounded shadow-md border border-gray-300 border-collapse">
                        <thead className="bg-blue-500 text-white">
                            <tr>
                                <th className="px-4 py-2 border border-gray-300 whitespace-nowrap">S.No</th>
                                <th className="px-4 py-2 border border-gray-300 whitespace-nowrap">Staff ID</th>
                                <th className="px-4 py-2 border border-gray-300 whitespace-nowrap">Year</th>
                                <th className="px-4 py-2 border border-gray-300 whitespace-nowrap">Session</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(data.data) && data.data.length > 0 ? (
                                data.data
                                    .filter(item => Object.keys(item).length > 0)
                                    .map((details, index) => (
                                        <tr key={index} className="border">
                                            <td className="px-2 py-2 border border-gray-300 whitespace-nowrap">{index + 1}</td>
                                            <td className="px-2 py-2 border border-gray-300 whitespace-nowrap">{details.staffId}</td>
                                            <td className="px-2 py-2 border border-gray-300 whitespace-nowrap">{details.year}</td>
                                            <td className="px-2 py-2 border border-gray-300 whitespace-nowrap">{details.session}</td>
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-4 text-gray-500 text-center">No record found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            
        </div>
    )
}

export default AttendReport   