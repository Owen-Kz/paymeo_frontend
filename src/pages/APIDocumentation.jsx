// src/pages/APIDocumentation.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeaderLanding from '../components/partials/HeaderLanding';
import TawkTo from '../components/partials/TawkTo';
import CodeHighlighter from '../components/CodeHighlighter';

const APIDocumentation = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const downloadPDF = () => {
    const a = document.createElement("a");
    a.href = "/assets/API Documentation _ Paymeo (formerly invox)_App.pdf";
    a.download = "API Documentation _ Paymeo (formerly invox)_App.pdf";
    a.click();
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsSidebarOpen(false);
  };

  return (
    <div className="bg-white text-gray-800 font-sans min-h-screen">
      <HeaderLanding />
      
      {/* Mobile Toggle Button */}
      <div className="lg:hidden p-4 flex justify-between items-center border-b">
        <h1 className="text-lg font-semibold">Paymeo (formerly invox) API Docs</h1>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-700 p-2 focus:outline-none focus:ring"
        >
          ☰
        </button>
      </div>

      <main className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar */}
        <aside 
          className={`bg-white w-64 lg:w-1/4 fixed lg:static top-0 left-0 h-full z-40 transform transition-transform duration-300 ease-in-out border-r border-gray-200 p-4 overflow-y-auto ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => scrollToSection('prerequisites')}
                className="text-blue-600 hover:underline text-left"
              >
                Prerequisites
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('authentication')}
                className="text-blue-600 hover:underline text-left"
              >
                Authentication
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('endpoints_overview')}
                className="text-blue-600 hover:underline text-left"
              >
                Endpoints Overview
              </button>
              <ul className="ml-4 list-decimal space-y-1 mt-1">
                <li>
                  <button 
                    onClick={() => scrollToSection('generate_payment_link')}
                    className="text-blue-600 hover:underline text-left"
                  >
                    Generate Payment Link
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('redirect_users')}
                    className="text-blue-600 hover:underline text-left"
                  >
                    Redirect Users
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('verify_transaction')}
                    className="text-blue-600 hover:underline text-left"
                  >
                    Verify Transaction
                  </button>
                </li>
              </ul>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('error_codes_and_messages')}
                className="text-blue-600 hover:underline text-left"
              >
                Error Codes
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('best_practices')}
                className="text-blue-600 hover:underline text-left"
              >
                Best Practices
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('support')}
                className="text-blue-600 hover:underline text-left"
              >
                Support
              </button>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <section className="w-full lg:w-3/4 p-4 overflow-y-auto mainSection">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Header Actions */}
            <div className="flex justify-between mb-6">
              <button 
                style={{ visibility: 'hidden' }} 
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Toggle Theme
              </button>
              <button 
                onClick={downloadPDF}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Download as PDF
              </button>
            </div>

            <h1 className="text-3xl font-bold text-indigo-600">
              Paymeo (formerly invox) Integration API Documentation
            </h1>
            <p>
              This guide covers all the endpoints, request formats, sample code snippets, and expected responses for integrating the Invoice Payment API in Node.js, PHP, and Python.
            </p>

            {/* Prerequisites Section */}
            <h2 id="prerequisites" className="text-2xl font-semibold pt-16 -mt-16">Prerequisites</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>A registered account on Paymeo (formerly invox).</li>
              <li>Your API Key from <a href="https://paymeo.co/settings" className="text-blue-600 hover:underline">Account Settings</a> → API & Webhooks.</li>
              <li>A Callback URL configured in your account settings.</li>
              <li>Node.js v14+, PHP 7.4+, or Python 3.7+ runtime.</li>
            </ul>

            {/* Authentication Section */}
            <h2 id="authentication" className="text-2xl font-semibold pt-16 -mt-16">Authentication</h2>
            <p>Every request must include the API key in the HTTP headers:</p>
            
            <CodeHighlighter 
              code={`api_key: YOUR_API_KEY  # example fANMINeogiMAf92b4l35EXAMPLEKnMAGEopnetb`}
              language="bash"
            />

            <p>Additionally, JSON requests must set:</p>
            <CodeHighlighter 
              code={`Content-Type: application/json`}
              language="bash"
            />

            {/* Endpoints Overview */}
            <h2 id="endpoints_overview" className="text-2xl font-semibold pt-16 -mt-16">Endpoints Overview</h2>
            <table className="w-full text-left border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Action</th>
                  <th className="p-2 border">Method</th>
                  <th className="p-2 border">Path</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border">Generate Payment Link</td>
                  <td className="p-2 border text-green-700 font-bold">POST</td>
                  <td className="p-2 border">https://paymeo.co/api/payment/&#123;invoice_code&#125;</td>
                </tr>
                <tr>
                  <td className="p-2 border">Verify Transaction</td>
                  <td className="p-2 border text-yellow-700 font-bold">GET</td>
                  <td className="p-2 border">https://paymeo.co/payment/callback?reference=&invoice=&api=true</td>
                </tr>
              </tbody>
            </table>

            {/* Generate Payment Link */}
            <h3 id="generate_payment_link" className="text-xl font-semibold mt-6 pt-16 -mt-16">Generate Payment Link</h3>
            <p>Use this endpoint to generate a redirect URL where the user can complete payment.</p>

            <h4 className="font-semibold">Sample Request (Node.js)</h4>
            <CodeHighlighter 
              code={`async function generatePaymentLink(invoice_code) {
  const response = await fetch(
    \`https://paymeo.co/api/payment/\${invoice_code}\`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_key': process.env.PAY_API_KEY
      },
      body: JSON.stringify({ invoice_code })
    }
  );
  return response.json();
}`}
              language="javascript"
            />

            <h4 className="font-semibold">Sample Request (PHP)</h4>
            <CodeHighlighter 
              code={`$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "{\$endpoint}/api/payment/{\$invoice_code}");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  'Content-Type: 'application/json',
  "api_key: {\$api_key}"
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['invoice_code' => \$invoice_code]));
$response = curl_exec($ch);`}
              language="php"
            />

            <h4 className="font-semibold">Sample Request (Python)</h4>
            <CodeHighlighter 
              code={`response = requests.post(
  f'https://paymeo.co/api/payment/{invoice_code}',
  headers={'Content-Type': 'application/json', 'api_key': api_key},
  json={'invoice_code': invoice_code}
)
print(response.json())`}
              language="python"
            />

            {/* Redirect Users - FIXED */}
            <h3 id="redirect_users" className="text-xl font-semibold mt-6 pt-16 -mt-16">Redirect Users</h3>
            <p>After receiving a success response, redirect the user to the provided URL:</p>
            
            <CodeHighlighter 
              code={`if (data.success) {
  window.location.href = data.url;
}`}
              language="javascript"
            />

            {/* Verify Transaction - FIXED */}
            <h3 id="verify_transaction" className="text-xl font-semibold mt-6 pt-16 -mt-16">Verify Transaction (Callback Handler)</h3>
            
            <h4 className="font-semibold">Node.js</h4>
            <CodeHighlighter 
              code={`async function verifyTransaction(ref, invoiceCode) {
  const res = await fetch(
    \`https://paymeo.co/payment/callback?reference=\${ref}&invoice=\${invoiceCode}&api=true\`,
    {
      method: 'GET',
      headers: { 'api_key': process.env.PAY_API_KEY }
    }
  );
  return res.json();
}`}
              language="javascript"
            />

            <h4 className="font-semibold">PHP</h4>
            <CodeHighlighter 
              code={`$ch = curl_init("https://paymeo.co/payment/callback?reference={\$ref}&invoice={\$invoice_code}&api=true");
curl_setopt($ch, CURLOPT_HTTPHEADER, ["api_key: {\$api_key}"]);
$response = curl_exec($ch);`}
              language="php"
            />

            <h4 className="font-semibold">Python</h4>
            <CodeHighlighter 
              code={`response = requests.get(
  'https://paymeo.co/payment/callback',
  headers={'api_key': api_key},
  params={'reference': reference, 'invoice': invoice_code, 'api': 'true'}
)
print(response.json())`}
              language="python"
            />

            {/* Error Codes */}
            <h2 id="error_codes_and_messages" className="text-2xl font-semibold pt-16 -mt-16">Error Codes & Messages</h2>
            <table className="w-full border border-gray-300 text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 border">Message</th>
                  <th className="p-2 border">Scenario</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border">Missing transaction reference</td>
                  <td className="p-2 border">reference or trxref query param is empty</td>
                </tr>
                <tr>
                  <td className="p-2 border">Transaction not successful</td>
                  <td className="p-2 border">Paystack verify returned non-success status</td>
                </tr>
                <tr>
                  <td className="p-2 border">Invoice is already paid</td>
                  <td className="p-2 border">Invoice marked paid in your system</td>
                </tr>
                <tr>
                  <td className="p-2 border">Invalid API Key provided</td>
                  <td className="p-2 border">Header api_key missing or not found</td>
                </tr>
              </tbody>
            </table>

            {/* Best Practices */}
            <h2 id="best_practices" className="text-2xl font-semibold pt-16 -mt-16">Best Practices</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Always serve these endpoints over HTTPS.</li>
              <li>Keep your <code>api_key</code> and Paystack secret key secure.</li>
              <li>Validate all incoming parameters.</li>
              <li>Implement retry logic for network failures.</li>
            </ul>

            {/* Support */}
            <h2 id="support" className="text-2xl font-semibold pt-16 -mt-16">Support</h2>
            <p>
              For further assistance, contact our support team through your dashboard or email{' '}
              <a href="mailto:company@paymeo.co" className="text-blue-600 hover:underline">
                company@paymeo.co
              </a>.
            </p>

            <footer className="pt-6 text-sm text-gray-500 border-t mt-8">
              All Rights Reserved (c) 2025{' '}
              <a href="https://www.paymeo.co" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Weperch Technologies Inc.
              </a>
            </footer>
          </div>
        </section>
      </main>

      <TawkTo />
    </div>
  );
};

export default APIDocumentation;