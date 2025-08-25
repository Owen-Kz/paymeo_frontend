// src/pages/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useModals } from '../hooks/useModals';
import { useNavigate } from 'react-router-dom';
import AccountBalanceCard from '../components/dashboard/AccountBalanceCard';
import QuickActions from '../components/dashboard/QuickActions';
import InvoiceListWithPreview from '../components/invoices/InvoiceListWithPreviews';
import useDashboardData from '../contexts/userDashboardData';
import { showToast } from '../utils/helpers';
import SendMoneyModal from '../components/modals/SendMoneyModal';
import RequestMoneyModal from '../components/modals/RequestMoneyModal';
import EscrowPayModal from '../components/modals/EscrowPayModal';
import BuyCreditModal from '../components/modals/BuyCreditModal';

const Dashboard = () => {
  const { currentUser, currentAccountDetails, existingAccount, refreshAllData, logout } = useAuth();
  const { data, loading, error, refresh: refreshDashboardData } = useDashboardData();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { modals, openModal, closeModal } = useModals();
  const navigate = useNavigate();

  // ✅ Memoized refresh function to prevent unnecessary re-renders
  const handleRefreshAllData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Only call refreshAllData since it likely includes dashboard data refresh
      await refreshAllData();
      showToast('Data refreshed successfully', 'success');
    } catch (error) {
      console.error('Failed to refresh data:', error);
      showToast('Failed to refresh data', 'error');
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshAllData]);

  // ✅ Handle authentication errors and redirect
  useEffect(() => {
    // Check if there's an authentication error (401 or 403)
    const isAuthError = error?.response?.status === 401 || error?.response?.status === 403;
    
    if (!loading && (isAuthError || (error && !data))) {
      console.log('Authentication error detected, logging out:', { error, data });
      
      showToast('Your session has expired. Please login again.', 'error');
      
      // Logout and redirect to login
      logout();
      navigate('/login');
    }
  }, [loading, error, data, navigate, logout]);

  // Handle hash-based modal opening - RUNS ONLY ONCE
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#send-money') openModal('sendMoney');
    if (hash === '#request-money') openModal('requestMoney');
    if (hash === '#escrow-pay') openModal('escrowPay');
    
    // Clear the hash after handling it
    window.location.hash = '';
  }, []); // Empty dependency array - runs only once on mount

  // ✅ Fixed: Refresh data when modals close (e.g., after transactions)
  useEffect(() => {
    // Use a ref to track which modals we've already handled
    const handledModals = {
      sendMoney: modals.sendMoney,
      requestMoney: modals.requestMoney,
      escrowPay: modals.escrowPay
    };

    return () => {
      // This cleanup function runs when the component unmounts OR when dependencies change
      // Check if any modal was just closed
      if (
        (handledModals.sendMoney && !modals.sendMoney) ||
        (handledModals.requestMoney && !modals.requestMoney) ||
        (handledModals.escrowPay && !modals.escrowPay)
      ) {
        // Small delay to ensure backend has processed the transaction
        setTimeout(() => {
          handleRefreshAllData();
        }, 1000);
      }
    };
  }, [modals.sendMoney, modals.requestMoney, modals.escrowPay, handleRefreshAllData]);

  // ✅ Show loading state while checking authentication
  if (loading) {
    return (
      <div className="container-fluid px-4 py-6">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // ✅ If no user (should be handled by ProtectedRoute, but just in case)
  if (!currentUser) {
    return null; // ProtectedRoute should redirect, but this is a fallback
  }

  return (
    <div className="w-full align-items-centermax-w-screen-lg container-fluid ">
      {/* Refresh Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleRefreshAllData}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isRefreshing ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Refreshing...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh Data
            </>
          )}
        </button>
      </div>

      {/* Account balance and actions */}
      <AccountBalanceCard 
        user={currentUser} 
        accountDetails={currentAccountDetails} 
        existingAccount={existingAccount} 
        dashboardData={data}
        onDataRefresh={handleRefreshAllData}
      />

      {/* QuickActions with direct modal openers */}
      <QuickActions
        onSendMoney={() => openModal('sendMoney')}
        onRequestMoney={() => openModal('requestMoney')}
        onEscrowPay={() => openModal('escrowPay')}
      />

      {/* Invoices Section */}
      <InvoiceListWithPreview />
      
      {/* Modals */}
      <SendMoneyModal
        user={currentUser}
        show={modals.sendMoney}
        onHide={() => closeModal('sendMoney')}
        dashboardBalance={data?.account?.balance || 0}
        onSuccess={handleRefreshAllData}
      />
      <RequestMoneyModal
        show={modals.requestMoney}
        onHide={() => closeModal('requestMoney')}
        onSuccess={handleRefreshAllData}
      />
      <EscrowPayModal
        show={modals.escrowPay}
        onHide={() => closeModal('escrowPay')}
        onSuccess={handleRefreshAllData}
      />
      <BuyCreditModal
        show={modals.buyCredit}
        onHide={() => closeModal('buyCredit')}
        onSuccess={handleRefreshAllData}
      />
    </div>
  );
};

export default Dashboard;