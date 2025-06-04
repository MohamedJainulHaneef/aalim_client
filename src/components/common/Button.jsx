import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';   

function Button({ buttonObject }) 
{
    return (
        <button
            className={`cursor-pointer text-white p-2 text-md flex items-center rounded justify-center ${buttonObject.design}`}
        >
            <FontAwesomeIcon className='mr-2 text-md' icon={buttonObject.icon} /> <span>{buttonObject.name}</span>
        </button>
    )
}

export default Button