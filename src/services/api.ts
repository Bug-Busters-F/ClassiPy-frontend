import axios from 'axios';
import type { ClassifiedData, HistoryItem, InitialPartNumberPayload, InitialSaveResponseItem, UploadApiResponse } from '../types/PartNumber';

//rotas api
const API_URL = 'http://127.0.0.1:8000/'; 
const CLASSIFY_API_URL = '';

/**
 * Envia um arquivo PDF para o backend para extrair os Part Numbers.
 * @param file O arquivo PDF a ser enviado.
 * @returns Uma Promise que resolve com os dados da API.
 */

export const uploadAndProcessPdf = async (file: File): Promise<UploadApiResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const uploadFileUrl = `${API_URL}uploadfile/`;

    try {
        const response = await axios.post<UploadApiResponse>(uploadFileUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data; 
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error('Erro na resposta da API (upload):', error.response.data);
            throw new Error(`Erro do servidor: ${error.response.data.detail || 'Não foi possível processar o arquivo.'}`);
        } else {
            console.error('Erro ao enviar o PDF:', error);
            throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
        }
    }
};

// --- API CALL PARA CLASSIFICAR ---
export const classifyPartNumber = async (partNumberValue: string): Promise<ClassifiedData> => {
  try {
    const response = await axios.post<{ data: ClassifiedData }>(CLASSIFY_API_URL, {
      PartNumber: partNumberValue, 
    });
    return response.data.data; 
  } catch (error) {
    console.error(`Erro ao classificar o Part Number ${partNumberValue}:`, error);
    throw new Error('Não foi possível obter a classificação da IA.');
  }
};

// --- API CALL PARA SALVAR PARTNUMBER APOS LEITURA PDF ---
export const saveInitialPartNumbers = async (items: InitialPartNumberPayload[]): Promise<InitialSaveResponseItem[]> => {

  const saveUrl = `${API_URL}historico/`;

  try {
    // A API espera uma lista de { partNumber: string, fileHash: string }
    // E retorna uma lista de { pro_id: number, partNumber: string, fileHash: string }
    const response = await axios.post<InitialSaveResponseItem[]>(saveUrl, items);
    console.log(`${items.length} Part Numbers iniciais salvos/encontrados no histórico.`);
    return response.data; 
  } catch (error) {
    console.error('Erro ao salvar Part Numbers iniciais:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`Erro do servidor ao salvar PNs: ${error.response.data.detail || 'Erro desconhecido'}`);
    }
    throw new Error('Não foi possível registrar os Part Numbers extraídos.');
  }
};

// --- API CALL PARA HISTORICO ---
export const getHistory = async (): Promise<HistoryItem[]> => {
  //const historyUrl = API_URL + 'historico/'; 
  
  try {
    // QUANDO O BACKEND ESTIVER PRONTO:
    // const response = await axios.get<HistoryItem[]>(historyUrl);
    // return response.data;
    return mockGetHistory();
  } catch (error) {
    console.error('Erro ao buscar o histórico:', error);
    throw new Error('Não foi possível carregar o histórico.');
  }
};

// --- API CALL PARA UM ITEM DO HISTÓRICO ---A
export const getHistoryItemById = async (id: number): Promise<HistoryItem> => {
  // const historyItemUrl = `${API_URL}historico/${id}/`;
  try {
    // return (await axios.get<HistoryItem>(historyItemUrl)).data; // Para quando o backend estiver pronto
    return mockGetHistoryItemById(id);
  } catch (error) {
        console.error(`Erro ao buscar o item de histórico ${id}:`, error);
        throw new Error('Não foi possível carregar os detalhes do item.');
    }
};
// --- API CALL PARA ATUALIZAR UM ITEM DO HISTÓRICO ---
export const updateHistoryItemClassification = async (id: number, classification: ClassifiedData): Promise<HistoryItem> => {
    console.log(`Simulando PUT/PATCH para o item de histórico ${id} com os dados:`, classification);
    return new Promise(resolve => {
        setTimeout(() => {
            // Atualizar item no BACKEND aqui quando estiver pronto
            const updatedItem: HistoryItem = {
                historyId: id,
                fileHash: "hash-atualizado",
                processedDate: new Date().toISOString(),
                partNumber: `PN-ATUALIZADO-${id}`,
                status: "classificado",
                classification: classification
            };
            resolve(updatedItem);
        }, 300); // Resposta rápida
    });
};

// --- MOCK API CALL PARA HISTORICO ---
const mockGetHistory = (): Promise<HistoryItem[]> => {
  console.log("Simulando chamada para GET /historico");
  return new Promise(resolve => {
    setTimeout(() => {
      const mockHistory: HistoryItem[] = [
        {
          historyId: 101,
          fileHash: "hash123",
          processedDate: "2025-10-14T14:30:00Z",
          partNumber: "AXD-4815H62342-Z",
          status: "classificado",
          classification: { description: "Microcontrolador ARM Cortex-M4...", ncmCode: "8542.31.90", taxRate: 16.00, manufacturerName: "OmniChip Technologies", countryOfOrigin: "TW", fullAddress: "123 Innovation Drive..." }
        },
        {
          historyId: 102,
          fileHash: "hash123",
          processedDate: "2025-10-14T14:30:00Z",
          partNumber: "ABC-123-XYZ",
          status: "revisao",
          classification: null
        },
        {
          historyId: 103,
          fileHash: "hash456",
          processedDate: "2025-10-13T09:00:00Z",
          partNumber: "PN-MOCK-003",
          status: "classificado",
          classification: { description: "Capacitor Cerâmico Multicamada", ncmCode: "8532.24.10", taxRate: 12.00, manufacturerName: "Kyocera", countryOfOrigin: "JP", fullAddress: "6 Takeda Tobadono-cho..." }
        }
      ];
      resolve(mockHistory);
    }, 1000); 
  });
};

// --- MOCK API CALL PARA CLASSIFICAÇÃO ---
export const mockClassifyPartNumber = (partNumberValue: string): Promise<ClassifiedData> => {
  console.log(`Simulando classificação para o Part Number: ${partNumberValue}`);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockResponse: ClassifiedData = {
        description: `Microcontrolador ARM Cortex-M4, 32-bit, 180MHz, 512KB Flash, 128KB SRAM para o PN ${partNumberValue}`,
        ncmCode: "8542.31.90",
        taxRate: 16,
        manufacturerName: "OmniChip Technologies",
        countryOfOrigin: "Taiwan",
        fullAddress: "123 Innovation Drive, Hsinchu Science Park, Hsinchu 300, Taiwan",
      };
      console.log("Simulação de classificação concluída. Retornando dados:", mockResponse);
      resolve(mockResponse);
    }, 1500); 
  });
};

// --- MOCK API CALL PARA HISTORICO DE UM ITEM ---
const mockGetHistoryItemById = (id: number): Promise<HistoryItem> => {
  console.log(`Simulando chamada para GET /historico/${id}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockItem: HistoryItem = {
        historyId: id,
        fileHash: "hash-de-item-do-banco",
        processedDate: new Date().toISOString(),
        partNumber: `PN-DO-BANCO-${id}`,
        status: "classificado",
        classification: { 
            description: "Descrição carregada diretamente do banco de dados...", 
            ncmCode: "8542.31.90", 
            taxRate: 16.00, 
            manufacturerName: "Fabricante do Banco de Dados", 
            countryOfOrigin: "DB", 
            fullAddress: "Endereço vindo do Banco de Dados" 
        }
      };
      resolve(mockItem);
    }, 500);
  });
};