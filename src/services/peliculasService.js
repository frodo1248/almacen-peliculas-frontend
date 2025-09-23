import axios from 'axios';

// Base URL de tu API
const API_BASE_URL = 'http://localhost:8080';

// Función para obtener películas desde tu API
export const obtenerPeliculas = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/catalogo`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener películas:', error);
    throw error;
  }
};

// Función para obtener una película por ID
export const obtenerPeliculaPorId = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/catalogo/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener película:', error);
    throw error;
  }
};