import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../config/authConfig';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { instance, accounts, inProgress } = useMsal();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('AuthContext: accounts changed', accounts);
    console.log('AuthContext: inProgress', inProgress);
    
    if (accounts.length > 0) {
      console.log('AuthContext: Setting user from account', accounts[0]);
      setUser({
        name: accounts[0].name,
        username: accounts[0].username,
        email: accounts[0].username,
        id: accounts[0].localAccountId,
      });
    } else {
      console.log('AuthContext: No accounts, clearing user');
      setUser(null);
    }
    setLoading(false);
  }, [accounts, inProgress]);

  const login = async () => {
    try {
      setError(null);
      console.log('AuthContext: Starting login popup...');
      console.log('AuthContext: Login request:', loginRequest);
      
      const response = await instance.loginPopup(loginRequest);
      console.log('AuthContext: Login response:', response);
      
      if (response) {
        console.log('AuthContext: Setting user from login response');
        setUser({
          name: response.account.name,
          username: response.account.username,
          email: response.account.username,
          id: response.account.localAccountId,
        });
        return response;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      throw err;
    }
  };

  const loginWithRedirect = async () => {
    try {
      setError(null);
      await instance.loginRedirect(loginRequest);
    } catch (err) {
      console.error('Login redirect error:', err);
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await instance.logoutPopup();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message);
    }
  };

  const logoutWithRedirect = async () => {
    try {
      setError(null);
      await instance.logoutRedirect();
      setUser(null);
    } catch (err) {
      console.error('Logout redirect error:', err);
      setError(err.message);
    }
  };

  const getAccessToken = async () => {
    try {
      const account = accounts[0];
      if (!account) {
        throw new Error('No authenticated account found');
      }

      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account,
      });

      return response.accessToken;
    } catch (err) {
      console.error('Token acquisition error:', err);
      
      try {
        const response = await instance.acquireTokenPopup(loginRequest);
        return response.accessToken;
      } catch (popupErr) {
        console.error('Token popup acquisition error:', popupErr);
        throw popupErr;
      }
    }
  };

  const value = {
    user,
    loading: loading || inProgress === 'login' || inProgress === 'logout',
    error,
    isAuthenticated: !!user,
    login,
    loginWithRedirect,
    logout,
    logoutWithRedirect,
    getAccessToken,
    instance,
    accounts,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};