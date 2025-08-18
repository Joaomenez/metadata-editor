import React from 'react';
import { Filter, X } from 'lucide-react';

const TableFilters = ({ filters, onFilterChange, tables }) => {
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
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filtros</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm hover:underline flex items-center space-x-1"
            style={{ color: '#2960d4' }}
            onMouseEnter={(e) => e.target.style.color = '#1e4ba8'}
            onMouseLeave={(e) => e.target.style.color = '#2960d4'}
          >
            <X className="w-4 h-4" />
            <span>Limpar tudo</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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