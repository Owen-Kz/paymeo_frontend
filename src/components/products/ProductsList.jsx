import React, { useState } from 'react';
import { showToast } from '../../utils/helpers';

const ProductsList = ({ products, onProductUpdate }) => {
  const [imageErrors, setImageErrors] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'details'

  const handleDelete = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/products/${productId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          showToast('Product deleted successfully', 'success');
          onProductUpdate();
          // If we're viewing the deleted product, close the details view
          if (selectedProduct?.id === productId) {
            setSelectedProduct(null);
            setViewMode('list');
          }
        } else {
          throw new Error('Failed to delete product');
        }
      } catch (error) {
        showToast('Failed to delete product', 'error');
      }
    }
  };

  const handleImageError = (productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setViewMode('details');
  };

  const handleBackToList = () => {
    setSelectedProduct(null);
    setViewMode('list');
  };

  const handleEditProduct = (product) => {
    // This would typically open a modal or navigate to edit page
    showToast('Edit functionality coming soon!', 'info');
  };

  // Sample dummy data for demonstration
  const dummyProducts = [
    {
      id: 1,
      name: 'Premium Web Design',
      description: 'Custom responsive website design with modern UI/UX principles. Includes 5 pages, contact forms, and basic SEO setup. Perfect for small businesses looking to establish their online presence.',
      price: 49999,
      currency: 'NGN',
      category: 'Digital Services',
      image: 'https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      sku: 'WEB-001',
      stock: 999,
      created_at: '2023-10-15T10:30:00Z'
    },
    {
      id: 2,
      name: 'SEO Optimization Package',
      description: 'Complete SEO optimization for your website including keyword research, on-page optimization, technical SEO audit, and monthly performance reports.',
      price: 29999,
      currency: 'NGN',
      category: 'Digital Services',
      image: null, // No image to test fallback
      sku: 'SEO-001',
      stock: 999,
      created_at: '2023-10-16T14:20:00Z'
    },
    {
      id: 3,
      name: 'Mobile App Development',
      description: 'Cross-platform mobile application development using React Native. Includes UI/UX design, backend integration, and app store deployment.',
      price: 89999,
      currency: 'NGN',
      category: 'Development',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      sku: 'APP-001',
      stock: 5,
      created_at: '2023-10-10T09:15:00Z'
    }
  ];

  const displayProducts = products.length > 0 ? products : dummyProducts;
  const isEmpty = products.length === 0;

  // Product Details View Component
  const ProductDetails = ({ product, onBack }) => {
    const hasImage = product.image && !imageErrors[product.id];
    const formattedDate = new Date(product.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Products
          </button>
          <div className="flex space-x-3">
            <button
              onClick={() => handleEditProduct(product)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Product
            </button>
            <button
              onClick={() => handleDelete(product.id, product.name)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Product Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div>
            {hasImage ? (
              <img
                className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-md"
                src={product.image}
                alt={product.name}
                onError={() => handleImageError(product.id)}
              />
            ) : (
              <div className="w-full h-64 lg:h-80 bg-blue-100 rounded-lg shadow-md flex items-center justify-center">
                <span className="text-6xl font-bold text-blue-800">
                  {product.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="mb-6">
              <span className="text-2xl font-bold text-blue-600">
                ₦{product.price?.toLocaleString()}
              </span>
              <span className="ml-2 text-sm text-gray-500">{product.currency}</span>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500">SKU</h4>
                <p className="text-gray-900 font-medium">{product.sku || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Category</h4>
                <p className="text-gray-900 font-medium">{product.category || 'Uncategorized'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Stock</h4>
                <p className="text-gray-900 font-medium">{product.stock} available</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Added On</h4>
                <p className="text-gray-900 font-medium">{formattedDate}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Add to Invoice
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Share Product
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // If we're in details view, show the product details
  if (viewMode === 'details' && selectedProduct) {
    return <ProductDetails product={selectedProduct} onBack={handleBackToList} />;
  }

  // Otherwise, show the list view
  return (
    <div className="p-6">
      {isEmpty && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Demo Mode
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>You're viewing sample products. Add your own products to see them here.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayProducts.map((product) => {
              const hasImage = product.image && !imageErrors[product.id];
              
              return (
                <tr 
                  key={product.id} 
                  className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                  onClick={() => handleViewDetails(product)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {hasImage ? (
                          <img 
                            className="h-10 w-10 rounded-lg object-cover"
                            src={product.image}
                            alt={product.name}
                            onError={() => handleImageError(product.id)}
                          />
                        ) : (
                          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="font-medium text-blue-800">
                              {product.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{product.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">₦{product.price?.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {product.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(product);
                        }}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(product.id, product.name);
                        }}
                        disabled={isEmpty}
                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white ${
                          isEmpty 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                        } transition-colors`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {isEmpty && (
        <div className="mt-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-8m8 0h-8m-8 0H4m0 0v5a2 2 0 002 2h2a2 2 0 002-2v-5m-4 0h8" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first product.</p>
          <div className="mt-6">
            <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Product
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsList;