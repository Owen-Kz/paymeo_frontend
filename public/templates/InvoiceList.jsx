import React from 'react';
import { Link } from 'react-router-dom';

const InvoiceList = ({ onInvoiceSelect, searchTerm = '', viewMode = 'list' }) => {
  // Mock data - replace with API call
  const invoices = [{
    id: 1,
    invoice_number: "INV-001",
    client_name: "John Doe",
    amount: "$100.00",
    status: "paid",
    date: "2023-10-15"
  }, {
    id: 2,
    invoice_number: "INV-002",
    client_name: "Jane Smith",
    amount: "$250.50",
    status: "pending",
    date: "2023-10-16"
  }, {
    id: 3,
    invoice_number: "INV-003",
    client_name: "Acme Corp",
    amount: "$1,200.00",
    status: "overdue",
    date: "2023-10-10"
  }];

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.client_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Status badge styling
  const getStatusBadge = (status) => {
    const statusStyles = {
      paid: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      overdue: "bg-red-100 text-red-800",
      draft: "bg-gray-100 text-gray-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || statusStyles.draft}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      {filteredInvoices.length === 0 ? (
        <div className="text-center py-8 px-4">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h4 className="text-sm font-semibold text-gray-800 mb-2">No invoices found</h4>
          <p className="text-xs text-gray-500 mb-4">
            {searchTerm ? 'Try adjusting your search term' : 'No invoices available'}
          </p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="divide-y divide-gray-200">
          {filteredInvoices.map(invoice => (
            <div
              key={invoice.id}
              className="p-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer group"
              onClick={() => onInvoiceSelect(invoice)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                    {invoice.invoice_number}
                  </span>
                  {getStatusBadge(invoice.status)}
                </div>
                <span className="text-md font-bold text-gray-900">
                  {invoice.amount}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-600">
                  {invoice.client_name}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(invoice.date)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 p-3">
          {filteredInvoices.map(invoice => (
            <div
              key={invoice.id}
              className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all duration-200 cursor-pointer group"
              onClick={() => onInvoiceSelect(invoice)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                  {invoice.invoice_number}
                </span>
                {getStatusBadge(invoice.status)}
              </div>

              <div className="mb-2">
                <p className="text-md font-bold text-gray-900 mb-1">
                  {invoice.amount}
                </p>
                <p className="text-xs text-gray-600">{invoice.client_name}</p>
              </div>

              <div className="text-xs text-gray-500">
                {formatDate(invoice.date)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer with view all link */}
      <div className="border-t border-gray-200 p-3 bg-gray-50">
        <Link
          to="/invoices"
          className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center"
        >
          View all invoices
          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default InvoiceList;