// src/components/auth/ForgotPasswordForm.jsx
import React, { useState, useRef, useContext } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { showToast } from '../../utils/helpers';

const ForgotPasswordForm = ({ onBack, onVerify }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef(null);
  
  const { BACKEND_URL } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      emailRef.current?.focus();
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/forgotPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast(data.message || 'Password reset link sent to your email!', 'success');
        
        // Store email for verification step if needed
        localStorage.setItem('resetEmail', email);
        
        // Move to verification step if callback provided
        if (onVerify) {
          onVerify(email);
        }
      } else {
        // Show specific error messages from server or generic one
        const errorMessage = data.error || data.message || 'Could not send password reset link';
        showToast(errorMessage, 'error');
        
        // Focus on email field for correction
        emailRef.current?.focus();
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      showToast('Network error. Please check your connection and try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-form">
      <button
        type="button"
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
        onClick={onBack}
      >
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Back to Login
      </button>

      <div className="text-center mb-2">
        <svg className="w-16 h-16 mx-auto text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h2>
        <p className="text-gray-600 mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            ref={emailRef}
            id="email"
            type="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending Reset Link...
            </>
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Didn't receive the email?</h3>
        <ul className="text-xs text-blue-600 space-y-1">
          <li>• Check your spam or junk folder</li>
          <li>• Make sure you entered the correct email address</li>
          <li>• Wait a few minutes and try again</li>
        </ul>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;