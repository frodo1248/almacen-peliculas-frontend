import { useState, useEffect } from 'react';
import { obtenerCarrito } from '../services/peliculasService';
import { useKeycloak } from '../context/KeycloakContext';

const useCarrito = () => {
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { keycloak, authenticated } = useKeycloak();

  const cargarCarrito = async () => {
    // No hacer nada si no está autenticado
    if (!authenticated || !keycloak?.token) {
      console.log('🛒 No autenticado, no se carga carrito');
      setCarrito([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🛒 Cargando carrito...', { authenticated, hasToken: !!keycloak.token });
      
      const datosCarrito = await obtenerCarrito(keycloak.token);
      setCarrito(datosCarrito);
      
      console.log('✅ Carrito cargado:', datosCarrito);
    } catch (err) {
      console.error('❌ Error al cargar carrito:', err);
      setError(err.message);
      setCarrito([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar carrito SOLO cuando hay autenticación válida
  useEffect(() => {
    // Solo intentar cargar si está autenticado Y tiene token
    if (authenticated === true && keycloak?.token) {
      console.log('🛒 Usuario autenticado, cargando carrito...');
      cargarCarrito();
    } else if (authenticated === false) {
      // Si no está autenticado, limpiar carrito sin hacer request
      console.log('🚪 Usuario no autenticado, limpiando carrito...');
      setCarrito([]);
      setLoading(false);
      setError(null);
    }
    // Si authenticated === undefined, no hacer nada (aún inicializando)
  }, [authenticated, keycloak?.token]);

  const recargarCarrito = () => {
    cargarCarrito();
  };

  return {
    carrito,
    loading,
    error,
    recargarCarrito
  };
};

export default useCarrito;