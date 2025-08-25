import React, { useState, useRef } from 'react';
import { showToast } from '../../utils/helpers';

const AccountSettings = ({ user }) => {
  const [formData, setFormData] = useState({
    fullname: user?.username || '',
    email: user?.company_email || '',
    website: user?.company_website || '',
    reg_number: user?.company_reg_number || '',
    company: user?.company_name || '',
    currency: user?.currency || '',
    phonenumber: user?.company_phone || '',
    call_back_url: user?.callback_url || '',
    address: user?.company_address || ''
  });

  const profileInputRef = useRef(null);
  const signatureInputRef = useRef(null);
  const [profilePreview, setProfilePreview] = useState(user?.company_logo || '');
  const [signaturePreview, setSignaturePreview] = useState(user?.company_signature || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleProfileUpload = () => {
    profileInputRef.current?.click();
  };

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (800KB max)
      if (file.size > 800 * 1024) {
        showToast('File size must be less than 800KB', 'error');
        return;
      }
      
      // Check file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        showToast('Only JPG, PNG, and GIF files are allowed', 'error');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Upload the file
      uploadFile(file, 'profile');
    }
  };

  const handleSignatureUpload = () => {
    signatureInputRef.current?.click();
  };

  const handleSignatureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (800KB max)
      if (file.size > 800 * 1024) {
        showToast('File size must be less than 800KB', 'error');
        return;
      }
      
      // Check file type
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        showToast('Only PNG and JPG files are allowed for signatures', 'error');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setSignaturePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Upload the file
      uploadFile(file, 'signature');
    }
  };

  const uploadFile = async (file, type) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/update${type === 'profile' ? 'ProfilePicture' : 'Signature'}`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        showToast(`${type === 'profile' ? 'Profile picture' : 'Signature'} updated successfully!`, 'success');
      } else {
        showToast(data.error || `Failed to update ${type}`, 'error');
      }
    } catch (error) {
      showToast('An error occurred during upload', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/updatePersonalDetails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        showToast('Personal details updated successfully!', 'success');
      } else {
        showToast(data.error || 'Failed to update details', 'error');
      }
    } catch (error) {
      showToast('An error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Logo Upload Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Company Logo</h3>
          <p className="text-gray-500 mb-4">Change your Company Logo from here</p>
          <div className="text-center">
            <div className="mb-4">
              <div className="w-32 h-32 mx-auto rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Company logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
            </div>
            <input
              ref={profileInputRef}
              type="file"
              accept=".png, .jpg, .jpeg, .gif"
              className="hidden"
              onChange={handleProfileChange}
              disabled={isLoading}
            />
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleProfileUpload}
              disabled={isLoading}
            >
              {isLoading ? 'Uploading...' : 'Upload Logo'}
            </button>
            <p className="text-sm text-gray-500 mt-3">Allowed JPG, GIF or PNG. Max size of 800KB</p>
          </div>
        </div>

        {/* Signature Upload Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Digital Signature</h3>
          <p className="text-gray-500 mb-4">Upload a new Signature</p>
          <div className="text-center">
            <div className="mb-4">
              <div className="w-32 h-32 mx-auto bg-white flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 rounded-lg">
                {signaturePreview ? (
                  <img
                    src={signaturePreview}
                    alt="Signature"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                )}
              </div>
            </div>
            <input
              ref={signatureInputRef}
              type="file"
              accept=".png, .jpg, .jpeg"
              className="hidden"
              onChange={handleSignatureChange}
              disabled={isLoading}
            />
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSignatureUpload}
              disabled={isLoading}
            >
              {isLoading ? 'Uploading...' : 'Upload Signature'}
            </button>
            <p className="text-sm text-gray-500 mt-3">Allowed PNG or JPG. Max size of 800KB</p>
          </div>
        </div>
      </div>

      {/* Personal Details Form */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Personal Details</h3>
        <p className="text-gray-500 mb-6">To change your personal detail, edit and save from here</p>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  id="fullname"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Company Website</label>
                <input
                  type="text"
                  id="website"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={formData.website}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label htmlFor="reg_number" className="block text-sm font-medium text-gray-700 mb-1">Company Reg. Number</label>
                <input
                  type="text"
                  id="reg_number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={formData.reg_number}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  id="company"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={formData.company}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select
                  id="currency"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-100"
                  value={formData.currency}
                  onChange={handleInputChange}
                  disabled
                >
                  <option value={formData.currency}>{formData.currency}</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Currency cannot be changed after registration</p>
              </div>
              
              <div>
                <label htmlFor="phonenumber" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  id="phonenumber"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={formData.phonenumber}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="call_back_url" className="block text-sm font-medium text-gray-700 mb-1">Callback URL</label>
              <input
                type="text"
                id="call_back_url"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={formData.call_back_url}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="https://example.com/callback"
              />
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                id="address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={formData.address}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
          </div>
          
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

export default AccountSettings;