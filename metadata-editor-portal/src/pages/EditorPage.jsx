import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MetadataEditorView from '../components/MetadataEditor/MetadataEditorView';
import { customMetadataGroups } from '../data/mockData';

const EditorPage = () => {
  const navigate = useNavigate();
  const [selectedTables, setSelectedTables] = useState([]);

  useEffect(() => {
    // Get selected tables from sessionStorage
    const storedTables = sessionStorage.getItem('selectedTables');
    if (storedTables) {
      setSelectedTables(JSON.parse(storedTables));
    } else {
      // If no tables selected, redirect to tables page
      navigate('/');
    }
  }, [navigate]);

  const handleBackToList = () => {
    // Clear stored tables and navigate back
    sessionStorage.removeItem('selectedTables');
    navigate('/');
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

  if (selectedTables.length === 0) {
    return <div>Loading...</div>;
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