// src/components/modals/PaymentRequestDetailModal.jsx
import React from 'react';

const PaymentRequestDetailModal = ({ show, onHide, request }) => {
  if (!show || !request) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onHide}
      ></div>
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-full p-4">
          <div 
            className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Payment Request Details</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                onClick={onHide}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Request Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Narration</p>
                  <p className="font-medium text-gray-900">{request.narration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Invoice Code</p>
                  <p className="font-medium text-gray-900">{request.invoice_code}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-semibold text-lg text-blue-600">
                    ₦{request.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    request.status === "completed" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {request.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Created Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(request.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* Customer Info */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
                {request.customers.map((customer, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 mb-3 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium text-gray-900">{customer.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Status</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        customer.payment_status === "completed" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {customer.payment_status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{customer.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{customer.phone}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Last Update</p>
                      <p className="font-medium text-gray-900">
                        {new Date(customer.last_update).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end p-6 border-t border-gray-200 space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Share Request
              </button>
              <button
                onClick={onHide}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentRequestDetailModal;