// src/components/modals/ClaimBalanceModal.jsx
import React, { useState } from 'react';
import { showToast } from '../../utils/helpers';
import api from '../../utils/api';

const ClaimBalanceModal = ({ show, onHide, balance, currency, onClaimSuccess, onClaimError }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClaim = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await api.post('/claim-registration-balance');
      
      if (response.data.status === 'success') {
        onClaimSuccess();
      } else {
        throw new Error(response.data.message || 'Failed to claim balance');
      }
    } catch (error) {
      console.error('Claim balance error:', error);
      onClaimError(error.response?.data?.message || error.message || 'Failed to claim balance');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
          <h5 className="text-xl font-semibold text-gray-800">
            Claim Pre-registration Balance
          </h5>
          <button
            type="button"
            onClick={onHide}
            disabled={isSubmitting}
            className="text-gray-500 hover:text-gray-800 transition-colors p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 mb-2">
              {currency} {new Number(balance || 0).toLocaleString()}
            </div>
            <p className="text-gray-600">
              Are you sure you want to claim your pre-registration balance? This amount will be added to your main account balance.
            </p>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex justify-end gap-3 pt-6">
          <button
            type="button"
            onClick={onHide}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleClaim}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Claiming...
              </>
            ) : 'Confirm Claim'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClaimBalanceModal;