import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSave, faUserGraduate, faBook, faCalendar, faClock,
    faCheckCircle, faTimesCircle, faUsers, faSearch
} from '@fortawesome/free-solid-svg-icons';
import Button from '../components/common/Button';
import { useFetch } from '../hooks/useFetch';
import { useAdd } from '../hooks/useAdd';

const apiUrl = import.meta.env.VITE_API_URL;

function Attendance() {

    const location = useLocation();
    const { staffId } = useParams();
    const { studentYear = 'N/A', courseCode = 'N/A', session = 'N/A' } = location.state || {};

    // States
    const [formData, setFormData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [columns, setColumns] = useState({
        sno: true, reg: true, roll: true, name: false, present: false, absent: false,
    });

    // Custom Hooks
    const { loading: fetchLoading, error: fetchError, data, fetchData } = useFetch();
    const { loading: addLoading, error: addError, addData } = useAdd();

    // Memoized formatted date string
    const formattedDate = useMemo(() => {
        const date = new Date();
        return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
    }, []);

    const buttonObject = {
        name: addLoading ? 'Saving...' : 'Save',
        icon: faSave,
        design: 'w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium shadow transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none text-sm'
    };

    // Fetch student info on mount / dependency change
    useEffect(() => {
        fetchData(`${apiUrl}/api/attendance/studentsInfo`, { studentYear, session, formattedDate, staffId });
    }, [studentYear, session, staffId, formattedDate]);

    // Format and sort incoming data
    useEffect(() => {
        if (data && Array.isArray(data)) {
            const sortedData = [...data]
                .sort((a, b) => a.roll_no.localeCompare(b.roll_no))
                .map(student => ({ ...student, status: student.status ?? true }));
            setFormData(sortedData);
        }
    }, [data]);

    // Set initial columns state
    useEffect(() => {
        setColumns((prev) => ({ ...prev, present: true }))
    }, []);

    // Filter students based on search query
    const filteredFormData = useMemo(() => {
        return formData.filter(student =>
            student.stu_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.roll_no?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.reg_no?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [formData, searchQuery]);

    // Handle checkboxes
    const handleCheckboxChange = (key) => {
        if (key === 'present') {
            setFormData(prev => prev.map(student => ({ ...student, status: true })));
            setColumns(prev => ({ ...prev, present: true, absent: false }));
        } else if (key === 'absent') {
            setFormData(prev => prev.map(student => ({ ...student, status: false })));
            setColumns(prev => ({ ...prev, present: false, absent: true }));
        } else {
            setColumns(prev => ({ ...prev, [key]: !prev[key] }));
        }
    };

    // Toggle individual student status
    const toggleAttendance = (roll_no) => {
        setFormData(prev => {
            const updated = prev.map(student =>
                student.roll_no === roll_no ? { ...student, status: !student.status } : student
            );
            const allPresent = updated.every(student => student.status === true);
            const allAbsent = updated.every(student => student.status === false);

            setColumns(prevCols => ({ ...prevCols, present: allPresent, absent: allAbsent }));
            return updated;
        });
    };

    const handleSave = async () => {
        const finalData = {
            staffId, year: studentYear, session, date: new Date(), courseCode: courseCode,
            record: formData.map(({ roll_no, status }) => ({ roll_no, status }))
        };

        const response = await addData(`${apiUrl}/api/attendance/saveInfo`, finalData);
        if (response != null) {
            alert('Data saved successfully');
        }
    };

    const totalStudents = formData.length;
    const presentCount = formData.filter(s => s.status === true).length;
    const absentCount = formData.filter(s => s.status === false).length;
    const attendancePercentage = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

    return (
        <div className="p-3 text-gray-800">
            <div className="mx-auto space-y-6">

                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="border-b border-gray-200 px-6 py-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                                    Attendance Management
                                </h1>
                                <p className="text-gray-500 text-xs md:text-sm mt-1 flex items-center">
                                    <FontAwesomeIcon icon={faUsers} className="mr-2 text-gray-400" />
                                    Marking attendance for {totalStudents} students
                                </p>
                            </div>
                            <div className="self-start sm:self-center bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg">
                                <span className="text-blue-700 font-semibold text-sm">{attendancePercentage}% Present</span>
                            </div>
                        </div>
                    </div>

                    {/* Info Cards - Retaining old labels */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
                        <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center space-x-4 shadow-sm">
                            <div className="text-blue-500 bg-blue-50 p-3 rounded-xl flex-shrink-0">
                                <FontAwesomeIcon icon={faUserGraduate} className="text-lg w-5 h-5" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Year</p>
                                <p className="text-sm font-semibold text-gray-800 truncate">{studentYear || 'II Year'}</p>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center space-x-4 shadow-sm">
                            <div className="text-purple-500 bg-purple-50 p-3 rounded-xl flex-shrink-0">
                                <FontAwesomeIcon icon={faBook} className="text-lg w-5 h-5" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Code</p>
                                <p className="text-sm font-semibold text-gray-800 truncate">{courseCode}</p>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center space-x-4 shadow-sm">
                            <div className="text-green-500 bg-green-50 p-3 rounded-xl flex-shrink-0">
                                <FontAwesomeIcon icon={faCalendar} className="text-lg w-5 h-5" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Date</p>
                                <p className="text-sm font-semibold text-gray-800 truncate">{formattedDate}</p>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center space-x-4 shadow-sm">
                            <div className="text-orange-500 bg-orange-50 p-3 rounded-xl flex-shrink-0">
                                <FontAwesomeIcon icon={faClock} className="text-lg w-5 h-5" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Hour</p>
                                <p className="text-sm font-semibold text-gray-800 truncate">{session}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Controls Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-base font-semibold text-gray-800">Display & Search Filters</h2>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-72">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 text-xs">
                                <FontAwesomeIcon icon={faSearch} />
                            </span>
                            <input
                                type="text"
                                placeholder="Search student..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
                            />
                        </div>
                    </div>

                    {/* Columns Selector checkboxes */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                        {[
                            { key: 'sno', label: 'S. No' },
                            { key: 'reg', label: 'Reg. No.' },
                            { key: 'roll', label: 'Roll. No.' },
                            { key: 'name', label: 'Name' },
                            { key: 'present', label: 'All Present' },
                            { key: 'absent', label: 'All Absent' },
                        ].map((item) => (
                            <div
                                key={item.key}
                                className={`px-3 py-2.5 rounded-lg border text-center transition-all ${columns[item.key]
                                    ? 'bg-blue-50 border-blue-200'
                                    : 'bg-white border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <label className="flex items-center justify-center w-full cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={columns[item.key]}
                                        onChange={() => handleCheckboxChange(item.key)}
                                        className="w-3.5 h-3.5 mr-2 accent-blue-600 rounded cursor-pointer"
                                    />
                                    <span className={`text-xs font-medium ${columns[item.key] ? 'text-blue-700' : 'text-gray-600'}`}>
                                        {item.label}
                                    </span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Statistics Progress Banner */}
                {totalStudents > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                            <div className="flex items-center space-x-4 text-xs md:text-sm">
                                <div className="flex items-center space-x-1.5">
                                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                                    <span className="text-gray-500">Present: <strong className="text-gray-800">{presentCount}</strong></span>
                                </div>
                                <div className="flex items-center space-x-1.5">
                                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                                    <span className="text-gray-500">Absent: <strong className="text-gray-800">{absentCount}</strong></span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 flex-grow sm:flex-grow-0 sm:w-64">
                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                        style={{ width: `${attendancePercentage}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">{attendancePercentage}%</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Banner */}
                {(fetchError || addError) && (
                    <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium">
                        {fetchError || addError}
                    </div>
                )}

                {/* Table Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        <table className="min-w-full text-xs md:text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 select-none">
                                    {columns.sno && <th className="px-4 py-3 text-center font-medium tracking-wider">S. No</th>}
                                    {columns.reg && <th className="px-4 py-3 text-center font-medium tracking-wider">Reg. No.</th>}
                                    {columns.roll && <th className="px-4 py-3 text-center font-medium tracking-wider">Roll. No.</th>}
                                    {columns.name && <th className="px-4 py-3 text-center font-medium tracking-wider">Name</th>}
                                    <th className="px-4 py-3 text-center font-medium tracking-wider w-28">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredFormData.length > 0 ? (
                                    filteredFormData.map((student, index) => (
                                        <tr key={student.roll_no} className="hover:bg-gray-50/70 text-center transition-colors">
                                            {columns.sno && (
                                                <td className="px-4 py-2.5 text-gray-400 font-medium">
                                                    {String(index + 1).padStart(2, '0')}
                                                </td>
                                            )}
                                            {columns.reg && (
                                                <td className="px-4 py-2.5 text-gray-500 font-mono tracking-tight">
                                                    {student.reg_no}
                                                </td>
                                            )}
                                            {columns.roll && (
                                                <td className="px-4 py-2.5 text-gray-900 font-medium">
                                                    {student.roll_no}
                                                </td>
                                            )}
                                            {columns.name && (
                                                <td className="px-4 py-2.5 text-gray-700 whitespace-nowrap">
                                                    {student.stu_name}
                                                </td>
                                            )}
                                            <td className="px-4 py-2.5 text-center">
                                                <button
                                                    onClick={() => toggleAttendance(student.roll_no)}
                                                    className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-white transition-all shadow-sm ${student.status
                                                        ? 'bg-green-600 hover:bg-green-700'
                                                        : 'bg-red-600 hover:bg-red-700'
                                                        }`}
                                                >
                                                    <FontAwesomeIcon icon={student.status ? faCheckCircle : faTimesCircle} className="text-sm" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-8 text-center text-gray-400 font-medium">
                                            No students matched your search criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <span className="text-xs md:text-sm text-gray-500">
                            Showing <strong className="text-gray-700">{filteredFormData.length}</strong> of {totalStudents} students
                        </span>
                        <Button buttonObject={buttonObject} onClick={handleSave} disabled={addLoading || totalStudents === 0} />
                    </div>
                </div>

                {/* Clean, Simple Processing Overlay */}
                {(fetchLoading || addLoading) && (
                    <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 shadow-xl max-w-xs w-full text-center space-y-3 border border-gray-100">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto"></div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">
                                    {addLoading ? 'Saving changes...' : 'Loading roster...'}
                                </h3>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Attendance;