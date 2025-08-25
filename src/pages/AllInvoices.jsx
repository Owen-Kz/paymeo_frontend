import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../utils/helpers';
import Handlebars from 'handlebars';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import TemplateModal from '../components/modals/TemplateModal';
import api from "../utils/api"
import useDashboardData from '../contexts/userDashboardData';

// Register Handlebars helpers
Handlebars.registerHelper('multiply', (a, b) => a * b);
Handlebars.registerHelper('calculateTax', (amount, rate) => amount * (rate / 100));
Handlebars.registerHelper('daysBetween', (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

const AllInvoicesPage = () => {
  const { currentUser } = useAuth();
  const { dashboardData } = useDashboardData();
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templates, setTemplates] = useState({});
  const [displayCurrency, setDisplayCurrency] = useState('NGN'); // Default to Naira
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  
  // Get view mode from localStorage or default to 'list'
  const [viewMode, setViewMode] = useState(() => {
    const savedViewMode = localStorage.getItem('invoiceViewMode');
    return savedViewMode || 'list';
  });

  // Save view mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('invoiceViewMode', viewMode);
  }, [viewMode]);

  // Set initial display currency based on dashboard data
  useEffect(() => {
    if (dashboardData?.currency) {
      setDisplayCurrency(dashboardData.currency);
    }
  }, [dashboardData]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter, viewMode]);

  // Calculate pagination data
  const totalItems = filteredInvoices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Get current items for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Invoice templates data
  const invoiceTemplates = [
    {
      id: 'modern-classic',
      name: 'Modern Classic',
      description: 'Clean and professional design with modern typography',
      preview: '/assets/templates/modern-classic-preview.png',
      category: 'Professional'
    },
    {
      id: 'minimalist',
      name: 'Minimalist',
      description: 'Simple and elegant design with focus on content',
      preview: '/assets/templates/minimalist-preview.png',
      category: 'Simple'
    },
    {
      id: 'corporate',
      name: 'Corporate',
      description: 'Formal design suitable for corporate clients',
      preview: '/assets/templates/corporate-preview.png',
      category: 'Business'
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Colorful and creative design for creative industries',
      preview: '/assets/templates/creative-preview.png',
      category: 'Creative'
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Luxury design with premium styling and details',
      preview: '/assets/templates/premium-preview.png',
      category: 'Premium'
    }
  ];

  // Load templates function
  const loadTemplates = useCallback(async () => {
    try {
      const templateFiles = [
        'modern-classic',
        'minimalist',
        'corporate',
        'creative',
        'premium'
      ];
      
      const loadedTemplates = {};
      
      for (const templateName of templateFiles) {
        try {
          // Fetch from public directory
          const response = await fetch(`/templates/${templateName}.hbs`);
          if (response.ok) {
            const templateContent = await response.text();
            loadedTemplates[templateName] = Handlebars.compile(templateContent);
            console.log(`Successfully loaded template: ${templateName}`);
          } else {
            console.warn(`Template ${templateName} not found`);
          }
        } catch (error) {
          console.error(`Error loading template ${templateName}:`, error);
        }
      }
      
      setTemplates(loadedTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  }, []);

  // Load templates on component mount
  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  // Fetch invoices from API
  useEffect(() => {
    const fetchInvoices = async () => {
      setIsLoading(true);
      try {
        // Make POST request to /myinvoice endpoint
        const response = await api.post('/myInvoices');
        
        if (response.data.success) {
          setInvoices(response.data.invoices || []);
          setFilteredInvoices(response.data.invoices || []);
        } else {
          showToast('Failed to load invoices', 'error');
          // Fallback to empty array if API fails
          setInvoices([]);
          setFilteredInvoices([]);
        }
      } catch (error) {
        console.error('Error fetching invoices:', error);
        showToast('Failed to load invoices', 'error');
        // Fallback to empty array if API fails
        setInvoices([]);
        setFilteredInvoices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  useEffect(() => {
    filterInvoices();
  }, [searchTerm, statusFilter, dateFilter, invoices]);

  const filterInvoices = () => {
    let filtered = invoices;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(invoice =>
        invoice.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.client_email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }

    // Date filter (simplified)
    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(invoice => {
        const invoiceDate = new Date(invoice.date);
        switch (dateFilter) {
          case 'today':
            return invoiceDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.setDate(now.getDate() - 7));
            return invoiceDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
            return invoiceDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredInvoices(filtered);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      paid: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      overdue: "bg-red-100 text-red-800",
      draft: "bg-gray-100 text-gray-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || statusStyles.draft}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Draft'}
      </span>
    );
  };

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';

  let date;

  // Case 1: SQL datetime format (YYYY-MM-DD HH:mm:ss)
  if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
    date = new Date(dateString.replace(' ', 'T')); // replace space with T for proper parsing
  } 
  // Case 2: DD-MM-YYYY format
  else if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
    const [day, month, year] = dateString.split('-').map(Number);
    date = new Date(year, month - 1, day);
  } 
  // Fallback
  else {
    date = new Date(dateString);
  }

  if (isNaN(date)) return 'Invalid Date';

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};


  const formatCurrency = (amount, currency = displayCurrency) => {
    if (!amount) return displayCurrency === 'NGN' ? '₦0.00' : '$0.00';
    
    // Use appropriate symbol based on currency
    const options = {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    };
    
    return new Intl.NumberFormat(currency === 'NGN' ? 'en-NG' : 'en-US', options).format(amount);
  };

  // Function to convert currency (simplified - in real app, use actual exchange rates)
  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return amount;
    
    // Simplified conversion rates (replace with real API call in production)
    const conversionRates = {
      NGN: { USD: 0.0012 }, // 1 NGN = 0.0012 USD
      USD: { NGN: 833.33 }  // 1 USD = 833.33 NGN
    };
    
    if (conversionRates[fromCurrency] && conversionRates[fromCurrency][toCurrency]) {
      return amount * conversionRates[fromCurrency][toCurrency];
    }
    
    return amount; // Fallback to original amount if conversion not available
  };

const getTotalStats = async () => {
  try {
    const response = await api.post('/myTotalInvoices');
    
    if(response.data.success) {
      const invoices = response.data.invoices;


    const total = invoices.length;
    const paid = invoices.filter(i => i.status === 'paid').length;
    const pending = invoices.filter(i => i.status === 'pending').length;
    const overdue = invoices.filter(i => i.status === 'overdue').length;

    const totalAmount = invoices.reduce((sum, invoice) => {
      const amountInDisplayCurrency = convertCurrency(
        invoice.amount || 0, 
        invoice.currency || 'NGN', 
        displayCurrency
      );
      return sum + amountInDisplayCurrency;
    }, 0);

    const paidAmount = invoices
      .filter(i => i.status === 'paid')
      .reduce((sum, invoice) => {
        const amountInDisplayCurrency = convertCurrency(
          invoice.amount || 0, 
          invoice.currency || 'NGN', 
          displayCurrency
        );
        return sum + amountInDisplayCurrency;
      }, 0);

    return { total, paid, pending, overdue, totalAmount, paidAmount };
   }
  } catch (error) {
    console.error('Error fetching total stats:', error);
  }
  
  return { total: 0, paid: 0, pending: 0, overdue: 0, totalAmount: 0, paidAmount: 0 };
};
  const toggleCurrency = () => {
    setDisplayCurrency(prev => prev === 'NGN' ? 'USD' : 'NGN');
  };

  const generatePDF = async (invoiceData, templateId) => {
    if (!templates[templateId]) {
      showToast('Template not found', 'error');
      return false;
    }

    try {
      // Compile the template with invoice data
      const htmlContent = templates[templateId](invoiceData);
      
      // Create a temporary container with proper styling for PDF
      const tempDiv = document.createElement('div');
      tempDiv.style.width = '210mm'; // A4 width
      tempDiv.style.minHeight = '297mm'; // A4 height
      tempDiv.style.padding = '20px';
      tempDiv.style.boxSizing = 'border-box';
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.background = 'white';
      tempDiv.style.fontFamily = "'Arial', 'Helvetica', sans-serif"; // Use web-safe fonts
      
      // Inject the HTML content
      tempDiv.innerHTML = htmlContent;
      document.body.appendChild(tempDiv);
      
      // Wait for images to load (if any)
      const images = tempDiv.getElementsByTagName('img');
      if (images.length > 0) {
        await Promise.all(Array.from(images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
        }));
      }
      
      // Add a small delay to ensure proper rendering
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Convert HTML to canvas then to PDF
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      // Remove the temporary div
      document.body.removeChild(tempDiv);
      
      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoiceData.invoice_number}-${templateId}.pdf`);
      
      return true;
    } catch (error) {
      console.error('Error generating PDF:', error);
      
      // Fallback: Create a simple text-based PDF
      try {
        const pdf = new jsPDF();
        pdf.setFontSize(16);
        pdf.text(`INVOICE: ${invoiceData.invoice_number}`, 20, 20);
        pdf.setFontSize(12);
        pdf.text(`Client: ${invoiceData.client_name}`, 20, 30);
        pdf.text(`Amount: ${formatCurrency(invoiceData.amount, invoiceData.currency)}`, 20, 40);
        pdf.text(`Status: ${invoiceData.status}`, 20, 50);
        pdf.text(`Date: ${formatDate(invoiceData.date)}`, 20, 60);
        pdf.text(`Due Date: ${formatDate(invoiceData.due_date)}`, 20, 70);
        
        // Add items
        let yPosition = 90;
        pdf.text('Items:', 20, yPosition);
        yPosition += 10;
        
        invoiceData.items?.forEach((item, index) => {
          if (yPosition > 250) {
            pdf.addPage();
            yPosition = 20;
          }
          
          pdf.text(`${item.description} - Qty: ${item.quantity} - Price: ${formatCurrency(item.price, invoiceData.currency)}`, 20, yPosition);
          yPosition += 10;
        });
        
        pdf.save(`${invoiceData.invoice_number}-simple.pdf`);
        showToast('PDF downloaded (simple format)', 'info');
        return true;
      } catch (fallbackError) {
        console.error('Fallback PDF generation also failed:', fallbackError);
        showToast('Failed to generate PDF', 'error');
        return false;
      }
    }
  };

  const handleDownloadPDF = async (templateId) => {
    if (!selectedInvoice) return;

    setIsLoading(true);
    setShowTemplateModal(false);
    
    try {
      showToast(`Generating PDF with ${invoiceTemplates.find(t => t.id === templateId)?.name} template...`, 'info');
      
      // Generate PDF using the selected template
      const success = await generatePDF(selectedInvoice, templateId);
      
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

  const openTemplateModal = () => {
    setShowTemplateModal(true);
  };
// Add state for stats
const [stats, setStats] = useState({
  total: 0,
  paid: 0,
  pending: 0,
  overdue: 0,
  totalAmount: 0,
  paidAmount: 0
});

// Add useEffect to fetch stats
const [isStatsLoading, setIsStatsLoading] = useState(false);

useEffect(() => {

// In your useEffect:
const fetchStats = async () => {
  setIsStatsLoading(true);
  try {
    const statsData = await getTotalStats();
    setStats(statsData);
  } catch (error) {
    console.error('Error fetching stats:', error);
  } finally {
    setIsStatsLoading(false);
  }
};

  fetchStats();
}, [displayCurrency]); // Re-fetch when currency changes

// Also re-fetch when invoices change
useEffect(() => {
  const fetchStats = async () => {
    try {
      const statsData = await getTotalStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  fetchStats();
}, [invoices, displayCurrency]);



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-lg p-4 shadow">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">All Invoices</h1>
              <p className="text-gray-500 mt-1">Manage and track all your invoices</p>
            </div>
            <Link
              to="/new/invoice"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              New Invoice
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
  <div className="flex flex-col mb-6">
  {/* First row - First 3 cards */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
    {/* Total Invoices */}
    <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Total Invoices</p>
          {isStatsLoading ? (
            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          )}
        </div>
        <div className="p-2 bg-blue-100 rounded-lg">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
      </div>
    </div>

    {/* Paid */}
    <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Paid</p>
          {isStatsLoading ? (
            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
          ) : (
            <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
          )}
        </div>
        <div className="p-2 bg-green-100 rounded-lg">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      </div>
    </div>

    {/* Pending */}
    <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Pending</p>
          {isStatsLoading ? (
            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
          ) : (
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          )}
        </div>
        <div className="p-2 bg-yellow-100 rounded-lg">
          <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>
    </div>
  </div>

  {/* Second row - Total Amount card (full width when needed) */}
  <div className="w-full">
    <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Total Amount</p>
          <div className="flex items-center gap-2">
            {isStatsLoading ? (
              <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
            ) : (
              <>
                <p className="text-2xl font-bold text-gray-800 break-all min-w-0">
                  {formatCurrency(stats.totalAmount)}
                </p>
                <button
                  onClick={toggleCurrency}
                  className="flex-shrink-0 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                  title={`Switch to ${displayCurrency === 'NGN' ? 'USD' : 'NGN'}`}
                >
                  {displayCurrency === 'NGN' ? 'USD' : 'NGN'}
                </button>
              </>
            )}
          </div>
        </div>
        <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>
    </div>
  </div>
</div>

        {/* Rest of the component remains the same */}
        {/* Filters and Search */}
        <div className="bg-white rounded-lg p-4 shadow border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex-1 w-full">
              <label htmlFor="search" className="sr-only">Search invoices</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  placeholder="Search by invoice number, client name, or email..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="draft">Draft</option>
              </select>

              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>

              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`}
                  onClick={() => setViewMode('list')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                  </svg>
                </button>
                <button
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} of {totalItems} invoices
            {(searchTerm || statusFilter !== 'all' || dateFilter !== 'all') && ' (filtered)'}
          </p>
        </div>

        {/* Invoices List */}
        {filteredInvoices.length === 0 ? (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No invoices found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDateFilter('all');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : viewMode === 'list' ? (
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {currentItems.map(invoice => (
                <div
                  key={invoice.id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-150 cursor-pointer group"
                  onClick={() => setSelectedInvoice(invoice)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {invoice.invoice_number}
                      </span>
                      {getStatusBadge(invoice.status)}
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(
                        convertCurrency(invoice.amount || 0, invoice.currency || 'NGN', displayCurrency),
                        displayCurrency
                      )}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-600">
                      {invoice.client_name} • {invoice.client_email}
                    </div>
                    <div className="text-sm text-gray-500">
                      Issued: {formatDate(invoice.date)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Due: {formatDate(invoice.due_date)}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-blue-600 font-medium flex items-center">
                        View details
                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map(invoice => (
              <div
                key={invoice.id}
                className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer group"
                onClick={() => setSelectedInvoice(invoice)}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {invoice.invoice_number}
                  </span>
                  {getStatusBadge(invoice.status)}
                </div>

                <div className="mb-4">
                  <p className="text-lg font-bold text-gray-900 mb-1">
                    {formatCurrency(
                      convertCurrency(invoice.amount || 0, invoice.currency || 'NGN', displayCurrency),
                      displayCurrency
                    )}
                  </p>
                  <p className="text-sm text-gray-600">{invoice.client_name}</p>
                  <p className="text-xs text-gray-500">{invoice.client_email}</p>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Issued: {formatDate(invoice.date)}</span>
                    <span>Due: {formatDate(invoice.due_date)}</span>
                  </div>
                </div>

                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-blue-600 font-medium flex items-center justify-center">
                    View details
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button 
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded border ${currentPage === 1 ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={`px-3 py-1 rounded ${currentPage === page ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                >
                  {page}
                </button>
              ))}
              
              <button 
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded border ${currentPage === totalPages ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Invoice Details</h2>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Invoice Number</p>
                  <p className="font-semibold">{selectedInvoice.invoice_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p>{getStatusBadge(selectedInvoice.status)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Client</p>
                  <p className="font-semibold">{selectedInvoice.client_name}</p>
                  <p className="text-sm text-gray-600">{selectedInvoice.client_email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-semibold text-lg">
                    {formatCurrency(
                      convertCurrency(selectedInvoice.amount || 0, selectedInvoice.currency || 'NGN', displayCurrency),
                      displayCurrency
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Issue Date</p>
                  <p>{formatDate(selectedInvoice.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p>{formatDate(selectedInvoice.due_date)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Items</p>
                <div className="border rounded-lg divide-y">
                  {selectedInvoice.items?.map((item, index) => (
                    <div key={index} className="p-3 flex justify-between">
                      <div>
                        <p className="font-medium">{item.description}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p>
                        {formatCurrency(
                          convertCurrency(item.price * item.quantity, selectedInvoice.currency || 'NGN', displayCurrency),
                          displayCurrency
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  onClick={openTemplateModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Download PDF
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Send Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Selection Modal */}
    
      {showTemplateModal && (
         <TemplateModal
             show={showTemplateModal}
             onHide={() => setShowTemplateModal(false)}
             onSelectTemplate={handleDownloadPDF}
           />   
      )}
    </div>
  );
};

export default AllInvoicesPage;