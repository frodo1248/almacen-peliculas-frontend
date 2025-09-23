import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import CatalogoPeliculas from './pages/CatalogoPeliculas';
import './App.css';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<CatalogoPeliculas />} />
        <Route path="/catalogo" element={<CatalogoPeliculas />} />
        {/* Redirigir rutas no encontradas al home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
