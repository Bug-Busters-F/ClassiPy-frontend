import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHistory } from '../services/api';
import type { HistoryItem } from '../types/PartNumber';
import StatusBadge from './StatusBadge';

const RecentPartnumber = () => {
  const [recentItems, setRecentItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHistory()
      .then((data) => {
        setRecentItems(data.slice(0, 5));
      })
      .catch(() => {
        setError('Não foi possível carregar os itens recentes.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []); 

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-gray-500 text-center py-4">Carregando recentes...</p>;
    }

    if (error) {
      return <p className="text-red-500 text-center py-4">{error}</p>;
    }

    if (recentItems.length === 0) {
      return (
        <div className="text-center py-10 px-5 text-gray-500 bg-white rounded-lg shadow-sm border border-gray-200">
            <span className="text-gray-400">
                <i className="fa-solid fa-file-lines fa-3x"></i>
            </span>
            <p className="mt-4 font-semibold">Nenhum processo recente.</p>
            <p>Inicie um novo processo para vê-lo aqui.</p>
        </div>
      );
    }
    return (
      <div className="space-y-3">
        {recentItems.map((item) => (
          <Link
            to="/history"
            key={item.historyId}
            className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_0.5fr] items-center gap-4 p-4 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-white cursor-pointer"
          >
           <div className="min-w-0"> 
              <p className="font-mono font-semibold text-gray-800">{item.partNumber}</p>
              <p className="text-sm text-gray-600 truncate" title={item.classification?.description || ''}>
                {item.classification?.description || 'Descrição não disponível'}
              </p>
            </div>

            <div>
                <p className="text-sm text-gray-700">
                    <span className='font-medium'>NCM:</span> {item.classification?.ncmCode || 'N/A'}
                </p>
                <p className="text-sm text-gray-500">
                    <span className='font-medium'>Data:</span> {new Date(item.processedDate).toLocaleDateString()}
                </p>
            </div>
            
            <div className="flex items-center justify-start md:justify-end">
              <StatusBadge status={item.status} />
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="py-2 md:py-5">
      <h3 className="text-3xl font-bold text-gray-800 mb-6">Processos Recentes</h3>
      
      {renderContent()}
    
      {!isLoading && !error && recentItems.length > 0 && (
          <div className="text-center mt-8">
            <Link to="/history" className="text-blue-600 font-semibold hover:underline p-2 rounded-md hover:bg-blue-50 transition-colors">
              Ver todo o histórico &rarr;
            </Link>
          </div>
      )}
    </div>
  );
};

export default RecentPartnumber;