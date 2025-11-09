# 🎬 Funcionalidad de Administrador - Agregar Películas

## Descripción

Se ha implementado una nueva funcionalidad que permite a los usuarios con rol **ADMIN** agregar nuevas películas al catálogo directamente desde la interfaz web.

## Características Implementadas

### 1. Verificación de Roles en Keycloak

- Se agregaron las funciones `hasRole()` e `isAdmin()` al contexto de Keycloak
- La verificación se hace tanto a nivel de realm como de resource roles
- Solo usuarios autenticados con rol **ADMIN** pueden ver y usar la funcionalidad

### 2. Botón de Administrador

- **Ubicación**: Barra de navegación, entre "Mi Carrito" y la sección de usuario
- **Visibilidad**: Solo aparece para usuarios autenticados con rol ADMIN
- **Estilo**: Botón verde con ícono "➕ Agregar Película"

### 3. Modal de Agregar Película

Un formulario completo con los siguientes campos:

#### Campos Obligatorios (\*)

- **Título**: Nombre de la película
- **Año**: Año de lanzamiento (1900 - año actual)
- **Director**: Director de la película
- **Precio**: Precio de la película (número decimal)
- **Actores**: Lista separada por comas
- **Género**: Género cinematográfico
- **Sinopsis**: Descripción de la película

#### Campos con Valores Predeterminados

- **Condición**: Nueva (seleccionable: Nueva, Usada, Deteriorada)
- **Formato**: Blu-ray (seleccionable: Blu-ray, DVD, 4K Ultra HD, VHS)

#### Campo Opcional

- **URL de Imagen**: Enlace a la imagen de portada

### 4. Servicio de API

Se implementó la función `agregarPelicula()` en `peliculasService.js` que:

- Hace POST a `http://localhost:8081/catalogo`
- Incluye el token de autenticación en los headers
- Maneja errores apropiadamente

## Formato de Datos

El backend espera recibir un JSON con este formato:

```json
{
  "titulo": "Matrix",
  "anio": 1999,
  "precio": 1500.0,
  "director": "Hermanos Wachowski",
  "actores": ["Keanu Reeves", "Laurence Fishburne"],
  "condicion": "Usada",
  "formato": "Blu-ray",
  "genero": "Ciencia Ficción",
  "sinopsis": "Un programador descubre la realidad.",
  "imagen": "https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2016/11/matrix.jpg?tf=3840x"
}
```

## Flujo de Uso

1. **Autenticación**: El usuario debe estar logueado con rol ADMIN
2. **Acceso**: El botón "➕ Agregar Película" aparece en la barra de navegación
3. **Formulario**: Hacer clic abre el modal con el formulario
4. **Validación**: Los campos obligatorios deben completarse
5. **Envío**: El formulario envía los datos al backend
6. **Feedback**: Toast de confirmación o error
7. **Actualización**: El catálogo se puede refrescar para ver la nueva película

## Configuración de Keycloak

Para que funcione correctamente, el usuario debe tener el rol **ROLE_ADMIN** asignado en Keycloak:

### En el Realm 'videoclub':

1. Ir a **Roles** → **Realm Roles**
2. Crear role **ROLE_ADMIN** (si no existe)
3. Ir a **Users** → Seleccionar usuario
4. **Role Mappings** → Asignar role **ROLE_ADMIN**

### Alternativamente, en Client Roles:

1. Ir a **Clients** → **web** → **Roles**
2. Crear role **ROLE_ADMIN** (si no existe)
3. Asignar al usuario en **Role Mappings** → **Client Roles**

### Verificar Token:

El token debe contener el rol en `realm_access.roles`:

```json
"realm_access": {
  "roles": [
    "offline_access",
    "ROLE_ADMIN",
    "uma_authorization",
    "default-roles-videoclub"
  ]
}
```

## Archivos Modificados

### Nuevos Archivos:

- `src/components/AgregarPeliculaModal.jsx` - Modal para agregar películas

### Archivos Modificados:

- `src/context/KeycloakContext.jsx` - Agregadas funciones de verificación de roles
- `src/services/peliculasService.js` - Agregada función agregarPelicula
- `src/components/NavigationBar.jsx` - Botón de admin y manejo de modal
- `src/hooks/usePeliculas.js` - Función de recarga de películas
- `src/pages/CatalogoPeliculas.jsx` - Uso de función de recarga

## Seguridad

- ✅ **Frontend**: Verificación de rol ADMIN antes de mostrar el botón
- ✅ **API**: El token de autenticación se envía en cada request
- ⚠️ **Backend**: Debe validar el rol ADMIN en el endpoint POST /catalogo

## Posibles Mejoras Futuras

1. **Validación de Imágenes**: Verificar que la URL de imagen sea válida
2. **Edición de Películas**: Funcionalidad para editar películas existentes
3. **Eliminación de Películas**: Funcionalidad para eliminar películas
4. **Carga de Imágenes**: Upload de imágenes locales
5. **Previsualización**: Vista previa de la película antes de guardar
6. **Validación Avanzada**: Verificar duplicados, datos de actores, etc.

## Troubleshooting

### El botón no aparece:

1. Verificar que el usuario esté autenticado
2. Confirmar que tiene rol ADMIN en Keycloak
3. Verificar que Keycloak esté funcionando correctamente

### Error al agregar película:

1. Verificar que el backend esté corriendo en puerto 8081
2. Confirmar que el endpoint POST /catalogo existe
3. Revisar los logs del navegador para errores específicos
4. Verificar que el token de autenticación sea válido

### Problemas de Keycloak:

1. Verificar configuración en `src/config/keycloak.js`
2. Confirmar que el realm 'videoclub' existe
3. Verificar que el client 'web' esté configurado correctamente
