import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePartNumberContext } from "../context/PartNumberContext";
import { mockClassifyPartNumber } from "../services/api"; //import da API real: import { classifyPartNumber } from "../services/api";
import type { ClassifiedData } from "../types/PartNumber";
import Loading from "./Loading";

const ClassifyPartNumber = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { partNumbers, setPartNumbers } = usePartNumberContext();
  
  const [classification, setClassification] = useState<ClassifiedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentPartNumber = partNumbers.find(pn => pn.id === id);

  useEffect(() => {
    if (!currentPartNumber) {
      alert("Part Number não encontrado!");
      navigate("/validate-partnumber");
      return;
    }

    if (currentPartNumber.classification) {
        setClassification(currentPartNumber.classification);
        setIsLoading(false);
    } else {
        // USANDO A FUNÇÃO MOCK
        mockClassifyPartNumber(currentPartNumber.value)
            .then(data => {
                setClassification(data);
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
        
        /* QUANDO ENTENDER BACKEND FAZER CHMAMADA REAL AQUI
           
           classifyPartNumber(currentPartNumber.value)
            .then(data => {
                setClassification(data);
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
        */
    }
  }, [currentPartNumber, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!classification) return;
    setClassification({
        ...classification,
        [e.target.name]: e.target.value
    });
  }

  const handleSave = () => {
    if (!currentPartNumber || !classification) return;

    setPartNumbers(prev => prev.map(pn => 
        pn.id === id 
        ? { ...pn, classification: classification, status: 'classificado' } 
        : pn
    ));

    alert("Dados salvos com sucesso!");
    navigate("/validate-partnumber");
  };
  
  if (isLoading) return (<div className="flex w-full items-center justify-center"><Loading loadingTitle="Processando PartNumber..." loadingMessage="Estamos enviando o Part Number para a IA classifica-lo."/></div>);
  if (error) return <div className="text-red-500 text-center p-8">{error}</div>;
  if (!classification || !currentPartNumber) return null;

  return (
    <div className="px-[8%] w-screen pb-10">
        <div className="flex flex-col px-[8%] md:px-20 lg:px-32 pb-10">
            <h1 className="pt-8 text-3xl font-bold text-gray-800">Revisão e Validação de Dados</h1>
            <p className="text-gray-500 font-medium my-4">Verifique e edite os dados gerados pela IA antes de criar o documento de importação.</p>

            {/* Informações do Produto */}
            <div className="border px-5 border-gray-200 rounded-2xl shadow-lg transition-all duration-300 mb-8">
                <h2 className="text-gray-950 font-semibold text-lg py-4">Informações do Produto</h2>
                <hr className="border-gray-200 mx-[-1.25rem]" />
                <div className="flex flex-col gap-5 py-3">
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium pb-2">Part-Number</label>
                        <input type="text" readOnly value={currentPartNumber.value} className="p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-blue-50"/>
                    </div>
                    <div>
                        <label className="text-gray-700 font-medium pb-2">Descrição do Produto</label>
                        <textarea id="description" name="description" value={classification.description} onChange={handleInputChange} rows={4} className="p-2 block w-full rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-blue-50"/> 
                        <p className="text-xs text-green-600 mt-2">✓ Gerado por IA (Confiança: 95%)</p>
                    </div>
                </div>
            </div>

            {/* Classificação Fiscal */}
            <div className="border px-5 border-gray-200 rounded-2xl shadow-lg transition-all duration-300 mb-8">
                <h2 className="text-gray-950 font-semibold text-lg py-4">Classificação Fiscal</h2>
                <hr className="border-gray-200 mx-[-1.25rem]" />
                <div className="flex justify-between py-3">
                    <div className="flex flex-col w-[48%]">
                        <label htmlFor="ncmCode" className="text-gray-700 font-medium pb-2">Código NCM</label>
                        <input type="text" id="ncmCode" name="ncmCode" value={classification.ncmCode} onChange={handleInputChange} className="p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-blue-50" />
                        <p className="text-xs text-green-600 mt-2">✓ Gerado por IA (Confiança: 99%)</p>
                    </div>
                    <div className="flex flex-col w-[48%]">
                        <label htmlFor="taxRate" className="text-gray-700 font-medium pb-2">Alíquota de Imposto (%)</label>
                        <input type="number" id="taxRate" name="taxRate" value={classification.taxRate} onChange={handleInputChange} className="p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-blue-50" />
                        <p className="text-xs text-green-600 mt-2">✓ Gerado por IA (Confiança: 97%)</p>
                    </div>
                </div>
            </div>

            {/* Dados do Fabricante */}
            <div className="border px-5 border-gray-200 rounded-2xl shadow-lg transition-all duration-300">
                <h2 className="text-gray-950 font-semibold text-lg py-4">Dados do Fabricante</h2>
                <hr className="border-gray-200 mx-[-1.25rem]" />
                <div className="flex justify-between py-3">
                    <div className="flex flex-col w-[48%]">
                        <label htmlFor="manufacturerName" className="text-gray-700 font-medium pb-2">Nome do Fabricante</label>
                        <input type="text" id="manufacturerName" name="manufacturerName" value={classification.manufacturerName} onChange={handleInputChange} className="p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-blue-50" />
                        <p className="text-xs text-green-600 mt-2">✓ Gerado por IA (Confiança: 92%)</p>
                    </div>
                    <div className="flex flex-col w-[48%]">
                        <label htmlFor="countryOfOrigin" className="text-gray-700 font-medium pb-2">País de Origem</label>
                        <input type="text" id="countryOfOrigin" name="countryOfOrigin" value={classification.countryOfOrigin} onChange={handleInputChange} className="p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-blue-50" />
                        <p className="text-xs text-green-600 mt-2">✓ Gerado por IA (Confiança: 96%)</p>
                    </div>
                    
                </div>
                <div className="flex flex-col pb-6">
                    <label htmlFor="fullAddress" className="text-gray-700 font-medium pb-2">Endereço Completo</label>
                    <textarea id="fullAddress" name="fullAddress" value={classification.fullAddress} onChange={handleInputChange} rows={3} className="p-2 block w-full rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-blue-50" />
                    <p className="text-xs text-green-600 mt-2">✓ Gerado por IA (Confiança: 89%)</p>
                </div>
            </div>
            
            {/* Ações */}
            <div className="flex justify-end gap-4 mt-8 pt-3">
                <button onClick={() => navigate('/validate-partnumber')} className="px-4 py-2 text-gray-700 font-semibold hover:bg-red-100 hover:text-red-400 rounded-md cursor-pointer transition-all duration-200">
                    Cancelar Processo
                </button>
                <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md cursor-pointer hover:bg-blue-500 hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 ease-in-out">
                    <i className="fa-solid fa-save"></i>
                    Salvar Classificação
                </button>
            </div>
        </div>
    </div>
      
  );
};

export default ClassifyPartNumber;