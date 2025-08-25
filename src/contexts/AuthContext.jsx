// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { showToast } from '../utils/helpers';
import api, { fetchCsrfToken } from '../utils/api'; // Import both api and fetchCsrfToken

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentAccountDetails, setCurrentAccountDetails] = useState(null);
  const [existingAccount, setExistingAccount] = useState(null);
  const [userProfileComplete, setUserProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(null);

  // Add this useEffect to handle global API errors
useEffect(() => {
  const responseInterceptor = api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('Authentication error intercepted, logging out');
        // Clear user data and redirect to login
        localStorage.removeItem('_t');
        localStorage.removeItem('userData');
        localStorage.removeItem('accountDetails');
        setCurrentUser(null);
        setCurrentAccountDetails(null);
        setExistingAccount(null);
        setUserProfileComplete(false);
        
        // Only redirect if we're not already on the login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  // Clean up interceptor
  return () => {
    api.interceptors.response.eject(responseInterceptor);
  };
}, []);

  // Initialize CSRF token on app load
  useEffect(() => {
    const initializeCsrf = async () => {
      try {
        await fetchCsrfToken();
      } catch (error) {
        console.warn('CSRF token initialization failed:', error);
      }
    };

    initializeCsrf();
  }, []);

  // Function to fetch account details
  const fetchAccountDetails = useCallback(async () => {
    try {
      const response = await api.get('/account-details');
      if (response.data && response.data.account) {
        const accountData = response.data.account;
        setCurrentAccountDetails(accountData);
        localStorage.setItem('accountDetails', JSON.stringify(accountData));
        return accountData;
      }
    } catch (error) {
      console.error('Failed to fetch account details:', error);
    }
    return null;
  }, []);

  // Function to refresh user data
  const refreshUserData = useCallback(async () => {
    try {
      const response = await api.get('/user-profile');
      if (response.data && response.data.user) {
        const userData = response.data.user;
        setCurrentUser(userData);
        setUserProfileComplete(userData.company_details_complete || false);
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Update existing account details if available
        if (userData.account_number) {
          const existingAccountData = {
            account_number: userData.account_number,
            account_name: userData.account_name,
            bank_name: userData.bank_name,
          };
          setExistingAccount(existingAccountData);
        }
        
        return userData;
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
    return null;
  }, []);

  // Function to refresh all data
  const refreshAllData = useCallback(async () => {
    await Promise.all([fetchAccountDetails(), refreshUserData()]);
  }, [fetchAccountDetails, refreshUserData]);

  // Memoized verifyToken function
  const verifyToken = useCallback(async (token) => {
    try {
      const response = await api.get('/isLoggedIn');
      
      if (response.data.user) {
        setCurrentUser(response.data.user);
        setUserProfileComplete(response.data.user.company_details_complete || false);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        
        // Fetch account details after successful verification
        await fetchAccountDetails();
        return true;
      }

      // If not ok → clear state
      localStorage.removeItem('userData');
      localStorage.removeItem('_t');
      localStorage.removeItem('accountDetails');
      setCurrentUser(null);
      setCurrentAccountDetails(null);
      setExistingAccount(null);
      setUserProfileComplete(false);
      return false;
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('userData');
      localStorage.removeItem('_t');
      localStorage.removeItem('accountDetails');
      setCurrentUser(null);
      setCurrentAccountDetails(null);
      setExistingAccount(null);
      setUserProfileComplete(false);
      return false;
    }
  }, [fetchAccountDetails]);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('_t');
      const userData = localStorage.getItem('userData');
      const accountDetails = localStorage.getItem('accountDetails');
     
      // Use cached user data for immediate UI response
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          const ExistingAccountDetails = {
            account_name: parsedUser.account_name,
            account_number: parsedUser.account_number,
            bank_name: parsedUser.bank_name
          };
          
          let parsedAccount = {currency: "NGN", balance: 0, ledger_balance: 0, account_number: null, bank_name: null};
          if (accountDetails) {
            parsedAccount = JSON.parse(accountDetails);
          }
          
          setCurrentUser(parsedUser);
          setCurrentAccountDetails(parsedAccount);
          setExistingAccount(ExistingAccountDetails);
          setUserProfileComplete(parsedUser.company_details_complete || false);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('userData');
          localStorage.removeItem('accountDetails');
        }
      }
      
      // Verify with backend for security and get fresh data
      if (token) {
        await verifyToken(token);
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, [verifyToken]);

  // Set up automatic refresh when user is logged in
  useEffect(() => {
    if (currentUser) {
      // Clear any existing interval
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
      
      // Set up new interval to refresh data every 30 seconds
      const interval = setInterval(() => {
        refreshAllData();
      }, 30000); // 30 seconds
      
      setRefreshInterval(interval);
      
      // Clean up interval on unmount or when user logs out
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    } else {
      // Clear interval if user logs out
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    }
  }, [currentUser, refreshAllData]);

  const login = async (username, password) => {
    try {
      const response = await api.post('/login', {
        user: username,
        pass: password,
      });
      
      const data = response.data;
      
      if (data.success) {
        if (data.user) {
          const existingAccount = {
            account_number: data.user.account_number,
            account_name: data.user.account_name,
            bank_name: data.user.bank_name,
          };
          
          setCurrentUser(data.user);
          setCurrentAccountDetails(data.account || {currency: "NGN", balance: 0, ledger_balance: 0, account_number: null, bank_name: null});
          setExistingAccount(existingAccount || {});
          setUserProfileComplete(data.user.company_details_complete || false);
          localStorage.setItem('userData', JSON.stringify(data.user));
          localStorage.setItem('_t', data.token);
          localStorage.setItem('accountDetails', JSON.stringify(data.account || {}));
        }
        
        showToast('Login successful!', 'success');
        return { success: true, user: data.user };
      } else {
        showToast(data.error || 'Login failed', 'error');
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || 'Network error. Please try again.';
      showToast(errorMessage, 'error');
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear client-side storage regardless of backend response
      localStorage.removeItem('_t');
      localStorage.removeItem('userData');
      localStorage.removeItem('accountDetails');
      setCurrentUser(null);
      setCurrentAccountDetails(null);
      setExistingAccount(null);
      setUserProfileComplete(false);
      
      // Clear refresh interval
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
      
      showToast('Logged out successfully', 'success');
    }
  };

  const value = {
    currentUser,
    currentAccountDetails,
    existingAccount,
    userProfileComplete,
    login,
    logout,
    loading,
    refreshAccountDetails: fetchAccountDetails, // Expose refresh function
    refreshUserData, // Expose refresh function
    refreshAllData, // Expose refresh function
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


