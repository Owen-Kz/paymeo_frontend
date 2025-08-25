// src/components/modals/EscrowPayModal.jsx
import React from "react";

const EscrowPayModal = ({ show, onHide }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-blue-600 text-white">
          <h5 className="text-lg font-semibold">Escrow Pay</h5>
          <button
            onClick={onHide}
            className="text-white hover:text-gray-200 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center">
          <div className="mb-4">
            <i className="bi bi-tools text-yellow-500 text-5xl"></i>
          </div>
          <h4 className="text-xl font-bold mb-3">Coming Soon</h4>
          <p className="text-gray-600 mb-6">
            Escrow Pay feature is currently under development. We're working
            hard to bring you secure payment escrow services.
          </p>

          {/* Info box */}
          <div className="bg-blue-50 border-l-4 border-blue-400 text-left p-4 rounded-lg mx-auto max-w-xl shadow-sm">
            <h6 className="text-blue-700 font-semibold mb-2">
              What is Escrow Pay?
            </h6>
            <p className="text-gray-700 text-sm">
              Escrow Pay will provide secure transaction handling where funds
              are held by a trusted third party until both parties fulfill their
              obligations. <br /> Perfect for high-value transactions and
              services.
            </p>
          </div>

          {/* Button */}
          <button
            onClick={onHide}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default EscrowPayModal;
