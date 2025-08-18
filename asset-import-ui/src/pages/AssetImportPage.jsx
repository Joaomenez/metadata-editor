import React from 'react';
import PageContainer from '../components/Layout/PageContainer';
import AssetImportView from '../components/AssetImport/AssetImportView';

const AssetImportPage = () => {
  return (
    <PageContainer title="Importação de Ativos">
      <AssetImportView />
    </PageContainer>
  );
};

export default AssetImportPage;