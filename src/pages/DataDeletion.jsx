import React, { useState, useCallback } from 'react';
import { Trash2, AlertTriangle, CheckCircle2, Loader2, Key, Server, Database, ShieldAlert, X } from 'lucide-react';
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
            message: error.response?.data?.message || 'Connection failed. Please check server or network status.',
        };
    }
};

const DataDeletion = () => {

    const [selectedTables, setSelectedTables] = useState([]);
    const [password, setPassword] = useState('');
    const [confirmText, setConfirmText] = useState('');
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

    const selectAllTables = () => {
        if (selectedTables.length === ALL_TABLES.length) {
            setSelectedTables([]);
        } else {
            setSelectedTables([...ALL_TABLES]);
        }
    };

    const handleDeleteClick = () => {
        if (selectedTables.length === 0) {
            setStatus({ type: 'error', message: 'Please select at least one database collection to purge.' });
            return;
        }
        if (!password) {
            setStatus({ type: 'error', message: 'Administrative credentials are required to continue.' });
            return;
        }
        setShowConfirmation(true);
    };

    const confirmDeletion = async () => {
        if (confirmText !== 'DELETE') return;
        setShowConfirmation(false);
        setConfirmText('');
        setIsDeleting(true);
        setStatus({ type: 'info', message: `Initializing safe teardown for ${selectedTables.length} collection(s)...` });

        try {
            const result = await deleteApi(selectedTables, password);
            if (result.success) {
                setStatus({ type: 'success', message: result.message || 'Data successfully purged from the infrastructure.' });
                setSelectedTables([]);
                setPassword('');
            } else {
                setStatus({ type: 'error', message: result.message });
            }
        } catch (error) {
            setStatus({ type: 'error', message: `An unexpected system error occurred: ${error.message}` });
        } finally {
            setIsDeleting(false);
        }
    };

    const isAnyTableSelected = selectedTables.length > 0;

    return (
        <div className="p-3 selection:bg-red-500 selection:text-white">
            <div className="w-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden border border-slate-100">

                {/* Header System Banner */}
                <header className="bg-linear-to-r from-blue-600 to-blue-700 text-white p-5 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start space-x-4">
                        <div className="bg-white/10 p-3 rounded-xl border border-white/20 text-white mt-1 shrink-0">
                            <Database className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-lg md:text-2xl font-bold tracking-tight text-white">Data Lifecycle Console</h1>
                                <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/20 text-white border border-white/30 px-2 py-0.5 rounded-md">Destructive Path</span>
                            </div>
                            <p className="mt-1.5 text-xs md:text-sm text-blue-100 max-w-xl leading-relaxed">
                                Administrative tool designed for dropping application schema collections. Proceed with absolute certainty—actions bypass system recycles.
                            </p>
                        </div>
                    </div>
                </header>

                <div className="p-4 md:p-8">
                    {/* Workspace Control */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-slate-500">Target Environment Schema</h2>
                        <button
                            type="button"
                            onClick={selectAllTables}
                            disabled={isDeleting}
                            className="text-xs font-medium text-slate-600 hover:text-slate-900 transition underline decoration-dotted underline-offset-4 disabled:opacity-50"
                        >
                            {selectedTables.length === ALL_TABLES.length ? 'Deselect All' : 'Select All Collections'}
                        </button>
                    </div>

                    {/* Table Selection Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {ALL_TABLES.map(tableName => {
                            const isChecked = selectedTables.includes(tableName);
                            return (
                                <label
                                    key={tableName}
                                    className={`group relative flex items-center justify-between p-3.5 border rounded-lg cursor-pointer select-none transition-all duration-200 ${isChecked
                                        ? 'bg-red-50/40 border-red-200 ring-1 ring-red-400 shadow-[0_2px_12px_rgba(239,68,68,0.04)]'
                                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => toggleTableSelection(tableName)}
                                            className="h-4 w-4 text-red-600 focus:ring-red-500 rounded border-slate-300 cursor-pointer accent-red-600"
                                            disabled={isDeleting}
                                        />
                                        <span className={`text-sm font-semibold transition-colors ${isChecked ? 'text-red-900' : 'text-slate-700'}`}>
                                            {tableName}
                                        </span>
                                    </div>
                                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded transition-all ${isChecked ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
                                        {isChecked ? 'MARKED' : 'STABLE'}
                                    </span>
                                </label>
                            );
                        })}
                    </div>

                    {/* Credentials Section */}
                    <div className="mt-6 max-w-xl">
                        <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center mb-3">
                            <Key className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Admin Password
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
                            placeholder="Enter master decryption key to authenticate process"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm rounded-lg placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition duration-150 disabled:opacity-60"
                        />
                    </div>

                    {/* Action Hub */}
                    <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-center sm:text-left">
                            <p className="text-xs text-slate-400">Staged Operations</p>
                            <p className="text-sm font-bold text-slate-700">
                                {selectedTables.length} collection{selectedTables.length !== 1 ? 's' : ''} queueing data erasure
                            </p>
                        </div>

                        <button
                            onClick={handleDeleteClick}
                            disabled={isDeleting || !isAnyTableSelected || !password}
                            className={`w-full sm:w-auto flex justify-center items-center px-6 py-3 text-sm font-bold rounded-xl transition-all duration-150 shadow-sm ${isAnyTableSelected && password && !isDeleting
                                ? 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                                }`}
                        >
                            {isDeleting ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Executing Delete...</>
                            ) : (
                                <><Trash2 className="w-4 h-4 mr-2" /> Delete Tables</>
                            )}
                        </button>
                    </div>

                    {/* Runtime Status Alerts */}
                    {status.message && (
                        <div className={`mt-6 p-4 rounded-xl border flex items-start text-sm transition-all animate-fadeIn ${status.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-200/60' :
                            status.type === 'error' ? 'bg-rose-50 text-rose-900 border-rose-200/60' :
                                'bg-blue-50 text-blue-900 border-blue-200/60'
                            }`}>
                            <div className="mt-0.5 mr-3 shrink-0">
                                {status.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                                {status.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-600" />}
                                {status.type === 'info' && <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />}
                            </div>
                            <p className="font-medium tracking-wide">{status.message}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Shield Confirmation Modal System */}
            {showConfirmation && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={(e) => e.target === e.currentTarget && setShowConfirmation(false)}
                >
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-scaleUp">

                        {/* Header Section */}
                        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
                            <div className="flex items-center justify-center">
                                <div className="bg-red-50 p-3 rounded-full">
                                    <ShieldAlert className="text-red-500 text-xl" />
                                </div>
                            </div>
                            <h2 className="mt-4 text-center text-lg font-bold text-slate-800">Elevated Security Gateway</h2>
                            <p className="mt-2 text-center text-xs text-slate-500 leading-relaxed">
                                You are executing an explicit pipeline request to delete row records inside the following collections:
                            </p>

                            {/* Collections / Tables List */}
                            <div className="mt-3 flex flex-wrap justify-center gap-1.5 p-3 bg-slate-50 rounded-xl border border-slate-100 max-h-24 overflow-y-auto">
                                {selectedTables.map((table) => (
                                    <span key={table} className="text-[11px] font-mono bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                                        {table}
                                    </span>
                                ))}
                            </div>

                            <p className="mt-3 text-center text-xs font-semibold text-red-600">
                                This action destroys indexes and data models irreversibly.
                            </p>
                        </div>

                        {/* Body & Verification Section */}
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="block text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                    Type <span className="text-slate-800 font-mono select-all font-extrabold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">DELETE</span> to unlock operation
                                </label>
                                <input
                                    type="text"
                                    placeholder="Confirm syntax match"
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-mono rounded-lg text-center focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowConfirmation(false)}
                                    className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm rounded-lg transition-all duration-200"
                                >
                                    <faTimes className="mr-2" />
                                    Abort
                                </button>
                                <button
                                    onClick={confirmDeletion}
                                    disabled={confirmText !== 'DELETE'}
                                    className={`flex-1 px-4 py-2.5 font-medium text-sm rounded-lg transition-all duration-200 shadow-md ${confirmText === 'DELETE'
                                        ? 'bg-red-600 hover:bg-red-700 text-white hover:shadow-lg active:scale-[0.98]'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                        }`}
                                >
                                    <faTrashAlt className="mr-2" />
                                    Confirm Erase Sequence
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default DataDeletion;