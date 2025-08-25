// src/components/layout/Layout.jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon, Bell, Search, LogOut, Settings, CreditCard, Circle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import Breadcrumb from "./Breadcrumb";
import MobileBottomNav from "./MobileBottomNavbar";

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Map icon names to Bootstrap Icons
  const getIconComponent = (iconName, className = "w-5 h-5") => {
    const iconMap = {
      'dashboard': (
        <svg className={className} fill="currentColor" viewBox="0 0 16 16">
          <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-5zM0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6.5H0V13z"/>
        </svg>
      ),
      'invoices': (
        <svg className={className} fill="currentColor" viewBox="0 0 16 16">
          <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
        </svg>
      ),
      'customers': (
        <svg className={className} fill="currentColor" viewBox="0 0 16 16">
          <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
        </svg>
      ),
      'store': (
          <svg className={className} fill="currentColor" viewBox="0 0 16 16">
          <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976l2.61-3.045zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0zM1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5zM4 15h3v-5H4v5zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3zm3 0h-2v3h2v-3z"/>
        </svg>
      ),
      'transactions': (
        <svg className={className} fill="currentColor" viewBox="0 0 16 16">
          <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
          <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2H3z"/>
        </svg>
      ),
      'pricing': (
        <svg className={className} fill="currentColor" viewBox="0 0 16 16">
          <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
          <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2H3z"/>
        </svg>
      ),
      'api': (
        <svg className={className} fill="currentColor" viewBox="0 0 16 16">
          <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-5zM0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6.5H0V13z"/>
        </svg>
      ),
      'terms': (
        <svg className={className} fill="currentColor" viewBox="0 0 16 16">
          <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
          <path d="M4.5 12.5A.5.5 0 0 1 5 12h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm0-2A.5.5 0 0 1 5 10h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm0-2A.5.5 0 0 1 5 8h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm0-2A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5z"/>
        </svg>
      ),
      'settings': (
        <svg className={className} fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
          <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
        </svg>
      )
    };

    return iconMap[iconName] || <Circle className={className} />;
  };

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: "dashboard" },
    { path: "/invoices", label: "Invoices", icon: "invoices" },
    // { path: "/customers", label: "Customers", icon: "customers" },
    { path: "/store", label: "Store", icon: "store" },
    { path: "/transactions", label: "Transactions", icon: "transactions" },
    { path: "/pricing", label: "Pricing", icon: "pricing" },
    { path: "/docs/api", label: "API Documentation", icon: "api" },
    { path: "/terms", label: "Terms of Service", icon: "terms" },
    { path: "/settings", label: "Account Settings", icon: "settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar (Overlay) */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity lg:hidden ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform lg:translate-x-0 lg:static lg:shadow-none
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img 
              src="/assets/logo.png" 
              alt="Logo" 
              className="w-8 h-8"
            />
            <span className="font-semibold text-lg">Paymeo</span>
          </Link>
          <button
            className="lg:hidden text-gray-600"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Profile Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img 
              src={currentUser?.company_logo || "/assets/default-avatar.png"} 
              alt="Profile" 
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="font-medium text-gray-900">
                {currentUser?.company_name || "Company Name"}
              </div>
              <div className="text-sm text-gray-500">
                {currentUser?.company_email || "email@company.com"}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                location.pathname === item.path
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              {getIconComponent(item.icon)}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 text-sm text-gray-500">
          © {new Date().getFullYear()} Paymeo
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden pb-16 lg:pb-0">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Hamburger button (mobile only) */}
            {/* <button
              className="lg:hidden text-gray-600"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button> */}
            
            {/* Logo for mobile */}
            <img 
              src="/assets/logo.png" 
              alt="Logo" 
              className="w-8 h-8 lg:hidden"
            />
            
            {/* <h1 className="text-lg font-semibold text-gray-900">
              {menuItems.find((m) => location.pathname.startsWith(m.path))?.label || "Dashboard"}
            </h1> */}
          </div>

          <div className="flex items-center gap-4">
            {/* Dark/Light mode toggle (visual only for now) */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              title="Dark mode (coming soon)"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Search button */}
            {/* <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Search size={20} />
            </button> */}

            {/* Notifications */}
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={20} />
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <img 
                  src={currentUser?.company_logo || "/assets/default-avatar.png"} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full"
                />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <img 
                        src={currentUser?.company_logo || "/assets/default-avatar.png"} 
                        alt="Profile" 
                        className="w-12 h-12 rounded"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {currentUser?.company_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {currentUser?.company_email}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 space-y-1">
                    {/* Dark/Light mode toggle in dropdown (visual only) */}
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                         onClick={toggleDarkMode}>
                      <span className="text-sm">Theme (coming soon)</span>
                      <button className="p-1 text-gray-600">
                        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                      </button>
                    </div>

                    {/* Additional menu items */}
                    <Link
                      to="/settings#bills"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-sm"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <CreditCard size={16} />
                      Billing
                    </Link>

                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-sm"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <Settings size={16} />
                      Account Settings
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-red-600"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        
        <Breadcrumb />

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default Layout;