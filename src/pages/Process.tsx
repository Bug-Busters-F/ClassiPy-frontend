import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; 
import DragAndDropUploader from "../components/DragAndDropUploader";
import Loading from "./Loading";
import type { PartNumber, ApiResponse } from "../types/PartNumber";
import { usePartNumberContext } from "../context/PartNumberContext";
import { uploadAndProcessPdf } from "../services/api";

const Process = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const {setPartNumbers} = usePartNumberContext();
  const navigate = useNavigate();

  const handleFileSelected = (file: File) => {
    setUploadedFile(file);
    setError(null);
  };

  // --- MOCK API CALL ---
  // Esta função simula a chamada ao backend.
  // const mockApiCall = (file: File): Promise<ApiResponse> => {
  //   console.log(`Simulando processamento para o arquivo: ${file.name}`);
    
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       // Dados de exemplo que o backend retornaria
  //       const mockResponse: ApiResponse = {
  //         Parts: [
  //           { PartNumber: "PN-MOCK-001", CountryOfOrigin: "USA" },
  //           { PartNumber: "PN-MOCK-002", CountryOfOrigin: "Germany" },
  //           { PartNumber: "PN-MOCK-003", CountryOfOrigin: "Japan" },
  //           { PartNumber: "ABC-123-XYZ", CountryOfOrigin: "China" },
  //         ],
  //       };
  //       console.log("Simulação concluída. Retornando dados:", mockResponse);
  //       resolve(mockResponse);
  //     }, 1500); 
  //   });
  // };


  const handleProcessFile = async () => {
    if (!uploadedFile) {
      alert("Por favor, selecione um arquivo primeiro.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      //usando a função mock em vez da chamada real, substituir quando entender o back
      // const response = await mockApiCall(uploadedFile);

      //chamada real:
      const response = await uploadAndProcessPdf(uploadedFile);
      console.log("Resposta da API recebida:", response);
      
      const partNumbersFromApi: PartNumber[] = response.Parts.map(p => ({
        id: uuidv4(),
        value: p.PartNumber,
        country: p.CountryOfOrigin,
        status: 'revisao'
      }));

      setPartNumbers(partNumbersFromApi);
      navigate("/validate-partnumber");

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro inesperado.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading loadingTitle="Processando arquivo..." loadingMessage="Estamos processando o PDF, isso pode levar um tempo" />;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full flex flex-col items-center">
        <h2 className="font-bold text-4xl pb-5">Iniciar Novo Processo</h2>
        <p className="text-gray-600 font-medium text-base pb-5">
          Arraste e solte o arquivo PDF com o Part-Number ou clique para selecionar.
        </p>
      </div>
      <div className="min-w-full h-90">
        <DragAndDropUploader onFileSelect={handleFileSelected} />
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-8 min-w-full">
        <button
          onClick={handleProcessFile}
          disabled={!uploadedFile}
          className="
            min-w-full py-3 px-4 bg-blue-600 flex items-center justify-center text-white font-semibold rounded-lg
            shadow-md hover:bg-blue-500 focus:outline-none focus:ring-2 
            focus:ring-gray-500 focus:ring-opacity-75 transition-colors
            disabled:bg-gray-400 disabled:cursor-not-allowed enabled:cursor-pointer
          "
        >
          <i className="fa-solid fa-robot mr-3"></i>
          Processar com IA
        </button>
      </div>
    </div>
  );
};

export default Process;