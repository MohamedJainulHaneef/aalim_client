import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Login from '../assets/login.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { Notebook } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';

function Home() 
{
    const { staffId } = useParams();
    const navigate = useNavigate();
    const { fetchData, loading, error, data } = useFetch();

    useEffect(() => {
        fetchData('http://localhost:5000/api/timeTable/staffClass', { staffId })
    }, [staffId]);

    const handleButtonClick = (details) => { navigate(`/layout/${staffId}/classAttendance`, { state: { studentYear: details.year }}) }

    return (
        <div className='p-4'>
            <div className="flex flex-row items-center gap-3">
                <img src={Login} alt="Profile" className="w-10 h-10 rounded-full" />
                <p className=" font-semibold text-md text-blue-600">{data.staffName}</p>
            </div>
            {loading && (<div className="text-center py-4 text-blue-600 font-semibold"> Loading classes ... </div>)}
            {error && (<div className="text-center py-4 text-red-500 font-semibold"> Error : {error} </div>)}
            {!loading && !error && (
                <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-6">
                    {data.classes && data.classes.length == 0 ? (
                        data.classes.map((details, index) => (
                            <button
                                key={index} onClick={() => handleButtonClick(details)}
                                className={`rounded-xl mt-5 p-3 shadow-md ${index % 2 === 0 ? "bg-indigo-700" : "bg-blue-600"}`}
                            >
                                <div className='flex justify-between items-center'>
                                    <button
                                        className={`flex items-center gap-2 mb-3 transition-colors px-4 py-2 rounded-md ${index % 2 == 0 ? "bg-indigo-800 hover:bg-indigo-800" : "bg-blue-800 hover:bg-blue-700"}`}
                                        aria-label={`Subject: ${details.subject || 'N/A'}`}
                                    >
                                        <FontAwesomeIcon icon={faBook} className="text-white text-md" />
                                        <span className="text-white text-sm uppercase tracking-wide font-semibold">
                                            {details.subject || 'Unknown Subject'}
                                        </span>
                                    </button>
                                    <span className="mb-3 bg-white transition-colors px-4 text-md py-1 rounded-md">
                                        {details.year} - {details.session_1 === staffId ? '1 Hour' : '2 Hour'}
                                    </span>
                                </div>

                                <div className="bg-white rounded-lg p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <Notebook className="text-gray-800" size={13} />
                                            <p className="text-sm font-semibold uppercase text-gray-700">
                                                Subject Code : {details.subjectCode || 'N/A'}
                                            </p>
                                        </div>
                                        <div className={`text-white px-3 py-1 rounded-md text-xs font-semibold ${index % 2 === 0 ? "bg-indigo-700" : "bg-blue-600"}`}>
                                            Sem {details.semester || 'N/A'}
                                        </div>
                                    </div>
                                    <div className="flex justify-center gap-8 px-10 mt-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
                                        <div className="flex flex-col items-center py-2 flex-1">
                                            <p className={`text-sm font-medium uppercase tracking-wide ${index % 2 === 0 ? "text-indigo-700" : "text-blue-600"}`}>Total</p>
                                            <p className="mt-2 text-lg font-bold text-orange-600">60</p>
                                        </div>
                                        <div className="flex flex-col items-center py-2 flex-1">
                                            <p className={`text-sm font-medium uppercase tracking-wide ${index % 2 === 0 ? "text-indigo-700" : "text-blue-600"}`}>Present</p>
                                            <p className="mt-2 text-lg font-bold text-green-600">40</p>
                                        </div>
                                        <div className="flex flex-col items-center py-2 flex-1">
                                            <p className={`text-sm font-medium uppercase tracking-wide ${index % 2 === 0 ? "text-indigo-700" : "text-blue-600"}`}>Absent</p>
                                            <p className="mt-2 text-lg font-bold text-red-600">20</p>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))
                    ) : (
                        <p className="text-center w-full bg-red-500 text-gray-600 mt-6">No classes found.</p>
                    )}
                </div>
            )}
        </div>
    )
}

export default Home;