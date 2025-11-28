import axios from 'axios';

// 1. Get the URL dynamically based on environment
const BASE_URL = import.meta.env.VITE_API_URL; 

// Create an axios instance
const api = axios.create({
  baseURL: BASE_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true 
});

// ==============================================
//  MISSING PART ADDED BELOW (Request Interceptor)
// ==============================================

// 2. Request Interceptor: Attach Token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // This attaches the token to the header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==============================================

// 3. Response Interceptor: Handle Expired Tokens (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Only redirect if we aren't already on the login page
      if (!window.location.pathname.includes('/auth/login')) {
        console.warn("Session expired. Redirecting...");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;