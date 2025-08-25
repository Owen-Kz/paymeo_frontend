import React, { useState } from 'react';
import { showToast } from '../../utils/helpers';

const SecuritySettings = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [linkedDevices, setLinkedDevices] = useState([
    {
      id: 1,
      device_type: "Desktop",
      device_name: "Macbook Pro",
      location: "Lagos, Nigeria",
      last_login: "2 hours ago"
    },
    {
      id: 2,
      device_type: "Mobile",
      device_name: "iPhone 13 Pro",
      location: "Abuja, Nigeria",
      last_login: "5 hours ago"
    }
  ]);

  const handleSignOutAll = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/sign-out-all-devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        showToast('Signed out from all devices successfully', 'success');
        setLinkedDevices([]);
      } else {
        showToast(data.error || 'Failed to sign out from devices', 'error');
      }
    } catch (error) {
      showToast('An error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDevice = async (deviceId) => {
    try {
      const response = await fetch('/api/remove-device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deviceId })
      });

      const data = await response.json();
      if (data.success) {
        showToast('Device removed successfully', 'success');
        setLinkedDevices(prev => prev.filter(device => device.id !== deviceId));
      } else {
        showToast(data.error || 'Failed to remove device', 'error');
      }
    } catch (error) {
      showToast('An error occurred', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Two-factor Authentication */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Two-factor Authentication</h3>
          
          {/* Coming Soon Component */}
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">Coming Soon</h4>
            <p className="text-gray-500">Two-factor authentication features are currently in development.</p>
          </div>
        </div>

        {/* Devices */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Devices</h3>
          <p className="text-gray-500 mb-4">List of all the devices you've signed in on.</p>
          
          <button
            onClick={handleSignOutAll}
            disabled={isLoading || linkedDevices.length === 0}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {isLoading ? 'Signing out...' : 'Sign out from all devices'}
          </button>

          {linkedDevices.length > 0 ? (
            <div className="space-y-4">
              {linkedDevices.map((device) => (
                <div key={device.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                      {device.device_type === "Desktop" ? (
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{device.device_name}</h4>
                      <p className="text-sm text-gray-500">{device.location}, {device.last_login}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveDevice(device.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                    title="Remove device"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No devices found</p>
          )}

          <button className="w-full mt-6 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
            Need Help?
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Save
        </button>
        <button className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SecuritySettings;