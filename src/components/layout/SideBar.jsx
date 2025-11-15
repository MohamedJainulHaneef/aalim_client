import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { NavLink, useParams } from 'react-router-dom';
import Login from '../../assets/login.png';
import '../../index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChartSimple, faUserGear, faRightFromBracket, faUpload, faFileAlt, faTrash, faKey } from '@fortawesome/free-solid-svg-icons';

function SideBar({ onClose }) {
    
    const [manageOpen, setManageOpen] = useState(false);

    const { staffId } = useParams();

    const navItems = [
        {
            name: 'Home',
            path: `/layout/${staffId}/home`,
            icon: faHome,
            show: true
        },
        {
            name: 'Manage',
            icon: faUserGear,
            show: staffId === 'ADMIN',
            subItems: [
                { name: 'Substitution Management', path: `/layout/${staffId}/substitutionManagement` },
                { name: 'User Management', path: `/layout/${staffId}/userManagement` },
                { name: 'Leave Management', path: `/layout/${staffId}/leaveManagement` },
                { name: 'Academic Management', path: `/layout/${staffId}/academicManagement` },
                { name: 'Course Management', path: `/layout/${staffId}/courseManagement` },
                { name: 'Attendance Management', path: `/layout/${staffId}/attendanceManagement` },
                { name: 'Attendance Report', path: `/layout/${staffId}/attendanceReport` },
            ]
        },
        {
            name: 'File Upload',
            path: `/layout/${staffId}/fileUpload`,
            icon: faUpload,
            show: staffId === 'ADMIN'
        },
        {
            name: 'Student Report',
            path: `/layout/${staffId}/studentreport`,
            icon: faFileAlt,
            show: staffId === 'ADMIN'
        },
        {
            name: 'Staff Report',
            path: `/layout/${staffId}/staffreport`,
            icon: faChartSimple,
            show: staffId === 'ADMIN'
        },
        {
            name: 'Change Password',
            path: `/layout/${staffId}/changePassword`,
            icon: faKey,
            show: true
        },
        {
            name: 'Data Deletion',
            path: `/layout/${staffId}/dataDeletion`,
            icon: faTrash,
            show: staffId === 'ADMIN'
        },
        {
            name: 'Logout',
            path: '/',
            icon: faRightFromBracket,
            show: true
        },
    ];

    const renderNavItem = (item) => {
        if (item.subItems) {
            return (
                <div key={item.name}>
                    <button
                        onClick={() => setManageOpen(!manageOpen)}
                        className="group w-full flex items-center px-3 py-2 rounded-lg text-white hover:bg-white/20 transition-colors duration-300"
                    >
                        <FontAwesomeIcon
                            icon={item.icon}
                            className="bg-white text-blue-500 p-1.5 rounded-md mr-3 text-sm h-4 w-4 group-hover:text-white group-hover:bg-blue-500 transition-all duration-300"
                        />
                        <span className="text-md font-semibold group-hover:text-white transition-colors duration-300">
                            {item.name}
                        </span>
                        {manageOpen ? (
                            <ChevronUp className="ml-auto text-white h-4 w-4 transition-transform duration-300" />
                        ) : (
                            <ChevronDown className="ml-auto text-white h-4 w-4 transition-transform duration-300" />
                        )}
                    </button>
                    <div className={`ml-3 overflow-hidden transition-all duration-300 ${manageOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`} >
                        <div className="pl-2 ml-2 mt-2 flex flex-col gap-1 border-l border-white/30">
                            {item.subItems.map((subItem) => (
                                <NavLink
                                    key={subItem.path}
                                    to={subItem.path}
                                    onClick={onClose}
                                    className={({ isActive }) =>
                                        `group flex items-center gap-3 px-1 py-1.5 rounded-md text-white text-sm font-medium hover:bg-white/20 hover:text-blue-100 transition-colors duration-200 
                                        ${isActive ? 'bg-white/30 text-blue-200 shadow-inner border-l-2 border-white' : ''}`
                                    }
                                >
                                    <span className="ml-2 text-md p-1 font-semibold">{subItem.name}</span>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <NavLink key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                    `group flex items-center px-3 py-2 hover:bg-white/20 rounded-md transition-colors 
                    ${isActive ? 'bg-white shadow-md' : ' hover:bg-gray-100 hover:text-white'}`
                }
            >
                {({ isActive }) => (
                    <>
                        <FontAwesomeIcon
                            icon={item.icon}
                            className={`rounded-md p-1.5 mr-3 text-sm h-4 w-4 transition-colors 
                                ${isActive ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 group-hover:text-white group-hover:bg-blue-500'}`
                            }
                        />
                        <span
                            className={`text-md font-semibold transition-colors 
                                ${isActive ? 'text-blue-500 hover:text-white' : 'text-white group-hover:text-white'}`
                            }
                        >
                            {item.name}
                        </span>
                    </>
                )}
            </NavLink>
        )
    }

    return (
        <div className="fixed top-0 left-0 h-full w-68 py-5 px-3 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-500 z-30 shadow-xl overflow-x-scroll transition-transform duration-300 hide-scrollbar">
            <button className="absolute top-4 right-4 hover:bg-white/40 transition p-1" onClick={onClose}>
                <X className="h-5 w-5 text-white" />
            </button>
            <div className="flex flex-col items-center gap-3 mt-12">
                <img src={Login} alt="Profile" className="w-16 h-16 rounded-full" />
                <span className="text-white font-semibold text-md uppercase">{staffId}</span>
            </div>
            <nav className="mt-5 flex flex-col gap-3">
                {navItems.filter(item => item.show).map(renderNavItem)}
            </nav>
        </div>
    )
}

export default SideBar;