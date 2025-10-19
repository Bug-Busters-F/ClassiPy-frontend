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
  productId: number | null;
  value: string;
  country: string; 
  status: PartNumberStatus;
  classification?: ClassifiedData;
}
export interface InitialPartNumberPayload {
  partNumber: string;
  fileHash: string;
}
export interface InitialSaveResponseItem {
  pro_id: number; 
  partNumber: string;
  fileHash: string; 
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

export type UploadApiResponse = ApiResponse & { hash_code: string };

// Tipo para o historico de processos
export interface HistoryItem {
  historyId: number;
  fileHash: string;
  processedDate: string;
  partNumber: string;
  status: PartNumberStatus;
  classification: ClassifiedData | null;
}