// Mock implementation para testes locais
import { ImportStatus } from './importService';

class MockImportService {
  constructor() {
    this.jobs = new Map();
  }

  async importAssets(csvData, headers) {
    // Simula validação dos dados
    if (!csvData || csvData.length === 0) {
      return {
        success: false,
        error: 'Nenhum dado fornecido para importação'
      };
    }

    // Gera um ID único para o job
    const jobId = `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Cria o job
    this.jobs.set(jobId, {
      id: jobId,
      status: ImportStatus.PENDING,
      progress: 0,
      totalRecords: csvData.length,
      processedRecords: 0,
      errors: [],
      startedAt: new Date().toISOString(),
      data: csvData,
      headers: headers
    });

    // Simula processamento assíncrono
    this.simulateProcessing(jobId);

    return {
      success: true,
      jobId: jobId,
      message: `Importação iniciada com ${csvData.length} registros`
    };
  }

  async checkImportStatus(jobId) {
    const job = this.jobs.get(jobId);
    
    if (!job) {
      return {
        success: false,
        status: ImportStatus.FAILED,
        error: 'Job não encontrado'
      };
    }

    return {
      success: true,
      status: job.status,
      progress: job.progress,
      message: this.getStatusMessage(job),
      details: {
        totalRecords: job.totalRecords,
        processedRecords: job.processedRecords,
        failedRecords: job.errors.length
      },
      completedAt: job.completedAt,
      errors: job.errors
    };
  }

  async pollImportStatus(jobId, onProgress = null, interval = 2000, maxAttempts = 60) {
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

  async cancelImport(jobId) {
    const job = this.jobs.get(jobId);
    
    if (!job) {
      return {
        success: false,
        error: 'Job não encontrado'
      };
    }

    if (job.status === ImportStatus.COMPLETED || 
        job.status === ImportStatus.FAILED) {
      return {
        success: false,
        error: 'Job já finalizado'
      };
    }

    job.status = ImportStatus.FAILED;
    job.completedAt = new Date().toISOString();
    job.errors.push('Importação cancelada pelo usuário');

    return {
      success: true,
      message: 'Importação cancelada com sucesso'
    };
  }

  async getImportHistory() {
    const history = Array.from(this.jobs.values()).map(job => ({
      id: job.id,
      status: job.status,
      totalRecords: job.totalRecords,
      processedRecords: job.processedRecords,
      startedAt: job.startedAt,
      completedAt: job.completedAt,
      errors: job.errors.length
    }));

    return {
      success: true,
      history: history.sort((a, b) => 
        new Date(b.startedAt) - new Date(a.startedAt)
      )
    };
  }

  // Métodos auxiliares para simulação
  simulateProcessing(jobId) {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.status = ImportStatus.PROCESSING;
    let processedCount = 0;
    const totalCount = job.totalRecords;
    const batchSize = Math.ceil(totalCount / 10); // Processa em 10 batches

    const processInterval = setInterval(() => {
      if (job.status === ImportStatus.FAILED) {
        clearInterval(processInterval);
        return;
      }

      processedCount += batchSize;
      if (processedCount > totalCount) {
        processedCount = totalCount;
      }

      job.processedRecords = processedCount;
      job.progress = Math.round((processedCount / totalCount) * 100);

      // Simula alguns erros aleatórios (10% de chance)
      if (Math.random() < 0.1 && job.errors.length < 3) {
        const errorRow = Math.floor(Math.random() * totalCount);
        job.errors.push(`Erro ao processar linha ${errorRow + 1}: Campo obrigatório ausente`);
      }

      if (processedCount >= totalCount) {
        clearInterval(processInterval);
        
        // Define status final baseado em erros
        if (job.errors.length === 0) {
          job.status = ImportStatus.COMPLETED;
        } else if (job.errors.length < totalCount * 0.3) {
          job.status = ImportStatus.PARTIAL_SUCCESS;
        } else {
          job.status = ImportStatus.FAILED;
        }
        
        job.completedAt = new Date().toISOString();
      }
    }, 500); // Atualiza a cada 500ms
  }

  getStatusMessage(job) {
    switch (job.status) {
      case ImportStatus.PENDING:
        return 'Preparando importação...';
      case ImportStatus.PROCESSING:
        return `Processando: ${job.processedRecords} de ${job.totalRecords} registros`;
      case ImportStatus.COMPLETED:
        return `Importação concluída: ${job.totalRecords} registros processados com sucesso`;
      case ImportStatus.PARTIAL_SUCCESS:
        return `Importação parcial: ${job.processedRecords - job.errors.length} de ${job.totalRecords} registros importados`;
      case ImportStatus.FAILED:
        return 'Falha na importação';
      default:
        return 'Status desconhecido';
    }
  }
}

// Exporta uma instância única do mock service
export default new MockImportService();