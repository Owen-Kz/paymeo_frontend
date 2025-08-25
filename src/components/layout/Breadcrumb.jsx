// src/components/layout/Breadcrumb.jsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  
  // Map paths to custom titles
  const pageTitles = {
    '/': 'Dashboard',
    '/dashboard': 'Dashboard',
    '/invoice': 'Invoices',
    '/new/invoice': 'Create Invoice',
    '/invoice/edit': 'Edit Invoice',
    '/customers': 'Customers',
    '/customers/create': 'Add Customer',
    '/products': 'Products',
    '/products/create': 'Add Product',
    '/transactions': 'Transactions',
    '/pricing': 'Pricing',
    '/docs/api': 'API Documentation',
    '/terms': 'Terms of Service',
    '/settings': 'Account Settings',
    '/settings/profile': 'Profile Settings',
    '/settings/security': 'Security Settings',
    '/settings/billing': 'Billing Settings',
  };

  // Function to find the best matching title
  const getPageTitle = (pathname) => {
    // Exact match
    if (pageTitles[pathname]) {
      return pageTitles[pathname];
    }
    
    // Try to find a matching parent path
    const paths = pathname.split('/').filter(Boolean);
    for (let i = paths.length; i > 0; i--) {
      const testPath = '/' + paths.slice(0, i).join('/');
      if (pageTitles[testPath]) {
        return pageTitles[testPath];
      }
    }
    
    // Fallback: format the pathname
    return pathname
      .replace(/^\//, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase())
      .replace(/\bApi\b/, 'API');
  };

  const currentPageTitle = getPageTitle(location.pathname);

  return (
    <div className="mb-6 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h5 className="text-xl font-semibold text-gray-900 mb-0">
          {currentPageTitle}
        </h5>
        
        <nav aria-label="breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li className="breadcrumb-item">
              <Link 
                to="/dashboard" 
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <span className="text-gray-400 mx-2">/</span>
              <span className="text-gray-600">
                {currentPageTitle}
              </span>
            </li>
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;