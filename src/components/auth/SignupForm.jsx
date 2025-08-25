import React, { useState, useEffect } from 'react';
import { showToast } from '../../utils/helpers';

const SignupForm = ({ onLogin, userEmail }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    company_name: '',
    phonenumber: '',
    company_email: userEmail || '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    createpass: false,
    confirmcreatepass: false
  });

  useEffect(() => {
    if (userEmail) {
      setFormData(prev => ({
        ...prev,
        company_email: userEmail
      }));
    }
  }, [userEmail]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateStep1 = () => {
    if (!formData.fullname.trim()) {
      showToast('Full name is required', 'error');
      return false;
    }
    if (!formData.phonenumber.trim()) {
      showToast('Phone number is required', 'error');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.company_email.trim()) {
      showToast('Email is required', 'error');
      return false;
    }
    if (!formData.password.trim()) {
      showToast('Password is required', 'error');
      return false;
    }
    if (formData.password.length < 8) {
      showToast('Password must be at least 8 characters long', 'error');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) return;

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'confirmPassword') {
          formDataToSend.append(key, value);
        }
      });

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/signup`, {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.error) {
        showToast(data.error, 'error');
      } else {
        showToast('Account created successfully! Please complete your company profile.', 'success');
        // Redirect to dashboard after successful signup
        window.location.href = '/dashboard';
      }
    } catch (error) {
      showToast('Something went wrong. Please try again.', 'error');
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-2">
        <p className="text-gray-600">
          Already have an account?{' '}
          <span 
            className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium transition-colors"
            onClick={onLogin}
          >
            Log in
          </span>
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
          currentStep >= 1 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-500'
        }`}>
          1
        </div>
        <div className="flex-1 h-1 bg-gray-200 mx-2 relative">
          <div 
            className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-300"
            style={{ width: currentStep === 2 ? '100%' : '50%' }}
          ></div>
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
          currentStep >= 2 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-500'
        }`}>
          2
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Basic Information */}
        <div className={`space-y-4 ${currentStep === 1 ? 'block' : 'hidden'}`}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name (Required)
            </label>
            <input
              type="text"
              name="fullname"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={formData.fullname}
              onChange={handleInputChange}
              required
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company / Business Name (Optional)
            </label>
            <input
              type="text"
              name="company_name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={formData.company_name}
              onChange={handleInputChange}
              placeholder="Can be your fullname"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number (Required)
            </label>
            <input
              type="tel"
              name="phonenumber"
              maxLength="16"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={formData.phonenumber}
              onChange={handleInputChange}
              required
              placeholder="Enter your phone number"
            />
          </div>

          <button
            type="button"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            onClick={nextStep}
          >
            Continue
          </button>
        </div>

        {/* Step 2: Account Information */}
        <div className={`space-y-4 ${currentStep === 2 ? 'block' : 'hidden'}`}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email (Required)
            </label>
            <input
              type="email"
              name="company_email"
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                userEmail ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
              value={formData.company_email}
              onChange={handleInputChange}
              readOnly={!!userEmail}
              required
              placeholder="Enter your email address"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Password
            </label>
            <input
              type={showPassword.createpass ? 'text' : 'password'}
              id="createpass"
              name="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Create a password"
            />
            <button
              type="button"
              className="absolute right-3 top-11 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => togglePasswordVisibility('createpass')}
            >
              {showPassword.createpass ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type={showPassword.confirmcreatepass ? 'text' : 'password'}
              id="confirmcreatepass"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                confirmPassword: e.target.value
              }))}
              required
              placeholder="Confirm your password"
            />
            <button
              type="button"
              className="absolute right-3 top-11 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => togglePasswordVisibility('confirmcreatepass')}
            >
              {showPassword.confirmcreatepass ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex justify-between space-x-4 pt-4">
            <button
              type="button"
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
              onClick={prevStep}
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Terms and Privacy */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-blue-600 hover:text-blue-800">Terms of Service</a>{' '}
          and{' '}
          <a href="#" className="text-blue-600 hover:text-blue-800">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;