

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import AddModal from '../../components/manage/leave/AddModal';
import UserTable from '../../components/manage/user/UserTable';

function Leave() 
{
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-end mb-4">
                <button onClick={() => setIsAddModalOpen(!isAddModalOpen)}
                    className="cursor-pointer flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow transition duration-200"
                >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Add Leave</span>
                </button>
            </div>
            {isAddModalOpen && ( 
                <div className="flex justify-center"> <AddModal onSuccess={() => setIsAddModalOpen(false)}/> </div> )
            }
           {!isAddModalOpen &&  <UserTable />}
        </div>
    );
}

export default Leave;