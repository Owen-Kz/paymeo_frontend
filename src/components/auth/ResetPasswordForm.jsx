// src/components/auth/ResetPasswordForm.jsx
import React, { useState, useRef } from 'react';
import { showToast, deleteCookie } from '../../utils/helpers';

const ResetPasswordForm = ({ onBack, onComplete }) => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password.length < 8) {
      showToast("Password must be at least 8 characters long.", 'error');
      passwordRef.current?.classList.add("shake");
      setTimeout(() => {
        passwordRef.current?.classList.remove("shake");
      }, 300);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match.", 'error');
      confirmPasswordRef.current?.classList.add("shake");
      setTimeout(() => {
        confirmPasswordRef.current?.classList.remove("shake");
      }, 300);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/createNewPassword`, {
        method: "POST",
        body: JSON.stringify({ password: formData.password }),
        headers: {
          "Content-type": "application/json"
        }
      });

      const data = await response.json();

      if (data.success) {
        showToast("Password reset successful! 🎉", 'success');
        deleteCookie("pwd_reset");
        onComplete();
      } else {
        showToast(data.error || 'An error occurred', 'error');
      }
    } catch (error) {
      showToast('An error occurred. Please try again.', 'error');
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Password</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <div className="relative">
            <input
              ref={passwordRef}
              type={showPassword ? "text" : "password"}
              name="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              <img
                width="15"
                height="15"
                src="https://img.icons8.com/fluency-systems-regular/48/visible--v1.png"
                alt="toggle visibility"
              />
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <div className="relative">
            <input
              ref={confirmPasswordRef}
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <img
                width="15"
                height="15"
                src="https://img.icons8.com/fluency-systems-regular/48/visible--v1.png"
                alt="toggle visibility"
              />
            </button>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60"
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;