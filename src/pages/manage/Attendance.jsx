import React from 'react';
import { faTools } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Attendance() {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-50 p-4">
            <FontAwesomeIcon icon={faTools} className="text-yellow-500 text-5xl mb-5" />
            <h1 className="text-3xl font-bold text-gray-700 mb-5">Attendance Page</h1>
            <p className="text-lg text-gray-500">This section is currently under construction. Please check back soon!</p>
        </div>
    )
}

export default Attendance