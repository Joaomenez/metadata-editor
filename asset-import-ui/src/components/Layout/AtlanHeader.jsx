import React from 'react';
import UserMenu from '../Auth/UserMenu';

const AtlanHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded flex items-center justify-center"
                style={{ backgroundColor: '#2960d4' }}
              >
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                Asset Import
              </h1>
            </div>
          </div>

          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default AtlanHeader;