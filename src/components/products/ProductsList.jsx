import React, { useState } from 'react';
import { showToast } from '../../utils/helpers';
import api from '../../utils/api';

const ProductsList = ({ products = [], onProductUpdate }) => {
  const [imageErrors, setImageErrors] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'details'
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [isCopying, setIsCopying] = useState(false);

  // Ensure products is always an array
  const safeProducts = Array.isArray(products) ? products : [];
  const isEmpty = safeProducts.length === 0;

  const handleDelete = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        const response = await api.delete(`/products/${productId}`);
        
        if (response.ok) {
          showToast('Product deleted successfully', 'success');
          onProductUpdate?.();
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
    showToast('Edit functionality coming soon!', 'info');
  };

  const handleShareProduct = (product) => {
    // Generate shareable link (in a real app, this would come from your backend)
    const baseUrl = window.location.origin;
    const productLink = `${baseUrl}/product/${product.slug || product.product_id}`;
    
    setShareLink(productLink);
    setShowShareModal(true);
  };

  const copyToClipboard = async () => {
    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(shareLink);
      showToast('Link copied to clipboard!', 'success');
      setTimeout(() => setIsCopying(false), 2000);
    } catch (err) {
      showToast('Failed to copy link', 'error');
      setIsCopying(false);
    }
  };

  const shareViaWhatsApp = () => {
    const message = `Check out this product: ${shareLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareViaEmail = () => {
    const subject = `Check out this product: ${selectedProduct?.product_name || 'Amazing Product'}`;
    const body = `I thought you might be interested in this product:\n\n${shareLink}\n\n${selectedProduct?.description || ''}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  // Share Modal Component
  const ShareModal = ({ show, onClose, link, product }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Share Product</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Share this product with others:</p>
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="text"
                value={link}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Generating link..."
              />
              <button
                onClick={copyToClipboard}
                disabled={isCopying}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  isCopying
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } transition-colors`}
              >
                {isCopying ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Share via:</p>
            <div className="flex space-x-3">
              <button
                onClick={shareViaWhatsApp}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.864 3.488"/>
                </svg>
                WhatsApp
              </button>
              <button
                onClick={shareViaEmail}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Product Details View Component
  const ProductDetails = ({ product, onBack }) => {
    if (!product) {
      return (
        <div className="bg-white rounded-lg shadow-lg p-6">
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
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">Product not found</p>
          </div>
        </div>
      );
    }

    const hasImage = product.image && !imageErrors[product.id];
    const formattedDate = product.created_at ? new Date(product.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'N/A';

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
              onClick={() => handleDelete(product.id, product.product_name)}
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
                alt={product.product_name || 'Product'}
                onError={() => handleImageError(product.id)}
              />
            ) : (
              <div className="w-full h-64 lg-h-80 bg-blue-100 rounded-lg shadow-md flex items-center justify-center">
                <span className="text-6xl font-bold text-blue-800">
                  {(product.product_name || 'P').charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.product_name || 'Unnamed Product'}</h1>
            
            <div className="mb-6">
              <span className="text-2xl font-bold text-blue-600">
                ₦{(product.per_unit_cost || 0)?.toLocaleString()}
              </span>
              <span className="ml-2 text-sm text-gray-500">{product.currency || 'NGN'}</span>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description || 'No description available'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500">SKU</h4>
                <p className="text-gray-900 font-medium">{product.product_id || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Category</h4>
                <p className="text-gray-900 font-medium">{product.category || 'Uncategorized'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Stock</h4>
                <p className="text-gray-900 font-medium">{product.inventory - product.total_sold || 0} of {product.inventory || 0} available</p>
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
              <button 
                onClick={() => handleShareProduct(product)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Share Product
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // If we're in details view, show the product details
  if (viewMode === 'details') {
    return (
      <>
        <ProductDetails product={selectedProduct} onBack={handleBackToList} />
        <ShareModal 
          show={showShareModal} 
          onClose={() => setShowShareModal(false)} 
          link={shareLink} 
          product={selectedProduct} 
        />
      </>
    );
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
                No Products
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>You haven't added any products yet. Create your first product to get started.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!isEmpty && (
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
              {safeProducts.map((product) => {
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
                              alt={product.product_name || 'Product'}
                              onError={() => handleImageError(product.id)}
                            />
                          ) : (
                            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="font-medium text-blue-800">
                                {(product.product_name || 'P').charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.product_name || 'Unnamed Product'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {product.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        ₦{(product.per_unit_cost || 0)?.toLocaleString()}
                      </div>
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
                            handleDelete(product.id, product.product_name || 'this product');
                          }}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
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
      )}
      
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

      {/* Share Modal */}
      <ShareModal 
        show={showShareModal} 
        onClose={() => setShowShareModal(false)} 
        link={shareLink} 
        product={selectedProduct} 
      />
    </div>
  );
};

export default ProductsList;