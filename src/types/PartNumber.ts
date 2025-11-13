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
  status: PartNumberStatus;
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
  productId: number | null;
  historyId: number;
  fileHash: string;
  processedDate: string;
  partNumber: string;
  status: PartNumberStatus;
  classification: ClassifiedData | null;
}

export interface BulkClassificationResult {
  part_number: string;
  classification?: BackendClassificationResponse;
  error?: string;
}

export interface BackendClassificationResponse {
  ncm: string;
  descricao: string;
  fabricante: string;
  aliquota: number;
  descricao_ncm: string;
}

export interface BackendHistoryResponse {
  pro_id?: number;
  historyId: number;
  fileHash: string;
  processedDate: string;
  partNumber: string;
  status: PartNumberStatus;
  classification: {
    description: string;
    ncmCode: string;
    taxRate: number;
    manufacturer: { 
      name: string;
      country: string;
      address: string;
    }
  } | null;
}

export interface BackendUpdatePayload {
  partNumber: string;         
  description: string;     
  status: PartNumberStatus; 
  classification: ClassificationPayload; 
  manufacturer: ManufacturerPayload;  
}

export interface ClassificationPayload {
  description: string; 
  ncmCode: string;
  taxRate: number;
}

export interface ManufacturerPayload {
  name: string;
  country: string;
  address: string;
}