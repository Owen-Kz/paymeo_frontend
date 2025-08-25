// src/components/common/ComingSoon.jsx
import React from 'react';

const ComingSoon = ({ featureName = "This feature", message = "is currently under development." }) => {
  return (
    <div className="min-h-96 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* Animated Icon */}
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-12 h-12 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          
          {/* Floating elements */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
          <div className="absolute -bottom-2 -left-2 w-5 h-5 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-gray-800 mb-3">Coming Soon</h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          <span className="font-medium text-blue-600">{featureName}</span> {message}
        </p>

        {/* Progress indicator */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse"
              style={{ width: '65%' }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Development in progress - 65% complete</p>
        </div>

        {/* Call to action */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Stay tuned!</span> We're working hard to bring you this exciting new feature.
          </p>
        </div>

        {/* Decorative elements */}
        <div className="flex justify-center space-x-2 mb-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>

        {/* Contact suggestion */}
        <div className="text-xs text-gray-500">
          <p>Have suggestions? We'd love to hear from you!</p>
        </div>
      </div>
    </div>
  );
};

// Variant with construction theme
export const Construction = ({ featureName = "This section" }) => {
  return (
    <div className="min-h-96 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* Construction Icon */}
        <div className="mb-6">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
            </svg>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-3">Under Construction</h3>
        
        <p className="text-gray-600 mb-6">
          <span className="font-medium text-orange-600">{featureName}</span> is being built with care.
        </p>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-800">
            <span className="font-medium">Hard hats required!</span> Our team is building something amazing for you.
          </p>
        </div>
      </div>
    </div>
  );
};

// Variant with rocket theme for launch anticipation
export const LaunchingSoon = ({ featureName = "New feature" }) => {
  return (
    <div className="min-h-96 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* Rocket Icon */}
        <div className="mb-6 transform hover:scale-110 transition-transform duration-300">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-12 h-12 text-purple-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-3">Launching Soon</h3>
        
        <p className="text-gray-600 mb-6">
          <span className="font-medium text-purple-600">{featureName}</span> is getting ready for takeoff!
        </p>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-purple-800">
            <span className="font-medium">Countdown initiated!</span> Something amazing is on the horizon.
          </p>
        </div>

        <div className="inline-flex items-center space-x-1 text-sm text-gray-500">
          <span>Estimated launch:</span>
          <span className="font-medium text-purple-600">2 weeks</span>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;