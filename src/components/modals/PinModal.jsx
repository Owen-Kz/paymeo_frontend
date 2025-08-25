// src/components/modals/PinModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import { showToast } from '../../utils/helpers';
import api from '../../utils/api'

const PinModal = ({ show, onHide, onPinVerified, isLoading }) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ Added loading state
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    // Focus the first input when modal opens
    if (show) {
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 100);
    } else {
      // Reset pin when modal closes
      setPin(['', '', '', '']);
      setIsSubmitting(false); // ✅ Reset loading state when modal closes
    }
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const fullPin = pin.join('');
    
    if (fullPin.length !== 4 || !/^\d+$/.test(fullPin)) {
      showToast('Please enter a valid 4-digit PIN', 'error');
      return;
    }

    setIsSubmitting(true); // ✅ Start loading

    try {
      const response = await api.post(
        `/validate-pin`,
        {
          pin: fullPin
        }
      );

      const data = await response.data;
 

      if (data.status !== 'success') {
        throw new Error(data.message || 'Invalid PIN');
      }

      onPinVerified(fullPin);
    } catch (error) {
      showToast(error.message || 'Invalid PIN', 'error');
      // Clear PIN on error
      setPin(['', '', '', '']);
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 100);
    } finally {
      setIsSubmitting(false); // ✅ Stop loading regardless of success/error
    }
  };

  const handleInputChange = (index, value) => {
    // Only allow numbers
    const numericValue = value.replace(/\D/g, '');
    
    if (numericValue.length > 1) {
      // If pasting multiple digits, distribute them across inputs
      const newPin = [...pin];
      const digits = numericValue.split('').slice(0, 4);
      
      digits.forEach((digit, i) => {
        if (index + i < 4) {
          newPin[index + i] = digit;
        }
      });
      
      setPin(newPin);
      
      // Focus the next empty input or the last one if all are filled
      const nextIndex = Math.min(index + digits.length, 3);
      inputRefs[nextIndex].current?.focus();
    } else {
      // Single digit input
      const newPin = [...pin];
      newPin[index] = numericValue;
      setPin(newPin);
      
      // Auto-focus next input if a digit was entered
      if (numericValue && index < 3) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace key
    if (e.key === 'Backspace') {
      if (!pin[index] && index > 0) {
        // If current field is empty, move to previous field on backspace
        inputRefs[index - 1].current?.focus();
      }
    }
    
    // Handle left arrow key
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs[index - 1].current?.focus();
      e.preventDefault();
    }
    
    // Handle right arrow key
    if (e.key === 'ArrowRight' && index < 3) {
      inputRefs[index + 1].current?.focus();
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const numericValue = pastedData.replace(/\D/g, '').slice(0, 4);
    
    if (numericValue.length > 0) {
      const newPin = ['', '', '', ''];
      numericValue.split('').forEach((digit, i) => {
        if (i < 4) {
          newPin[i] = digit;
        }
      });
      
      setPin(newPin);
      
      // Focus the next empty input or the last one if all are filled
      const nextIndex = Math.min(numericValue.length, 3);
      inputRefs[nextIndex].current?.focus();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
          <h5 className="text-xl font-semibold text-gray-800">
            Enter Transaction PIN
          </h5>
          <button
            type="button"
            onClick={onHide}
            disabled={isSubmitting} // ✅ Disable close button when submitting
            className="text-gray-500 hover:text-gray-800 transition-colors p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-600 mb-4 text-center">
              Please enter your 4-digit transaction PIN
            </label>
            
            <div className="flex justify-center space-x-3">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  autoComplete="off"
                  disabled={isSubmitting} // ✅ Disable inputs when submitting
                  className="w-14 h-14 text-2xl text-center border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              ))}
            </div>
          </div>

          {/* Footer / Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onHide}
              disabled={isSubmitting} // ✅ Disable cancel button when submitting
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || pin.join('').length !== 4} // ✅ Keep existing validation
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center min-w-[120px]"
            >
              {isSubmitting ? ( // ✅ Show loader when submitting
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : 'Verify PIN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PinModal;