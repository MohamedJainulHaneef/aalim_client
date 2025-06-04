import React from 'react';
import Button from '../../components/common/Button';
import { faSave } from '@fortawesome/free-solid-svg-icons';

function Substitution() {
    const buttonObject = {
        name: "Save",
        icon: faSave,
        design: "bg-blue-500 hover:bg-blue-600 w-full"
    };

    return (
        <div className="p-8 min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
                <h2 className="text-xl font-semibold text-blue-700 text-center border-b pb-3">Substitution Management</h2>
                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-600">Date</label>
                        <input
                            type="date"
                            className="w-full h-9.5 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-600">Year</label>
                        <select
                            className="w-full p-2 h-10 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        >
                            <option>Select</option>
                            <option>I - Day Order</option>
                            <option>II - Day Order</option>
                            <option>III - Day Order</option>
                            <option>IV - Day Order</option>
                            <option>V - Day Order</option>
                            <option>VI - Day Order</option>
                        </select>
                    </div>
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-600">Absent Staff</label>
                        <select
                            className="w-full h-10 p-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        >
                            <option>Select</option>
                            <option>I - Day Order</option>
                            <option>II - Day Order</option>
                            <option>III - Day Order</option>
                            <option>IV - Day Order</option>
                            <option>V - Day Order</option>
                            <option>VI - Day Order</option>
                        </select>
                    </div>
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-600">Replacement Staff</label>
                        <select
                            className="w-full h-10 p-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        >
                            <option>Select</option>
                            <option>I - Day Order</option>
                            <option>II - Day Order</option>
                            <option>III - Day Order</option>
                            <option>IV - Day Order</option>
                            <option>V - Day Order</option>
                            <option>VI - Day Order</option>
                        </select>
                    </div>
                </div>
                <div className="pt-2">
                    <Button buttonObject={buttonObject} />
                </div>
            </div>
        </div>
    );
}

export default Substitution;
