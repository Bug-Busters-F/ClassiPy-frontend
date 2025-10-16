// src/pages/History.tsx
import { useEffect, useState } from "react";
import type { HistoryItem } from "../types/PartNumber";
import { getHistory, updateHistoryItemClassification } from "../services/api";
import Loading from "./Loading";
import StatusBadge from "../components/StatusBadge";
import ClassificationModal from "../components/ClassificationModal";

const History = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [selectedHistoryItem, setSelectedHistoryItem] =
    useState<HistoryItem | null>(null);

  useEffect(() => {
    getHistory()
      .then((data) => {
        setHistoryItems(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleUpdateItem = (updatedItem: HistoryItem) => {
    updateHistoryItemClassification(
      updatedItem.historyId,
      updatedItem.classification!
    );
    setHistoryItems((prevItems) =>
      prevItems.map((item) =>
        item.historyId === updatedItem.historyId ? updatedItem : item
      )
    );
    setSelectedHistoryItem(null);
  };

  const handleSelectItem = (id: number) => {
    setSelectedItems((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return newSelection;
    });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allClassifiedIds = historyItems
        .filter((item) => item.status === "classificado")
        .map((item) => item.historyId);
      setSelectedItems(new Set(allClassifiedIds));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleGenerateExcel = () => {
    if (selectedItems.size === 0) {
      alert(
        "Por favor, selecione pelo menos um item classificado para gerar o Excel."
      );
      return;
    }
    console.log("Gerando Excel para os IDs:", Array.from(selectedItems));
    alert(`Gerando Excel para ${selectedItems.size} itens!`);
  };

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center">
        <Loading
          loadingTitle="Carregando Histórico..."
          loadingMessage="Buscando todos os processos já realizados."
        />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }

  return (
    <div className="px-4 sm:px-[8%] w-screen pb-20">
      <h2 className="pt-8 text-3xl font-bold text-gray-800">
        Histórico de Processos
      </h2>
      <p className="text-gray-500 font-medium my-4">
        Veja todos os processos realizados, seus status, e gere documentos a
        partir deles.
      </p>

      <div className="border border-gray-200 rounded-2xl shadow-lg overflow-x-auto">
        <table className="w-full min-w-[800px] text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 w-12">
                <input type="checkbox" onChange={handleSelectAll} />
              </th>
              <th className="p-4 font-semibold text-gray-600">Part Number</th>
              <th className="p-4 font-semibold text-gray-600">Descrição</th>
              <th className="p-4 font-semibold text-gray-600">NCM</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Data</th>
              <th className="p-4 font-semibold text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody>
            {historyItems.map((item) => (
              <tr
                key={item.historyId}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.historyId)}
                    onChange={() => handleSelectItem(item.historyId)}
                    disabled={item.status !== "classificado"}
                  />
                </td>
                <td className="p-4 font-mono text-gray-800">
                  {item.partNumber}
                </td>
                <td className="p-4 text-gray-600 truncate max-w-xs">
                  {item.classification?.description || "N/A"}
                </td>
                <td className="p-4 text-gray-600">
                  {item.classification?.ncmCode || "N/A"}
                </td>
                <td className="p-4">
                  <StatusBadge status={item.status} />
                </td>
                <td className="p-4 text-gray-500 text-sm">
                  {new Date(item.processedDate).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => setSelectedHistoryItem(item)}
                    className="text-blue-600 hover:underline"
                  >
                    Ver Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedHistoryItem && (
        <ClassificationModal
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
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md cursor-pointer hover:bg-green-700 transition-colors"
          >
            <i className="fa-solid fa-file-excel"></i>Gerar Excel
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
