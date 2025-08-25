// src/components/invoice/InvoiceHeader.jsx
import React from "react";

const InvoiceHeader = ({ invoiceNumber, companyDetails, currentDate, dueDate, currency }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 border-b pb-6 mb-6">
      {/* Company Info */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        {companyDetails?.company_logo && (
          <div className="w-16 h-16 flex-shrink-0">
            <img
              src={companyDetails.company_logo}
              alt="Company Logo"
              className="w-full h-full object-contain"
            />
          </div>
        )}
        {/* Details */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {companyDetails?.company_name || "Company Name"}
          </h2>
          <p className="text-gray-500 text-sm max-w-xs">
            {companyDetails?.company_address || "Company Address"}
          </p>
          {companyDetails?.reg_number && (
       <p className="text-gray-500 text-sm max-w-xs">
            {companyDetails?.reg_number || "Company Registration Number"}
          </p>
          )}
        </div>
      </div>

      {/* Invoice Info */}
      <div className="text-center md:text-right">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-wide">INVOICE</h1>
        <div className="mt-2 text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-semibold">Number:</span> {invoiceNumber}
          </p>
          <p>
            <span className="font-semibold">Date:</span> {currentDate}
          </p>
          <p>
            <span className="font-semibold">Due:</span> {dueDate}
          </p>
          {currency && (
            <p>
              <span className="font-semibold">Currency:</span> {currency}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;
