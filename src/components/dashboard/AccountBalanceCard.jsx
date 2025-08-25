// src/components/dashboard/AccountBalanceCard.jsx
import React, { useState } from 'react';
import { showToast } from '../../utils/helpers';
import AccountDetailsCard from './AccountDetailsCard';
import WithdrawModal from '../modals/WithdrawModal';
import ClaimBalanceModal from '../modals/ClaimBalanceModal';
import api from '../../utils/api';

const AccountBalanceCard = ({ user, accountDetails, existingAccount, dashboardData, onDataRefresh }) => {
  
  const [isBalanceHidden, setIsBalanceHidden] = useState(
    localStorage.getItem('hideBalance') === 'true'
  );
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const toggleBalanceVisibility = () => {
    const newState = !isBalanceHidden;
    setIsBalanceHidden(newState);
    localStorage.setItem('hideBalance', newState.toString());
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      showToast('Account number copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Failed to copy account number', 'error');
    });
  };

  const shareAccountDetails = () => {
    const shareText = `My ${dashboardData.account.bank} Account Details:
Account Name: ${dashboardData.account.name}
Account Number: ${dashboardData.account.number}
Bank: ${dashboardData.account.bank}`;

    if (navigator.share) {
      navigator.share({
        title: 'My Account Details',
        text: shareText,
      })
      .catch((error) => {
        console.log('Error sharing:', error);
        copyToClipboard(shareText);
        showToast('Account details copied to clipboard!', 'success');
      });
    } else {
      copyToClipboard(shareText);
      showToast('Account details copied to clipboard!', 'success');
    }
  };

  const shareViaWhatsApp = () => {
    const shareText = `My ${dashboardData.account.bank} Account Details:%0AAccount Name: ${dashboardData.account.name}%0AAccount Number: ${dashboardData.account.number}%0ABank: ${dashboardData.account.bank}`;
    window.open(`https://wa.me/?text=${shareText}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = 'My Account Details';
    const body = `My ${dashboardData.account.bank} Account Details:\nAccount Name: ${dashboardData.account.name}\nAccount Number: ${dashboardData.account.number}\nBank: ${dashboardData.account.bank}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  const formatAmount = (amount) => {
    return new Number(amount || 0).toLocaleString();
  };

  const hiddenText = '******';

  // ✅ Check if pre-registration balance is available to claim
  const hasPreRegBalance = dashboardData?.PreRegBalance > 0;

  // ✅ Handle successful withdrawal
  const handleWithdrawSuccess = () => {
    if (onDataRefresh) {
      onDataRefresh(); // Refresh data after successful withdrawal
    }
  };

  // ✅ Handle successful claim
  const handleClaimSuccess = () => {
    setIsClaiming(false);
    setShowClaimModal(false);
    showToast('Pre-registration balance claimed successfully!', 'success');
    
    if (onDataRefresh) {
      onDataRefresh(); // Refresh data after successful claim
    }
  };

  // ✅ Handle claim error
  const handleClaimError = (error) => {
    setIsClaiming(false);
    showToast(error.message || 'Failed to claim balance', 'error');
  };

  return (
    <div className="w-full mx-auto flex flex-col lg:flex-row gap-6 py-6">
      {/* Left - Balance and Actions Card */}
      <div className="w-full lg:w-1/2 bg-white rounded-2xl shadow-md p-6 flex flex-col h-fit">
        {/* Verification Badge */}
        {user?.is_verified === "yes" ? (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold mb-6 border border-blue-300 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-patch-check-fill w-4 h-4 mr-1" viewBox="0 0 22 16">
              <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708"/>
            </svg>
            VERIFIED BUSINESS ACCOUNT
          </div>
        ) : (
          <div className="flex items-center gap-4 mb-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold border border-red-200">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              UNVERIFIED BUSINESS ACCOUNT
            </div>
            <button
              onClick={() => showToast('Verification requested!', 'info')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Request Verification
            </button>
          </div>
        )}

        {/* Balance */}
        <div className="mb-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl font-medium text-gray-700">{dashboardData.account.currency || "NGN"}</span>
            <span className="text-3xl font-bold text-gray-900">
              {isBalanceHidden ? hiddenText : formatAmount(dashboardData.account.balance)}
            </span>
            <button
              className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
              onClick={toggleBalanceVisibility}
              title="Toggle Balance"
            >
              {isBalanceHidden ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.543 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              )}
            </button>
          </div>
    
        </div>

        {/* Account Details */}
        <div className="space-y-3 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            <span>Acc. No: {dashboardData.account.number || "N/A"}</span>
            {dashboardData.account.number && (
              <button
                className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                onClick={() => copyToClipboard(dashboardData.account.number)}
                title="Copy to clipboard"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </button>
            )}
          </div>
          <div>{dashboardData.account.name || "N/A"}</div>
          <div className="font-medium">{dashboardData.account.bank || "N/A"}</div>
          
          {/* ✅ Share Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={shareAccountDetails}
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              title="Share Account Details"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5"/>
              </svg>
              Share
            </button>
            <button
              onClick={shareViaWhatsApp}
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              title="Share via WhatsApp"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.050-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
              </svg>
              WhatsApp
            </button>
            <button
              onClick={shareViaEmail}
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              title="Share via Email"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
              </svg>
              Email
            </button>
          </div>
        </div>

        {/* Withdraw */}
        {dashboardData.account.balance > 0 ? (
          <button
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium mb-4"
            onClick={() => setShowWithdrawModal(true)}
          >
            Withdraw
          </button>
        ) : (
          <button
            className="w-full px-6 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-medium mb-4"
            disabled
          >
            Withdraw
          </button>
        )}

        {/* Pre-registration Balance */}
        <div className="mt-4 bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
            PRE-REGISTRATION BALANCE
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-3">
            {dashboardData.account.currency || "NGN"} {isBalanceHidden ? hiddenText : formatAmount(dashboardData?.PreRegBalance)}
          </div>
          
          {/* ✅ Claim Balance Button */}
          {hasPreRegBalance && (
            <button
              onClick={() => setShowClaimModal(true)}
              disabled={isClaiming}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center mx-auto"
            >
              {isClaiming ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Claiming...
                </>
              ) : 'Claim Balance'}
            </button>
          )}
        </div>
      </div>

      {/* Right - Bank Account Details Card */}
      <div className="w-full lg:w-1/2 h-fit">
        <AccountDetailsCard user={user} accountDetails={accountDetails} />
      </div>
      
      {/* Withdraw Modal */}
      <WithdrawModal
        user={user}
        show={showWithdrawModal}
        onHide={() => setShowWithdrawModal(false)}
        accountDetails={existingAccount}
        balance={dashboardData.account.balance}
        csrfToken="your-csrf-token"
        hasPin={user.has_transaction_pin}
        onWithdrawSuccess={handleWithdrawSuccess}
      />
      
      {/* ✅ Claim Balance Modal */}
      <ClaimBalanceModal
        show={showClaimModal}
        onHide={() => setShowClaimModal(false)}
        balance={dashboardData?.PreRegBalance}
        currency={dashboardData.account.currency || "NGN"}
        onClaimSuccess={handleClaimSuccess}
        onClaimError={handleClaimError}
      />
    </div>
  );
};

export default AccountBalanceCard;