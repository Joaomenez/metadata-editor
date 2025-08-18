import React, { useState } from 'react';
import { Edit2, Check, X, Database } from 'lucide-react';
import ColumnDetailModal from './ColumnDetailModal';
import AllowedValuesModal from './AllowedValuesModal';

const ColumnMetadataEditor = ({ columns, tableId, customGroups }) => {
  const [editedColumns, setEditedColumns] = useState(columns.map(c => ({ ...c })));
  const [editingCell, setEditingCell] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAllowedValuesModal, setShowAllowedValuesModal] = useState(false);
  const [selectedColumnForValues, setSelectedColumnForValues] = useState(null);

  const handleCellEdit = (columnId, field) => {
    const column = editedColumns.find(c => c.guid === columnId);
    setEditingCell(`${columnId}-${field}`);
    setTempValue(column[field] || '');
  };

  const handleCellSave = (columnId, field) => {
    setEditedColumns(editedColumns.map(col =>
      col.guid === columnId ? { ...col, [field]: tempValue } : col
    ));
    setEditingCell(null);
    setTempValue('');
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setTempValue('');
  };

  const handleColumnDetail = (column) => {
    setSelectedColumn(column);
    setShowDetailModal(true);
  };

  const handleColumnUpdate = (updatedColumn) => {
    setEditedColumns(editedColumns.map(col =>
      col.guid === updatedColumn.guid ? updatedColumn : col
    ));
    setShowDetailModal(false);
    setSelectedColumn(null);
  };

  const handleOpenAllowedValuesModal = (column) => {
    setSelectedColumnForValues(column);
    setShowAllowedValuesModal(true);
  };

  const handleSaveAllowedValues = (values) => {
    if (selectedColumnForValues) {
      setEditedColumns(editedColumns.map(col =>
        col.guid === selectedColumnForValues.guid 
          ? { ...col, allowedValues: values }
          : col
      ));
    }
    setShowAllowedValuesModal(false);
    setSelectedColumnForValues(null);
  };


  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome da Coluna
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de Dados
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Propriedades
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {editedColumns.map((column) => (
                <tr key={column.guid} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <Database className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {column.name}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm text-gray-600 font-mono">
                      {column.dataType}
                    </span>
                  </td>
                  
                  <td className="px-4 py-3">
                    {editingCell === `${column.guid}-description` ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={tempValue}
                          onChange={(e) => setTempValue(e.target.value)}
                          className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-atlan-blue-500"
                          autoFocus
                        />
                        <button
                          onClick={() => handleCellSave(column.guid, 'description')}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCellCancel}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        className="group flex items-center justify-between cursor-pointer"
                        onClick={() => handleCellEdit(column.guid, 'description')}
                      >
                        <span className="text-sm text-gray-600 truncate max-w-xs">
                          {column.description || 'Sem descrição'}
                        </span>
                        <Edit2 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100" />
                      </div>
                    )}
                  </td>
                  
                  <td className="px-4 py-3">
                    <div className="space-y-4">
                      {/* Unique Key Indicator */}
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={column.isUniqueKey || false}
                          onChange={(e) => {
                            const newColumns = editedColumns.map(col =>
                              col.guid === column.guid 
                                ? { ...col, isUniqueKey: e.target.checked }
                                : col
                            );
                            setEditedColumns(newColumns);
                          }}
                          className="mr-2 text-blue-600 rounded focus:ring-blue-500"
                          style={{ accentColor: '#2960d4' }}
                        />
                        <span className="text-sm text-gray-700">Chave de Unicidade</span>
                      </label>

                      {/* NOT NULL Indicator */}
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!column.isNullable}
                          onChange={(e) => {
                            const newColumns = editedColumns.map(col =>
                              col.guid === column.guid 
                                ? { ...col, isNullable: !e.target.checked }
                                : col
                            );
                            setEditedColumns(newColumns);
                          }}
                          className="mr-2 text-red-600 rounded focus:ring-red-500"
                          style={{ accentColor: '#dc2626' }}
                        />
                        <span className="text-sm text-gray-700">NOT NULL</span>
                      </label>

                      {/* Allowed Values */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Valores Permitidos
                        </label>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {(column.allowedValues || []).length} valor(es) definido(s)
                          </span>
                          <button
                            onClick={() => handleOpenAllowedValuesModal(column)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Gerenciar valores
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDetailModal && selectedColumn && (
        <ColumnDetailModal
          column={selectedColumn}
          customGroups={customGroups}
          onSave={handleColumnUpdate}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedColumn(null);
          }}
        />
      )}

      <AllowedValuesModal
        isOpen={showAllowedValuesModal}
        column={selectedColumnForValues}
        onSave={handleSaveAllowedValues}
        onClose={() => {
          setShowAllowedValuesModal(false);
          setSelectedColumnForValues(null);
        }}
      />
    </>
  );
};

export default ColumnMetadataEditor;