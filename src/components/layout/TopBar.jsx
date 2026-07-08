import React from 'react';
import { Menu, LogOut, Shield, User, ChevronRight, LayoutGrid, Settings } from 'lucide-react';
import { useLocation, matchPath, useNavigate, useParams } from 'react-router-dom';

function Topbar({ onMenuClick }) {

    const location = useLocation();
    const navigate = useNavigate();
    const { staffId } = useParams();

    const menuNames = {
        '/layout/:staffId/substitutionManagement': 'Substitution Management',
        '/layout/:staffId/report': 'Reports & Analytics',
        '/layout/:staffId/userManagement': 'User Management',
        '/layout/:staffId/academicManagement': 'Academic Management',
        '/layout/:staffId/home': 'Dashboard',
        '/layout/:staffId/classAttendance': 'Attendance Tracking',
        '/layout/:staffId/fileUpload': 'Document Center',
        '/layout/:staffId/leaveManagement': 'Leave Management',
    };

    let currentMenu = 'Overview';

    for (const path in menuNames) {
        if (matchPath({ path, end: true }, location.pathname)) {
            currentMenu = menuNames[path];
            break;
        }
    }

    const isAdmin = staffId?.toUpperCase() === 'ADMIN';
    const isRoot = !staffId || staffId.trim() === '';

    const getInitials = (name) => {
        if (!name || name === 'User') return 'U';
        return name.charAt(0).toUpperCase();
    };

    return (
        <header className='sticky top-0 z-30 h-18 w-full px-4 flex items-center justify-between bg-linear-to-r from-slate-50 via-white to-slate-50/80 backdrop-blur-sm border-b border-slate-200/80 shadow-xs select-none'>

            {/* Left Section: Brand & Navigation */}
            <div className="flex items-center gap-6">
                <button
                    onClick={onMenuClick}
                    className='group relative p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50/80 border border-slate-200/60 hover:border-blue-200 active:scale-95 transition-all duration-200 hover:shadow-xs'
                    aria-label="Toggle Navigation Menu"
                >
                    <Menu size={20} className="stroke-2 group-hover:scale-105 transition-transform duration-200" />
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </button>

                {/* Breadcrumb Module */}
                <div className="flex items-center gap-3 font-sans">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100/70 rounded-lg border border-slate-200/50">
                        <LayoutGrid size={14} className="text-blue-600" />
                        <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase hidden sm:inline">
                            Workspace
                        </span>
                        <ChevronRight size={14} className="text-slate-400 hidden sm:inline" />
                        <span className="text-sm font-bold text-slate-800 tracking-tight">
                            {currentMenu}
                        </span>
                    </div>
                </div>
            </div>

            {/* Right Section: User Profile & Actions */}
            <div className="flex items-center gap-4">

                {/* Professional User Profile Pill */}
                <div className="flex items-center gap-3 px-2 py-1.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow duration-200">
                    {/* Avatar Block with Brand Blue Gradients */}
                    <div className={`relative flex items-center justify-center w-9 h-9 rounded-lg ${isAdmin
                        ? 'bg-linear-to-br from-indigo-500 via-indigo-600 to-indigo-700 text-white'
                        : 'bg-linear-to-br from-blue-500 via-blue-700 to-blue-600 text-white'
                        } shadow-xs`}>
                        {isAdmin ? (
                            <Shield size={16} className="stroke-[2.5]" />
                        ) : (
                            <span className="text-sm font-bold tracking-wide">
                                {getInitials(staffId)}
                            </span>
                        )}
                        {isAdmin && (
                            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                        )}
                    </div>

                    {/* User Informational Stack */}
                    <div className="flex flex-col leading-tight pr-1">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                                {isAdmin ? 'Admin' : isRoot ? 'Guest' : 'Staff'}
                            </span>
                            {isAdmin && (
                                <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[8px] font-extrabold rounded-md uppercase tracking-wider border border-blue-100">
                                    Elevated
                                </span>
                            )}
                        </div>
                        <span className="text-xs font-bold text-slate-800 tracking-wide truncate max-w-[100px]">
                            {staffId || 'Guest User'}
                        </span>
                    </div>
                </div>

                <div className="h-8 w-px bg-linear-to-b from-transparent via-slate-200 to-transparent" />

                {/* System Utility Actions Group */}
                <div className="flex items-center gap-2">
                    {/* Terminate Session Control */}
                    <button
                        onClick={() => navigate('/')}
                        className='group relative flex items-center gap-2.5 h-10 px-4 rounded-lg text-slate-600 hover:text-red-600 bg-white hover:bg-red-50/80 border border-slate-200/80 hover:border-red-200 font-bold text-xs tracking-wider uppercase transition-all duration-200 hover:shadow-xs active:scale-95 overflow-hidden'
                        aria-label="Sign Out"
                    >
                        <span className="relative z-10 hidden md:inline">Sign Out</span>
                        <LogOut size={15} className="relative z-10 stroke-[2.25] text-slate-400 group-hover:text-red-500 transition-colors duration-200" />

                        {/* Interactive red action highlight */}
                        <span className="absolute inset-0 bg-linear-to-r from-red-50/0 via-red-50/0 to-red-50/0 group-hover:from-red-50/10 group-hover:via-red-50/20 group-hover:to-red-50/0 transition-all duration-500" />
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Topbar;