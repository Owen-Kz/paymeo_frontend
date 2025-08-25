// hooks/useCsrfToken.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useCsrfToken = () => {
  const [csrfToken, setCsrfToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        // Check if we already have a token in meta tag
        const existingToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        
        if (existingToken) {
          setCsrfToken(existingToken);
          setLoading(false);
          return;
        }

        // Fetch new CSRF token from backend
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/csrf-token`, {
          withCredentials: true, // Important for cookies
        });

        if (response.data.csrfToken) {
          // Set the token in a meta tag
          let metaTag = document.querySelector('meta[name="csrf-token"]');
          if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.name = 'csrf-token';
            document.head.appendChild(metaTag);
          }
          metaTag.setAttribute('content', response.data.csrfToken);
          
          setCsrfToken(response.data.csrfToken);
        }
      } catch (err) {
        console.error('Error fetching CSRF token:', err);
        setError('Failed to get CSRF token');
      } finally {
        setLoading(false);
      }
    };

    fetchCsrfToken();
  }, []);

  return { csrfToken, loading, error };
};

export default useCsrfToken;