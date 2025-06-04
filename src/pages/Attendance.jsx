import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import Button from '../components/common/Button';

function Attendance() 
{
	const [attendance, setAttendance] = useState({});
	const location = useLocation();
	const { studentYear } = location.state || {};
	const buttonObject = { name: 'Save', icon: faSave, design: 'bg-blue-500 hover:bg-blue-600 w-24' }

	const [columns, setColumns] = useState({
		sno: true, reg: true, roll: true, name: false, present: false, absent: false,
	});

	const handleCheckboxChange = (key) => {
		setColumns((prev) => ({ ...prev, [key]: !prev[key] }))
	};

	const students = [
		{ id: 1, reg: '24MCA001', roll: '24PS12701', name: 'Student 1' },
		{ id: 2, reg: '24MCA002', roll: '24PS12702', name: 'Student 2' },
		{ id: 3, reg: '24MCA003', roll: '24PS12703', name: 'Student 3' },
		{ id: 4, reg: '24MCA004', roll: '24PS12704', name: 'Student 4' },
		{ id: 5, reg: '24MCA005', roll: '24PS12705', name: 'Student 5' },
	];

	const toggleAttendance = (id) => {
		setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	return (
		<div className="p-5 md:p-6 bg-white space-y-6">
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg shadow flex items-center space-x-1">
					<span className="text-sm font-medium">Year :</span>
					<span className="text-sm font-semibold">{studentYear || 'II Year'}</span>
				</div>
				<div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg shadow flex items-center space-x-1">
					<span className="text-sm font-medium">Code :</span>
					<span className="text-sm font-semibold">23MCACAC1</span>
				</div>
				<div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg shadow flex items-center space-x-1">
					<span className="text-sm font-medium">Date :</span>
					<span className="text-sm font-semibold">20.11.3026</span>
				</div>
				<div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg shadow flex items-center space-x-1">
					<span className="text-sm font-medium">Hour :</span>
					<span className="text-sm font-semibold">I Hour</span>
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
						{students.map((student, index) => {
							const isPresent = attendance[student.id] ?? true;
							return (
								<tr
									key={student.id}
									className={`transition ${index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}`}
								>
									{columns.sno && <td className="px-4 py-2 border border-blue-100">{index + 1}</td>}
									{columns.reg && (
										<td className="px-4 py-2 border border-blue-100">{student.reg}</td>
									)}
									{columns.roll && (
										<td className="px-4 py-2 border border-blue-100">{student.roll}</td>
									)}
									{columns.name && (
										<td className="px-4 py-2 border border-blue-100">{student.name}</td>
									)}
									<td className="px-4 py-2 border border-blue-100">
										<button
											onClick={() => toggleAttendance(student.id)}
											className={`w-6 h-6 rounded-xs text-white font-bold transition ${isPresent ? 'bg-green-500' : 'bg-red-500'
												}`}
										>
											{isPresent ? 'P' : 'A'}
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			<div className='flex justify-end'>
				<Button buttonObject={buttonObject} />
			</div>
		</div>
	)
}


export default Attendance;
