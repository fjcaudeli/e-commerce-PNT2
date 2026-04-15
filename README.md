# E-commerce PNT2

Proyecto academico de e-commerce con frontend Angular y backend ASP.NET Core.

## Estructura

```txt
E-commerce Front-End/                 Frontend Angular
backend/api.ecommerce/                Backend ASP.NET Core
backend/api.ecommerce/api.ecommerce/  API principal
```

## Requisitos

- Node.js y npm
- .NET SDK 10
- Git

## Puertos usados

```txt
Frontend: http://127.0.0.1:4200
Backend:  http://localhost:5208
Swagger:  http://localhost:5208
API base: http://localhost:5208/api
```

El backend publica Swagger en la raiz del sitio, por eso Swagger se abre en el mismo puerto de la API.

## Como ejecutar el backend

Desde la raiz del repositorio:

```powershell
cd backend\api.ecommerce\api.ecommerce
dotnet restore
dotnet run
```

Cuando levanta correctamente, la consola muestra:

```txt
Now listening on: http://localhost:5208
```

Despues se puede abrir Swagger en:

```txt
http://localhost:5208
```

## Como ejecutar el frontend

En otra terminal, desde la raiz del repositorio:

```powershell
cd "E-commerce Front-End"
npm install
npm run start -- --host 127.0.0.1 --port 4200
```

Despues abrir:

```txt
http://127.0.0.1:4200
```

## Usuarios de prueba

Credenciales disponibles para probar el login:

```txt
usuario123 / contrasenia3333
nombre_usuario / contrasenia123
aki / lovekittens123
```

## Autenticacion

El backend usa JWT Bearer Token.

Para probar endpoints protegidos desde Swagger:

1. Ejecutar `POST /api/users/Login`.
2. Copiar el token devuelto.
3. Presionar el boton `Authorize`.
4. Pegar el token con el formato:

```txt
Bearer TU_TOKEN
```

El frontend guarda el token en `localStorage` y lo envia automaticamente en las llamadas HTTP mediante un interceptor.

## Endpoints principales

```txt
POST   /api/users/Login
POST   /api/users/Register

GET    /api/products/GetAll
GET    /api/products/GetById/{id}

GET    /api/cart/GetCart/{userId}
POST   /api/cart/Add
PUT    /api/cart/Update
DELETE /api/cart/Remove/{cartId}

POST   /api/compra/Confirm/{userId}
GET    /api/compra/GetByUser/{userId}
```

Los endpoints de carrito y compra requieren token.

## Base de datos

La API usa SQLite. El archivo esta en:

```txt
backend/api.ecommerce/api.ecommerce/Database/ecommerce.db
```

Durante pruebas o demos, si se modifica el stock o los datos locales y se quiere volver al estado versionado del repositorio:

```powershell
git restore -- backend/api.ecommerce/api.ecommerce/Database/ecommerce.db
```

Esto descarta los cambios locales de la base SQLite.

## Comandos utiles

Compilar backend:

```powershell
dotnet build backend\api.ecommerce\api.ecommerce\api.ecommerce.csproj
```

Compilar frontend:

```powershell
cd "E-commerce Front-End"
npm run build
```

Ver estado de Git:

```powershell
git status --short --branch
```

## Archivos generados

No hace falta commitear carpetas o archivos generados como:

```txt
node_modules/
dist/
.angular/
bin/
obj/
*.log
```

Ya estan contemplados en `.gitignore`.
