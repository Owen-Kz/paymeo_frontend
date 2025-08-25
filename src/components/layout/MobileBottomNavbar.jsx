// src/components/layout/MobileBottomNav.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const MobileBottomNav = () => {
  const [showQuickActions, setShowQuickActions] = useState(false);
  const location = useLocation();

  // Handle body scroll when menu is open
  useEffect(() => {
    if (showQuickActions) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }

    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [showQuickActions]);

  // Close quick actions when route changes
  useEffect(() => {
    setShowQuickActions(false);
  }, [location.pathname]);

  // Map icon names to Bootstrap Icons
  const getIconComponent = (iconName, className = "w-5 h-5") => {
    const iconMap = {
      'dashboard': (
        <svg className={className} fill="currentColor" viewBox="0 0 16 16">
          <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-5zM0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6.5H0V13z"/>
        </svg>
      ),
      'store': (
        <svg className={className} fill="currentColor" viewBox="0 0 16 16">
          <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976l2.61-3.045zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0zM1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5zM4 15h3v-5H4v5zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3zm3 0h-2v3h2v-3z"/>
        </svg>
      ),
      'plus': (
        <svg className={className} fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>
      ),
      'transactions': (
        <svg className={className} fill="currentColor" viewBox="0 0 16 16">
          <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
          <path d="M0 5a1 1 极 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5zm3 0a2 2 0 0 1-2 2v4a2 2 极 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2H3z"/>
        </svg>
      ),
      'profile': (
        <svg className={className} fill="currentColor" viewBox="0 0 16 16">
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
          <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 极 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 极.225 5.468 2.37A7 7 0 0 0 8 1z"/>
        </svg>
      ),
      'invoice': (
        <svg className={className} fill="currentColor" viewBox="0 0 16 16">
          <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
        </svg>
      ),
      'send': (
        <svg className={className} fill="currentColor" viewBox="0 极 16 16">
          <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
        </svg>
      ),
      'request-money': (
        <svg className={className} fill="currentColor" viewBox="0 0 16 16">
          <path d="M0 5a5.002 5.002 0 0 0 4.027 4.905 6.46 6.46 0 0 1 .544-2.073C3.695 7.536 3.132 6.864 3 5.91h-.5v-.426h.466V5.05c0-.046 0-.093.004-.135H2.5v-.427h.511C3.236 3.24 4.213 2.5 5.681 2.5c.316 0 .59.031.819.085v.733a3.46 3.46 0 0 0-.815-.082c-.919 0-1.538.466-1.734 1.252极1.917v.427h-1.98c-.003.046-.003.097-.003.147v.422h1.983v.427H3.93c.118.602.468 1.03 1.005 1.229a6.5 6.5 0 0 1 4.97-3.113A5.002 5.002 0 0 0 0 5zm16 5.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0zm-7.75 1.322c.069.835.746 1.485 1.964 1.562V14h.54v-.62c1.259-.086 1.996-.74 1.996-1.69 0-.865-.563-1.31-1.57-1.54l-.426-.1V8.374c.54.06.884.347.966.745h.948c-.07-.804-.779-1.433-1.914-1.502V7h-.54v.629c-1.076.103-1.808.732-1.808 1.622 0 .787.544 1.288 1.45 1.493l.358.085v1.78c-.554-.08-.92-.376-1.003-.787H8.25zm1.96-1.895c-.532-.12-.82-.364-.82-.732 0-.41.311-.719.824-.809v1.54h-.005zm.622 1.044c.645.145.943.38.943.796 0 .474-.极.8-1.02.86v-1.674l.077.018z"/>
        </svg>
      ),
      'add-product': (
        <svg className={className} fill="currentColor" viewBox="0 0 16 16">
          <path d="M.5 0a.5.5 0 0 1 .5.5V2h12.5a.5.5 0 0 1 .5.5v1a.5.5 极 0 0 1-.5.5H1v11.5A1.5 1.5 0 0 0 2.5 16h11a1.5 1.5 0 0 0 1.5-1.5V3a1.5 1.5 0 0 0-1.5-1.5H1V.5a.5.5 0 0 1 .5-.5z"/>
          <path d="M3 5.5A1.5 1.5 0 0 1 4.极 4h7A1.5 1.5 0 0 1 13 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 12.5v-7zM4.5 5a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-7z"/>
          <path d="M8 8a.5.5 0 0 1 .5.5V10H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V11H6a.5.5 0 0 1 0-1h1.5V8.5A.5.5 0 0 1 8 8z"/>
        </svg>
      ),
      'add-customer': (
        <svg className={className} fill="currentColor" viewBox="0 0 16 16">
          <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
          <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/>
        </svg>
      ),
      'receipt': (
        <svg className={className} fill="currentColor" viewBox="0 0 16 16">
          <path d="M14 3a1 1 0 0 1 极 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12zM2 2a2 2 0 0 0-2 2极8a2 2 0 0 0 2 2h12a2 2 极 0 0 0 2-2V4a2 2 0 0 0-2-2H2z"/>
          <path d="M5 5.5A.5.5 0 0 1 5.5 5h5a.5.5 0 0 1 0 1h-5A.5.5 0 0 1 5 5.5zm0 2A.5.5 0 0 1 5.5 7极5a.5.5 0 0 1 0 1h-5A.5.5 0 0 1 5 7.5zm0 2A.5.5 0 0 1 5.5 9h5a.5.5 0 0 1 0 1h-5A.5.5 0 0 1 5 9.5zm0 2A.5.5 0 0 1 5.5 11h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
        </svg>
      ),
      'wand': (
        <svg className={className} fill="currentColor" viewBox="0 0 16 16">
          <path d="M14.5 3a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h.293L12.5 2.207l-.646.647a.5.5 0 1 1-.708-.708l.647-.646L11 1.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5zm-2 0a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5极-1a.5.5 0 0 1 0-1h.293L10.5 2.207 9.854 2.854a.5.5 0 1 1-.708-.708l.647-.646L9 1.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5zm-2 0a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h.293L8.5 2.207 7.854 2.854a.5.5 0 1 1-.708-.708l.647-.646L7 1.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5zm-5.5.5A.5.5 0 0 1 5 3h1a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zM4 4h1v8H4V4z"/>
          <path d="M1 4v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1极4H1z"/>
        </svg>
      )
    };

    return iconMap[iconName] || (
      <svg className={className} fill="currentColor" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="8"/>
      </svg>
    );
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "dashboard" },
    { path: "/store", label: "Store", icon: "store" },
    { path: "#quick-actions", label: "Create", icon: "plus", isAction: true },
    { path: "/transactions", label: "Transactions", icon: "transactions" },
    { path: "/invoices", label: "Invoices", icon: "invoice" },
  ];

  const quickActions = [
    { path: "/new/invoice", label: "Create Invoice", icon: "invoice" },
    { path: "/dashboard#send-money", label: "Send Money", icon: "send" },
    { path: "/dashboard#request-money", label: "Request Money", icon: "request-money" },
    { path: "/store#pills-add", label: "Add Product", icon: "add-product" },
    { path: "/customers#pills-create", label: "Add Customer", icon: "add-customer" },
    { path: "#", label: "Escrow Pay", icon: "receipt", comingSoon: true },
    { path: "#", label: "AI Agent", icon: "wand", comingSoon: true },
  ];

  const toggleQuickActions = () => {
    setShowQuickActions(!showQuickActions);
  };

  return (
    <>
      {/* Quick Actions Overlay */}
      {showQuickActions && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowQuickActions(false)}
        ></div>
      )}

      {/* Quick Actions Menu - Positioned above the nav bar */}
      <div className={`fixed bottom-16 inset-x-0 bg-white rounded-t-2xl shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${showQuickActions ? 'translate-y-0' : 'translate-y-full'}`}>
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>
        
        <div className="p-4 pb-6">
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.path}
                onClick={() => setShowQuickActions(false)}
                className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                  action.comingSoon 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'hover:bg-gray-50 active:bg-gray-100'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  action.comingSoon ? 'bg-gray-200' : 'bg-blue-100'
                }`}>
                  {getIconComponent(action.icon, "w-5 h-5", action.comingSoon ? 'text-gray-500' : 'text-blue-600')}
                </div>
                <span className="text-xs text-gray-700 text-center font-medium leading-tight">
                  {action.label}
                  {action.comingSoon && (
                    <span className="block text-[10px] text-gray-400 mt-1">Coming soon</span>
                  )}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 lg:hidden safe-area-bottom">
        <div className="flex justify-around items-stretch">
          {navItems.map((item) => (
            item.isAction ? (
              <button
                key={item.label}
                onClick={toggleQuickActions}
                className="flex flex-col items-center justify-center p-2 -mt-5 bg-blue-600 text-white rounded-full shadow-lg active:bg-blue-700 active:scale-95 transition-transform z-50"
              >
                {getIconComponent(item.icon, "w-6 h-6")}
              </button>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center p-2 flex-1 min-w-0 ${
                  location.pathname === item.path 
                    ? 'text-blue-600' 
                    : 'text-gray-600'
                } active:text-blue-700 active:bg-gray-100 rounded-lg`}
              >
                {getIconComponent(item.icon, "w-5 h-5 mb-1")}
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          ))}
        </div>
      </nav>
    </>
  );
};

export default MobileBottomNav;