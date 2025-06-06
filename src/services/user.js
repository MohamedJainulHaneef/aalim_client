import axios from 'axios';

export const addDataAPI = async (apiUrl, formData) => {
    const response = await axios.post(`${apiUrl}`, formData);
    return response.data;
}

export const fetchDataAPI = async (apiUrl, formData) => {
    // console.log('Hello')
    const response = await axios.post(`${apiUrl}`, formData )
    return response.data;
}

export const EditDataAPI = async (apiUrl, formData) => {
    const response = await axios.put(`${apiUrl}`, formData)
    return response.data;
}

export const deleteDataAPI = async (apiUrl, id) => {
    await axios.delete(`${apiUrl}`, { data: { id } }); return;
}