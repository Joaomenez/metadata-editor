import React, { useState, useEffect } from 'react';
import TableCard from './TableCard';
import TableFilters from './TableFilters';
import SearchBar from './SearchBar';
import SelectionCounter from './SelectionCounter';
import BulkActions from './BulkActions';
import UploadSection from './UploadSection';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [filtersCollapsed, setFiltersCollapsed] = useState(true);

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
      if (newSelected.size < 5) {
        newSelected.add(tableId);
      } else {
        alert('Você pode selecionar no máximo 5 tabelas por vez');
      }
    }
    
    setSelectedTables(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedTables.size > 0) {
      setSelectedTables(new Set());
    } else {
      const tablesToSelect = filteredTables.slice(0, 5);
      setSelectedTables(new Set(tablesToSelect.map(t => t.guid)));
    }
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

  const handleExportSelected = () => {
    const selected = Array.from(selectedTables).map(id => 
      tables.find(t => t.guid === id)
    );
    
    // Criar estrutura JSON apenas com dados editáveis (descrições e metadados customizados)
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        version: "1.0",
        source: "Atlan Metadata Editor Portal",
        totalTables: selected.length,
        description: "Exportação contém apenas dados editáveis: descrições e metadados customizados"
      },
      assets: {
        tables: selected.map(table => ({
          guid: table.guid,
          name: table.name,
          qualifiedName: table.qualifiedName,
          // Apenas dados editáveis
          attributes: {
            description: table.description || ""
          },
          customMetadata: table.customMetadata || {},
          columns: (table.columns || []).map(column => ({
            guid: column.guid,
            name: column.name,
            qualifiedName: `${table.qualifiedName}.${column.name}`,
            // Apenas dados editáveis das colunas
            attributes: {
              description: column.description || ""
            },
            customMetadata: column.customMetadata || {}
          }))
        }))
      }
    };

    // Criar arquivo para download
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `atlan_metadata_editable_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`${selected.length} tabela(s) exportada(s) com dados editáveis!`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-atlan-blue"></div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Collapsible Filters */}
      <div className={`transition-all duration-300 ${filtersCollapsed ? 'w-0' : 'w-80'}`}>
        <div className={`h-full ${filtersCollapsed ? 'hidden' : 'block'}`}>
          <TableFilters 
            filters={filters}
            onFilterChange={setFilters}
            tables={tables}
            onToggleCollapse={() => setFiltersCollapsed(!filtersCollapsed)}
          />
        </div>
      </div>
      
      <div className="flex-1 px-6">
        {/* Upload Section */}
        <div className="mb-6">
          <UploadSection />
        </div>
        <div className="sticky top-0 bg-gray-50 pb-4 z-10">
          {/* Filter Toggle and Active Filters Indicator */}
          <div className="mb-4 flex items-center justify-between">
            {filtersCollapsed && (
              <button
                onClick={() => setFiltersCollapsed(false)}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                title="Expandir filtros"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">Filtros</span>
                {(filters.connection || filters.database || filters.schema) && (
                  <div className="w-2 h-2 bg-atlan-blue rounded-full"></div>
                )}
              </button>
            )}
            
            {filtersCollapsed && (filters.connection || filters.database || filters.schema) && (
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-600">Ativos:</span>
                {filters.connection && (
                  <span className="px-2 py-1 bg-atlan-blue-100 text-atlan-blue-700 rounded text-xs">
                    {filters.connection}
                  </span>
                )}
                {filters.database && (
                  <span className="px-2 py-1 bg-atlan-blue-100 text-atlan-blue-700 rounded text-xs">
                    {filters.database}
                  </span>
                )}
                {filters.schema && (
                  <span className="px-2 py-1 bg-atlan-blue-100 text-atlan-blue-700 rounded text-xs">
                    {filters.schema}
                  </span>
                )}
              </div>
            )}
          </div>

          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar tabelas por nome ou qualified name..."
          />
          
          <div className="mt-4 flex items-center justify-between">
            <div>
              {selectedTables.size > 0 && (
                <SelectionCounter 
                  selected={selectedTables.size}
                  max={5}
                />
              )}
            </div>
            <BulkActions 
              onEdit={handleEditSelected}
              onClear={handleClearSelection}
              onExport={handleExportSelected}
              selectedCount={selectedTables.size}
              disabled={selectedTables.size === 0}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTables.map((table) => (
            <TableCard
              key={table.guid}
              table={table}
              isSelected={selectedTables.has(table.guid)}
              onSelect={() => handleSelectTable(table.guid)}
              disabled={!selectedTables.has(table.guid) && selectedTables.size >= 5}
            />
          ))}
        </div>

        {filteredTables.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma tabela encontrada com os critérios especificados</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableListView;