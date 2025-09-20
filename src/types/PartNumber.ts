export type PartNumberStatus = 'validado' | 'revisao';
export interface PartNumber {
  id: string; 
  value: string; 
  country: string;
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