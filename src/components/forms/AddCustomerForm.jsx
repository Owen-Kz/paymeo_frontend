// src/components/forms/AddCustomerForm.jsx
import React, { useState, useEffect } from 'react';
import { showToast } from '../../utils/helpers';
import api from '../../utils/api'; // ✅ Import the API instance

const AddCustomerForm = ({ onCustomerSelect, selectedCustomers, onCustomerAdded }) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    const filtered = customers.filter(customer =>
      customer.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.recipient_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.recipient_phone.includes(searchTerm) ||
      (customer.company_name && customer.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  const loadCustomers = async () => {
    try {
      setIsLoading(true);
      // ✅ Use the API instance instead of direct fetch
      const response = await api.post('/getPreviousRecipients');
      
      if (response.data.recipients) {
        setCustomers(response.data.recipients);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error('Error loading customers:', error);
      showToast('Failed to load customers', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showToast('Please enter customer name', 'error');
      return false;
    }
    if (!formData.phone && !formData.email) {
      showToast('Email or Phone number is required', 'error');
      return false;
    }
    if (formData.phone && !/^[\d+]{11,15}$/.test(formData.phone)) {
      showToast('Please enter a valid phone number (11-15 digits)', 'error');
      return false;
    }
    return true;
  };

  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // ✅ Use the API instance instead of direct fetch
      const response = await api.post('/customers/create', formData);
      const data = response.data;

      if (data.success) {
        showToast('Customer added successfully', 'success');
        setFormData({ name: '', email: '', phone: '', company: '' });
        setShowForm(false);
        await loadCustomers(); // Refresh the customer list
        if (onCustomerAdded && data.customer) {
          onCustomerAdded(data.customer);
        }
      } else {
        showToast(data.error || 'Failed to add customer', 'error');
      }
    } catch (error) {
      console.error('Error saving customer:', error);
      showToast(error.response?.data?.error || 'Network error. Please try again.', 'error');
    }
  };

  const handleCustomerClick = (customer) => {
    onCustomerSelect(customer);
  };

  const isCustomerSelected = (customer) => {
    return selectedCustomers.some(c => c.id === customer.id);
  };

  return (
    <div className="space-y-4">
      {/* Toggle Buttons */}
      <div className="text-center">
        {!showForm ? (
          <button
            type="button"
            className="text-blue-600 font-semibold hover:underline"
            onClick={() => setShowForm(true)}
          >
            + Add New Customer
          </button>
        ) : (
          <button
            type="button"
            className="text-blue-600 font-semibold hover:underline"
            onClick={() => setShowForm(false)}
          >
            ← Back to Previous Customers
          </button>
        )}
      </div>

      {/* Search + List */}
      {!showForm && (
        <div className="space-y-3">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Search for previous recipients"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="max-h-60 overflow-y-auto rounded-lg border border-gray-200 divide-y">
            {isLoading ? (
              <div className="text-center py-4 text-gray-500">Loading customers...</div>
            ) : filteredCustomers.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                {searchTerm ? 'No customers found' : 'No customers available'}
              </div>
            ) : (
              filteredCustomers.map(customer => (
                <div
                  key={customer.id}
                  className={`p-3 cursor-pointer transition-colors ${
                    isCustomerSelected(customer)
                      ? 'bg-blue-100 text-blue-800'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleCustomerClick(customer)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{customer.recipient_name || customer.recipient_name}</p>
                      {customer.recipient_email && <p className="text-sm text-gray-600">{customer.recipient_email}</p>}
                      {customer.recipient_phone && <p className="text-sm text-gray-600">{customer.recipient_phone}</p>}
                      {customer.company_name && <p className="text-sm text-gray-600">{customer.company_name}</p>}
                    </div>
                    {isCustomerSelected(customer) && (
                      <span className="text-green-600 font-bold">✓</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add Customer Form */}
      {showForm && (
        <form onSubmit={handleSaveCustomer} className="space-y-4">
          <h6 className="text-lg font-semibold text-gray-800">Create New Customer</h6>

          {['name', 'email', 'phone', 'company'].map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {field === 'name'
                  ? "Customer's Name *"
                  : field === 'email'
                  ? "Customer's Email *"
                  : field === 'phone'
                  ? "Customer's WhatsApp Number *"
                  : "Customer's Company Name *"}
              </label>
              <input
                type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                id={field}
                name={field}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder={`Enter ${field}`}
                value={formData[field]}
                onChange={handleInputChange}
                required={field === 'name' || field === 'phone'}
              />
            </div>
          ))}

          <div className="text-right">
            <button
              type="submit"
              disabled={!formData.name || (!formData.phone && !formData.email)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
            >
              Save Customer
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddCustomerForm;