import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';

const AgregarPeliculaModal = ({ show, handleClose, onPeliculaAgregada }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    anio: '',
    precio: '',
    director: '',
    actores: '',
    condicion: 'Nueva',
    formato: 'Blu-ray',
    genero: '',
    sinopsis: '',
    imagen: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Preparar los datos para enviar
      const peliculaData = {
        ...formData,
        anio: parseInt(formData.anio),
        precio: parseFloat(formData.precio),
        actores: formData.actores.split(',').map(actor => actor.trim()).filter(actor => actor.length > 0)
      };

      // Llamar a la función callback para agregar la película
      await onPeliculaAgregada(peliculaData);

      // Limpiar el formulario y cerrar el modal
      setFormData({
        titulo: '',
        anio: '',
        precio: '',
        director: '',
        actores: '',
        condicion: 'Nueva',
        formato: 'Blu-ray',
        genero: '',
        sinopsis: '',
        imagen: ''
      });
      handleClose();
    } catch (error) {
      setError(error.message || 'Error al agregar la película');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setError(null);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleCloseModal} size="lg" centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>🎬 Agregar Nueva Película</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              <Alert.Heading>Error</Alert.Heading>
              {error}
            </Alert>
          )}

          <Row className="mb-3">
            <Col md={8}>
              <Form.Group>
                <Form.Label>Título *</Form.Label>
                <Form.Control
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Matrix"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Año *</Form.Label>
                <Form.Control
                  type="number"
                  name="anio"
                  value={formData.anio}
                  onChange={handleChange}
                  required
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="1999"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Director *</Form.Label>
                <Form.Control
                  type="text"
                  name="director"
                  value={formData.director}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Hermanos Wachowski"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Precio *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="1500.00"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Condición *</Form.Label>
                <Form.Select
                  name="condicion"
                  value={formData.condicion}
                  onChange={handleChange}
                  required
                >
                  <option value="Nueva">Nueva</option>
                  <option value="Usada">Usada</option>
                  <option value="Deteriorada">Deteriorada</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Formato *</Form.Label>
                <Form.Select
                  name="formato"
                  value={formData.formato}
                  onChange={handleChange}
                  required
                >
                  <option value="Blu-ray">Blu-ray</option>
                  <option value="DVD">DVD</option>
                  <option value="4K Ultra HD">4K Ultra HD</option>
                  <option value="VHS">VHS</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Género *</Form.Label>
                <Form.Control
                  type="text"
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Ciencia Ficción"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Actores *</Form.Label>
            <Form.Control
              type="text"
              name="actores"
              value={formData.actores}
              onChange={handleChange}
              required
              placeholder="Separados por comas: Keanu Reeves, Laurence Fishburne"
            />
            <Form.Text className="text-muted">
              Ingresa los nombres de los actores separados por comas
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Sinopsis *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="sinopsis"
              value={formData.sinopsis}
              onChange={handleChange}
              required
              placeholder="Ej: Un programador descubre la realidad..."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>URL de Imagen</Form.Label>
            <Form.Control
              type="url"
              name="imagen"
              value={formData.imagen}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            <Form.Text className="text-muted">
              URL de la imagen de la película (opcional)
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Agregando...
              </>
            ) : (
              '🎬 Agregar Película'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AgregarPeliculaModal;