import type React from "react";
import type { PartNumber } from "../types/PartNumber";
import { useState } from "react";
import ValidatePartNumberList from "../components/ValidatePartNumberList";

const initialPartNumbers: PartNumber[] = [
  { id: "1", value: "123-456-789" },
  { id: "2", value: "987-654-321" },
  { id: "3", value: "987-654-321" },
];

const ValidatePartNumber = () => {
  const [partNumbers, setPartNumbers] =
    useState<PartNumber[]>(initialPartNumbers);

  const handleUpdatePartNumber = (id: string, newValue: string) => {
    setPartNumbers((currentPartNumbers) =>
      currentPartNumbers.map((pn) =>
        pn.id === id ? { ...pn, value: newValue } : pn
      )
    );
  };

  const handleAddPartNumber = () => {
    const newPartNumber: PartNumber = {
      id: "59",
      value: "",
    };
    setPartNumbers((currentPartNumbers) => [
      ...currentPartNumbers,
      newPartNumber,
    ]);
  };

  return (
    <div className="px-[8%] w-screen">
      <h2 className="pt-8 text-3xl font-bold text-gray-800">
        Revisão e Validação de PartNumber
      </h2>
      <p className="text-gray-500 font-medium my-4">Revise e Valide os Part-Numbers extraidos do documento PDF, Adicione ou Edite os Part-Numbers</p>
      <div className="border border-gray-200 rounded-2xl p-5">
        <h1 className="text-xl font-bold text-gray-800 mb-6">
          Part-Numbers Identificados
        </h1>

        <ValidatePartNumberList
          partNumbers={partNumbers}
          onUpdatePartNumber={handleUpdatePartNumber}
          onAddPartNumber={handleAddPartNumber}
        />

        {/* Ações Finais */}
        <div className="flex justify-end items-center gap-4 mt-8 pt-4">
          <button className="px-4 py-2 text-gray-700 font-semibold hover:bg-gray-100 rounded-md">
            Cancelar
          </button>
          <button className="px-4 py-2 bg-green-600 text-white font-semibold hover:bg-green-700 rounded-md">
            Confirmar Validação
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidatePartNumber;
