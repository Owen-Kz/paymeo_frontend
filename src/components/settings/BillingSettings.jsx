import React, { useState } from 'react';
import { showToast } from '../../utils/helpers';

const BillingSettings = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiCreditBalance, setApiCreditBalance] = useState(user?.API_Credit_Balance || 0);
  
  // Mock data - replace with actual user data
  const subscriptionPlan = user?.subscriptionPlan || {
    planName: "basic",
    cycle: "monthly",
    nextPaymentDate: "2023-12-15",
    APICredits: 1000
  };
  
  const bankDetails = user?.bankDetails || {
    bankName: "Guaranty Trust Bank",
    accountNumber: "0123456789",
    accountName: "John Doe"
  };
  
  const dateCreated = user?.dateCreated || "January 15, 2023";

  const handleBuyCredit = () => {
    // This would open a modal for buying credits
    showToast('Credit purchase feature coming soon', 'info');
  };

  const handleEditBankDetails = () => {
    // This would open a modal for editing bank details
    showToast('Bank details editing feature coming soon', 'info');
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast('Billing settings saved successfully', 'success');
    } catch (error) {
      showToast('Failed to save billing settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form or navigate away
    showToast('Changes cancelled', 'info');
  };

  const getPlanColor = (planName) => {
    switch (planName) {
      case 'premium': return 'text-green-600';
      case 'standard': return 'text-yellow-600';
      case 'basic': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getPlanDisplayName = (planName) => {
    switch (planName) {
      case 'premium': return 'Premium';
      case 'standard': return 'Standard';
      case 'basic': return 'Basic';
      default: return planName;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Plan Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Current Plan: 
            <span className={`ml-2 ${getPlanColor(subscriptionPlan.planName)}`}>
              {getPlanDisplayName(subscriptionPlan.planName)}
            </span>
          </h3>
          
          {subscriptionPlan.planName !== "basic" && (
            <div className="mb-4 space-y-2">
              <p className="text-gray-700">
                <span className="font-medium">Billed:</span> {subscriptionPlan.cycle}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Next Payment:</span> {subscriptionPlan.nextPaymentDate}
              </p>
            </div>
          )}
          
          <p className="text-gray-600 mb-6">
            This plan gives you {subscriptionPlan.planName} invoice functionalities.{' '}
            <a href="/pricing" className="text-blue-600 hover:text-blue-800 transition-colors underline">
              Learn More
            </a>
          </p>
          
          {/* API Credits */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">API Credits</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${(apiCreditBalance / subscriptionPlan.APICredits) * 100}%` }}
                  ></div>
                </div>
                <p className="font-semibold text-gray-800 text-sm">
                  {apiCreditBalance.toLocaleString()} / {subscriptionPlan.APICredits.toLocaleString()} Credits
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleBuyCredit}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Buy Credit
          </button>
        </div>

        {/* Account Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Account Info</h3>
            <span className="text-sm text-gray-500">Created on {dateCreated}</span>
          </div>
          
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bank Account</p>
                <p className="font-semibold text-gray-800">{bankDetails.bankName}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Account Number</span>
                <span className="font-medium text-gray-800">{bankDetails.accountNumber}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Account Name</span>
                <span className="font-medium text-gray-800">{bankDetails.accountName}</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 italic">
            This is the account info you submitted during signup and will be used for withdrawals
          </p>
          
          <button
            onClick={handleEditBankDetails}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Bank Details
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          onClick={handleCancel}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BillingSettings;