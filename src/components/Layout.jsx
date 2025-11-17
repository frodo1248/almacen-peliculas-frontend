import React from 'react';
import { Container } from 'react-bootstrap';
import NavigationBar from './NavigationBar';

const Layout = ({ children }) => {
  return (
    <div className="App min-vh-100 d-flex flex-column">
      <NavigationBar />
      <main className="flex-grow-1 py-3">
        <Container fluid="lg" className="px-2 px-md-3">
          {children}
        </Container>
      </main>
      <footer className="bg-dark text-light py-3 mt-auto">
        <Container>
          <div className="text-center">
            <small>&copy; 2025 Almacén de Películas. Todos los derechos reservados.</small>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Layout;