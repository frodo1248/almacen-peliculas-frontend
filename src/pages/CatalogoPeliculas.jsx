import React, { useState } from 'react';
import { Container, Row, Col, Spinner, Alert, Toast, ToastContainer } from 'react-bootstrap';
import PeliculaCard from '../components/PeliculaCard';
import DetallesPeliculaModal from '../components/DetallesPeliculaModal';
import usePeliculas from '../hooks/usePeliculas';
import { obtenerPeliculaPorId, agregarPeliculaAlCarrito } from '../services/peliculasService';
import { useKeycloak } from '../context/KeycloakContext';

const CatalogoPeliculas = () => {
  const { peliculas, loading, error, recargarPeliculas } = usePeliculas();
  const { keycloak, authenticated } = useKeycloak();
  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingDetalles, setLoadingDetalles] = useState(false);
  
  // Estados para el toast de notificaciones
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  const handleVerDetalles = async (peliculaId) => {
    try {
      setLoadingDetalles(true);
      const peliculaCompleta = await obtenerPeliculaPorId(peliculaId);
      setPeliculaSeleccionada(peliculaCompleta);
      setShowModal(true);
    } catch (error) {
      console.error('Error al obtener detalles de la película:', error);
      mostrarToast('Error al cargar detalles de la película', 'danger');
    } finally {
      setLoadingDetalles(false);
    }
  };

  const handleAgregarAlCarrito = async (peliculaId) => {
    // Verificar si está autenticado
    if (!authenticated) {
      mostrarToast('Debes iniciar sesión para agregar películas al carrito', 'warning');
      return;
    }

    try {
      const token = keycloak?.token;
      await agregarPeliculaAlCarrito(peliculaId, token);
      mostrarToast('¡Película agregada al carrito exitosamente!', 'success');
    } catch (error) {
      console.error('Error al agregar película al carrito:', error);
      mostrarToast('Error al agregar película al carrito', 'danger');
    }
  };

  const mostrarToast = (mensaje, variant = 'success') => {
    setToastMessage(mensaje);
    setToastVariant(variant);
    setShowToast(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPeliculaSeleccionada(null);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary" />
          <p className="mt-2">Cargando películas...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center text-primary">🎬 Almacén de Películas</h1>
          <p className="text-center fs-4 text-dark fw-light" style={{ color: '#5d4e75' }}>Descubre nuestra colección de películas</p>
          <hr />
        </Col>
      </Row>
      
      <Row className="g-4">
        {peliculas.map((pelicula) => (
          <Col key={pelicula.id} xs={12} md={6} lg={4}>
            <PeliculaCard 
              pelicula={pelicula} 
              onVerDetalles={handleVerDetalles}
              onAgregarAlCarrito={handleAgregarAlCarrito}
            />
          </Col>
        ))}
      </Row>

      {/* Modal de detalles */}
      <DetallesPeliculaModal
        show={showModal}
        handleClose={handleCloseModal}
        pelicula={peliculaSeleccionada}
      />

      {/* Overlay de carga para los detalles */}
      {loadingDetalles && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
             style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
          <Spinner animation="border" variant="light" />
        </div>
      )}
      
      {peliculas.length === 0 && (
        <Row>
          <Col className="text-center py-5">
            <h3 className="text-muted">No hay películas disponibles</h3>
          </Col>
        </Row>
      )}

      {/* Toast Container para notificaciones */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={3000} 
          autohide
          bg={toastVariant}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastVariant === 'success' ? '✅' : toastVariant === 'warning' ? '⚠️' : '❌'} 
              {toastVariant === 'success' ? ' Éxito' : toastVariant === 'warning' ? ' Aviso' : ' Error'}
            </strong>
          </Toast.Header>
          <Toast.Body className={toastVariant === 'success' ? 'text-white' : ''}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default CatalogoPeliculas;