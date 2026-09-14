# 📦 Freight & Logistics SCM API — Setup Guide

A robust Supply Chain Management (SCM) and Freight API built with **NestJS v11** and **Fastify v5**. This backend system is designed to streamline international shipping operations and logistics. It provides a scalable architecture for managing shipments, handling complex freight contracts (e.g., Ro-Ro agreements), and maintaining an accurate tracking lifecycle.

> 📘 For the full project documentation (features, architecture, database design, deployment, and troubleshooting), see the main [README.md](./README.md).

---

## Table of Contents

- [Project Description](#project-description)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Project](#running-the-project)
- [Available Scripts](#available-scripts)
- [API Documentation](#api-documentation)
- [Docker Support](#docker-support)
- [Contact](#contact)
- [License](#license)

---

## Project Description

**Freight & SCM API** is a high-performance REST API built with:

- **Framework**: NestJS (v11)
- **HTTP Adapter**: Fastify (v5)
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Documentation**: Swagger/OpenAPI
- **Authentication**: JWT (Passport) with RBAC roles (`Admin`, `Client`, `Forwarder`)
- **Security**: Helmet, CSRF Protection, Rate Limiting, CORS
- **Validation**: class-validator, class-transformer

This project provides endpoints for managing freight operations and supply chain logistics:

| Module        | Base Route      | Description                                                        |
| ------------- | --------------- | ------------------------------------------------------------------ |
| **Auth**      | `/v1/auth`      | Login, profiles, password management, user CRUD (Admin)            |
| **Contract**  | `/v1/contract`  | Freight contract management incl. Ro-Ro / Charter Party agreements |
| **Shipments** | `/v1/shipments` | Shipment CRUD, CBM calculation, status tracking with audit logs    |

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher ([Download](https://nodejs.org/))
- **pnpm**: v8 or higher (preferred package manager)

  ```bash
  npm install -g pnpm
  ```

- **PostgreSQL**: v12 or higher ([Download](https://www.postgresql.org/download/))
- **Docker** (optional): For containerized PostgreSQL ([Download](https://www.docker.com/get-started/))
- **Git**: For cloning the repository

---

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/HanyMedhat10/freight-api.git
cd freight-api
```

### Step 2: Install Dependencies

Using **pnpm** (recommended):

```bash
pnpm install
```

Or using **npm**:

```bash
npm install
```

---

## Configuration

### Step 1: Create Environment Variables

Create a `.env` file in the project root directory:

```bash
cp .env.example .env
```

Then edit `.env` with your actual credentials:

```env
# Database Configuration
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=freight_db

# Server Configuration
PORT=3000

# JWT Configuration
JWT_SECRET=your_jwt_secret

# Admin Seed Credentials (used to seed the first Admin user on startup)
APP_NAME=Freight Management System
ADMIN_USERNAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password

# Node Environment
NODE_ENV=development

# CORS Configuration (comma-separated allowed origins; required in production)
CORS_ORIGIN=http://localhost:5173,http://localhost:4173
```

> ⚠️ **Security Warning:** Never commit `.env` files or real secrets to version control. The `.env` file is already included in `.gitignore`.

---

## Database Setup

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE freight_db;

# Exit psql
\q
```

> **Note:** On first run (when `NODE_ENV` is not `production`), TypeORM automatically generates the schema from the entity definitions (`synchronize: true`). An Admin user is seeded on application bootstrap from the `ADMIN_EMAIL` / `ADMIN_PASSWORD` environment variables if it does not already exist.

---

## Running the Project

### Development Mode (with hot reload)

```bash
pnpm start:dev
```

The API will be available at: **<http://localhost:3000>**

### Debug Mode (with debugging tools)

```bash
pnpm start:debug
```

### Production Mode

#### Step 1: Build the project

```bash
pnpm build
```

#### Step 2: Start the production server

```bash
pnpm start:prod
```

> ⚠️ **Before production:** set `NODE_ENV=production`, provide a strong unique `JWT_SECRET`, configure `CORS_ORIGIN` with your frontend domains, and switch to TypeORM migrations (`synchronize` is auto-disabled in production).

---

## Available Scripts

## Available Scripts

| Command            | Description                             |
| ------------------ | --------------------------------------- |
| `pnpm start`       | Run the application                     |
| `pnpm start:dev`   | Run in development mode with hot reload |
| `pnpm start:debug` | Run in debug mode with inspector        |
| `pnpm start:prod`  | Run the compiled production build       |
| `pnpm build`       | Build the project for production        |
| `pnpm lint`        | Run ESLint and fix issues               |
| `pnpm format`      | Format code with Prettier               |
| `pnpm test`        | Run unit tests                          |
| `pnpm test:watch`  | Run tests in watch mode                 |
| `pnpm test:cov`    | Run tests with coverage report          |
| `pnpm test:debug`  | Debug tests                             |
| `pnpm test:e2e`    | Run end-to-end tests                    |

---

## API Documentation

Once the project is running, access the Swagger documentation at:

```
http://localhost:3000/docs
```

The raw OpenAPI JSON schema is available at:

```
http://localhost:3000/swagger/json
```

The API is versioned using URI versioning. Example endpoint:

```
http://localhost:3000/v1/shipments
```

### Authentication

The API uses **Bearer Token (JWT)** authentication. Include the token in your request headers:

```
Authorization: Bearer <your-jwt-token>
```

### Available Features

- ✅ Bearer Token Authentication (JWT via Passport)
- ✅ Role-Based Access Control (Admin, Client, Forwarder)
- ✅ Request Validation (DTO-based)
- ✅ Error Handling with Global Exception Filters
- ✅ Compression Support
- ✅ Security Headers (Helmet)
- ✅ Rate Limiting (Throttling)

---

## Project Structure

```
freight-api/
├── src/
│   ├── main.ts                          # Application entry point (bootstrap, CORS, Swagger, filters)
│   ├── app.module.ts                    # Root module (database, throttling, config)
│   ├── app.controller.ts                # Root health-check controller
│   ├── app.service.ts                   # Root service
│   ├── auth/                            # Authentication & RBAC module
│   │   ├── dto/                         # Login, Create/Update user, Change password DTOs
│   │   ├── entities/                    # User entity + Role enum
│   │   ├── guards/                      # Role guard & @Roles() decorator
│   │   ├── auth.controller.ts           # Auth & user endpoints
│   │   ├── auth.service.ts              # Auth logic, password hashing, admin seed
│   │   ├── jwt.guard.ts                 # JWT authentication guard
│   │   └── jwt-strategy.service.ts      # Passport JWT strategy
│   ├── contract/                        # Freight contract module
│   │   ├── dto/                         # Contract validation schemas
│   │   ├── entities/                    # Contract entity
│   │   ├── contract.controller.ts       # Contract endpoints
│   │   └── contract.service.ts          # Contract persistence & pagination
│   ├── shipment/                        # Shipment & lifecycle tracking module
│   │   ├── constants/                   # Shipment state machine transitions
│   │   ├── dto/                         # Shipment & status update DTOs
│   │   ├── entities/                    # Shipment + TrackingLog entities, status enum
│   │   ├── shipment.controller.ts       # Shipment endpoints
│   │   └── shipment.service.ts          # CBM calc, state validation, tracking logs
│   └── core/                            # Global system utilities
│       ├── exception-filters/           # Global exception filter, interceptors, response decorator
│       └── utility/                     # Pagination helpers & custom decorators
├── test/                                # E2E tests
├── docker/                              # Docker configuration (PostgreSQL)
├── package.json
├── tsconfig.json
├── nest-cli.json
└── README.md
```

---

## Docker Support

The project includes Docker configuration for PostgreSQL. To run with Docker:

```bash
# Start PostgreSQL in detached mode
docker-compose -f docker/docker-compose.yml up -d

# Stop services
docker-compose -f docker/docker-compose.yml down
```

Configure the container credentials via `docker/.env` (see `docker/.env.example`):

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=freight_db
```

---

## Contact

Developed and maintained by **Hany Medhat Gamal Mehany**

| Channel   | Link                                             |
| --------- | ------------------------------------------------ |
| 📧 Email  | <Hany.medhat24@gmail.com>                        |
| 🐙 GitHub | [@HanyMedhat10](https://github.com/HanyMedhat10) |

For issues, technical discussions, or feature requests, please [open an issue](https://github.com/HanyMedhat10/freight-api/issues) on the repository.

---

## License

This project is **UNLICENSED** — All Rights Reserved.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Run `pnpm lint` and `pnpm format` before committing to keep the codebase consistent.

---

**Last Updated**: September 14, 2026