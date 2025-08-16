import React from 'react';
import PageContainer from '../components/Layout/PageContainer';
import VersionsView from '../components/Versions/VersionsView';

const VersionsPage = () => {
  return (
    <PageContainer
      title="Controle de Versões"
      description="Gerencie versões de metadados e faça rollbacks quando necessário"
    >
      <VersionsView />
    </PageContainer>
  );
};

export default VersionsPage;