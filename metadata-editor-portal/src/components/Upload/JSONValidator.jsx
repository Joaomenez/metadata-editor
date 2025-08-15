import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Eye, Upload as UploadIcon, RotateCcw } from 'lucide-react';

const JSONValidator = ({ validation, file, onPreview, onUpload, onReset, uploading }) => {
  if (!validation) return null;

  const { valid, errors, warnings, tableCount } = validation;

  return (
    <div className="space-y-4">
      {/* Validation Status */}
      <div className={`rounded-lg p-4 border ${
        valid 
          ? 'bg-green-50 border-green-200' 
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {valid ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500" />
            )}
          </div>
          <div className="ml-3 flex-1">
            <h3 className={`text-sm font-medium ${
              valid ? 'text-green-900' : 'text-red-900'
            }`}>
              {valid ? 'Arquivo válido' : 'Arquivo inválido'}
            </h3>
            <div className="mt-2">
              <p className={`text-sm ${
                valid ? 'text-green-800' : 'text-red-800'
              }`}>
                {valid 
                  ? `Arquivo JSON válido com ${tableCount} tabela(s) encontrada(s)`
                  : 'O arquivo contém erros que precisam ser corrigidos'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Errors */}
      {errors && errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div className="ml-3">
              <h4 className="text-sm font-medium text-red-900">
                Erros encontrados ({errors.length})
              </h4>
              <ul className="mt-2 space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm text-red-800">
                    • {error}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings && warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div className="ml-3">
              <h4 className="text-sm font-medium text-yellow-900">
                Avisos ({warnings.length})
              </h4>
              <ul className="mt-2 space-y-1">
                {warnings.map((warning, index) => (
                  <li key={index} className="text-sm text-yellow-800">
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* File Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Informações do arquivo
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Nome:</span>
            <span className="ml-2 font-medium">{file.name}</span>
          </div>
          <div>
            <span className="text-gray-600">Tamanho:</span>
            <span className="ml-2 font-medium">
              {(file.size / 1024).toFixed(2)} KB
            </span>
          </div>
          <div>
            <span className="text-gray-600">Tabelas:</span>
            <span className="ml-2 font-medium">{tableCount}</span>
          </div>
          <div>
            <span className="text-gray-600">Status:</span>
            <span className={`ml-2 font-medium ${
              valid ? 'text-green-600' : 'text-red-600'
            }`}>
              {valid ? 'Válido' : 'Inválido'}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onPreview}
          disabled={!valid || uploading}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Eye className="w-4 h-4" />
          <span>Visualizar</span>
        </button>

        <button
          onClick={onUpload}
          disabled={!valid || uploading}
          className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: valid && !uploading ? '#2960d4' : '#6b7280' }}
        >
          <UploadIcon className="w-4 h-4" />
          <span>{uploading ? 'Importando...' : 'Importar'}</span>
        </button>

        <button
          onClick={onReset}
          disabled={uploading}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Recomeçar</span>
        </button>
      </div>
    </div>
  );
};

export default JSONValidator;