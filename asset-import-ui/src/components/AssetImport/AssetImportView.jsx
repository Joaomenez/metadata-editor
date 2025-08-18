import React, { useState } from 'react';
import CSVUpload from './CSVUpload';
import CSVTable from './CSVTable';
import ImportProgress from './ImportProgress';
import importService, { ImportStatus } from '../../services/importService';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';

const AssetImportView = () => {
  const [csvData, setCsvData] = useState(null);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const [importProgress, setImportProgress] = useState(0);
  const [importMessage, setImportMessage] = useState('');
  const [importErrors, setImportErrors] = useState([]);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleCSVLoad = (data, headers) => {
    setCsvData(data);
    setCsvHeaders(headers);
    setShowSuccessMessage(false);
  };

  const handleDataUpdate = (rowIndex, columnKey, value) => {
    if (!csvData) return;
    
    const updatedData = [...csvData];
    updatedData[rowIndex] = {
      ...updatedData[rowIndex],
      [columnKey]: value
    };
    setCsvData(updatedData);
  };

  const handleImport = async () => {
    if (!csvData || csvData.length === 0) {
      alert('Nenhum dado para importar');
      return;
    }

    setIsImporting(true);
    setImportStatus(ImportStatus.PENDING);
    setImportProgress(0);
    setImportMessage('Iniciando importação...');
    setImportErrors([]);
    setShowSuccessMessage(false);

    // Inicia a importação
    const importResult = await importService.importAssets(csvData, csvHeaders);

    if (!importResult.success) {
      setImportStatus(ImportStatus.FAILED);
      setImportMessage(importResult.error);
      setImportErrors(importResult.details ? [importResult.details] : []);
      setIsImporting(false);
      return;
    }

    const jobId = importResult.jobId;
    setCurrentJobId(jobId);

    // Inicia o polling do status
    try {
      const finalResult = await importService.pollImportStatus(
        jobId,
        (statusUpdate) => {
          setImportStatus(statusUpdate.status);
          setImportProgress(statusUpdate.progress || 0);
          setImportMessage(statusUpdate.message || 'Processando...');
          if (statusUpdate.errors) {
            setImportErrors(statusUpdate.errors);
          }
        },
        2000, // Poll a cada 2 segundos
        60    // Máximo 60 tentativas (2 minutos)
      );

      // Importação concluída com sucesso
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
    } catch (error) {
      // Falha na importação
      setImportStatus(ImportStatus.FAILED);
      setImportMessage(error.error || error.message || 'Erro desconhecido na importação');
      if (error.errors) {
        setImportErrors(error.errors);
      }
    } finally {
      setIsImporting(false);
    }
  };

  const handleCancelImport = async (jobId) => {
    if (!jobId) return;
    
    const result = await importService.cancelImport(jobId);
    if (result.success) {
      setIsImporting(false);
      setImportStatus(null);
      setImportMessage('');
    }
  };

  const handleCloseProgress = () => {
    setIsImporting(false);
    setImportStatus(null);
    setImportProgress(0);
    setImportMessage('');
    setImportErrors([]);
    setCurrentJobId(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Upload do Arquivo CSV
        </h2>
        <CSVUpload onCSVLoad={handleCSVLoad} />
      </div>

      {csvData && csvHeaders.length > 0 && (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Dados Importados ({csvData.length} registros)
              </h2>
              <button
                onClick={handleImport}
                disabled={isImporting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#2960d4] hover:bg-[#1e4ba8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2960d4] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isImporting ? 'Importando...' : 'Importar Ativos'}
              </button>
            </div>
            
            {/* Success Message */}
            {showSuccessMessage && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Importação concluída com sucesso!
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Todos os ativos foram processados e importados para o sistema.
                  </p>
                </div>
              </div>
            )}

            <CSVTable 
              data={csvData} 
              headers={csvHeaders}
              onDataUpdate={handleDataUpdate}
            />
          </div>

          {/* Import Progress Modal */}
          {isImporting && (
            <ImportProgress
              status={importStatus}
              progress={importProgress}
              message={importMessage}
              errors={importErrors}
              jobId={currentJobId}
              onClose={handleCloseProgress}
              onCancel={handleCancelImport}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AssetImportView;