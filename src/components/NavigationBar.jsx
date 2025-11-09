import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Dropdown, Toast, ToastContainer } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useKeycloak } from '../context/KeycloakContext';
import AgregarPeliculaModal from './AgregarPeliculaModal';
import { agregarPelicula } from '../services/peliculasService';

const NavigationBar = () => {
  const location = useLocation();
  const { authenticated, user, keycloak, login, logout, isAdmin } = useKeycloak();
  
  // Estados para el modal y notificaciones
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  // Función para manejar la adición de películas
  const handleAgregarPelicula = async (peliculaData) => {
    try {
      const token = keycloak?.token;
      await agregarPelicula(peliculaData, token);
      
      mostrarToast('¡Película agregada exitosamente al catálogo!', 'success');
      
    } catch (error) {
      console.error('Error al agregar película:', error);
      mostrarToast('Error al agregar la película al catálogo', 'danger');
      throw error;
    }
  };

  const mostrarToast = (mensaje, variant = 'success') => {
    setToastMessage(mensaje);
    setToastVariant(variant);
    setShowToast(true);
  };

  // Debug para verificar el estado
  console.log('🔍 NavigationBar Debug:', {
    authenticated,
    isAdminResult: authenticated ? isAdmin() : 'not authenticated',
    user,
    keycloak: !!keycloak
  });
  
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow">
      <Container>
        <Navbar.Brand as={Link} to="/">
          🎬 Almacén de Películas
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              active={location.pathname === '/' || location.pathname === '/catalogo'}
            >
              🎬 Catálogo
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/carrito" 
              active={location.pathname === '/carrito'}
            >
              🛒 Mi Carrito
            </Nav.Link>
            
            {/* Botón para agregar película - Solo para ADMIN */}
            {authenticated && isAdmin() && (
              <Nav.Link 
                as={Button}
                variant="outline-success"
                size="sm"
                className="mx-2"
                onClick={() => setShowAgregarModal(true)}
              >
                ➕ Agregar Película
              </Nav.Link>
            )}
            
            {/* Aquí puedes agregar más opciones en el futuro */}
            {/* 
            <Nav.Link as={Link} to="/buscar">Buscar</Nav.Link>
            <Nav.Link as={Link} to="/favoritas">Favoritas</Nav.Link>
            */}
          </Nav>
          
          {/* Sección de autenticación */}
          <Nav className="ms-auto">
            {authenticated ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-light" id="dropdown-user">
                  👤 {user?.firstName || user?.username || 'Usuario'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.ItemText>
                    <small className="text-muted">
                      {user?.email || 'Email no disponible'}
                    </small>
                  </Dropdown.ItemText>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={logout}>
                    🚪 Cerrar Sesión
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button variant="outline-light" onClick={login}>
                🔐 Iniciar Sesión
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
      
      {/* Modal para agregar película */}
      <AgregarPeliculaModal
        show={showAgregarModal}
        handleClose={() => setShowAgregarModal(false)}
        onPeliculaAgregada={handleAgregarPelicula}
      />
      
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
    </Navbar>
  );
};

export default NavigationBar;