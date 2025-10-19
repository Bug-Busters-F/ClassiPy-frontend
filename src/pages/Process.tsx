import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; 
import DragAndDropUploader from "../components/DragAndDropUploader";
import Loading from "./Loading";
import type { PartNumber, InitialPartNumberPayload, ApiPartNumber } from "../types/PartNumber";
import { usePartNumberContext } from "../context/PartNumberContext";
import { saveInitialPartNumbers, uploadAndProcessPdf } from "../services/api";

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

  const handleProcessFile = async () => {
    if (!uploadedFile) {
      alert("Por favor, selecione um arquivo primeiro.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const uploadResponse = await uploadAndProcessPdf(uploadedFile);
      console.log("Resposta da API (upload):", uploadResponse);

      const fileHash = (uploadResponse as any).hash_code;
      const extractedParts = uploadResponse.Parts || [];

      if (extractedParts.length === 0) {
          alert("Nenhum Part Number encontrado no PDF.");
          setIsLoading(false); // Para o loading se não houver PNs
          return; // Interrompe a execução
      }

      if (!fileHash) {
          console.warn("API de upload não retornou hash_code. Não será possível salvar no histórico inicial agora.");
          const partNumbersForContext: PartNumber[] = extractedParts.map((part: ApiPartNumber) => ({
              id: uuidv4(),
              productId: null, 
              value: part.PartNumber,
              country: part.CountryOfOrigin || '',
              status: 'revisao'
          }));
          setPartNumbers(partNumbersForContext);
          navigate("/validate-partnumber");
          return;
      }

      const payloadToSave: InitialPartNumberPayload[] = extractedParts.map((part: ApiPartNumber) => ({
          partNumber: part.PartNumber,
          fileHash: fileHash
      }));

      // 3. CHAMA A FUNÇÃO para salvar no banco e OBTÉM OS IDs
      const savedItemsResponse = await saveInitialPartNumbers(payloadToSave);

      // 4. Cria um mapa para associar PartNumber -> productId (pro_id)
      const idMap = new Map(savedItemsResponse.map(item => [item.partNumber, item.pro_id]));

      // 5. Formata a lista final para o Context, incluindo o productId
      const partNumbersWithIds: PartNumber[] = extractedParts.map((part: ApiPartNumber) => ({
        id: uuidv4(), // ID único do frontend
        productId: idMap.get(part.PartNumber) ?? null, // ID do backend (pro_id)
        value: part.PartNumber,
        country: part.CountryOfOrigin || '',
        status: 'revisao'
      }));

      // 6. Atualiza o Context e navega
      setPartNumbers(partNumbersWithIds);
      navigate("/validate-partnumber");

    } catch (err) {
      // Tratamento de erro mais específico
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro inesperado durante o processamento.");
      }
      console.error("Erro em handleProcessFile:", err);
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