// src/components/recipients/AddRecipientModal.jsx
import React, { useState, useEffect } from "react";
import { showToast } from '../../utils/helpers';
import api from '../../utils/api';

const AddRecipientModal = ({ show, onHide, onSaveRecipient }) => {
  const [activeTab, setActiveTab] = useState("existing"); // "existing" or "new"
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  // ✅ fetch customers from API (like CustomersList does)
  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/getCustomersList");
      const data = response.data;

      if (data.success) {
        setCustomers(data.recipients);
        setFilteredCustomers(data.recipients);
      } else {
        showToast(data.error || "Failed to fetch customers", "error");
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      showToast("An error occurred while fetching customers", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔄 reload modal state when opened
  useEffect(() => {
    if (show) {
      setFormData({ name: "", email: "", phone: "", company: "" });
      setSelectedCustomer(null);
      setSearchTerm("");
      setActiveTab("existing");
      fetchCustomers();
    }
  }, [show]);

  // 🔍 filter customers
  useEffect(() => {
    const filtered = customers.filter((customer) =>
      customer.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.recipient_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.recipient_phone.includes(searchTerm) ||
      (customer.company_name &&
        customer.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.recipient_name,
      email: customer.recipient_email || "",
      phone: customer.recipient_phone || "",
      company: customer.company_name || "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast("Customer name is required", "error");
      return;
    }

    onSaveRecipient(formData);
    onHide();
  };

  const handleUseSelectedCustomer = () => {
    if (!selectedCustomer) {
      showToast("Please select a customer", "error");
      return;
    }

    onSaveRecipient({
      name: selectedCustomer.recipient_name,
      email: selectedCustomer.recipient_email,
      phone: selectedCustomer.recipient_phone,
      company: selectedCustomer.company_name
    });
    onHide();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 animate-fadeIn max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Select Recipient</h2>
          <button
            onClick={onHide}
            className="text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            type="button"
            className={`flex-1 py-2 px-4 text-center font-medium ${
              activeTab === "existing"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("existing")}
          >
            Select Existing Customer
          </button>
          <button
            type="button"
            className={`flex-1 py-2 px-4 text-center font-medium ${
              activeTab === "new"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("new")}
          >
            Add New Customer
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {activeTab === "existing" ? (
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Search */}
              <div className="mb-4 relative">
                <input
                  type="text"
                  placeholder="Search customers by name, email, phone or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pl-10"
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Customers List */}
              <div className="flex-1 overflow-y-auto border rounded-lg divide-y">
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : filteredCustomers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No customers found</p>
                  </div>
                ) : (
                  filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedCustomer?.id === customer.id
                          ? "bg-blue-50 border-l-4 border-blue-600"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleCustomerSelect(customer)}
                    >
                      <h4 className="font-medium text-gray-900">
                        {customer.recipient_name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {customer.recipient_email} • {customer.recipient_phone}
                      </p>
                      <p className="text-xs text-gray-500">
                        {customer.company_name || "No company"}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {/* New Customer Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    placeholder="Enter customer name"
                  />
                </div>
                   <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                
                    placeholder="Enter customer company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Enter phone number"
                  />
                </div>
              </form>
            </div>
          )}

          {/* Footer buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t mt-4">
            <button
              type="button"
              onClick={onHide}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>

            {activeTab === "existing" ? (
              <button
                type="button"
                onClick={handleUseSelectedCustomer}
                disabled={!selectedCustomer}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Use Selected Customer
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!formData.name.trim()}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save New Customer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRecipientModal;
