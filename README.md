<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" /></a>
</p>

<h1 align="center">🚚 Freight & Logistics SCM API</h1>

<p align="center">
  An enterprise-grade Supply Chain Management (SCM) and Freight API built with <strong>NestJS v11</strong> and <strong>Fastify v5</strong>.<br/>
  Designed to streamline complex international shipping operations, manage logistics workflows, and provide an accurate tracking lifecycle with a highly scalable and modular architecture.
</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://github.com/HanyMedhat10/freight-api/blob/main/LICENSE" target="_blank"><img src="https://img.shields.io/badge/license-UNLICENSED-red.svg" alt="License" /></a>
  <a href="https://nodejs.org/" target="_blank"><img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg" alt="Node Version" /></a>
  <a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/typescript-%5E5.7-blue.svg" alt="TypeScript" /></a>
  <a href="https://fastify.dev/" target="_blank"><img src="https://img.shields.io/badge/fastify-%5E5.8-brightgreen.svg" alt="Fastify" /></a>
  <a href="https://www.postgresql.org/" target="_blank"><img src="https://img.shields.io/badge/postgresql-%5E12-336791.svg" alt="PostgreSQL" /></a>
  <a href="https://typeorm.io/" target="_blank"><img src="https://img.shields.io/badge/ORM-TypeORM-fe0902.svg" alt="TypeORM" /></a>
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Architecture](#-architecture)
- [Database Design](#-database-design)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Configuration](#-configuration)
- [Running the Project](#-running-the-project)
- [Available Scripts](#-available-scripts)
- [API Documentation](#-api-documentation)
- [Error Handling](#-error-handling)
- [Rate Limiting](#-rate-limiting)
- [Docker Support](#-docker-support)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [Contact](#-contact)
- [License](#-license)

---

## 📖 Overview

**Freight & SCM API** is a high-performance backend system purpose-built to solve real-world logistics challenges. Moving beyond simple CRUD operations, it encapsulates complex business rules required for global trade, including dimensional weight calculations, advanced contract management, and granular shipment tracking.

The API leverages the latest NestJS ecosystem mapped to a Fastify adapter, ensuring high throughput, low latency, and developer productivity for supply chain operations.

---

## 🛠 Tech Stack

| Category             | Technology                                         |
| -------------------- | -------------------------------------------------- |
| **Framework**        | [NestJS v11](https://nestjs.com/)                  |
| **HTTP Adapter**     | [Fastify v5](https://fastify.dev/)                 |
| **Language**         | [TypeScript v5.7](https://www.typescriptlang.org/) |
| **Runtime**          | [Node.js 18+](https://nodejs.org/)                 |
| **Database**         | [PostgreSQL v12+](https://www.postgresql.org/)     |
| **ORM**              | [TypeORM](https://typeorm.io/)                     |
| **API Docs**         | [Swagger / OpenAPI](https://swagger.io/)           |
| **Validation**       | `class-validator` + `class-transformer`            |
| **Security**         | Helmet, CSRF Protection, Rate Limiting, CORS       |
| **Containerization** | Docker & Docker Compose                            |
| **Testing**          | Jest + Supertest                                   |
| **Package Manager**  | [pnpm](https://pnpm.io/)                           |

---

## ✨ Features

### 🏢 Domain & Business Logic

- **Automated CBM Calculation** — Dynamic calculation of Cubic Meters (CBM) based on shipment dimensions.
- **Advanced Contract Management** — Handle complex agreements including Ro-Ro contracts and Charter Party terms.
- **Supply Chain Workflows** — Support for processing Letters of Credit (LC) and tracking international import/export lifecycles.
- **End-to-End Tracking** — Granular, immutable logs to monitor shipment statuses through their complete lifecycle:
  `Pending` → `In Transit` → `Customs Clearance` → `Delivered`

### 💻 Technical Excellence

- **Robust RBAC** — Multi-tier authorization using custom Guards and Decorators to separate Admins, Clients, and Forwarders.
- **Fastify Performance** — Optimized payloads via `@fastify/compress` and high-speed routing.
- **Data Integrity** — ACID-compliant transactions using TypeORM to ensure consistency across shipments and contracts.
- **Production-Ready Security** — JWT-based authentication, URI versioning, Helmet headers, CSRF protection, and multi-tier rate limiting.
- **Global Exception Handling** — Unified error response format with custom domain exceptions (Validation, ResourceNotFound, DuplicateResource, BusinessRule, ExternalService).
- **API Versioning** — URI-based versioning (`/v1/...`) for backward-compatible evolution.

---

## 🏗 Architecture

### Project Structure

```
freight-api/
├── src/
│   ├── main.ts                          # Application bootstrap & middleware setup
│   ├── app.module.ts                    # Root module (DB, throttling, config)
│   ├── app.controller.ts                # Root health-check controller
│   ├── app.service.ts                   # Root service
│   └── core/
│       └── exceptions Filters/
│           └── all-exceptions.filter.ts # Global catch-all exception filter
├── test/
│   ├── app.e2e-spec.ts                  # End-to-end test suite
│   └── jest-e2e.json                    # E2E Jest configuration
├── docker/
│   ├── docker-compose.yml               # PostgreSQL + networking setup
│   ├── .env                             # Docker-specific env vars
│   └── .env.example                     # Docker env template
├── dist/                                # Compiled production output
├── package.json                         # Dependencies & scripts
├── tsconfig.json                        # TypeScript configuration (ES2023)
├── tsconfig.build.json                  # Build-specific TS config
├── nest-cli.json                        # NestJS CLI configuration
├── eslint.config.mjs                    # ESLint flat config
├── .prettierrc                          # Prettier formatting rules
└── Freight & SCM API.drawio             # Architecture / ER diagram source
```

### Key Architectural Decisions

| Decision                   | Rationale                                                               |
| -------------------------- | ----------------------------------------------------------------------- |
| Fastify over Express       | ~2x throughput for JSON-heavy APIs; native schema validation support    |
| URI Versioning             | Clean separation of API versions (`/v1/`, `/v2/`) in the URL            |
| Global Exception Filter    | Consistent error shape across all endpoints, including unhandled errors |
| Multi-tier Throttling      | Separate rate limits for burst, sustained, and long-term abuse          |
| TypeORM `autoLoadEntities` | Automatic entity discovery — no manual registration needed              |

---

## 🗄️ Database Design

The system relies on a relational database model optimized for logistics operations.

> **![ER Diagram](./docs/er-diagram.png)**

_(If the diagram above doesn't render, see the [Draw.io source file](./Freight%20%26%20SCM%20API.drawio) for the full architecture diagram.)_

### Key Entities

| Entity          | Description                                                                  |
| --------------- | ---------------------------------------------------------------------------- |
| **User**        | Manages roles (Admin, Client, Forwarder) and JWT-based authentication        |
| **Contract**    | Handles freight terms, associated costs, validities, and Ro-Ro agreements    |
| **Shipment**    | Stores origin, destination, dimensions, weight, and calculated CBM           |
| **TrackingLog** | A cascade-linked, immutable entity for state changes in the shipment journey |

---

## ✅ Prerequisites

Ensure you have the following installed before proceeding:

| Requirement             | Version | Installation                                           |
| ----------------------- | ------- | ------------------------------------------------------ |
| **Node.js**             | v18+    | [nodejs.org](https://nodejs.org/)                      |
| **pnpm**                | v8+     | `npm install -g pnpm`                                  |
| **PostgreSQL**          | v12+    | [postgresql.org](https://www.postgresql.org/download/) |
| **Docker** _(optional)_ | Latest  | [docker.com](https://www.docker.com/get-started/)      |
| **Git**                 | Latest  | [git-scm.com](https://git-scm.com/)                    |

---

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/HanyMedhat10/freight-api.git
cd freight-api
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit the `.env` file with your actual credentials (see [Configuration](#-configuration) below).

### 4. Create the Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE freight_db;

# Exit
\q
```

> **Note:** On first run with `synchronize: true`, TypeORM will automatically generate the schema from your entity definitions.

---

## ⚙ Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

| Variable     | Description                | Default      | Required |
| ------------ | -------------------------- | ------------ | -------- |
| `PGHOST`     | PostgreSQL host            | `localhost`  | ✅       |
| `PGPORT`     | PostgreSQL port            | `5432`       | ✅       |
| `PGUSER`     | PostgreSQL username        | `postgres`   | ✅       |
| `PGPASSWORD` | PostgreSQL password        | —            | ✅       |
| `PGDATABASE` | Database name              | `freight_db` | ✅       |
| `PORT`       | Application port           | `3000`       | ❌       |
| `JWT_SECRET` | Secret key for JWT signing | —            | ✅       |

### Example `.env`

```env
## Database Configuration
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=pass123
PGDATABASE=freight_db
PORT=3000

## JWT Configuration
JWT_SECRET=MySuperSecretKey123!
```

> ⚠️ **Security Warning:** Never commit `.env` files or real secrets to version control. The `.env` file is already included in `.gitignore`.

---

## 🚀 Running the Project

### Development

| Environment           | Command                         | Description                          |
| --------------------- | ------------------------------- | ------------------------------------ |
| **Development** (HMR) | `pnpm start:dev`                | Starts with hot-reload via `--watch` |
| **Debug Mode**        | `pnpm start:debug`              | Starts with Node.js inspector        |
| **Production**        | `pnpm build && pnpm start:prod` | Compiles TS then runs `dist/main`    |

The API will be available at: **<http://localhost:3000>**

---

## 📜 Available Scripts

| Command            | Description                             |
| ------------------ | --------------------------------------- |
| `pnpm start`       | Run the application                     |
| `pnpm start:dev`   | Run in development mode with hot reload |
| `pnpm start:debug` | Run in debug mode with inspector        |
| `pnpm start:prod`  | Run the compiled production build       |
| `pnpm build`       | Build the project for production        |
| `pnpm lint`        | Run ESLint and auto-fix issues          |
| `pnpm format`      | Format code with Prettier               |
| `pnpm test`        | Run unit tests                          |
| `pnpm test:watch`  | Run tests in watch mode                 |
| `pnpm test:cov`    | Run tests with coverage report          |
| `pnpm test:debug`  | Debug tests with `--inspect-brk`        |
| `pnpm test:e2e`    | Run end-to-end tests                    |

---

## 📖 API Documentation

Once the project is running, access the interactive API documentation:

| Resource        | URL                                |
| --------------- | ---------------------------------- |
| **Swagger UI**  | <http://localhost:3000/docs>         |
| **JSON Schema** | <http://localhost:3000/swagger/json> |

### Authentication

The API uses **Bearer Token (JWT)** authentication. Include the token in your request headers:

```
Authorization: Bearer <your-jwt-token>
```

### Versioning

All endpoints use URI-based versioning:

```
GET /v1/shipments
POST /v1/contracts
```

---

## 🚨 Error Handling

The API uses a global exception filter that returns a consistent error response format across all endpoints:

### Error Response Schema

```json
{
  "success": false,
  "statusCode": 404,
  "error": "Resource Not Found",
  "message": "Shipment with id \"abc-123\" not found",
  "path": "/v1/shipments/abc-123",
  "method": "GET",
  "timestamp": "2026-05-25T00:00:00.000Z",
  "requestId": "req-uuid-here"
}
```

### Custom Domain Exceptions

| Exception                    | HTTP Status | Use Case                           |
| ---------------------------- | ----------- | ---------------------------------- |
| `ValidationException`        | 400         | Input validation failures          |
| `ResourceNotFoundException`  | 404         | Entity not found by ID             |
| `DuplicateResourceException` | 409         | Unique constraint violations       |
| `BusinessRuleException`      | 422         | Domain/business rule violations    |
| `ExternalServiceException`   | 503         | Third-party service unavailability |

---

## 🛡 Rate Limiting

The API implements a multi-tier rate limiting strategy using `@nestjs/throttler`:

| Tier       | Window     | Max Requests | Purpose                               |
| ---------- | ---------- | ------------ | ------------------------------------- |
| **Short**  | 60 seconds | 10           | Burst protection per endpoint         |
| **Medium** | 5 minutes  | 50           | Sustained usage for general endpoints |
| **Large**  | 1 hour     | 500          | Long-term abuse prevention            |

When a rate limit is exceeded, the API responds with `429 Too Many Requests`.

---

## 🐳 Docker Support

The project includes a Docker Compose setup for running PostgreSQL in a containerized environment.

### Quick Start

```bash
# Start all services in detached mode
docker-compose -f docker/docker-compose.yml up -d

# View logs
docker-compose -f docker/docker-compose.yml logs -f

# Teardown
docker-compose -f docker/docker-compose.yml down
```

### Docker Services

| Service | Image                | Port | Description                       |
| ------- | -------------------- | ---- | --------------------------------- |
| **db**  | `postgres:16-alpine` | 5432 | PostgreSQL with persistent volume |

### Docker Environment Variables

Create a `docker/.env` file or set the following variables:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=freight_db
```

> The PostgreSQL service includes a health check that verifies the database is ready to accept connections before marking the container as healthy.

---

## 🧪 Testing

The project uses **Jest** as the testing framework with **Supertest** for HTTP assertions.

| Test Type      | Command           | Description                         |
| -------------- | ----------------- | ----------------------------------- |
| **Unit Tests** | `pnpm test`       | Run all unit tests                  |
| **Watch Mode** | `pnpm test:watch` | Re-run tests on file changes        |
| **Coverage**   | `pnpm test:cov`   | Generate coverage report            |
| **Debug**      | `pnpm test:debug` | Run with Node.js inspector attached |
| **E2E Tests**  | `pnpm test:e2e`   | Run end-to-end integration tests    |

### Test Configuration

- Unit tests: configured in `package.json` under the `jest` key
- E2E tests: configured in `test/jest-e2e.json`
- Coverage output: `./coverage/`

---

## 🌐 Deployment

### Production Checklist

> ⚠️ **Critical:** Follow these steps before deploying to production.

- [ ] Set `synchronize: false` in TypeORM configuration — use migrations instead
- [ ] Set `NODE_ENV=production`
- [ ] Use a strong, unique `JWT_SECRET`
- [ ] Configure a reverse proxy (e.g., **Nginx**, **Traefik**, or **Caddy**)
- [ ] Enable HTTPS / TLS termination at the proxy level
- [ ] Run via Docker container or a process manager like **PM2**
- [ ] Ensure PostgreSQL connection pooling is configured for production load
- [ ] Review and tighten CORS origins for your domain

### Build & Run

```bash
# Compile TypeScript
pnpm build

# Start production server
pnpm start:prod
```

---

## 🔧 Troubleshooting

<details>
<summary><strong>pnpm: command not found</strong></summary>

Install pnpm globally:

```bash
npm install -g pnpm
```

</details>

<details>
<summary><strong>Database connection error</strong></summary>

1. Verify PostgreSQL is running:

   ```bash
   # Windows (PowerShell)
   Get-Service postgresql*

   # Linux
   sudo systemctl status postgresql
   ```

2. Check your `.env` credentials match your PostgreSQL setup.
3. Ensure the `freight_db` database exists.

</details>

<details>
<summary><strong>Port 3000 already in use</strong></summary>

Either stop the process using port 3000, or change the `PORT` in your `.env` file:

```bash
# Find the process (Windows)
netstat -ano | findstr :3000

# Find the process (Linux/macOS)
lsof -i :3000
```

</details>

<details>
<summary><strong>Module not found errors</strong></summary>

Reinstall dependencies with a clean slate:

```bash
rm -rf node_modules
pnpm install
```

</details>

<details>
<summary><strong>TypeORM entity not loading</strong></summary>

Ensure `autoLoadEntities: true` is set in the TypeORM configuration (it is by default in this project). All entities must be registered through their respective module's `TypeOrmModule.forFeature([...])` call.

</details>

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch:

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit** your changes:

   ```bash
   git commit -m 'feat: add amazing feature'
   ```

4. **Push** to the branch:

   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open** a Pull Request

### Code Style

This project uses **ESLint** and **Prettier** for consistent code formatting. Run before committing:

```bash
pnpm lint
pnpm format
```

---

## 📬 Contact

Developed and maintained by **Hany Medhat Gamal Mehany**

| Channel   | Link                                             |
| --------- | ------------------------------------------------ |
| 📧 Email  | <Hany.medhat24@gmail.com>                        |
| 🐙 GitHub | [@HanyMedhat10](https://github.com/HanyMedhat10) |

For issues, technical discussions, or feature requests, please [open an issue](https://github.com/HanyMedhat10/freight-api/issues) on the repository.

---

## 📄 License

This project is **UNLICENSED** — All Rights Reserved.

---

<p align="center">
  <sub>Built with ❤️ using <a href="https://nestjs.com/">NestJS</a> • Last Updated: May 2026</sub>
</p>
