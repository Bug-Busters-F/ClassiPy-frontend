import React from 'react'
import type { PartNumberStatus } from '../types/PartNumber'

const CheckIcon = () => <span className='text-green-400'><i className="fa-solid fa-circle-check fa-lg"></i></span>
const RevisionIcon = () => <span className='text-red-400'><i className="fa-solid fa-circle-exclamation fa-lg"></i></span>

interface StatusBadgeProps{
    status: PartNumberStatus;
}

const statusConfig = {
    validado:{
        text: 'Validado',
        icon: <CheckIcon/>,
        className: 'bg-green-100 text-green-800'
    },
    revisao: {
        text: 'Requer Revisão',
        icon: <RevisionIcon/>,
        className: 'bg-red-100 text-red-800'

    }
}

const StatusBadge: React.FC<StatusBadgeProps> = ({status}) => {
    const config = statusConfig[status];
  return (
    <div className={`inline-flex items-center w-full gap-1.5 px-3 py-3 rounded-full text-sm font-medium text-nowrap ${config.className}`}>
        {config.icon}
        {config.text}
    </div>
  )
}

export default StatusBadge