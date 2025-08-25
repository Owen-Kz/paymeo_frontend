import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BankList from './components/partials/BankList';
import SignatureModal from './components/modals/SignatureModal';
import { showToast } from '../utils/helpers';
import './CompanyDetails.css';

const CompanyDetails = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    company_name: '',
    company_reg_number: '',
    company_address: '',
    company_website: '',
    bank_code: '',
    account_number: '',
    account_name: '',
    identity_method: 'bvn',
    bvn: '',
    nin: '',
    dob: '',
    logo: null,
    signature: null
  });
  const [selectedBankCode, setSelectedBankCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signaturePreview, setSignaturePreview] = useState('');
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [banks, setBanks] = useState([]);
  
  const { currentUser, markProfileComplete, BACKEND_URL, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Initialize form with user data
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        company_name: currentUser.username || currentUser.company_name || ''
      }));
    }
  }, [currentUser]);

  // Fetch banks list
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/banks`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const banksData = await response.json();
          setBanks(banksData);
        } else {
          showToast('Failed to load banks list', 'error');
        }
      } catch (error) {
        console.error('Failed to fetch banks:', error);
        showToast('Network error loading banks', 'error');
      }
    };
    
    fetchBanks();
  }, [BACKEND_URL, token]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'logo' || name === 'signature') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
      
      if (name === 'signature' && files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => setSignaturePreview(e.target.result);
        reader.readAsDataURL(files[0]);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle identity method toggle
  const handleIdentityMethodChange = (method) => {
    setFormData(prev => ({
      ...prev,
      identity_method: method
    }));
  };

  // Handle bank selection
  const handleBankSelect = (code, name) => {
    setSelectedBankCode(code);
    setFormData(prev => ({
      ...prev,
      bank_code: code
    }));
    
    // If account number is complete, resolve account
    if (formData.account_number.length === 10) {
      resolveAccount();
    }
  };

  // Account resolution function
  const resolveAccount = async () => {
    if (formData.account_number.length !== 10 || !selectedBankCode) {
      setFormData(prev => ({
        ...prev,
        account_name: ''
      }));
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch(
        `${BACKEND_URL}/resolve-account?account_number=${formData.account_number}&bank_code=${selectedBankCode}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          account_name: data.account_name
        }));
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Invalid account details');
        setFormData(prev => ({
          ...prev,
          account_name: ''
        }));
      }
    } catch (err) {
      console.error('Account resolution failed:', err);
      setError('Network error. Please try again.');
      setFormData(prev => ({
        ...prev,
        account_name: ''
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle next step
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Handle previous step
  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Validate current step
  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.company_name && formData.company_address;
      case 2:
        return formData.bank_code && formData.account_number && formData.account_name;
      case 3:
        if (formData.identity_method === 'bvn') {
          return formData.bvn && formData.dob;
        } else {
          return formData.nin && formData.dob;
        }
      case 4:
        return formData.signature;
      default:
        return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(4)) {
      showToast('Please complete all required fields', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const submitData = new FormData();
      
      // Append all form data
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      });

      const response = await fetch(`${BACKEND_URL}/complete-profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Profile completed successfully!', 'success');
        markProfileComplete();
        
        // Update user data in context if available
        if (data.user) {
          updateUserProfile(data.user);
        }
        
        navigate('/dashboard');
      } else {
        setError(data.error || 'Submission failed');
        showToast(data.error || 'Submission failed', 'error');
      }
    } catch (error) {
      console.error('Submission failed', error);
      setError('Network error. Please try again.');
      showToast('Network error. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to resolve account when account number or bank changes
  useEffect(() => {
    if (formData.account_number.length === 10 && selectedBankCode) {
      resolveAccount();
    }
  }, [formData.account_number, selectedBankCode]);

  // Calculate progress percentage
  const progressPercentage = (currentStep / 4) * 100;

  return (
    <div className="min-vh-100 bg-light company-details-page">
      <div className="container-fluid p-0">
        <div className="row g-0">
          {/* Left side content */}
          <div className="col-xl-7 col-xxl-8 d-none d-xl-block">
            <section className="bg-indigo-600 text-white py-20 px-6 vh-100 d-flex align-items-center">
              <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight text-light mb-4">
                  Get Paid Faster with Paymeo (formerly invox)
                </h1>
                <p className="text-lg md:text-xl mb-6">
                  Create, share, and get paid through invoices with virtual account numbers — all in one simple platform.
                </p>
                <p className="text-lg md:text-xl mb-6 fw-bold">
                  Bill Smart. Get Paid. Move On.
                </p>
              </div>
            </section>
          </div>

          {/* Right side form */}
          <div className="col-xl-5 col-xxl-4 position-fixed right-0 top-0 vh-100 overflow-auto">
            <div className="authentication-login min-vh-100 d-flex justify-content-center align-items-center p-4">
              <div className="auth-max-width col-sm-8 col-md-6 col-xl-9 p-4">
                <h3 className="mb-4 fw-bold">Complete Your Company Profile</h3>

                {/* Progress Bar */}
                <div className="progress-bar">
                  <div 
                    className="progress" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>

                {/* Step Indicator */}
                <div className="step-indicator">
                  {[1, 2, 3, 4].map(step => (
                    <div 
                      key={step}
                      className={`step ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
                      onClick={() => currentStep > step && setCurrentStep(step)}
                    >
                      <div className="step-number">{step}</div>
                      <div className="step-label">
                        {step === 1 && 'Company Info'}
                        {step === 2 && 'Bank Details'}
                        {step === 3 && 'Identity'}
                        {step === 4 && 'Signature'}
                      </div>
                    </div>
                  ))}
                </div>

                {error && <div className="alert alert-danger mb-3">{error}</div>}

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  {/* Step 1: Company Information */}
                  <div className={`form-step ${currentStep === 1 ? 'active' : ''}`}>
                    <div className="mb-3">
                      <label className="form-label required-field">Company/Business Name</label>
                      <input
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Company Registration Number (Optional)</label>
                      <input
                        type="text"
                        name="company_reg_number"
                        value={formData.company_reg_number}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label required-field">Company Address</label>
                      <input
                        type="text"
                        name="company_address"
                        value={formData.company_address}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Company Website</label>
                      <input
                        type="url"
                        name="company_website"
                        value={formData.company_website}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>

                    <div className="nav-buttons">
                      <button type="button" className="btn btn-outline-secondary" disabled>
                        Previous
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary next-step"
                        onClick={nextStep}
                        disabled={!validateStep(1)}
                      >
                        Next
                      </button>
                    </div>
                  </div>

                  {/* Step 2: Bank Details */}
                  <div className={`form-step ${currentStep === 2 ? 'active' : ''}`}>
                    <div className="mb-3">
                      <label className="form-label required-field">Bank</label>
                      <BankList 
                        banks={banks} 
                        onBankSelect={handleBankSelect} 
                        selectedBankCode={selectedBankCode} 
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label required-field">Account Number</label>
                      <input
                        type="number"
                        name="account_number"
                        value={formData.account_number}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                        maxLength="10"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label required-field">Account Name</label>
                      <input
                        type="text"
                        name="account_name"
                        value={formData.account_name}
                        readOnly
                        className="form-control disabled"
                        style={{ cursor: 'none', backgroundColor: 'rgba(128, 128, 128, 0.212)' }}
                        required
                      />
                    </div>

                    <div className="nav-buttons">
                      <button type="button" className="btn btn-outline-secondary" onClick={prevStep}>
                        Previous
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary next-step"
                        onClick={nextStep}
                        disabled={!validateStep(2)}
                      >
                        Next
                      </button>
                    </div>
                  </div>

                  {/* Step 3: Identity Verification */}
                  <div className={`form-step ${currentStep === 3 ? 'active' : ''}`}>
                    <div className="mb-4">
                      <label className="form-label">Identity Verification Method</label>
                      <div className="identity-toggle">
                        <button
                          type="button"
                          className={`identity-method ${formData.identity_method === 'bvn' ? 'active' : ''}`}
                          onClick={() => handleIdentityMethodChange('bvn')}
                        >
                          BVN
                        </button>
                        <button
                          type="button"
                          className={`identity-method ${formData.identity_method === 'nin' ? 'active' : ''}`}
                          onClick={() => handleIdentityMethodChange('nin')}
                        >
                          NIN
                        </button>
                      </div>
                    </div>

                    {formData.identity_method === 'bvn' ? (
                      <div className="mb-3">
                        <label className="form-label required-field">Bank Verification Number (BVN)</label>
                        <input
                          type="text"
                          name="bvn"
                          value={formData.bvn}
                          onChange={handleInputChange}
                          className="form-control"
                          maxLength="11"
                          placeholder="Enter 11-digit BVN"
                          required
                        />
                      </div>
                    ) : (
                      <div className="mb-3">
                        <label className="form-label required-field">National Identification Number (NIN)</label>
                        <input
                          type="text"
                          name="nin"
                          value={formData.nin}
                          onChange={handleInputChange}
                          className="form-control"
                          maxLength="11"
                          placeholder="Enter 11-digit NIN"
                          required
                        />
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="form-label required-field">Date of Birth</label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="nav-buttons">
                      <button type="button" className="btn btn-outline-secondary" onClick={prevStep}>
                        Previous
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary next-step"
                        onClick={nextStep}
                        disabled={!validateStep(3)}
                      >
                        Next
                      </button>
                    </div>
                  </div>

                  {/* Step 4: Signature and Final */}
                  <div className={`form-step ${currentStep === 4 ? 'active' : ''}`}>
                    <div className="mb-3">
                      <label className="form-label">Company Logo</label>
                      <input
                        type="file"
                        name="logo"
                        onChange={handleInputChange}
                        className="form-control"
                        accept=".png, .jpg, .jpeg"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label required-field">Signature</label>
                      {signaturePreview && (
                        <img
                          src={signaturePreview}
                          alt="signature-img"
                          className="img-fluid border-5 d-block mb-2"
                          style={{ borderRadius: '10px' }}
                          width="120"
                          height="120"
                        />
                      )}
                      <input
                        type="file"
                        id="signatureInput"
                        name="signature"
                        onChange={handleInputChange}
                        accept=".png, .jpg, .jpeg"
                        style={{ display: 'none' }}
                      />
                      <div className="d-flex align-items-center justify-content-center gap-3">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => setShowSignatureModal(true)}
                        >
                          Upload
                        </button>
                      </div>
                    </div>

                    <div className="nav-buttons">
                      <button type="button" className="btn btn-outline-secondary" onClick={prevStep}>
                        Previous
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary w-100 py-8 mb-4 rounded-2"
                        disabled={!validateStep(4) || isLoading}
                      >
                        {isLoading ? 'Processing...' : 'Complete Profile'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Modal */}
      <SignatureModal
        show={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSignatureUpload={(signatureFile) => {
          setFormData(prev => ({ ...prev, signature: signatureFile }));
          const reader = new FileReader();
          reader.onload = (e) => setSignaturePreview(e.target.result);
          reader.readAsDataURL(signatureFile);
        }}
      />
    </div>
  );
};

export default CompanyDetails;