import { useKeycloak } from '../context/KeycloakContextStable';
import { useCallback } from 'react';
import axios from 'axios';

// Hook personalizado para hacer requests autenticados
export const useAuthenticatedApi = () => {
  const { getToken, authenticated } = useKeycloak();

  // Función para crear un cliente axios configurado con autenticación
  const createAuthenticatedAxios = useCallback(() => {
    const token = getToken();
    
    const axiosInstance = axios.create();
    
    // Agregar interceptor para incluir token en headers
    axiosInstance.interceptors.request.use(
      (config) => {
        if (token && authenticated) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para manejar errores de autenticación
    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.log('Token expirado o inválido');
          // Aquí podrías redirigir al login o renovar el token
        }
        return Promise.reject(error);
      }
    );

    return axiosInstance;
  }, [getToken, authenticated]);

  // Función helper para hacer requests GET autenticados
  const authenticatedGet = useCallback(async (url, config = {}) => {
    const axiosInstance = createAuthenticatedAxios();
    return axiosInstance.get(url, config);
  }, [createAuthenticatedAxios]);

  // Función helper para hacer requests POST autenticados
  const authenticatedPost = useCallback(async (url, data, config = {}) => {
    const axiosInstance = createAuthenticatedAxios();
    return axiosInstance.post(url, data, config);
  }, [createAuthenticatedAxios]);

  // Función helper para hacer requests PUT autenticados
  const authenticatedPut = useCallback(async (url, data, config = {}) => {
    const axiosInstance = createAuthenticatedAxios();
    return axiosInstance.put(url, data, config);
  }, [createAuthenticatedAxios]);

  // Función helper para hacer requests DELETE autenticados
  const authenticatedDelete = useCallback(async (url, config = {}) => {
    const axiosInstance = createAuthenticatedAxios();
    return axiosInstance.delete(url, config);
  }, [createAuthenticatedAxios]);

  return {
    createAuthenticatedAxios,
    authenticatedGet,
    authenticatedPost,
    authenticatedPut,
    authenticatedDelete,
    isAuthenticated: authenticated,
    token: getToken()
  };
};

export default useAuthenticatedApi;