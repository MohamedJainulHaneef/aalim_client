import { useState } from "react";
import { fetchDataAPI } from "../services/user";

export const useFetch = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);

    const fetchData = async (url, data) => {

        setError(null); setLoading(true);
        
        try {
            const response = await fetchDataAPI(url, data);
            setLoading(false); setData(response);
            // console.log(response);
            return;
        } catch (error) {
            setError(error.message || 'Error Occured');
            setLoading(false); return null
        }
    }
    return { fetchData, loading, error, data }
}