import React, { useState } from 'react';
import { Upload, FileJson, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { metadataApi } from '../../services/metadataApi';

const UploadSection = () => {
  const [file, setFile] = useState(null);
  const [validation, setValidation] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setValidation(null);
    setUploadResult(null);

    if (selectedFile) {
      try {
        const text = await selectedFile.text();
        const parsed = JSON.parse(text);
        
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

  const handleUpload = async () => {
    if (!validation?.valid) return;

    setUploading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadResult({
        success: true,
        message: 'Metadados importados com sucesso!',
        tablesProcessed: validation.tableCount
      });
    } catch (error) {
      setUploadResult({
        success: false,
        message: 'Erro ao importar metadados: ' + error.message
      });
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setValidation(null);
    setUploadResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/json') {
      handleFileSelect(droppedFile);
    }
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
        <Upload className="w-5 h-5 mr-2" />
        Upload de Metadados
      </h3>

      {!file && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver 
              ? 'border-atlan-blue bg-atlan-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
        >
          <FileJson className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            Arraste um arquivo JSON ou clique para selecionar
          </p>
          <input
            type="file"
            accept=".json"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
          >
            Selecionar arquivo
          </label>
        </div>
      )}

      {file && validation && (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <FileJson className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">{file.name}</span>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Remover
            </button>
          </div>

          {validation.valid ? (
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>Arquivo válido • {validation.tableCount} tabela(s)</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-red-600">
                <XCircle className="w-4 h-4" />
                <span>Arquivo inválido</span>
              </div>
              {validation.errors.map((error, index) => (
                <p key={index} className="text-xs text-red-600 ml-6">• {error}</p>
              ))}
            </div>
          )}

          {validation.warnings && validation.warnings.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm text-amber-600">
                <AlertTriangle className="w-4 h-4" />
                <span>Avisos</span>
              </div>
              {validation.warnings.map((warning, index) => (
                <p key={index} className="text-xs text-amber-600 ml-6">• {warning}</p>
              ))}
            </div>
          )}

          <div className="flex space-x-2">
            <button
              onClick={handleUpload}
              disabled={!validation.valid || uploading}
              className="flex-1 px-3 py-2 text-sm font-medium text-white rounded-md disabled:bg-gray-400 transition-colors"
              style={{ 
                backgroundColor: validation.valid && !uploading ? '#2960d4' : undefined 
              }}
            >
              {uploading ? 'Importando...' : 'Importar Metadados'}
            </button>
          </div>
        </div>
      )}

      {uploadResult && (
        <div className={`mt-3 p-3 rounded-lg ${
          uploadResult.success 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            {uploadResult.success ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600" />
            )}
            <p className={`text-sm font-medium ${
              uploadResult.success ? 'text-green-900' : 'text-red-900'
            }`}>
              {uploadResult.message}
            </p>
          </div>
          {uploadResult.success && (
            <p className="text-xs text-green-700 mt-1">
              {uploadResult.tablesProcessed} tabela(s) processada(s)
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadSection;