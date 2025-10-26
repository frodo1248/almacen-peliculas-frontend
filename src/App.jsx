import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { KeycloakProvider, useKeycloak } from './context/KeycloakContext';
import Layout from './components/Layout';
import CatalogoPeliculas from './pages/CatalogoPeliculas';
import Carrito from './pages/Carrito';
import './App.css';

// Componente de carga mientras se inicializa Keycloak
const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Cargando...</span>
    </div>
  </div>
);

// Componente principal de la aplicación
const AppContent = () => {
  const { loading } = useKeycloak();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<CatalogoPeliculas />} />
        <Route path="/catalogo" element={<CatalogoPeliculas />} />
        <Route path="/carrito" element={<Carrito />} />
        {/* Redirigir rutas no encontradas al home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <KeycloakProvider>
      <AppContent />
    </KeycloakProvider>
  );
}

export default App;
