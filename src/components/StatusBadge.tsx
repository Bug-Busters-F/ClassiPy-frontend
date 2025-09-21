import React from 'react'
import type { PartNumberStatus } from '../types/PartNumber'

const RevisionIcon = () => <span className='text-yellow-500'><i className="fa-solid fa-circle-exclamation fa-lg"></i></span> 
const ClassifiedIcon = () => <span className='text-blue-500'><i className="fa-solid fa-gears fa-lg"></i></span> 

interface StatusBadgeProps{
    status: PartNumberStatus;
}

const statusConfig = {
    // A entrada 'validado' foi removida.
    revisao: {
        text: 'Requer Revisão',
        icon: <RevisionIcon/>,
        className: 'bg-yellow-100 text-yellow-800'
    },
    classificado: {
        text: 'Classificado',
        icon: <ClassifiedIcon/>,
        className: 'bg-blue-100 text-blue-800'
    }
}

const StatusBadge: React.FC<StatusBadgeProps> = ({status}) => {
    if (!status || !statusConfig[status]) {
        return null; 
    }
    
    const config = statusConfig[status];

    return (
        <div className={`inline-flex items-center w-full gap-1.5 px-3 py-3 rounded-full text-sm font-medium text-nowrap ${config.className}`}>
            {config.icon}
            {config.text}
        </div>
    )
}

export default StatusBadge