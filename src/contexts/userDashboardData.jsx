// hooks/useDashboardData.js
import { useState, useEffect, useCallback } from 'react';
import useCsrfToken from '../hooks/useCsrToken';
import api from '../utils/api';

const useDashboardData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { csrfToken, loading: csrfLoading, error: csrfError } = useCsrfToken();

  const fetchData = useCallback(async () => {
    // Wait for CSRF token to be available
    if (csrfLoading || !csrfToken) return;
    
    if (csrfError) {
      setError(csrfError);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // const token = localStorage.getItem('_t');
      
      const response = await api.post(`/dashboard`);

      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      
      // If it's a CSRF error, we might need to refresh the token
      if (err.response?.status === 403 && err.response?.data?.code === 'EBADCSRFTOKEN') {
        setError('CSRF token invalid. Please refresh the page.');
        // You could automatically refresh the token here
      } else {
        setError(err.response?.data?.error || 'An error occurred while fetching data');
      }
    } finally {
      setLoading(false);
    }
  }, [csrfToken, csrfLoading, csrfError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ Add refresh function
  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading: loading || csrfLoading, error, refresh };
};

export default useDashboardData;