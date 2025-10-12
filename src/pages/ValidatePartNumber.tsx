import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import type { PartNumber } from "../types/PartNumber";
import ValidatePartNumberList from "../components/ValidatePartNumberList";
import { usePartNumberContext } from "../context/PartNumberContext";

const ValidatePartNumber = () => {
  const { partNumbers, setPartNumbers } = usePartNumberContext();

  const handleUpdatePartNumber = (id: string, newValue: string) => {
    setPartNumbers((currentPartNumbers) =>
      currentPartNumbers.map((pn) =>
        pn.id === id ? { ...pn, value: newValue } : pn
      )
    );
  };

  const handleAddPartNumber = () => {
    const newPartNumber: PartNumber = {
      id: uuidv4(),
      value: "",
      country: "",
      status: "revisao",
    };
    setPartNumbers((currentPartNumbers) => [
      ...currentPartNumbers,
      newPartNumber,
    ]);
  };

  const handleDeletePartNumber = (id: string) => {
    setPartNumbers((current) => current.filter((pn) => pn.id !== id));
  };

  return (
    <div className="px-[8%] w-screen pb-10">
      <h2 className="pt-8 text-3xl font-bold text-gray-800">
        Revisão e Validação de PartNumber
      </h2>
      <p className="text-gray-500 font-medium my-4">
        Revise e Valide os Part-Numbers extraidos do documento PDF, Adicione ou
        Edite os Part-Numbers
      </p>
      <div className="border border-gray-200 rounded-2xl shadow-lg transition-all duration-300">
        <div className="flex justify-between items-center pt-5 px-5 mb-6">
          <h1 className="text-xl font-bold text-gray-800">
            Part-Numbers Identificados
          </h1>
        </div>

        <hr className="border-gray-200" />

        {partNumbers.length > 0 ? (
          <ValidatePartNumberList
            partNumbers={partNumbers}
            onUpdatePartNumber={handleUpdatePartNumber}
            onDeletePartNumber={handleDeletePartNumber}
          />
        ) : (
          <div className="text-center py-10 px-5 text-gray-500">
            <p>Nenhum Part-Number na lista para validar.</p>
            <p>Adicione um novo manualmente ou inicie um novo processo.</p>
          </div>
        )}

        <hr className="border-gray-200" />

        <div className="flex flex-col md:flex-row justify-between py-5 px-5 items-center gap-4">
          <div>
            <button
              onClick={handleAddPartNumber}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 font-semibold hover:bg-blue-100 rounded-md cursor-pointer transition-all duration-300"
            >
              <i className="fa-solid fa-plus"></i> Adicionar Part-Number
            </button>
          </div>
          <div className="flex gap-8">
            <Link to={"/process"}>
              <button className="px-4 py-2 text-gray-700 font-semibold hover:bg-red-100 hover:text-red-400 rounded-md cursor-pointer transition-all duration-200">
                Cancelar
              </button>
            </Link>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md cursor-pointer hover:bg-green-500 hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 ease-in-out">
              <i className="fa-solid fa-file-excel"></i>Gerar Documento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidatePartNumber;
