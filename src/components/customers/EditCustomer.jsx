// src/components/customers/EditCustomer.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showToast } from '../../utils/helpers';

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  // Sample customer data for demonstration
  const sampleCustomers = {
    1: {
      _id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+234 801 234 5678',
      company: 'Acme Corporation',
      totalOrders: 12,
      totalSpent: 45800,
      lastOrder: '2024-01-15'
    },
    2: {
      _id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+234 802 345 6789',
      company: 'Tech Solutions Ltd',
      totalOrders: 8,
      totalSpent: 31250,
      lastOrder: '2024-01-10'
    },
    3: {
      _id: 3,
      name: 'Mike Johnson',
      email: 'mike.j@example.com',
      phone: '+234 803 456 7890',
      company: 'Global Enterprises',
      totalOrders: 15,
      totalSpent: 67800,
      lastOrder: '2024-01-18'
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      // Simulate API call with timeout
      setTimeout( async() => {
        // Check if we're in demo mode (no real data)
        if (!id || id === 'demo') {
          setIsDemo(true);
          // Use first sample customer for demo
          setFormData(sampleCustomers[1]);
          setIsFetching(false);
          return;
        }

        // Try to fetch from API
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/customers/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setFormData(data.customer);
        } else {
          // Fallback to demo data if API fails
          showToast('Using demo data - API unavailable', 'info');
          setIsDemo(true);
          const demoId = Object.keys(sampleCustomers)[0];
          setFormData(sampleCustomers[demoId]);
        }
      }, 1000); // Simulate network delay
      
    } catch (error) {
      showToast('Using demo data - Network error', 'info');
      setIsDemo(true);
      const demoId = Object.keys(sampleCustomers)[0];
      setFormData(sampleCustomers[demoId]);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isDemo) {
        // Simulate success in demo mode
        setTimeout(() => {
          showToast('Customer updated successfully (demo mode)', 'success');
          navigate('/customers');
        }, 1000);
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/customers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const responseData = await response.json();
      
      if (responseData.success) {
        showToast('Customer updated successfully', 'success');
        navigate('/customers');
      } else {
        showToast(responseData.message || 'Failed to update customer', 'error');
      }
    } catch (error) {
      showToast('An error occurred. Please try again.', 'error');
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

  const handleDelete = () => {
    if (isDemo) {
      showToast('Delete functionality disabled in demo mode', 'info');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${formData.name}? This action cannot be undone.`)) {
      showToast('Delete customer functionality would be implemented here', 'info');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customer details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Demo Mode Banner */}
      {isDemo && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-yellow-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-yellow-700">
              Demo Mode - Showing sample customer data. Changes will not be saved permanently.
            </span>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h5 className="text-lg font-semibold text-gray-800">Edit Customer</h5>
            <p className="text-sm text-gray-600 mt-1">Update customer information</p>
          </div>
          <nav className="mt-2 sm:mt-0">
            <button
              onClick={() => navigate('/customers')}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Customers
            </button>
          </nav>
        </div>
      </div>

      {/* Customer Form */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="flex-shrink-0 h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-800">
              {formData.name?.charAt(0) || 'C'}
            </span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{formData.name}</h3>
            <p className="text-sm text-gray-500">Customer ID: {formData._id}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                id="customerName"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter customer's full name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="customerEmail"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={formData.email}
                onChange={handleChange}
                placeholder="customer@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </span>
                <input
                  type="tel"
                  name="phone"
                  id="customerPhone"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+234 800 000 0000"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                name="company"
                id="companyName"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company name (optional)"
              />
            </div>
          </div>

          <div className="pt-4 flex space-x-3">
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isDemo ? 'Simulating...' : 'Updating...'}
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {isDemo ? 'Simulate Update' : 'Update Customer'}
                </div>
              )}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/customers')}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Additional Information */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h6 className="text-sm font-medium text-blue-800 mb-2">💡 Editing Tips</h6>
          <ul className="text-xs text-blue-600 space-y-1">
            <li>• Keep customer information up to date for better communication</li>
            <li>• Accurate phone numbers ensure successful transaction notifications</li>
            <li>• Email addresses enable receipt delivery and marketing</li>
            {isDemo && <li className="text-yellow-600">• Demo mode: Changes are not permanently saved</li>}
          </ul>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h6 className="text-sm font-medium text-gray-800 mb-2">Customer Activity</h6>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Total Orders:</span>
              <span className="font-medium">{formData.totalOrders || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Spent:</span>
              <span className="font-medium">{formatCurrency(formData.totalSpent || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Last Order:</span>
              <span className="font-medium">{formData.lastOrder ? formatDate(formData.lastOrder) : 'Never'}</span>
            </div>
            <div className="flex justify-between">
              <span>Customer Since:</span>
              <span className="font-medium">{formatDate('2023-06-15')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-8 bg-red-50 p-6 rounded-lg border border-red-200">
        <h6 className="text-sm font-medium text-red-800 mb-3">Danger Zone</h6>
        <p className="text-sm text-red-600 mb-4">
          Once you delete a customer, there is no going back. Please be certain.
        </p>
        <button 
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isDemo}
        >
          {isDemo ? 'Delete Disabled in Demo' : 'Delete Customer'}
        </button>
        {isDemo && (
          <p className="text-xs text-red-500 mt-2">
            Delete functionality is disabled in demo mode
          </p>
        )}
      </div>
    </div>
  );
};

export default EditCustomer;