// src/components/TawkTo.jsx
import React, { useEffect, useRef } from 'react';

const TawkTo = () => {
  const tawkToInitialized = useRef(false);

  useEffect(() => {
    // Prevent double initialization in development with React Strict Mode
    if (tawkToInitialized.current) return;
    tawkToInitialized.current = true;

    // Check if Tawk.to is already loaded
    if (window.Tawk_API && window.Tawk_API.showWidget) {
      return;
    }

    const initializeTawkTo = () => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://embed.tawk.to/67f003657fe93c190c2dd4f2/1io0oqi0r';
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');
      
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();

      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode.insertBefore(script, firstScript);

      script.onload = () => {
        console.log('Tawk.to chat loaded successfully');
      };

      script.onerror = () => {
        console.error('Failed to load Tawk.to chat');
      };
    };

    // Initialize after a short delay to ensure DOM is ready
    const timer = setTimeout(initializeTawkTo, 1000);

    return () => {
      clearTimeout(timer);
      // Note: We don't remove the script here as Tawk.to is typically
      // a global service that should persist across navigation
    };
  }, []);

  return null;
};

export default TawkTo;