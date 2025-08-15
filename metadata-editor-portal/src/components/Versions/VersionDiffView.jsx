import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Clock, User, AlertTriangle, Check, X } from 'lucide-react';

const VersionDiffView = ({ table, onBack }) => {
  const [versionData, setVersionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRollbackModal, setShowRollbackModal] = useState(false);
  const [rollbackLoading, setRollbackLoading] = useState(false);

  useEffect(() => {
    fetchVersionData();
  }, [table.guid]);

  const fetchVersionData = async () => {
    try {
      setLoading(true);
      // Simular chamada para endpoint /api/metadata/versions/{tableId}/diff
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - comparação entre versão atual e anterior
      const mockVersionData = {
        currentVersion: {
          version: "v2.1",
          timestamp: "2024-12-15T14:30:00Z",
          user: "joão.silva@banco.com",
          description: "Atualização das descrições e metadados customizados",
          metadata: {
            description: "Tabela principal de contas de clientes contendo informações pessoais e dados de relacionamento bancário",
            logicalName: "Contas de Clientes Principal",
            customMetadata: {
              DisponibilizacaoAtivo: {
                Periodicidade: "Diaria",
                DefasagemCarga: "D-1",
                RetencaoMeses: 24
              },
              GoldenSource: {
                GoldenSource: true,
                EntidadeConceitual: "Contas de Clientes"
              }
            }
          }
        },
        previousVersion: {
          version: "v2.0",
          timestamp: "2024-12-14T10:15:00Z",
          user: "maria.santos@banco.com",
          description: "Ajustes na retenção de dados",
          metadata: {
            description: "Main customer accounts table containing all active and inactive account records",
            logicalName: "Customer Accounts",
            customMetadata: {
              DisponibilizacaoAtivo: {
                Periodicidade: "Diaria",
                DefasagemCarga: "D0",
                RetencaoMeses: 12
              },
              GoldenSource: {
                GoldenSource: false,
                EntidadeConceitual: "Customer Accounts"
              }
            }
          }
        },
        changes: [
          {
            field: "description",
            type: "modified",
            current: "Tabela principal de contas de clientes contendo informações pessoais e dados de relacionamento bancário",
            previous: "Main customer accounts table containing all active and inactive account records"
          },
          {
            field: "logicalName",
            type: "modified",
            current: "Contas de Clientes Principal",
            previous: "Customer Accounts"
          },
          {
            field: "customMetadata.DisponibilizacaoAtivo.DefasagemCarga",
            type: "modified",
            current: "D-1",
            previous: "D0"
          },
          {
            field: "customMetadata.DisponibilizacaoAtivo.RetencaoMeses",
            type: "modified",
            current: 24,
            previous: 12
          },
          {
            field: "customMetadata.GoldenSource.GoldenSource",
            type: "modified",
            current: true,
            previous: false
          },
          {
            field: "customMetadata.GoldenSource.EntidadeConceitual",
            type: "modified",
            current: "Contas de Clientes",
            previous: "Customer Accounts"
          }
        ]
      };

      setVersionData(mockVersionData);
    } catch (error) {
      console.error('Erro ao buscar dados da versão:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async () => {
    try {
      setRollbackLoading(true);
      // Simular chamada para endpoint /api/metadata/versions/{tableId}/rollback
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Rollback realizado com sucesso! A tabela foi revertida para a versão anterior.');
      setShowRollbackModal(false);
      onBack();
    } catch (error) {
      console.error('Erro ao fazer rollback:', error);
      alert('Erro ao realizar rollback. Tente novamente.');
    } finally {
      setRollbackLoading(false);
    }
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getChangeIcon = (type) => {
    switch (type) {
      case 'added':
        return <span className="text-green-600">+</span>;
      case 'removed':
        return <span className="text-red-600">-</span>;
      case 'modified':
        return <span className="text-blue-600">~</span>;
      default:
        return null;
    }
  };

  const getFieldLabel = (field) => {
    const fieldLabels = {
      'description': 'Descrição',
      'logicalName': 'Nome Lógico',
      'customMetadata.DisponibilizacaoAtivo.Periodicidade': 'Periodicidade',
      'customMetadata.DisponibilizacaoAtivo.DefasagemCarga': 'Defasagem da Carga',
      'customMetadata.DisponibilizacaoAtivo.RetencaoMeses': 'Retenção (meses)',
      'customMetadata.GoldenSource.GoldenSource': 'Golden Source',
      'customMetadata.GoldenSource.EntidadeConceitual': 'Entidade Conceitual'
    };
    return fieldLabels[field] || field;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-atlan-blue-600"></div>
        <span className="ml-2 text-gray-600">Carregando comparação de versões...</span>
      </div>
    );
  }

  if (!versionData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Erro ao carregar dados da versão.</p>
      </div>
    );
  }

  const currentDateTime = formatDateTime(versionData.currentVersion.timestamp);
  const previousDateTime = formatDateTime(versionData.previousVersion.timestamp);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Voltar à lista"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{table.name}</h2>
              <p className="text-sm text-gray-600">
                {table.database}.{table.schema}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowRollbackModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Voltar Versão Anterior</span>
          </button>
        </div>
      </div>

      {/* Version Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Version */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200 bg-green-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-900">Versão Atual</h3>
                <p className="text-sm text-green-700">{versionData.currentVersion.version}</p>
              </div>
              <div className="text-right text-sm text-green-700">
                <p>{currentDateTime.date} às {currentDateTime.time}</p>
                <p className="flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span>{versionData.currentVersion.user}</span>
                </p>
              </div>
            </div>
            <p className="text-sm text-green-700 mt-2">{versionData.currentVersion.description}</p>
          </div>
        </div>

        {/* Previous Version */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200 bg-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900">Versão Anterior</h3>
                <p className="text-sm text-blue-700">{versionData.previousVersion.version}</p>
              </div>
              <div className="text-right text-sm text-blue-700">
                <p>{previousDateTime.date} às {previousDateTime.time}</p>
                <p className="flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span>{versionData.previousVersion.user}</span>
                </p>
              </div>
            </div>
            <p className="text-sm text-blue-700 mt-2">{versionData.previousVersion.description}</p>
          </div>
        </div>
      </div>

      {/* Changes */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Alterações ({versionData.changes.length})
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Comparação detalhada entre as versões
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {versionData.changes.map((change, index) => (
            <div key={index} className="p-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                  {getChangeIcon(change.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    {getFieldLabel(change.field)}
                  </h4>
                  
                  <div className="space-y-2">
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-medium text-red-700">ANTERIOR:</span>
                      </div>
                      <p className="text-sm text-red-900 font-mono">
                        {typeof change.previous === 'boolean' 
                          ? (change.previous ? 'Sim' : 'Não')
                          : change.previous
                        }
                      </p>
                    </div>
                    
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-medium text-green-700">ATUAL:</span>
                      </div>
                      <p className="text-sm text-green-900 font-mono">
                        {typeof change.current === 'boolean' 
                          ? (change.current ? 'Sim' : 'Não')
                          : change.current
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rollback Modal */}
      {showRollbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Confirmar Rollback
              </h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Tem certeza que deseja reverter a tabela <strong>{table.name}</strong> para a versão anterior ({versionData.previousVersion.version})?
              Esta ação não pode ser desfeita.
            </p>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowRollbackModal(false)}
                disabled={rollbackLoading}
                className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                Cancelar
              </button>
              
              <button
                onClick={handleRollback}
                disabled={rollbackLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                {rollbackLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    <span>Confirmar Rollback</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VersionDiffView;