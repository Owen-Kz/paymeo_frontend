import React, { useState } from 'react';
import { showToast } from '../../utils/helpers';

const NotificationSettings = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(user?.company_email || '');
  const [notificationSettings, setNotificationSettings] = useState({
    newsletter: false,
    emailNotifications: true
  });
  
  // Mock data - replace with actual user data
  const timeZone = user?.timeZone || 'Africa/Lagos (WAT)';

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleToggleChange = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save notification preferences
      const response = await fetch('/api/update-notification-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          ...notificationSettings
        })
      });

      const data = await response.json();
      if (data.success) {
        showToast('Notification settings saved successfully', 'success');
      } else {
        showToast(data.error || 'Failed to save notification settings', 'error');
      }
    } catch (error) {
      showToast('An error occurred while saving settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    setEmail(user?.company_email || '');
    setNotificationSettings({
      newsletter: false,
      emailNotifications: true
    });
    showToast('Changes cancelled', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Preferences Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Notification Preferences</h3>
          <p className="text-gray-600 mb-4 text-sm">
            Select the notifications you would like to receive via email. You cannot opt out of service messages.
          </p>
          
          <form className="mb-4">
            <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address*
            </label>
            <input
              type="email"
              id="companyEmail"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email address"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Required for notifications.</p>
          </form>
          
          <div className="space-y-3">
            {/* Newsletter Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 text-sm">Our newsletter</h4>
                  <p className="text-xs text-gray-600">Important changes and updates</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.newsletter}
                  onChange={() => handleToggleChange('newsletter')}
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Email Notifications Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 text-sm">Email Notification</h4>
                  <p className="text-xs text-gray-600">Get updates through email</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.emailNotifications}
                  onChange={() => handleToggleChange('emailNotifications')}
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Date & Time Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Date & Time</h3>
          <p className="text-gray-600 mb-4 text-sm">Time zones and calendar display settings.</p>
          
          <div className="p-4 bg-gray-50 rounded-lg mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Current Time Zone</p>
                <h4 className="font-semibold text-gray-800 text-sm">{timeZone}</h4>
              </div>
            </div>
            <button className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Change Time Zone
            </button>
          </div>

          {/* Additional Settings */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 text-sm mb-3">Calendar Settings</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Date Format</span>
                <span className="text-xs font-medium text-gray-800">DD/MM/YYYY</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Time Format</span>
                <span className="text-xs font-medium text-gray-800">12-hour</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Week Starts On</span>
                <span className="text-xs font-medium text-gray-800">Monday</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          onClick={handleCancel}
          className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;