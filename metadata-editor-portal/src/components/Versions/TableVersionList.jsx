import React from 'react';
import { Database, Clock, User, ChevronRight, GitBranch } from 'lucide-react';

const TableVersionList = ({ tables, loading, onTableSelect }) => {
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-atlan-blue-600"></div>
          <span className="ml-2 text-gray-600">Carregando tabelas...</span>
        </div>
      </div>
    );
  }

  if (tables.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <GitBranch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Nenhuma tabela encontrada com versões armazenadas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Tabelas com Versões ({tables.length})
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Clique em uma tabela para visualizar o histórico de versões e comparar alterações
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {tables.map((table) => {
          const { date, time } = formatDateTime(table.lastModified);
          
          return (
            <div
              key={table.guid}
              onClick={() => onTableSelect(table)}
              className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Database className="w-5 h-5 text-atlan-blue-600" />
                    <h4 className="text-lg font-medium text-gray-900">{table.name}</h4>
                    <div className="flex items-center space-x-1">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {table.currentVersion}
                      </span>
                      {table.hasChanges && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Alterações Pendentes
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">{table.database}</span>
                    <span className="mx-1">•</span>
                    <span>{table.schema}</span>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <GitBranch className="w-4 h-4" />
                      <span>{table.versionCount} versões</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Última modificação: {date} às {time}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{table.lastModifiedBy}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TableVersionList;