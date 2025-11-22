import { useEffect, useState } from "react";
import type { HistoryItem } from "../types/PartNumber";
import { getHistory, deleteHistory } from "../services/api";
import Loading from "./Loading";
import ClassificationModal from "../components/ClassificationModal";
import HistoryList from "../components/HistoryList";
import { generateHistoryExcel } from "../utils/ExcelExporter";

const History = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pages, setPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null);

  const loadData = () => {
    setIsLoading(true);
    getHistory(page, limit)
      .then((data) => {
        setHistoryItems(data.items);
        setPages(data.pages);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [page]);

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
        .filter((item) => item.status === "classificado" || item.status === "validado")
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

    const selectedHistoryObjects = historyItems.filter(
      item => selectedItems.has(item.historyId) && item.classification
    );

    if (selectedHistoryObjects.length === 0) {
      alert("Nenhum dos itens selecionados possui dados de classificação completos.");
      return;
    }

    generateHistoryExcel(selectedHistoryObjects);
  };

  const handleDeleteItem = async (historyId: number) => {
    if (!window.confirm("Tem certeza que deseja excluir?")) return;

    try {
      await deleteHistory(historyId);
      setHistoryItems((prev) => prev.filter(item => item.historyId !== historyId));
      setSelectedItems((prev) => {
        const newSel = new Set(prev);
        newSel.delete(historyId);
        return newSel;
      });
    } catch {
      alert("Não foi possível excluir o item.");
    }
  };

  if (isLoading)
    return (
      <div className="flex w-full items-center justify-center">
        <Loading loadingTitle="Carregando Histórico..." loadingMessage="Buscando processos." />
      </div>
    );

  if (error) return <div className="text-red-500 text-center p-8">{error}</div>;

  return (
    <div className="px-4 sm:px-[8%] w-screen pb-20">
      <h2 className="pt-8 text-3xl font-bold text-gray-800">Histórico de Processos</h2>
      <p className="text-gray-500 font-medium my-4">
        Veja todos os processos realizados e seus status.
      </p>

      {historyItems.length === 0 ? (
        <div className="text-center text-gray-600 py-10 text-lg font-medium">
          Ainda não há dados no histórico.
        </div>
      ) : (
        <HistoryList
          historyItems={historyItems}
          selectedItems={selectedItems}
          onSelectItem={handleSelectItem}
          onSelectAll={handleSelectAll}
          onOpenModal={setSelectedHistoryItem}
          onDelete={handleDeleteItem}
        />
      )}

      {historyItems.length > 0 && (
        <div className="flex justify-center gap-4 my-10">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Anterior
          </button>

          <span className="font-semibold text-gray-700">
            Página {page} de {pages}
          </span>

          <button
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      )}

      {selectedItems.size > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg p-4 border-t border-gray-200 flex justify-center items-center gap-6">
          <span className="font-semibold text-gray-700">
            {selectedItems.size} item(s) selecionado(s)
          </span>

          <button
            onClick={handleGenerateExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
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

      {selectedHistoryItem && (
        <ClassificationModal
          productId={selectedHistoryItem.productId}
          item={selectedHistoryItem}
          onClose={() => setSelectedHistoryItem(null)}
          onSave={handleUpdateItem}
        />
      )}
    </div>
  );
};

export default History;
