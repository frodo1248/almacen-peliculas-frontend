import { useState, useEffect } from 'react';
import { obtenerPeliculas } from '../services/peliculasService';

const usePeliculas = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarPeliculas = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await obtenerPeliculas();
        setPeliculas(data);
      } catch (err) {
        setError('Error al cargar las películas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarPeliculas();
  }, []);

  return { peliculas, loading, error };
};

export default usePeliculas;