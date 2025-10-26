import { useEffect, useState } from "react";
import type { HistoryItem } from "../types/PartNumber";
import { getHistory } from "../services/api";
import Loading from "./Loading";
import ClassificationModal from "../components/ClassificationModal";
import HistoryList from "../components/HistoryList";
import { generateHistoryExcel } from "../utils/ExcelExporter";

const History = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    getHistory()
      .then((data) => setHistoryItems(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);
  console.log("History Items:", historyItems);

  const handleUpdateItem = (updatedItemFromApi: HistoryItem) => {
    setHistoryItems((prev) =>
      prev.map((item) =>
        item.historyId === updatedItemFromApi.historyId ? updatedItemFromApi : item
      )
    );
    setSelectedHistoryItem(null);
  };

  const handleSelectItem = (id: number) => {
    setSelectedItems((prev) => {
      const newSelection = new Set(prev);
      newSelection.has(id) ? newSelection.delete(id) : newSelection.add(id);
      return newSelection;
    });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allSelectableIds = historyItems
        .filter(
          (item) => item.status === "classificado" || item.status === "validado"
        )
        .map((item) => item.historyId);

      setSelectedItems(new Set(allSelectableIds));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleGenerateExcel = () => {
    if (selectedItems.size === 0) {
      alert("Selecione pelo menos um item classificado ou validado para gerar o Excel.");
      return;
    }

    // Filtra o array `historyItems` para pegar apenas os objetos selecionados
    const selectedHistoryObjects = historyItems.filter(item =>
      selectedItems.has(item.historyId)
      && item.classification
    );

    if (selectedHistoryObjects.length === 0) {
      alert("Nenhum dos itens selecionados possui dados de classificação completos. Não é possível exportar.");
      return;
    }

    generateHistoryExcel(selectedHistoryObjects);
  };

  if (isLoading)
    return (
      <div className="flex w-full items-center justify-center">
        <Loading
          loadingTitle="Carregando Histórico..."
          loadingMessage="Buscando todos os processos já realizados."
        />
      </div>
    );

  if (error) return <div className="text-red-500 text-center p-8">{error}</div>;

  return (
    <div className="px-4 sm:px-[8%] w-screen pb-20">
      <h2 className="pt-8 text-3xl font-bold text-gray-800">
        Histórico de Processos
      </h2>
      <p className="text-gray-500 font-medium my-4">
        Veja todos os processos realizados, seus status e gere documentos a
        partir deles.
      </p>

      <HistoryList
        historyItems={historyItems}
        selectedItems={selectedItems}
        onSelectItem={handleSelectItem}
        onSelectAll={handleSelectAll}
        onOpenModal={setSelectedHistoryItem}
      />

      {selectedHistoryItem && (
        <ClassificationModal
          productId={selectedHistoryItem.productId}
          item={selectedHistoryItem}
          onClose={() => setSelectedHistoryItem(null)}
          onSave={handleUpdateItem}
        />
      )}

      {selectedItems.size > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg p-4 border-t border-gray-200 flex justify-center items-center gap-6 animate-fadeIn">
          <span className="font-semibold text-gray-700">
            {selectedItems.size} item(s) selecionado(s)
          </span>
          <button
            onClick={handleGenerateExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors"
          >
            <i className="fa-solid fa-file-excel"></i> Gerar Excel
          </button>
          <button
            onClick={() => setSelectedItems(new Set())}
            className="text-sm text-gray-500 hover:underline"
          >
            Limpar seleção
          </button>
        </div>
      )}
    </div>
  );
};

export default History;
