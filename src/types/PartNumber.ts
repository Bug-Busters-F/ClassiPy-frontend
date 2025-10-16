export interface ClassifiedData {
  description: string;
  ncmCode: string;
  taxRate: number; 
  manufacturerName: string;
  countryOfOrigin: string;
  fullAddress: string;
}

export type PartNumberStatus = 'revisao' | 'classificado' | 'processando' | 'validado';

export interface PartNumber {
  id: string; 
  value: string; 
  country: string; 
  status: PartNumberStatus;
  classification?: ClassifiedData; 
}

// Tipo para cada item retornado pela API
export interface ApiPartNumber {
  PartNumber: string;
  CountryOfOrigin: string;
}

// Tipo para a resposta completa da API
export interface ApiResponse {
  Parts: ApiPartNumber[];
}

// Tipo para o historico de processos
export interface HistoryItem {
  historyId: number;
  fileHash: string;
  processedDate: string;
  partNumber: string;
  status: PartNumberStatus;
  classification: ClassifiedData | null;
}
