import React from "react";
import { motion } from "framer-motion";
import type { HistoryItem } from "../types/PartNumber";
import StatusBadge from "./StatusBadge";

interface HistoryRowProps {
  item: HistoryItem;
  selected: boolean;
  onSelect: () => void;
  onOpenModal: () => void;
}

const HistoryRow: React.FC<HistoryRowProps> = ({
  item,
  selected,
  onSelect,
  onOpenModal,
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 md:grid-cols-[0.2fr_1.2fr_1fr_0.6fr_0.6fr_0.6fr_0.6fr] items-center gap-4 p-4 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white"
    >
      <div>
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          disabled={!(item.status === "classificado" || item.status === "validado")}
          className="accent-blue-600"
        />
      </div>

      <div className="font-mono text-gray-800">{item.partNumber}</div>
      <div className="text-gray-600 truncate">{item.classification?.description || "N/A"}</div>
      <div className="text-gray-600">{item.classification?.ncmCode || "N/A"}</div>
      <div>
        <StatusBadge status={item.status} />
      </div>
      <div className="text-gray-500 text-sm">
        {new Date(item.processedDate).toLocaleDateString()}
      </div>
      <div>
        <button
          onClick={onOpenModal}
          className="text-blue-600 hover:underline"
        >
          Ver Detalhes
        </button>
      </div>
    </motion.div>
  );
};

export default HistoryRow;
