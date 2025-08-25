// components/PaystackModal.js
import React, { useState, useEffect } from 'react';

const PaystackModal = ({ show, onHide, paystackUrl, onPaymentComplete }) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [error, setError] = useState(null);
  console.log('PaystackModal props:', { show, paystackUrl });
  useEffect(() => {
    // Reset states when modal is shown/hidden
    if (show && paystackUrl) {
    //   setIframeLoaded(false);
    //   setError(null);
      console.log('Paystack URL:', paystackUrl);
    }
  }, [show, paystackUrl]);

  const handleIframeLoad = () => {
    console.log('Paystack iframe loaded successfully');
    setIframeLoaded(true);
    setError(null);
  };

  const handleIframeError = () => {
    console.error('Failed to load Paystack iframe');
    setError('Failed to load payment page. Please try again.');
  };

const handleClose = () => {
  onHide();
  // Don’t pass iframeLoaded as “success”
  onPaymentComplete(false);
};


  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h6 className="text-lg font-semibold text-gray-800">Complete Payment</h6>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 text-xl"
            onClick={handleClose}
          >
            &times;
          </button>
        </div>
        
        {/* Loading/Error State */}
        {!iframeLoaded && !error && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading payment gateway...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-4">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
        
        {/* Iframe for Paystack */}
        <div className={`flex-grow ${!iframeLoaded ? 'hidden' : ''}`}>
          <iframe
            src={paystackUrl}
            title="Paystack Payment"
            className="w-full h-full border-0"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation-by-user-activation"
            allow="payment *"
          />
        </div>
        
        {/* Footer with instructions */}
        <div className="px-4 py-3 bg-gray-50 border-t">
          <p className="text-sm text-gray-600 text-center">
            Complete your payment in the secure form above. Do not close this window until completed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaystackModal;