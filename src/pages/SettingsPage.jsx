import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AccountSettings from '../components/settings/AccountSettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import BillingSettings from '../components/settings/BillingSettings';
import SecuritySettings from '../components/settings/SecuritySettings';
import InvoiceSettings from '../components/settings/InvoiceSettings';

const SettingsPage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('account');

  useEffect(() => {
    // Handle URL hash for tab navigation
    const hash = window.location.hash.replace('#', '');
    if (hash && ['account', 'notifications', 'bills', 'security', 'invoice'].includes(hash)) {
      setActiveTab(hash);
    }
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.history.replaceState(null, null, `#${tab}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return <AccountSettings user={currentUser} />;
      case 'notifications':
        return <NotificationSettings user={currentUser} />;
      case 'bills':
        return <BillingSettings user={currentUser} />;
      case 'security':
        return <SecuritySettings user={currentUser} />;
      case 'invoice':
        return currentUser?.subscriptionPlan?.planName === "premium" ? 
          <InvoiceSettings user={currentUser} /> : null;
      default:
        return <AccountSettings user={currentUser} />;
    }
  };

  // Tab configuration
  const tabs = [
    { id: 'account', label: 'Account', icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ) },
    { id: 'notifications', label: 'Notifications', icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ) },
    { id: 'bills', label: 'Billing', icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ) },
    { id: 'security', label: 'Security', icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ) },
  ];

  // Add invoice settings tab for premium users
  if (currentUser?.subscriptionPlan?.planName === "premium") {
    tabs.push({
      id: 'invoice',
      label: 'Invoice Settings',
      icon: (
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    });
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-2 md:p-1">
      <div className="max-w-10xl mx-auto">
        {/* Header Section */}
        {/* <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
              <p className="text-gray-500 mt-1">Manage your account preferences and settings</p>
            </div>
            <nav className="text-sm">
              <ol className="flex items-center space-x-2">
                <li>
                  <a href="/dashboard" className="text-blue-600 hover:text-blue-800 transition-colors">
                    Dashboard
                  </a>
                </li>
                <li className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-600">Account Settings</span>
                </li>
              </ol>
            </nav>
          </div>
        </div> */}

        {/* Settings Container */}
        <div className="bg-white rounded-xl shadow-md w-full max-w-10xl mx-auto overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => handleTabChange(tab.id)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;