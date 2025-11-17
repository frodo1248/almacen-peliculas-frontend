// Configuración de Keycloak con opciones de sesión mejoradas
const keycloakConfig = {
  url: 'http://localhost:9090',  // Sin la barra final
  realm: 'videoclub',
  clientId: 'web'
};

// Configuración alternativa más explícita
export const keycloakConfigExplicit = {
  'auth-server-url': 'http://localhost:9090',
  'realm': 'videoclub',
  'resource': 'web',
  'public-client': true,
  'enable-cors': true
};

export default keycloakConfig;