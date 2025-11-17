import { useEffect, useRef } from 'react';
import { useKeycloak } from '../context/KeycloakContext';

/**
 * Hook personalizado para verificar la sesión de Keycloak de forma controlada
 * Evita bucles infinitos pero permite recuperar sesiones existentes
 */
const useSessionCheck = () => {
  const { keycloak, authenticated, loading, initialized, checkExistingSession } = useKeycloak();
  const hasChecked = useRef(false);

  useEffect(() => {
    // Solo verificar una vez cuando Keycloak esté inicializado y no estemos cargando
    if (initialized && !loading && !authenticated && !hasChecked.current && keycloak) {
      hasChecked.current = true;
      
      console.log('🔄 Ejecutando verificación única de sesión...');
      
      // Pequeño delay para asegurar que todo esté estable
      const timeoutId = setTimeout(() => {
        checkExistingSession()
          .then((hasSession) => {
            if (hasSession) {
              console.log('✅ Sesión recuperada exitosamente');
            } else {
              console.log('ℹ️ No hay sesión para recuperar');
            }
          })
          .catch((error) => {
            console.warn('⚠️ Error en verificación de sesión:', error);
          });
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [initialized, loading, authenticated, keycloak, checkExistingSession]);

  // Función para forzar una nueva verificación (uso manual)
  const forceSessionCheck = () => {
    hasChecked.current = false;
    return checkExistingSession();
  };

  return {
    forceSessionCheck
  };
};

export default useSessionCheck;