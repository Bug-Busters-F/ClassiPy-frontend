// src/services/api.ts
import axios from 'axios';
import type { ApiResponse } from '../types/PartNumber';

const API_URL = ''; 

/**
 * Envia um arquivo PDF para o backend para extrair os Part Numbers.
 * @param file O arquivo PDF a ser enviado.
 * @returns Uma Promise que resolve com os dados da API.
 */

export const uploadAndProcessPdf = async (file: File): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append('pdfFile', file);

  try {
    const response = await axios.post<ApiResponse>(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    
    if (axios.isAxiosError(error) && error.response) {
      console.error('Erro na resposta da API:', error.response.data);
      throw new Error(`Erro do servidor: ${error.response.statusText || 'Não foi possível processar o arquivo.'}`);
    } else {
      console.error('Erro ao enviar o PDF:', error);
      throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
    }
  }
};