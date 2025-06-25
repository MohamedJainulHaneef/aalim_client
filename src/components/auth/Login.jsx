import React, { useState } from "react";
import JmcLogo from '../../assets/jmclogo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../hooks/useAuth';

const LoginForm = () => 
{ 
    const navigate = useNavigate();

    const { loginUser, error, loading } = useAuth();

    const [staffId, setStaffId] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!staffId || !password)
        {
            alert('User Id and Password must be filled.')
            return false;
        }
        else { 
            const data = await loginUser(staffId, password);
            if(data) { navigate(`/layout/${staffId}/home`)} 
        }
    }

    return (
        <div className="min-h-screen flex flex-col justify-center bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-600 px-8 pb-20 lg:pb-0 gap-5 lg:items-center">
            <div className="text-center text-white">
                <p className="text-md font-bold lg:text-lg">PG & RESEARCH DEPARTMENT OF ARABIC</p>
                <p className="text-md font-bold lg:text-lg">JAMAL MOHAMED COLLEGE</p>
                <p className="text-md font-bold lg:text-lg">( AUTONOMOUS )</p>
                <p className="text-md font-bold lg:text-lg">TIRUCHIRAPPALLI - 620 020 .</p>
            </div>
            <div className="rounded-2xl shadow-lg text-black bg-white py-6 px-6 lg:max-h-fit lg:py-10 lg:px-10">
                <h1 className="text-md font-bold text-center mb-6 lg:text-xl lg:mb-8">
                    AALIM SANAD ATTENDANCE
                </h1>
                <p className="text-xs text-gray-800 text-center mb-7 lg:text-lg">
                    Enter your Credentials to Access the Platform.
                </p>
                {error && <p className="text-red-600 mb-5">{error}</p>}
                <div className="flex items-center border-b-2 border-black mb-8 p-1 lg:mb-10">
                    <FontAwesomeIcon icon={faUser} className="text-gray-600 mr-2 text-sm lg:text-lg" />
                    <input
                        type="text"
                        className="w-full bg-transparent uppercase outline-none placeholder:text-gray-600 placeholder:text-md text-black lg:text-md"
                        placeholder="USERNAME"
                        onChange={(e) => setStaffId(e.target.value.toUpperCase())}
                        required
                    />
                </div>
                <div className="flex items-center border-b-2 border-black mb-8 p-1 lg:mb-12">
                    <FontAwesomeIcon icon={faLock} className="text-gray-600 mr-2 text-sm lg:text-lg" />
                    <input
                        type="password"
                        className="w-full bg-transparent outline-none placeholder:text-gray-600 placeholder:text-md text-black lg:text-md"
                        placeholder="PASSWORD"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit"
                    onClick={handleSubmit}
                    className="w-full text-white h-8 lg:h-10 bg-orange-400 hover:bg-orange-500 text-2xl font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center justify-center"
                >
                    <FontAwesomeIcon icon={faLock} className="mr-2 text-sm" />
                    <span className="text-sm font-serif uppercase">{loading ? 'Logging In' : 'Login'}</span>
                </button>
            </div>
        </div>
    )
}

export default LoginForm;