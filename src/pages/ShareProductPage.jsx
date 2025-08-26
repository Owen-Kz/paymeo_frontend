// src/pages/SharedProductPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { showToast } from '../utils/helpers';
import axios from "axios"
import StoreFrontFooter from '../components/store/footer';
import ContactStoreModal from '../components/modals/ContactStoreModal';
import Header from '../components/store/header';
import CartModal from '../components/modals/CartModal';
import ShareStoreModal from '../components/modals/ShareProductModal';

const SharedProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [companyData, setCompany] = useState([]);
  const [otherProducts, setOtherProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [cart, setCart] = useState([]);
  const [showShareStoreModal, setShowShareStoreModal] = useState(false);
  const baseUrl = window.location.origin;
  const shareLink = `${baseUrl}/store/${companyData.company_id}`;

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('persistentCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Error parsing saved cart:', error);
        // Clear invalid cart data
        localStorage.removeItem('persistentCart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('persistentCart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('persistentCart');
    }
  }, [cart]);

  // Add to cart function
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    showToast('Product added to cart!', 'success');
  };

  // Remove from cart function
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    showToast('Product removed from cart', 'info');
  };

  // Update quantity function
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => {
    return total + (item.per_unit_cost * item.quantity);
  }, 0);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true);
        // Fetch the specific product with other products from the same seller
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/products/shared/v3/${productId}`);
        
        if (response.data.success) {
          setProduct(response.data.product);
          setCompany(response.data.company || []);
          
          // Set the other products from the same seller (already included in the response)
          if (response.data.otherProducts) {
            setOtherProducts(response.data.otherProducts);
          }
        } else {
          showToast('Product not found', 'error');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        showToast('Failed to load product', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  const handleImageError = () => {
    setImageError(true);
  };

  const formatCurrency = (amount, currency = 'NGN') => {
    if (!amount) return currency === 'NGN' ? '₦0.00' : '$0.00';
    
    const options = {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    };
    
    return new Intl.NumberFormat(currency === 'NGN' ? 'en-NG' : 'en-US', options).format(amount);
  };

  // Safe access to product properties
  const getProductName = () => product?.product_name || 'Unnamed Product';
  const getProductDescription = () => product?.description || 'No description available.';
  const getProductPrice = () => product?.per_unit_cost || 0;
  const getProductCurrency = () => product?.currency || 'NGN';
  const getProductCategory = () => product?.category || 'Uncategorized';
  const getProductId = () => product?.product_id || 'N/A';
  const getProductImage = () => product?.image || null;
  const getAvailableStock = () => (product?.inventory || 0) - (product?.total_sold || 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const availableStock = getAvailableStock();
  const displayProducts = showAllProducts ? otherProducts : otherProducts.slice(0, 3);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header 
          setShowCartModal={setShowCartModal} 
          setShowContactModal={setShowContactModal} 
          cartItemCount={cartItemCount} 
          setShowShareStoreModal={setShowShareStoreModal} 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Main Product */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Product Image */}
              <div>
                {getProductImage() && !imageError ? (
                  <img
                    className="w-full h-96 object-cover rounded-lg shadow-md"
                    src={getProductImage()}
                    alt={getProductName()}
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-full h-96 bg-blue-100 rounded-lg shadow-md flex items-center justify-center">
                    <span className="text-6xl font-bold text-blue-800">
                      {getProductName().charAt(0) || 'P'}
                    </span>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {getProductName()}
                </h1>

                <div className="mb-6">
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(getProductPrice(), getProductCurrency())}
                  </span>
                  {getProductCurrency() && (
                    <span className="ml-2 text-sm text-gray-500">{getProductCurrency()}</span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    availableStock > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {availableStock > 0 ? `${availableStock} in stock` : 'Out of stock'}
                  </span>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {getProductDescription()}
                  </p>
                </div>

                {/* Product Specifications */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">SKU</h4>
                    <p className="text-gray-900 font-medium">{getProductId()}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Category</h4>
                    <p className="text-gray-900 font-medium">{getProductCategory()}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button 
                    onClick={() => addToCart(product)} 
                    disabled={availableStock <= 0}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => setShowContactModal(true)} 
                    className="flex-1 border border-blue-600 text-blue-600 py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
                  >
                    Contact Seller
                  </button>
                </div>

                {/* Seller info */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Seller Information</h4>
                  <p className="text-gray-700">
                    <button onClick={() => navigate(`/store/${companyData.company_id}`)}>{companyData.company_name}
                    <i className="px-2 bi bi-link"></i>
                    </button>
                  </p>
                 
                </div>
              </div>
            </div>
          </div>

          {/* Seller's Other Products */}
          {otherProducts.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  More from us
                </h2>
                {otherProducts.length > 3 && (
                  <button
                    onClick={() => setShowAllProducts(!showAllProducts)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {showAllProducts ? 'Show Less' : `View All (${otherProducts.length})`}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayProducts.map((relatedProduct, index) => {
                  const relatedAvailableStock = (relatedProduct.inventory || 0) - (relatedProduct.total_sold || 0);
                  
                  return (
                    <div
                      key={relatedProduct.id || relatedProduct.product_id || index}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                        {relatedProduct.image ? (
                          <img
                            className="w-full h-full object-cover"
                            src={relatedProduct.image}
                            alt={relatedProduct.product_name || 'Product'}
                          />
                        ) : (
                          <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                            <span className="text-2xl font-bold text-blue-800">
                              {(relatedProduct.product_name || 'P').charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                        {relatedProduct.product_name || 'Unnamed Product'}
                      </h3>
                      
                      <p className="text-blue-600 font-bold text-lg mb-2">
                        {formatCurrency(relatedProduct.per_unit_cost || 0, relatedProduct.currency || 'NGN')}
                      </p>
                      
                      <div className="mb-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          relatedAvailableStock > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {relatedAvailableStock > 0 ? `${relatedAvailableStock} in stock` : 'Out of stock'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {relatedProduct.description || 'No description available'}
                      </p>
                      
                      <div className="flex space-x-2">
                        <Link
                          to={`/product/${relatedProduct.product_id || relatedProduct.id || ''}`}
                          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded text-center hover:bg-gray-200 transition-colors"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => addToCart(relatedProduct)}
                          disabled={relatedAvailableStock <= 0}
                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-center mt-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              Interested in this product?
            </h2>
            <p className="text-blue-100 mb-6">
              Contact the seller directly for purchasing information and bulk orders.
            </p>
            <button 
              onClick={() => setShowContactModal(true)}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Contact Seller Now
            </button>
          </div>
        </div>

        {/* Footer */}
        <StoreFrontFooter />
      </div>
      
      <ContactStoreModal
        show={showContactModal}
        onHide={() => setShowContactModal(false)}
        store={companyData}
        product={product}
      />

      <CartModal
        show={showCartModal}
        onHide={() => setShowCartModal(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        cartTotal={cartTotal}
        store={companyData}
      />
      
      <ShareStoreModal 
        show={showShareStoreModal} 
        onClose={() => setShowShareStoreModal(false)} 
        link={shareLink} 
        product={companyData} 
      />
    </>
  );
};

export default SharedProductPage;