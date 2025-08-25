// src/components/modals/CreatePinModal.jsx
import React, { useState, useRef, useEffect } from "react";
import { showToast } from "../../utils/helpers";
import api from "../../utils/api"; // ✅ Import API instance

const CreatePinModal = ({ show, onHide, onSuccess, isLoading }) => {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", ""]);
  const [activeSection, setActiveSection] = useState("create"); // 'create' or 'confirm'
  const [showPin, setShowPin] = useState(false); // Toggle PIN visibility
  const [showConfirmPin, setShowConfirmPin] = useState(false); // Toggle confirm PIN visibility
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ Added loading state

  const pinRefs = [useRef(), useRef(), useRef(), useRef()];
  const confirmPinRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (show) {
      // Reset state when modal opens
      setPin(["", "", "", ""]);
      setConfirmPin(["", "", "", ""]);
      setActiveSection("create");
      setShowPin(false);
      setShowConfirmPin(false);
      setIsSubmitting(false); // ✅ Reset loading state
      
      // Focus first input
      setTimeout(() => {
        pinRefs[0].current?.focus();
      }, 100);
    }
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const fullPin = pin.join("");
    const fullConfirmPin = confirmPin.join("");

    if (fullPin.length !== 4 || !/^\d+$/.test(fullPin)) {
      showToast("Please enter a valid 4-digit PIN", "error");
      return;
    }

    if (fullPin !== fullConfirmPin) {
      showToast("PINs do not match", "error");
      setActiveSection("confirm");
      // Focus first confirm input
      setTimeout(() => {
        confirmPinRefs[0].current?.focus();
      }, 100);
      return;
    }

    setIsSubmitting(true); // ✅ Start loading

    try {
      // ✅ Send PIN to the create-pin endpoint
      const response = await api.post('/create-pin', {
        pin: fullPin,
        confirmPin: fullConfirmPin,
      });

      if (response.data.success) {
        showToast("PIN created successfully!", "success");
        onSuccess(fullPin); // Call the success callback with the PIN
      } else {
        throw new Error(response.data.message || 'Failed to create PIN');
      }
    } catch (error) {
      console.error('PIN creation error:', error);
      showToast(error.response?.data?.message || error.message || 'Failed to create PIN', 'error');
    } finally {
      setIsSubmitting(false); // ✅ Stop loading
    }
  };

  const handleInputChange = (index, value, type) => {
    // Only allow numbers
    const numericValue = value.replace(/\D/g, '');
    
    if (numericValue.length > 1) {
      // If pasting multiple digits, distribute them across inputs
      const newDigits = numericValue.split('').slice(0, 4);
      const newArray = type === 'create' ? [...pin] : [...confirmPin];
      
      newDigits.forEach((digit, i) => {
        if (index + i < 4) {
          newArray[index + i] = digit;
        }
      });
      
      if (type === 'create') {
        setPin(newArray);
      } else {
        setConfirmPin(newArray);
      }
      
      // Focus the next empty input or the last one if all are filled
      const nextIndex = Math.min(index + newDigits.length, 3);
      const refs = type === 'create' ? pinRefs : confirmPinRefs;
      refs[nextIndex].current?.focus();
    } else {
      // Single digit input
      const newArray = type === 'create' ? [...pin] : [...confirmPin];
      newArray[index] = numericValue;
      
      if (type === 'create') {
        setPin(newArray);
      } else {
        setConfirmPin(newArray);
      }
      
      // Auto-focus next input if a digit was entered
      if (numericValue && index < 3) {
        const refs = type === 'create' ? pinRefs : confirmPinRefs;
        refs[index + 1].current?.focus();
      }
      
      // If we've filled the last digit of create PIN, move to confirm section
      if (type === 'create' && index === 3 && numericValue) {
        setActiveSection("confirm");
        setTimeout(() => {
          confirmPinRefs[0].current?.focus();
        }, 100);
      }
    }
  };

  const handleKeyDown = (index, e, type) => {
    // Handle backspace key
    if (e.key === 'Backspace') {
      const array = type === 'create' ? pin : confirmPin;
      const refs = type === 'create' ? pinRefs : confirmPinRefs;
      
      if (!array[index] && index > 0) {
        // If current field is empty, move to previous field on backspace
        refs[index - 1].current?.focus();
      }
      
      // If we're in confirm section and backspacing from first field, go back to create section
      if (type === 'confirm' && index === 0 && !array[0]) {
        setActiveSection("create");
        setTimeout(() => {
          pinRefs[3].current?.focus();
        }, 100);
      }
    }
    
    // Handle left arrow key
    if (e.key === 'ArrowLeft' && index > 0) {
      const refs = type === `create` ? pinRefs : confirmPinRefs;
      refs[index - 1].current?.focus();
      e.preventDefault();
    }
    
    // Handle right arrow key
    if (e.key === 'ArrowRight' && index < 3) {
      const refs = type === 'create' ? pinRefs : confirmPinRefs;
      refs[index + 1].current?.focus();
      e.preventDefault();
    }
  };

  const handlePaste = (e, type) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const numericValue = pastedData.replace(/\D/g, '').slice(0, 4);
    
    if (numericValue.length > 0) {
      const newArray = ['', '', '', ''];
      numericValue.split('').forEach((digit, i) => {
        if (i < 4) {
          newArray[i] = digit;
        }
      });
      
      if (type === 'create') {
        setPin(newArray);
        setActiveSection("confirm");
      } else {
        setConfirmPin(newArray);
      }
      
      // Focus the next empty input or the last one if all are filled
      const nextIndex = Math.min(numericValue.length, 3);
      const refs = type === 'create' ? pinRefs : confirmPinRefs;
      refs[nextIndex].current?.focus();
      
      // If we pasted into create and filled it, move to confirm
      if (type === 'create' && numericValue.length === 4) {
        setTimeout(() => {
          confirmPinRefs[0].current?.focus();
        }, 100);
      }
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
          <h5 className="text-xl font-semibold text-gray-800">
            Create Transaction PIN
          </h5>
          <button
            type="button"
            onClick={onHide}
            disabled={isSubmitting} // ✅ Disable when submitting
            className="text-gray-500 hover:text-gray-800 transition-colors p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Create PIN Section */}
          <div className={`transition-opacity ${activeSection === 'confirm' ? 'opacity-70' : 'opacity-100'}`}>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-600">
                Create a 4-digit transaction PIN
              </label>
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                disabled={isSubmitting} // ✅ Disable when submitting
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                title={showPin ? "Hide PIN" : "Show PIN"}
              >
                {showPin ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                )}
              </button>
            </div>
            
            <div className="flex justify-center space-x-3 mb-1">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  ref={pinRefs[index]}
                  type={showPin ? "text" : "password"}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value, 'create')}
                  onKeyDown={(e) => handleKeyDown(index, e, 'create')}
                  onPaste={(e) => handlePaste(e, 'create')}
                  autoComplete="off"
                  disabled={isSubmitting} // ✅ Disable when submitting
                  className="w-14 h-14 text-2xl text-center border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              ))}
            </div>
          </div>

          {/* Confirm PIN Section */}
          <div className={`transition-opacity ${activeSection === 'create' ? 'opacity-70' : 'opacity-100'}`}>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-600">
                Confirm your PIN
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPin(!showConfirmPin)}
                disabled={isSubmitting} // ✅ Disable when submitting
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                title={showConfirmPin ? "Hide PIN" : "Show PIN"}
              >
                {showConfirmPin ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                )}
              </button>
            </div>
            
            <div className="flex justify-center space-x-3 mb-1">
              {confirmPin.map((digit, index) => (
                <input
                  key={index}
                  ref={confirmPinRefs[index]}
                  type={showConfirmPin ? "text" : "password"}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value, 'confirm')}
                  onKeyDown={(e) => handleKeyDown(index, e, 'confirm')}
                  onPaste={(e) => handlePaste(e, 'confirm')}
                  autoComplete="off"
                  disabled={isSubmitting} // ✅ Disable when submitting
                  className="w-14 h-14 text-2xl text-center border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              ))}
            </div>
          </div>

          {/* Status Message */}
          <div className="text-center text-sm text-gray-500 min-h-5">
            {pin.join("").length === 4 && confirmPin.join("").length === 4 && 
             pin.join("") !== confirmPin.join("") && (
              <span className="text-red-500">PINs do not match</span>
            )}
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onHide}
              disabled={isSubmitting} // ✅ Disable when submitting
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || pin.join("").length !== 4 || confirmPin.join("").length !== 4}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center min-w-[160px]"
            >
              {isSubmitting ? ( // ✅ Show loader when submitting
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : 'Create PIN & Proceed'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePinModal;