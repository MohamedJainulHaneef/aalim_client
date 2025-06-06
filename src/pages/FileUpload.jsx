import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react'; // optional icon library like lucide-react

function FileUpload() {
    const [files, setFiles] = useState(Array(5).fill(null));

    const handleFileChange = (index, event) => {
        const newFiles = [...files];
        newFiles[index] = event.target.files[0];
        setFiles(newFiles);
    };

    const handleUpload = (index) => {
        if (files[index]) {
            console.log(`Uploading file ${index + 1}:`, files[index]);
            // Actual upload logic
        } else {
            alert('Please select a file first.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
                {files.map((file, index) => (
                    <div
                        key={index}
                        className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col items-center gap-4 hover:shadow-lg transition"
                    >
                        <p>Time Table</p>
                        <label className="w-full text-center">
                            <input
                                type="file"
                                onChange={(e) => handleFileChange(index, e)}
                                className="hidden"
                                id={`fileInput${index}`}
                            />
                            <div className="cursor-pointer flex flex-col items-center gap-2">
                                <UploadCloud className="h-10 w-10 text-blue-500" />
                                <span className="text-sm text-gray-600">
                                    {file ? file.name : 'Click to select a file'}
                                </span>
                            </div>
                        </label>
                        <button
                            onClick={() => handleUpload(index)}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Upload
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FileUpload;
