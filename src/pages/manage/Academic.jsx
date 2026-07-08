import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import AddModal from '../../components/manage/academic/AddModal';
import AcademicTable from '../../components/manage/academic/AcademicTable';

function Academic() {

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    return (
        <div className="min-h-screen p-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5 mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        Academic Management
                    </h1>
                    <p className="text-xs text-slate-400 font-medium tracking-normal mt-0.5">
                        Manage academic periods and semester schedules.
                    </p>
                </div>

                <div className="flex items-center self-end sm:self-auto">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 border shadow-xs active:scale-98 bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                    >
                        <FontAwesomeIcon icon={faPlus} className="text-xs" />
                        <span>Add Academic</span>
                    </button>
                </div>
            </div>

            <div className="transition-all duration-300">
                <AcademicTable />
            </div>

            {isAddModalOpen && (
                <AddModal
                    onSuccess={() => setIsAddModalOpen(false)}
                    onClose={() => setIsAddModalOpen(false)}
                />
            )}
        </div>
    );
}

export default Academic;