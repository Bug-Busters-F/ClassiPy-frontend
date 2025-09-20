import React from "react";
import type { PartNumber } from "../types/PartNumber";
import StatusBadge from "./StatusBadge";
import { motion } from "framer-motion"; 

interface ValidatePartNumberRowProps {
  partNumber: PartNumber;
  onUpdate: (id: string, newValue: string) => void;
  onDelete: (id: string) => void;
}

export const ValidatePartNumberRow: React.FC<ValidatePartNumberRowProps> = ({
  partNumber,
  onUpdate,
  onDelete,
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}   
      transition={{ duration: 0.3 }} 
      className="grid grid-cols-[2fr_0.3fr_0.5fr] items-center gap-4 py-2"
    >
      <input
        type="text"
        value={partNumber.value}
        onChange={(e) => onUpdate(partNumber.id, e.target.value)}
        className="min-[60%]: px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div>
        <StatusBadge status={partNumber.status} />
      </div>

      <div className="flex justify-between w-full">
        <button className="w-[45%] py-1 rounded-lg text-gray-800 cursor-pointer hover:text-white hover:bg-blue-400 hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 ease-in-out">
          <i className="fa-solid fa-gears fa-lg"></i><p>Classificar</p>
        </button>
        <button 
          onClick={() => onDelete(partNumber.id)}
          className="w-[45%] text-red-400 hover:text-red-600 rounded-lg cursor-pointer hover:bg-red-100 hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 ease-in-out">
          <i className="fa-solid fa-trash fa-lg"></i><p>Deletar</p>
        </button>
      </div>
    </motion.div>
  );
};