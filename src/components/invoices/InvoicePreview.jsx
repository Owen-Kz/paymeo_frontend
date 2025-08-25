// src/pages/InvoicePreview.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showToast } from '../../utils/helpers';

const InvoicePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    loadInvoiceData();
  }, [id]);

  const loadInvoiceData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/invoice/view?id=${id}`);
      const data = await response.json();
      
      if (data.success) {
        setInvoice(data.invoice);
      } else {
        showToast('Invoice not found', 'error');
        // navigate('/');
      }
    } catch (error) {
      showToast('Failed to load invoice', 'error');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    setIsPaying(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/pay/${invoice.invoice_code}`);
      const data = await response.json();
      
      if (data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        showToast('Payment initialization failed', 'error');
      }
    } catch (error) {
      showToast('Payment processing error', 'error');
    } finally {
      setIsPaying(false);
    }
  };

  const formatAmount = (amount) => {
    return new Number(amount).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="container-fluid">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container-fluid">
        <div className="text-center py-5">
          <h4>Invoice not found</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="card overflow-hidden invoice-application">
        <div className="d-flex">
          <div className="w-100 w-xs-100 chat-container">
            <div className="invoice-inner-part h-100">
              <div className="invoiceing-box">
                <div className="invoice-header d-flex align-items-center border-bottom p-3">
                  <h4 className="text-uppercase mb-0">Invoice</h4>
                  <div className="ms-auto">
                    <h4 className="invoice-number">{invoice.invoice_number}</h4>
                  </div>
                </div>

                <div className="p-3" id="custom-invoice">
                  <div className="invoice-123" id="printableArea">
                    <container className="body">
                      {/* Header */}
                      <header>
                        <div className="company_logo">
                          <div className="logoImage">
                            <img
                              src={invoice.company_logo}
                              alt="Company Logo"
                              className="img-fluid"
                            />
                          </div>
                          <div className="logo_right">
                            <div className="name">{invoice.company_name}</div>
                            <div className="reg_number">{invoice.reg_number}</div>
                          </div>
                        </div>
                        <div>
                          <h3>INVOICE</h3>
                        </div>
                      </header>

                      <main>
                        {/* Company Contact and Dates */}
                        <div className="sub_header">
                          <div className="company_contact">
                            <div className="address">{invoice.company_address}</div>
                            <div className="phonenumber">{invoice.company_phone}</div>
                            <div className="email">{invoice.company_email}</div>
                            <div className="website">{invoice.company_website}</div>
                          </div>

                          <div className="date_container">
                            <ul>
                              <li>Date: <div className="box">{invoice.issue_date}</div></li>
                              <li>Invoice Number: <div className="box">{invoice.invoice_number}</div></li>
                              <li>Due Date: <div className="box">{invoice.due_date}</div></li>
                            </ul>
                          </div>
                        </div>

                        {/* Bill To */}
                        <div className="bill_to">
                          <div className="bill_to_header">Bill To</div>
                          <div className="bill_to_body">
                            <ul>
                              <li>{invoice.recipient_name}</li>
                              <li>{invoice.recipient_company}</li>
                              <li>{invoice.recipient_phone}</li>
                              <li>
                                <a href={`mailto:${invoice.recipient_email}`} style={{ color: 'inherit' }}>
                                  {invoice.recipient_email}
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>

                        {/* Items Table */}
                        <div className="table">
                          <div className="thead">
                            <div className="th first_column">Description</div>
                            <div className="th second_column">Qty</div>
                            <div className="th third_column">Rate</div>
                            <div className="th fourth_column">Amount</div>
                          </div>

                          <div className="tbody">
                            {invoice.items.map((item, index) => (
                              <div key={index} className="tRow">
                                <div className="td first_column">{item.description}</div>
                                <div className="td second_column">{item.quantity}</div>
                                <div className="td third_column">
                                  {invoice.currency} {formatAmount(item.rate)}
                                </div>
                                <div className="td fourth_column">
                                  {invoice.currency} {formatAmount(item.amount)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="footer">
                          <div className="footer-left">
                            <div className="left-header">
                              <u>Payment Details</u>
                            </div>
                            <ul>
                              <li>Account No: <span>{invoice.bank_account}</span></li>
                              <li>Account Name: <span>{invoice.bank_account_name}</span></li>
                              <li>Bank Name: <span>{invoice.bank_name}</span></li>
                              {invoice.swift_code && (
                                <li>Swift Code: <span>{invoice.swift_code}</span></li>
                              )}
                              {invoice.bank_address && (
                                <li>Bank Address: <span>{invoice.bank_address}</span></li>
                              )}
                            </ul>
                          </div>

                          <div className="footer-right">
                            <ul>
                              <li>Subtotal: <span>{invoice.currency} {formatAmount(invoice.subtotal)}</span></li>
                              <li>Discount: <span>{invoice.currency} {formatAmount(invoice.discount)}</span></li>
                              <li>Total: <span>{invoice.currency} {formatAmount(invoice.total)}</span></li>
                            </ul>
                          </div>
                        </div>

                        {/* Amount in Words */}
                        <div className="amount_in_words">
                          <div className="top">
                            <span className="amountWords">Amount In Words:</span>
                            <div className="line_container">{invoice.amount_in_words}</div>
                          </div>
                        </div>

                        {/* Signatory */}
                        <div className="signatory">
                          <div className="name_and_sign">
                            <div className="signature">
                              <img
                                src={invoice.signature}
                                alt="Signature"
                                className="img-fluid"
                              />
                            </div>
                            <div className="name_container">{invoice.signatory_name}</div>
                          </div>
                          <div className="company_name_sign">
                            For <span>{invoice.company_name}</span>
                          </div>
                        </div>

                        <footer>
                          <center>
                            <small>
                              Powered by{' '}
                              <a href="https://www.paymeo.co" target="_blank" rel="noopener noreferrer">
                                Weperch Technologies LLC
                              </a>
                            </small>
                          </center>
                        </footer>
                      </main>
                    </container>
                  </div>

                  <div className="clearfix"></div>
                  <hr />
                  
                  <div className="text-end">
                    <button
                      className="btn btn-primary btn-default ms-6"
                      id="paymentButton"
                      onClick={handlePayment}
                      disabled={isPaying || invoice.status === 'paid'}
                    >
                      {isPaying ? 'Processing...' : 'Pay Now'}
                    </button>
                    
                    <button
                      className="btn btn-secondary btn-default ms-6"
                      onClick={() => navigate('/signup')}
                    >
                      Start Sharing invoices with your customers
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;