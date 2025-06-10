import React, { useState } from 'react';
import Topbar from '../components/layout/TopBar';
import SideBar from '../components/layout/SideBar';
import { Outlet } from 'react-router-dom';

function OverLayout() 
{
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);

    return (
        <div className="relative min-h-screen overflow-hidden">
            {isSideBarOpen && ( <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-10" onClick={() => setIsSideBarOpen(false)}></div> )}
            {isSideBarOpen && <SideBar onClose={() => setIsSideBarOpen(false)} />}
            <div className={`relative z-0 transition duration-300 ${isSideBarOpen ? 'opacity-50 pointer-events-none' : ''}`}>
                <Topbar onClick={() => setIsSideBarOpen(true)} />
                <main> <Outlet /> </main>
            </div>
        </div>
    );
}

export default OverLayout;
















































// import React, { useState } from 'react'
// import Topbar from '../components/layout/TopBar'
// import SideBar from '../components/layout/SideBar';
// import { Outlet } from 'react-router-dom';

// function OverLayout() 
// {
//     const [isSideBarOpen, setIsSideBarOpen] = useState(false);

//     return (
//         <div className="h-screen">
//             <Topbar onClick={() => setIsSideBarOpen(true)} />
//             {isSideBarOpen && <SideBar onClose={() => setIsSideBarOpen(false)} />}
//             <main className="flex-1 p-4"> <Outlet /> </main>
//         </div>
//     )
// }

// export default OverLayout;
