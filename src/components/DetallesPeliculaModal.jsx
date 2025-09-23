import React from 'react';
import { Modal, Button, Badge, Row, Col, Image } from 'react-bootstrap';

const DetallesPeliculaModal = ({ show, handleClose, pelicula }) => {
  if (!pelicula) return null;

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(precio);
  };

  const getCondicionVariant = (condicion) => {
    switch (condicion?.toLowerCase()) {
      case 'nueva':
        return 'success';
      case 'usado':
        return 'warning';
      case 'deteriorado':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>{pelicula.titulo}</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Row>
          {/* Columna de la imagen */}
          <Col md={4} className="mb-3">
            <Image 
              src={pelicula.imagen} 
              alt={pelicula.titulo}
              fluid
              rounded
              style={{ maxHeight: '400px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x400/cccccc/666666?text=Sin+Imagen';
              }}
            />
          </Col>
          
          {/* Columna de la información */}
          <Col md={8}>
            <div className="mb-3">
              <Badge bg="secondary" className="me-2">{pelicula.anio}</Badge>
              <Badge bg="info" className="me-2">{pelicula.genero}</Badge>
              <Badge bg={getCondicionVariant(pelicula.condicion)} className="me-2">
                {pelicula.condicion}
              </Badge>
              <Badge bg="dark">{pelicula.formato}</Badge>
            </div>

            <div className="mb-3">
              <h5 className="text-success">{formatearPrecio(pelicula.precio)}</h5>
            </div>

            <div className="mb-3">
              <h6><strong>Director:</strong></h6>
              <p className="text-muted">{pelicula.director}</p>
            </div>

            <div className="mb-3">
              <h6><strong>Actores:</strong></h6>
              <div>
                {pelicula.actores && pelicula.actores.map((actor, index) => (
                  <Badge key={index} bg="secondary" className="me-1 mb-1">
                    {actor}
                  </Badge>
                ))}
              </div>
            </div>

            {pelicula.sinopsis && (
              <div className="mb-3">
                <h6><strong>Sinopsis:</strong></h6>
                <p className="text-justify">{pelicula.sinopsis}</p>
              </div>
            )}
          </Col>
        </Row>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        <Button variant="primary">
          Agregar al Carrito
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DetallesPeliculaModal;