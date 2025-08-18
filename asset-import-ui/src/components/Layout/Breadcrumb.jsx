import React from 'react';
import { ChevronRight, Database, FileEdit } from 'lucide-react';

const Breadcrumb = ({ onNavigate, selectedTables }) => {
  const handleNavigateToTables = () => {
    onNavigate('tables');
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      <button
        onClick={handleNavigateToTables}
        className="flex items-center space-x-1 hover:text-atlan-blue transition-colors duration-150"
      >
        <Database className="w-4 h-4" />
        <span>Editor de Metadados</span>
      </button>
      
      <ChevronRight className="w-4 h-4 text-gray-400" />
      
      <div className="flex items-center space-x-1 text-gray-900 font-medium">
        <FileEdit className="w-4 h-4" />
        <span>
          Editor de Metadados&nbsp; 
          {selectedTables && selectedTables.length > 0 && (
            <span className="text-gray-500 font-normal">
               ({selectedTables.length} tabela{selectedTables.length > 1 ? 's' : ''} selecionada{selectedTables.length > 1 ? 's' : ''})
            </span>
          )}
        </span>
      </div>
    </nav>
  );
};

export default Breadcrumb;