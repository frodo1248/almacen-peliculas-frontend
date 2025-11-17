// config/api.js
const getApiConfig = () => {
  // En desarrollo: usar proxy
  if (import.meta.env.DEV) {
    return {
      API_BASE_URL: '/api',
      CARRITO_API_URL: '/api'
    };
  }
  
  // En producción: usar URLs directas
  return {
    API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:9500',
    CARRITO_API_URL: import.meta.env.VITE_API_URL || 'http://localhost:9500'
  };
};

export const { API_BASE_URL, CARRITO_API_URL } = getApiConfig();