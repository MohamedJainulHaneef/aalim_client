import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Login from '../assets/login.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { Notebook, Loader2 } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';

const apiUrl = import.meta.env.VITE_API_URL;

function Home() {

    const { staffId } = useParams();
    const navigate = useNavigate();
    const { fetchData, loading, error, data } = useFetch();

    useEffect(() => {
        fetchData(`${apiUrl}/api/timeTable/staffClass`, { staffId });
    }, [staffId]);

    const staffObj = Array.isArray(data) ? data.find(d => d.staffName) : {};
    const classList = Array.isArray(data) ? data.filter(d => d.year) : [];

    const handleButtonClick = (details) => {
        navigate(`/layout/${staffId}/classAttendance`, {
            state: {
                studentYear: details.year,
                courseCode: details.course_code,
                session: details.session
            }
        })
    }

    return (
        <div className="p-3 font-sans antialiased text-slate-800">
            <div className="mx-auto">
                {/* Profile Header */}
                <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-200/60 mb-6">
                    <img src={Login} alt="Profile" className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-50" />
                    <div>
                        <p className="font-bold text-sm text-blue-600 tracking-tight">
                            {staffObj?.staffName || 'Unknown Staff'}
                        </p>
                    </div>
                </div>

                {loading && (
                    <div className="flex flex-col items-center justify-center py-12 gap-2 text-blue-600 font-semibold text-sm">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        Loading classes ...
                    </div>
                )}

                {error && (
                    <div className="text-center py-8 text-red-500 font-semibold bg-red-50/50 border border-red-100 rounded-xl text-sm">
                        Error: {error}
                    </div>
                )}

                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {classList.length > 0 ? (
                            classList.map((details, index) => {

                                const totalCount = Number(details.total) || 0;
                                const presentCount = Number(details.presentees) || 0;
                                const presentPercent = totalCount > 0 ? (presentCount / totalCount) * 100 : 0;

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleButtonClick(details)}
                                        className="group text-left bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    >
                                        {/* Card Top Banner Area */}
                                        <div className={`p-4 ${index % 2 === 0 ? 'bg-indigo-700' : 'bg-blue-600'} flex items-center justify-between gap-4 transition-colors`}>
                                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg shrink min-w-0 ${index % 2 === 0 ? 'bg-indigo-800/60' : 'bg-blue-800/40'}`}>
                                                <FontAwesomeIcon
                                                    icon={faBook}
                                                    className="text-white text-xs shrink-0"
                                                />
                                                <span className="text-white text-xs uppercase tracking-wide font-semibold truncate max-w-full">
                                                    {details.course_title}
                                                </span>
                                            </div>
                                            <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold px-3 py-1 rounded-md shadow-sm shrink-0">
                                                {details.year}
                                            </span>
                                        </div>

                                        {/* Card Content Data Body */}
                                        <div className="p-4 bg-white w-full flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between gap-4 mb-4">
                                                    <div className="flex items-center gap-1.5 min-w-0">
                                                        <Notebook className="text-slate-400 shrink-0" size={14} />
                                                        <p className="text-xs font-bold uppercase text-slate-600 truncate">
                                                            Subject Code : {details.course_code}
                                                        </p>
                                                    </div>
                                                    <div className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wide text-white uppercase shrink-0 ${index % 2 === 0 ? 'bg-indigo-600' : 'bg-blue-500'}`}>
                                                        {details.session}
                                                    </div>
                                                </div>

                                                {/* Attendance Statistics Metrics */}
                                                <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-center">
                                                    <div className="flex flex-col items-center py-1">
                                                        <p className={`text-[10px] font-bold uppercase tracking-wider ${index % 2 === 0 ? 'text-indigo-600' : 'text-blue-600'}`}>
                                                            Total
                                                        </p>
                                                        <p className="mt-1 text-base font-black text-orange-600 leading-none">{details.total}</p>
                                                    </div>
                                                    <div className="flex flex-col items-center py-1 border-x border-slate-200">
                                                        <p className={`text-[10px] font-bold uppercase tracking-wider ${index % 2 === 0 ? 'text-indigo-600' : 'text-blue-600'}`}>
                                                            Present
                                                        </p>
                                                        <p className="mt-1 text-base font-black text-emerald-600 leading-none">{details.presentees}</p>
                                                    </div>
                                                    <div className="flex flex-col items-center py-1">
                                                        <p className={`text-[10px] font-bold uppercase tracking-wider ${index % 2 === 0 ? 'text-indigo-600' : 'text-blue-600'}`}>
                                                            Absent
                                                        </p>
                                                        <p className="mt-1 text-base font-black text-rose-600 leading-none">{details.absentees}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Visual Percentage Breakdown Bar */}
                                            <div className="mt-4">
                                                <div className="w-full bg-rose-500 rounded-full h-2 overflow-hidden flex">
                                                    <div
                                                        className="h-full bg-emerald-500 transition-all duration-500 rounded-l-full"
                                                        style={{ width: `${presentPercent}%` }}
                                                    />
                                                </div>
                                                <div className="flex justify-between items-center mt-1.5 text-[10px] font-medium text-slate-400">
                                                    <span>{presentPercent.toFixed(0)}% present rate</span>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        ) : (
                            <p className="text-center w-full text-red-700 mt-2 p-4 bg-red-50 border border-red-100 rounded-xl text-sm font-medium md:col-span-2 lg:col-span-3">
                                No classes found for today.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home;