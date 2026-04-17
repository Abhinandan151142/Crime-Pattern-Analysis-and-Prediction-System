// API Configuration for different environments

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
};

export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  const base = API_CONFIG.BASE_URL.endsWith('/') 
    ? API_CONFIG.BASE_URL.slice(0, -1) 
    : API_CONFIG.BASE_URL;
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
};
