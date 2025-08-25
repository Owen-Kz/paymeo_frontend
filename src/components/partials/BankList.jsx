import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';

const BankList = ({ onBankSelect, selectedBankCode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [banks, setBanks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Fetch banks data (you might want to move this to a parent component or context)
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        setIsLoading(true);
        // Replace with your actual API endpoint
        // const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getBanks`, {
        //   method: "POST",
        //   headers: {
        //     "Content-type": "application/json"
        //   }
        // });
        const response = await api.post("/getBanks", {
          headers: {
            "Content-type": "application/json"
          }
        });
        if (!response || response.status !== 200) {
          throw new Error('Failed to fetch banks');
        }
        const data = await response.data;
        setBanks(data.banks);
      } catch (error) {
        console.error('Failed to fetch banks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanks();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleBankSelect = (bank) => {
    onBankSelect(bank.code, bank.name);
    setSearchTerm(bank.name);
    setShowDropdown(false);
  };


  const filteredBanks = banks.filter(bank =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchFocus = () => {
    setShowDropdown(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  return (
    <div className="bank-selector">
      <div className="relative">
        <input
          ref={searchInputRef}
          type="text"
          id="bank-search"
          placeholder="Search for your bank..."
          className="w-full border px-3 py-2 rounded-md mb-2"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
        />
        <div className="absolute right-3 top-2.5 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {showDropdown && (
        <div
          ref={dropdownRef}
          id="bank-list"
          className="border rounded-md max-h-60 overflow-y-auto"
        >
          {isLoading ? (
            <div className="px-3 py-2 text-center text-gray-500">
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Loading banks...
            </div>
          ) : filteredBanks.length === 0 ? (
            <div className="px-3 py-2 text-center text-gray-500">
              No banks found
            </div>
          ) : (
            filteredBanks.map(bank => (
              <div
                key={bank.code}
                className={`bank-item flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer ${selectedBankCode === bank.code ? 'selected' : ''}`}
                onClick={() => handleBankSelect(bank)}
              >
                <div className="logo-container w-6 h-6 mr-3 flex-shrink-0">
      <img
  src={`${process.env.PUBLIC_URL}/assets/banks/${bank.slug}.png`}
  alt={bank.slug}
  className="bank-logo w-full h-full object-contain"
  loading="lazy"
  onError={(e) => {
    e.target.src = `${process.env.PUBLIC_URL}/assets/banks/default-bank-icon.png`;
    e.target.onerror = null;
  }}
/>
                </div>
                <span className="bank-name">{bank.name}</span>
              </div>
            ))
          )}
        </div>
      )}

      <input
        type="hidden"
        name="bank_code"
        id="bank_code"
        value={selectedBankCode}
        required
      />
    </div>
  );
};

export default BankList;