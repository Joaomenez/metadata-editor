import React, { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';

const CSVUpload = ({ onCSVLoad }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const csvFile = droppedFiles.find(file => 
      file.type === 'text/csv' || file.name.endsWith('.csv')
    );
    
    if (csvFile) {
      handleFile(csvFile);
    } else {
      setError('Por favor, selecione um arquivo CSV válido.');
    }
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const handleFile = (file) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('O arquivo é muito grande. O tamanho máximo é 10MB.');
      return;
    }

    setFile(file);
    setError(null);
    parseCSV(file);
  };

  const parseCSV = (file) => {
    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length === 0) {
          setError('O arquivo CSV está vazio.');
          setIsLoading(false);
          return;
        }

        // Parse headers
        const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
        
        // Parse data rows
        const data = lines.slice(1).map((line, index) => {
          const values = line.split(',').map(value => value.trim().replace(/"/g, ''));
          const row = {};
          headers.forEach((header, i) => {
            row[header] = values[i] || '';
          });
          return row;
        });

        // Validate required columns based on Atlan specification
        const requiredColumns = ['qualifiedName', 'typeName', 'name', 'connectionQualifiedName', 'connectorType'];
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));
        
        if (missingColumns.length > 0) {
          setError(`Colunas obrigatórias ausentes: ${missingColumns.join(', ')}`);
          setIsLoading(false);
          return;
        }

        onCSVLoad(data, headers);
        setIsLoading(false);
      } catch (err) {
        setError('Erro ao processar o arquivo CSV. Verifique se o formato está correto.');
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Erro ao ler o arquivo.');
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onCSVLoad(null, []);
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragging 
              ? 'border-[#2960d4] bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">
              Arraste seu arquivo CSV aqui
            </p>
            <p className="text-gray-500">
              ou
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#2960d4] hover:bg-[#1e4ba8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2960d4]"
            >
              Selecionar arquivo
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Suporta arquivos CSV até 10MB
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-[#2960d4]" />
            <div>
              <p className="font-medium text-gray-900">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button
            onClick={clearFile}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-atlan-blue-600"></div>
          <span className="ml-2 text-gray-600">Processando arquivo...</span>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h4 className="font-medium text-blue-900 mb-2">Especificação do CSV</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>Colunas obrigatórias:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>qualifiedName - Nome único do ativo</li>
            <li>typeName - Tipo do ativo</li>
            <li>name - Nome técnico do ativo</li>
            <li>connectionQualifiedName - Nome qualificado da conexão</li>
            <li>connectorType - Nome do tipo de conector</li>
          </ul>
          <p className="mt-2"><strong>Colunas opcionais:</strong> displayName, description, userDescription, ownerUsers, atlanTags, etc.</p>
        </div>
      </div>
    </div>
  );
};

export default CSVUpload;