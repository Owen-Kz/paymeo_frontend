// src/pages/TransactionsPage.jsx
import React, { useState, useEffect } from "react";
import PaymentRequests from "../components/cards/PaymentRequestCard";
import TransactionDetailModal from "../components/modals/TransactionDetailModal";
import PaymentRequestDetailModal from "../components/modals/PaymentRequestDetailModal";
import api from "../utils/api";

const TransactionsPage = () => {
  const [activeTab, setActiveTab] = useState("transactions");
  const [filter, setFilter] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [transactionsData, setTransactionsData] = useState({
    MyTransactions: [],
    MyRequests: [],
    TotalCredit: 0,
    TotalDebit: 0,
    AccountBalance: 0,
    Currency: 'NGN'
  });

  // Fetch transactions data from API
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const response = await api.post('/transactions/payments/requests');
        
        if (response.data.success) {
          setTransactionsData({
            MyTransactions: response.data.MyTransactions || [],
            MyRequests: response.data.MyRequests || [],
            TotalCredit: response.data.TotalCredit || 0,
            TotalDebit: response.data.TotalDebit || 0,
            AccountBalance: response.data.AccountBalance || 0,
            Currency: response.data.Currency || 'NGN'
          });
        } else {
          console.error('Failed to fetch transactions:', response.data.error);
          // Fallback to empty data if API fails
          setTransactionsData({
            MyTransactions: [],
            MyRequests: [],
            TotalCredit: 0,
            TotalDebit: 0,
            AccountBalance: 0,
            Currency: 'NGN'
          });
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        // Fallback to empty data if API call fails
        setTransactionsData({
          MyTransactions: [],
          MyRequests: [],
          TotalCredit: 0,
          TotalDebit: 0,
          AccountBalance: 0,
          Currency: 'NGN'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const { MyTransactions, MyRequests, TotalCredit, TotalDebit, AccountBalance, Currency } = transactionsData;

  const formatCurrency = (amount, currency = Currency) => {
    if (!amount) return currency === 'NGN' ? '₦0.00' : '$0.00';
    
    const options = {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    };
    
    return new Intl.NumberFormat(currency === 'NGN' ? 'en-NG' : 'en-US', options).format(amount);
  };

  const filteredTransactions =
    filter === "all"
      ? MyTransactions
      : MyTransactions.filter((t) =>
          filter === "money-in" ? t.type === "credit" : t.type === "debit"
        );

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setShowRequestModal(true);
  };

  const closeTransactionModal = () => {
    setShowTransactionModal(false);
    setSelectedTransaction(null);
  };

  const closeRequestModal = () => {
    setShowRequestModal(false);
    setSelectedRequest(null);
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-3 mb-6">
          <button className="px-4 py-2 rounded-lg bg-gray-200 text-gray-600 animate-pulse w-32"></button>
          <button className="px-4 py-2 rounded-lg bg-gray-200 text-gray-600 animate-pulse w-32"></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm animate-pulse">
              <div>
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="text-right">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Switch Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab("transactions")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "transactions"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Transactions
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "requests"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Payment Requests
        </button>
      </div>

      {activeTab === "transactions" ? (
        <div>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h6 className="text-sm text-gray-500">Total Money In (30 days)</h6>
              <p className="text-lg font-semibold text-green-600">
                {formatCurrency(TotalCredit)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h6 className="text-sm text-gray-500">Total Money Out (30 days)</h6>
              <p className="text-lg font-semibold text-red-600">
                {formatCurrency(TotalDebit)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h6 className="text-sm text-gray-500">Account Balance</h6>
              <p className="text-lg font-semibold">{formatCurrency(AccountBalance)}</p>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-4">
            {["all", "money-in", "money-out"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filter === f
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {f.replace("-", " ").toUpperCase()}
              </button>
            ))}
          </div>

          {/* Transactions List */}
          {filteredTransactions.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <p className="text-gray-500 text-lg">No transactions found</p>
              <p className="text-gray-400 text-sm mt-2">Your transactions will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((t) => (
                <div
                  key={t.id}
                  onClick={() => handleTransactionClick(t)}
                  className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {t.description || 'Transaction'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t.timestamp ? new Date(t.timestamp).toLocaleDateString() : 'No date'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        t.type === "credit" ? "text-green-800" : "text-red-600"
                      }`}
                    >
                      {t.type === "credit" ? "+" : "-"}{formatCurrency(t.amount)}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        t.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : t.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {t.status || 'unknown'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <PaymentRequests 
          onRequestClick={handleRequestClick} 
          requests={MyRequests}
          currency={Currency}
        />
      )}

      {/* Modals */}
      <TransactionDetailModal
        show={showTransactionModal}
        onHide={closeTransactionModal}
        transaction={selectedTransaction}
        currency={Currency}
      />

      <PaymentRequestDetailModal
        show={showRequestModal}
        onHide={closeRequestModal}
        request={selectedRequest}
        currency={Currency}
      />
    </div>
  );
};

export default TransactionsPage;