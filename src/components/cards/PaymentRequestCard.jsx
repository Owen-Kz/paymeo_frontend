// src/components/cards/PaymentRequestCard.jsx
import React, { useState } from "react";

const PaymentRequests = ({ onRequestClick, requests, currency }) => {
  const [filter, setFilter] = useState("all");

  const formatCurrency = (amount, curr = currency) => {
    if (!amount) return curr === 'NGN' ? '₦0.00' : '$0.00';
    
    const options = {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    };
    
    return new Intl.NumberFormat(curr === 'NGN' ? 'en-NG' : 'en-US', options).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    let date;

    if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
      date = new Date(dateString.replace(' ', 'T'));
    } else if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
      const [day, month, year] = dateString.split('-').map(Number);
      date = new Date(year, month - 1, day);
    } else {
      date = new Date(dateString);
    }

    if (isNaN(date)) return 'Invalid Date';

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-600",
      cancelled: "bg-gray-100 text-gray-600"
    };
    
    return statusStyles[status] || "bg-gray-100 text-gray-600";
  };

  const getStatusText = (status) => {
    return status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown';
  };

  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter((req) => req.status === filter);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Payment Requests
      </h2>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["all", "completed", "pending", "paid", "failed", "cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
          <p className="text-gray-500 text-lg">No payment requests found</p>
          <p className="text-gray-400 text-sm mt-2">
            {filter === "all" 
              ? "You haven't created any payment requests yet" 
              : `No ${filter} payment requests found`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((req) => (
            <div
              key={req.id || req._id}
              onClick={() => onRequestClick(req)}
              className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  {req.narration || req.description || "Payment Request"}
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <p className="text-sm text-gray-500">
                    {formatDate(req.created_at || req.date_created || req.createdAt)}
                  </p>
                  {req.invoice_code && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                      {req.invoice_code}
                    </span>
                  )}
                  {req.invoice_number && (
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                      {req.invoice_number}
                    </span>
                  )}
                </div>
                {req.customers && req.customers.length > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    {req.customers.length} customer{req.customers.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              <div className="text-right ml-4 flex-shrink-0">
                <p className="font-semibold text-gray-800">
                  {formatCurrency(req.amount || req.total_amount || 0)}
                </p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(req.status)}`}
                >
                  {getStatusText(req.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentRequests;