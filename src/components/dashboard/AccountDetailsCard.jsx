// src/components/dashboard/AccountDetailsCard.jsx
import React, { useState } from "react";
import axios from "axios";
import { showToast } from "../../utils/helpers";

const AccountDetailsCard = ({ user, accountDetails }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    
    try {
      // Make API request to generate/download PDF
       const token = localStorage.getItem('_t');
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/download/bank-details/pdf`, {
        responseType: "blob", // Important for file downloads
        headers:{
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = url;
      
      // Get filename from content-disposition header or use default
      const contentDisposition = response.headers["content-disposition"];
      let fileName = "bank-account-details.pdf";
      
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch.length === 2) {
          fileName = fileNameMatch[1];
        }
      }
      
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
      
      showToast("PDF downloaded successfully", "success");
      
    } catch (error) {
      console.error("Download failed:", error);
      
      if (error.response?.status === 404) {
        showToast("Download service is temporarily unavailable", "error");
      } else {
        showToast("Failed to download PDF. Please try again.", "error");
      }
    } finally {
      setIsDownloading(false);
    }
  };

  // Alternative method if backend isn't working - generate a client-side PDF
  const handleClientSideDownload = () => {
    setIsDownloading(true);
    
    // Simple client-side solution - create a text file with the account details
    const accountDetailsText = `
      Bank Account Details
      ====================
      
      Account Holder Name: ${accountDetails?.account_name || 'N/A'}
      Account Number: ${accountDetails?.account_number || 'N/A'}
      Bank Name: ${accountDetails?.bank_name || 'N/A'}
      
      Generated on: ${new Date().toLocaleDateString()}
    `;
    
    const blob = new Blob([accountDetailsText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "bank-account-details.txt");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    showToast("Account details downloaded as text file", "success");
    setIsDownloading(false);
  };

  return (
    <div className="w-full max-w-l bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-2xl shadow-lg overflow-hidden relative account-card">
      {/* Watermark */}
      <div className="absolute opacity-10 top-10 left-10 transform -rotate-12 z-0 watermark">
        <img
          src={`${process.env.PUBLIC_URL}/assets/logo_white.png`}
          alt="Watermark"
          className="w-40 h-40 object-contain"
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="p-6 bg-white bg-opacity-10 border-b border-white border-opacity-20 text-center card-header">
          <h3 className="text-xl font-semibold text-white">Bank Account Details</h3>
        </div>

        {/* Account Icon */}
        <div className="flex justify-center p-4 account-icon">
          <img
            src={`${process.env.PUBLIC_URL}/assets/logo_white.png`}
            alt="logo"
            className="w-16 h-16 object-contain"
          />
        </div>

        {/* Account Details */}
        <div className="p-6 space-y-4 card-body">
          <div className="flex justify-between py-3 border-b border-white border-opacity-20 detail-item">
            <span className="opacity-80 detail-label">Account Holder Name</span>
            <span className="font-medium detail-value text-sm">
              {accountDetails?.account_name}
            </span>
          </div>

          <div className="flex justify-between py-3 border-b border-white border-opacity-20 detail-item">
            <span className="opacity-80 detail-label">Account Number</span>
            <span className="font-medium detail-value account-number-card">
              {accountDetails?.account_number}
            </span>
          </div>

          <div className="flex justify-between py-3 border-b border-white border-opacity-20 detail-item">
            <span className="opacity-80 detail-label">Bank Name</span>
            <span className="font-medium detail-value">{accountDetails?.bank_name}</span>
          </div>
        </div>

        {/* Download Section */}
        <div className="p-6 bg-white bg-opacity-5 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-3">
            <button
              id="downloadPdf"
              className="px-6 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-gray-100 transition-colors btn btn-download flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Downloading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Download PDF
                </>
              )}
            </button>

            {/* Alternative download option */}
            <div className="flex items-center gap-2">
              <button
                className="px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                onClick={handleClientSideDownload}
                disabled={isDownloading}
                title="Download as text file"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Text
              </button>

              {/* Tailwind Tooltip */}
              <div className="relative group inline-block">
                <svg className="w-5 h-5 text-white opacity-80 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden w-64 bg-gray-900 text-white text-sm rounded-md px-3 py-2 group-hover:block z-20 shadow-lg">
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  Download your account details for printing..
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-xs opacity-70">
            Having issues with PDF? Try the text version.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsCard;