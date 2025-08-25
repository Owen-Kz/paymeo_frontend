// src/pages/TransactionsPage.jsx
import React, { useState } from "react";
import PaymentRequests from "../components/cards/PaymentRequestCard";
import TransactionDetailModal from "../components/modals/TransactionDetailModal";
import PaymentRequestDetailModal from "../components/modals/PaymentRequestDetailModal";

const dummyTransactions = [
  { id: 1, description: "Wallet Funding", date: new Date(), amount: 10000, type: "credit", status: "completed" },
  { id: 2, description: "Transfer to Bank", date: new Date(), amount: 4000, type: "debit", status: "pending" },
  { id: 3, description: "POS Purchase", date: new Date(), amount: 2000, type: "debit", status: "completed" },
];

const TransactionsPage = () => {
  const [activeTab, setActiveTab] = useState("transactions");
  const [filter, setFilter] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const totalCredit = dummyTransactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebit = dummyTransactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalCredit - totalDebit;

  const filteredTransactions =
    filter === "all"
      ? dummyTransactions
      : dummyTransactions.filter((t) =>
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
                ₦{totalCredit.toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h6 className="text-sm text-gray-500">Total Money Out (30 days)</h6>
              <p className="text-lg font-semibold text-red-600">
                ₦{totalDebit.toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h6 className="text-sm text-gray-500">Account Balance</h6>
              <p className="text-lg font-semibold">₦{balance.toLocaleString()}</p>
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
            <p className="text-gray-500">No transactions found</p>
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
                      {t.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(t.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        t.type === "credit" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {t.type === "credit" ? "+" : "-"}₦
                      {t.amount.toLocaleString()}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        t.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <PaymentRequests onRequestClick={handleRequestClick} />
      )}

      {/* Modals */}
      <TransactionDetailModal
        show={showTransactionModal}
        onHide={closeTransactionModal}
        transaction={selectedTransaction}
      />

      <PaymentRequestDetailModal
        show={showRequestModal}
        onHide={closeRequestModal}
        request={selectedRequest}
      />
    </div>
  );
};

export default TransactionsPage;