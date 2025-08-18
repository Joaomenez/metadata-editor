import React from 'react';
import { AlertCircle } from 'lucide-react';

const DynamicFieldRenderer = ({ property, value, onChange }) => {
  const formatLabel = (name) => {
    return name.replace(/([A-Z])/g, ' $1').trim();
  };

  const renderField = () => {
    switch (property.type) {
      case 'text':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-atlan-blue-500"
            placeholder={property.description}
          />
        );

      case 'integer':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(parseInt(e.target.value) || null)}
            min={property.minValue}
            max={property.maxValue}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-atlan-blue-500"
            placeholder={property.description}
          />
        );

      case 'decimal':
        return (
          <input
            type="number"
            step="0.01"
            value={value || ''}
            onChange={(e) => onChange(parseFloat(e.target.value) || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-atlan-blue-500"
            placeholder={property.description}
          />
        );

      case 'boolean':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              className="w-4 h-4 text-atlan-blue-600 rounded focus:ring-atlan-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              {property.description}
            </span>
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-atlan-blue-500"
          />
        );

      case 'options':
        if (property.allowMultiple) {
          return (
            <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-md">
              {property.enumValues.map(option => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(value || []).includes(option)}
                    onChange={(e) => {
                      const currentValues = value || [];
                      if (e.target.checked) {
                        onChange([...currentValues, option]);
                      } else {
                        onChange(currentValues.filter(v => v !== option));
                      }
                    }}
                    className="mr-2 text-atlan-blue-600 rounded focus:ring-atlan-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          );
        }
        
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-atlan-blue-500"
          >
            <option value="">Select {formatLabel(property.displayName)}...</option>
            {property.enumValues.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'users':
        return (
          <input
            type="email"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-atlan-blue-500"
            placeholder="user@company.com"
          />
        );

      case 'groups':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-atlan-blue-500"
            placeholder="Enter group name..."
          />
        );

      case 'url':
        return (
          <input
            type="url"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-atlan-blue-500"
            placeholder="https://..."
          />
        );

      case 'sql':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-atlan-blue-500"
            placeholder="Enter SQL query..."
          />
        );

      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-atlan-blue-500"
            placeholder={property.description}
          />
        );
    }
  };

  if (property.type === 'boolean') {
    return renderField();
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {property.displayName}
        {property.required && <span className="text-red-500 ml-1">*</span>}
        {property.description && property.description !== property.displayName && (
          <span className="ml-1 group relative inline-block">
            <AlertCircle className="w-3 h-3 text-gray-400 inline" />
            <span className="invisible group-hover:visible absolute left-0 top-5 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
              {property.description}
            </span>
          </span>
        )}
      </label>
      {renderField()}
    </div>
  );
};

export default DynamicFieldRenderer;