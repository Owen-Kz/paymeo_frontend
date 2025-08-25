import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import { showToast } from "../../utils/helpers";
import PinModal from "./PinModal";
import CreatePinModal from "./CreatePinModal";
import PaystackModal from "./PaystackModal";
import api from "../../utils/api";

const SendMoneyModal = ({ user, show, onHide, dashboardBalance }) => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showCreatePinModal, setShowCreatePinModal] = useState(false);
  const [showPaystackModal, setShowPaystackModal] = useState(false);
  const [paystackUrl, setPaystackUrl] = useState("");
  const [formData, setFormData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    reset,
    setError,
    clearErrors,
    trigger, // ✅ Added trigger for validation
  } = useForm({
    mode: "onChange",
    defaultValues: {
      recipient_email: "",
      send_amount: "",
      send_money_payment_method: "",
    },
  });

  const watchAmount = watch("send_amount");
  const watchPaymentMethod = watch("send_money_payment_method");

  // ✅ Memoized validation effect
  useEffect(() => {
    const validateBalance = async () => {
      if (watchPaymentMethod === "wallet_balance" && watchAmount) {
        const amount = parseFloat(watchAmount);
        const balance = parseFloat(dashboardBalance || 0);

        if (amount > balance) {
          setError("send_amount", {
            type: "manual",
            message: "Insufficient balance for this transaction",
          });
        } else {
          clearErrors("send_amount");
        }
        // Trigger re-validation after setting error
        await trigger("send_amount");
      }
    };

    validateBalance();
  }, [watchAmount, watchPaymentMethod, dashboardBalance, setError, clearErrors, trigger]);

  // ✅ Reset function with useCallback to prevent unnecessary re-renders
  const resetForm = useCallback(() => {
    reset();
    setShowPinModal(false);
    setShowCreatePinModal(false);
    setShowPaystackModal(false);
    setFormData(null);
    setPaystackUrl(""); // ✅ Clear paystack URL too
  }, [reset]);

  useEffect(() => {
    if (!show) {
      resetForm();
    }
  }, [show, resetForm]);

  const onSubmit = async (data) => {
    // ✅ Validate form before proceeding
    const isValid = await trigger();
    if (!isValid) return;
    
    setFormData(data);
    
    if (!user?.has_transaction_pin) {
      setShowCreatePinModal(true);
    } else {
      setShowPinModal(true);
    }
  };

  // ✅ Handle PIN verification success
// ✅ Handle PIN verification success
// ✅ Handle PIN verification success
const handlePinSuccess = async (pin) => {
  setIsLoading(true);
  
  try {
    const payload = {
      ...formData,
      transaction_pin: pin
    };

    const response = await api.post('/sendMoney', payload);
    console.log('Send money response:', response.data);
    
    if (response.data.success) {
      // ✅ Check if response contains a Paystack URL
      const paystackUrl = response.data?.url || response.data.data?.authorization_url;
      console.log("PSYSTA", paystackUrl)
  
      if (paystackUrl) {
        setPaystackUrl(paystackUrl);
        setShowPaystackModal(true);
        // Don't show success toast yet - wait for Paystack completion
      } else {
        // Direct wallet transfer success
        showToast(response.data.message || 'Money sent successfully!', 'success');
        onHide();
      }
    } else {
      throw new Error(response.data.error || 'Failed to send money');
    }
  } catch (error) {
    console.error('Send money error:', error);
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.message || 
                        error.message || 
                        'Failed to send money';
    showToast(errorMessage, 'error');
  } finally {
    setIsLoading(false);
    setShowPinModal(false);
    setShowCreatePinModal(false);
  }
};


  // ✅ Handle Paystack payment completion
