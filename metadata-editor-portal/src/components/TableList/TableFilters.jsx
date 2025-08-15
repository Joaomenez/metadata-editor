import React from 'react';
import { Filter, X, ChevronLeft } from 'lucide-react';

const TableFilters = ({ filters, onFilterChange, tables, onToggleCollapse }) => {
  // Extract unique values from tables
  const connections = [...new Set(tables.map(t => t.connection || 'snowflake'))];
  const databases = [...new Set(tables.map(t => t.database))];
  const schemas = [...new Set(tables.map(t => t.schema))];

  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFilterChange({
      connection: '',
      database: '',
      schema: ''
    });
  };

  const hasActiveFilters = filters.connection || filters.database || filters.schema;

  return (
    <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filtros</h3>
          </div>
          <button
            onClick={onToggleCollapse}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
            title="Colapsar filtros"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        {hasActiveFilters && (
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="text-sm hover:underline"
              style={{ color: '#2960d4' }}
              onMouseEnter={(e) => e.target.style.color = '#1e4ba8'}
              onMouseLeave={(e) => e.target.style.color = '#2960d4'}
            >
              Limpar tudo
            </button>
          </div>
        )}
      </div>

      <div className="p-4 space-y-6">
        {/* Connection Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Conexão
          </label>
          <select
            value={filters.connection || ''}
            onChange={(e) => handleFilterChange('connection', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ focusRingColor: '#2960d4' }}
          >
            <option value="">Todas as conexões</option>
            {connections.map(conn => (
              <option key={conn} value={conn}>{conn}</option>
            ))}
          </select>
        </div>

        {/* Database Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Banco de Dados
          </label>
          <select
            value={filters.database || ''}
            onChange={(e) => handleFilterChange('database', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ focusRingColor: '#2960d4' }}
          >
            <option value="">Todos os bancos</option>
            {databases.map(db => (
              <option key={db} value={db}>{db}</option>
            ))}
          </select>
        </div>

        {/* Schema Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Schema
          </label>
          <select
            value={filters.schema || ''}
            onChange={(e) => handleFilterChange('schema', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ focusRingColor: '#2960d4' }}
          >
            <option value="">Todos os schemas</option>
            {schemas.map(schema => (
              <option key={schema} value={schema}>{schema}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TableFilters;