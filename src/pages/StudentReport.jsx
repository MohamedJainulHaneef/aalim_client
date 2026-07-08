import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faDownload,
    faFileExcel,
    faUsers,
    faCalendarCheck,
    faSpinner,
    faExclamationTriangle,
    faUserGraduate
} from '@fortawesome/free-solid-svg-icons';
import { useFetch } from '../hooks/useFetch';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

function ClassReport() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const { loading, error, data, fetchData } = useFetch();

    const getStudentReport = () => {
        fetchData(`${apiUrl}/api/report/student`);
    };

    const handleDownload = () => {
        const headers = ['ROLL_NO', 'NAME', 'REG_NO', 'YEAR', 'TOTAL_CLASSES', 'PRESENT', 'ABSENT', 'PERCENTAGE'];
        const sheetData = [headers, ...sortedData.map(student => [
            student.roll_no,
            student.stu_name,
            student.reg_no,
            student.year,
            student.total,
            student.present,
            student.absent,
            ((student.present / student.total) * 100).toFixed(2) + ' %'
        ])];

        const ws = XLSX.utils.aoa_to_sheet(sheetData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
        });
        saveAs(blob, 'Student Report.xlsx');
    };

    const getAvatarColor = (string) => {
        const colors = [
            'bg-blue-500 text-white', 'bg-emerald-500 text-white',
            'bg-indigo-500 text-white', 'bg-violet-500 text-white',
            'bg-amber-500 text-white', 'bg-cyan-500 text-white',
            'bg-rose-500 text-white', 'bg-teal-500 text-white'
        ];
        if (!string) return colors[0];
        let hash = 0;
        for (let i = 0; i < string.length; i++) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    const yearWeights = { 'I Year': 1, 'II Year': 2, 'III Year': 3, 'IV Year': 4, 'V Year': 5 };

    const sortedData = data ? [...data].sort((a, b) => {
        const weightA = yearWeights[a.year] || 99;
        const weightB = yearWeights[b.year] || 99;
        if (weightA !== weightB) {
            return weightA - weightB;
        }
        return String(a.roll_no).localeCompare(String(b.roll_no), undefined, { numeric: true, sensitivity: 'base' });
    }) : [];

    return (
        <div className="p-3 w-full space-y-6">
            {/* Header Section with Stats */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100/50 text-blue-600">
                        <FontAwesomeIcon icon={faUsers} className="text-lg" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                            Student Attendance Report
                        </h2>
                        <p className="text-xs text-slate-400 font-medium">
                            {data?.length ? `${data.length} students enrolled` : 'No student records available'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={getStudentReport}
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-xs hover:shadow-md"
                >
                    {loading ? (
                        <>
                            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-sm" />
                            <span>Loading...</span>
                        </>
                    ) : (
                        <>
                            <FontAwesomeIcon icon={faFileExcel} className="text-sm" />
                            <span>Get Student Report</span>
                        </>
                    )}
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-12 text-blue-600 font-semibold gap-2 text-sm tracking-normal bg-blue-50/30 rounded-xl border border-blue-100/50">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading student report...</span>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="flex items-center justify-center gap-3 py-8 text-red-500 font-semibold text-sm tracking-normal bg-red-50/50 border border-red-100 rounded-xl">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
                    <span>Error : {error}</span>
                </div>
            )}

            {/* Table Section */}
            {!loading && !error && sortedData?.length > 0 && (
                <div className="w-full overflow-hidden bg-white rounded-xl border border-slate-200/80 shadow-xs">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-3.5 bg-slate-50 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Class Performance Summary
                            </span>
                        </div>
                        <button
                            onClick={handleDownload}
                            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 shadow-xs hover:shadow-md"
                        >
                            <FontAwesomeIcon icon={faDownload} className="text-[13px]" />
                            <span>Download Excel</span>
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700">
                                <tr>
                                    <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">#</th>
                                    <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Roll No</th>
                                    <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 text-left">Student Name</th>
                                    <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Reg No</th>
                                    <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Year</th>
                                    <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Total Classes</th>
                                    <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Present</th>
                                    <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Absent</th>
                                    <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Percentage</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {sortedData.map((student, index) => {
                                    const percentage = ((student.present / student.total) * 100).toFixed(2);
                                    return (
                                        <tr key={student.roll_no || index} className="hover:bg-slate-50/60 transition-colors duration-150">
                                            <td className="px-6 py-3.5 text-center text-sm text-slate-400 font-medium">
                                                {index + 1}
                                            </td>

                                            <td className="px-6 py-3.5 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold shadow-2xs select-none ${getAvatarColor(student.roll_no)}`}>
                                                        {student.roll_no ? String(student.roll_no).slice(-2) : 'RN'}
                                                    </div>
                                                    <span className="font-semibold text-slate-700 text-sm font-mono">
                                                        {student.roll_no}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* NEW Name Column Display */}
                                            <td className="px-4 py-3.5 text-left font-semibold text-slate-700 capitalize">
                                                {student.stu_name}
                                            </td>

                                            <td className="px-6 py-3.5 text-center">
                                                <span className="font-medium text-slate-600 text-sm">
                                                    {student.reg_no}
                                                </span>
                                            </td>

                                            <td className="px-6 py-3.5 text-center">
                                                <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-sm font-medium border border-slate-200/50">
                                                    {student.year}
                                                </span>
                                            </td>

                                            <td className="px-6 py-3.5 text-center font-medium text-slate-600">
                                                {student.total}
                                            </td>

                                            <td className="px-6 py-3.5 text-center">
                                                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                    {student.present}
                                                </span>
                                            </td>

                                            <td className="px-6 py-3.5 text-center">
                                                <span className="inline-flex items-center gap-1 text-red-500 font-semibold">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                                    {student.absent}
                                                </span>
                                            </td>

                                            <td className="px-6 py-3.5 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-bold border ${parseFloat(percentage) >= 75
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100/50'
                                                    : parseFloat(percentage) >= 50
                                                        ? 'bg-amber-50 text-amber-700 border-amber-100/50'
                                                        : 'bg-rose-50 text-rose-700 border-rose-100/50'
                                                    }`}>
                                                    <FontAwesomeIcon icon={faCalendarCheck} className={`text-[10px] ${parseFloat(percentage) >= 75 ? 'text-emerald-500' : parseFloat(percentage) >= 50 ? 'text-amber-500' : 'text-rose-500'}`} />
                                                    {percentage}%
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* No Data State */}
            {!loading && !error && sortedData?.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400 bg-slate-50/30 rounded-xl border border-slate-200/50">
                    <div className="bg-slate-100 p-4 rounded-full">
                        <FontAwesomeIcon icon={faUsers} className="text-3xl text-slate-300" />
                    </div>
                    <p className="font-medium text-sm">No student report available</p>
                    <p className="text-xs text-slate-400">Click "Get Student Report" to fetch attendance data</p>
                </div>
            )}
        </div>
    );
}

export default ClassReport;