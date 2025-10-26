import axios from 'axios';

// Base URL de tu API
const API_BASE_URL = 'http://localhost:8081';
const CARRITO_API_URL = 'http://localhost:8080';

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

// Función para obtener el carrito del usuario
export const obtenerCarrito = async (token = null) => {
  try {
    const config = {};
    
    // Si hay token, agregarlo a los headers
    if (token) {
      config.headers = {
        'Authorization': `Bearer ${token}`
      };
    }
    
    const response = await axios.get(`${CARRITO_API_URL}/carrito`, config);
    return response.data;
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    throw error;
  }
};

// Función para agregar película al carrito
export const agregarPeliculaAlCarrito = async (peliculaId, token = null) => {
  try {
    const config = {};
    
    // Si hay token, agregarlo a los headers
    if (token) {
      config.headers = {
        'Authorization': `Bearer ${token}`
      };
    }
    
    console.log(`🛒 Agregando película ${peliculaId} al carrito...`);
    
    const response = await axios.post(
      `${CARRITO_API_URL}/carrito/agregar/${peliculaId}`, 
      {}, // Body vacío para el POST
      config
    );
    
    console.log('✅ Película agregada al carrito:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al agregar película al carrito:', error);
    throw error;
  }
};