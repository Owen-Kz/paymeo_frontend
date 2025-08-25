import React, { useState, useEffect } from "react";
import { showToast } from '../../utils/helpers';

const AddItemModal = ({ show, onHide, onAddItem, currency = 'NGN' }) => {
  const [activeTab, setActiveTab] = useState('existing'); // 'existing' or 'new'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    quantity: 1,
    price: 0,
    amount: 0,
  });

  // Mock existing products - replace with API call
  const existingProducts = [
    {
      id: 1,
      name: "Premium Web Design",
      description: "Custom responsive website design",
      price: 49999,
      category: "Digital Services"
    },
    {
      id: 2,
      name: "SEO Optimization Package",
      description: "Complete SEO optimization for your website",
      price: 29999,
      category: "Digital Services"
    },
    {
      id: 3,
      name: "Mobile App Development",
      description: "Cross-platform mobile application",
      price: 89999,
      category: "Development"
    },
    {
      id: 4,
      name: "Content Writing",
      description: "Professional content writing services",
      price: 15000,
      category: "Content"
    },
    {
      id: 5,
      name: "Social Media Management",
      description: "Monthly social media management package",
      price: 35000,
      category: "Marketing"
    }
  ];

  // Filter products based on search term
  const filteredProducts = existingProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto-calc amount for new item
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      amount: prev.quantity * prev.price,
    }));
  }, [formData.quantity, formData.price]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (show) {
      setFormData({
        description: "",
        quantity: 1,
        price: 0,
        amount: 0,
      });
      setSelectedProducts([]);
      setSearchTerm('');
      setActiveTab('existing');
    }
  }, [show]);

  const handleProductSelect = (product) => {
    setSelectedProducts(prev => {
      const existingIndex = prev.findIndex(p => p.id === product.id);
      
      if (existingIndex >= 0) {
        // Remove if already selected
        return prev.filter(p => p.id !== product.id);
      } else {
        // Add with default quantity of 1
        return [...prev, { ...product, selectedQuantity: 1 }];
      }
    });
  };

  const updateSelectedProductQuantity = (productId, quantity) => {
    setSelectedProducts(prev =>
      prev.map(product =>
        product.id === productId
          ? { ...product, selectedQuantity: Math.max(1, quantity) }
          : product
      )
    );
  };

  const isProductSelected = (productId) => {
    return selectedProducts.some(p => p.id === productId);
  };

  const getSelectedProduct = (productId) => {
    return selectedProducts.find(p => p.id === productId);
  };

  const handleAddSelectedProducts = () => {
    if (selectedProducts.length === 0) {
      showToast('Please select at least one product', 'error');
      return;
    }

    // Validate all selected products have valid quantities
    for (const product of selectedProducts) {
      if (product.selectedQuantity <= 0) {
        showToast(`Quantity for ${product.name} must be greater than 0`, 'error');
        return;
      }
    }

    // Add all selected products
    selectedProducts.forEach(product => {
      onAddItem({
        description: product.name,
        quantity: product.selectedQuantity,
        price: product.price,
        amount: product.selectedQuantity * product.price,
      });
    });

    onHide();
  };

  const handleSubmitNewItem = (e) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      showToast('Please enter a description', 'error');
      return;
    }

    if (formData.quantity <= 0) {
      showToast('Quantity must be greater than 0', 'error');
      return;
    }

    if (formData.price < 0) {
      showToast('Price cannot be negative', 'error');
      return;
    }

    onAddItem(formData);
    onHide();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getTotalSelectedAmount = () => {
    return selectedProducts.reduce((total, product) => {
      return total + (product.price * product.selectedQuantity);
    }, 0);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h5 className="text-lg font-semibold text-gray-800">Add Items</h5>
          <button
            type="button"
            onClick={onHide}
            className="text-gray-500 hover:text-gray-800 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            type="button"
            className={`flex-1 py-2 px-4 text-center font-medium ${
              activeTab === 'existing'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('existing')}
          >
            Select Existing Products
          </button>
          <button
            type="button"
            className={`flex-1 py-2 px-4 text-center font-medium ${
              activeTab === 'new'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('new')}
          >
            Create New Item
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {activeTab === 'existing' ? (
            <div className="flex-1 overflow-hidden flex">
              {/* Products List */}
              <div className="flex-1 overflow-hidden flex flex-col pr-4 border-r">
                {/* Search */}
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Products List */}
                <div className="flex-1 overflow-y-auto border rounded-lg divide-y">
                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p>No products found</p>
                      <p className="text-sm">Try a different search term</p>
                    </div>
                  ) : (
                    filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className={`p-4 cursor-pointer transition-colors ${
                          isProductSelected(product.id)
                            ? 'bg-blue-50 border-l-4 border-blue-600'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleProductSelect(product)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                                isProductSelected(product.id)
                                  ? 'bg-blue-600 border-blue-600'
                                  : 'border-gray-300'
                              }`}>
                                {isProductSelected(product.id) && (
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <h4 className="font-medium text-gray-900">{product.name}</h4>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 ml-8">{product.description}</p>
                            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full mt-2 ml-8">
                              {product.category}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">{formatCurrency(product.price)}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Selected Products Panel */}
              <div className="w-1/3 pl-4">
                <h3 className="font-medium text-gray-700 mb-3">Selected Items ({selectedProducts.length})</h3>
                
                {selectedProducts.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 border rounded-lg">
                    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p>No items selected</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedProducts.map((product) => (
                      <div key={product.id} className="border rounded-lg p-3 bg-white">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm text-gray-900">{product.name}</h4>
                          <button
                            type="button"
                            onClick={() => handleProductSelect(product)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label className="text-xs text-gray-600">Quantity:</label>
                          <input
                            type="number"
                            min="1"
                            value={product.selectedQuantity}
                            onChange={(e) => updateSelectedProductQuantity(product.id, parseInt(e.target.value) || 1)}
                            className="w-16 px-2 py-1 border rounded text-sm text-center"
                          />
                        </div>
                        
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">Price: {formatCurrency(product.price)}</span>
                          <span className="text-sm font-semibold">
                            {formatCurrency(product.price * product.selectedQuantity)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Total Summary */}
                {selectedProducts.length > 0 && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total:</span>
                      <span>{formatCurrency(getTotalSelectedAmount())}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleSubmitNewItem} className="space-y-4">
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                    placeholder="Enter item description"
                    className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })
                      }
                      required
                      className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ({currency})
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                      }
                      required
                      className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* Amount (read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Amount
                  </label>
                  <input
                    type="text"
                    value={formatCurrency(formData.amount)}
                    readOnly
                    className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600 shadow-sm cursor-not-allowed font-semibold"
                  />
                </div>
              </form>
            </div>
          )}

          {/* Footer buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t mt-4">
            <button
              type="button"
              onClick={onHide}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            
            {activeTab === 'existing' ? (
              <button
                type="button"
                onClick={handleAddSelectedProducts}
                disabled={selectedProducts.length === 0}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add {selectedProducts.length} Item{selectedProducts.length !== 1 ? 's' : ''}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitNewItem}
                disabled={!formData.description.trim() || formData.quantity <= 0 || formData.price < 0}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add New Item
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;