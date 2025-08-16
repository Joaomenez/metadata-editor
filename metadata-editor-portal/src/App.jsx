import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AtlanHeader from './components/Layout/AtlanHeader';
import AtlanSidebar from './components/Layout/AtlanSidebar';
import TablesPage from './pages/TablesPage';
import EditorPage from './pages/EditorPage';
import HistoryPage from './pages/HistoryPage';
import VersionsPage from './pages/VersionsPage';

function App() {
  return (
    <Router>
      <div className="h-screen flex flex-col" style={{ backgroundColor: '#f4f6fd' }}>
        <AtlanHeader />
        
        <div className="flex-1 flex overflow-hidden">
          <AtlanSidebar />
          
          <Routes>
            <Route path="/" element={<TablesPage />} />
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/versions" element={<VersionsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;