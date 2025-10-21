import React, { createContext, useContext, useEffect, useState } from 'react';
import Keycloak from 'keycloak-js';

const KeycloakContext = createContext();

export const useKeycloak = () => {
  const context = useContext(KeycloakContext);
  if (!context) {
    throw new Error('useKeycloak debe usarse dentro de KeycloakProvider');
  }
  return context;
};

export const KeycloakProvider = ({ children }) => {
  const [keycloak, setKeycloak] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [initAttempted, setInitAttempted] = useState(false);

  useEffect(() => {
    if (initAttempted) {
      console.log('⚠️ Init ya intentado, saltando...');
      return;
    }

    const initKeycloak = async () => {
      try {
        setInitAttempted(true);
        console.log('🚀 Iniciando Keycloak MANUAL...');

        // PRIMERO: Limpiar URL SIEMPRE que tenga error
        const currentHref = window.location.href;
        if (currentHref.includes('error=') || currentHref.includes('#error')) {
          console.log('🧹 LIMPIANDO URL DE ERROR...');
          
          // Ir a la URL base sin parámetros
          const baseUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, baseUrl);
          console.log('✅ URL limpiada a:', baseUrl);
          
          // NO hacer return, continuar con la inicialización
        }
        
        // Configuración Keycloak
        const config = {
          url: 'http://localhost:9090',
          realm: 'videoclub', 
          clientId: 'web'
        };
        
        console.log('🔧 Configuración:', config);
        
        const keycloakInstance = new Keycloak(config);
        
        // ESTRATEGIA: NO usar check-sso, inicializar sin redirección
        const initOptions = {
          onLoad: undefined, // NO forzar ningún check
          checkLoginIframe: false,
          enableLogging: true,
          silentCheckSsoFallback: false
        };
        
        console.log('⚙️ Inicializando SIN auto-check...');
        
        try {
          // Inicializar sin verificar SSO automáticamente
          const authenticated = await keycloakInstance.init(initOptions);
          console.log('✅ Keycloak inicializado manualmente. Resultado:', authenticated);
          
          setKeycloak(keycloakInstance);
          setAuthenticated(authenticated);
          
          if (authenticated) {
            console.log('👤 ¡Usuario YA autenticado!');
            try {
              const profile = await keycloakInstance.loadUserProfile();
              setUserProfile(profile);
              console.log('📋 Perfil cargado:', profile);
            } catch (profileError) {
              console.warn('⚠️ No se pudo cargar el perfil:', profileError);
            }
          } else {
            console.log('🚪 Usuario no autenticado - esperando acción manual');
          }
          
        } catch (initError) {
          console.log('ℹ️ Error esperado en init manual:', initError);
          
          // Para init manual, cualquier error se trata como "no autenticado"
          console.log('✅ Tratando como no autenticado (normal para init manual)');
          setKeycloak(keycloakInstance);
          setAuthenticated(false);
        }
        
      } catch (generalError) {
        console.error('❌ Error general:', generalError);
        setError(generalError.message);
      } finally {
        setInitialized(true);
        setLoading(false);
        console.log('🏁 Inicialización manual completada');
      }
    };

    // Ejecutar inmediatamente, sin timeout
    initKeycloak();
    
  }, []);

  const login = () => {
    if (keycloak) {
      console.log('🔑 Iniciando login MANUAL...');
      // Limpiar URL antes del login
      const baseUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, baseUrl);
      
      keycloak.login({
        redirectUri: window.location.origin
      });
    } else {
      console.error('❌ Keycloak no está inicializado');
    }
  };

  const logout = () => {
    if (keycloak) {
      console.log('🚪 Cerrando sesión...');
      keycloak.logout({
        redirectUri: window.location.origin
      });
    }
  };

  const value = {
    keycloak,
    authenticated,
    loading,
    initialized,
    error,
    userProfile,
    login,
    logout
  };

  return (
    <KeycloakContext.Provider value={value}>
      {children}
    </KeycloakContext.Provider>
  );
};

export default KeycloakProvider;