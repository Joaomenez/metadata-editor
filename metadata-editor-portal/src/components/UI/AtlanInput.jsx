import React from 'react';
import { AlertCircle } from 'lucide-react';

const AtlanInput = ({
  label,
  description,
  error,
  required = false,
  leftIcon,
  rightIcon,
  className = '',
  labelClassName = '',
  inputClassName = '',
  type = 'text',
  ...props
}) => {
  const baseInputClasses = 'w-full px-3 py-2 border rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-0';
  const errorClasses = error 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
    : 'border-gray-300 focus:border-atlan-blue-500 focus:ring-atlan-blue-500';
  const disabledClasses = props.disabled 
    ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
    : 'bg-white text-gray-900';

  return (
    <div className={className}>
      {label && (
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {description && (
        <p className="text-xs text-gray-600 mb-2">{description}</p>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          type={type}
          className={`
            ${baseInputClasses}
            ${errorClasses}
            ${disabledClasses}
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${inputClassName}
          `}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-1 flex items-center text-sm text-red-600">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

export const AtlanTextarea = ({
  label,
  description,
  error,
  required = false,
  className = '',
  labelClassName = '',
  textareaClassName = '',
  rows = 3,
  ...props
}) => {
  const baseTextareaClasses = 'w-full px-3 py-2 border rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-0 resize-none';
  const errorClasses = error 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
    : 'border-gray-300 focus:border-atlan-blue-500 focus:ring-atlan-blue-500';
  const disabledClasses = props.disabled 
    ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
    : 'bg-white text-gray-900';

  return (
    <div className={className}>
      {label && (
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {description && (
        <p className="text-xs text-gray-600 mb-2">{description}</p>
      )}
      
      <textarea
        rows={rows}
        className={`
          ${baseTextareaClasses}
          ${errorClasses}
          ${disabledClasses}
          ${textareaClassName}
        `}
        {...props}
      />
      
      {error && (
        <div className="mt-1 flex items-center text-sm text-red-600">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

export const AtlanSelect = ({
  label,
  description,
  error,
  required = false,
  options = [],
  placeholder = 'Select an option...',
  className = '',
  labelClassName = '',
  selectClassName = '',
  ...props
}) => {
  const baseSelectClasses = 'w-full px-3 py-2 border rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-0 bg-white';
  const errorClasses = error 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
    : 'border-gray-300 focus:border-atlan-blue-500 focus:ring-atlan-blue-500';
  const disabledClasses = props.disabled 
    ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
    : 'text-gray-900';

  return (
    <div className={className}>
      {label && (
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {description && (
        <p className="text-xs text-gray-600 mb-2">{description}</p>
      )}
      
      <select
        className={`
          ${baseSelectClasses}
          ${errorClasses}
          ${disabledClasses}
          ${selectClassName}
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <div className="mt-1 flex items-center text-sm text-red-600">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

export default AtlanInput;