import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import Button from '../components/common/Button';
import { useFetch } from '../hooks/useFetch';
import { useAdd } from '../hooks/useAdd'
const apiUrl = import.meta.env.VITE_API_URL;

function Attendance() {
	
	const [formData, setFormData] = useState([]);
	const location = useLocation();
	const { staffId } = useParams();
	const { studentYear, courseCode, session } = location.state || {};
	const { loading: fetchLoading, error: fetchError, data, fetchData } = useFetch();
	const { loading: addLoading, error: addError, addData } = useAdd();
	const date = new Date();
	const buttonObject = { name: 'Save', icon: faSave, design: 'bg-blue-500 hover:bg-blue-600 w-24' };
	const formattedDate = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;

	useEffect(() => {
		fetchData(`${apiUrl}/api/attendance/studentsInfo`, { studentYear, session, formattedDate, staffId });
	}, [studentYear, session, staffId]);

	useEffect(() => {
		if (data && Array.isArray(data)) {
			const sortedData = [...data].sort((a, b) => a.roll_no.localeCompare(b.roll_no));
			setFormData(sortedData);
		}
	}, [data]);

	useEffect(() => { setColumns((prev) => ({ ...prev, present: true })) }, []);

	const [columns, setColumns] = useState({
		sno: true, reg: true, roll: true, name: false, present: false, absent: false,
	});

	const handleCheckboxChange = (key) => {
		setColumns((prev) => {
			const newColumns = { ...prev };
			if (key === 'present') {
				setFormData((prevData) => prevData.map((student) => ({ ...student, status: true })));
				newColumns.present = true; newColumns.absent = false;
			} else if (key === 'absent') {
				setFormData((prevData) => prevData.map((student) => ({ ...student, status: false })));
				newColumns.present = false; newColumns.absent = true;
			} else { newColumns[key] = !prev[key] }
			return newColumns
		})
	};

	const toggleAttendance = (roll_no) => {
		setFormData((prev) => {
			const updated = prev.map((student) =>
				student.roll_no === roll_no ? { ...student, status: !student.status } : student
			);
			const allPresent = updated.every((student) => student.status === true);
			const allAbsent = updated.every((student) => student.status === false);
			setColumns((prevCols) => ({ ...prevCols, present: allPresent, absent: allAbsent }));
			return updated;
		})
	};

	const handleSave = async () => {
		const finalData = {
			staffId, year: studentYear, session, date: new Date(), courseCode: courseCode,
			record: formData.map(({ roll_no, status }) => ({ roll_no, status }))
		}
		console.log(finalData)
		const response = await addData(`${apiUrl}/api/attendance/saveInfo`, finalData);
		if (response != null) { alert('Data saved successfully') }
	}

	return (
		<div className="p-5 md:p-6 bg-white space-y-6">
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg shadow flex items-center space-x-1">
					<span className="text-sm font-medium">Year :</span>
					<span className="text-sm font-semibold">{studentYear || 'II Year'}</span>
				</div>
				<div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg shadow flex items-center space-x-1">
					<span className="text-sm font-medium">Code :</span>
					<span className="text-sm font-semibold">{courseCode}</span>
				</div>
				<div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg shadow flex items-center space-x-1">
					<span className="text-sm font-medium">Date :</span>
					<span className="text-sm font-semibold">{formattedDate}</span>
				</div>
				<div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg shadow flex items-center space-x-1">
					<span className="text-sm font-medium">Hour :</span>
					<span className="text-sm font-semibold">{session}</span>
				</div>
			</div>
			<div className="bg-white p-5 rounded-lg shadow-md">
				<div className="grid grid-cols-2 md:grid-cols-6 gap-4">
					{[
						{ key: 'sno', label: 'S. No' },
						{ key: 'reg', label: 'Reg. No.' },
						{ key: 'roll', label: 'Roll No.' },
						{ key: 'name', label: 'Name' },
						{ key: 'present', label: 'All Present' },
						{ key: 'absent', label: 'All Absent' },
					].map((item) => (
						<div
							key={item.key}
							className="px-3 py-2 bg-white rounded-md border border-blue-50 shadow-sm transition-all duration-200 cursor-pointer"
						>
							<label className="flex items-center w-full cursor-pointer">
								<input
									type="checkbox"
									checked={columns[item.key]}
									onChange={() => handleCheckboxChange(item.key)}
									className="w-4 h-4 mr-2 accent-blue-500 rounded"
								/>
								<span className="text-sm font-medium text-gray-800">{item.label}</span>
							</label>
						</div>
					))}
				</div>
			</div>
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
						{formData.map((student, index) => {
							return (
								<tr
									key={student.roll_no}
									className={`transition ${index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}`}
								>
									{columns.sno && <td className="px-4 py-2 border border-blue-100">{index + 1}</td>}
									{columns.reg && (
										<td className="px-4 py-2 border border-blue-100">{student.reg_no}</td>
									)}
									{columns.roll && (
										<td className="px-4 py-2 border border-blue-100">{student.roll_no}</td>
									)}
									{columns.name && (
										<td className="px-4 py-2 border whitespace-nowrap border-blue-100">{student.stu_name}</td>
									)}
									<td className="px-4 py-2 border border-blue-100">
										<button
											onClick={() => toggleAttendance(student.roll_no)}
											className={`w-6 h-6 rounded-xs text-white font-bold ${student.status ? 'bg-green-500' : 'bg-red-500'}`}
										>
											{student.status === true ? 'P' : 'A'}
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			<div className='flex justify-end'>
				<Button buttonObject={buttonObject} onClick={handleSave} />
			</div>
		</div>
	)
}


export default Attendance;
