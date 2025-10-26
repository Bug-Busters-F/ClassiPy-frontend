import React from "react";
import { AnimatePresence } from "framer-motion";
import type { HistoryItem } from "../types/PartNumber";
import HistoryRow from "./HistoryRow";

interface HistoryListProps {
  historyItems: HistoryItem[];
  selectedItems: Set<number>;
  onSelectItem: (id: number) => void;
  onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenModal: (item: HistoryItem) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({
  historyItems,
  selectedItems,
  onSelectItem,
  onSelectAll,
  onOpenModal,
}) => {
  return (
    <div className="space-y-4 py-5 px-5">
      {/* Cabeçalho responsivo */}
      <div className="hidden md:grid md:grid-cols-[0.3fr_1.2fr_1fr_0.6fr_0.6fr_0.6fr_0.6fr] gap-4 px-1 text-sm font-semibold text-gray-600">
        <h3>
          <input type="checkbox" onChange={onSelectAll} />
        </h3>
        <h3>Part Number</h3>
        <h3>Descrição</h3>
        <h3>NCM</h3>
        <h3>Status</h3>
        <h3>Data</h3>
        <h3>Ações</h3>
      </div>

      <AnimatePresence>
        {historyItems.map((item) => (
          <HistoryRow
            key={item.historyId}
            item={item}
            selected={selectedItems.has(item.historyId)}
            onSelect={() => onSelectItem(item.historyId)}
            onOpenModal={() => onOpenModal(item)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default HistoryList;
