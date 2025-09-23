import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center text-center">
        <Col md={8}>
          <h1 className="display-4 text-white mb-4">
            ¡Bienvenido al Almacén de Películas! 🎬
          </h1>
          <p className="lead text-white-50 mb-4">
            Descubre nuestra increíble colección de películas. 
            Explora géneros, directores y actores favoritos.
          </p>
          <Button 
            as={Link} 
            to="/catalogo" 
            variant="primary" 
            size="lg"
            className="shadow"
          >
            Ver Catálogo
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;