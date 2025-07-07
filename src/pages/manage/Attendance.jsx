import React, { useState } from 'react';
import { useAdd } from '../../hooks/useAdd';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/common/Button';

const Attendance = () => {

    const apiUrl = import.meta.env.VITE_API_URL;

    const [form, setForm] = useState({ date: '', year: '', session: '' });

    const [records, setRecords] = useState([]);
    const { addData } = useAdd();

    const [columns, setColumns] = useState({
        sno: true, reg: true, roll: true,
        name: false, present: false, absent: false
    });

    const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }) };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await addData(`${apiUrl}/api/attendance/attmanform`, form);
            if (response?.records) { setRecords(response.records) }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Error fetching records.');
        }
    }

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
            } else { newColumns[key] = !prev[key] }
            return newColumns;
        })
    }

    const toggleAttendance = (roll_no) => {
        const updated = records.map((student) =>
            student.roll_no === roll_no ? { ...student, status: !student.status } : student
        )
        const allPresent = updated.every((s) => s.status === true);
        const allAbsent = updated.every((s) => s.status === false);
        setColumns((prev) => ({ ...prev, present: allPresent, absent: allAbsent }));
        setRecords(updated);
    }

    const handleSave = async () => {
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
        }
    }

    const buttonObject = {
        name: 'Save',
        icon: faSave,
        design: 'bg-green-600 hover:bg-green-700 w-28',
    };

    return (
        <div className="w-full min-h-screen bg-gray-100 p-5 space-y-6">
            {/* Filter Form */}
            <div
                className="flex flex-wrap items-center justify-end lg:justify-between gap-4 p-4 bg-white rounded-xl shadow-md lg:gap-0"
            >
                <input
                    type="date" name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg w-full lg:w-[32%]"
                />
                <select
                    name="year" value={form.year}
                    onChange={handleChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg w-full lg:w-[32%]"
                >
                    <option value="">Select Year</option>
                    <option value="I Year">I Year</option>
                    <option value="II Year">II Year</option>
                    <option value="III Year">III Year</option>
                    <option value="IV Year">IV Year</option>
                    <option value="V Year">V Year</option>
                </select>
                <select
                    name="session"
                    value={form.session}
                    onChange={handleChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg w-full lg:w-[33%]"
                >
                    <option value="">Select Session</option>
                    <option value="I Hour">I Hour</option>
                    <option value="II Hour">II Hour</option>
                </select>
            </div>
            <div className='flex justify-end'>
                <button onClick={handleSubmit}
                    className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                    Get Data
                </button>

            </div>
            {/* Column Control */}
            <div className="bg-white p-5 rounded-lg shadow-md">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                    {[
                        { key: 'sno', label: 'S. No' },
                        { key: 'reg', label: 'Reg. No.' },
                        { key: 'roll', label: 'Roll No.' },
                        { key: 'name', label: 'Name' },
                        { key: 'present', label: 'All Present' },
                        { key: 'absent', label: 'All Absent' },
                    ].map((item) => (
                        <div key={item.key}
                            className="px-3 py-2 bg-white rounded-md border border-blue-50 shadow-sm transition-all duration-200 cursor-pointer"
                        >
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={columns[item.key]}
                                    onChange={() => handleCheckboxChange(item.key)}
                                    className="w-4 h-4 mr-2 accent-blue-500"
                                />
                                <span className="text-sm text-gray-800 font-medium">{item.label}</span>
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            {/* Attendance Table */}
            {records.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border border-blue-100 rounded-lg shadow-md text-center">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                {columns.sno && <th className="px-2 py-2 font-semibold border border-blue-100">S. No</th>}
                                {columns.reg && <th className="px-2 py-2 font-semibold border border-blue-100">Reg. No.</th>}
                                {columns.roll && <th className="px-2 py-2 font-semibold border border-blue-100">Roll. No.</th>}
                                {columns.name && <th className="px-2 py-2 font-semibold border border-blue-100">Name</th>}
                                <th className="px-2 py-2 font-semibold border border-blue-100">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800">
                            {records.map((student, index) => (
                                <tr
                                    key={student.roll_no}
                                    className={`transition ${index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}`}
                                >
                                    {columns.sno && <td className="px-4 py-2 border border-blue-100">{index + 1}</td>}
                                    {columns.reg && <td className="px-4 py-2 border border-blue-100">{student.reg_no}</td>}
                                    {columns.roll && <td className="px-4 py-2 border border-blue-100">{student.roll_no}</td>}
                                    {columns.name && (
                                        <td className="px-4 py-2 border whitespace-nowrap border-blue-100">{student.stu_name}</td>
                                    )}
                                    <td className="px-4 py-2 border border-blue-100">
                                        <button
                                            onClick={() => toggleAttendance(student.roll_no)}
                                            className={
                                                `w-6 h-6 rounded-xs text-white font-bold 
                                                ${student.status ? 'bg-green-500' : 'bg-red-500'}`
                                            }
                                        >
                                            {student.status ? 'P' : 'A'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-end mt-4">
                        <Button buttonObject={buttonObject} onClick={handleSave} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Attendance;