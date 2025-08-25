// src/components/auth/LoginForm.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// import { showToast } from '../../utils/helpers';

const LoginForm = ({ onForgotPassword, onSignup }) => {
  const [formData, setFormData] = useState({
    user: '',
    pass: ''
  });
    const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const passwordRef = useRef(null);
  const userRef = useRef(null);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await login(formData.user, formData.pass);

    if (result.success) {
      navigate('/dashboard'); // Navigate here after successful login
    }
    
    setIsLoading(false);
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form id="loginFormMain" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="loginUser" className="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          ref={userRef}
          type="text"
          id="loginUser"
          name="user"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email / Account Number / Reg. No"
          value={formData.user}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="loginPass" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            ref={passwordRef}
            type={showPassword ? "text" : "password"}
            id="loginPass"
            name="pass"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            value={formData.pass}
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
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="flexCheckChecked"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="flexCheckChecked" className="ml-2 block text-sm text-gray-700">
            Remember this device
          </label>
        </div>
        
        <button
          type="button"
          className="text-blue-600 text-sm font-medium hover:text-blue-800"
          onClick={onForgotPassword}
        >
          Forgot Password?
        </button>
      </div>
   <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          isLoading ? 'opacity-60 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? (
          <div className="inline-flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Signing In...
          </div>
        ) : (
          'Sign In'
        )}
      </button>
      
      <div className="flex items-center justify-center mt-4">
        <p className="text-sm text-gray-600">New to Paymeo?</p>
        <button
          type="button"
          className="ml-2 text-blue-600 text-sm font-medium hover:text-blue-800"
          onClick={onSignup}
        >
          Create an account
        </button>
      </div>
    </form>
  );
};

export default LoginForm;