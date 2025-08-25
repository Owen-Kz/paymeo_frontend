// src/pages/PricingPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const PricingPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isYearlyBilling, setIsYearlyBilling] = useState(false);

  const handleBillingToggle = () => {
    setIsYearlyBilling(!isYearlyBilling);
  };

  const handlePlanSelection = (plan, billingCycle) => {
    if (currentUser && currentUser !== "N/A") {
      navigate(`/pricing/subscription/confirm/${plan}?billing=${billingCycle}`);
    } else {
      navigate('/login');
    }
  };

  const plans = {
    basic: {
      name: "Basic",
      price: { monthly: "Free", yearly: "Free" },
      features: [
        { included: true, text: "Unlimited Invoices Per Month" },
        { included: true, text: "Unlimited Clients/Customers" },
        { included: true, text: "Unlimited Product/Service listing" },
        { included: true, text: "150 free API credits (₦10/credit after)" },
        { included: true, text: "Email Reminders" },
        { included: true, text: "Multiple Business Support" },
        { included: true, text: "Automated receipts" },
        { included: false, text: "Bank account on invoices" },
        { included: false, text: "WhatsApp reminders" },
        { included: false, text: "USD account activation" },
        { included: false, text: "Recurring Invoices & Expenses" },
        { included: false, text: "Financial Analytics" },
        { included: false, text: "Multiple Account Users & Teams" },
        { included: false, text: "Customizable Invoices" },
        { included: false, text: "Agentic AI" }
      ]
    },
    standard: {
      name: "Standard",
      popular: true,
      price: { monthly: "₦2,500", yearly: "₦25,000" },
      features: [
        { included: true, text: "Everything in Basic", bold: true },
        { included: true, text: "300 free API credits (₦10/credit after)" },
        { included: true, text: "Bank account on invoices" },
        { included: true, text: "Email & WhatsApp reminders" },
        { included: true, text: "Free withdrawals (first 10 transactions)" },
        { included: true, text: "USD account activation" },
        { included: true, text: "Recurring Invoices & Expenses" },
        { included: true, text: "Basic Financial Analytics" },
        { included: true, text: "Multiple Account Users & Teams" },
        { included: false, text: "Customizable Invoices" },
        { included: false, text: "Advanced Financial Analytics" },
        { included: false, text: "Agentic AI" }
      ]
    },
    premium: {
      name: "Premium",
      recommended: true,
      price: { monthly: "₦5,000", yearly: "₦55,000" },
      features: [
        { included: true, text: "Everything in Standard", bold: true },
        { included: true, text: "1000 free API credits (₦10/credit after)" },
        { included: true, text: "Customizable Invoices" },
        { included: true, text: "Advanced Financial Analytics" },
        { included: true, text: "Agentic AI" },
        { included: true, text: "Add-on" }
      ]
    }
  };

  const PlanCard = ({ plan, planKey }) => (
    <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
      <div className={`h-full rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 ${
        plan.popular ? 'border-2 border-yellow-400' : 'border border-gray-200'
      } ${plan.recommended ? 'ring-2 ring-green-400' : ''}`}>
        <div className="p-8 bg-white">
          {/* Badges */}
          <div className="flex justify-end mb-6">
            {plan.popular && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-yellow-100 text-yellow-800 uppercase">
                POPULAR
              </span>
            )}
            {plan.recommended && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800 uppercase">
                RECOMMENDED
              </span>
            )}
          </div>

          <h3 className="text-2xl font-bold text-gray-900 uppercase mb-6">
            {plan.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline mb-4">
            <span className="text-4xl font-bold text-gray-900">
              {isYearlyBilling ? plan.price.yearly : plan.price.monthly}
            </span>
            <span className="text-lg text-gray-600 ml-2">
              {isYearlyBilling ? '/year' : '/month'}
            </span>
          </div>

          {/* Billing Info */}
          <p className="text-gray-600 text-sm mb-6">
            {isYearlyBilling ? (
              <>
                Billed yearly (save ₦5,000)
                <br />
                Renews at {planKey === 'standard' ? '₦30,000' : '₦60,000'}/year
              </>
            ) : (
              'Billed monthly'
            )}
          </p>

          {/* Features List */}
          <ul className="space-y-3 mb-8">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                {feature.included ? (
                  <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                )}
                <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'} ${feature.bold ? 'font-semibold' : ''}`}>
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>

          {/* Action Button */}
          <button
            onClick={() => handlePlanSelection(planKey, isYearlyBilling ? 'yearly' : 'monthly')}
            className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-200 ${
              plan.popular 
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                : plan.recommended
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {planKey === 'basic' ? 'Get Started Free' : `Choose ${plan.name}`}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Flexible Plans Tailored to Fit Your Business Needs!
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan that grows with your business. All plans include our core features with no hidden fees.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center mb-16">
          <span className={`text-lg font-medium mr-4 ${!isYearlyBilling ? 'text-blue-600' : 'text-gray-600'}`}>
            Monthly
          </span>
          
          <button
            onClick={handleBillingToggle}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span className="sr-only">Toggle billing</span>
            <span
              className={`${
                isYearlyBilling ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </button>
          
          <span className={`text-lg font-medium ml-4 ${isYearlyBilling ? 'text-blue-600' : 'text-gray-600'}`}>
            Yearly
          </span>
          
          <span className="ml-3 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
            Save 17%
          </span>
        </div>

        {/* Plans Grid */}
        <div className="flex flex-wrap -mx-4 justify-center">
          {Object.entries(plans).map(([planKey, plan]) => (
            <PlanCard key={planKey} plan={plan} planKey={planKey} />
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Need help choosing?</h3>
            <p className="text-gray-600 mb-6">
              Our team is here to help you select the perfect plan for your business needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Contact Sales
              </button>
              <button className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Start Free Trial
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h4>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Is there a setup fee?</h4>
              <p className="text-gray-600">No, there are no setup fees for any of our plans.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Do you offer discounts?</h4>
              <p className="text-gray-600">Yes, we offer annual billing discounts and special rates for startups.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-600">We accept credit cards, debit cards, and bank transfers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;