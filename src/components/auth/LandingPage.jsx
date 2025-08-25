import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import VerifyCodeForm from './VerifyCodeForm';
import ResetPasswordForm from './ResetPasswordForm';

const LandingPage = () => {
  const [currentForm, setCurrentForm] = useState('login');
  const [userEmail, setUserEmail] = useState('');

  const renderForm = () => {
    switch (currentForm) {
      case 'login':
        return (
          <LoginForm 
            onForgotPassword={() => setCurrentForm('forgot')}
            onSignup={() => setCurrentForm('signup')}
          />
        );
      case 'signup':
        return (
          <SignupForm 
            onLogin={() => setCurrentForm('login')}
            userEmail={userEmail}
          />
        );
      case 'forgot':
        return (
          <ForgotPasswordForm 
            onBack={() => setCurrentForm('login')}
            onVerify={() => setCurrentForm('verify')}
            setUserEmail={setUserEmail}
          />
        );
      case 'verify':
        return (
          <VerifyCodeForm 
            onBack={() => setCurrentForm('forgot')}
            onReset={() => setCurrentForm('reset')}
          />
        );
      case 'reset':
        return (
          <ResetPasswordForm 
            onBack={() => setCurrentForm('verify')}
            onComplete={() => setCurrentForm('login')}
          />
        );
      default:
        return (
          <LoginForm 
            onForgotPassword={() => setCurrentForm('forgot')}
            onSignup={() => setCurrentForm('signup')}
          />
        );
    }
  };

  const getFormTitle = () => {
    switch (currentForm) {
      case 'login': return 'Welcome Back';
      case 'signup': return 'Create Account';
      case 'forgot': return 'Reset Password';
      case 'verify': return 'Verify Code';
      case 'reset': return 'New Password';
      default: return 'Welcome';
    }
  };

  const getFormSubtitle = () => {
    switch (currentForm) {
      case 'login': return 'Sign in to your account to continue';
      case 'signup': return 'Join thousands of businesses using Paymeo';
      case 'forgot': return 'Enter your email to reset your password';
      case 'verify': return 'Enter the verification code sent to your email';
      case 'reset': return 'Create a new password for your account';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 ">
      <div className="flex min-h-screen">
        {/* Left Side - Promotional Content */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-gradient-to-br from-purple-600 to-blue-600  text-white p-12">
          <div className="flex flex-col justify-center max-w-md mx-auto">
            {/* Logo */}
            <div className="mb-12">
              <div className="flex items-center">
                <img 
                  src="/assets/logo.png" 
                  alt="Paymeo Logo" 
                  className="w-16 h-16"
                />
                <h1 className="text-4xl font-bold ml-4">Paymeo</h1>
              </div>
              <p className="text-blue-100 mt-2 text-lg">Smart Invoicing & Payments</p>
            </div>

            {/* Promotional Content */}
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="bg-white/20 p-3 rounded-lg mr-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
                  <p className="text-blue-100">Bank-level security for all your transactions and sensitive data.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-white/20 p-3 rounded-lg mr-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                  <p className="text-blue-100">Create and send professional invoices in seconds, not hours.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-white/20 p-3 rounded-lg mr-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Customer Management</h3>
                  <p className="text-blue-100">Keep track of all your clients and their payment history in one place.</p>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="mt-16 p-6 bg-white/10 rounded-xl">
              <p className="text-lg italic mb-4">"Paymeo transformed how we handle invoicing. We've reduced payment delays by 70%!"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <span className="font-semibold">SA</span>
                </div>
                <div>
                  <p className="font-semibold">Sarah Adeyemi</p>
                  <p className="text-blue-100 text-sm">CEO, TechSolutions NG</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Content */}
        <div className="w-full lg:w-1/2 xl:w-2/5 bg-white flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <div className="flex items-center">
                <img 
                  src="/assets/logo.png" 
                  alt="Paymeo Logo" 
                  className="w-12 h-12"
                />
                <h1 className="text-2xl font-bold text-gray-800 ml-3">Paymeo</h1>
              </div>
            </div>

            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {getFormTitle()}
              </h2>
              <p className="text-gray-600">
                {getFormSubtitle()}
              </p>
            </div>

            {/* Form Container */}
            <div className="bg-white rounded-lg">
              {renderForm()}
            </div>

            {/* Footer Links */}
            <div className="mt-8 text-center">
              <div className="flex justify-center space-x-6 mb-4">
                <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Privacy Policy</a>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Terms of Service</a>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Support</a>
              </div>
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} Paymeo. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;