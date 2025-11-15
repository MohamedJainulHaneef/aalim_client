import React, { useState, useCallback } from 'react';
import { Trash2, AlertTriangle, CheckCircle, Loader, Key } from 'lucide-react';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const ALL_TABLES = ['Student', 'Attendance', 'Leave', 'TimeTable', 'Substitution', 'Course'];

const deleteApi = async (tables, password) => {
    try {
        const response = await axios.post(`${apiUrl}/api/dataDeletion/deleteData`, { tables, password });
        return response.data;
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Request failed. Please check server status.',
        }
    }
}

const App = () => {

    const [selectedTables, setSelectedTables] = useState([]);
    const [password, setPassword] = useState(''); 
    const [isDeleting, setIsDeleting] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [showConfirmation, setShowConfirmation] = useState(false);

    const toggleTableSelection = useCallback((tableName) => {
        setSelectedTables(prev => (
            prev.includes(tableName)
                ? prev.filter(name => name !== tableName)
                : [...prev, tableName]
        ));
        setStatus({ type: '', message: '' });
    }, []);

    const handleDeleteClick = () => {
        if (selectedTables.length === 0) {
            setStatus({ type: 'error', message: 'Please select at least one table to delete.' });
            return;
        }
        if (!password) {
            setStatus({ type: 'error', message: 'Please enter the administrative password to proceed.' });
            return;
        }
        setShowConfirmation(true);
    };

    const confirmDeletion = async () => {
        setShowConfirmation(false);
        setIsDeleting(true);
        setStatus({ type: 'info', message: `Starting deletion of ${selectedTables.length} table(s)...` });

        try {
            const result = await deleteApi(selectedTables, password);
            if (result.success) {
                setStatus({ type: 'success', message: result.message });
                setSelectedTables([]);
                setPassword(''); 
            } else {
                setStatus({ type: 'error', message: result.message });
            }
        } catch (error) {
            setStatus({ type: 'error', message: `An unexpected error occurred: ${error.message}` });
        } finally {
            setIsDeleting(false);
        }
    };

    const isAnyTableSelected = selectedTables.length > 0;

    let StatusIcon = null;
    let statusClasses = '';

    if (status.type === 'success') {
        StatusIcon = CheckCircle;
        statusClasses = 'bg-green-100 text-green-700 border-green-300';
    } else if (status.type === 'error') {
        StatusIcon = AlertTriangle;
        statusClasses = 'bg-red-100 text-red-700 border-red-300';
    } else if (status.type === 'info') {
        StatusIcon = Loader;
        statusClasses = 'bg-blue-100 text-blue-700 border-blue-300';
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-start justify-center p-4 sm:p-8 font-inter">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>{`.font-inter { font-family: 'Inter', sans-serif; }`}</style>

            <div className="w-full bg-white shadow-2xl rounded-xl p-6 md:p-10 border border-gray-100">
                <header className="pb-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <Trash2 className="w-8 h-8 text-red-600" />
                        <h1 className="text-3xl font-extrabold text-gray-900">Bulk Data Deletion Tool</h1>
                    </div>
                    <p className="mt-4 text-gray-500">Select one or more data collections (tables) to permanently erase all records. This action is irreversible and requires administrative authentication.</p>
                </header>

                <section className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        Collections to Purge
                        <span className="ml-2 text-sm font-medium text-red-500 bg-red-100 px-2 py-0.5 rounded-full">DANGER ZONE</span>
                    </h2>

                    {/* Table Selection Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {ALL_TABLES.map(tableName => (
                            <label key={tableName} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${selectedTables.includes(tableName) ? 'bg-red-50 border-red-400 ring-2 ring-red-200 shadow-sm' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                                <input
                                    type="checkbox"
                                    checked={selectedTables.includes(tableName)}
                                    onChange={() => toggleTableSelection(tableName)}
                                    className="h-4 w-4 text-red-600 focus:ring-red-500 rounded border-gray-300"
                                    disabled={isDeleting}
                                />
                                <span className={`ml-3 mt-1 text-md font-medium ${selectedTables.includes(tableName) ? 'text-red-700' : 'text-gray-700'}`}>{tableName}</span>
                            </label>
                        ))}
                    </div>

                    {/* Password Input Field */}
                    <div className="mt-6">
                        <label htmlFor="password" className="text-md font-medium text-gray-700 flex items-center mb-2">
                            <Key className="w-4 h-4 mr-2" /> Administrative Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setStatus({ type: '', message: '' });
                            }}
                            disabled={isDeleting}
                            placeholder="Enter secret password for confirmation"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-150"
                        />
                    </div>


                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <button
                            onClick={handleDeleteClick}
                            disabled={isDeleting || !isAnyTableSelected || !password}
                            className={`w-full flex justify-center items-center px-6 py-3 border border-transparent text-lg font-bold rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-[1.01] ${isAnyTableSelected && password && !isDeleting ? 'bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                        >
                            {isDeleting ? (<><Loader className="w-5 h-5 mr-3 animate-spin" />Deleting Data...</>) : (<><Trash2 className="w-5 h-5 mr-3" />Purge Records from Selected Tables ({selectedTables.length})</>)}
                        </button>
                    </div>

                    {status.message && (
                        <div className={`mt-6 p-4 rounded-lg border flex items-center transition-opacity duration-300 ${statusClasses}`}>
                            {StatusIcon && <StatusIcon className={`w-5 h-5 mr-3 ${status.type === 'info' ? 'animate-spin' : ''}`} />}
                            <p className="text-sm font-medium">{status.message}</p>
                        </div>
                    )}
                </section>
            </div>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 sm:p-8">
                        <div className="text-center">
                            <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
                            <h3 className="mt-4 text-xl font-bold text-gray-900">Confirm Permanent Deletion</h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">You are about to permanently delete all records from the following {selectedTables.length} table(s) :</p>
                                <ul className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-mono text-left max-h-40 overflow-y-auto">
                                    {selectedTables.map(table => <li key={table} className="list-disc ml-4">{table}</li>)}
                                </ul>
                                <p className="mt-4 font-semibold text-red-600">This action cannot be undone. Are you absolutely sure?</p>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button className="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition" onClick={() => setShowConfirmation(false)}>Cancel</button>
                            <button className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 shadow-md transition" onClick={confirmDeletion}>Yes, Delete Data</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;