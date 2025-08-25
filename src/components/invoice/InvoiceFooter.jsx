// src/components/invoice/InvoiceFooter.jsx
import React from "react";

const InvoiceFooter = ({ items, currency, companyDetails }) => {
  const subtotal = items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
  const total = subtotal;

  return (
    <div className="invoice-footer mt-8 border-t border-gray-200 pt-6">
      {/* Totals Section */}
      <div className="totals flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-6">
        <div className="space-y-2">
          <div className="total-row flex justify-between w-48 text-gray-700">
            <span className="font-medium">Subtotal:</span>
            <span>
              {currency} {subtotal.toFixed(2)}
            </span>
          </div>
          <div className="total-row flex justify-between w-48 text-gray-800 font-semibold">
            <span>Total:</span>
            <span>
              {currency} {total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="payment-info bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
        <h4 className="text-md font-semibold text-gray-800 mb-2">
          Payment Information
        </h4>
        <p className="text-sm text-gray-700">Bank: {companyDetails?.bank_name}</p>
        <p className="text-sm text-gray-700">Account: {companyDetails?.account_number}</p>
        <p className="text-sm text-gray-700">Account Name: {companyDetails?.account_name}</p>

      </div>
    </div>
  );
};

export default InvoiceFooter;
