// Configuración de testing para Keycloak (evita bucles)
const keycloakConfig = {
  url: 'http://localhost:9090/',
  realm: 'videoclub',
  clientId: 'web',
};

// Configuración de inicialización que evita bucles
export const keycloakInitConfig = {
  onLoad: 'check-sso',
  checkLoginIframe: false,
  checkLoginIframeInterval: 0,
  enableLogging: true,
  responseMode: 'query' // Cambiar de fragment a query
};

export default keycloakConfig;