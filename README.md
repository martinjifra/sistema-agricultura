# Irrigation system — auth team

`team/auth` is the auth team's handoff branch. The team owns the login UI, backend, and NoSQL database. Current `/login` and `/register` pages are public placeholders, not authentication.

Start with [the auth handoff guide](doc/team-guide.md). Common references:

- [Setup, commands, and team ownership](doc/README.md)
- [Frontend architecture and collaboration](doc/frontend-architecture.md)
- [Runtime and development dependencies](doc/dependencies.md)
- [Express API import and database integration](doc/backend.md)

Frontend work belongs in `frontend/src/modules/auth/`; the existing Express API belongs in `backend/` with its own dependencies. Its code has not been imported yet. Database engine, hosting, and API/session contracts still need to be supplied by the auth team; this setup adds no application behavior.

## Cargar datos demo

1. Levantar MongoDB:
   `docker compose up -d`
2. Entrar al backend:
   `cd backend`
3. Instalar dependencias:
   `npm install`
4. Asegurarse de tener configurado `backend/.env` con `MONGO_URI`.
5. Ejecutar:
   `npm run seed`
6. Luego iniciar el backend normalmente.

El script carga usuarios, roles y sensores con datos demo sin duplicar registros existentes. No borra datos de desarrollo ni cambia la lógica del backend ni del frontend.

## Distribución de tareas del equipo

### Persona 1 — Diseño y configuración de la base de datos

Responsable: Yeraldin Vélez

Tareas:
- Definición del modelo no relacional en MongoDB.
- Diseño de las colecciones roles, usuarios, sensores y datos.
- Definición de tipos de datos.
- Definición de referencias mediante ObjectId.
- Relación entre usuarios y roles.
- Relación entre sensores y datos.
- Configuración de MongoDB.
- Configuración de MongoDB mediante Docker.
- Creación y configuración de docker-compose.yml.
- Configuración de la conexión mediante Mongoose.
- Configuración de variables de entorno.
- Pruebas de conexión con MongoDB Compass.
- Documentación de la estructura de la base de datos.

### Persona 2 — Autenticación, usuarios y roles

Responsable: Alejandro Rengifo

Tareas:
- Creación del modelo Rol.
- Creación del modelo Usuario.
- Implementación de los roles administrador y visualizador.
- Creación automática y validación de roles.
- Implementación del registro de usuarios.
- Validación de campos obligatorios.
- Validación de correos duplicados.
- Cifrado de contraseñas con bcrypt.
- Implementación del inicio de sesión.
- Comparación de contraseñas con bcrypt.
- Implementación de JWT.
- Relación de usuarios con roles mediante id_rol.
- Creación de las rutas de autenticación.
- Implementación de POST /api/auth/registro.
- Implementación de POST /api/auth/login.
- Pruebas de registro y login mediante Postman.

### Persona 3 — Sensores y datos

Responsable: Sofia Molano

Tareas:
- Creación del modelo Sensor.
- Implementación de sensores de temperatura.
- Implementación de sensores de humedad.
- Implementación de sensores de luminosidad.
- Manejo de estados activo e inactivo.
- Implementación del CRUD de sensores.
- Creación del modelo Dato.
- Recepción de mediciones mediante JSON.
- Relación de las mediciones mediante id_sensor.
- Registro de fecha y hora.
- Asignación automática de unidades:
  - temperatura → °C
  - humedad → %
  - luminosidad → %
- Validación de sensores activos.
- Validación de porcentajes.
- Consulta general de mediciones.
- Consulta de mediciones por sensor.
- Implementación de:
  - POST /api/sensores
  - GET /api/sensores
  - GET /api/sensores/:id
  - PUT /api/sensores/:id
  - DELETE /api/sensores/:id
  - POST /api/datos
  - GET /api/datos
  - GET /api/datos/sensor/:id_sensor
- Pruebas mediante Postman.

### Persona 4 — Desarrollo del frontend

Responsable: Paula Henao 

Tareas:
- Inicialización del frontend con React y Vite.
- Adaptación del frontend a React + TypeScript.
- Uso de componentes .tsx.
- Configuración de React Router.
- Desarrollo de la vista de inicio de sesión.
- Desarrollo de la vista de registro.
- Desarrollo de vistas de sensores.
- Desarrollo de vistas de datos y mediciones.
- Creación de formularios.
- Creación de componentes reutilizables.
- Organización mediante módulos.
- Uso de pages, components y services.
- Visualización de sensores.
- Visualización del estado de los sensores.
- Visualización de mediciones.
- Preparación de tarjetas, tablas y gráficas.
- Manejo de interfaces según el rol del usuario.

### Persona 5 — Integración, pruebas y datos demo

Responsable: Isabela Ramirez

Tareas:
- Integración del frontend con Express.
- Creación y configuración de servicios del frontend.
- Integración del registro.
- Integración del inicio de sesión.
- Integración de JWT.
- Integración de sensores.
- Integración de datos.
- Manejo de respuestas HTTP.
- Manejo de errores del backend.
- Validación del contrato entre frontend y backend.
- Pruebas de integración.
- Creación de datos demo.
- Creación de ejemplos de usuarios, sensores y mediciones.
- Implementación de seedDemo.js.
- Conversión correcta a ObjectId.
- Conversión de fecha_hora a Date.
- Generación de contraseñas demo con bcrypt.
- Vinculación de usuarios con roles reales.
- Vinculación de datos con sensores reales.
- Prevención de duplicados en el seed.
- Configuración de npm run seed.
- Documentación de la carga del dataset demo.
- Pruebas finales del flujo MongoDB → Express → React.

