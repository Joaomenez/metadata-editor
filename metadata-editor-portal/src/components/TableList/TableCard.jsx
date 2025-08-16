import React from 'react';
import { Database, Users, Calendar } from 'lucide-react';

const TableCard = ({ table, isSelected, onSelect, disabled, compact = false }) => {
  // Função para validar e mostrar o nome do grupo seguindo a taxonomia G_ATLAN_{SIGLA}_BTSTEWARD
  const getGroupName = (ownerGroup) => {
    if (!ownerGroup) return null;
    
    // Regex para validar a taxonomia G_ATLAN_{SIGLA}_BTSTEWARD onde SIGLA tem 2-3 caracteres alfanuméricos
    const match = ownerGroup.match(/^G_ATLAN_([A-Z0-9]{2,3})_BTSTEWARD$/i);
    if (match) {
      // Se segue a taxonomia correta, retorna o nome completo
      return ownerGroup.toUpperCase();
    }
    
    // Se não seguir o padrão exato, não exibe
    return null;
  };

  if (compact) {
    return (
      <div
        className={`
          relative p-2 rounded-lg border transition-all duration-200 cursor-pointer
          ${isSelected 
            ? 'ring-1 ring-opacity-50' 
            : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
          }
          ${disabled && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        style={isSelected ? {
          backgroundColor: '#e0ecfe',
          borderColor: '#2960d4',
          ringColor: '#2960d4'
        } : {}}
        onClick={() => !disabled && onSelect()}
      >
        <div className="absolute top-2 right-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => {}}
            disabled={disabled && !isSelected}
            className="w-4 h-4 rounded cursor-pointer focus:ring-1"
            style={{ 
              accentColor: '#2960d4',
              focusRingColor: '#2960d4'
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <div className="pr-6">
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-atlan-blue-100 rounded">
              <Database className="w-3 h-3 text-atlan-blue-600" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {table.name}
              </h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
        ${isSelected 
          ? 'ring-2 ring-opacity-50' 
          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
        }
        ${disabled && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      style={isSelected ? {
        backgroundColor: '#e0ecfe',
        borderColor: '#2960d4',
        ringColor: '#2960d4'
      } : {}}
      onClick={() => !disabled && onSelect()}
    >
      <div className="absolute top-4 right-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {}}
          disabled={disabled && !isSelected}
          className="w-5 h-5 rounded cursor-pointer focus:ring-2"
          style={{ 
            accentColor: '#2960d4',
            focusRingColor: '#2960d4'
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <div className="pr-8">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-atlan-blue-100 rounded-lg">
            <Database className="w-5 h-5 text-atlan-blue-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {table.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {table.database}.{table.schema}
            </p>
          </div>
        </div>

        {table.description && (
          <p className="mt-3 text-sm text-gray-600 line-clamp-2">
            {table.description}
          </p>
        )}

        {table.ownerGroups?.[0] && getGroupName(table.ownerGroups[0]) && (
          <div className="mt-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              <Users className="w-3 h-3 mr-1" />
              {getGroupName(table.ownerGroups[0])}
            </span>
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            Updated {new Date(table.updatedAt).toLocaleDateString()}
          </span>
          <span>{table.columnCount} columns</span>
        </div>
      </div>
    </div>
  );
};

export default TableCard;