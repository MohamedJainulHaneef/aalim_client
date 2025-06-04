import { useState } from "react";
import { addDataAPI } from "../services/user";

export const useAdd = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addData = async (formData, apiUrl) => { 

        setLoading(true); setError(null);

        try {
            const data = await addDataAPI(formData, apiUrl);
            setLoading(false); return data;
        } catch (error) {
            setError(error.response?.data?.message || 'Error occurred');
            setLoading(false); return null;
        }
    }
    return { addData, loading, error }
}