// ✅ Handle Paystack payment completion
const handlePaystackComplete = useCallback((success) => {
  if (success) {
    showToast('Payment completed successfully! Money sent.', 'success');
    onHide();
    // ✅ Consider adding a callback to refresh the dashboard balance
  } else {
    showToast('Payment was cancelled or failed', 'info');
  }
  setShowPaystackModal(false);
}, [onHide]);

  // ✅ Early return should be at the top to avoid unnecessary rendering
  if (!show) return null;

  // ✅ Calculate remaining balance safely
  const calculateRemainingBalance = () => {
    if (!watchAmount || isNaN(watchAmount) || !dashboardBalance) return dashboardBalance || 0;
    const amount = parseFloat(watchAmount);
    const balance = parseFloat(dashboardBalance);
    return (balance - amount).toLocaleString();
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        {/* Modal */}
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h6 className="text-lg font-semibold text-gray-800">Send Money</h6>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 text-xl"
              onClick={onHide}
              disabled={isLoading}
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto max-h-[75vh]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Recipient Email
                </label>
                <input
                  type="email"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.recipient_email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter recipient's email address"
                  {...register("recipient_email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  disabled={isLoading}
                />
                {errors.recipient_email && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.recipient_email.message}
                  </p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="100"
                  max="1000000"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.send_amount ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter amount (₦100 - ₦1,000,000)"
                  {...register("send_amount", {
                    required: "Amount is required",
                    min: { value: 100, message: "Minimum amount is ₦100" },
                    max: { value: 1000000, message: "Maximum amount is ₦1,000,000" },
                    valueAsNumber: true,
                  })}
                  disabled={isLoading}
                />
                {errors.send_amount && (
                  <p className="mt-1 text-red-500 text-sm">{errors.send_amount.message}</p>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Wallet Balance Option */}
                  <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    watchPaymentMethod === "wallet_balance" 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-300 hover:border-gray-400"
                  }`}>
                    <input
                      type="radio"
                      value="wallet_balance"
                      className="sr-only"
                      {...register("send_money_payment_method", {
                        required: "Please select a payment method",
                      })}
                      disabled={isLoading}
                    />
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <span className="block font-medium text-gray-900">Wallet Balance</span>
                        <span className="block text-sm text-gray-600">Use available funds</span>
                      </div>
                    </div>
                  </label>

                  {/* Paystack Option */}
                  <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    watchPaymentMethod === "paystack" 
                      ? "border-green-500 bg-green-50" 
                      : "border-gray-300 hover:border-gray-400"
                  }`}>
                    <input
                      type="radio"
                      value="paystack"
                      className="sr-only"
                      {...register("send_money_payment_method", {
                        required: "Please select a payment method",
                      })}
                      disabled={isLoading}
                    />
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <span className="block font-medium text-gray-900">Card/Bank Transfer</span>
                        <span className="block text-sm text-gray-600">Pay with Paystack</span>
                      </div>
                    </div>
                  </label>
                </div>
                
                {errors.send_money_payment_method && (
                  <p className="mt-2 text-red-500 text-sm">
                    {errors.send_money_payment_method.message}
                  </p>
                )}
              </div>

              {/* Balance Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">
                  Available Balance:{" "}
                  <span className="font-semibold">
                    ₦{(dashboardBalance || 0).toLocaleString()}
                  </span>
                </p>
                {watchPaymentMethod === "wallet_balance" && watchAmount && (
                  <p className="text-gray-600 text-sm mt-2">
                    After transaction:{" "}
                    <span className="font-semibold">
                      ₦{calculateRemainingBalance()}
                    </span>
                  </p>
                )}
                {watchPaymentMethod === "paystack" && watchAmount && (
                  <p className="text-green-600 text-sm mt-2">
                    You'll complete payment in a secure modal
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !isValid || !isDirty}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Proceed to Send Money'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Pin Modals */}
      <PinModal
        show={showPinModal}
        onHide={() => setShowPinModal(false)}
        onPinVerified={handlePinSuccess}
        isLoading={isLoading}
      />
      <CreatePinModal
        show={showCreatePinModal}
        onHide={() => setShowCreatePinModal(false)}
        onSuccess={handlePinSuccess}
        isLoading={isLoading}
      />
      
      {/* Paystack Modal */}
      <PaystackModal
        show={showPaystackModal}
        onHide={() => setShowPaystackModal(false)}
        paystackUrl={paystackUrl}
        onPaymentComplete={handlePaystackComplete}
      />
    </>
  );
};

export default SendMoneyModal;