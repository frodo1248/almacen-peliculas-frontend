import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { useKeycloak } from '../context/KeycloakContextDebug';

const ErrorDisplay = () => {
  const { error, clearError, login } = useKeycloak();

  if (!error) {
    return null;
  }

  const isAuthError = error.includes('autenticación') || error.includes('login_required');

  return (
    <Alert variant="warning" className="mb-3" dismissible onClose={clearError}>
      <Alert.Heading>
        {isAuthError ? '🔐 Problema de Autenticación' : '⚠️ Error'}
      </Alert.Heading>
      <p>{error}</p>
      {isAuthError && (
        <>
          <hr />
          <div className="d-flex gap-2">
            <Button variant="primary" size="sm" onClick={login}>
              Intentar Login
            </Button>
            <Button variant="outline-secondary" size="sm" onClick={clearError}>
              Continuar sin Autenticación
            </Button>
          </div>
        </>
      )}
    </Alert>
  );
};

export default ErrorDisplay;