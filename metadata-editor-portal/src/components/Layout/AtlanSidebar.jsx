import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

const AtlanSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'tables', label: 'Editar', icon: Database, path: '/' },
    { id: 'history', label: 'Histórico', icon: History, path: '/history' },
    { id: 'versions', label: 'Versões', icon: GitBranch, path: '/versions' },
  ];

  const getActiveSection = () => {
    const currentPath = location.pathname;
    if (currentPath === '/') return 'tables';
    if (currentPath === '/editor') return 'tables';
    if (currentPath === '/history') return 'history';
    if (currentPath === '/versions') return 'versions';
    return 'tables';
  };

  return (
    <aside className="w-[60px] bg-white border-r border-gray-200 h-full relative">
      <div className="p-2">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = getActiveSection() === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`
                  w-full flex flex-col items-center justify-center px-1 py-1.5 space-y-0.5 rounded-lg transition-colors duration-150
                  ${isActive 
                    ? 'bg-atlan-blue-50 text-atlan-blue-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-[10px] leading-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <div className="w-2 h-2 bg-green-500 rounded-full" title="Online"></div>
      </div>
    </aside>
  );
};

export default AtlanSidebar;