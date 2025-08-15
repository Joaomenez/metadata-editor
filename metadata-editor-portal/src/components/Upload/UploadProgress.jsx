import React from 'react';
import { Upload, Loader } from 'lucide-react';

const UploadProgress = ({ progress, file }) => {
  const getProgressMessage = (progress) => {
    if (progress < 30) return 'Iniciando upload...';
    if (progress < 60) return 'Validando metadados...';
    if (progress < 90) return 'Aplicando alterações...';
    return 'Finalizando...';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-atlan-blue-100 rounded-full flex items-center justify-center">
            <Loader className="w-5 h-5 text-atlan-blue animate-spin" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Importando metadados
          </h3>
          <p className="text-sm text-gray-600">
            {file?.name}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{getProgressMessage(progress)}</span>
          <span className="font-medium text-gray-900">{progress}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-300 ease-out"
            style={{ 
              width: `${progress}%`,
              backgroundColor: '#2960d4'
            }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Não feche esta página durante o upload</span>
          <span>ETA: ~{Math.max(1, Math.ceil((100 - progress) / 30))} min</span>
        </div>
      </div>

      {progress >= 90 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">
            ✓ Upload quase concluído! Aguarde a confirmação final...
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadProgress;