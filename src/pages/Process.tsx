import { useState } from "react"
import DragAndDropUploader from "../components/DragAndDropUploader"

const Process = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const handleFileSelected = (file : File) => {
    console.log("Arquivo:", file);
    setUploadedFile(file); // upload file para backend - continuar logica aqui
  }

  const handleProcessFile = () => {
    if(!uploadedFile) {
      alert("Por favor, selecione um arquivo primeiro.");
      return;
    }
    alert(`Processando o arquivo: ${uploadedFile.name}`)
    // upload file para IA ler - continuar logica aqui
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full flex flex-col items-center">
        <h2 className="font-bold text-4xl pb-5">Iniciar Novo Processo</h2>
        <p className="text-gray-600 font-medium text-base pb-5">Arraste e solte o arquivo PDF com o Part-Number ou clique para selecionar.</p>
      </div>
      <div className="min-w-full h-90">
        <DragAndDropUploader onFileSelect={handleFileSelected}/>
      </div>
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
  )
}

export default Process;