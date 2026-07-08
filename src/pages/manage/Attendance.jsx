import React, { useState } from 'react';
import { useAdd } from '../../hooks/useAdd';
import {
    faSave,
    faCalendarCheck,
    faUsers,
    faEye,
    faCheckCircle,
    faTimesCircle,
    faUserCheck,
    faUserTimes,
    faSearch,
    faDownload,
    faSync
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../components/common/Button';

const Attendance = () => {

    const apiUrl = import.meta.env.VITE_API_URL;

    const [form, setForm] = useState({ date: '', year: '', session: '' });
    const [records, setRecords] = useState([]);
    const { addData, loading } = useAdd();

    const [columns, setColumns] = useState({
        sno: true,
        reg: true,
        roll: true,
        name: true,
        present: false,
        absent: false
    });

    // State for search and filter
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.date || !form.year || !form.session) {
            alert('Please select all fields before retrieving data.');
            return;
        }

        try {
            const response = await addData(`${apiUrl}/api/attendance/attmanform`, form);
            if (response?.records) {
                const sortedRecords = [...response.records]
                    .map(student => ({
                        ...student,
                        status: student.status !== undefined ? student.status : true
                    }))
                    .sort((a, b) => String(a.roll_no).localeCompare(String(b.roll_no)));

                setRecords(sortedRecords);

                const allP = sortedRecords.every((s) => s.status === true);
                const allA = sortedRecords.every((s) => s.status === false);
                setColumns(prev => ({ ...prev, present: allP, absent: allA }));
            } else {
                setRecords([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Error fetching records.');
        }
    };

    const handleCheckboxChange = (key) => {
        setColumns((prev) => {
            const newColumns = { ...prev };
            if (key === 'present') {
                setRecords((prevData) => prevData.map((student) => ({ ...student, status: true })));
                newColumns.present = true;
                newColumns.absent = false;
            } else if (key === 'absent') {
                setRecords((prevData) => prevData.map((student) => ({ ...student, status: false })));
                newColumns.present = false;
                newColumns.absent = true;
            } else {
                newColumns[key] = !prev[key];
            }
            return newColumns;
        });
    };

    const toggleAttendance = (roll_no) => {
        const updated = records.map((student) =>
            student.roll_no === roll_no ? { ...student, status: !student.status } : student
        );
        const allPresent = updated.every((s) => s.status === true);
        const allAbsent = updated.every((s) => s.status === false);
        setColumns((prev) => ({ ...prev, present: allPresent, absent: allAbsent }));
        setRecords(updated);
    };

    // Filter records based on search and status
    const getFilteredRecords = () => {
        let filtered = [...records];
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(student =>
                student.reg_no?.toLowerCase().includes(searchLower) ||
                student.roll_no?.toString().includes(searchLower) ||
                student.stu_name?.toLowerCase().includes(searchLower)
            );
        }
        if (filterStatus === 'present') {
            filtered = filtered.filter(student => student.status === true);
        } else if (filterStatus === 'absent') {
            filtered = filtered.filter(student => student.status === false);
        }

        return filtered;
    };

    const filteredRecords = getFilteredRecords();
    const totalStudents = records.length;

    // Save function with loading state
    const handleSave = async () => {
        if (records.length === 0) return;
        setIsSaving(true);
        try {
            const payload = {
                ...form,
                record: records.map((r) => ({
                    roll_no: r.roll_no,
                    status: r.status,
                })),
            };
            const res = await addData(`${apiUrl}/api/attendance/save-attendance`, payload);
            alert(res?.message || 'Attendance saved successfully!');
        } catch (err) {
            console.error('Error saving:', err);
            alert(err.response?.data?.message || 'Error saving attendance.');
        } finally {
            setIsSaving(false);
        }
    };

    // Export functionality
    const exportData = () => {
        const data = filteredRecords.map((student, index) => ({
            'S.No': index + 1,
            'Reg.No': student.reg_no,
            'Roll.No': student.roll_no,
            'Name': student.stu_name,
            'Status': student.status ? 'Present' : 'Absent'
        }));
        const csvContent = [
            Object.keys(data[0]).join(','),
            ...data.map(row => Object.values(row).join(','))
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance_${form.date || 'report'}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const isFormValid = form.date && form.year && form.session;

    const buttonObject = {
        name: 'Save Records',
        icon: faSave,
        design: 'bg-green-600 hover:bg-green-700 font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all text-sm text-white flex items-center gap-2',
    };

    const stats = {
        total: records.length,
        present: records.filter(r => r.status).length,
        absent: records.filter(r => !r.status).length,
        percentage: records.length > 0
            ? Math.round((records.filter(r => r.status).length / records.length) * 100)
            : 0
    };

    return (
        <div className="w-full p-3 text-gray-800 antialiased">
            <div className="mx-auto space-y-6">
                {/* Header Block */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                                <FontAwesomeIcon icon={faCalendarCheck} className="text-blue-600 text-xl" />
                                Attendance Manager
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Select details below to fetch rosters, log attendance and track layout records
                            </p>
                        </div>
                        {records.length > 0 && (
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
                                    <FontAwesomeIcon icon={faUserCheck} className="text-green-600" />
                                    <span className="font-semibold text-green-700">{stats.present}</span>
                                    <span className="text-gray-400">Present</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg">
                                    <FontAwesomeIcon icon={faUserTimes} className="text-red-600" />
                                    <span className="font-semibold text-red-700">{stats.absent}</span>
                                    <span className="text-gray-400">Absent</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                                    <span className="font-semibold text-blue-700">{stats.percentage}%</span>
                                    <span className="text-gray-400">Attendance</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Filter Form Block */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row items-end gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={form.date}
                                    onChange={handleChange}
                                    className="w-full h-11 px-4 mt-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Academic Year</label>
                                <select
                                    name="year"
                                    value={form.year}
                                    onChange={handleChange}
                                    className="w-full h-11 px-4 border mt-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
                                >
                                    <option value="">Select Year</option>
                                    <option value="I Year">I Year</option>
                                    <option value="II Year">II Year</option>
                                    <option value="III Year">III Year</option>
                                    <option value="IV Year">IV Year</option>
                                    <option value="V Year">V Year</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Session Hour</label>
                                <select
                                    name="session"
                                    value={form.session}
                                    onChange={handleChange}
                                    className="w-full h-11 px-4 border mt-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
                                >
                                    <option value="">Select Session</option>
                                    <option value="I Hour">I Hour</option>
                                    <option value="II Hour">II Hour</option>
                                </select>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={!isFormValid || loading}
                            className={`h-11 px-6 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 shrink-0 w-full lg:w-auto flex items-center justify-center gap-2
                ${isFormValid && !loading
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <FontAwesomeIcon icon={faSync} className="animate-spin" />
                                    Fetching...
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faSearch} />
                                    Get Data
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Column Control Block */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <FontAwesomeIcon icon={faEye} /> View Preferences & Global Controls
                        </h3>
                        {records.length > 0 && (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setFilterStatus('all')}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${filterStatus === 'all'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setFilterStatus('present')}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${filterStatus === 'present'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    Present
                                </button>
                                <button
                                    onClick={() => setFilterStatus('absent')}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${filterStatus === 'absent'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    Absent
                                </button>
                                <button
                                    onClick={exportData}
                                    className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all flex items-center gap-1.5"
                                >
                                    <FontAwesomeIcon icon={faDownload} />
                                    Export
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                        {[
                            { key: 'sno', label: 'S. No' },
                            { key: 'reg', label: 'Reg. No.' },
                            { key: 'roll', label: 'Roll No.' },
                            { key: 'name', label: 'Student Name' },
                            { key: 'present', label: 'Set All Present', highlight: 'text-green-600' },
                            { key: 'absent', label: 'Set All Absent', highlight: 'text-red-600' },
                        ].map((item) => (
                            <label
                                key={item.key}
                                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-100 bg-gray-50/50 cursor-pointer hover:bg-gray-50 transition-all group`}
                            >
                                <input
                                    type="checkbox"
                                    checked={columns[item.key]}
                                    onChange={() => handleCheckboxChange(item.key)}
                                    className="w-4 h-4 text-blue-600 accent-blue-600 border-gray-300 rounded focus:ring-blue-500/20"
                                />
                                <span className={`text-xs font-semibold ${item.highlight || 'text-gray-700'}`}>
                                    {item.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Attendance Table */}
                {records.length > 0 ? (
                    <>
                        {/* Search Bar */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="relative flex-1 min-w-[200px]">
                                    <FontAwesomeIcon
                                        icon={faSearch}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search by name, roll, reg..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full"
                                    />
                                </div>
                                {searchTerm && (
                                    <span className="text-xs text-gray-400">
                                        Found {filteredRecords.length} results
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto w-full">
                                <table className="min-w-full text-xs md:text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 select-none">
                                            {columns.sno && (
                                                <th className="px-4 py-3 text-center font-medium tracking-wider">
                                                    S. No
                                                </th>
                                            )}
                                            {columns.reg && (
                                                <th className="px-4 py-3 text-center font-medium tracking-wider">
                                                    Reg. No.
                                                </th>
                                            )}
                                            {columns.roll && (
                                                <th className="px-4 py-3 text-center font-medium tracking-wider">
                                                    Roll. No.
                                                </th>
                                            )}
                                            {columns.name && (
                                                <th className="px-4 py-3 text-center font-medium tracking-wider">
                                                    Name
                                                </th>
                                            )}
                                            <th className="px-4 py-3 text-center font-medium tracking-wider w-28">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredRecords.length > 0 ? (
                                            filteredRecords.map((student, index) => (
                                                <tr
                                                    key={student.roll_no}
                                                    className="hover:bg-gray-50/70 text-center transition-colors"
                                                >
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
                                                            <FontAwesomeIcon
                                                                icon={student.status ? faCheckCircle : faTimesCircle}
                                                                className="text-sm"
                                                            />
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
                                    Showing <strong className="text-gray-700">{filteredRecords.length}</strong> of {totalStudents} students
                                    {searchTerm && filteredRecords.length !== totalStudents && (
                                        <span className="text-gray-400 ml-2">(filtered)</span>
                                    )}
                                </span>
                                <Button
                                    buttonObject={buttonObject}
                                    onClick={handleSave}
                                    disabled={isSaving || totalStudents === 0}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    // Empty State
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
                        <div className="max-w-sm mx-auto flex flex-col items-center gap-3">
                            <div className="bg-gray-100 p-4 rounded-full text-gray-400">
                                <FontAwesomeIcon icon={faUsers} className="text-xl" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-700">No active tracking records</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Fill out the date, academic class year, and specific session hour filters to load the interactive roll-call grid.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Attendance;