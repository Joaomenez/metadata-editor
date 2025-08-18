import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import MetadataEditorView from '../components/MetadataEditor/MetadataEditorView';
import { customMetadataGroups, mockTables } from '../data/mockData';

const EditorPage = () => {
  const navigate = useNavigate();
  const { tableGuid } = useParams();
  const [searchParams] = useSearchParams();
  const [selectedTables, setSelectedTables] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get callback URL from query params
  const callbackUrl = searchParams.get('callback');

  useEffect(() => {
    // If a specific table GUID is provided in the URL
    if (tableGuid) {
      // Find the table by GUID from mock data
      const table = mockTables.find(t => t.guid === tableGuid);
      if (table) {
        setSelectedTables([table]);
        setLoading(false);
        
        // Store in sessionStorage for consistency
        sessionStorage.setItem('selectedTables', JSON.stringify([table]));
        
        // Store callback URL if provided
        if (callbackUrl) {
          sessionStorage.setItem('callbackUrl', callbackUrl);
        }
      } else {
        // Table not found, redirect to home
        alert('Tabela não encontrada');
        navigate('/');
      }
    } else {
      // No specific table, check sessionStorage for selected tables
      const storedTables = sessionStorage.getItem('selectedTables');
      if (storedTables) {
        setSelectedTables(JSON.parse(storedTables));
        setLoading(false);
      } else {
        // If no tables selected, redirect to tables page
        navigate('/');
      }
    }
  }, [navigate, tableGuid, callbackUrl]);

  const handleBackToList = () => {
    // Check if we have a callback URL
    const storedCallbackUrl = sessionStorage.getItem('callbackUrl');
    
    if (storedCallbackUrl) {
      // Clear storage and redirect to callback URL
      sessionStorage.removeItem('selectedTables');
      sessionStorage.removeItem('callbackUrl');
      window.location.href = storedCallbackUrl;
    } else {
      // Clear stored tables and navigate back to home
      sessionStorage.removeItem('selectedTables');
      navigate('/');
    }
  };

  const handleSaveDraft = () => {
    // Simulate saving draft
    console.log('Saving draft...', selectedTables);
    alert('Rascunho salvo com sucesso!');
  };

  const handleApplyChanges = () => {
    // Simulate applying changes
    console.log('Applying changes...', selectedTables);
    
    // Check if we have a callback URL
    const storedCallbackUrl = sessionStorage.getItem('callbackUrl');
    
    if (storedCallbackUrl) {
      // Clear storage and redirect to callback URL with success status
      sessionStorage.removeItem('selectedTables');
      sessionStorage.removeItem('callbackUrl');
      
      // Add status parameter to callback URL
      const separator = storedCallbackUrl.includes('?') ? '&' : '?';
      window.location.href = `${storedCallbackUrl}${separator}status=success&message=Metadados aplicados com sucesso`;
    } else {
      alert('Alterações aplicadas com sucesso!');
      handleBackToList();
    }
  };

  if (loading || selectedTables.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando tabela...</p>
        </div>
      </div>
    );
  }

  return (
    <MetadataEditorView
      tables={selectedTables}
      onBack={handleBackToList}
      onSaveDraft={handleSaveDraft}
      onApplyChanges={handleApplyChanges}
      customGroups={customMetadataGroups}
    />
  );
};

export default EditorPage;