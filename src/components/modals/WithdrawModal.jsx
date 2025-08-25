import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { showToast } from '../../utils/helpers';
import BankList from '../partials/BankList';
import CreatePinModal from '../modals/CreatePinModal';
import PinModal from '../modals/PinModal';
import api from '../../utils/api';


const WithdrawModal = ({user, show, onHide, accountDetails, balance, csrfToken, hasPin, onWithdrawSuccess }) => {
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState({ code: '', name: '' });
  const [accountName, setAccountName] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [activeTab, setActiveTab] = useState('existing'); // 'existing' or 'new'
  const [selectedExistingAccount, setSelectedExistingAccount] = useState(null);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showCreatePin, setShowCreatePin] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ Added loading state

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAccountDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auto-fill form when selecting an existing account
  useEffect(() => {
    if (activeTab === 'existing' && selectedExistingAccount) {
      setAccountNumber(selectedExistingAccount.account_number);
      setAccountName(selectedExistingAccount.account_name);
      
      // Set the bank name (we don't have the code, so we'll just set the name)
      setSelectedBank({ code: '', name: selectedExistingAccount.bank_name });
    } else if (activeTab === 'new') {
      // Reset fields when switching to new account
      setAccountNumber('');
      setAccountName('');
      setSelectedBank({ code: '', name: '' });
      setSelectedExistingAccount(null);
    }
  }, [activeTab, selectedExistingAccount]);

  const resolveAccount = async () => {
    if (!selectedBank.code || accountNumber.length !== 10 || activeTab === 'existing') return;

    setIsResolving(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/resolve-account`, {
        params: {
          account_number: accountNumber,
          bank_code: selectedBank.code
        }
      });

      const { account_name } = res.data;
      setAccountName(account_name);
    } catch (err) {
      setAccountName('');
      showToast(err.response?.data?.message || 'Invalid account details', 'error');
    } finally {
      setIsResolving(false);
    }
  };

  useEffect(() => {
    if (accountNumber.length === 10 && selectedBank.code && activeTab === 'new') {
      const timer = setTimeout(() => {
        resolveAccount();
      }, 500);
      return () => clearTimeout(timer);
    } else if (activeTab === 'new') {
      setAccountName('');
    }
  }, [accountNumber, selectedBank, activeTab]);

  const calculateFee = () => {
    const amountNum = parseFloat(amount) || 0;
    return amountNum >= 10000 ? 50 : 10;
  };

  const calculateTotal = () => {
    const amountNum = parseFloat(amount) || 0;
    return amountNum - calculateFee();
  };

  // 🔎 Check if balance is enough
  const insufficientBalance = () => {
    const amountNum = parseFloat(amount) || 0;
    const totalDebit = amountNum + calculateFee();
    return totalDebit > balance;
  };

  const handleBankSelect = (code, name) => {
    setSelectedBank({ code, name });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (insufficientBalance()) {
      showToast('Insufficient balance', 'error');
      return;
    }

    // Validate account details based on selection
    if (activeTab === 'existing' && !selectedExistingAccount) {
      showToast('Please select an account', 'error');
      return;
    }

    if (activeTab === 'new' && (!accountNumber || !selectedBank.code || !accountName)) {
      showToast('Please provide valid account details', 'error');
      return;
    }

    if (!hasPin) {
      setShowCreatePin(true); // show create pin modal
      return;
    }
    setShowPinModal(true); // show pin validation modal
  };

  // callback when PIN is validated or created successfully
  const handlePinSuccess = async (pin) => {
    setIsSubmitting(true); // ✅ Start loading
    try {
      const response = await api.post(
        `/withdraw/wallet`,
        {
          amount,
          accountNumber: activeTab === 'existing' ? selectedExistingAccount.account_number : accountNumber,
          bankCode: activeTab === 'existing' ? '' : selectedBank.code,
          bankName: activeTab === 'existing' ? selectedExistingAccount.bank_name : selectedBank.name,
          accountName: activeTab === 'existing' ? selectedExistingAccount.account_name : accountName,
          transaction_pin: pin,
          saveAccount: activeTab === 'new' // Optionally save the new account
        },
      );

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      showToast(response.data.success || 'Withdrawal successful!', 'success');
      
      // ✅ Call the success callback if provided
      if (onWithdrawSuccess) {
        onWithdrawSuccess();
      }
      
      onHide();
    } catch (error) {
      showToast(error.message || 'Withdrawal failed', 'error');
    } finally {
      setIsSubmitting(false); // ✅ Stop loading
      setShowCreatePin(false);
      setShowPinModal(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-100 px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h5 className="text-xl font-semibold text-gray-800">Withdraw Funds</h5>
            <button
              onClick={onHide}
              disabled={isSubmitting} // ✅ Disable close when submitting
              className="text-gray-500 hover:text-gray-700 transition p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* Tab Navigation */}
            <div className="flex mb-6 bg-gray-100 p-1 rounded-lg">
              <button
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'existing' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('existing')}
                disabled={isSubmitting} // ✅ Disable when submitting
              >
                Existing Account
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'new' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('new')}
                disabled={isSubmitting} // ✅ Disable when submitting
              >
                New Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input type="hidden" name="csrfToken" value={csrfToken} />

              {/* Existing Account Selection */}
              {activeTab === 'existing' && (
                <div className="relative" ref={dropdownRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Account
                  </label>
                  <div 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center cursor-pointer bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => !isSubmitting && setShowAccountDropdown(!showAccountDropdown)}
                    disabled={isSubmitting} // ✅ Disable when submitting
                  >
                    <span className="truncate">
                      {selectedExistingAccount 
                        ? `${selectedExistingAccount.bank_name} - ${selectedExistingAccount.account_number}`
                        : 'Select an account'
                      }
                    </span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 text-gray-400 transition-transform ${showAccountDropdown ? 'rotate-180' : ''}`} 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>

                  {showAccountDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                      <div 
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition"
                        onClick={() => {
                          setSelectedExistingAccount(accountDetails);
                          setShowAccountDropdown(false);
                        }}
                      >
                        <div className="font-medium text-gray-800">{accountDetails.bank_name}</div>
                        <div className="text-sm text-gray-600">{accountDetails.account_number} • {accountDetails.account_name}</div>
                      </div>
                    </div>
                  )}

                  {selectedExistingAccount && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700 font-medium text-sm">
                        Account Name: {selectedExistingAccount.account_name}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* New Account Details */}
              {activeTab === 'new' && (
                <>
                  {/* Bank Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank
                    </label>
                    <BankList
                      onBankSelect={handleBankSelect}
                      selectedBankCode={selectedBank.code}
                      disabled={isSubmitting} // ✅ Pass disabled state
                    />
                  </div>

                  {/* Account Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                      maxLength={10}
                      required
                      disabled={isSubmitting} // ✅ Disable when submitting
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="10-digit account number"
                    />
                  </div>

                  {/* Account Name */}
                  {accountName && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700 font-medium text-sm">
                        Account Name: {accountName}
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  disabled={isSubmitting} // ✅ Disable when submitting
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter amount"
                />
              </div>

              {/* Fee Info */}
              {amount && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-gray-700 space-y-1">
                  <div className="flex justify-between">
                    <span>Withdrawal Fee:</span>
                    <span className="font-medium">₦{calculateFee().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>You will receive:</span>
                    <span className="font-medium text-green-600">₦{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Insufficient Balance Warning */}
              {amount && insufficientBalance() && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Insufficient balance
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  !amount ||
                  insufficientBalance() ||
                  (activeTab === 'existing' && !selectedExistingAccount) ||
                  (activeTab === 'new' && (!accountNumber || !selectedBank.code || !accountName)) ||
                  isSubmitting // ✅ Disable when submitting
                }
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3.5 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Withdraw'
                )}
              </button>

              {/* Balance */}
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-gray-600 text-sm">Your balance:</span>
                <span className="text-lg font-semibold text-gray-800">₦{new Number(balance).toLocaleString()}</span>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreatePin && (
        <CreatePinModal
          show={showCreatePin}
          onHide={() => setShowCreatePin(false)}
          onSuccess={handlePinSuccess}
          isLoading={isSubmitting} // ✅ Pass loading state
        />
      )}

      {showPinModal && (
        <PinModal
          show={showPinModal}
          onHide={() => setShowPinModal(false)}
          onPinVerified={handlePinSuccess}
          isLoading={isSubmitting} // ✅ Pass loading state
        />
      )}
    </>
  );
};

export default WithdrawModal;