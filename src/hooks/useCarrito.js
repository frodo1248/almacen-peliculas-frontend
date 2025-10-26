import { useState, useEffect } from 'react';
import { obtenerCarrito } from '../services/peliculasService';
import { useKeycloak } from '../context/KeycloakContext';

const useCarrito = () => {
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { keycloak, authenticated } = useKeycloak();

  const cargarCarrito = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener token si el usuario está autenticado
      const token = authenticated && keycloak?.token ? keycloak.token : null;
      
      console.log('🛒 Cargando carrito...', { authenticated, hasToken: !!token });
      
      const datosCarrito = await obtenerCarrito(token);
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

  // Cargar carrito cuando el componente se monta o cambia la autenticación
  useEffect(() => {
    if (authenticated !== undefined) { // Esperar a que se resuelva la autenticación
      cargarCarrito();
    }
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