# 🎬 Almacén de Películas - Frontend

> Aplicación frontend para un videoclub desarrollada con React, que permite navegar un catálogo de películas y gestionar un carrito de compras con autenticación via Keycloak.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#️-tecnologías)
- [Arquitectura](#️-arquitectura)
- [Instalación](#-instalación)
- [Configuración](#️-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Componentes Principales](#️-componentes-principales)
- [Hooks Personalizados](#-hooks-personalizados)
- [Autenticación](#-autenticación)
- [Scripts Disponibles](#-scripts-disponibles)
- [Desarrollo](#-desarrollo)

## ✨ Características

- **Catálogo de Películas**: Navegación y visualización de películas disponibles
- **Detalles de Películas**: Modal con información completa de cada película
- **Carrito de Compras**: Gestión de películas seleccionadas para renta
- **Autenticación Segura**: Login/logout via Keycloak
- **Interfaz Responsiva**: Diseño adaptable con Bootstrap
- **Navegación Intuitiva**: Enrutamiento con React Router
- **Estados de Carga**: Spinners y mensajes informativos
- **Notificaciones**: Sistema de toasts para feedback del usuario

## 🛠️ Tecnologías

### Core

- **React 19.1.1** - Biblioteca principal para UI
- **Vite** - Build tool y servidor de desarrollo
- **React Router Dom** - Navegación y enrutamiento
- **Axios** - Cliente HTTP para APIs

### UI/UX

- **React Bootstrap 2.10.10** - Componentes de interfaz
- **Bootstrap 5.3.8** - Framework CSS
- **React Router Bootstrap** - Integración de enrutamiento con Bootstrap

### Autenticación

- **Keycloak-js 26.2.1** - Cliente JavaScript para Keycloak
- **Context API** - Gestión de estado de autenticación

### Desarrollo

- **ESLint** - Linting de código
- **TypeScript Types** - Tipado para desarrollo

## 🏗️ Arquitectura

```
Frontend (React)
├── Keycloak Authentication
├── React Router Navigation
├── Bootstrap UI Components
└── Axios HTTP Client
    ├── API Catálogo (Puerto 8081)
    └── API Carrito (Puerto 8080)
```

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Keycloak Server corriendo en `localhost:9090`
- API Backend del catálogo en `localhost:8081`
- API Backend del carrito en `localhost:8080`

### Pasos

1. **Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd almacen-peliculas
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno** (opcional)

```bash
# Crear archivo .env si necesitas configuraciones específicas
cp .env.example .env
```

4. **Iniciar servidor de desarrollo**

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## ⚙️ Configuración

### Keycloak

El archivo `src/config/keycloak.js` contiene la configuración de Keycloak:

```javascript
const keycloakConfig = {
  url: "http://localhost:9090",
  realm: "videoclub",
  clientId: "web",
};
```

### APIs Backend

Las URLs de las APIs se configuran en `src/services/peliculasService.js`:

```javascript
const API_BASE_URL = "http://localhost:8081"; // API Catálogo
const CARRITO_API_URL = "http://localhost:8080"; // API Carrito
```

## 📖 Uso

### 1. Navegación Pública

- Accede al catálogo de películas sin autenticación
- Ve detalles de cualquier película
- Navega por la interfaz libremente

### 2. Funciones Autenticadas

- Haz clic en "Iniciar Sesión" en la barra de navegación
- Se abrirá Keycloak para autenticación
- Una vez logueado puedes:
  - Agregar películas al carrito
  - Ver tu carrito personal
  - Gestionar tu sesión

### 3. Gestión del Carrito

- Solo usuarios autenticados pueden agregar películas
- El carrito persiste durante la sesión
- Se muestra feedback visual al agregar elementos

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── DetallesPeliculaModal.jsx
│   ├── ErrorDisplay.jsx
│   ├── Layout.jsx
│   ├── NavigationBar.jsx
│   ├── PeliculaCard.jsx
│   └── ProtectedRoute.jsx
├── config/              # Configuraciones
│   ├── keycloak.js
│   └── keycloakTest.js
├── context/             # Context API
│   └── KeycloakContext.jsx
├── hooks/               # Custom Hooks
│   ├── useAuthenticatedApi.js
│   ├── useCarrito.js
│   └── usePeliculas.js
├── pages/               # Páginas principales
│   ├── Carrito.jsx
│   ├── CatalogoPeliculas.jsx
│   └── Home.jsx
├── services/            # Servicios API
│   └── peliculasService.js
├── assets/              # Recursos estáticos
├── App.jsx              # Componente principal
├── main.jsx             # Punto de entrada
├── App.css              # Estilos principales
└── index.css            # Estilos base
```

## 🔌 API Endpoints

### Catálogo de Películas (Puerto 8081)

```
GET /catalogo          # Obtener todas las películas
GET /catalogo/{id}     # Obtener película por ID
```

### Carrito (Puerto 8080)

```
GET /carrito           # Obtener carrito del usuario autenticado
POST /carrito/agregar/{id}  # Agregar película al carrito
```

## 🧩 Componentes Principales

### `App.jsx`

- Componente raíz de la aplicación
- Configura el provider de Keycloak
- Define las rutas principales

### `Layout.jsx`

- Layout base con navegación
- Wrapper para todas las páginas

### `NavigationBar.jsx`

- Barra de navegación responsiva
- Botones de login/logout
- Enlaces a diferentes secciones

### `CatalogoPeliculas.jsx`

- Página principal del catálogo
- Grid de tarjetas de películas
- Modal de detalles

### `Carrito.jsx`

- Página del carrito de compras
- Requiere autenticación
- Lista de películas agregadas

### `PeliculaCard.jsx`

- Tarjeta individual de película
- Botones de acción (ver detalles, agregar al carrito)

## 🪝 Hooks Personalizados

### `usePeliculas`

```javascript
const { peliculas, loading, error } = usePeliculas();
```

- Obtiene y gestiona el estado del catálogo de películas

### `useCarrito`

```javascript
const { carrito, loading, error, recargarCarrito } = useCarrito();
```

- Gestiona el estado del carrito del usuario autenticado

### `useAuthenticatedApi`

```javascript
const { authenticatedGet, authenticatedPost, isAuthenticated } =
  useAuthenticatedApi();
```

- Proporciona funciones para hacer requests autenticados
- Maneja automáticamente los tokens de Keycloak

## 🔐 Autenticación

### Keycloak Integration

La aplicación usa Keycloak para autenticación con las siguientes características:

- **Realm**: `videoclub`
- **Client**: `web`
- **Tipo**: Public client
- **Flujo**: Authorization Code Flow
- **Silent Check SSO**: Habilitado

### Context de Autenticación

El `KeycloakContext` proporciona:

```javascript
{
  keycloak, // Instancia de Keycloak
    authenticated, // Estado de autenticación
    loading, // Estado de carga
    userProfile, // Perfil del usuario
    login, // Función de login
    logout; // Función de logout
}
```

### Protección de Rutas

- Algunas funciones requieren autenticación (agregar al carrito)
- Las rutas protegidas muestran mensajes informativos para usuarios no autenticados
- Redirección automática después del login

## 📜 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Linting del código
```

## 🔧 Desarrollo

### Estructura de Desarrollo

1. **Componentes**: Crear componentes reutilizables en `/components`
2. **Páginas**: Nuevas páginas en `/pages`
3. **Hooks**: Lógica reutilizable en `/hooks`
4. **Servicios**: Llamadas API en `/services`

### Estándares de Código

- Usar ESLint para mantener consistencia
- Componentes funcionales con hooks
- Nomenclatura en español para componentes de dominio
- Imports organizados por tipo

### Testing

```bash
# Ejecutar tests (configurar según necesidades)
npm test
```

### Build y Deploy

```bash
# Crear build optimizado
npm run build

# La carpeta dist/ contiene los archivos para producción
```

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📝 Notas de Desarrollo

### Estado Actual

- ✅ Catálogo de películas funcional
- ✅ Autenticación con Keycloak
- ✅ Carrito básico implementado
- ✅ Interfaz responsiva
- ✅ Manejo de errores y estados de carga

### Próximas Funcionalidades

- 🔄 Búsqueda y filtros de películas
- 🔄 Favoritos del usuario
- 🔄 Historial de rentas
- 🔄 Checkout y pagos
- 🔄 Perfiles de usuario avanzados

### Problemas Conocidos

- Manejar expiración de tokens automáticamente
- Mejorar cache de datos del catálogo
- Optimizar re-renders innecesarios

---

## 📞 Contacto y Soporte

Para preguntas sobre el proyecto o reportar issues:

- Crear issue en el repositorio
- Contactar al equipo de desarrollo

**¡Gracias por usar Almacén de Películas! 🎬**
