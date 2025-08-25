// src/components/modals/TemplateModal.jsx
import React from 'react';

const TemplateModal = ({ show, onHide, onSelectTemplate }) => {
  const invoiceTemplates = [
    {
      id: 'modern-classic',
      name: 'Modern Classic',
      description: 'Clean and professional design with modern typography',
      category: 'Professional'
    },
    {
      id: 'minimalist',
      name: 'Minimalist',
      description: 'Simple and elegant design with focus on content',
      category: 'Simple'
    },
    {
      id: 'corporate',
      name: 'Corporate',
      description: 'Formal design suitable for corporate clients',
      category: 'Business'
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Colorful and creative design for creative industries',
      category: 'Creative'
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Luxury design with premium styling and details',
      category: 'Premium'
    }
  ];

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Choose a Template</h2>
          <button
            onClick={onHide}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <p className="text-gray-600 mb-6">Select a template for your invoice PDF</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invoiceTemplates.map((template) => (
            <div
              key={template.id}
              className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => onSelectTemplate(template.id)}
            >
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <div className="text-center p-4">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm text-gray-500">Template Preview</p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {template.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onHide}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateModal;