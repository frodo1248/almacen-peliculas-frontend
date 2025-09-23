import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const NavigationBar = () => {
  const location = useLocation();
  
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
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;