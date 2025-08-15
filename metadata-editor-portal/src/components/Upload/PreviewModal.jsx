import React, { useState } from 'react';
import { X, Upload, AlertTriangle, Database, Columns } from 'lucide-react';

const PreviewModal = ({ jsonData, onClose, onConfirm, validation }) => {
  const [activeTab, setActiveTab] = useState('summary');

  const tables = jsonData?.assets?.tables || [];
  const totalColumns = tables.reduce((sum, table) => sum + (table.columns?.length || 0), 0);

  const getTablesWithChanges = () => {
    return tables.map(table => ({
      ...table,
      hasMetadataChanges: !!(table.attributes || table.customMetadata),
      hasColumnChanges: !!(table.columns?.some(col => col.attributes || col.customMetadata))
    }));
  };

  const tablesWithChanges = getTablesWithChanges();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Visualizar alterações
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Revise as alterações antes de importar
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex px-6">
            <button
              onClick={() => setActiveTab('summary')}
              className={`py-3 px-4 text-sm font-medium border-b-2 ${
                activeTab === 'summary'
                  ? 'border-atlan-blue text-atlan-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Resumo
            </button>
            <button
              onClick={() => setActiveTab('tables')}
              className={`py-3 px-4 text-sm font-medium border-b-2 ${
                activeTab === 'tables'
                  ? 'border-atlan-blue text-atlan-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Tabelas ({tables.length})
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`py-3 px-4 text-sm font-medium border-b-2 ${
                activeTab === 'json'
                  ? 'border-atlan-blue text-atlan-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              JSON Bruto
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === 'summary' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <Database className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-900">{tables.length}</div>
                  <div className="text-sm text-blue-700">Tabelas</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <Columns className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-900">{totalColumns}</div>
                  <div className="text-sm text-green-700">Colunas</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                  <AlertTriangle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-900">{validation?.warnings?.length || 0}</div>
                  <div className="text-sm text-purple-700">Avisos</div>
                </div>
              </div>

              {/* Changes Overview */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Resumo das alterações
                </h3>
                <div className="space-y-2">
                  {tablesWithChanges.map((table, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{table.name}</div>
                        <div className="text-sm text-gray-600">{table.qualifiedName}</div>
                      </div>
                      <div className="flex space-x-2">
                        {table.hasMetadataChanges && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Metadados da tabela
                          </span>
                        )}
                        {table.hasColumnChanges && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Metadados das colunas
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tables' && (
            <div className="space-y-4">
              {tables.map((table, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{table.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{table.qualifiedName}</p>
                      {table.attributes?.description && (
                        <p className="text-sm text-gray-700 mt-2">{table.attributes.description}</p>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {table.columns?.length || 0} colunas
                    </div>
                  </div>

                  {/* Custom Metadata Preview */}
                  {table.customMetadata && Object.keys(table.customMetadata).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="text-sm font-medium text-gray-700 mb-2">Custom Metadata:</div>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(table.customMetadata).map(([group, data]) => (
                          <div key={group} className="text-xs">
                            <span className="font-medium text-gray-600">{group}:</span>
                            <span className="ml-1 text-gray-500">
                              {Object.keys(data).length} campo(s)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'json' && (
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-xs text-gray-700 overflow-auto max-h-80">
                {JSON.stringify(jsonData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {validation?.warnings?.length > 0 && (
              <div className="flex items-center text-amber-600">
                <AlertTriangle className="w-4 h-4 mr-1" />
                {validation.warnings.length} aviso(s) encontrado(s)
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg"
              style={{ backgroundColor: '#2960d4' }}
            >
              <Upload className="w-4 h-4" />
              <span>Confirmar importação</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;