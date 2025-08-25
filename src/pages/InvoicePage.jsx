import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import InvoiceHeader from '../components/invoice/InvoiceHeader';
import InvoiceForm from '../components/invoice/InvoiceForm';
import InvoiceTable from '../components/invoice/InvoiceTable';
import InvoiceFooter from '../components/invoice/InvoiceFooter';
import AddItemModal from '../components/modals/AddItemModal';
import AddRecipientModal from '../components/modals/AddRecipientModal';
import ShareModal from '../components/modals/ShareModal';
import TemplateModal from '../components/modals/TemplateModal';
import { showToast } from '../utils/helpers';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import api from './../utils/api';
import useDashboardData from '../contexts/userDashboardData';

const InvoicePage = () => {
  const { currentUser } = useAuth();
  const { data, loading, error } = useDashboardData();

  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    currentDate: new Date().toLocaleDateString(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    currency: currentUser?.currency || 'NGN',
    items: [],
    recipient: null,
    companyDetails: null
  });

  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddRecipientModal, setShowAddRecipientModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeInvoice();
    loadCompanyDetails();
  }, []);

  const initializeInvoice = async () => {
    try {
      // Generate invoice number
    
      const response = await api.post('/generateInvoiceNumber');

      const data = await response.data;
      if (data.success) {
        setInvoiceData(prev => ({
          ...prev,
          invoiceNumber: data.invoiceNumber
        }));
      }
    } catch (error) {
      showToast('Failed to generate invoice number', 'error');
    }
  };

  const loadCompanyDetails = async () => {
    try {
    
        const userDataFetch = localStorage.getItem('userData');
        const accountDetails = localStorage.getItem('accountDetails');
      
        if (!userDataFetch) throw new Error('User data not found');
       const userData = JSON.parse(userDataFetch);
      

      // const response = await api.get(`/company/info/${userData.company_id}`);
      // const dataRES = await response.data;
      // console.log(dataRES)
      // if (dataRES.success) {
        setInvoiceData(prev => ({
          ...prev,
          companyDetails: userData,
          accountDetails: JSON.parse(accountDetails) ? JSON.parse(accountDetails) : null
        }));
      // }
    } catch (error) {
      showToast('Failed to load company details', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (itemData) => {
    try {
      const response = await api.post('/saveItem', {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...itemData,
          invoiceNumber: invoiceData.invoiceNumber
        })
      });

      const data = await response.data;
      
      if (data.success) {
        setInvoiceData(prev => ({
          ...prev,
          items: [...prev.items, { ...itemData, id: data.itemId }]
        }));
        
        showToast('Item added successfully', 'success');
        setShowAddItemModal(false);
      } else {
        showToast(data.error, 'error');
      }
    } catch (error) {
      showToast('Network error. Please try again.', 'error');
    }
  };

  const deleteItem = async (itemId) => {
    try {
      const response = await api.post('/deleteItem', {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          itemId,
          invoiceNumber: invoiceData.invoiceNumber
        })
      });

      const data = await response.data;

      if (data.success) {
        setInvoiceData(prev => ({
          ...prev,
          items: prev.items.filter(item => item.id !== itemId)
        }));
        
        showToast('Item deleted successfully', 'success');
      } else {
        showToast(data.error, 'error');
      }
    } catch (error) {
      showToast('Network error. Please try again.', 'error');
    }
  };

  const saveRecipient = async (recipientData) => {
    try {
      // Save recipient to cookies or backend
      localStorage.setItem('recipient', JSON.stringify(recipientData));
      
      setInvoiceData(prev => ({
        ...prev,
        recipient: recipientData
      }));
      
      showToast('Recipient saved successfully', 'success');
      setShowAddRecipientModal(false);
    } catch (error) {
      showToast('Failed to save recipient', 'error');
    }
  };

  const saveInvoice = async () => {
    try {
      const response = await fetch('/saveInvoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          invoiceNumber: invoiceData.invoiceNumber,
          items: invoiceData.items,
          recipient: invoiceData.recipient
        })
      });

      const data = await response.json();
      
      if (data.success) {
        showToast('Invoice saved successfully', 'success');
      } else {
        showToast(data.error, 'error');
      }
    } catch (error) {
      showToast('Network error. Please try again.', 'error');
    }
  };

  const clearAllItems = () => {
    setInvoiceData(prev => ({
      ...prev,
      items: []
    }));
    showToast('All items cleared', 'info');
  };

  const generatePDF = async (templateId) => {
    try {
      // Create a clean version of the invoice for printing
      const printContainer = document.createElement('div');
      printContainer.className = 'print-container';
      printContainer.style.width = '210mm';
      printContainer.style.padding = '20mm';
      printContainer.style.boxSizing = 'border-box';
      printContainer.style.position = 'absolute';
      printContainer.style.left = '-9999px';
      printContainer.style.top = '0';
      printContainer.style.background = 'white';
      printContainer.style.fontFamily = "'Arial', 'Helvetica', sans-serif";
      
      // Create the clean invoice HTML
      printContainer.innerHTML = `
        <div class="invoice-print">
          <div class="invoice-header">
            <div class="company-info">
              <h2>${invoiceData.companyDetails?.company_name || 'Your Company'}</h2>
              <p>${invoiceData.companyDetails?.company_address || 'Company Address'}</p>
              <p>${invoiceData.companyDetails?.email || 'email@company.com'}</p>
              <p>${invoiceData.companyDetails?.phone || 'Phone Number'}</p>
            </div>
            <div class="invoice-meta">
              <h1>INVOICE</h1>
              <p><strong>Invoice #:</strong> ${invoiceData.invoiceNumber}</p>
              <p><strong>Date:</strong> ${invoiceData.currentDate}</p>
              <p><strong>Due Date:</strong> ${invoiceData.dueDate}</p>
            </div>
          </div>
          
          <div class="invoice-parties">
            <div class="bill-to">
              <h3>Bill To:</h3>
              ${invoiceData.recipient ? `
                <p><strong>${invoiceData.recipient.name}</strong></p>
                <p>${invoiceData.recipient.email}</p>
                <p>${invoiceData.recipient.phone || ''}</p>
                <p>${invoiceData.recipient.address || ''}</p>
              ` : '<p>No recipient information</p>'}
            </div>
          </div>
          
          <table class="invoice-items">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceData.items.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>${formatCurrency(item.price, invoiceData.currency)}</td>
                  <td>${formatCurrency(item.price * item.quantity, invoiceData.currency)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="invoice-totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${formatCurrency(calculateSubtotal(), invoiceData.currency)}</span>
            </div>
            <div class="total-row">
              <span>Tax (${invoiceData.companyDetails?.taxRate || 0}%):</span>
              <span>${formatCurrency(calculateTax(), invoiceData.currency)}</span>
            </div>
            <div class="total-row grand-total">
              <span>Total:</span>
              <span>${formatCurrency(calculateTotal(), invoiceData.currency)}</span>
            </div>
          </div>
          
          <div class="invoice-footer">
            <p>Thank you for your business!</p>
            ${invoiceData.companyDetails?.bankDetails ? `
              <div class="bank-details">
                <p><strong>Bank Transfer Details:</strong></p>
                <p>${invoiceData.companyDetails.bankDetails}</p>
              </div>
            ` : ''}
            ${invoiceData.companyDetails?.terms ? `
              <div class="terms">
                <p><strong>Terms & Conditions:</strong></p>
                <p>${invoiceData.companyDetails.terms}</p>
              </div>
            ` : ''}
          </div>
        </div>
      `;
      
      // Add some basic styles for the print version
      const style = document.createElement('style');
      style.textContent = `
        .invoice-print {
          font-family: Arial, sans-serif;
          color: #333;
        }
        .invoice-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
        }
        .invoice-meta h1 {
          color: #333;
          margin: 0 0 10px 0;
        }
        .invoice-parties {
          margin-bottom: 30px;
        }
        .invoice-items {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .invoice-items th {
          background-color: #f8f9fa;
          padding: 10px;
          text-align: left;
          border-bottom: 2px solid #dee2e6;
        }
        .invoice-items td {
          padding: 10px;
          border-bottom: 1px solid #dee2e6;
        }
        .invoice-totals {
          width: 100%;
          max-width: 300px;
          margin-left: auto;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
        }
        .grand-total {
          font-weight: bold;
          font-size: 1.2em;
          border-top: 2px solid #333;
          margin-top: 10px;
          padding-top: 10px;
        }
        .invoice-footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #dee2e6;
          font-size: 0.9em;
        }
      `;
      printContainer.appendChild(style);
      
      document.body.appendChild(printContainer);
      
      // Wait for rendering
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Convert to PDF
      const canvas = await html2canvas(printContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      // Remove the temporary container
      document.body.removeChild(printContainer);
      
      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoiceData.invoiceNumber}-${templateId}.pdf`);
      
      return true;
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast('Failed to generate PDF', 'error');
      return false;
    }
  };

  const handlePrintWithTemplate = async (templateId) => {
    setIsLoading(true);
    setShowTemplateModal(false);
    
    try {
      showToast(`Generating PDF with ${templateId} template...`, 'info');
      
      // Generate PDF using the selected template
      const success = await generatePDF(templateId);
      
      if (success) {
        showToast('PDF downloaded successfully!', 'success');
      } else {
        showToast('Failed to generate PDF', 'error');
      }
      
    } catch (error) {
      showToast('Failed to generate PDF', 'error');
      console.error('PDF generation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const taxRate = invoiceData.companyDetails?.taxRate || 0;
    return subtotal * (taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const formatCurrency = (amount, currency = 'NGN') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
    

        {/* Invoice Container */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 md:p-8">
            <InvoiceHeader
              invoiceNumber={invoiceData.invoiceNumber}
              companyDetails={invoiceData.companyDetails}
              currentDate={invoiceData.currentDate}
              dueDate={invoiceData.dueDate}
              currency={invoiceData.currency}
            />

            <div className="my-8 border-t border-gray-200"></div>

            <InvoiceForm
              recipient={invoiceData.recipient}
              onAddRecipient={() => setShowAddRecipientModal(true)}
              brandData={currentUser?.brandData}
            />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 my-8">
              <button
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setShowAddItemModal(true)}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Item
              </button>
              <button
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                onClick={() => setShowTemplateModal(true)}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m4 4h6a2 2 0 002-2v-4a2 2 0 00-2-2h-6a2 2 0 00-2 2v4a2 2 0 002 2z" />
                </svg>
                Print/Download
              </button>
              <button
                className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                onClick={clearAllItems}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear All
              </button>
              <button
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={saveInvoice}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Invoice
              </button>
              <button
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setShowShareModal(true)}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>

            <InvoiceTable
              items={invoiceData.items}
              currency={invoiceData.currency}
              onDeleteItem={deleteItem}
            />

            <InvoiceFooter
              items={invoiceData.items}
              currency={invoiceData.currency}
              companyDetails={invoiceData.accountDetails}
              brandData={currentUser?.brandData}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddItemModal
        show={showAddItemModal}
        onHide={() => setShowAddItemModal(false)}
        onAddItem={addItem}
        currency={invoiceData.currency}
      />

      <AddRecipientModal
        show={showAddRecipientModal}
        onHide={() => setShowAddRecipientModal(false)}
        onSaveRecipient={saveRecipient}
      />

   
<ShareModal
  show={showShareModal}
  onHide={() => setShowShareModal(false)}
  invoiceData={invoiceData}
  currentUser={currentUser}
/>
      <TemplateModal
        show={showTemplateModal}
        onHide={() => setShowTemplateModal(false)}
        onSelectTemplate={handlePrintWithTemplate}
      />
    </div>
  );
};

export default InvoicePage;