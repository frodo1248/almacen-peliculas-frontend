import axios from 'axios';

// Usando el proxy de Vite para evitar problemas de CORS
const API_BASE_URL = '/api';
const CARRITO_API_URL = '/api';

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

// Función para agregar una nueva película al catálogo (Solo ADMIN)
export const agregarPelicula = async (peliculaData, token = null) => {
  try {
    const config = {};
    
    // Si hay token, agregarlo a los headers
    if (token) {
      config.headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
    }
    
    console.log('🎬 Agregando nueva película al catálogo...', peliculaData);
    
    const response = await axios.post(
      `${API_BASE_URL}/catalogo`, 
      peliculaData,
      config
    );
    
    console.log('✅ Película agregada al catálogo:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al agregar película al catálogo:', error);
    throw error;
  }
};