import React from 'react';
import { useKeycloak } from '../context/KeycloakContextStable';
import { Alert, Button, Container } from 'react-bootstrap';

// Componente para proteger rutas que requieren autenticación
const ProtectedRoute = ({ children, roles = [] }) => {
  const { authenticated, loading, login, hasRole } = useKeycloak();

  // Mostrar loading mientras se verifica autenticación
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Verificando autenticación...</span>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar mensaje y botón de login
  if (!authenticated) {
    return (
      <Container className="mt-5">
        <Alert variant="warning" className="text-center">
          <Alert.Heading>🔐 Acceso Restringido</Alert.Heading>
          <p>
            Esta página requiere autenticación. Por favor, inicia sesión para continuar.
          </p>
          <hr />
          <div className="d-flex justify-content-center">
            <Button variant="primary" onClick={login}>
              Iniciar Sesión
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  // Si se especifican roles, verificar que el usuario los tenga
  if (roles.length > 0) {
    const userHasRole = roles.some(role => hasRole(role));
    
    if (!userHasRole) {
      return (
        <Container className="mt-5">
          <Alert variant="danger" className="text-center">
            <Alert.Heading>🚫 Acceso Denegado</Alert.Heading>
            <p>
              No tienes los permisos necesarios para acceder a esta página.
            </p>
            <small className="text-muted">
              Roles requeridos: {roles.join(', ')}
            </small>
          </Alert>
        </Container>
      );
    }
  }

  // Si está autenticado y tiene los roles necesarios, mostrar el contenido
  return children;
};

export default ProtectedRoute;