import React, { useEffect } from 'react';
import axios from 'axios';
import Button from '../../common/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faClose } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useAdd } from '../../../hooks/useAdd';
import { useFetch } from '../../../hooks/useFetch';

const apiUrl = import.meta.env.VITE_API_URL;

function AddModal({ onSuccess }) 
{
    const { error: addError, loading: addLoading, addData } = useAdd();
    const [staffName, setStaffName] = useState('');
    const { error: fetchError, loading: fetchLoading, fetchData, data } = useFetch();

    const buttonObject1 = { name: "Cancel", icon: faClose, design: "bg-gray-400 hover:bg-gray-500 w-full" };
    const buttonObject2 = { name: addLoading ? 'Saving' : 'Save', icon: faSave, design: "bg-blue-500 hover:bg-blue-600 w-full" };

    const [formData, setFormData] = useState({
        date: '', absentStaffId: '', replacementStaffId: '', year: '', session: ''
    });

    useEffect(() => { fetchData(`${apiUrl}/api/substitution/StaffInfo`) }, []);

    useEffect(() => {
        if (formData.date && formData.year && formData.session) {
            fetchSubstitutionStaffId();
        }
    }, [formData.date, formData.year, formData.session]);

    const fetchSubstitutionStaffId = async () => {
        const response = await axios.post(`${apiUrl}/api/substitution/StaffId`, formData);
        setStaffName(response.data);
        setFormData((prevData) => ({ ...prevData, absentStaffId: response.data }));
    };

    const handleChange = async (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }) }

    const handleSave = async () => {
        const { date, year, session, absentStaffId, replacementStaffId } = formData;
        if (!date || !year || !session || !absentStaffId || !replacementStaffId) { return alert('Fill all the fields') }
        const response = await addData(`${apiUrl}/api/substitution/addData`, formData);
        if (response) { alert("Substitution added successfully"); onSuccess() }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl w-full mt-1 space-y-4">
            <h2 className="text-xl font-semibold text-blue-700 text-center border-b pb-3">Substitution Management</h2>
            {addError && <span className='text-red-600 mb-5 block'>{addError}</span>}
            {fetchError && <span className='text-red-600 mb-5 block'>{fetchError}</span>}
            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2.5">
                    <label className="block text-sm font-medium text-gray-600">Date</label>
                    <input
                        type="date"
                        name='date'
                        onChange={handleChange}
                        value={formData.date}
                        className="w-full h-9.5 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                </div>
                <div className="space-y-2.5">
                    <label className="block text-sm font-medium text-gray-600">Year</label>
                    <select
                        name='year'
                        onChange={handleChange}
                        value={formData.year}
                        className="w-full p-2 h-10 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    >
                        <option>Select</option>
                        <option>I Year</option>
                        <option>II Year</option>
                        <option>III Year</option>
                        <option>IV Year</option>
                        <option>V Year</option>
                    </select>
                </div>
                <div className="space-y-2.5">
                    <label className="block text-sm font-medium text-gray-600">Session</label>
                    <select
                        name='session'
                        onChange={handleChange}
                        value={formData.session}
                        className="w-full h-10 p-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    >
                        <option>Select</option>
                        <option>I Hour</option>
                        <option>II Hour</option>
                    </select>
                </div>
                <div className="space-y-2.5">
                    <label className="block text-sm font-medium text-gray-600">Absent Staff</label>
                    <input
                        type="text"
                        name='absentStaffId'
                        onChange={handleChange}
                        readOnly
                        value={staffName || ''}
                        className="w-full h-9.5 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                </div>
                <div className="space-y-2.5">
                    <label className="block text-sm font-medium text-gray-600">Replacement Staff</label>
                    <select
                        name='replacementStaffId'
                        onChange={handleChange}
                        value={formData.replacementStaffId}
                        className="w-full h-10 p-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    >
                        <option>Select</option>
                        {data.map((details) => (<option key={details.staffId}>{details.staffId}</option>))}
                    </select>
                </div>
                <div className='flex justify-between gap-5 mt-3'>
                    <Button buttonObject={buttonObject1} />
                    <Button buttonObject={buttonObject2} onClick={handleSave} />
                </div>
            </div>
        </div>
    )
}

export default AddModal;