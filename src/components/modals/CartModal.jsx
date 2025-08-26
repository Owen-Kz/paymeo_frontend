// src/components/modals/CartModal.jsx
import React, { useState, useEffect } from 'react';
import { showToast } from '../../utils/helpers';

const CartModal = ({ show, onHide, cart, updateQuantity, removeFromCart, cartTotal, store }) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    additionalInfo: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('persistentCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Update parent component's cart state if needed
      } catch (error) {
        console.error('Error parsing saved cart:', error);
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

  if (!show) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    if (!customerInfo.name || !customerInfo.email) {
      showToast('Please fill in required fields (name and email)', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate API call to generate invoice
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate invoice content
      const invoiceContent = `
        INVOICE
        ========================
        Store: ${store.company_name}
        Date: ${new Date().toLocaleDateString()}
        
        CUSTOMER INFORMATION:
        Name: ${customerInfo.name}
        Email: ${customerInfo.email}
        Phone: ${customerInfo.phone || 'Not provided'}
        Address: ${customerInfo.address || 'Not provided'}
        
        ORDER ITEMS:
        ${cart.map(item => `
          - ${item.product_name} x${item.quantity}
          Price: ${item.currency === 'NGN' ? '₦' : '$'}${item.per_unit_cost.toLocaleString()} each
          Total: ${item.currency === 'NGN' ? '₦' : '$'}${(item.per_unit_cost * item.quantity).toLocaleString()}
        `).join('')}
        
        TOTAL: ${store.currency === 'NGN' ? '₦' : '$'}${cartTotal.toLocaleString()}
        
        Additional Information: ${customerInfo.additionalInfo || 'None'}
      `;

      // Send email to customer
      const emailSubject = `Your Invoice from ${store.company_name}`;
      const mailtoCustomer = `mailto:${customerInfo.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(invoiceContent)}`;
      window.location.href = mailtoCustomer;

      // Send email to store owner
      const storeEmailSubject = `New Order from ${customerInfo.name}`;
      const mailtoStore = `mailto:${store.contact_email || 'store@example.com'}?subject=${encodeURIComponent(storeEmailSubject)}&body=${encodeURIComponent(invoiceContent)}`;
      window.location.href = mailtoStore;

      showToast('Invoice generated and sent successfully!', 'success');
      
      // Clear cart from localStorage after successful checkout
      localStorage.removeItem('persistentCart');
      
      onHide();
      
    } catch (error) {
      showToast('Failed to process order', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
          <button onClick={onHide} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-600">Your cart is empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Customer Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-6 text-gray-900">Customer Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                    <input
                      type="text"
                      name="address"
                      value={customerInfo.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="Enter delivery address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Information</label>
                    <textarea
                      name="additionalInfo"
                      value={customerInfo.additionalInfo}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="Any special instructions or notes"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Cart Items */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Order Summary</h3>
                
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.product_name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-purple-100 flex items-center justify-center">
                              <span className="text-lg font-bold text-purple-800">
                                {item.product_name?.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{item.product_name}</h3>
                          <p className="text-purple-600 font-bold">
                            {item.currency === 'NGN' ? '₦' : '$'}{item.per_unit_cost.toLocaleString()} each
                          </p>
                          <div className="flex items-center space-x-3 mt-2">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                              >
                                -
                              </button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-lg font-bold text-purple-700">
                          {item.currency === 'NGN' ? '₦' : '$'}{(item.per_unit_cost * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total and Checkout */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-purple-700">
                      {store.currency === 'NGN' ? '₦' : '$'}{cartTotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 transition-colors shadow-md"
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : 'Proceed to Checkout'}
                    </button>
                    <button
                      onClick={onHide}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;