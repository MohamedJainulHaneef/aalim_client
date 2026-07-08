import React, { useState, useEffect } from 'react';
import {
    faCalendar,
    faSearch,
    faUser,
    faClock,
    faGraduationCap,
    faExclamationTriangle,
    faClipboardList
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFetch } from '../../hooks/useFetch';

const apiUrl = import.meta.env.VITE_API_URL;

function AttendReport() {

    const [date, setDate] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });

    const { fetchData, loading, error, data } = useFetch();

    useEffect(() => {
        if (date) {
            fetchData(`${apiUrl}/api/attendance/report`, { date });
        }
    }, [date]);

    const formatDate = (dateString) => {
        if (!dateString) return 'No date selected';
        const parsedDate = new Date(dateString);
        return parsedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const totalRecords = data?.data?.length || 0;

    return (
        <div className="p-3 text-gray-800 antialiased">
            <div className="mx-auto space-y-6">

                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                                <FontAwesomeIcon icon={faClipboardList} className="text-blue-600 text-xl" />
                                Attendance Report
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                View and analyze attendance records by date
                            </p>
                        </div>
                        {totalRecords > 0 && !loading && (
                            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 self-start sm:self-center">
                                <span className="text-sm font-semibold text-blue-700">
                                    {totalRecords} {totalRecords === 1 ? 'Record' : 'Records'} Found
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Filter Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-xs w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FontAwesomeIcon icon={faCalendar} className="text-gray-400 text-sm" />
                            </div>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm font-medium"
                            />
                        </div>

                        {date && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 self-start sm:self-center">
                                <FontAwesomeIcon icon={faCalendar} className="text-blue-500" />
                                <span className="font-medium text-gray-500">Viewing:</span>
                                <span className="font-semibold text-gray-900">{formatDate(date)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Loader */}
                {loading && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 transition-all">
                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
                            <div className="text-center">
                                <h3 className="text-sm font-semibold text-gray-900">Loading Report Data...</h3>
                                <p className="text-xs text-gray-400 mt-1">Please wait while we fetch the records</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-5 transition-all">
                        <div className="flex items-start gap-3">
                            <div className="bg-red-100 p-2 rounded-lg text-red-600 shrink-0">
                                <FontAwesomeIcon icon={faExclamationTriangle} />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-red-800">Error Loading Data</h3>
                                <p className="text-xs text-red-600 mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Data Table View */}
                {!loading && !error && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-500 font-semibold text-xs uppercase tracking-wider text-center">
                                        <th className="px-6 py-4">S.No</th>
                                        <th className="px-6 py-4">Staff ID</th>
                                        <th className="px-6 py-4">Year</th>
                                        <th className="px-6 py-4">Session</th>
                                        <th className="px-6 py-4">Incomplete Batch</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {Array.isArray(data?.data) && data.data.length > 0 ? (
                                        data.data.map((details, index) => (
                                            <tr key={details.id || index} className="hover:bg-gray-50/40 transition-colors duration-150 text-center">
                                                <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                                                    {String(index + 1).padStart(2, '0')}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-2 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-semibold">
                                                        <FontAwesomeIcon icon={faUser} className="text-[10px]" />
                                                        {details.staffId}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 font-medium">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <FontAwesomeIcon icon={faGraduationCap} className="text-gray-400 text-xs" />
                                                        {details.year}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold
                                                        ${details.session?.toLowerCase() === 'morning'
                                                            ? 'bg-orange-50 text-orange-700 border border-orange-100'
                                                            : 'bg-purple-50 text-purple-700 border border-purple-100'
                                                        }`}>
                                                        <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                                                        {details.session}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1.5 text-amber-600 bg-amber-50/60 px-2 py-1 rounded-md border border-amber-100">
                                                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-[10px]" />
                                                        <span className="text-xs font-semibold">Incomplete</span>
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center gap-3 max-w-sm mx-auto">
                                                    <div className="bg-gray-100 p-4 rounded-full text-gray-400">
                                                        <FontAwesomeIcon icon={faSearch} className="text-xl" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-700">No records found</p>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {date ? `There are no attendance records logged for ${formatDate(date)}.` : 'Select a date to pull down report archives.'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AttendReport;