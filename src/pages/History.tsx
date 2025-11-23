import { useEffect, useState } from "react";
import type { HistoryItem } from "../types/PartNumber";
import { getHistory, deleteHistory } from "../services/api";
import Loading from "./Loading";
import ClassificationModal from "../components/ClassificationModal";
import HistoryList from "../components/HistoryList";
import { generateHistoryExcel } from "../utils/ExcelExporter";
import toast from "react-hot-toast";
import ConfirmDialog from "../components/ConfirmDialog";

const History = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const limit = 10;

  const [totalPages, setTotalPages] = useState(1);

  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const [confirmData, setConfirmData] = useState<null | { historyId: number }>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setIsLoading(true);

      getHistory(page, limit, searchTerm, filterDate)
        .then((data) => {
          setHistoryItems(data.items);
          setTotalPages(data.pages);
          setError(null);
        })
        .catch((err) => setError(err.message))
        .finally(() => setIsLoading(false));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [page, searchTerm, filterDate]);


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
      toast.error("Selecione pelo menos um item para exportar.");
      return;
    }

    const selectedHistoryObjects = historyItems.filter(
      (item) => selectedItems.has(item.historyId) && item.classification
    );

    if (selectedHistoryObjects.length === 0) {
      toast.error("Nenhum dos itens selecionados possui dados completos para exportar.");
      return;
    }

    generateHistoryExcel(selectedHistoryObjects);
    toast.success("Arquivo Excel gerado com sucesso!");
  };


  const handleDeleteItem = (historyId: number) => {
    setConfirmData({ historyId });
  };


  const confirmDelete = async () => {
    if (!confirmData) return;

    const { historyId } = confirmData;

    try {
      await deleteHistory(historyId);

      setHistoryItems((prev) => prev.filter((item) => item.historyId !== historyId));

      setSelectedItems((prev) => {
        const newSelection = new Set(prev);
        newSelection.delete(historyId);
        return newSelection;
      });

      toast.success("Item excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir item:", error);
      toast.error("Não foi possível excluir o item.");
    }
    setConfirmData(null);
  };


  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterDate("");
    setPage(1); 
  };


  if (isLoading && historyItems.length === 0)
    return (
      <div className="flex w-full items-center justify-center">
        <Loading
          loadingTitle="Carregando Histórico..."
          loadingMessage="Buscando processos..."
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


      {/* FILTROS */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <input
          type="text"
          placeholder="Buscar por Part Number, NCM ou Descrição..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1); 
          }}
          className="w-full md:w-2/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => {
            setFilterDate(e.target.value);
            setPage(1);
          }}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 text-red-500 hover:text-red-700 hover:bg-red-50 font-medium rounded-lg transition-colors duration-200 flex items-center gap-2 whitespace-nowrap cursor-pointer"
          title="Limpar todos os filtros"
        >
          <i className="fa-solid fa-filter-circle-xmark"></i>
        </button>
      </div>


      {/* LISTA */}
      <HistoryList
        historyItems={historyItems}
        selectedItems={selectedItems}
        onSelectItem={handleSelectItem}
        onSelectAll={handleSelectAll}
        onOpenModal={setSelectedHistoryItem}
        onDelete={handleDeleteItem}
      />


      {/* PAGINAÇÃO*/}
      {historyItems.length > 0 && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className={`px-4 py-2 rounded-md border ${
              page === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Anterior
          </button>

          <span className="font-semibold text-gray-700">
            Página {page} de {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className={`px-4 py-2 rounded-md border ${
              page === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Próxima
          </button>
        </div>
      )}



      {/* MODAL */}
      {selectedHistoryItem && (
        <ClassificationModal
          productId={selectedHistoryItem.productId}
          item={selectedHistoryItem}
          onClose={() => setSelectedHistoryItem(null)}
          onSave={handleUpdateItem}
        />
      )}


      {/* SELEÇÃO FIXA */}
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


      {/* CONFIRM */}
      {confirmData && (
        <ConfirmDialog
          message="Tem certeza que deseja excluir este item?"
          onCancel={() => setConfirmData(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default History;
