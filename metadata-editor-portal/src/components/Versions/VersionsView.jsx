import React, { useState, useEffect } from 'react';
import { Database, Clock, ArrowLeft, RotateCcw, Search, ChevronRight } from 'lucide-react';
import TableVersionList from './TableVersionList';
import VersionDiffView from './VersionDiffView';

const VersionsView = () => {
  const [view, setView] = useState('list'); // 'list' or 'diff'
  const [selectedTable, setSelectedTable] = useState(null);
  const [tablesWithVersions, setTablesWithVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTablesWithVersions();
  }, []);

  const fetchTablesWithVersions = async () => {
    try {
      setLoading(true);
      // Simular chamada para endpoint /api/metadata/versions/tables
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - tabelas que possuem versões armazenadas
      const mockTablesWithVersions = [
        {
          guid: "table-001",
          name: "CUSTOMER_ACCOUNTS",
          database: "FINANCE_DB",
          schema: "ACCOUNTS",
          currentVersion: "v2.1",
          lastModified: "2024-12-15T14:30:00Z",
          lastModifiedBy: "joão.silva@banco.com",
          versionCount: 5,
          hasChanges: true
        },
        {
          guid: "table-002",
          name: "PAYMENT_HISTORY",
          database: "FINANCE_DB",
          schema: "TRANSACTIONS",
          currentVersion: "v1.3",
          lastModified: "2024-12-15T11:15:00Z",
          lastModifiedBy: "maria.santos@banco.com",
          versionCount: 3,
          hasChanges: true
        },
        {
          guid: "table-003",
          name: "CREDIT_SCORES",
          database: "RISK_DB",
          schema: "ANALYSIS",
          currentVersion: "v3.0",
          lastModified: "2024-12-14T16:45:00Z",
          lastModifiedBy: "carlos.oliveira@banco.com",
          versionCount: 8,
          hasChanges: true
        },
        {
          guid: "table-004",
          name: "CUSTOMER_SEGMENTS",
          database: "MARKETING_DB",
          schema: "CAMPAIGNS",
          currentVersion: "v1.1",
          lastModified: "2024-12-14T09:30:00Z",
          lastModifiedBy: "ana.costa@banco.com",
          versionCount: 2,
          hasChanges: false
        },
        {
          guid: "table-005",
          name: "KYC_RECORDS",
          database: "COMPLIANCE_DB",
          schema: "REGULATORY",
          currentVersion: "v4.2",
          lastModified: "2024-12-13T15:20:00Z",
          lastModifiedBy: "pedro.santos@banco.com",
          versionCount: 12,
          hasChanges: true
        }
      ];

      setTablesWithVersions(mockTablesWithVersions);
    } catch (error) {
      console.error('Erro ao buscar tabelas com versões:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableSelect = (table) => {
    setSelectedTable(table);
    setView('diff');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedTable(null);
  };

  const filteredTables = tablesWithVersions.filter(table =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.database.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.schema.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (view === 'diff' && selectedTable) {
    return (
      <VersionDiffView 
        table={selectedTable} 
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header e filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Controle de Versões</h2>
            <p className="text-sm text-gray-600 mt-1">
              Visualize e gerencie versões de metadados das suas tabelas
            </p>
          </div>
          
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar tabelas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-atlan-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de tabelas */}
      <TableVersionList 
        tables={filteredTables}
        loading={loading}
        onTableSelect={handleTableSelect}
      />
    </div>
  );
};

export default VersionsView;