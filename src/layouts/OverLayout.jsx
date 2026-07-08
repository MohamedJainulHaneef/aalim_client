import React, { useState } from 'react';
import Topbar from '../components/layout/TopBar';
import SideBar from '../components/layout/SideBar';
import { Outlet } from 'react-router-dom';

function OverLayout() {
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);

    return (
        <div className="relative min-h-screen overflow-hidden font-sans antialiased text-slate-800">
            {/* Soft, modern dimming backdrop */}
            <div
                className={`fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 transition-opacity duration-300 ${isSideBarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsSideBarOpen(false)}
            />

            {/* Sidebar Drawer */}
            <SideBar isOpen={isSideBarOpen} onClose={() => setIsSideBarOpen(false)} />

            {/* Main Application Area */}
            <div className="relative z-0 min-h-screen flex flex-col">
                <Topbar onMenuClick={() => setIsSideBarOpen(true)} />
                {/* Content Wrapper */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full mx-auto">
                    <div className="rounded-2xl border border-slate-200/80 shadow-sm p-5 min-h-[calc(100vh-7rem)]">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default OverLayout;