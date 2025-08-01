import React from 'react';
import { Menu, LogOut } from 'lucide-react'
import { useLocation, matchPath, useNavigate } from 'react-router-dom';

function Topbar({ onClick }) {

    const location = useLocation();
    const navigate = useNavigate();

    const menuNames = {
        '/layout/:staffId/substitutionManagement': 'Substitution Management',
        '/layout/:staffId/report': 'Report',
        '/layout/:staffId/userManagement': 'User Management',
        '/layout/:staffId/academicManagement': 'Academic Management',
        '/layout/:staffId/home': 'Home',
        '/layout/:staffId/classAttendance': 'Attendance',
        '/layout/:staffId/fileUpload': 'File Upload',
        '/layout/:staffId/leaveManagement': 'Leave Management',
    };

    let currentMenu = 'Menu';

    for (const path in menuNames) {
        if (matchPath({ path, end: true }, location.pathname)) { currentMenu = menuNames[path]; break }
    }

    return (
        <div className='py-2 px-3 flex flex-row items-center justify-between bg-gradient-to-r from-blue-500 via-blue-500 to-blue-600'>
            <button onClick={onClick} className='p-1 rounded hover:bg-white/20 transition'><Menu color='white' size={24} /></button>
            <label className='text-white font-semibold text-lg '>{currentMenu}</label>
            <button onClick={() => navigate('/')} className='p-1.5 rounded hover:bg-white/20 transition'><LogOut color='white' size={22} /></button>
        </div>
    )
}

export default Topbar;