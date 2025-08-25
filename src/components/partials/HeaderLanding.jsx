// src/components/HeaderLanding.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const HeaderLanding = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <img src="/assets/logo.png" alt="Paymeo" className="h-8 w-auto" />
            <span className="ml-2 text-xl font-semibold">Paymeo</span>
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link to="/features" className="text-gray-600 hover:text-gray-900">Features</Link>
            <Link to="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
            <Link to="/api-docs" className="text-blue-600 hover:text-blue-800">API Docs</Link>
            <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
            <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Sign Up</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default HeaderLanding;