import React from 'react'
import type { PartNumber } from '../types/PartNumber'

interface ValidatePartNumberRowProps {
    partNumber: PartNumber
    onUpdate: (id: string, newValue: string) => void;
}

export const ValidatePartNumberRow: React.FC<ValidatePartNumberRowProps> = ({ partNumber, onUpdate }) => {
  return (
    <div className="flex items-center gap-4 py-2">
      {/* Coluna Part-Number */}
      <input
        type="text"
        value={partNumber.value}
        onChange={(e) => onUpdate(partNumber.id, e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Coluna Ações */}
      <button className="text-gray-500 hover:text-blue-600 px-3">
        <i className="fa-solid fa-pen"></i>
      </button>
    </div>
  );
};