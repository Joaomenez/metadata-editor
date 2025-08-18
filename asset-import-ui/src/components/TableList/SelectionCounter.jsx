import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const SelectionCounter = ({ selected, total }) => {
  const percentage = total > 0 ? (selected / total) * 100 : 0;
  const isAllSelected = selected === total && total > 0;

  return (
    <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-lg border border-gray-200">
      <div className="flex items-center space-x-2">
        {isAllSelected ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-atlan-blue-600" />
        )}
        <span className="text-sm font-medium text-gray-700">
          {selected} de {total} tabelas selecionadas
        </span>
      </div>
      
      <div className="w-32 bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            isAllSelected ? 'bg-green-500' : 'bg-atlan-blue-600'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {isAllSelected && (
        <span className="text-xs text-green-600 font-medium">
          Todas selecionadas
        </span>
      )}
    </div>
  );
};

export default SelectionCounter;