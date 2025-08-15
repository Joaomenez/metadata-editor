import React, { useState } from 'react';
import FileDropZone from './FileDropZone';
import JSONValidator from './JSONValidator';
import PreviewModal from './PreviewModal';
import UploadProgress from './UploadProgress';
import { metadataApi } from '../../services/metadataApi';

const UploadView = () => {
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [validation, setValidation] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setJsonData(null);
    setValidation(null);
    setUploadResult(null);

    if (selectedFile) {
      try {
        const text = await selectedFile.text();
        const parsed = JSON.parse(text);
        setJsonData(parsed);
        
        // Validate the JSON
        const validationResult = await metadataApi.validateUpload(parsed);
        setValidation(validationResult);
      } catch (error) {
        setValidation({
          valid: false,
          errors: ['Arquivo JSON inválido: ' + error.message],
          warnings: [],
          tableCount: 0
        });
      }
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleUpload = async () => {
    if (!jsonData || !validation?.valid) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      setUploadResult({
        success: true,
        message: 'Metadados importados com sucesso!',
        tablesProcessed: validation.tableCount,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      setUploadResult({
        success: false,
        message: 'Erro ao importar metadados: ' + error.message,
        tablesProcessed: 0
      });
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setJsonData(null);
    setValidation(null);
    setShowPreview(false);
    setUploading(false);
    setUploadProgress(0);
    setUploadResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          Como usar o upload de metadados
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Faça upload de arquivos JSON compatíveis com o formato Atlan</li>
          <li>• O arquivo será validado automaticamente antes da importação</li>
          <li>• Você pode visualizar as alterações antes de aplicá-las</li>
          <li>• Máximo de 5 tabelas por arquivo</li>
        </ul>
      </div>

      {/* File Drop Zone */}
      <FileDropZone
        onFileSelect={handleFileSelect}
        file={file}
        disabled={uploading}
      />

      {/* Validation Results */}
      {validation && (
        <JSONValidator
          validation={validation}
          file={file}
          onPreview={handlePreview}
          onUpload={handleUpload}
          onReset={handleReset}
          uploading={uploading}
        />
      )}

      {/* Upload Progress */}
      {uploading && (
        <UploadProgress
          progress={uploadProgress}
          file={file}
        />
      )}

      {/* Upload Result */}
      {uploadResult && (
        <div className={`rounded-lg p-4 ${
          uploadResult.success 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {uploadResult.success ? (
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              ) : (
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✗</span>
                </div>
              )}
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                uploadResult.success ? 'text-green-900' : 'text-red-900'
              }`}>
                {uploadResult.success ? 'Upload concluído!' : 'Erro no upload'}
              </h3>
              <p className={`text-sm mt-1 ${
                uploadResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {uploadResult.message}
              </p>
              {uploadResult.success && (
                <p className="text-sm text-green-700 mt-2">
                  {uploadResult.tablesProcessed} tabela(s) processada(s)
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <button
              onClick={handleReset}
              className="btn-primary"
            >
              Fazer novo upload
            </button>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && jsonData && (
        <PreviewModal
          jsonData={jsonData}
          onClose={() => setShowPreview(false)}
          onConfirm={handleUpload}
          validation={validation}
        />
      )}
    </div>
  );
};

export default UploadView;