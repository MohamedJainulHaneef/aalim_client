import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL;

export const login = async (staffId, password) => {
    const response = await axios.post(`${apiUrl}/api/users/login`, { staffId, password })
    return response.data;
} 