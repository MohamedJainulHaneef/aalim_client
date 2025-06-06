import { useState } from "react";
import { EditDataAPI } from "../services/user";

export const useEdit = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const editData = async (apiUrl, formData) => {
        setLoading(true); setError(false);
        try { 
            await EditDataAPI(apiUrl, formData) 
            setLoading(false); return;
        } catch (error) {
            setError(error.message || 'Error Occured');
            setLoading(false); return null;
        }
    }
    return { editData, loading, error }
}