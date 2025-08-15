import React from 'react';
import { 
  Database, 
  FileEdit, 
  History, 
  Settings, 
  Upload,
  GitBranch,
  Shield,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const AtlanSidebar = ({ activeSection = 'tables', onSectionChange, collapsed = false, onToggleCollapse }) => {
  const menuItems = [
    { id: 'tables', label: 'Editar', icon: Database },
    { id: 'history', label: 'Histórico', icon: History },
    { id: 'versions', label: 'Versões', icon: GitBranch },
  ];

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 h-full transition-all duration-300 relative`}>
      <div className="p-4">
        {/* Toggle Button inside menu */}
        <div className={`flex ${collapsed ? 'justify-center' : 'justify-end'} mb-4`}>
          <button
            onClick={onToggleCollapse}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
            title={collapsed ? 'Expandir menu' : 'Colapsar menu'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange?.(item.id)}
                className={`
                  w-full flex items-center rounded-lg transition-colors duration-150
                  ${collapsed 
                    ? 'justify-center px-2 py-3' 
                    : 'space-x-3 px-3 py-2.5'
                  }
                  ${isActive 
                    ? 'bg-atlan-blue-50 text-atlan-blue-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>
      </div>
      
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <div>Conectado ao Atlan</div>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
      )}

      {collapsed && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="w-2 h-2 bg-green-500 rounded-full" title="Online"></div>
        </div>
      )}
    </aside>
  );
};

export default AtlanSidebar;