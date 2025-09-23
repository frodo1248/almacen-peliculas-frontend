import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';

const PeliculaCard = ({ pelicula, onVerDetalles }) => {
  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(precio);
  };

  return (
    <Card className="h-100 shadow-sm">
      {/* Imagen de la película */}
      {pelicula.imagen && (
        <Card.Img 
          variant="top" 
          src={pelicula.imagen} 
          alt={pelicula.titulo}
          style={{ 
            height: '300px', 
            objectFit: 'cover' 
          }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x400/cccccc/666666?text=Sin+Imagen';
          }}
        />
      )}
      
      <Card.Header className="bg-primary text-white">
        <Card.Title className="mb-0">{pelicula.titulo}</Card.Title>
      </Card.Header>
      <Card.Body>
        <div className="mb-2">
          <Badge bg="secondary" className="me-2">{pelicula.anio}</Badge>
          <Badge bg="success">{formatearPrecio(pelicula.precio)}</Badge>
        </div>
        
        <Card.Text>
          <strong>Director:</strong> {pelicula.director}
        </Card.Text>
        
        <Card.Text>
          <strong>Actores:</strong>
          <ul className="list-unstyled mt-1">
            {pelicula.actores.map((actor, index) => (
              <li key={index} className="text-muted">• {actor}</li>
            ))}
          </ul>
        </Card.Text>
      </Card.Body>
      <Card.Footer className="bg-light">
        <Button 
          variant="outline-primary" 
          size="sm" 
          className="w-100"
          onClick={() => onVerDetalles(pelicula.id)}
        >
          Ver Detalles
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default PeliculaCard;