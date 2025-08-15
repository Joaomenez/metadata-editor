import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const SelectionCounter = ({ selected, max }) => {
  const percentage = (selected / max) * 100;
  const isMaxReached = selected === max;

  return (
    <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-lg border border-gray-200">
      <div className="flex items-center space-x-2">
        {isMaxReached ? (
          <AlertCircle className="w-5 h-5 text-amber-500" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-atlan-blue-600" />
        )}
        <span className="text-sm font-medium text-gray-700">
          {selected} de {max} tabelas selecionadas
        </span>
      </div>
      
      <div className="w-32 bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            isMaxReached ? 'bg-amber-500' : 'bg-atlan-blue-600'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {isMaxReached && (
        <span className="text-xs text-amber-600 font-medium">
          Máximo atingido
        </span>
      )}
    </div>
  );
};

export default SelectionCounter;