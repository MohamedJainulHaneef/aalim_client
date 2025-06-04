import { useState } from 'react';
import { login } from '../services/auth';

export const useAuth = () => { 

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loginUser = async (staffId, password) => {
        
        setLoading(true); setError(null);
        
        try {
            const data = await login(staffId, password);
            setLoading(false); return data;
        } catch (error) {
            setError(error.response?.data?.message || 'Login Failed');
            setLoading(false); return null;
        }
    }
    return { loginUser, loading, error }
}