// src/utils/api.js
import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:4200",
  withCredentials: true, // This is crucial for cookies
});

// Variable to store CSRF token
let csrfToken = '';

// Function to fetch CSRF token
export const fetchCsrfToken = async () => {
  try {
    // This endpoint should NOT have CSRF protection
    const response = await api.get('/api/csrf-token');
    if (response.data.csrfToken) {
      csrfToken = response.data.csrfToken;
      
      // Also store in meta tag for consistency
      let metaTag = document.querySelector('meta[name="csrf-token"]');
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.name = 'csrf-token';
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', csrfToken);
      
      return csrfToken;
    }
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    throw error;
  }
};

// Request interceptor to add CSRF token
api.interceptors.request.use(
  async (config) => {
    // Don't add CSRF token to the token request itself
    if (config.url === '/api/csrf-token') {
      return config;
    }

    // If we don't have a CSRF token, try to get one
    if (!csrfToken) {
      try {
        await fetchCsrfToken();
      } catch (error) {
        console.warn('Could not fetch CSRF token, proceeding without it');
        return config;
      }
    }

    // Add CSRF token to headers
    config.headers['X-CSRF-Token'] = csrfToken;
    
    // Add auth token if available
    const authToken = localStorage.getItem('_t');
    if (authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle CSRF token errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403 && 
        (error.response.data?.code === 'EBADCSRFTOKEN' || 
         error.response.data?.message?.includes('CSRF'))) {
      // CSRF token invalid, try to get a new one
      try {
        await fetchCsrfToken();
        
        // Retry the original request with new CSRF token
        const originalRequest = error.config;
        originalRequest.headers['X-CSRF-Token'] = csrfToken;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh CSRF token:', refreshError);
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
// export { fetchCsrfToken };