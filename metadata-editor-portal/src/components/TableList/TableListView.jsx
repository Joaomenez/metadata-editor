import React, { useState, useEffect } from 'react';
import TableCard from './TableCard';
import TableFilters from './TableFilters';
import SearchBar from './SearchBar';
import SelectionCounter from './SelectionCounter';
import BulkActions from './BulkActions';
import { Filter, ChevronDown, ChevronUp, LayoutGrid, List } from 'lucide-react';
import { mockTables } from '../../data/mockData';

const TableListView = ({ onEditSelected }) => {
  const [tables, setTables] = useState([]);
  const [filteredTables, setFilteredTables] = useState([]);
  const [selectedTables, setSelectedTables] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    connection: '',
    database: '',
    schema: ''
  });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [compactView, setCompactView] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTables(mockTables);
      setFilteredTables(mockTables);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let result = tables;

    // Apply search
    if (searchQuery) {
      result = result.filter(table => 
        table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        table.qualifiedName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.connection) {
      result = result.filter(table => (table.connection || 'snowflake') === filters.connection);
    }
    if (filters.database) {
      result = result.filter(table => table.database === filters.database);
    }
    if (filters.schema) {
      result = result.filter(table => table.schema === filters.schema);
    }

    setFilteredTables(result);
  }, [searchQuery, filters, tables]);

  const handleSelectTable = (tableId) => {
    const newSelected = new Set(selectedTables);
    
    if (newSelected.has(tableId)) {
      newSelected.delete(tableId);
    } else {
      newSelected.add(tableId);
    }
    
    setSelectedTables(newSelected);
  };


  const handleEditSelected = () => {
    const selected = Array.from(selectedTables).map(id => 
      tables.find(t => t.guid === id)
    );
    onEditSelected(selected);
  };

  const handleClearSelection = () => {
    setSelectedTables(new Set());
  };

  const handleSelectAll = () => {
    if (selectedTables.size === filteredTables.length) {
      setSelectedTables(new Set());
    } else {
      setSelectedTables(new Set(filteredTables.map(t => t.guid)));
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-atlan-blue"></div>
      </div>
    );
  }

  return (
    <div className="h-full px-6">
        <div className="sticky top-0 pb-4 z-10 -mx-6 px-6" style={{ backgroundColor: '#f4f6fd' }}>
          {/* Filter Toggle Button and View Toggle */}
          <div className="mb-4 flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`h-[35px] flex items-center space-x-2 px-3 text-sm font-medium border shadow-sm rounded-lg transition-colors duration-200 ${
                showFilters 
                  ? 'bg-blue-50 text-blue-700 border-blue-300' 
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
              {(filters.connection || filters.database || filters.schema) && (
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
              {showFilters ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => setCompactView(!compactView)}
              className={`h-[35px] flex items-center space-x-2 px-3 text-sm font-medium border shadow-sm rounded-lg transition-colors duration-200 ${
                compactView 
                  ? 'bg-blue-50 text-blue-700 border-blue-300' 
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
              title={compactView ? 'Visualização normal' : 'Visualização compacta'}
            >
              {compactView ? (
                <LayoutGrid className="w-4 h-4" />
              ) : (
                <List className="w-4 h-4" />
              )}
            </button>
          </div>
            
          {/* Filters Section - Below buttons */}
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showFilters ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
            <TableFilters 
              filters={filters}
              onFilterChange={setFilters}
              tables={tables}
            />
          </div>

          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar tabelas por nome ou qualified name..."
          />

          
          <div className="mt-4 flex justify-end">
            <BulkActions 
              onEdit={handleEditSelected}
              onClear={handleClearSelection}
              onSelectAll={handleSelectAll}
              selectedCount={selectedTables.size}
              totalCount={filteredTables.length}
              disabled={selectedTables.size === 0}
            />
          </div>
        </div>

        <div className={`grid gap-4 ${compactView ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6' : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'}`}>
          {filteredTables.map((table) => (
            <TableCard
              key={table.guid}
              table={table}
              compact={compactView}
              isSelected={selectedTables.has(table.guid)}
              onSelect={() => handleSelectTable(table.guid)}
            />
          ))}
        </div>

        {filteredTables.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma tabela encontrada com os critérios especificados</p>
          </div>
        )}

        {/* Floating Selection Counter */}
        <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 transition-all duration-500 ease-in-out ${
          selectedTables.size > 0 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-20 pointer-events-none'
        }`}>
          <div className="shadow-2xl rounded-lg">
            <SelectionCounter 
              selected={selectedTables.size}
              total={filteredTables.length}
            />
          </div>
        </div>
    </div>
  );
};

export default TableListView;