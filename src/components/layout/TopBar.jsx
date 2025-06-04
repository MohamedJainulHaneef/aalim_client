import React from 'react';
import { Menu, LogOut } from 'lucide-react'
import { useLocation } from 'react-router-dom';

function Topbar({ onClick }) 
{
    const location = useLocation();

    const menuNames = {
        '/layout/home' : 'Home',
        '/layout/profile' : 'Profile',
        '/layout/usermanagement' : 'User Management',
    }
    
    const currentMenu = menuNames[location.pathname] || 'Menu';

    return (
        <div className='py-2 px-3 flex flex-row items-center justify-between bg-gradient-to-r from-blue-500 via-blue-500 to-blue-600'>
            <button onClick={onClick} className='p-1 rounded hover:bg-white/20 transition'><Menu color='white' size={24} /></button>
            <label className='text-white font-semibold text-lg '>{currentMenu}</label>
            <button className='p-1.5 rounded hover:bg-white/20 transition'><LogOut color='white' size={22} /></button>
        </div>
    )
}

export default Topbar;