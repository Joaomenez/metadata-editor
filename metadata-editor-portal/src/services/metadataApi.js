// Mock API service for metadata operations
import { mockTables, mockColumns, businessOffers, customMetadataGroups } from '../data/mockData';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const metadataApi = {
  // Tables
  async getTables(params = {}) {
    await delay(500);
    let result = [...mockTables];
    
    if (params.search) {
      result = result.filter(table => 
        table.name.toLowerCase().includes(params.search.toLowerCase()) ||
        table.qualifiedName.toLowerCase().includes(params.search.toLowerCase())
      );
    }
    
    if (params.database) {
      result = result.filter(table => table.database === params.database);
    }
    
    if (params.schema) {
      result = result.filter(table => table.schema === params.schema);
    }
    
    if (params.certification) {
      result = result.filter(table => table.certificateStatus === params.certification);
    }
    
    return {
      tables: result,
      total: result.length
    };
  },

  async getTableById(tableId) {
    await delay(200);
    return mockTables.find(table => table.guid === tableId);
  },

  // Columns
  async getColumnsByTableId(tableId) {
    await delay(300);
    return mockColumns[tableId] || [];
  },

  // Custom Metadata
  async getCustomMetadataGroups(assetType) {
    await delay(200);
    return customMetadataGroups.filter(group => 
      group.applicableAssetTypes.includes(assetType)
    );
  },

  async getEnumValues(enumName) {
    await delay(100);
    // Mock enum values
    const enums = {
      SensitivityLevel: ['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'RESTRICTED'],
      BusinessDomain: ['FINANCE', 'MARKETING', 'OPERATIONS', 'RISK', 'COMPLIANCE', 'HR'],
      StatusCicloVida: ['DESENVOLVIMENTO', 'HOMOLOGACAO', 'PRODUCAO', 'MANUTENCAO', 'DEPRECADO', 'DESCONTINUADO'],
      FrequenciaAtualizacao: ['TEMPO_REAL', 'DIARIO', 'SEMANAL', 'MENSAL', 'TRIMESTRAL', 'ANUAL']
    };
    
    return {
      name: enumName,
      values: enums[enumName] || []
    };
  },

  // Business Offers
  async searchBusinessOffers(query, category = null) {
    await delay(300);
    let result = [...businessOffers];
    
    if (query) {
      result = result.filter(offer =>
        offer.name.toLowerCase().includes(query.toLowerCase()) ||
        offer.id.toLowerCase().includes(query.toLowerCase()) ||
        offer.category.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (category) {
      result = result.filter(offer => offer.category === category);
    }
    
    return result.filter(offer => offer.active);
  },

  // Export/Import
  async exportMetadata(tableIds, includeColumns = true) {
    await delay(1000);
    const tables = mockTables.filter(table => tableIds.includes(table.guid));
    
    const exportData = {
      version: '1.0',
      tenant: 'your-org.atlan.com',
      exportedAt: new Date().toISOString(),
      assets: {
        tables: tables.map(table => ({
          ...table,
          columns: includeColumns ? (mockColumns[table.guid] || []) : []
        }))
      }
    };
    
    return exportData;
  },

  async validateUpload(jsonData) {
    await delay(800);
    // Mock validation
    const errors = [];
    const warnings = [];
    
    if (!jsonData.assets || !jsonData.assets.tables) {
      errors.push('Missing tables data');
    }

    if (jsonData.assets?.tables && jsonData.assets.tables.length === 0) {
      errors.push('No tables found in the file');
    }

    if (jsonData.assets?.tables && jsonData.assets.tables.length > 5) {
      errors.push('Maximum of 5 tables allowed per upload');
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      tableCount: jsonData.assets?.tables?.length || 0
    };
  },

  // Draft Management
  async saveDraft(draftData) {
    await delay(600);
    const draftId = `draft_${Date.now()}`;
    
    // Mock saving to localStorage
    localStorage.setItem('metadata_draft', JSON.stringify({
      id: draftId,
      data: draftData,
      savedAt: new Date().toISOString()
    }));
    
    return { draftId, savedAt: new Date().toISOString() };
  },

  async loadDraft() {
    await delay(200);
    const draft = localStorage.getItem('metadata_draft');
    return draft ? JSON.parse(draft) : null;
  },

  async deleteDraft() {
    await delay(200);
    localStorage.removeItem('metadata_draft');
    return { success: true };
  },

  // Apply Changes
  async applyChanges(tableId, changes) {
    await delay(2000); // Simulate longer operation
    
    // Mock API call success/failure
    const success = Math.random() > 0.1; // 90% success rate
    
    if (success) {
      return {
        success: true,
        appliedAt: new Date().toISOString(),
        tableId,
        changes
      };
    } else {
      throw new Error(`Failed to apply changes to table ${tableId}`);
    }
  },

  async applyBulkChanges(tables) {
    await delay(3000);
    const results = [];
    
    for (const table of tables) {
      try {
        const result = await this.applyChanges(table.guid, table);
        results.push({ tableId: table.guid, success: true, result });
      } catch (error) {
        results.push({ tableId: table.guid, success: false, error: error.message });
      }
    }
    
    return results;
  },

  // Version History
  async getVersionHistory(tableId, limit = 3) {
    await delay(400);
    
    // Mock version history
    const versions = [
      {
        id: 'v3',
        version: '3.0',
        appliedAt: '2024-12-11T10:30:00Z',
        appliedBy: 'john.silva@banco.com',
        changes: ['Updated description', 'Added custom metadata'],
        method: 'Portal'
      },
      {
        id: 'v2',
        version: '2.0',
        appliedAt: '2024-12-10T15:20:00Z',
        appliedBy: 'maria.santos@banco.com',
        changes: ['Changed certification status', 'Updated ownership'],
        method: 'API'
      },
      {
        id: 'v1',
        version: '1.0',
        appliedAt: '2024-12-09T09:15:00Z',
        appliedBy: 'system',
        changes: ['Initial metadata'],
        method: 'Import'
      }
    ];
    
    return versions.slice(0, limit);
  },

  async rollbackToVersion(tableId, versionId) {
    await delay(1500);
    
    return {
      success: true,
      rolledBackAt: new Date().toISOString(),
      fromVersion: 'current',
      toVersion: versionId
    };
  },

  // Operations Status
  async getOperationStatus(operationId) {
    await delay(200);
    
    // Mock operation status
    const statuses = ['pending', 'processing', 'completed', 'failed'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      id: operationId,
      status: randomStatus,
      progress: randomStatus === 'processing' ? Math.floor(Math.random() * 100) : 100,
      message: `Operation ${randomStatus}`,
      startedAt: '2024-12-11T12:00:00Z',
      completedAt: randomStatus === 'completed' ? new Date().toISOString() : null
    };
  }
};