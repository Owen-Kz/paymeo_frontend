// src/components/cards/PaymentRequestCard.jsx
import React, { useState } from "react";

const dummyRequests = [
  {
    id: 1,
    narration: "Invoice #101",
    created_at: new Date(),
    amount: 5000,
    status: "pending",
    invoice_code: "INV101",
    customers: [
      {
        name: "John Doe",
        phone: "08012345678",
        email: "john@example.com",
        payment_status: "pending",
        last_update: new Date(),
      },
    ],
  },
  {
    id: 2,
    narration: "Invoice #102",
    created_at: new Date(),
    amount: 12000,
    status: "completed",
    invoice_code: "INV102",
    customers: [
      {
        name: "Jane Doe",
        phone: "08098765432",
        email: "jane@example.com",
        payment_status: "completed",
        last_update: new Date(),
      },
    ],
  },
];

const PaymentRequests = ({ onRequestClick }) => {
  const [filter, setFilter] = useState("all");

  const filteredRequests =
    filter === "all"
      ? dummyRequests
      : dummyRequests.filter((req) => req.status === filter);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Payment Requests
      </h2>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4">
        {["all", "completed", "pending"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* List */}
      {filteredRequests.length === 0 ? (
        <p className="text-gray-500">No requests found</p>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              onClick={() => onRequestClick(req)}
              className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {req.narration || "Payment Request"}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(req.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">₦{req.amount.toLocaleString()}</p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    req.status === "completed"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
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