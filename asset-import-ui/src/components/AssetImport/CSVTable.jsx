import React, { useState } from 'react';
import { Edit3, Check, X, Star } from 'lucide-react';

const CSVTable = ({ data, headers, onDataUpdate }) => {
  const [editingCell, setEditingCell] = useState({ row: -1, column: '' });
  const [editValue, setEditValue] = useState('');

  // Required columns based on Atlan specification
  const requiredColumns = ['qualifiedName', 'typeName', 'name', 'connectionQualifiedName', 'connectorType'];

  const startEdit = (rowIndex, columnKey, currentValue) => {
    setEditingCell({ row: rowIndex, column: columnKey });
    setEditValue(currentValue || '');
  };

  const saveEdit = () => {
    if (editingCell.row >= 0 && editingCell.column) {
      onDataUpdate(editingCell.row, editingCell.column, editValue);
    }
    cancelEdit();
  };

  const cancelEdit = () => {
    setEditingCell({ row: -1, column: '' });
    setEditValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const isRequired = (columnKey) => requiredColumns.includes(columnKey);
  const isEditing = (rowIndex, columnKey) => 
    editingCell.row === rowIndex && editingCell.column === columnKey;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                #
              </th>
              {headers.map((header) => (
                <th 
                  key={header} 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]"
                >
                  <div className="flex items-center space-x-2">
                    <span>{header}</span>
                    {isRequired(header) && (
                      <Star className="h-3 w-3 text-yellow-500 fill-current" title="Campo obrigatório" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-500 font-medium">
                  {rowIndex + 1}
                </td>
                {headers.map((header) => (
                  <td 
                    key={`${rowIndex}-${header}`} 
                    className="px-4 py-3 text-sm text-gray-900 relative group"
                  >
                    {isEditing(rowIndex, header) ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyPress={handleKeyPress}
                          onBlur={saveEdit}
                          autoFocus
                          className={`
                            flex-1 px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-atlan-blue-500
                            ${isRequired(header) && !editValue.trim() 
                              ? 'border-red-300 focus:ring-red-500' 
                              : 'border-gray-300'
                            }
                          `}
                        />
                        <button
                          onClick={saveEdit}
                          className="p-1 text-green-600 hover:text-green-800"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        className={`
                          cursor-pointer hover:bg-gray-100 px-2 py-1 rounded min-h-[24px] flex items-center justify-between
                          ${isRequired(header) && !row[header]?.trim() 
                            ? 'bg-red-50 border border-red-200' 
                            : ''
                          }
                        `}
                        onClick={() => startEdit(rowIndex, header, row[header])}
                      >
                        <span className={`${!row[header]?.trim() ? 'text-gray-400 italic' : ''}`}>
                          {row[header] || 'Clique para editar...'}
                        </span>
                        <Edit3 className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                    
                    {isRequired(header) && !row[header]?.trim() && !isEditing(rowIndex, header) && (
                      <div className="absolute -top-1 -right-1">
                        <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border border-gray-200 rounded-lg">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span>Campo obrigatório</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-red-500 rounded-full"></div>
            <span>Campo obrigatório vazio</span>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Total: {data.length} registros
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="text-sm text-yellow-800">
          <p className="font-medium mb-2">Dicas para edição:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Clique em qualquer célula para editá-la</li>
            <li>Pressione Enter para salvar ou Esc para cancelar</li>
            <li>Campos com estrela são obrigatórios</li>
            <li>Células com ponto vermelho precisam ser preenchidas</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CSVTable;