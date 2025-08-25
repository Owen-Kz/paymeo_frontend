// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LandingPage from './components/auth/LandingPage';
import Dashboard from './pages/Dashboard';
import InvoicePage from './pages/InvoicePage';
import InvoicePreview from './components/invoices/InvoicePreview';
import CustomersPage from './pages/CustomersPage';
import ProductsPage from './pages/ProductsPage';
import TransactionsPage from './pages/TransactionsPage';
import SettingsPage from './pages/SettingsPage';
import PricingPage from './pages/PricingPage';
// src/App.jsx or src/index.js
import './styles/mobile-nav.css';
import EditCustomer from './components/customers/EditCustomer';
import APIDocumentation from './pages/APIDocumentation';
import TermsOfService from './pages/TermsOfService';
import AllInvoicesPage from './pages/AllInvoices';
import api from "./utils/api"
// import './styles/themify-icons.css'; 

function AppRoutes() {
  const { currentUser, loading } = useAuth(); // Destructure loading
useEffect(() => {
  async function fetchCsrf() {
    const { data } = await api.get("/csrf-token");
    // Save in meta tag (for axios interceptor)
    let meta = document.querySelector('meta[name="csrf-token"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "csrf-token");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", data.csrfToken);
  }
  fetchCsrf();
}, []);

  // Show loading state while auth is being checked
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }
  
  return (
    <Routes>
      {currentUser ? (
        <>
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/new/invoice" element={
            <ProtectedRoute>
              <Layout>
                <InvoicePage  />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/invoice/v1/:id" element={<InvoicePreview />} />
          <Route path="/customers" element={
            <ProtectedRoute>
              <Layout>
                <CustomersPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/store" element={
            <ProtectedRoute>
              <Layout>
                <ProductsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/transactions" element={
            <ProtectedRoute>
              <Layout>
                <TransactionsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Layout>
                <SettingsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/pricing" element={
            <ProtectedRoute>
              <Layout>
                <PricingPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/docs/api" element={
            <ProtectedRoute>
              <APIDocumentation />
            </ProtectedRoute>
          } />
          <Route path="/customers/edit/*" element={
            <ProtectedRoute>
              <Layout>
                <EditCustomer />
              </Layout>
            </ProtectedRoute>
          } />
            <Route path="/invoices" element={
            <ProtectedRoute>
              <Layout>
  
                <AllInvoicesPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Navigate to="/dashboard" replace />} />
          <Route path="/signup" element={<Navigate to="/dashboard" replace />} />
          <Route path="/terms" element={<TermsOfService />} />

        </>
      ) : (
        <>
          <Route path="/login" element={<LandingPage />} />
          <Route path="/signup" element={<LandingPage />} />
          <Route path="/invoice/v1/:id" element={<InvoicePreview />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/docs/api" element={<APIDocumentation />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  );
}
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;