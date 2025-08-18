import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader2, X } from 'lucide-react';
import { ImportStatus } from '../../services/importService';

const ImportProgress = ({ status, progress, message, errors, onClose, onCancel, jobId }) => {
  const getStatusIcon = () => {
    switch (status) {
      case ImportStatus.COMPLETED:
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case ImportStatus.FAILED:
        return <XCircle className="w-6 h-6 text-red-500" />;
      case ImportStatus.PARTIAL_SUCCESS:
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      case ImportStatus.PROCESSING:
      case ImportStatus.PENDING:
        return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />;
      default:
        return <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case ImportStatus.COMPLETED:
        return 'Importação concluída com sucesso';
      case ImportStatus.FAILED:
        return 'Falha na importação';
      case ImportStatus.PARTIAL_SUCCESS:
        return 'Importação parcialmente concluída';
      case ImportStatus.PROCESSING:
        return 'Processando importação...';
      case ImportStatus.PENDING:
        return 'Preparando importação...';
      default:
        return 'Verificando status...';
    }
  };

  const getProgressBarColor = () => {
    switch (status) {
      case ImportStatus.COMPLETED:
        return 'bg-green-500';
      case ImportStatus.FAILED:
        return 'bg-red-500';
      case ImportStatus.PARTIAL_SUCCESS:
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  const isComplete = status === ImportStatus.COMPLETED || 
                     status === ImportStatus.FAILED || 
                     status === ImportStatus.PARTIAL_SUCCESS;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Status da Importação
          </h3>
          {isComplete && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="space-y-4">
          {/* Status Icon and Text */}
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div className="flex-1">
              <p className="font-medium text-gray-900">{getStatusText()}</p>
              {message && (
                <p className="text-sm text-gray-600 mt-1">{message}</p>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {!isComplete && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progresso</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor()}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Job ID */}
          {jobId && (
            <div className="text-xs text-gray-500">
              Job ID: {jobId}
            </div>
          )}

          {/* Errors */}
          {errors && errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <h4 className="text-sm font-medium text-red-900 mb-2">
                Erros encontrados:
              </h4>
              <ul className="text-sm text-red-700 space-y-1">
                {errors.slice(0, 5).map((error, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{error}</span>
                  </li>
                ))}
                {errors.length > 5 && (
                  <li className="text-red-600 italic">
                    ... e {errors.length - 5} outros erros
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-2">
            {!isComplete && onCancel && (
              <button
                onClick={() => onCancel(jobId)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
            )}
            {isComplete && (
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-white bg-[#2960d4] rounded-md hover:bg-[#1e4ba8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2960d4]"
              >
                Fechar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportProgress;