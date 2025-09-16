import React from 'react'
import type { PartNumber } from '../types/PartNumber';
import { ValidatePartNumberRow } from './ValidatePartNumberRow';

interface ValidatePartNumberListProps{
  partNumbers: PartNumber[];
  onUpdatePartNumber: (id: string, newValue: string) => void;
  onAddPartNumber: () => void;
}


const ValidatePartNumberList: React.FC<ValidatePartNumberListProps> = ({partNumbers, onUpdatePartNumber, onAddPartNumber}) => {
  return (
    <div className="space-y-2">
      {/* Cabeçalho */}
      <div className="flex justify-between gap-4 px-1 text-sm font-semibold text-gray-600">
        <h3>Part-Number</h3>
        <h3>Ações</h3>
      </div>

      {partNumbers.map((pn) => (
        <ValidatePartNumberRow
          key={pn.id}
          partNumber={pn}
          onUpdate={onUpdatePartNumber}
        />
      ))}
      
      {/* Botão de Adicionar */}
      <button 
        onClick={onAddPartNumber}
        className="flex items-center gap-2 px-4 py-2 text-blue-600 font-semibold hover:bg-blue-100 rounded-md cursor-pointer transition-all duration-300"
      >
        <i className="fa-solid fa-plus"></i> Adicionar Part-Number
      </button>
    </div>

  )
}

export default ValidatePartNumberList