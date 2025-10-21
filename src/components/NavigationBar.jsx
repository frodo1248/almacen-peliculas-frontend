import React from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useKeycloak } from '../context/KeycloakContext';

const NavigationBar = () => {
  const location = useLocation();
  const { authenticated, user, login, logout } = useKeycloak();
  
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
              Catálogo
            </Nav.Link>
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
    </Navbar>
  );
};

export default NavigationBar;