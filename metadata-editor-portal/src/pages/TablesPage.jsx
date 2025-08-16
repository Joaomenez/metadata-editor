import React from 'react';
import PageContainer from '../components/Layout/PageContainer';
import TableListView from '../components/TableList/TableListView';
import { useNavigate } from 'react-router-dom';

const TablesPage = () => {
  const navigate = useNavigate();

  const handleEditSelected = (tables) => {
    // Store selected tables in sessionStorage to pass to editor
    sessionStorage.setItem('selectedTables', JSON.stringify(tables));
    navigate('/editor');
  };

  return (
    <PageContainer
      title="Editor de Metadados"
      description="Navegue, importe e gerencie metadados dos seus ativos de dados"
    >
      <TableListView onEditSelected={handleEditSelected} />
    </PageContainer>
  );
};

export default TablesPage;