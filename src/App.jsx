import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import OverLayout from './layouts/OverLayout';
import Home from './pages/Home'
import Report from './pages/Report'
import User from './pages/manage/User';
import Attendance from './pages/Attendance';
import Leave from './pages/manage/Leave';
import Academic from './pages/manage/Academic';
import Substitution from './pages/manage/Substitution';

const App = () => 
{
	return (
		<Routes>
			<Route path='/' element={<Login />} />
			<Route path='/layout' element={<OverLayout />}>
				<Route index element={<Navigate to=':staffId/home' replace />} />
				<Route path=':staffId/home' element={<Home />} />
				<Route path=':staffId/classAttendance' element={<Attendance />} />
				<Route path=':staffId/profile' element={<Report />} />
				<Route path=':staffId/academicManagement' element={<Academic />} />
				<Route path=':staffId/userManagement' element={<User />} />
				<Route path=':staffId/leaveManagement' element={<Leave />} />
				<Route path=':staffId/substitutionManagement' element={<Substitution />} />
			</Route>
		</Routes>
	);
}; 

export default App;
