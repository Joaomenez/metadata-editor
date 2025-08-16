import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

const AllowedValuesModal = ({ isOpen, onClose, column, onSave }) => {
  const [values, setValues] = useState([]);
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    if (isOpen && column) {
      setValues(column.allowedValues || []);
      setNewValue('');
    }
  }, [isOpen, column]);

  const handleAddValue = () => {
    if (newValue.trim() && !values.includes(newValue.trim())) {
      setValues([...values, newValue.trim()]);
      setNewValue('');
    }
  };

  const handleRemoveValue = (index) => {
    setValues(values.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(values);
    onClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddValue();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Valores Permitidos - {column?.name}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Add new value */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adicionar novo valor
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite um valor..."
              />
              <button
                onClick={handleAddValue}
                disabled={!newValue.trim() || values.includes(newValue.trim())}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar</span>
              </button>
            </div>
          </div>

          {/* List of values */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valores atuais ({values.length})
            </label>
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
              {values.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Nenhum valor definido
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {values.map((value, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50">
                      <span className="text-sm text-gray-900">{value}</span>
                      <button
                        onClick={() => handleRemoveValue(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Remover valor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllowedValuesModal;