// src/components/invoice/InvoiceTable.jsx
import React from "react";

const InvoiceTable = ({ items, currency, onDeleteItem }) => {
  return (
    <div className="invoice-table mt-6 overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Quantity</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Amount</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map((item, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3 text-sm text-gray-800">{item.description}</td>
              <td className="px-4 py-3 text-sm text-gray-800">{item.quantity}</td>
              <td className="px-4 py-3 text-sm text-gray-800">
                {currency} {item.price}
              </td>
              <td className="px-4 py-3 text-sm text-gray-800">
                {currency} {item.amount}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1 rounded-lg shadow-sm transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td
                colSpan="5"
                className="px-4 py-6 text-center text-gray-500 text-sm"
              >
                No items added yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;
