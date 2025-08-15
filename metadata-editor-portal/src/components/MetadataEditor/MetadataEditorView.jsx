import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Send, X, Database, Columns, Check, Clock, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import TableMetadataForm from './TableMetadataForm';
import ColumnMetadataEditor from './ColumnMetadataEditor';
import Breadcrumb from '../Layout/Breadcrumb';
import { mockColumns } from '../../data/mockData';

const MetadataEditorView = ({ tables, onBack, onSaveDraft, onApplyChanges, customGroups }) => {
  const [editedTables, setEditedTables] = useState(tables.map(t => ({ ...t })));
  const [activeTable, setActiveTable] = useState(tables[0]?.guid);
  const [activeTab, setActiveTab] = useState('table');
  const [applicationStatus, setApplicationStatus] = useState({});
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const currentTable = editedTables.find(t => t.guid === activeTable);
  const currentColumns = mockColumns[activeTable] || [];

  // Reset tab to 'table' when switching between tables
  useEffect(() => {
    setActiveTab('table');
  }, [activeTable]);

  const handleTableChange = (updatedTable) => {
    setEditedTables(editedTables.map(t => 
      t.guid === activeTable ? updatedTable : t
    ));
  };

  const handleApplyTable = async (tableId) => {
    setApplicationStatus({ ...applicationStatus, [tableId]: 'applying' });
    
    // Simulate API call
    setTimeout(() => {
      setApplicationStatus({ ...applicationStatus, [tableId]: 'applied' });
    }, 2000);
  };

  const handleApplyAll = async () => {
    const pendingTables = editedTables.filter(t => 
      applicationStatus[t.guid] !== 'applied'
    );
    
    for (const table of pendingTables) {
      await handleApplyTable(table.guid);
    }
  };

  const getStatusIcon = (tableId) => {
    const status = applicationStatus[tableId];
    switch (status) {
      case 'applying':
        return <Clock className="w-4 h-4 text-yellow-600 animate-spin" />;
      case 'applied':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-300" />;
    }
  };

  const getStatusText = (tableId) => {
    const status = applicationStatus[tableId];
    switch (status) {
      case 'applying':
        return 'Applying...';
      case 'applied':
        return 'Applied';
      case 'error':
        return 'Error';
      default:
        return 'Pending';
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Breadcrumb spanning full width */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <Breadcrumb 
          onNavigate={onBack}
          selectedTables={editedTables}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar with selected tables */}
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} bg-white border-r border-gray-200 flex flex-col overflow-hidden transition-all duration-300 relative`}>
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <h2 className="text-lg font-semibold text-gray-900">Editor de Metadados</h2>
              )}
              <button 
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-1 hover:bg-gray-100 rounded"
                title={sidebarCollapsed ? 'Expandir painel' : 'Colapsar painel'}
              >
                {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {!sidebarCollapsed && (
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Tabelas Selecionadas ({editedTables.length})
                </h3>
              
                <div className="space-y-2">
                  {editedTables.map((table) => (
                    <div
                      key={table.guid}
                      onClick={() => setActiveTable(table.guid)}
                      className={`
                        p-3 rounded-lg cursor-pointer transition-all
                        ${activeTable === table.guid 
                          ? 'bg-atlan-blue-50 border-2 border-atlan-blue-600' 
                          : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                        }
                      `}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-2">
                          <Database className="w-4 h-4 mt-1 text-gray-600" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-900 truncate">
                              {table.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {table.database}.{table.schema}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(table.guid)}
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <span className={`text-xs ${
                          applicationStatus[table.guid] === 'applied' 
                            ? 'text-green-600' 
                            : applicationStatus[table.guid] === 'applying'
                            ? 'text-yellow-600'
                            : applicationStatus[table.guid] === 'error'
                            ? 'text-red-600'
                            : 'text-gray-500'
                        }`}>
                          {getStatusText(table.guid)}
                        </span>
                        
                        {applicationStatus[table.guid] !== 'applied' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApplyTable(table.guid);
                            }}
                            className="text-xs text-atlan-blue hover:text-atlan-blue-hover font-medium"
                          >
                            Aplicar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {sidebarCollapsed && (
              <div className="p-2">
                <div className="space-y-2">
                  {editedTables.map((table) => (
                    <div
                      key={table.guid}
                      onClick={() => setActiveTable(table.guid)}
                      className={`
                        p-2 rounded-lg cursor-pointer transition-all flex items-center justify-center
                        ${activeTable === table.guid 
                          ? 'bg-atlan-blue-50 border-2 border-atlan-blue-600' 
                          : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                        }
                      `}
                      title={table.name}
                    >
                      <Database className="w-4 h-4 text-gray-600" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!sidebarCollapsed && (
              <div className="mt-6 space-y-2 p-4">
                <button
                  onClick={onSaveDraft}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Rascunho</span>
                </button>
                
                <button
                  onClick={handleApplyAll}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors duration-150"
                  style={{ backgroundColor: '#2960d4' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#1e4ba8'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#2960d4'}
                >
                  <Send className="w-4 h-4" />
                  <span>Aplicar Todas as Alterações</span>
                </button>
              </div>
            )}
            
            {sidebarCollapsed && (
              <div className="mt-4 space-y-2 px-2">
                <button
                  onClick={onSaveDraft}
                  className="w-full flex items-center justify-center p-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  title="Salvar Rascunho"
                >
                  <Save className="w-4 h-4" />
                </button>
                
                <button
                  onClick={handleApplyAll}
                  className="w-full flex items-center justify-center p-2 text-white rounded-lg transition-colors duration-150"
                  style={{ backgroundColor: '#2960d4' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#1e4ba8'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#2960d4'}
                  title="Aplicar Todas as Alterações"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main editing area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {currentTable && (
            <>
              {/* Tabs */}
              <div className="bg-white border-b border-gray-200 flex-shrink-0">
                <div className="px-6">
                  <nav className="flex space-x-8">
                    <button
                      onClick={() => setActiveTab('table')}
                      className={`
                        py-4 px-1 border-b-2 font-medium text-sm
                        ${activeTab === 'table' 
                          ? 'border-atlan-blue-600 text-atlan-blue-600' 
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                        }
                      `}
                    >
                      <Database className="w-4 h-4 inline mr-2" />
                      Metadados da Tabela
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('columns')}
                      className={`
                        py-4 px-1 border-b-2 font-medium text-sm
                        ${activeTab === 'columns' 
                          ? 'border-atlan-blue-600 text-atlan-blue-600' 
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                        }
                      `}
                    >
                      <Columns className="w-4 h-4 inline mr-2" />
                      Metadados das Colunas ({currentColumns.length})
                    </button>
                  </nav>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'table' ? (
                  <TableMetadataForm
                    table={currentTable}
                    onChange={handleTableChange}
                    customGroups={customGroups}
                  />
                ) : (
                  <ColumnMetadataEditor
                    key={activeTable}
                    columns={currentColumns}
                    tableId={activeTable}
                    customGroups={customGroups}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetadataEditorView;