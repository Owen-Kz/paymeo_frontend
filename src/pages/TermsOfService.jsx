import React from 'react';
import { Link } from 'react-router-dom';
import HeaderLanding from '../components/partials/HeaderLanding';
const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preloader (if needed) */}
      {/* <div className="preloader">...</div> */}
         <HeaderLanding />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Download PDF Button */}
          <div className="text-center mb-8">
            <a
              href="/assets/Terms of Service _ Paymeo (formerly invox).pdf"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300 hover:-translate-y-0.5"
              download
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download as PDF
            </a>
          </div>
          
          {/* Terms Container */}
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            {/* Header */}
            <div className="border-b-2 border-blue-500 pb-6 mb-8 text-center">
              <img src="/assets/logo.png" alt="Paymeo (formerly invox) Logo" className="mx-auto w-40" />
              <h1 className="text-3xl font-bold mt-6">Terms of Service & Privacy Policy</h1>
              <p className="text-gray-500 mt-2">Last Updated: May 15, 2025</p>
            </div>

            {/* Introduction */}
            <div className="mb-8">
              <p className="mb-4">Please read carefully. This document explains our obligations as a service provider and yours as a customer.</p>
              <p>By using or accessing any element of the website (paymeo.co), you indicate that you have read, understood, and agree to be bound by these Terms of Service ("Terms"). These Terms govern your use of the Product and form a legal contract between Weperch Technologies ("Paymeo (formerly invox)", "we" or "us") and you ("Customer" or "you"). If you are an individual accepting these Terms on behalf of a company or entity, then you are binding the company or entity to these Terms and represent and warrant that you have full power and authority to do so.</p>
            </div>

            {/* About Us */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">About Us</h2>
              <p>Paymeo (formerly invox) ("we" or "us") is an online invoicing and business solutions provider that makes it easy for businesses and individuals (from business owners via startups through freelancers) send customized invoices to clients and get paid online without stress.</p>
            </div>

            {/* User Registration */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">User Registration</h2>
              <p>To use Paymeo (formerly invox), you have to create an Paymeo (formerly invox) account by registering. To register, you will need to provide certain information such as your email, first name, last name, business name and phone number and we may seek to verify your information, (by ourselves or through third parties). You give us permission to do all these. Our website and services are not directed to children under 18. We do not knowingly transact or provide any services to children under 18.</p>
            </div>

            {/* Use of Software */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">Use of Software</h2>
              <p>Paymeo (formerly invox) grants you the right to access and use the Service via the Website with the particular user roles available to you. Your rights to use the Product are non-exclusive, non-transferable and non-sublicenseable. You will not (or permit anyone else to):</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>rent, lease, reproduce, modify, create derivative works of, distribute or transfer the Product;</li>
                <li>use the Product for the benefit of any third party or incorporate the Product into any other product or service;</li>
                <li>circumvent mechanisms in the Product intended to limit your use;</li>
                <li>reverse engineer, disassemble, decompile, or translate the Product or attempt to derive the source code of the Software or any non-public APIs;</li>
                <li>publicly disseminate information regarding the performance of the Product;</li>
                <li>access the Product to build a competitive product or service;</li>
                <li>submit any viruses, worms or other harmful code to the Product or otherwise interfere with or cause harm to the Product;</li>
                <li>seek to access information or data of other Paymeo (formerly invox) customers;</li>
                <li>use the Product to transmit spam or other unsolicited email; or</li>
                <li>use the Product except as expressly permitted herein.</li>
              </ul>
            </div>

            {/* Data Protection & Rights */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">Data Protection & Rights</h2>
              <p>Paymeo (formerly invox) considers data protection and privacy to be of paramount importance. We will never sell personal data and we carry out all processing operations in strict compliance and regulations.</p>
              
              <h3 className="text-xl font-medium mt-6 mb-3">Information Collection</h3>
              <p>When you sign up for and open an account with us, or sign up for content or offers, we may ask you to provide us with information such as your name, email address and details about your business to better provide you with our services.</p>
              
              <p className="mt-4">When you visit our site we store the name of your internet service provider, the website from which you visited us from, the parts of our site you visit, the date and duration of your visit, and information from the device (device type, operating system, screen resolution, language, country you are located in, and web browser type) you used during your visit. We process such usage data in an anonymized form for statistical purposes and to improve our site.</p>
              
              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500 mt-6">
                <h3 className="text-xl font-medium mb-3">Your Rights</h3>
                <p>You may deactivate your Paymeo (formerly invox) account and/or unsubscribe from receiving content or offers from us at any time. Following termination of your account, we may retain your personal data for a period of 90 calendar days after which it would be deleted permanently.</p>
                <p className="mt-3">You have a right to be informed of personal data processed by Paymeo (formerly invox), a right to rectification/correction, erasure and restriction of personal data. You also have the right to receive from Paymeo (formerly invox) a structured, common and machine-readable format of Personal Data you provided to us.</p>
                <p className="mt-3">To exercise any of these rights, please contact our support team at <a href="mailto:company@paymeo.co" className="text-blue-600 hover:underline">company@paymeo.co</a>.</p>
              </div>
            </div>

            {/* Business Verification */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">Business Verification</h2>
              <p>In an attempt to curb frauds related to online payments and other services, we may request additional information from you at any time. We may also require your Bank Verification Number (BVN), CAC registration details, a government issued identification such as a passport or driver's license, or a business license. If you refuse any of these requests, your account may be suspended or terminated. We reserve the full rights to suspend or terminate an account of any user who provides inaccurate, untrue, or incomplete information required under this Agreement.</p>
            </div>

            {/* Prohibited Use */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">Prohibited Use</h2>
              <p>The users shall use the services provided by this platform for lawful purposes only and not for the purpose of committing or furthering fraudulent acts or for committing any acts that would give rise to both or either civil and criminal liability. The users agree not to publish, post, upload, distribute, provide or enter any material or information that is illegal, unlawful or can be regarded as fraudulent, libelous, malicious, threatening, offensive, profane, obscene, fanning ethnic or racial tensions, immoral or any such information which any reasonable person would consider objectionable on grounds of good conscience. We reserve the full rights to suspend or terminate an account of any user who uses the platform for any fraudulent or illegal act.</p>
            </div>

            {/* Subscription Fees & Charges */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">Subscription Fees & Charges</h2>
              <p>Subscription fees and any other charges for the use of the Application are described on the Site. They may change from time to time. If subscription fees change, we will give you at least 30 days' notice. If they do change, your continued use of the Application after the change indicates your agreement with the new fees and charges after the effective date of the change. Fees for payment transactions are subject to change without notice, unless otherwise prohibited, at the discretion of our payment platform partners. Our current subscription fees and charges can be found on our pricing page.</p>
            </div>

            {/* Refund Policy */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">Refund Policy</h2>
              <p>Payments already made for any plan or module(s) will not be refunded, once the payment is processed by the payment gateway irrespective of the billing cycle (monthly or yearly). Upon cancellation of your account or downgrading your account to a Free plan, you won't be charged again unless otherwise for any due amounts incurred before the downgrade or account cancellation.</p>
            </div>

            {/* Online Payments */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">Online Payments</h2>
              <p>We allow users to receive online payments from customers ("End Customers") on our website. These payments are processed through any of our payment partners (Paystack or Flutterwave). In special cases where there is a CHARGEBACK or DISPUTE associated with any of your received payment transactions, you may be required to provide an evidence for value exchange between you and the customer and if you fail to do so, you will be forcefully required to refund such amount or its equivalent to the customer. Any purchase or payment is solely between you and the End Customer, Paymeo (formerly invox) is not party to your transactions and assumes no liability or responsibility for your products, services or offerings.</p>
            </div>

            {/* API Access */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">API Access</h2>
              <p>Paymeo (formerly invox) provide extended access to the application via its Application Programming Interface (API) as a part of our Service. Subject to the other terms of this agreement, we grant Customer a non-exclusive, nontransferable, terminable license to interact with the API only for purposes of the Service as allowed by the API. Customer may not use the API in a manner that fails to comply with the API technical documentation or with any part of the API. If any of these occur, Paymeo (formerly invox) can decide to temporarily or permanently suspend/terminate Customer's access to the API without any prior notice.</p>
            </div>

            {/* Cancellation Of Accounts */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">Cancellation Of Accounts</h2>
              <p>The user has the right to delete or cancel their account at any time. Once the account is cancelled all information associated with that account will no longer be accessible on the website. Paymeo (formerly invox) has no obligation to maintain the Customer Data and may destroy it after 60-days period. Each user is solely responsible for account cancellation or de-activation. Paymeo (formerly invox) reserves the right to terminate or suspend any account at any time and deny future service to anyone for any reason.</p>
            </div>

            {/* Use of Cookies */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">Use of Cookies</h2>
              <p>We use cookies to identify you as a User and make your user experience easier, customize our services, content and advertising; help you ensure that your account security is not compromised, mitigate risk and prevent fraud; and to promote trust and safety on our website. Cookies allow our servers to remember your account log-in information when you visit our website, IP addresses, date and time of visits, monitor web traffic and prevent fraudulent activities. If your browser or browser add-on permits, you have the choice to disable cookies on our website, however this may limit your ability to use our website.</p>
            </div>

            {/* Disclaimer & Limitation of Liability */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">Disclaimer & Limitation of Liability</h2>
              <p>Paymeo (formerly invox) makes no representations or warranties of any kind, express or implied, as to the operation of the site or the information, content, materials, or products included on this site except as provided here to the full extent permissible by applicable law, Paymeo (formerly invox) disclaims all warranties, express or implied, including, but not limited to, implied warranties of merchantability and fitness for a particular purpose, non-infringement, title, quiet enjoyment, data accuracy, and system integration. "You acknowledge and agree that the use of the Site is at your own risk as the services are available without warranties." This site may include inaccuracies, mistakes or typographical errors. Paymeo (formerly invox) does not warrant that the content will be uninterrupted or error free. To the maximum extent permitted by law, Paymeo (formerly invox) will not be liable for any damages of any kind arising from the use of this site, including, but not limited to, indirect, incidental, punitive, exemplary, special, or consequential damages. "We are committed to conducting our business in accordance with these principles in order to ensure that the confidentiality of personal information is protected and maintained."</p>
            </div>

            {/* Copyright */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">Copyright</h2>
              <p>All text, graphics, photographs, button icons, audio clips, logos, slogans, trade names or word software and other contents on this Site collectively belongs exclusively to Paymeo (formerly invox) or its appropriate content suppliers. You may not use, reproduce, copy, modify, transmit, display, publish, sell, license, publicly perform, distribute or commercially exploit any of the Content or otherwise dispose of any of the Content in a way not permitted by Paymeo (formerly invox), without express prior written consent.</p>
              <p className="mt-4">The use of data mining, robots, or similar data gathering and extraction tools on this Site is strictly prohibited. You may view and use the Content only for your personal information and for the sole purpose of the services rendered by Paymeo (formerly invox). The Content, the Compilation and the Software are all protected under the law of the Federal Republic of Nigeria. All rights not expressly granted are reserved by Paymeo (formerly invox). Violators will be prosecuted to the full extent of the law.</p>
            </div>

            {/* Applicable Law */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">Applicable Law</h2>
              <p>This Agreement shall be interpreted and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to the conflicts of laws principles thereof.</p>
            </div>

            {/* Electronic Signature */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">Electronic Signature</h2>
              <p>With respect to these Terms, you hereby waive any applicable rights to require an original (non-electronic) signature or delivery or retention of non-electronic records, to the extent not prohibited under applicable law.</p>
            </div>

            {/* Updates and Modifications */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">Updates and Modifications</h2>
              <p>Paymeo (formerly invox) may revise and update these Terms and Conditions at anytime. Please periodically review the Terms and Conditions because your continued usage of the web site after any changes to these Terms and Conditions will mean you accept those changes.</p>
            </div>

            {/* Feedback */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">Feedback</h2>
              <p>If you have questions about any of this User Agreements or you wish to report breaches of the User Agreement in this Terms of Condition, please contact Paymeo (formerly invox) via E-mail: <a href="mailto:company@paymeo.co" className="text-blue-600 hover:underline">company@paymeo.co</a> with "Terms & Condition" in the subject line.</p>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 pt-8 text-center">
              <p className="text-gray-500">This Terms of Service and Privacy Policy was last updated on May 15, 2025.</p>
              <Link to="/signup" className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Sign up for free today, no credit card required
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;