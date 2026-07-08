import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { NavLink, useParams, useLocation } from 'react-router-dom';
import Login from '../../assets/login.png';
import '../../index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome,
    faChartSimple,
    faRightFromBracket,
    faUpload,
    faFileAlt,
    faTrash,
    faKey,
    faClock,
    faUsers,
    faGraduationCap,
    faCalendarCheck,
    faFileLines,
    faUserGroup,
    faUserGear
} from '@fortawesome/free-solid-svg-icons';

function SideBar({ isOpen, onClose }) {

    const [expandedMenus, setExpandedMenus] = useState({});
    const { staffId } = useParams();
    const location = useLocation();
    const isAdmin = staffId?.toUpperCase() === 'ADMIN';

    useEffect(() => {
        if (isAdmin) {
            const managePaths = [
                `/layout/${staffId}/substitutionManagement`,
                `/layout/${staffId}/userManagement`,
                `/layout/${staffId}/leaveManagement`,
                `/layout/${staffId}/academicManagement`,
                `/layout/${staffId}/attendanceManagement`,
                `/layout/${staffId}/attendanceReport`,
            ];
            if (managePaths.some(path => location.pathname.includes(path))) {
                setExpandedMenus(prev => ({ ...prev, Manage: true }));
            }
        }
    }, [location.pathname, staffId, isAdmin]);

    const toggleMenu = (menuName) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuName]: !prev[menuName]
        }));
    };

    const navItems = [
        {
            name: 'Home',
            path: `/layout/${staffId}/home`,
            icon: faHome,
            show: true,
        },
        {
            name: 'Management',
            icon: faUserGear,
            show: isAdmin,
            badge: '6',
            subItems: [
                { name: 'Substitution Management', path: `/layout/${staffId}/substitutionManagement`, icon: faClock },
                { name: 'User Management', path: `/layout/${staffId}/userManagement`, icon: faUsers },
                { name: 'Leave Management', path: `/layout/${staffId}/leaveManagement`, icon: faCalendarCheck },
                { name: 'Academic Management', path: `/layout/${staffId}/academicManagement`, icon: faGraduationCap },
                { name: 'Attendance Management', path: `/layout/${staffId}/attendanceManagement`, icon: faUserGroup },
                { name: 'Attendance Report', path: `/layout/${staffId}/attendanceReport`, icon: faFileLines },
            ]
        },
        {
            name: 'File Upload',
            path: `/layout/${staffId}/fileUpload`,
            icon: faUpload,
            show: isAdmin,
        },
        {
            name: 'Student Report',
            path: `/layout/${staffId}/studentreport`,
            icon: faFileAlt,
            show: isAdmin,
        },
        {
            name: 'Staff Report',
            path: `/layout/${staffId}/staffreport`,
            icon: faChartSimple,
            show: isAdmin,
        },
        {
            name: 'Change Password',
            path: `/layout/${staffId}/changePassword`,
            icon: faKey,
            show: true,
        },
        {
            name: 'Data Deletion',
            path: `/layout/${staffId}/dataDeletion`,
            icon: faTrash,
            show: isAdmin,
        },
    ];

    const renderNavItem = (item) => {

        if (item.subItems) {
            const isExpanded = expandedMenus[item.name] || false;
            return (
                <div key={item.name} className="mb-2">
                    <button
                        onClick={() => toggleMenu(item.name)}
                        className={`group w-full flex items-center px-3.5 py-2 rounded-lg transition-all duration-200 select-none border text-sm
                            ${isExpanded
                                ? 'bg-blue-50/70 border-blue-200 text-blue-700 font-semibold'
                                : 'bg-transparent border-transparent text-slate-700 hover:bg-slate-50/80 hover:text-slate-900'}`}
                    >
                        <FontAwesomeIcon
                            icon={item.icon}
                            className={`text-base transition-colors duration-200 mr-3 ${isExpanded ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'
                                }`}
                        />
                        <span className="flex-1 text-left tracking-normal">
                            {item.name}
                        </span>
                        <div className="flex items-center gap-2">
                            {item.badge && (
                                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    {item.badge}
                                </span>
                            )}
                            {isExpanded ? (
                                <ChevronUp className="h-4 w-4 text-blue-500 stroke-[2.5]" />
                            ) : (
                                <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600 stroke-[2]" />
                            )}
                        </div>
                    </button>

                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[600px] opacity-100 my-2' : 'max-h-0 opacity-0'}`}>
                        <div className="ml-5 pl-3 space-y-1.5 border-l border-slate-200 py-1.5">
                            {item.subItems.map((subItem) => {
                                const isSubActive = location.pathname === subItem.path;
                                return (
                                    <NavLink
                                        key={subItem.path}
                                        to={subItem.path}
                                        onClick={onClose}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium tracking-normal transition-all duration-150 select-none
                                            ${isSubActive
                                                ? 'text-white bg-blue-600 font-semibold shadow-sm'
                                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                                    >
                                        <FontAwesomeIcon
                                            icon={subItem.icon || faFileLines}
                                            className={`text-[12px] ${isSubActive ? 'text-white' : 'text-slate-400'}`}
                                        />
                                        <span>{subItem.name}</span>
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>
                </div>
            );
        }

        const isActive = location.pathname === item.path;

        return (
            <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`group relative flex items-center px-3.5 py-2 rounded-lg transition-all duration-200 select-none border mb-1.5 text-sm
                    ${isActive
                        ? 'bg-blue-600 text-white font-semibold border-blue-600 shadow-sm'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 border-transparent'}`}
            >
                <FontAwesomeIcon
                    icon={item.icon}
                    className={`text-base mr-3 transition-colors duration-200 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`}
                />
                <div className="flex-1">
                    <span className="tracking-normal block">
                        {item.name}
                    </span>
                </div>
            </NavLink>
        );
    };

    const renderLogout = () => (
        <NavLink
            to="/"
            onClick={onClose}
            className="group flex items-center px-3.5 py-2 rounded-lg transition-all duration-200 text-slate-500 hover:bg-red-50 hover:text-red-600 mt-auto border-t border-slate-100 pt-3.5 select-none text-sm"
        >
            <FontAwesomeIcon
                icon={faRightFromBracket}
                className="mr-3 text-base text-slate-400 group-hover:text-red-500 transition-colors duration-200"
            />
            <span className="tracking-normal">Logout</span>
        </NavLink>
    );

    return (
        <div className={`fixed inset-y-0 left-0 z-50 flex transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="relative w-72 h-full py-5 px-4 bg-white/95 backdrop-blur-md shadow-2xl flex flex-col overflow-y-auto border-r border-slate-200/80 hide-scrollbar">

                {/* Header branding */}
                <div className="flex items-center justify-between px-2 pb-3.5 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                            <span className="text-white text-xs font-black tracking-wider">AS</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-slate-900 font-extrabold text-xs tracking-wider uppercase leading-none mb-0.5">
                                AALIM SANAD
                            </span>
                            <span className="text-slate-400 font-medium text-[9px] tracking-normal uppercase leading-none">
                                Attendance Portal
                            </span>
                        </div>
                    </div>
                    <button
                        className="bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition p-1.5 active:scale-95 border border-slate-200"
                        onClick={onClose}
                        aria-label="Close menu"
                    >
                        <X className="h-4 w-4 stroke-[2.5]" />
                    </button>
                </div>

                {/* Profile Widget Panel */}
                <div className="relative mt-4 mb-4 p-3 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl border border-slate-200/60 group">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img
                                src={Login}
                                alt="Profile"
                                className="w-11 h-11 rounded-full object-cover bg-white ring-2 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all duration-200 shadow-sm"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="text-slate-400 text-[9px] font-black tracking-widest uppercase block mb-0.5">
                                {isAdmin ? 'ADMINISTRATOR' : 'STAFF MEMBER'}
                            </span>
                            <span className="text-slate-800 font-extrabold text-sm tracking-wide truncate block">
                                {staffId || "GUEST USER"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Nav Links Directory */}
                <nav className="flex-1 flex flex-col gap-0.5 -mx-1 px-1">
                    {navItems.filter(item => item.show).map(renderNavItem)}
                </nav>

                {/* Logout Footbar */}
                {renderLogout()}

                {/* Footer */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 text-center">
                    <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase block">
                        JMC ARABIC DEPARTMENT • v2.0
                    </span>
                </div>
            </div>

            {/* Backdrop overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[-1] transition-opacity duration-300"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}
        </div>
    );
}

export default SideBar;