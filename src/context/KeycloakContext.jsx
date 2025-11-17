import React, { createContext, useContext, useEffect, useState, useRef, useMemo } from 'react';
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
  const initRef = useRef(false);
  const logoutRef = useRef(false);

  useEffect(() => {
    // Protección robusta contra múltiples inicializaciones
    if (initRef.current) {
      console.log('⚠️ Init ya ejecutado usando ref, saltando...');
      return;
    }

    // Si acabamos de hacer logout, no re-inicializar (evita bucles)
    if (logoutRef.current) {
      console.log('⚠️ Logout reciente detectado, saltando re-inicialización...');
      return;
    }

    // Marcar inmediatamente que ya se está ejecutando
    initRef.current = true;

    const initKeycloak = async () => {
      try {
        setInitAttempted(true);
        console.log('🚀 Iniciando Keycloak con check-sso...');

        // Detectar tipos de retorno específicos
        const currentHref = window.location.href;
        const hasLoginRequiredError = currentHref.includes('error=login_required');
        const hasErrorParams = currentHref.includes('error=') || currentHref.includes('#error');
        const isLogoutReturn = currentHref.includes('logout') || 
                              currentHref.includes('session_state') ||
                              sessionStorage.getItem('keycloak-logout') ||
                              hasLoginRequiredError; // login_required = logout exitoso
                              
        // Si hay error de login_required después de logout, es normal
        if (hasLoginRequiredError) {
          console.log('✅ Error login_required después de logout (normal)');
          logoutRef.current = false; // Reset logout flag
          sessionStorage.removeItem('keycloak-logout'); // Limpiar flag
        } else if (isLogoutReturn) {
          console.log('🔄 Retorno después de logout detectado');
          logoutRef.current = false; // Reset logout flag  
          sessionStorage.removeItem('keycloak-logout'); // Limpiar flag
        }

        // Solo limpiar URL si hay ERRORES específicos, no parámetros de login exitoso
        const hasSuccessParams = currentHref.includes('code=') || currentHref.includes('session_state=');
        const shouldCleanUrl = hasErrorParams && !hasSuccessParams;
        
        if (shouldCleanUrl) {
          console.log('🧹 LIMPIANDO URL de errores Keycloak...');
          
          // Ir a la URL base completamente limpia
          const baseUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, baseUrl);
          console.log('✅ URL de error limpiada a:', baseUrl);
          
          // Si hay login_required, usar inicialización mínima
          if (hasLoginRequiredError) {
            console.log('🛑 Login_required detectado - usando inicialización mínima');
          }
        } else if (hasSuccessParams) {
          console.log('✅ Parámetros de login exitoso detectados - procesando...');
        }
        
        // Configuración Keycloak
        const config = {
          url: 'http://localhost:9090',
          realm: 'videoclub', 
          clientId: 'web'
        };
        
        console.log('🔧 Configuración:', config);
        
        const keycloakInstance = new Keycloak(config);
        
        // ESTRATEGIA: Configuración diferente según el contexto
        const shouldSkipSSO = isLogoutReturn || hasLoginRequiredError;
        const initOptions = shouldSkipSSO ? {
          // Después de logout o error login_required: no verificar SSO (evita bucles)
          onLoad: undefined,
          checkLoginIframe: false,
          enableLogging: false,
          silentCheckSsoFallback: false
        } : {
          // Carga normal: verificar SSO para mantener sesión
          onLoad: 'check-sso',
          checkLoginIframe: false,
          enableLogging: false,
          silentCheckSsoFallback: false,
          responseMode: 'fragment',
          flow: 'standard'
        };
        
        const strategy = shouldSkipSSO ? 
          (hasLoginRequiredError ? 'Post-login_required (sin SSO)' : 'Post-logout (sin SSO)') : 
          'Normal (con check-sso)';
        console.log(`⚙️ Inicializando Keycloak - Estrategia: ${strategy}`);
        
        try {
          // Inicializar con la estrategia correspondiente
          const authenticated = await keycloakInstance.init(initOptions);
          console.log('✅ Keycloak inicializado. Autenticado:', authenticated);
          
          // Establecer instancia y estado directamente
          setKeycloak(keycloakInstance);
          setAuthenticated(authenticated);
          
          // Cargar perfil solo si está autenticado
          if (authenticated) {
            console.log('👤 Usuario autenticado via SSO');
            try {
              const profile = await keycloakInstance.loadUserProfile();
              setUserProfile(profile);
              console.log('📋 Perfil cargado:', profile.firstName || profile.username);
            } catch (profileError) {
              console.warn('⚠️ Error cargando perfil:', profileError);
            }
          } else {
            console.log('🚪 No hay sesión SSO activa');
            setUserProfile(null);
          }
          
        } catch (initError) {
          console.log('ℹ️ Error en check-sso (normal si no hay sesión):', initError.message);
          // Error en check-sso generalmente significa no hay sesión activa
          setKeycloak(keycloakInstance);
          setAuthenticated(false);
          setUserProfile(null);
        }
        
      } catch (generalError) {
        console.error('❌ Error general:', generalError.message);
        setAuthenticated(false);
        setError(generalError.message);
      } finally {
        setInitialized(true);
        setLoading(false);
        console.log('🏁 Inicialización completada');
      }
    };

    // Ejecutar inmediatamente, sin timeout
    initKeycloak();
    
  }, []); // SIN dependencias para evitar bucles infinitos

  const checkExistingSession = async () => {
    if (!keycloak) {
      console.log('⚠️ Keycloak no inicializado');
      return false;
    }

    try {
      console.log('🔍 Verificando sesión existente...');
      
      // Intentar refrescar token para verificar sesión activa
      const refreshed = await keycloak.updateToken(30);
      
      if (refreshed || keycloak.token) {
        console.log('✅ Sesión válida encontrada');
        setAuthenticated(true);
        
        try {
          const profile = await keycloak.loadUserProfile();
          setUserProfile(profile);
          console.log('📋 Perfil actualizado');
          return true;
        } catch (profileError) {
          console.warn('⚠️ Error cargando perfil:', profileError);
          return true; // Aún está autenticado aunque no se pudo cargar el perfil
        }
      } else {
        console.log('🚪 No hay sesión válida');
        setAuthenticated(false);
        setUserProfile(null);
        return false;
      }
    } catch (error) {
      console.log('ℹ️ No hay sesión válida:', error.message);
      setAuthenticated(false);
      setUserProfile(null);
      return false;
    }
  };

  const login = () => {
    console.log('🔑 Login clicked - Keycloak instance:', !!keycloak);
    if (keycloak) {
      console.log('✅ Keycloak disponible, iniciando login...');
      const baseUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, baseUrl);
      
      keycloak.login({
        redirectUri: window.location.origin,
        prompt: 'login' // Forzar pantalla de login aunque haya caché
      });
    } else {
      console.error('❌ Keycloak no está inicializado - no se puede hacer login');
      console.log('🔧 Estado del contexto:', { initialized, loading, authenticated });
    }
  };

  // Función para limpiar completamente el caché de Keycloak
  const clearKeycloakCache = () => {
    console.log('🧹 Limpiando caché de Keycloak...');
    
    // Limpiar localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.includes('keycloak') || key.includes('kc-')) {
        localStorage.removeItem(key);
        console.log('🗑️ Removed from localStorage:', key);
      }
    });
    
    // Limpiar sessionStorage
    Object.keys(sessionStorage).forEach(key => {
      if (key.includes('keycloak') || key.includes('kc-')) {
        sessionStorage.removeItem(key);
        console.log('🗑️ Removed from sessionStorage:', key);
      }
    });
    
    // Reiniciar el contexto
    setKeycloak(null);
    setAuthenticated(false);
    setUserProfile(null);
    setInitialized(false);
    initRef.current = false;
    logoutRef.current = false;
    
    console.log('✅ Caché limpiado, recarga la página');
  };

  // Exponer función de limpieza globalmente para debug
  window.clearKeycloakCache = clearKeycloakCache;

  const logout = () => {
    if (keycloak) {
      console.log('🚪 Cerrando sesión...');
      
      // Marcar que estamos haciendo logout
      logoutRef.current = true;
      sessionStorage.setItem('keycloak-logout', 'true');
      
      // Limpiar estado inmediatamente
      setAuthenticated(false);
      setUserProfile(null);
      
      // Hacer logout con redirect
      keycloak.logout({
        redirectUri: window.location.origin
      });
    }
  };

  // Función para verificar si el usuario tiene un rol específico
  const hasRole = (roleName) => {
    if (!keycloak || !authenticated) {
      console.log('❌ No autenticado o keycloak no disponible');
      return false;
    }
    
    try {
      // Método 1: Usar las funciones nativas de Keycloak
      const hasRealmRole = keycloak.hasRealmRole(roleName);
      const hasResourceRole = keycloak.hasResourceRole(roleName);
      
      // Método 2: Verificar directamente en el token parseado
      const tokenParsed = keycloak.tokenParsed;
      const realmRoles = tokenParsed?.realm_access?.roles || [];
      const hasRoleInToken = realmRoles.includes(roleName);
      
      console.log('🔍 Verificando rol:', {
        roleName,
        hasRealmRole,
        hasResourceRole,
        hasRoleInToken,
        realmRoles,
        tokenParsed: tokenParsed
      });
      
      return hasRealmRole || hasResourceRole || hasRoleInToken;
    } catch (error) {
      console.error('❌ Error verificando rol:', error);
      return false;
    }
  };

  // Función para verificar si el usuario es ADMIN
  const isAdmin = () => {
    const result = hasRole('ROLE_ADMIN');
    console.log('👤 Es admin?', result);
    return result;
  };

  const value = useMemo(() => ({
    keycloak,
    authenticated,
    loading,
    initialized,
    error,
    user: userProfile,
    userProfile,
    login,
    logout,
    hasRole,
    isAdmin,
    checkExistingSession
  }), [keycloak, authenticated, loading, initialized, error, userProfile]);

  return (
    <KeycloakContext.Provider value={value}>
      {children}
    </KeycloakContext.Provider>
  );
};

export default KeycloakProvider;