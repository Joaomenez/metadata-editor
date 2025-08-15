import React from 'react';
import { Loader } from 'lucide-react';

const AtlanButton = ({ 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  children, 
  leftIcon,
  rightIcon,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-atlan-blue hover:bg-atlan-blue-hover text-white focus:ring-atlan-blue-500 disabled:bg-gray-400',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 focus:ring-atlan-blue-500 disabled:bg-gray-100 disabled:text-gray-400',
    ghost: 'text-atlan-blue hover:bg-atlan-blue-light hover:text-atlan-blue-hover focus:ring-atlan-blue-500 disabled:text-gray-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 disabled:bg-gray-400',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 disabled:bg-gray-400'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  };

  const isDisabled = disabled || loading;
  
  return (
    <button
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <Loader className={`${iconSizes[size]} animate-spin mr-2`} />
      )}
      
      {!loading && leftIcon && (
        <span className={`${iconSizes[size]} mr-2`}>
          {leftIcon}
        </span>
      )}
      
      {children}
      
      {rightIcon && (
        <span className={`${iconSizes[size]} ml-2`}>
          {rightIcon}
        </span>
      )}
    </button>
  );
};

export default AtlanButton;