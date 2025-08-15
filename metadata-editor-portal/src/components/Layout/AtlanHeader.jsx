import React from 'react';
import { User } from 'lucide-react';

const AtlanHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded flex items-center justify-center"
                style={{ backgroundColor: '#2960d4' }}
              >
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                Portal de Edição de Metadados
              </h1>
            </div>
            
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AtlanHeader;