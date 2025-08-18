import React from 'react';
import PageContainer from '../components/Layout/PageContainer';
import HistoryView from '../components/History/HistoryView';

const HistoryPage = () => {
  return (
    <PageContainer
      title="Histórico de Salvamentos"
      description="Visualize o histórico de edições de metadados salvas pelos usuários"
    >
      <HistoryView />
    </PageContainer>
  );
};

export default HistoryPage;