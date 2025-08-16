import React from 'react';
import CustomMetadataEditor from './CustomMetadataEditor';

const TableMetadataForm = ({ table, onChange, customGroups }) => {
  const handleFieldChange = (field, value) => {
    onChange({
      ...table,
      [field]: value
    });
  };

  const handleCustomMetadataChange = (groupName, data, changedPropertyName = null, changedValue = null) => {
    const updatedTable = {
      ...table,
      customMetadata: {
        ...table.customMetadata,
        [groupName]: data
      }
    };
    
    // If a specific property changed, track it for apply to all functionality
    const changedField = changedPropertyName ? `customMetadata.${groupName}.${changedPropertyName}` : null;
    
    onChange(updatedTable, changedField, changedValue);
  };


  return (
    <div className="space-y-6">
      {/* Basic Metadata */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Tabela
            </label>
            <input
              type="text"
              value={table.name}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome Lógico da Tabela
          </label>
          <input
            type="text"
            value={table.logicalName || ''}
            onChange={(e) => handleFieldChange('logicalName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-atlan-blue-500"
            placeholder="Digite o nome lógico da tabela..."
          />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            value={table.description || ''}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-atlan-blue-500"
            placeholder="Digite a descrição da tabela..."
          />
        </div>
      </div>


      {/* Custom Metadata */}
      <CustomMetadataEditor
        assetType="Table"
        customGroups={customGroups}
        customMetadata={table.customMetadata || {}}
        onChange={handleCustomMetadataChange}
      />
    </div>
  );
};

export default TableMetadataForm;