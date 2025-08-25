// src/pages/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { showToast } from '../utils/helpers';
import ProductsList from '../components/products/ProductsList';
import CreateProduct from '../components/products/CreateProduct';
import CustomersList from '../components/customers/CustomersList';
import CreateCustomer from '../components/customers/CreateCustomer';
import CreateCategory from '../components/products/CreateCategory';
import ComingSoon from '../components/common/ComingSoon';
import api from '../utils/api'; // ✅ import axios instance

const ProductsPage = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companyData, setCompanyData] = useState({
    company_name: '',
    company_id: ''
  });
// Add this useEffect to persist tab selection
useEffect(() => {
  // Load active tab from localStorage if available
  const savedTab = localStorage.getItem('productsPageActiveTab');
  if (savedTab) {
    setActiveTab(savedTab);
  }
}, []);

// Update this function to also save to localStorage
const handleTabChange = (tabId) => {
  setActiveTab(tabId);
  localStorage.setItem('productsPageActiveTab', tabId);
};
  useEffect(() => {
    loadProducts();
    loadCompanyData();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await api.get('/api/products'); // ✅ use api instead of fetch
      setProducts(response.data.products || []);
    } catch (error) {
      console.error(error);
      showToast('Failed to load products', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCompanyData = async () => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setCompanyData({
          company_name: parsedData.company_name || 'Your Company',
          company_id: parsedData.company_id || 'company-id'
        });
      }
    } catch (error) {
      console.error('Error loading company data:', error);
    }
  };

  const tabs = [
    { id: 'customers', label: 'Customers', icon: 'bi-people' },
    { id: 'create-customer', label: 'Add Customer', icon: 'bi-person-plus' },
    { id: 'products', label: 'Products / Service', icon: 'bi-box' },
    { id: 'create', label: 'Add Product', icon: 'bi-plus-square' },
    { id: 'showcase', label: 'Showcase', icon: 'bi-collection-play' },
    { id: 'category', label: 'Category', icon: 'bi-folder-plus' }
  ];

  if (isLoading) {
    return (
      <div className="container-fluid p-4">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      {/* Company Name */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-xl font-bold text-gray-800">{companyData.company_name}</h3>
        </div>
      </div>

      {/* Tabs and Content */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Tabs Navigation */}
        <ul className="flex flex-wrap border-b border-gray-200" role="tablist">
          {tabs.map((tab) => (
            <li key={tab.id} className="mr-2" role="presentation">
              <button
                className={`py-3 px-4 flex items-center text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab.id 
                    ? 'text-blue-600 bg-white border-t border-l border-r border-gray-200' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handleTabChange(tab.id)}
                type="button"
                role="tab"
              >
                <i className={`${tab.icon} mr-2 text-base`}></i>
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Tab Content */}
        <div className="p-0">
          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="p-0">
              <div className="w-full">
                <div className="w-full relative overflow-hidden">
                  <h5 className="text-lg font-medium p-4 border-b border-gray-200">Products / Service</h5>

                  <div className="p-4 bg-blue-50 border-b border-gray-200">
                    <span className="text-gray-700">Share Store link</span>
                    <a 
                      href={`https://paymeo.co/store/${companyData.company_id}`} 
                      className="copy-link ml-2 text-blue-600 hover:text-blue-800 break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://paymeo.co/store/{companyData.company_id}
                    </a>
                  </div>
                  
                  <ProductsList products={products} onProductUpdate={loadProducts} />
                </div>
              </div>
            </div>
          )}

          {/* Create Product Tab */}
          {activeTab === 'create' && (
            <div className="p-0">
              <div className="w-full">
                <div className="w-full relative overflow-hidden">
                  <CreateProduct onProductCreated={loadProducts} />
                </div>
              </div>
            </div>
          )}

          {/* Customers Tab */}
          {activeTab === 'customers' && (
            <div className="p-0">
              <div className="w-full">
                <div className="w-full relative overflow-hidden">
                  <CustomersList />
                </div>
              </div>
            </div>
          )}

          {/* Create Customer Tab */}
          {activeTab === 'create-customer' && (
            <div className="p-0">
              <div className="w-full">
                <div className="w-full relative overflow-hidden">
                  <CreateCustomer />
                </div>
              </div>
            </div>
          )}

          {/* Showcase Tab */}
          {activeTab === 'showcase' && (
            <div className="p-0">
              <div className="w-full">
                <div className="w-full relative overflow-hidden">
                  <h5 className="text-lg font-medium p-4 border-b border-gray-200">Showcase</h5>
                  <ComingSoon />
                </div>
              </div>
            </div>
          )}

          {/* Category Tab */}
          {activeTab === 'category' && (
            <div className="p-0">
              <div className="w-full">
                <div className="w-full relative overflow-hidden">
                  <CreateCategory />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
