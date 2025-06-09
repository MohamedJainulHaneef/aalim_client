import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';

function FileUpload() 
{
    const [files, setFiles] = useState([null, null, null, null]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 w-full">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col items-center gap-4 hover:shadow-lg transition">
                    <p>Time Table File</p>
                    <label className="w-full text-center cursor-pointer">
                        <input
                            type="file"
                            onChange={(e) => handleFileChange(0, e)}
                            className="hidden"
                        />
                        <div className="flex flex-col items-center gap-2">
                            <UploadCloud className="h-10 w-10 text-blue-500" />
                            <span className="text-sm text-gray-600">
                                {files[0] ? files[0].name : 'Click to select a file'}
                            </span>
                        </div>
                    </label>
                    <button
                        onClick={() => handleUpload(0)}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Upload
                    </button>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col items-center gap-4 hover:shadow-lg transition">
                    <p className=''>Student File</p>
                    <label className="w-full text-center cursor-pointer">
                        <input
                            type="file"
                            onChange={(e) => handleFileChange(1, e)}
                            className="hidden"
                        />
                        <div className="flex flex-col items-center gap-2">
                            <UploadCloud className="h-10 w-10 text-blue-500" />
                            <span className="text-sm text-gray-600">
                                {files[1] ? files[1].name : 'Click to select a file'}
                            </span>
                        </div>
                    </label>
                    <button
                        onClick={() => handleUpload(1)}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Upload
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FileUpload;
