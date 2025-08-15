import React from 'react';

const AtlanBadge = ({ 
  variant = 'default',
  size = 'md',
  children,
  icon,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-atlan-blue-100 text-atlan-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-700',
    verified: 'bg-green-100 text-green-800',
    draft: 'bg-yellow-100 text-yellow-800',
    deprecated: 'bg-red-100 text-red-800'
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-sm',
    xl: 'px-3 py-1 text-base'
  };

  const iconSizes = {
    xs: 'w-2 h-2',
    sm: 'w-3 h-3',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-4 h-4'
  };

  return (
    <span
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {icon && (
        <span className={`${iconSizes[size]} mr-1`}>
          {icon}
        </span>
      )}
      {children}
    </span>
  );
};

export default AtlanBadge;