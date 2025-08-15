import React from 'react';
import { Edit3, X, Download, Upload } from 'lucide-react';
import { getAtlanButtonStyle, handleAtlanHover, handleAtlanLeave } from '../../utils/atlantColors';

const BulkActions = ({ onEdit, onClear, onExport, selectedCount, disabled = false }) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onEdit}
        disabled={disabled}
        className={`flex items-center space-x-2 px-4 py-2 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-150 ${
          disabled 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
            : ''
        }`}
        style={disabled ? {} : getAtlanButtonStyle('primary')}
        onMouseEnter={disabled ? undefined : (e) => handleAtlanHover(e.target, 'primary')}
        onMouseLeave={disabled ? undefined : (e) => handleAtlanLeave(e.target, 'primary')}
      >
        <Edit3 className="w-4 h-4" />
        <span>Editar Selecionadas ({selectedCount})</span>
      </button>

      <button
        onClick={onExport}
        disabled={disabled}
        className={`flex items-center space-x-2 px-4 py-2 font-medium rounded-lg border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${
          disabled
            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
            : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
        }`}
      >
        <Download className="w-4 h-4" />
        <span>Exportar JSON ({selectedCount})</span>
      </button>
      
      {selectedCount > 0 && (
        <button
          onClick={onClear}
          className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-300 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          <X className="w-4 h-4" />
          <span>Limpar Seleção</span>
        </button>
      )}
    </div>
  );
};

export default BulkActions;