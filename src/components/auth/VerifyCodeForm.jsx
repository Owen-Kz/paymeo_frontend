// src/components/auth/VerifyCodeForm.jsx
import React, { useState, useRef, useEffect } from 'react';
import { showToast, setCookie } from '../../utils/helpers';

const VerifyCodeForm = ({ onBack, onReset }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next input if a digit was entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').trim();
    if (/^\d+$/.test(pasteData)) {
      const digits = pasteData.split('').slice(0, 6);
      const newCode = [...code];
      
      digits.forEach((digit, index) => {
        if (index < 6) {
          newCode[index] = digit;
        }
      });
      
      setCode(newCode);
      
      // Focus last filled input
      const lastFilledIndex = Math.min(digits.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      showToast('Please enter a valid 6-digit code', 'error');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/confirmToken`, {
        method: "POST",
        body: JSON.stringify({ token: verificationCode }),
        headers: {
          "Content-type": "application/json"
        }
      });

      const data = await response.json();

      if (data.success) {
        showToast(data.success || 'Code Verified!', 'success');
        setCookie("pwd_reset", 1, 1);
        onReset();
      } else {
        showToast(data.error || 'Could not verify code!', 'error');
      }
    } catch (error) {
      showToast('An error occurred during verification', 'error');
      console.error('Verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        className="flex items-center text-blue-600 mb-4"
        onClick={onBack}
      >
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Back
      </button>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Verify Code</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Enter the verification code sent to your email
          </label>
          
          <div className="flex justify-center gap-3 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                className="w-12 h-14 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                required
              />
            ))}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60"
        >
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </button>
      </form>
    </div>
  );
};

export default VerifyCodeForm;