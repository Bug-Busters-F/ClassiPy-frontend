import React from "react";
import type { PartNumber } from "../types/PartNumber";
import { ValidatePartNumberRow } from "./ValidatePartNumberRow";
import { AnimatePresence } from "framer-motion";

interface ValidatePartNumberListProps {
  partNumbers: PartNumber[];
  onUpdatePartNumber: (id: string, newValue: string) => void;
  onDeletePartNumber: (id: string) => void;
  onClassifyPartNumber: (id: string) => void;
  onOpenModal: (partNumber: PartNumber) => void;
}

const ValidatePartNumberList: React.FC<ValidatePartNumberListProps> = ({
  partNumbers,
  onUpdatePartNumber,
  onDeletePartNumber,
  onClassifyPartNumber,
  onOpenModal,
}) => {
  return (
    <div className="space-y-4 py-5 px-5">
      <div className="hidden md:grid md:grid-cols-[2fr_0.4fr_0.6fr] gap-4 px-1 text-sm font-semibold text-gray-600">
        <h3>Part-Number</h3>
        <h3>Status</h3>
        <h3>Ações</h3>
      </div>

      <AnimatePresence>
        {partNumbers.map((pn) => (
          <ValidatePartNumberRow
            key={pn.id}
            partNumber={pn}
            onUpdate={onUpdatePartNumber}
            onDelete={onDeletePartNumber}
            onClassifyPartNumber={onClassifyPartNumber}
            onOpenModal={onOpenModal}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ValidatePartNumberList;
