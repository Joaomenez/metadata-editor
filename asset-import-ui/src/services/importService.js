import axios from 'axios';
import mockImportService from './mockImportService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'; // Use mock por padrão

// Status possíveis do job de importação
export const ImportStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  PARTIAL_SUCCESS: 'partial_success'
};

class ImportService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token de autenticação se disponível
    this.client.interceptors.request.use(
      (config) => {
        const token = sessionStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  /**
   * Envia o CSV para importação
   * @param {Array} csvData - Array de objetos representando as linhas do CSV
   * @param {Array} headers - Array com os nomes das colunas
   * @returns {Promise} - Retorna o ID do job de importação
   */
  async importAssets(csvData, headers) {
    // Usa mock se configurado
    if (USE_MOCK) {
      return mockImportService.importAssets(csvData, headers);
    }
    try {
      const response = await this.client.post('/assets/import', {
        data: csvData,
        headers: headers,
        timestamp: new Date().toISOString(),
        source: 'asset-import-ui'
      });

      return {
        success: true,
        jobId: response.data.jobId,
        message: response.data.message || 'Import iniciado com sucesso'
      };
    } catch (error) {
      console.error('Erro ao iniciar importação:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao iniciar importação',
        details: error.response?.data?.details
      };
    }
  }

  /**
   * Verifica o status de um job de importação
   * @param {string} jobId - ID do job retornado pelo endpoint de import
   * @returns {Promise} - Status atual do job
   */
  async checkImportStatus(jobId) {
    // Usa mock se configurado
    if (USE_MOCK) {
      return mockImportService.checkImportStatus(jobId);
    }
    try {
      const response = await this.client.get(`/assets/import/status/${jobId}`);
      
      return {
        success: true,
        status: response.data.status,
        progress: response.data.progress || 0,
        message: response.data.message,
        details: response.data.details || {},
        completedAt: response.data.completedAt,
        errors: response.data.errors || []
      };
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      return {
        success: false,
        status: ImportStatus.FAILED,
        error: error.response?.data?.message || 'Erro ao verificar status'
      };
    }
  }

  /**
   * Faz polling do status até completar ou falhar
   * @param {string} jobId - ID do job
   * @param {Function} onProgress - Callback para atualizar progresso
   * @param {number} interval - Intervalo entre verificações em ms
   * @param {number} maxAttempts - Número máximo de tentativas
   * @returns {Promise} - Resultado final da importação
   */
  async pollImportStatus(jobId, onProgress = null, interval = 2000, maxAttempts = 60) {
    // Usa mock se configurado
    if (USE_MOCK) {
      return mockImportService.pollImportStatus(jobId, onProgress, interval, maxAttempts);
    }
    let attempts = 0;
    
    return new Promise((resolve, reject) => {
      const checkStatus = async () => {
        attempts++;
        
        if (attempts > maxAttempts) {
          clearInterval(pollInterval);
          reject(new Error('Timeout: importação demorou mais que o esperado'));
          return;
        }

        const result = await this.checkImportStatus(jobId);
        
        if (onProgress) {
          onProgress(result);
        }

        if (result.status === ImportStatus.COMPLETED || 
            result.status === ImportStatus.PARTIAL_SUCCESS) {
          clearInterval(pollInterval);
          resolve(result);
        } else if (result.status === ImportStatus.FAILED) {
          clearInterval(pollInterval);
          reject(result);
        }
      };

      const pollInterval = setInterval(checkStatus, interval);
      checkStatus(); // Primeira verificação imediata
    });
  }

  /**
   * Cancela um job de importação em andamento
   * @param {string} jobId - ID do job
   * @returns {Promise}
   */
  async cancelImport(jobId) {
    try {
      const response = await this.client.post(`/assets/import/cancel/${jobId}`);
      return {
        success: true,
        message: response.data.message || 'Importação cancelada'
      };
    } catch (error) {
      console.error('Erro ao cancelar importação:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao cancelar importação'
      };
    }
  }

  /**
   * Obtém o histórico de importações
   * @returns {Promise}
   */
  async getImportHistory() {
    try {
      const response = await this.client.get('/assets/import/history');
      return {
        success: true,
        history: response.data.imports || []
      };
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao buscar histórico',
        history: []
      };
    }
  }
}

export default new ImportService();