// src/components/modals/RequestMoneyModal.jsx
import React, { useState } from 'react';
import { showToast } from '../../utils/helpers';
import AddCustomerForm from '../forms/AddCustomerForm';
import api from '../../utils/api';

const RequestMoneyModal = ({ show, onHide }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [formData, setFormData] = useState({
    request_amount: '',
    narration: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCustomerSelect = (customer) => {
    setSelectedCustomers((prev) => {
      const isSelected = prev.find((c) => c.id === customer.id);
      return isSelected
        ? prev.filter((c) => c.id !== customer.id)
        : [...prev, customer];
    });
  };

  const handleCustomerAdded = (newCustomer) => {
    setSelectedCustomers((prev) => [...prev, newCustomer]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    if (selectedCustomers.length === 0) {
      setError('Please select at least one customer');
      return false;
    }
    setError('');
    return true;
  };

  const validateStep2 = () => {
    const amount = parseFloat(formData.request_amount);
    if (!amount || amount < 100 || amount > 1000000) {
      setError('Amount must be between ₦100 and ₦1,000,000');
      return false;
    }
    if (formData.narration && formData.narration.length > 30) {
      setError('Narration must be 30 characters or less');
      return false;
    }
    setError('');
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      const requestData = {
        customers: selectedCustomers,
        amount: formData.request_amount,
        narration: formData.narration,
      };

      const response = await api.post('/createPaymentRequest', requestData);
      const data = response.data;

      if (data.success) {
        showToast(data.message, 'success');
        onHide();
        setSelectedCustomers([]);
        setFormData({ request_amount: '', narration: '' });
        setCurrentStep(1);
      } else {
        setError(data.error || 'Failed to create payment request');
        showToast(data.error || 'Failed to create payment request', 'error');
      }
    } catch (error) {
      console.error('Error creating payment request:', error);
      const errorMessage = error.response?.data?.error || 'Network error. Please try again.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center bg-blue-600 text-white px-6 py-4">
          <h5 className="text-lg font-semibold">Request Money</h5>
          <button 
            onClick={onHide} 
            className="text-white hover:text-gray-200"
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Stepper */}
          <div className="flex items-center justify-center mb-6">
            {[1, 2, 3].map((step, idx) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold 
                  ${currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}
                >
                  {step}
                </div>
                {idx < 2 && (
                  <div
                    className={`h-1 w-12 mx-2 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-300'}`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Select Customers */}
          {currentStep === 1 && (
            <div>
              <AddCustomerForm
                onCustomerSelect={handleCustomerSelect}
                selectedCustomers={selectedCustomers}
                onCustomerAdded={handleCustomerAdded}
              />

              {selectedCustomers.length > 0 && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <h6 className="font-semibold mb-2">Selected Customers</h6>
                  <ul className="space-y-2">
                    {selectedCustomers.map((customer) => (
                      <li
                        key={customer.id}
                        className="flex justify-between items-center bg-white p-2 rounded shadow-sm"
                      >
                        <span>
                          {customer?.name ?? customer?.recipient_name} -{" "}
                          {customer?.email ?? customer?.recipient_email ?? customer?.recipient_phone ?? ""}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCustomerSelect(customer)}
                          className="text-red-500 hover:text-red-700 text-sm"
                          disabled={isLoading}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                type="button"
                onClick={nextStep}
                disabled={selectedCustomers.length === 0 || isLoading}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Continue to Amount
              </button>
            </div>
          )}

          {/* Step 2: Enter Amount */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Amount (₦)</label>
                <input
                  type="number"
                  name="request_amount"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="Enter Amount (₦100 - ₦1,000,000)"
                  value={formData.request_amount}
                  onChange={handleInputChange}
                  required
                  min="100"
                  max="1000000"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Narration (optional)</label>
                <input
                  type="text"
                  name="narration"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="Reason (max 30 chars)"
                  value={formData.narration}
                  onChange={handleInputChange}
                  maxLength="30"
                  disabled={isLoading}
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  Review Request
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review - This step needs a form wrapper */}
          {currentStep === 3 && (
            <form onSubmit={handleSubmit}>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h6 className="font-semibold mb-3">Review Request</h6>
                <p><strong>Customers:</strong></p>
                <ul className="list-disc list-inside mb-3 text-gray-700">
                  {selectedCustomers.map((c) => (
                    <li key={c.id}>
                      {c.name || c.recipient_name} - {c.email || c.phone}
                    </li>
                  ))}
                </ul>
                <p><strong>Amount:</strong> ₦{formData.request_amount}</p>
                {formData.narration && (
                  <p><strong>Narration:</strong> {formData.narration}</p>
                )}
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : 'Send Request'}
                </button>
              </div>
            </form>
          )}

          {error && (
            <div className="mt-4 text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestMoneyModal;