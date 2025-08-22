import React from 'react';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFetch } from '../hooks/useFetch';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

function ClassReport() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const { loading, error, data, fetchData } = useFetch();

    const getStudentReport = () => { fetchData(`${apiUrl}/api/report/student`) };

    const handleDownload = () => {
        const headers = ['REG_NO', 'ROLL_NO', 'YEAR', 'TOTAL_CLASSES', 'PRESENT', 'ABSENT', 'PERCENTAGE']
        const sheetData = [headers, ...data.map(student => [
            student.reg_no,
            student.roll_no,
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
    }

    return (
        <div className='p-6 w-full space-y-6'>
            <div className='flex justify-end'>
                <button
                    onClick={getStudentReport}
                    className="bg-blue-600 w-48 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
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
                <div className="overflow-x-auto flex flex-col items-end">
                    <button
                        onClick={handleDownload}
                        className="mb-6 w-48 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                    >
                        Download Excel
                    </button>
                    <table className="text-center w-full bg-white rounded shadow-md border border-gray-300 border-collapse">
                        <thead className="bg-blue-500 text-white">
                            <tr>
                                <th className="px-4 py-2 border border-gray-300 whitespace-nowrap">S No</th>
                                <th className="px-4 py-2 border border-gray-300 whitespace-nowrap">Roll No</th>
                                <th className="px-4 py-2 border border-gray-300 whitespace-nowrap">Reg No</th>
                                <th className="px-4 py-2 border border-gray-300 whitespace-nowrap">Year</th>
                                <th className="px-4 py-2 border border-gray-300 whitespace-nowrap">Total Classes</th>
                                <th className="px-4 py-2 border border-gray-300 whitespace-nowrap">Present</th>
                                <th className="px-4 py-2 border border-gray-300 whitespace-nowrap">Absent</th>
                                <th className="px-4 py-2 border border-gray-300 whitespace-nowrap">Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((student, index) => (
                                <tr key={index} className="border">
                                    <td className="px-2 py-2 border border-gray-300 whitespace-nowrap">
                                        {index + 1}
                                    </td>
                                    <td className="px-2 py-2 border border-gray-300 whitespace-nowrap">
                                        {student.roll_no}
                                    </td>
                                    <td className="px-2 py-2 border border-gray-300 whitespace-nowrap">
                                        {student.reg_no}
                                    </td>
                                    <td className="px-2 py-2 border border-gray-300 whitespace-nowrap">
                                        {student.year}
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
                                    <td className="px-2 py-2 border border-gray-300 whitespace-nowrap font-semibold">
                                        {((student.present/student.total) * 100).toFixed(2)} %
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