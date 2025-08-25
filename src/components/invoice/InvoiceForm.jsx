// src/components/invoice/InvoiceForm.jsx
import React from "react";

const InvoiceForm = ({ recipient, onAddRecipient, brandData }) => {
  return (
    <div className="invoice-form">
      {/* Bill To Section */}
      <div className="bill-to bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Bill To</h3>

        {recipient ? (
          <div className="recipient-info space-y-1 text-gray-700">
            <p className="font-medium">{recipient.name}</p>
            <p className="text-sm">{recipient.company}</p>
            <p className="text-sm">{recipient.email}</p>
            <p className="text-sm">{recipient.phone}</p>

          </div>
        ) : (
          <p className="text-gray-500 italic">No recipient selected</p>
        )}

        <button
          onClick={onAddRecipient}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg shadow-md transition"
        >
          Add Recipient
        </button>
      </div>
    </div>
  );
};

export default InvoiceForm;
