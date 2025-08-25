// src/components/modals/BuyCreditModal.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { showToast } from '../../utils/helpers';

const BuyCreditModal = ({ show, onHide }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    credit_amount: '',
    payment_method: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!show) {
      setFormData({ credit_amount: '', payment_method: '' });
      setError('');
    }
  }, [show]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateForm({ ...formData, [name]: value });
  };

  const validateForm = (data = formData) => {
    setError('');
    if (!data.credit_amount || !data.payment_method) return false;

    const amount = parseFloat(data.credit_amount);
    const balance = parseFloat(currentUser?.balance || 0);

    if (data.payment_method === 'wallet_balance' && amount > balance) {
      setError('Requested amount exceeds your current balance, Pay with Card or Bank transfer.');
      return false;
    }
    if (amount < 100) {
      setError('Minimum purchase is 100 NGN');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      let endpoint = '';
      if (formData.payment_method === 'wallet_balance') {
        endpoint = '/wallet/credit/topup';
      } else if (formData.payment_method === 'paystack') {
        endpoint = '/paystack/credit/topup';
      }

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        showToast(data.success, 'success');
        if (formData.payment_method === 'paystack' && data.payment_link) {
          window.location.href = data.payment_link;
        } else {
          setTimeout(() => window.location.reload(), 1500);
        }
      } else {
        setError(data.error || 'Something went wrong');
        showToast(data.error || 'Something went wrong', 'error');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      showToast('Network error. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const creditOptions = [
    { value: '100', label: '10 Credits at 100 NGN' },
    { value: '200', label: '20 Credits at 200 NGN' },
    { value: '300', label: '30 Credits at 300 NGN' },
    { value: '500', label: '50 Credits at 500 NGN' },
    { value: '1000', label: '100 Credits at 1,000 NGN' },
    { value: '9990', label: '1,000 Credits at 9,990 NGN' },
    { value: '99900', label: '10,000 Credits at 99,900 NGN' }
  ];

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Buy Credits</h2>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-800 transition"
            onClick={onHide}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Credit Package */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Credit Package
              </label>
              <select
                name="credit_amount"
                value={formData.credit_amount}
                onChange={handleInputChange}
                required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Credit Package</option>
                {creditOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleInputChange}
                required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Payment Method</option>
                <option value="wallet_balance">Wallet Balance</option>
                <option value="paystack">Pay With Card or Bank Transfer</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !formData.credit_amount || !formData.payment_method}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Proceed to Payment'}
            </button>

            {/* Balance Info */}
            <p className="text-right text-gray-600 text-sm">
              Your balance: ₦{currentUser?.balance?.toLocaleString() || '0'}
            </p>

            {/* Error Alert */}
            {error && (
              <div className="mt-3 text-red-600 bg-red-100 px-4 py-2 rounded-lg">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default BuyCreditModal;
