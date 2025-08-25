// src/components/modals/ShareModal.jsx
import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { showToast } from '../../utils/helpers';

const ShareModal = ({ show, onHide, invoiceData, currentUser }) => {
  const [activeTab, setActiveTab] = useState('link');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const shareUrl = `${window.location.origin}/invoice/v1/${invoiceData.invoiceNumber}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    showToast('Link copied to clipboard!', 'success');
  };

  const shareViaEmail = () => {
    const subject = `Invoice ${invoiceData.invoiceNumber} from ${currentUser?.company_name || 'Your Company'}`;
    const body = `Please find your invoice attached.\n\nView online: ${shareUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const shareViaWhatsApp = () => {
    const text = `Here's your invoice: ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const generatePDF = async (templateId = 'modern-classic') => {
    setIsGeneratingPDF(true);
    
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
              <h2>${invoiceData.companyDetails?.name || 'Your Company'}</h2>
              <p>${invoiceData.companyDetails?.address || 'Company Address'}</p>
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
      
      // Convert PDF to blob for sharing
      const pdfBlob = pdf.output('blob');
      return pdfBlob;
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  };

  const sharePDF = async (templateId = 'modern-classic') => {
    try {
      const pdfBlob = await generatePDF(templateId);
      
      if (navigator.share) {
        // Web Share API is available
        const file = new File([pdfBlob], `invoice-${invoiceData.invoiceNumber}.pdf`, { type: 'application/pdf' });
        
        await navigator.share({
          title: `Invoice ${invoiceData.invoiceNumber}`,
          text: `Invoice from ${currentUser?.company_name || 'Your Company'}`,
          files: [file]
        });
        
        showToast('Invoice shared successfully!', 'success');
      } else {
        // Fallback: Download the PDF
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${invoiceData.invoiceNumber}-${templateId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('PDF downloaded successfully!', 'success');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing PDF:', error);
        showToast('Failed to share PDF', 'error');
      }
    } finally {
      setIsGeneratingPDF(false);
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

  const invoiceTemplates = [
    {
      id: 'modern-classic',
      name: 'Modern Classic',
      description: 'Clean and professional design',
      category: 'Professional'
    },
    {
      id: 'minimalist',
      name: 'Minimalist',
      description: 'Simple and elegant design',
      category: 'Simple'
    },
    {
      id: 'corporate',
      name: 'Corporate',
      description: 'Formal design for business',
      category: 'Business'
    }
  ];

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-5 py-3">
          <h5 className="text-lg font-semibold text-gray-800">Share Invoice</h5>
          <button
            onClick={onHide}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex px-5">
            <button
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'link' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('link')}
            >
              Share Link
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'pdf' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('pdf')}
            >
              Share PDF
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          {activeTab === 'link' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shareable Link
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 rounded-l-lg border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={shareViaEmail}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  Email
                </button>
                <button
                  onClick={shareViaWhatsApp}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg transition"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.864 3.488"/>
                  </svg>
                  WhatsApp
                </button>
              </div>
            </div>
          )}

          {activeTab === 'pdf' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Choose a template for your PDF invoice:
              </p>

              <div className="grid grid-cols-1 gap-3">
                {invoiceTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => sharePDF(template.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">{template.name}</h4>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {template.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {isGeneratingPDF && (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm text-gray-600">Generating PDF...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;