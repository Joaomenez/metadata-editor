import React, { useState, useRef } from 'react';
import { Upload, File, X } from 'lucide-react';

const FileDropZone = ({ onFileSelect, file, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const selectedFile = files[0];
      if (selectedFile.type === 'application/json' || selectedFile.name.endsWith('.json')) {
        onFileSelect(selectedFile);
      } else {
        alert('Por favor, selecione apenas arquivos JSON');
      }
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
          ${isDragging 
            ? 'border-atlan-blue bg-blue-50' 
            : file 
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {file ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <File className="w-12 h-12 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Arquivo selecionado
              </h3>
              <div className="mt-2 space-y-1">
                <p className="text-sm font-medium text-gray-700">
                  {file.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(file.size)}
                </p>
                <p className="text-sm text-gray-500">
                  Modificado em {new Date(file.lastModified).toLocaleString()}
                </p>
              </div>
            </div>

            <button
              onClick={handleRemoveFile}
              className="inline-flex items-center px-3 py-1 text-sm bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
            >
              <X className="w-4 h-4 mr-1" />
              Remover arquivo
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <Upload className={`w-12 h-12 ${isDragging ? 'text-atlan-blue' : 'text-gray-400'}`} />
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {isDragging ? 'Solte o arquivo aqui' : 'Upload de arquivo JSON'}
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                {isDragging 
                  ? 'Solte o arquivo JSON para fazer upload'
                  : 'Clique para selecionar ou arraste um arquivo JSON aqui'
                }
              </p>
            </div>

            <div className="text-xs text-gray-500">
              <p>Formatos aceitos: .json</p>
              <p>Tamanho máximo: 10MB</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileDropZone;