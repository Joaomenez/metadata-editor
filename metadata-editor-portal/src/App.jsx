import React, { useState } from 'react';
import AtlanHeader from './components/Layout/AtlanHeader';
import AtlanSidebar from './components/Layout/AtlanSidebar';
import PageContainer from './components/Layout/PageContainer';
import TableListView from './components/TableList/TableListView';
import MetadataEditorView from './components/MetadataEditor/MetadataEditorView';
import HistoryView from './components/History/HistoryView';
import VersionsView from './components/Versions/VersionsView';
import { customMetadataGroups } from './data/mockData';

function App() {
  const [activeSection, setActiveSection] = useState('tables');
  const [selectedTables, setSelectedTables] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleEditSelected = (tables) => {
    setSelectedTables(tables);
    setEditMode(true);
    setActiveSection('editor');
  };

  const handleBackToList = () => {
    setEditMode(false);
    setActiveSection('tables');
    setSelectedTables([]);
  };

  const handleSaveDraft = () => {
    // Simulate saving draft
    console.log('Saving draft...', selectedTables);
    alert('Draft saved successfully!');
  };

  const handleApplyChanges = () => {
    // Simulate applying changes
    console.log('Applying changes...', selectedTables);
    alert('Alterações aplicadas com sucesso!');
    handleBackToList();
  };

  const handleSectionChange = (section) => {
    if (section === 'tables' && editMode) {
      handleBackToList();
    } else {
      setActiveSection(section);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <AtlanHeader />
      
      <div className="flex-1 flex overflow-hidden">
        <AtlanSidebar 
          activeSection={activeSection} 
          onSectionChange={handleSectionChange}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        {activeSection === 'tables' && !editMode && (
          <PageContainer
            title="Editor de Metadados"
            description="Navegue, importe e gerencie metadados dos seus ativos de dados"
          >
            <TableListView onEditSelected={handleEditSelected} />
          </PageContainer>
        )}

        {activeSection === 'editor' && editMode && (
          <MetadataEditorView
            tables={selectedTables}
            onBack={handleBackToList}
            onSaveDraft={handleSaveDraft}
            onApplyChanges={handleApplyChanges}
            customGroups={customMetadataGroups}
          />
        )}


        {activeSection === 'history' && (
          <PageContainer
            title="Histórico de Salvamentos"
            description="Visualize o histórico de edições de metadados salvas pelos usuários"
          >
            <HistoryView />
          </PageContainer>
        )}

        {activeSection === 'versions' && (
          <PageContainer
            title="Controle de Versões"
            description="Gerencie versões de metadados e faça rollbacks quando necessário"
          >
            <VersionsView />
          </PageContainer>
        )}
      </div>
    </div>
  );
}

export default App
