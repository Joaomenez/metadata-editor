import React, { useState, useEffect } from 'react';
import { Clock, Database, User, Calendar, ChevronDown, ChevronUp, Search } from 'lucide-react';

const HistoryView = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      // Simular chamada para endpoint /api/metadata/history
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - em produção viria do endpoint
      const mockHistory = [
        {
          id: 'hist-001',
          timestamp: '2024-12-15T14:30:00Z',
          user: 'joão.silva@banco.com',
          action: 'metadata_update',
          tables: [
            { name: 'CUSTOMER_ACCOUNTS', database: 'FINANCE_DB', schema: 'ACCOUNTS' },
            { name: 'PAYMENT_HISTORY', database: 'FINANCE_DB', schema: 'TRANSACTIONS' }
          ],
          changes: {
            descriptions: 2,
            customMetadata: 3,
            columnMetadata: 5
          }
        },
        {
          id: 'hist-002',
          timestamp: '2024-12-15T11:15:00Z',
          user: 'maria.santos@banco.com',
          action: 'metadata_update',
          tables: [
            { name: 'CREDIT_SCORES', database: 'RISK_DB', schema: 'ANALYSIS' }
          ],
          changes: {
            descriptions: 1,
            customMetadata: 2,
            columnMetadata: 0
          }
        },
        {
          id: 'hist-003',
          timestamp: '2024-12-14T16:45:00Z',
          user: 'carlos.oliveira@banco.com',
          action: 'metadata_update',
          tables: [
            { name: 'CUSTOMER_SEGMENTS', database: 'MARKETING_DB', schema: 'CAMPAIGNS' },
            { name: 'KYC_RECORDS', database: 'COMPLIANCE_DB', schema: 'REGULATORY' },
            { name: 'PRODUCT_OFFERINGS', database: 'PRODUCTS_DB', schema: 'CATALOG' }
          ],
          changes: {
            descriptions: 3,
            customMetadata: 8,
            columnMetadata: 12
          }
        },
        {
          id: 'hist-004',
          timestamp: '2024-12-14T09:30:00Z',
          user: 'ana.costa@banco.com',
          action: 'metadata_update',
          tables: [
            { name: 'TRANSACTION_AUDIT', database: 'AUDIT_DB', schema: 'LOGS' }
          ],
          changes: {
            descriptions: 1,
            customMetadata: 1,
            columnMetadata: 3
          }
        },
        {
          id: 'hist-005',
          timestamp: '2024-12-13T15:20:00Z',
          user: 'pedro.santos@banco.com',
          action: 'metadata_update',
          tables: [
            { name: 'STAFF_RECORDS', database: 'HR_DB', schema: 'EMPLOYEES' }
          ],
          changes: {
            descriptions: 2,
            customMetadata: 1,
            columnMetadata: 4
          }
        }
      ];

      setHistoryData(mockHistory);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filteredHistory = historyData.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.tables.some(table => 
        table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        table.database.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      item.user.toLowerCase().includes(searchTerm.toLowerCase());

    const itemDate = new Date(item.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const matchesDateFilter = dateFilter === 'all' ||
      (dateFilter === 'today' && itemDate.toDateString() === today.toDateString()) ||
      (dateFilter === 'yesterday' && itemDate.toDateString() === yesterday.toDateString()) ||
      (dateFilter === 'week' && itemDate >= lastWeek);

    return matchesSearch && matchesDateFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-atlan-blue-600"></div>
        <span className="ml-2 text-gray-600">Carregando histórico...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por tabela, banco de dados ou usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-atlan-blue-500"
              />
            </div>
          </div>
          
          <div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-atlan-blue-500"
            >
              <option value="all">Todos os períodos</option>
              <option value="today">Hoje</option>
              <option value="yesterday">Ontem</option>
              <option value="week">Última semana</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de histórico */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Histórico de Salvamentos ({filteredHistory.length})
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Registro de todas as edições de metadados salvas pelos usuários
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredHistory.length === 0 ? (
            <div className="p-8 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum registro encontrado para os filtros selecionados</p>
            </div>
          ) : (
            filteredHistory.map((item) => {
              const { date, time } = formatDateTime(item.timestamp);
              const isExpanded = expandedItems.has(item.id);
              const totalChanges = item.changes.descriptions + item.changes.customMetadata + item.changes.columnMetadata;

              return (
                <div key={item.id} className="p-6 hover:bg-gray-50">
                  <div 
                    className="flex items-start justify-between cursor-pointer"
                    onClick={() => toggleExpanded(item.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-900">{date}</span>
                          <span className="text-sm text-gray-500">{time}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{item.user}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Database className="w-4 h-4 text-atlan-blue-600" />
                          <span className="text-sm font-medium text-gray-900">
                            {item.tables.length} tabela{item.tables.length > 1 ? 's' : ''} editada{item.tables.length > 1 ? 's' : ''}
                          </span>
                        </div>
                        
                        <span className="text-sm text-gray-500">
                          {totalChanges} {totalChanges > 1 ? 'alterações' : 'alteração'}
                        </span>
                      </div>

                      {!isExpanded && item.tables.length > 0 && (
                        <div className="mt-2">
                          <span className="text-sm text-gray-600">
                            {item.tables.slice(0, 2).map(table => table.name).join(', ')}
                            {item.tables.length > 2 && ` e mais ${item.tables.length - 2}...`}
                          </span>
                        </div>
                      )}
                    </div>

                    <button className="p-1 hover:bg-gray-100 rounded">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-200">
                      <div className="space-y-4">
                        {/* Tabelas editadas */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Tabelas Editadas:</h4>
                          <div className="space-y-1">
                            {item.tables.map((table, index) => (
                              <div key={index} className="flex items-center space-x-2 text-sm">
                                <Database className="w-3 h-3 text-gray-400" />
                                <span className="font-medium">{table.name}</span>
                                <span className="text-gray-500">•</span>
                                <span className="text-gray-500">{table.database}.{table.schema}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Resumo das alterações */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Resumo das Alterações:</h4>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <div className="font-medium text-blue-900">{item.changes.descriptions}</div>
                              <div className="text-blue-700">Descrições</div>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg">
                              <div className="font-medium text-green-900">{item.changes.customMetadata}</div>
                              <div className="text-green-700">Metadados Customizados</div>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-lg">
                              <div className="font-medium text-purple-900">{item.changes.columnMetadata}</div>
                              <div className="text-purple-700">Metadados de Colunas</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryView;