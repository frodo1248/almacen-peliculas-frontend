import React from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Badge, ListGroup } from 'react-bootstrap';
import { useKeycloak } from '../context/KeycloakContext';
import useCarrito from '../hooks/useCarrito';

const Carrito = () => {
  const { authenticated, loading: authLoading } = useKeycloak();
  const { carrito, loading, error, recargarCarrito } = useCarrito();

  // Mostrar spinner si está cargando la autenticación
  if (authLoading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  // Si no está autenticado
  if (!authenticated) {
    return (
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={8}>
            <Alert variant="warning" className="text-center">
              <Alert.Heading>🔐 Acceso Restringido</Alert.Heading>
              <p>Debes iniciar sesión para ver tu carrito de compras.</p>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center text-primary">🛒 Mi Carrito</h1>
          <p className="text-center text-muted">Películas que has agregado a tu carrito</p>
          <hr />
        </Col>
      </Row>

      {loading && (
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Cargando carrito...</span>
            </Spinner>
            <p className="mt-2">Cargando tu carrito...</p>
          </Col>
        </Row>
      )}

      {error && (
        <Row className="justify-content-center">
          <Col md={8}>
            <Alert variant="danger">
              <Alert.Heading>❌ Error</Alert.Heading>
              <p>No se pudo cargar el carrito: {error}</p>
              <hr />
              <div className="d-flex justify-content-end">
                <button 
                  className="btn btn-outline-danger"
                  onClick={recargarCarrito}
                >
                  🔄 Intentar de nuevo
                </button>
              </div>
            </Alert>
          </Col>
        </Row>
      )}

      {!loading && !error && (
        <>
          {/* Información del carrito */}
          <Row className="mb-3">
            <Col>
              <Card className="border-primary">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">
                    📊 Resumen del Carrito 
                    <Badge bg="light" text="dark" className="ms-2">
                      {carrito?.cantidadItems || 0} elemento(s)
                    </Badge>
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p className="mb-1"><strong>ID del Carrito:</strong> {carrito?.id || 'N/A'}</p>
                      <p className="mb-1"><strong>Cantidad de items:</strong> {carrito?.cantidadItems || 0}</p>
                    </Col>
                    <Col md={6}>
                      <p className="mb-1"><strong>Total:</strong> <span className="text-success fw-bold">${carrito?.total || 0}</span></p>
                      {carrito?.fechaCreacion && (
                        <p className="mb-1 text-muted small">
                          <strong>Creado:</strong> {new Date(carrito.fechaCreacion).toLocaleString()}
                        </p>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Lista de elementos del carrito */}
          <Row>
            <Col>
              {!carrito?.items || carrito.items.length === 0 ? (
                <Card className="text-center">
                  <Card.Body className="py-5">
                    <h3>🛒 Carrito Vacío</h3>
                    <p className="text-muted">
                      No tienes películas en tu carrito aún.
                    </p>
                    <p className="text-muted">
                      ¡Ve al catálogo y agrega algunas películas!
                    </p>
                    {carrito?.id && (
                      <small className="text-muted">
                        Carrito #{carrito.id} listo para recibir películas
                      </small>
                    )}
                  </Card.Body>
                </Card>
              ) : (
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">🎬 Películas en tu carrito</h5>
                  </Card.Header>
                  <ListGroup variant="flush">
                    {carrito.items.map((item, index) => (
                      <ListGroup.Item key={item.id || index} className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">
                            {item.pelicula?.titulo || item.titulo || item.nombre || item.title || `Película ${index + 1}`}
                          </h6>
                          {item.pelicula?.descripcion && (
                            <p className="mb-1 text-muted small">{item.pelicula.descripcion}</p>
                          )}
                          {item.precio && (
                            <small className="text-success fw-bold">${item.precio}</small>
                          )}
                        </div>
                        <div className="text-end">
                          {item.cantidad && (
                            <Badge bg="primary" pill className="mb-1">
                              Cantidad: {item.cantidad}
                            </Badge>
                          )}
                          {item.subtotal && (
                            <div>
                              <small className="text-success fw-bold">Subtotal: ${item.subtotal}</small>
                            </div>
                          )}
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  
                  {/* Total del carrito */}
                  <Card.Footer className="bg-light">
                    <Row>
                      <Col className="text-end">
                        <h5 className="mb-0">
                          <strong>Total: <span className="text-success">${carrito.total}</span></strong>
                        </h5>
                      </Col>
                    </Row>
                  </Card.Footer>
                </Card>
              )}
            </Col>
          </Row>

          {/* Botón para recargar */}
          <Row className="mt-3">
            <Col className="text-center">
              <button 
                className="btn btn-outline-primary"
                onClick={recargarCarrito}
                disabled={loading}
              >
                🔄 Actualizar carrito
              </button>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Carrito;