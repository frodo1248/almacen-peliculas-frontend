import React, { useState } from 'react';
import { Container, Row, Col, Spinner, Alert, Toast, ToastContainer } from 'react-bootstrap';
import PeliculaCard from '../components/PeliculaCard';
import DetallesPeliculaModal from '../components/DetallesPeliculaModal';
import usePeliculas from '../hooks/usePeliculas';
import { obtenerPeliculaPorId, agregarPeliculaAlCarrito } from '../services/peliculasService';
import { useKeycloak } from '../context/KeycloakContext';
import '../components/PeliculaCard.css';

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
    <div className="content-spacing fade-in">
      {/* Header del catálogo */}
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold text-primary mb-3">
          <i className="bi bi-film me-2"></i>
          Almacén de Películas
        </h1>
        <p className="lead text-muted mb-4">
          Descubre nuestra increíble colección de películas
        </p>
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <hr className="border-primary border-2 opacity-50" />
          </div>
        </div>
      </div>
      
      {/* Grid de películas responsive */}
      <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4 catalog-grid justify-content-center">
        {peliculas.map((pelicula, index) => (
          <Col key={pelicula.id} className="d-flex justify-content-center">
            <div className="fade-in card-container" style={{ animationDelay: `${index * 0.1}s` }}>
              <PeliculaCard 
                pelicula={pelicula} 
                onVerDetalles={handleVerDetalles}
                onAgregarAlCarrito={handleAgregarAlCarrito}
              />
            </div>
          </Col>
        ))}
      </Row>
      
      
      {/* Mensaje cuando no hay películas */}
      {peliculas.length === 0 && (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="bi bi-film display-1 text-muted"></i>
          </div>
          <h3 className="text-muted mb-3">No hay películas disponibles</h3>
          <p className="text-muted">Vuelve más tarde para descubrir nuevos títulos</p>
        </div>
      )}

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
          <div className="text-center">
            <Spinner animation="border" variant="light" size="lg" />
            <div className="text-light mt-2">Cargando detalles...</div>
          </div>
        </div>
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
    </div>
  );
};

export default CatalogoPeliculas;