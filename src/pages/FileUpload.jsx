import React, { useState } from 'react';
import { UploadCloud, File, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

function FileUpload() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [file1, setFile1] = useState(null);
    const [studentFile, setStudentFile] = useState(null);
    const [courseFile, setCourseFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState({});

    const handleFileChange = (setter) => (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                alert('File size must be less than 10MB');
                return;
            }
            setter(file);
            setUploadStatus(prev => ({ ...prev, [file.name]: 'pending' }));
        }
    };

    const handleUpload = async (file, endpoint, successMessage, errorMessage) => {
        if (!file) {
            alert('Please select a file');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post(`${apiUrl}${endpoint}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadStatus(prev => ({
                        ...prev,
                        [file.name]: { status: 'uploading', progress: percentCompleted }
                    }));
                }
            });

            setUploadStatus(prev => ({
                ...prev,
                [file.name]: { status: 'success', message: res.data || successMessage }
            }));
            alert(res.data || successMessage);
        } catch (err) {
            const message = err?.response?.data || errorMessage;
            setUploadStatus(prev => ({
                ...prev,
                [file.name]: { status: 'error', message }
            }));
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    const FileUploadCard = ({
        title,
        description,
        file,
        setFile,
        onUpload,
        color = 'blue',
        acceptedFormats = '.xlsx,.xls,.csv'
    }) => {
        const status = file ? uploadStatus[file.name] : null;
        const isUploading = status?.status === 'uploading';
        const isSuccess = status?.status === 'success';
        const isError = status?.status === 'error';

        const colorClasses = {
            blue: {
                border: 'border-blue-100 hover:border-blue-300',
                bg: 'bg-blue-50',
                button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/20',
                icon: 'text-blue-500',
                progress: 'bg-blue-600',
            },
            green: {
                border: 'border-green-100 hover:border-green-300',
                bg: 'bg-green-50',
                button: 'bg-green-600 hover:bg-green-700 focus:ring-green-500/20',
                icon: 'text-green-500',
                progress: 'bg-green-600',
            },
            purple: {
                border: 'border-purple-100 hover:border-purple-300',
                bg: 'bg-purple-50',
                button: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500/20',
                icon: 'text-purple-500',
                progress: 'bg-purple-600',
            }
        };

        const colors = colorClasses[color] || colorClasses.blue;
        const Icon = UploadCloud;

        return (
            <div className={`bg-white rounded-xl shadow-sm border ${colors.border} transition-all duration-200 flex flex-col justify-between overflow-hidden`}>
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4 gap-2">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${colors.bg}`}>
                                <Icon className={`h-5 w-5 ${colors.icon}`} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
                                <p className="text-xs text-gray-500">{description}</p>
                            </div>
                        </div>
                        {isSuccess && (
                            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-xs font-medium shrink-0">
                                <CheckCircle className="h-3.5 w-3.5" />
                                Uploaded
                            </div>
                        )}
                        {isError && (
                            <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2.5 py-1 rounded-full text-xs font-medium shrink-0">
                                <XCircle className="h-3.5 w-3.5" />
                                Failed
                            </div>
                        )}
                    </div>

                    <label className="block w-full cursor-pointer group">
                        <input
                            type="file"
                            onChange={handleFileChange(setFile)}
                            className="hidden"
                            accept={acceptedFormats}
                            disabled={isUploading}
                        />
                        <div className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${file
                            ? 'border-blue-200 bg-blue-50/30'
                            : 'border-gray-200 group-hover:border-gray-300 group-hover:bg-gray-50/50'
                            } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                            {file ? (
                                <div className="flex flex-col items-center justify-center gap-1">
                                    <File className="h-6 w-6 text-blue-500" />
                                    <span className="text-xs font-medium text-gray-700 truncate max-w-full px-2 mt-1">
                                        {file.name}
                                    </span>
                                    <span className="text-[11px] text-gray-400">
                                        ({(file.size / 1024).toFixed(1)} KB)
                                    </span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-1.5 py-1">
                                    <UploadCloud className={`h-6 w-6 text-gray-400`} />
                                    <span className="text-xs text-gray-600">Click to select a file</span>
                                    <span className="text-[11px] text-gray-400 font-mono tracking-wide">{acceptedFormats}</span>
                                </div>
                            )}
                        </div>
                    </label>

                    {isUploading && (
                        <div className="mt-4">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Uploading...</span>
                                <span className="font-medium">{status?.progress || 0}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className={`h-full ${colors.progress} transition-all duration-300 rounded-full`}
                                    style={{ width: `${status?.progress || 0}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {isError && status?.message && (
                        <div className="mt-3 text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">
                            {status.message}
                        </div>
                    )}
                </div>

                <div className="px-6 pb-6 pt-0">
                    <button
                        onClick={() => onUpload(file)}
                        disabled={!file || isUploading}
                        className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${!file || isUploading
                            ? 'bg-gray-300 text-gray-400 cursor-not-allowed shadow-none'
                            : colors.button
                            } flex items-center justify-center gap-2`}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            'Upload File'
                        )}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="p-3 font-sans text-gray-800 antialiased">
            <div className="mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">File Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Upload and manage your timetable, student, and course data</p>
                </div>

                {/* Upload Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FileUploadCard
                        title="Timetable Data"
                        description="Upload schedule information"
                        file={file1}
                        setFile={setFile1}
                        onUpload={(file) => handleUpload(
                            file,
                            '/api/timeTable/timetable',
                            'Timetable uploaded successfully',
                            'Timetable upload failed'
                        )}
                        icon={UploadCloud}
                        color="blue"
                        acceptedFormats=".xlsx,.xls,.csv,.json"
                    />

                    <FileUploadCard
                        title="Student Records"
                        description="Upload student data"
                        file={studentFile}
                        setFile={setStudentFile}
                        onUpload={(file) => handleUpload(
                            file,
                            '/api/timeTable/studentupload',
                            'Student data uploaded successfully',
                            'Student upload failed'
                        )}
                        icon={UploadCloud}
                        color="green"
                        acceptedFormats=".xlsx,.xls,.csv"
                    />

                    <FileUploadCard
                        title="Course Catalog"
                        description="Upload course information"
                        file={courseFile}
                        setFile={setCourseFile}
                        onUpload={(file) => handleUpload(
                            file,
                            '/api/timeTable/courseupload',
                            'Course data uploaded successfully',
                            'Course upload failed'
                        )}
                        icon={UploadCloud}
                        color="purple"
                        acceptedFormats=".xlsx,.xls,.csv"
                    />
                </div>
            </div>

            {/* Loading Modal */}
            {loading && (
                <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-xl p-6 border border-slate-100 max-w-xs w-full text-center mx-4">
                        <div className="flex flex-col items-center">
                            <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-3" />
                            <h3 className="text-sm font-semibold text-gray-900">Processing Upload</h3>
                            <p className="text-xs text-gray-500 mt-1">Please wait while your file is being uploaded</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FileUpload;