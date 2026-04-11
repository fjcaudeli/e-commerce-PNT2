# E-commerce App - Frontend Angular

Frontend académico para un e-commerce básico con login, registro, listado de productos, detalle, carrito y confirmación de compra.

El proyecto está hecho en Angular y actualmente funciona sin backend usando datos mockeados. La idea es poder probar el flujo completo de la pantalla antes de hacer la integración con la API.

## Cómo ejecutar el proyecto

Instalar dependencias:

```bash
npm install
```

Levantar Angular:

```bash
npm start
```

Por defecto abre en:

```txt
http://localhost:4200
```

Si el puerto 4200 está ocupado:

```bash
npm start -- --port 4300
```

## Usuario de prueba

Mientras el proyecto esté usando mocks, se puede iniciar sesión con:

```txt
Usuario: admin
Clave: 1234
```

También existe una pantalla de registro, pero al estar mockeada los usuarios creados se guardan solo en memoria. Si se recarga completamente la app, se pierden.

## Sobre los mocks

El frontend actualmente usa mocks para poder probar la página sin depender del backend.

La configuración está en:

```txt
src/app/config/api.config.ts
```

Ahí está esta opción:

```ts
useMocks: true
```

Mientras esté en `true`, los servicios usan datos falsos cargados en memoria.

Cuando el backend esté listo, hay que cambiarlo a:

```ts
useMocks: false
```

Con eso los servicios empiezan a usar `HttpClient` para llamar a la API real.

También se puede eliminar la lógica mock más adelante, pero conviene hacerlo recién cuando la integración ya esté funcionando.

## Archivos principales para la integración

Configuración general de API:

```txt
src/app/config/api.config.ts
```

Servicios que ya están preparados para cambiar de mock a HTTP:

```txt
src/app/Services/authService.ts
src/app/Services/productoService.ts
src/app/Services/ordenService.ts
src/app/Services/usuario-service.ts
```

El carrito hoy vive en el frontend:

```txt
src/app/Services/carritoService.ts
```

Eso está bien para esta primera versión. Si después el backend tiene endpoints para guardar carrito por usuario, habría que adaptar también ese servicio.

## Configuración actual de endpoints

En `api.config.ts` está configurado así:

```ts
export const API_CONFIG = {
  useMocks: true,
  baseUrl: 'https://localhost:7271/api',
  endpoints: {
    login: '/login',
    registro: '/login/create',
    productos: '/productos',
    ordenes: '/ordenes',
    usuarios: '/usuarios'
  }
};
```

Si el backend usa otro puerto o nombres de rutas distintos, hay que cambiar `baseUrl` y/o los endpoints.

Ejemplo:

```ts
baseUrl: 'https://localhost:7001/api'
```

## Integración con backend

Pasos simples para integrar:

1. Levantar el backend.
2. Confirmar la URL base de la API, por ejemplo `https://localhost:7271/api`.
3. Editar `src/app/config/api.config.ts`.
4. Cambiar `useMocks` a `false`.
5. Ajustar los endpoints si el backend usa nombres distintos.
6. Probar login.
7. Probar listado y detalle de productos.
8. Probar agregar al carrito y confirmar compra.

## Contratos esperados por el frontend

### Login

El frontend envía:

```ts
{
  usuario: string,
  clave: string
}
```

El frontend espera una respuesta parecida a:

```ts
{
  codigo: number,
  mensaje: string,
  estado: boolean,
  estadoUsuario?: string,
  fechaLogin?: string,
  token?: string,
  usuario?: {
    id: number,
    usuario: string,
    nombreCompleto?: string,
    token?: string
  }
}
```

Lo más importante es que, si el login salió bien, venga:

```ts
estado: true
token: string
```

### Registro

La pantalla de registro usa:

```ts
{
  nombreCompleto: string,
  usuario: string,
  clave: string
}
```

En `authService.ts`, cuando se usa HTTP, se transforma a:

```ts
{
  usuario: string,
  nombre: string,
  clave: string
}
```

Esto se hizo siguiendo el ejemplo del proyecto de Microservicios. Si el backend final usa otro nombre de propiedad, se cambia ahí.

### Productos

El frontend espera productos con esta forma:

```ts
{
  id: number,
  nombre: string,
  precio: number,
  stock: number,
  descripcion: string
}
```

Se usan en:

```txt
src/app/Services/productoService.ts
src/app/Components/producto-component
src/app/Components/producto-componente-detalle
```

### Confirmar orden

Al confirmar compra, el frontend manda:

```ts
{
  items: [
    {
      productoId: number,
      cantidad: number
    }
  ]
}
```

Y espera recibir una respuesta parecida a:

```ts
{
  orden: {
    id?: number,
    usuarioId?: number,
    items: CarritoItem[],
    total: number,
    fecha: string,
    estado: 'Pendiente' | 'Confirmada' | 'Cancelada'
  },
  mensaje: string
}
```

Si el backend devuelve otro formato, se adapta en:

```txt
src/app/Services/ordenService.ts
```

## Dónde están los productos mock

Los productos de prueba están en:

```txt
src/app/Services/productoService.ts
```

Dentro del arreglo:

```ts
private productos: Producto[] = [...]
```

Eso solo se usa mientras `useMocks` esté en `true`.

## Qué no subir a GitHub

No subir carpetas generadas o dependencias locales:

```txt
node_modules/
dist/
.angular/
```

Con subir `src`, `package.json`, `package-lock.json`, `angular.json` y los archivos de configuración alcanza para que otra persona pueda instalar y ejecutar el proyecto.
