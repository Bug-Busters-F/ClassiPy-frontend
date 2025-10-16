import { useState } from 'react';
import type { ClassifiedData, HistoryItem, PartNumberStatus } from '../types/PartNumber';
import { mockClassifyPartNumber } from '../services/api';
import Loading from '../pages/Loading';

interface ClassificationModalProps {
  item: HistoryItem;
  onClose: () => void;
  onSave: (updatedItem: HistoryItem) => void;
}

const ClassificationModal = ({ item, onClose, onSave }: ClassificationModalProps) => {
  const [classificationData, setClassificationData] = useState<ClassifiedData | null>(item.classification);
  const [isClassifying, setIsClassifying] = useState(false);

  const handleClassify = async () => {
    setIsClassifying(true);
    try {
      const data = await mockClassifyPartNumber(item.partNumber);
      setClassificationData(data);
    } catch (error) {
      console.error("Erro ao classificar:", error);
      alert("Não foi possível classificar o item.");
    } finally {
      setIsClassifying(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!classificationData) return;
    setClassificationData({ ...classificationData, [e.target.name]: e.target.value });
  };
  
  const handleSaveChanges = () => {
    if (!classificationData) return;
    const updatedItem = { ...item, status: 'classificado' as PartNumberStatus, classification: classificationData };
    onSave(updatedItem);
  };

  return (
    <div className="fixed inset-0 bg-gray-950/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-800">Detalhes do Part Number</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
          </div>

          {isClassifying ? (
            <Loading loadingTitle="Classificando..." loadingMessage="A IA está processando o Part Number." />
          ) : classificationData ? (
            <>
                <div className="border px-5 border-gray-200 rounded-2xl shadow-lg transition-all duration-300 mb-8">
                    <h2 className="text-gray-950 font-semibold text-lg py-4">Informações do Produto</h2>
                    <hr className="border-gray-200 mx-[-1.25rem]" />
                    <div className="flex flex-col gap-5 py-3">
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium pb-2">Part-Number</label>
                            <input type="text" readOnly value={item.partNumber} className="p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-blue-50"/>
                        </div>
                        <div>
                            <label className="text-gray-700 font-medium pb-2">Descrição do Produto</label>
                            <textarea id="description" name="description" value={classificationData.description} onChange={handleInputChange} rows={4} className="p-2 block w-full rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-blue-50"/> 
                            <p className="text-xs text-green-600 mt-2">✓ Gerado por IA (Confiança: 95%)</p>
                        </div>
                    </div>
                </div>
                <div className="border px-5 border-gray-200 rounded-2xl shadow-lg transition-all duration-300 mb-8">
                    <h2 className="text-gray-950 font-semibold text-lg py-4">Classificação Fiscal</h2>
                    <hr className="border-gray-200 mx-[-1.25rem]" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-3">
                        <div className="flex flex-col">
                            <label htmlFor="ncmCode" className="text-gray-700 font-medium pb-2">Código NCM</label>
                            <input type="text" id="ncmCode" name="ncmCode" value={classificationData.ncmCode} onChange={handleInputChange} className="p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-blue-50" />
                            <p className="text-xs text-green-600 mt-2">✓ Gerado por IA (Confiança: 99%)</p>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="taxRate" className="text-gray-700 font-medium pb-2">Alíquota de Imposto (%)</label>
                            <input type="number" id="taxRate" name="taxRate" value={classificationData.taxRate} onChange={handleInputChange} className="p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-blue-50" />
                            <p className="text-xs text-green-600 mt-2">✓ Gerado por IA (Confiança: 97%)</p>
                        </div>
                    </div>
                </div>

                {/* Dados do Fabricante */}
                <div className="border px-5 border-gray-200 rounded-2xl shadow-lg transition-all duration-300">
                    <h2 className="text-gray-950 font-semibold text-lg py-4">Dados do Fabricante</h2>
                    <hr className="border-gray-200 mx-[-1.25rem]" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-3">
                        <div className="flex flex-col">
                            <label htmlFor="manufacturerName" className="text-gray-700 font-medium pb-2">Nome do Fabricante</label>
                            <input type="text" id="manufacturerName" name="manufacturerName" value={classificationData.manufacturerName} onChange={handleInputChange} className="p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-blue-50" />
                            <p className="text-xs text-green-600 mt-2">✓ Gerado por IA (Confiança: 92%)</p>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="countryOfOrigin" className="text-gray-700 font-medium pb-2">País de Origem</label>
                            <input type="text" id="countryOfOrigin" name="countryOfOrigin" value={classificationData.countryOfOrigin} onChange={handleInputChange} className="p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-blue-50" />
                            <p className="text-xs text-green-600 mt-2">✓ Gerado por IA (Confiança: 96%)</p>
                        </div>
                        
                    </div>
                    <div className="flex flex-col pb-6">
                        <label htmlFor="fullAddress" className="text-gray-700 font-medium pb-2">Endereço Completo</label>
                        <textarea id="fullAddress" name="fullAddress" value={classificationData.fullAddress} onChange={handleInputChange} rows={3} className="p-2 block w-full rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-blue-50" />
                        <p className="text-xs text-green-600 mt-2">✓ Gerado por IA (Confiança: 89%)</p>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={onClose} className="px-4 py-2 text-gray-700 font-semibold hover:bg-gray-100 rounded-md">Cancelar</button>
                    <button onClick={handleSaveChanges} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">Salvar Alterações</button>
                </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Este item ainda não foi classificado.</p>
              <button onClick={handleClassify} className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700">
                <i className="fa-solid fa-robot mr-2"></i>
                Classificar com IA
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassificationModal;