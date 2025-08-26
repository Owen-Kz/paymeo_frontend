// src/pages/StorePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from "axios";
import { showToast } from '../utils/helpers';
import StoreFrontFooter from '../components/store/footer';
import ContactStoreModal from '../components/modals/ContactStoreModal';
import CartModal from '../components/modals/CartModal';
import Header from '../components/store/header';
import ShareStoreModal from '../components/modals/ShareProductModal';

const StorePage = () => {
  const { companyId } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const categoriesScrollRef = useRef(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [cart, setCart] = useState([]);
  const [showShareStoreModal, setShowShareStoreModal] = useState(false);
  const baseUrl = window.location.origin;
  const shareLink = `${baseUrl}/store/${companyId}`;
  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem(`persistentCart_${companyId}`);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Error parsing saved cart:', error);
        // If there's an error, clear the invalid cart data
        localStorage.removeItem(`persistentCart_${companyId}`);
      }
    }
  }, [companyId]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem(`persistentCart_${companyId}`, JSON.stringify(cart));
    } else {
      localStorage.removeItem(`persistentCart_${companyId}`);
    }
  }, [cart, companyId]);

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
    const fetchStoreData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/store/v3/${companyId}`);
        if (response.data.success) {
          setStore(response.data.store);
          setProducts(response.data.products || []);
          setFilteredProducts(response.data.products || []);
          
          const uniqueCategories = [...new Set(response.data.products.map(p => p.category).filter(Boolean))];
          setCategories(uniqueCategories);
        } else {
          showToast('Store not found', 'error');
        }
      } catch (error) {
        console.error('Error fetching store data:', error);
        showToast('Failed to load store', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    if (companyId) {
      fetchStoreData();
    }
  }, [companyId]);

  // Filter and sort products
  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    switch (sortBy) {
      case 'price-low':
        filtered = [...filtered].sort((a, b) => (a.per_unit_cost || 0) - (b.per_unit_cost || 0));
        break;
      case 'price-high':
        filtered = [...filtered].sort((a, b) => (b.per_unit_cost || 0) - (a.per_unit_cost || 0));
        break;
      case 'name':
        filtered = [...filtered].sort((a, b) => (a.product_name || '').localeCompare(b.product_name || ''));
        break;
      case 'newest':
      default:
        filtered = [...filtered].sort((a, b) => new Date(b.date_uploaded || 0) - new Date(a.date_uploaded || 0));
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, selectedCategory, sortBy]);

  const scrollCategories = (direction) => {
    if (categoriesScrollRef.current) {
      const scrollAmount = 200;
      categoriesScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const formatCurrency = (amount, currency = 'NGN') => {
    if (!amount) return '₦0.00';
    const safeCurrency = currency || 'NGN';
    try {
      const options = { style: 'currency', currency: safeCurrency, minimumFractionDigits: 2, maximumFractionDigits: 2 };
      const locale = safeCurrency === 'NGN' ? 'en-NG' : 'en-US';
      return new Intl.NumberFormat(locale, options).format(amount);
    } catch (error) {
      return safeCurrency === 'NGN' ? `₦${amount.toFixed(2)}` : `$${amount.toFixed(2)}`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Store Not Found</h1>
          <p className="text-gray-600 mb-8">The store you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
    <Header setShowCartModal={setShowCartModal} setShowContactModal={setShowContactModal} cartItemCount={cartItemCount} setShowShareStoreModal={setShowShareStoreModal} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Store Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            <div className="flex-shrink-0">
              {store.company_logo ? (
                <img
                  src={store.company_logo}
                  alt={store.company_name}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {store.company_name?.charAt(0) || 'S'}
                </div>
              )}
            </div>

            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {store.company_name || 'Unknown Store'}
              </h1>
              
              <p className="text-gray-600 mb-4 max-w-2xl">
                {store.company_description || 'No description available.'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <span className="text-sm text-gray-500">Total Products</span>
                  <p className="text-lg font-semibold text-gray-900">{products.length}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Categories</span>
                  <p className="text-lg font-semibold text-gray-900">{categories.length}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Member Since</span>
                  <p className="text-lg font-semibold text-gray-900">
                    {store.date_created ? new Date(store.date_created).getFullYear() : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Cart Items</span>
                  <p className="text-lg font-semibold text-gray-900">{cartItemCount}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => setShowContactModal(true)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
                >
                  Contact Store
                </button>
                <button onClick={() => setShowShareStoreModal(true)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Share Store
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                    selectedCategory === 'all'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Categories
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Mobile Categories Scroll */}
            <div className="lg:hidden bg-white rounded-lg shadow-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Categories</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => scrollCategories('left')}
                    className="p-1 bg-gray-100 rounded-full hover:bg-gray-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => scrollCategories('right')}
                    className="p-1 bg-gray-100 rounded-full hover:bg-gray-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              <div
                ref={categoriesScrollRef}
                className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar"
              >
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === 'all'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  All
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort and Results Count */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Sort By</label>
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none cursor-pointer shadow-sm"
                      >
                        <option value="newest">Newest First</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="name">Alphabetical</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg px-4 py-3 border border-blue-100">
                  <p className="text-sm font-medium text-blue-800">
                    Showing <span className="font-bold">{filteredProducts.length}</span> of{' '}
                    <span className="font-bold">{products.length}</span> products
                  </p>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {currentProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {currentProducts.map((product) => (
                    <div
                      key={product.id || product.product_id}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4"
                    >
                      <div className="h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                        {product.image ? (
                          <img
                            className="w-full h-full object-cover"
                            src={product.image}
                            alt={product.product_name}
                          />
                        ) : (
                          <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                            <span className="text-2xl font-bold text-blue-800">
                              {product.product_name?.charAt(0) || 'P'}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                        {product.product_name}
                      </h3>
                      
                      <p className="text-blue-600 font-bold text-lg mb-2">
                        {formatCurrency(product.per_unit_cost, product.currency)}
                      </p>
                      
                      {product.category && (
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mb-2">
                          {product.category}
                        </span>
                      )}
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description || 'No description available'}
                      </p>
                      
                      <div className="flex space-x-2">
                        <Link
                          to={`/product/${product.product_id || product.id}`}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded text-center hover:from-blue-600 hover:to-purple-700 transition-colors"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => addToCart(product)}
                          className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = currentPage <= 3 ? i + 1 : 
                                    currentPage >= totalPages - 2 ? totalPages - 4 + i : 
                                    currentPage - 2 + i;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 border rounded-lg text-sm ${
                              currentPage === page
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-600'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-8m8 0h-8m-8 0H4m0 0v5a2 2 0 002 2h2a2 2 0 002-2v-5m-4 0h8" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">
                  {selectedCategory !== 'all' 
                    ? `No products found in the "${selectedCategory}" category.`
                    : 'This store has no products yet.'
                  }
                </p>
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
                  >
                    Show All Products
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <StoreFrontFooter />
      <ContactStoreModal
        show={showContactModal}
        onHide={() => setShowContactModal(false)}
        store={store}
      />
      <CartModal
        show={showCartModal}
        onHide={() => setShowCartModal(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        cartTotal={cartTotal}
        store={store}
      />
           <ShareStoreModal 
          show={showShareStoreModal} 
          onClose={() => setShowShareStoreModal(false)} 
          link={shareLink} 
          product={store} 
        />
    </div>
  );
};

export default StorePage;