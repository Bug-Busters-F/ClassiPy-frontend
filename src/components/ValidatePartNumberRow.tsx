import React from "react";
import type { PartNumber } from "../types/PartNumber";
import StatusBadge from "./StatusBadge";
import { motion } from "framer-motion";

interface ValidatePartNumberRowProps {
  partNumber: PartNumber;
  onUpdate: (id: string, newValue: string) => void;
  onDelete: (id: string) => void;
  onClassifyPartNumber: (id: string) => void;
  onOpenModal: (partNumber: PartNumber) => void;
}

export const ValidatePartNumberRow: React.FC<ValidatePartNumberRowProps> = ({
  partNumber,
  onUpdate,
  onDelete,
  onClassifyPartNumber,
  onOpenModal,
}) => {
  const isProcessing = partNumber.status === 'processando';
  const isClassified = partNumber.status === 'classificado';
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col md:grid md:grid-cols-[2fr_0.4fr_0.6fr] items-center gap-4 py-4 md:py-2 px-4 md:px-0 border border-gray-300 md:border-0 rounded-lg"
    >
      <input
        type="text"
        value={partNumber.value}
        onChange={(e) => onUpdate(partNumber.id, e.target.value)}
        className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="min-w-full flex justify-between items-center space-x-2 md:block">
        <span className="font-semibold text-gray-600 md:hidden">Status:</span>
        <StatusBadge status={partNumber.status} />
      </div>
      <div className="flex justify-between w-full mt-2 md:mt-0">
        {isClassified ? (
          <button
            onClick={() => onOpenModal(partNumber)}
            className="w-[48%] py-2 md:p-2 flex items-center space-x-2 justify-center rounded-lg text-green-600 bg-green-50 hover:bg-green-100 transition duration-200 ease-in-out"
          >
            <i className="fa-solid fa-pen-to-square fa-lg"></i>
            <p className="hidden md:inline">Validar</p>
          </button>
        ) : (
          <button
            onClick={() => onClassifyPartNumber(partNumber.id)}
            disabled={isProcessing}
            className="w-[50%] py-2 md:p-2 md:px-3 flex items-center space-x-2 justify-center rounded-lg text-gray-800 cursor-pointer transition duration-200 ease-in-out enabled:hover:text-white enabled:hover:bg-blue-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
          >
            <i className={`fa-solid ${isProcessing ? 'fa-spinner fa-spin' : 'fa-gears'} fa-lg`}></i>
            <p className="hidden md:inline">{isProcessing ? "Processando" : "Classificar"}</p>
          </button>
        )}

        <button
          onClick={() => onDelete(partNumber.id)}
          className="w-[48%] py-2 flex items-center space-x-2 justify-center md:py-1 text-red-400 hover:text-red-600 rounded-lg cursor-pointer hover:bg-red-100 transition duration-200 ease-in-out"
        >
          <i className="fa-solid fa-trash fa-lg"></i>
          <p className="hidden md:inline">Deletar</p>
        </button>
      </div>
    </motion.div>
  );
};
