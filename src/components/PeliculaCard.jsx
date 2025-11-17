import React, { useState } from 'react';
import { Card, Button, Badge, Row, Col } from 'react-bootstrap';
import './PeliculaCard.css';

const PeliculaCard = ({ pelicula, onVerDetalles, onAgregarAlCarrito }) => {
  const [agregandoCarrito, setAgregandoCarrito] = useState(false);

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(precio);
  };

  const handleAgregarAlCarrito = async () => {
    if (onAgregarAlCarrito) {
      setAgregandoCarrito(true);
      try {
        await onAgregarAlCarrito(pelicula.id);
      } finally {
        setAgregandoCarrito(false);
      }
    }
  };

  return (
    <Card className="h-100 shadow pelicula-card-compact">
      {/* Imagen de la película */}
      {pelicula.imagen && (
        <div className="position-relative overflow-hidden">
          <Card.Img 
            variant="top" 
            src={pelicula.imagen} 
            alt={pelicula.titulo}
            className="card-img-top"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x400/cccccc/666666?text=Sin+Imagen';
            }}
          />
        </div>
      )}
      
      <Card.Header className="text-white">
        <Card.Title 
          className="mb-0 text-ellipsis-multiline" 
          title={pelicula.titulo}
        >
          {pelicula.titulo}
        </Card.Title>
      </Card.Header>
      <Card.Body className="d-flex flex-column p-3">
        {/* Badges con año y precio */}
        <div className="mb-3 d-flex justify-content-between align-items-center badges-section">
          <Badge bg="secondary" className="fs-6">{pelicula.anio}</Badge>
          <Badge bg="success" className="fs-6">{formatearPrecio(pelicula.precio)}</Badge>
        </div>
        
        {/* Información del director */}
        <div className="mb-2 director-section">
          <h6 className="mb-1 fw-bold text-primary">Director</h6>
          <p className="mb-0 text-muted small text-ellipsis-multiline" title={pelicula.director}>
            {pelicula.director}
          </p>
        </div>
        
        {/* Lista de actores principales */}
        <div className="reparto-section">
          <h6 className="mb-1 fw-bold text-primary">Reparto</h6>
          <div className="text-muted small">
            {pelicula.actores.slice(0, 2).map((actor, index) => (
              <div key={index} className="mb-1">
                <i className="bi bi-person-fill me-1"></i>
                <span className="text-ellipsis" title={actor}>{actor}</span>
              </div>
            ))}
            {pelicula.actores.length > 2 && (
              <div className="text-muted fst-italic">
                +{pelicula.actores.length - 2} más
              </div>
            )}
          </div>
        </div>
      </Card.Body>
      <Card.Footer>
        <div className="d-grid gap-2">
          <Button 
            variant="outline-primary" 
            size="sm" 
            className="btn-compact fw-semibold"
            onClick={() => onVerDetalles(pelicula.id)}
          >
            <i className="bi bi-eye me-1"></i>
            Ver Detalles
          </Button>
          <Button 
            variant="success" 
            size="sm" 
            className="btn-compact fw-semibold"
            onClick={handleAgregarAlCarrito}
            disabled={agregandoCarrito || !onAgregarAlCarrito}
          >
            {agregandoCarrito ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
                Agregando...
              </>
            ) : (
              <>
                <i className="bi bi-cart-plus me-1"></i>
                Agregar al Carrito
              </>
            )}
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default PeliculaCard;