import React from 'react';
import { Users, X } from 'lucide-react';

const ApplyToAllFloatingButton = ({ 
  isVisible, 
  onApplyToAll, 
  onCancel, 
  changedField, 
  changedValue,
  tableCount 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 max-w-sm">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              Aplicar a todas as tabelas?
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Deseja aplicar "<strong>{changedField}</strong>" {changedField === 'Ofertas e Serviços de Negócio' ? 'com as ofertas selecionadas' : `com o valor "${changedValue}"`} para todas as {tableCount} tabelas selecionadas?
            </p>
            
            <div className="flex space-x-2">
              <button
                onClick={onApplyToAll}
                className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Aplicar para todas
              </button>
              <button
                onClick={onCancel}
                className="px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
          
          <button
            onClick={onCancel}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyToAllFloatingButton;