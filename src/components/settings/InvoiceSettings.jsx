import React, { useState, useEffect } from 'react';
import { showToast } from '../../utils/helpers';

const InvoiceSettings = ({ user }) => {
  const [brandDetails, setBrandDetails] = useState({
    primary_color: user?.brandData?.primary_color || '#4e73df',
    secondary_color: user?.brandData?.secondary_color || '#6c757d',
    display_account_number_on_invoice: user?.brandData?.display_account_number_on_invoice || 'no'
  });

  const [accountDetails, setAccountDetails] = useState({
    accountName: user?.bankDetails?.account_name || '',
    accountNumber: user?.bankDetails?.account_number || '',
    bankName: user?.bankDetails?.bank_name || '',
    bankAddress: user?.bankDetails?.bank_address || '',
    swiftCode: user?.bankDetails?.swift_code || ''
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch brand details if not passed in props
    if (!user?.brandData) {
      fetchBrandDetails();
    }
    
    // Fetch bank details if not passed in props
    if (!user?.bankDetails) {
      fetchBankDetails();
    }
  }, []);

  const fetchBrandDetails = async () => {
    try {
      const response = await fetch('/api/brand-details');
      const data = await response.json();
      if (data.success) {
        setBrandDetails(data.brandDetails);
      }
    } catch (error) {
      showToast('Failed to load brand details', 'error');
    }
  };

  const fetchBankDetails = async () => {
    try {
      const response = await fetch('/api/bank-details');
      const data = await response.json();
      if (data.success) {
        setAccountDetails(data.bankDetails);
      }
    } catch (error) {
      showToast('Failed to load bank details', 'error');
    }
  };

  const handleColorChange = (colorType, value) => {
    setBrandDetails(prev => ({
      ...prev,
      [colorType]: value
    }));
  };

  const handleRadioChange = (e) => {
    setBrandDetails(prev => ({
      ...prev,
      display_account_number_on_invoice: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/update-brand-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(brandDetails)
      });

      const data = await response.json();
      if (data.success) {
        showToast('Brand settings updated successfully!', 'success');
      } else {
        showToast(data.error || 'Failed to update brand settings', 'error');
      }
    } catch (error) {
      showToast('An error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Branding</h3>
        <p className="text-gray-500 mb-6">To change your invoice appearance, edit and save from here</p>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Color */}
            <div>
              <label htmlFor="primary_color" className="block text-sm font-medium text-gray-700 mb-2">
                Select Primary Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="primary_color"
                  className="w-12 h-12 p-1 border border-gray-300 rounded cursor-pointer"
                  value={brandDetails.primary_color}
                  onChange={(e) => handleColorChange('primary_color', e.target.value)}
                  disabled={isLoading}
                />
                <input
                  type="text"
                  id="primary_color_text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={brandDetails.primary_color}
                  onChange={(e) => handleColorChange('primary_color', e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Secondary Color */}
            <div>
              <label htmlFor="secondary_color" className="block text-sm font-medium text-gray-700 mb-2">
                Select Secondary Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="secondary_color"
                  className="w-12 h-12 p-1 border border-gray-300 rounded cursor-pointer"
                  value={brandDetails.secondary_color}
                  onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                  disabled={isLoading}
                />
                <input
                  type="text"
                  id="secondary_color_text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={brandDetails.secondary_color}
                  onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Account Number Display */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Show Account Number on Invoice
            </label>
            
            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="show_account_number"
                  value="no"
                  checked={brandDetails.display_account_number_on_invoice === 'no'}
                  onChange={handleRadioChange}
                  className="text-blue-600 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <span className="text-gray-700">No</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="show_account_number"
                  value="yes"
                  checked={brandDetails.display_account_number_on_invoice === 'yes'}
                  onChange={handleRadioChange}
                  className="text-blue-600 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <span className="text-gray-700">Yes</span>
              </label>
            </div>

            {/* Account Details */}
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-gray-800 mb-3">Current Account Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {accountDetails.accountName && (
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Account Name</p>
                    <p className="font-medium text-gray-800">{accountDetails.accountName}</p>
                  </div>
                )}
                
                {accountDetails.accountNumber && (
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Account Number</p>
                    <p className="font-medium text-gray-800">{accountDetails.accountNumber}</p>
                  </div>
                )}
                
                {accountDetails.bankName && (
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Bank Name</p>
                    <p className="font-medium text-gray-800">{accountDetails.bankName}</p>
                  </div>
                )}
                
                {accountDetails.bankAddress && (
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Bank Address</p>
                    <p className="font-medium text-gray-800">{accountDetails.bankAddress}</p>
                  </div>
                )}
                
                {accountDetails.swiftCode && (
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Swift Code</p>
                    <p className="font-medium text-gray-800">{accountDetails.swiftCode}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceSettings;