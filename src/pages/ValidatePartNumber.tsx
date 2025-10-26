import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import type { HistoryItem, PartNumber, ClassifiedData } from "../types/PartNumber";
import ValidatePartNumberList from "../components/ValidatePartNumberList";
import { usePartNumberContext } from "../context/PartNumberContext";
import { deleteProduto, classifyPartNumber, getClassificationForProduct } from "../services/api";
import { useState, useEffect } from "react";
import ClassificationModal from "../components/ClassificationModal";
import { generateExcel } from "../utils/ExcelExporter";

const ValidatePartNumber = () => {
  const { partNumbers, setPartNumbers } = usePartNumberContext();
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [selectedPartNumber, setSelectedPartNumber] =
    useState<PartNumber | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchMissingClassifications = async () => {
      const itemsToFetch = partNumbers.filter(
        (pn) => pn.status === 'validado' && pn.productId && !pn.classification
      );

      if (itemsToFetch.length > 0) {
        if (isMounted) setIsFetchingData(true);
        console.log("Buscando dados de PNs pré-validados...", itemsToFetch);

        try {
          await Promise.all(
            itemsToFetch.map(async (item) => {
              if (item.productId) {
                const classificationData: ClassifiedData = await getClassificationForProduct(item.productId);

                if (isMounted) {
                  setPartNumbers(prevPartNumbers =>
                    prevPartNumbers.map(pn => {
                      if (pn.id === item.id) {
                        return {
                          ...item,
                          classification: classificationData
                        };
                      }
                      return pn;
                    })
                  )
                }
              }
            })
          );
          if (isMounted) console.log("Dados de PNs pré-validados carregados.");
        } catch (error) {
          if (isMounted) console.error("Erro ao buscar classificações em falta:", error);
        } finally {
          if (isMounted) setIsFetchingData(false);
        }
      }
    };

    fetchMissingClassifications();

    return () => {
      isMounted = false;
    };
  }, [partNumbers, setPartNumbers]);

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
      productId: null,
      value: "",
      country: "",
      status: "revisao",
    };
    setPartNumbers((currentPartNumbers) => [
      ...currentPartNumbers,
      newPartNumber,
    ]);
  };

  const handleDeletePartNumber = async (id: string) => {
    const partNumber = partNumbers.find((pn) => pn.id === id);
    if (!partNumber?.productId) {
      setPartNumbers((current) => current.filter((pn) => pn.id !== id));
      return;
    }

    try {
      await deleteProduto(partNumber.productId);
      setPartNumbers((current) => current.filter((pn) => pn.id !== id));
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      alert("Erro ao deletar o produto. Veja o console para detalhes.");
    }
  };

  const handleclassifyPartNumber = async (id: string) => {
    const partNumberToClassify = partNumbers.find((pn) => pn.id === id);
    if (!partNumberToClassify || partNumberToClassify.status == "processando") return;
    setPartNumbers((prev) =>
      prev.map((pn) => (pn.id === id ? { ...pn, status: "processando" } : pn))
    );
    try {
      const classificationResult = await classifyPartNumber(
        partNumberToClassify.value
      );
      setPartNumbers((prev) =>
        prev.map((pn) =>
          pn.id === id
            ? {
              ...pn,
              status: "classificado",
              classification: classificationResult,
            }
            : pn
        )
      );
    } catch (error) {
      console.error("Erro ao classificar o Part-Number:", error);
      alert(`Falha ao classificar ${partNumberToClassify.value}:\n${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      setPartNumbers((prev) =>
        prev.map((pn) => (pn.id === id ? { ...pn, status: "revisao" } : pn))
      );
    }
  };

  const handleOpenModal = (partNumber: PartNumber) => {
    setSelectedPartNumber(partNumber);
  };

  const handleSaveFromModal = (updatedItem: HistoryItem) => {
    setPartNumbers((prev) =>
      prev.map((pn) =>
        pn.id === selectedPartNumber?.id
          ? {
            ...pn,
            status: "validado",
            classification: updatedItem.classification!,
          }
          : pn
      )
    );
    setSelectedPartNumber(null);
  };

  const handleGenerateExcel = () => {
    if (isFetchingData) {
      return;
    }

    generateExcel(partNumbers)
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
            onClassifyPartNumber={handleclassifyPartNumber}
            onOpenModal={handleOpenModal}
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
            <button
              onClick={handleGenerateExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md cursor-pointer hover:bg-green-500 hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 ease-in-out"
              disabled={partNumbers.filter(pn => pn.status === 'validado').length === 0}
            >
              <i className="fa-solid fa-file-excel"></i>Gerar Documento
            </button>
          </div>
        </div>
      </div>
      {selectedPartNumber && (
        <ClassificationModal
          productId={selectedPartNumber.productId}

          item={{
            historyId: 0,
            productId: selectedPartNumber.productId,
            fileHash: "",
            processedDate: new Date().toISOString(),
            partNumber: selectedPartNumber.value,
            status: selectedPartNumber.status,
            classification: selectedPartNumber.classification || null,
          }}
          onClose={() => setSelectedPartNumber(null)}
          onSave={handleSaveFromModal}
        />
      )}
    </div>
  );
};

export default ValidatePartNumber;