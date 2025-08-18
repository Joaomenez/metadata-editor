import React from 'react';
import { Edit3, X, CheckSquare } from 'lucide-react';

const BulkActions = ({ onEdit, onClear, onSelectAll, selectedCount, totalCount, disabled = false }) => {
  const isAllSelected = selectedCount === totalCount && totalCount > 0;

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onSelectAll}
        className={`h-[35px] flex items-center space-x-2 px-3 text-sm font-medium rounded-lg border shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${
          isAllSelected
            ? 'bg-blue-50 text-blue-700 border-blue-300'
            : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
        }`}
      >
        <CheckSquare className="w-4 h-4" />
        <span>{isAllSelected ? 'Desmarcar todos' : 'Selecionar todos'}</span>
      </button>

      <button
        onClick={onEdit}
        disabled={disabled}
        className={`h-[35px] flex items-center space-x-2 px-3 text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-150 select-none ${
          disabled 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-200' 
            : 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600'
        }`}
      >
        <Edit3 className="w-4 h-4" />
        <span>Editar Selecionadas ({selectedCount} de {totalCount})</span>
      </button>
      
      {selectedCount > 0 && (
        <button
          onClick={onClear}
          className="h-[35px] flex items-center space-x-2 px-3 text-sm bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-200 shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          <X className="w-4 h-4" />
          <span>Limpar Seleção</span>
        </button>
      )}
    </div>
  );
};

export default BulkActions;