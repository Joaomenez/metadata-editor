import React from 'react';

const PageContainer = ({ children, title, description, actions }) => {
  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full overflow-y-auto">
        {(title || description || actions) && (
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                {title && (
                  <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
                )}
                {description && (
                  <p className="mt-1 text-sm text-gray-600">{description}</p>
                )}
              </div>
              {actions && (
                <div className="flex items-center space-x-3">
                  {actions}
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageContainer;