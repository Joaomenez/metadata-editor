import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './config/authConfig';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoginPage from './components/Auth/LoginPage';
import AtlanHeader from './components/Layout/AtlanHeader';
import AtlanSidebar from './components/Layout/AtlanSidebar';
import AssetImportPage from './pages/AssetImportPage';

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Route - Login */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div className="h-screen flex flex-col" style={{ backgroundColor: '#f4f6fd' }}>
                    <AtlanHeader />
                    
                    <div className="flex-1 flex overflow-hidden">
                      <AtlanSidebar />
                      
                      <Routes>
                        <Route path="/" element={<AssetImportPage />} />
                      </Routes>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </MsalProvider>
  );
}

export default App;