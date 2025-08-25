// src/components/dashboard/QuickActions.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const QuickActions = React.memo(({ onSendMoney, onRequestMoney, onEscrowPay }) => {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Send Money",
      icon: "bi-send-fill",
      color: "text-blue-600",
      bg: "bg-blue-50",
      onClick: onSendMoney,
    },
    {
      label: "Request Money",
      icon: "bi-cash-coin",
      color: "text-green-600",
      bg: "bg-green-50",
      onClick: onRequestMoney,
    },
    {
      label: "Escrow Pay",
      icon: "bi-receipt",
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      onClick: onEscrowPay,
    },
    {
      label: "Transactions",
      icon: "bi-clock-history",
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      onClick: () => navigate("/transactions"),
    },
  ];

  const handleActionClick = (action) => {
    action.onClick();
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex w-full flex-wrap justify-center gap-3 p-4 bg-white rounded-2xl shadow-sm mb-4 lg:w-4/5">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => handleActionClick(action)}
            className="w-40 h-28 flex flex-col items-center justify-center rounded-xl bg-white  transition-transform hover:-translate-y-1 hover:shadow-md"
          >
            <div
              className={`w-14 h-14 flex items-center justify-center rounded-md mb-2 ${action.bg}`}
            >
              <i className={`bi ${action.icon} ${action.color} text-xl`} />
            </div>
            <span className="text-sm font-semibold text-gray-800">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
});

QuickActions.displayName = 'QuickActions';

export default QuickActions;