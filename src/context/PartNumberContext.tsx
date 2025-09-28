import type React from "react"
import type { PartNumber } from "../types/PartNumber"
import { createContext, useContext, useState, type ReactNode } from "react";

interface PartNumberContextType {
    partNumbers: PartNumber[];
    setPartNumbers: React.Dispatch<React.SetStateAction<PartNumber[]>>;
    processId: string | null;
    setProcessId: React.Dispatch<React.SetStateAction<string | null>>;
}

const PartNumberContext = createContext<PartNumberContextType | undefined> (undefined);

export const PartNumberProvider = ({children}: {children: ReactNode}) => {
  const [partNumbers, setPartNumbers] = useState<PartNumber[]>([]);
  const [processId, setProcessId] = useState<string | null>(null);

  const value = { partNumbers, setPartNumbers, processId, setProcessId }; 

  return (
    <PartNumberContext.Provider value={value}>
      {children}
    </PartNumberContext.Provider>
  );
}

export const usePartNumberContext = () => {
  const context = useContext(PartNumberContext)
  if (context === undefined) {
    throw new Error("usePartNumberContext must be used within a PartNumberProvider");
  }
  return context;
}