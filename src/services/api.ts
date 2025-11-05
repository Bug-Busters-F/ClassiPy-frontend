import axios from 'axios';
import type { ClassifiedData, HistoryItem, InitialPartNumberPayload, InitialSaveResponseItem, UploadApiResponse, BackendClassificationResponse, BackendHistoryResponse, BackendUpdatePayload, ClassificationPayload } from '../types/PartNumber';

//rotas api
const API_URL = 'http://127.0.0.1:8000/';

const api = axios.create({
  baseURL: API_URL,
});

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
  const encodedPartNumber = encodeURIComponent(partNumberValue);
  const classifyUrl = `${API_URL}classify/${encodedPartNumber}`;
  console.log(`Buscando classificação real para: ${partNumberValue}`);

  try {
    const response = await axios.get<BackendClassificationResponse>(classifyUrl, {
      headers: { 'Accept': 'application/json' }
    });
    const backendData = response.data;

    const mappedData: ClassifiedData = {
      description: backendData.descricao,
      ncmCode: backendData.ncm,              
      taxRate: backendData.aliquota,     
      manufacturerName: backendData.fabricante, 
      countryOfOrigin: "N/A (API)", 
      fullAddress: "N/A (API)",
    };
    console.log("Classificação real recebida e mapeada:", mappedData);
    return mappedData;
  } catch (error) {
    console.error(`Erro ao classificar o Part Number ${partNumberValue}:`, error);
    
    if (axios.isAxiosError(error) && error.response) {
      const errorDetail = error.response.data?.detail || 'Erro desconhecido da API';
      throw new Error(`Não foi possível obter a classificação: ${errorDetail}`);
    } else {
      throw new Error('Não foi possível conectar ao servidor de classificação.');
    }
  }
};

// --- API CALL PARA SALVAR PARTNUMBER APOS LEITURA PDF ---
export const saveInitialPartNumbers = async (items: InitialPartNumberPayload[]): Promise<InitialSaveResponseItem[]> => {

  const saveUrl = `${API_URL}produto/`;

  try {
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

export const deleteProduto = async (id: number) => {
  const deleteUrl = `${API_URL}produto/${id}`;
  try {
    const response = await axios.delete(deleteUrl);
    console.log(`Produto ${id} deletado com sucesso:`, response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Erro ao deletar produto:', error.response.data);
      throw new Error(error.response.data.detail || 'Erro ao deletar produto.');
    } else {
      console.error('Erro desconhecido ao deletar produto:', error);
      throw new Error('Erro de conexão com o servidor.');
    }
  }
};

// --- API CALL PARA HISTORICO ---
export const getHistory = async (): Promise<HistoryItem[]> => {
  const historyUrl = `${API_URL}historico/`;
  try {
    const response = await axios.get<BackendHistoryResponse[]>(historyUrl);
  
    const mappedItems: HistoryItem[] = response.data.map(backendItem => {
      let mappedClassification: ClassifiedData | null = null;
      if (backendItem.classification) {
        mappedClassification = {
          description: backendItem.classification.description,
          ncmCode: backendItem.classification.ncmCode,
          taxRate: backendItem.classification.taxRate,
          manufacturerName: backendItem.classification.manufacturer.name,
          countryOfOrigin: backendItem.classification.manufacturer.country,
          fullAddress: backendItem.classification.manufacturer.address,
        };
      }

      return {
        productId: backendItem.pro_id ?? null,
        historyId: backendItem.historyId,
        fileHash: backendItem.fileHash,
        processedDate: backendItem.processedDate,
        partNumber: backendItem.partNumber,
        status: backendItem.status,
        classification: mappedClassification
      };
    });
    return mappedItems;
  } catch (error) {
    console.error('Erro ao buscar o histórico:', error);
    throw new Error('Não foi possível carregar o histórico.');
  }
};

export const deleteHistory = async (historyId: number): Promise<void> => {
  try {
    await api.delete(`/historico/${historyId}`);
  } catch (error) {
    console.error(`Erro ao deletar entrada do histórico ${historyId}: `, error);
    throw new Error("Falha ao excluir entrada do histório.");
  }
};

// --- API CALL PARA SALVAR/ATUALIZAR CLASSIFICAÇÃO ---
export const updateProductClassification = async (
  productId: number, 
  partNumber: string,
  classificationData: ClassifiedData
): Promise<HistoryItem> => {
  
  const updateUrl = `${API_URL}produto/${productId}`;
  
  const payload: BackendUpdatePayload = {
    partNumber: partNumber,  
    description: classificationData.description, 
    status: 'validado',

    classification: {
      description: classificationData.description,
      ncmCode: classificationData.ncmCode,
      taxRate: classificationData.taxRate,
    },
    manufacturer: {
      name: classificationData.manufacturerName,
      country: classificationData.countryOfOrigin,
      address: classificationData.fullAddress,
    }
  };

  console.log(`Salvando classificação para Produto ID: ${productId} com payload:`, payload);

  try {
    const response = await axios.put<BackendHistoryResponse>(updateUrl, payload);
    
    const backendItem = response.data;
    let mappedClassification: ClassifiedData | null = null;
    if (backendItem.classification) {
      mappedClassification = {
        description: backendItem.classification.description,
        ncmCode: backendItem.classification.ncmCode,
        taxRate: backendItem.classification.taxRate,
        manufacturerName: backendItem.classification.manufacturer.name,
        countryOfOrigin: backendItem.classification.manufacturer.country,
        fullAddress: backendItem.classification.manufacturer.address,
      };
    }

    const mappedHistoryItem: HistoryItem = {
      productId: productId, 
      historyId: backendItem.historyId,
      fileHash: backendItem.fileHash,
      processedDate: backendItem.processedDate,
      partNumber: backendItem.partNumber, 
      status: backendItem.status,
      classification: mappedClassification
    };
    
    return mappedHistoryItem;

  } catch (error) {
    console.error(`Erro ao salvar a classification para o produto ${productId}:`, error);

    if (axios.isAxiosError(error) && error.response) {
      let detailMsg = 'Erro desconhecido';
      if (error.response.data && error.response.data.detail) {
        if (Array.isArray(error.response.data.detail)) {
          detailMsg = error.response.data.detail
            .map((err: any) => `Campo: ${err.loc.join(' > ')}, Erro: ${err.msg}`)
            .join('; ');
        } else {
          detailMsg = String(error.response.data.detail);
        }
      }
      throw new Error(`Erro do servidor ao salvar: ${detailMsg}`);
    } else {
      throw new Error('Não foi possível conectar ao servidor para salvar a classification.');
    }
  }
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

export const getClassificationForProduct = async (productId: number): Promise<ClassifiedData> => {
  try {
    const response = await api.get(`/produto/${productId}/classification`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar classificação para o produto ${productId}:`, error);
    throw new Error(`Falha ao buscar dados de classificação para o produto ${productId}.`);
  }
};