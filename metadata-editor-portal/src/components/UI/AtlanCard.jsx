import React from 'react';

const AtlanCard = ({ 
  children, 
  title, 
  description,
  actions,
  selected = false,
  hoverable = false,
  clickable = false,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  onClick,
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-lg border transition-all duration-200';
  const selectedClasses = selected 
    ? 'border-atlan-blue-600 ring-2 ring-atlan-blue-600 ring-opacity-50 bg-atlan-blue-50' 
    : 'border-gray-200';
  const hoverClasses = hoverable ? 'hover:shadow-md hover:border-gray-300' : '';
  const cursorClasses = clickable || onClick ? 'cursor-pointer' : '';
  
  return (
    <div
      className={`
        ${baseClasses}
        ${selectedClasses}
        ${hoverClasses}
        ${cursorClasses}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {(title || description || actions) && (
        <div className={`px-6 py-4 border-b border-gray-200 ${headerClassName}`}>
          <div className="flex items-start justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">
                  {title}
                </h3>
              )}
              {description && (
                <p className="mt-1 text-sm text-gray-600">
                  {description}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex items-center space-x-2 ml-4">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className={`px-6 py-4 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default AtlanCard;