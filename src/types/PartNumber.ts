export interface ClassifiedData {
  description: string;
  ncmCode: string;
  taxRate: number; 
  manufacturerName: string;
  countryOfOrigin: string;
  fullAddress: string;
}

export type PartNumberStatus = 'validado' | 'revisao';
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