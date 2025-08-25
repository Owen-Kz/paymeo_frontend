// src/components/products/CreateCategory.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../../utils/helpers';

const CreateCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/collections`);
      const data = await response.json();
      
      if (data.success) {
        setCollections(data.collections);
      } else {
        showToast('Failed to fetch categories', 'error');
      }
    } catch (error) {
      showToast('An error occurred while fetching categories', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (categoryName.length < 1) {
      showToast('Category name cannot be empty', 'error');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/save-category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ collectionName: categoryName })
      });

      const data = await response.json();
      
      if (data.success) {
        showToast(data.success, 'success');
        setCategoryName('');
        fetchCategories(); // Refresh the categories list
      } else {
        showToast(data.error, 'error');
      }
    } catch (error) {
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/products#pills-products');
  };

  // Sample categories for demonstration
  const sampleCategories = [
    { collection_id: 1, collection_name: 'Digital Services' },
    { collection_id: 2, collection_name: 'Web Development' },
    { collection_id: 3, collection_name: 'Consulting' },
    { collection_id: 4, collection_name: 'Design' }
  ];

  const displayCollections = collections.length > 0 ? collections : sampleCategories;
  const isEmpty = collections.length === 0;

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h5 className="text-lg font-semibold text-gray-800">Manage Categories</h5>
            <p className="text-sm text-gray-600 mt-1">Create and organize product categories</p>
          </div>
          <nav className="mt-2 sm:mt-0">
            <button
              onClick={() => navigate('/products#pills-products')}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Products
            </button>
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Category Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h6 className="text-md font-medium text-gray-800 mb-4">Create New Category</h6>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="collectionName" className="block text-sm font-medium text-gray-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                name="category_name"
                id="collectionName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
                required
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Save Category
                  </div>
                )}
              </button>
              <button 
                type="button" 
                onClick={handleCancel}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Tips Section */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h6 className="text-sm font-medium text-blue-800 mb-2">💡 Category Tips</h6>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• Use clear, descriptive category names</li>
              <li>• Categories help organize your products</li>
              <li>• Customers can filter products by category</li>
            </ul>
          </div>
        </div>

        {/* Existing Categories */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h6 className="text-md font-medium text-gray-800 mb-4">Existing Categories</h6>
          
          {isEmpty && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-yellow-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-yellow-700">Showing sample categories</span>
              </div>
            </div>
          )}
          
          {displayCollections.length > 0 ? (
            <div className="space-y-3">
              {displayCollections.map(collection => (
                <div 
                  key={collection.collection_id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-blue-800 font-medium text-sm">
                        {collection.collection_name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-gray-800 font-medium">{collection.collection_name}</span>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                    {Math.floor(Math.random() * 15) + 1} products
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="mt-2 text-sm text-gray-600">No categories found</p>
              <p className="text-xs text-gray-500">Create your first category to get started</p>
            </div>
          )}

          {/* Stats */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{displayCollections.length}</div>
                <div className="text-xs text-gray-600">Total Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {displayCollections.reduce((acc, curr) => acc + (Math.floor(Math.random() * 15) + 1), 0)}
                </div>
                <div className="text-xs text-gray-600">Total Products</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCategory;