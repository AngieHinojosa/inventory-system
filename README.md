📦 Inventory Management API
API REST para gestión de inventario, construida con NestJS, PostgreSQL y Docker.
Permite manejar productos, categorías y movimientos de stock, con validaciones, paginación, filtros y documentación automática.

🚀 Características
- CRUD de productos y categorías
- Movimientos de stock (entradas y salidas) con validación de inventario
- Búsqueda y paginación
- Swagger UI para documentación
- Tests unitarios y end-to-end con Jest y Supertest
- Configuración mediante variables de entorno
- Listo para correr en Docker

🛠 Tecnologías utilizadas
- NestJS
- PostgreSQL
- TypeORM
- Docker & Docker Compose
- Swagger
- Jest & Supertest

⚙️ Instalación y uso

1️⃣ Clonar el repositorio

git clone https://github.com/TU-USUARIO/inventory-system.git

cd inventory-system

2️⃣ Configurar variables de entorno

Crea un archivo .env en la raíz del proyecto con el siguiente contenido:

DB_HOST=localhost

DB_PORT=5432

DB_USER=postgres

DB_PASS=postgres

DB_NAME=inventory_db

3️⃣ Levantar la aplicación con Docker

docker compose up -d --build

Esto creará y levantará:
- inventory_api → API NestJS
- inventory_postgres → Base de datos PostgreSQL

📄 Documentación Swagger
Una vez corriendo, accede a:
👉 http://localhost:3000/api

🧪 Tests
Ejecutar tests unitarios:
npm run test

Ejecutar tests end-to-end:
npm run test:e2e

👩‍💻 Autor
Angie Hinojosa
🔗 https://github.com/AngieHinojosa/ 

