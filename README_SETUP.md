# 📦 Freight & Logistics SCM API

A robust Supply Chain Management (SCM) and Freight API built with NestJS and TypeScript. This backend system is designed to streamline international shipping operations and logistics. It provides a scalable architecture for managing shipments, handling complex freight contracts (e.g., Ro-Ro agreements), and maintaining an accurate tracking lifecycle

---

## Table of Contents

- [Project Description](#project-description)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Available Scripts](#available-scripts)
- [API Documentation](#api-documentation)
- [Contact](#contact)

---

## Project Description

**Freight & SCM API** is a high-performance REST API built with:

- **Framework**: NestJS (v11)
- **HTTP Adapter**: Fastify (v5)
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CSRF Protection
- **Validation**: class-validator, class-transformer

This project provides endpoints for managing freight operations and supply chain logistics.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher ([Download](https://nodejs.org/))
- **pnpm**: v8 or higher (preferred package manager)

  ```bash
  npm install -g pnpm
  ```

- **PostgreSQL**: v12 or higher ([Download](https://www.postgresql.org/download/))
- **Git**: For cloning the repository

---

## Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
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

Or using **yarn**:

```bash
yarn install
```

---

## Configuration

### Step 1: Create Environment Variables

Create a `.env` file in the project root directory:

```bash
cp .env.example .env
```

If `.env.example` doesn't exist, create a `.env` file with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=freight_db

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration (if needed)
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=24h

# API Configuration
API_VERSION=v1
```

### Step 2: Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE freight_db;

# Exit psql
\q
```

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

---

## Available Scripts

| Command            | Description                             |
| ------------------ | --------------------------------------- |
| `pnpm start`       | Run the application                     |
| `pnpm start:dev`   | Run in development mode with hot reload |
| `pnpm start:debug` | Run in debug mode                       |
| `pnpm start:prod`  | Run production build                    |
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
http://localhost:3000/api/docs
```

The API is versioned using URI versioning. Example endpoint:

```
http://localhost:3000/v1/freight/orders
```

### Available Features

- ✅ Bearer Token Authentication
- ✅ Request Validation (DTO-based)
- ✅ Error Handling with Global Exception Filters
- ✅ Compression Support
- ✅ CSRF Protection
- ✅ Security Headers (Helmet)
- ✅ Rate Limiting (Throttling)

---

## Project Structure

```
freight-api/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── app.module.ts           # Root module
│   ├── app.controller.ts       # Root controller
│   ├── app.service.ts          # Root service
│   └── core/
│       └── exceptions Filters/ # Global exception handling
├── test/                       # E2E tests
├── docker/                     # Docker configuration
├── package.json
├── tsconfig.json
├── nest-cli.json
└── README.md
```

---

## Docker Support

The project includes Docker configuration. To run with Docker:

```bash
# Build and run with Docker Compose
docker-compose -f docker/docker-compose.yml up

# Stop services
docker-compose -f docker/docker-compose.yml down
```

---

## Troubleshooting

### Issue: `pnpm: command not found`

**Solution**: Install pnpm globally

```bash
npm install -g pnpm
```

### Issue: Database connection error

**Solution**: Verify PostgreSQL is running and credentials in `.env` are correct

```bash
# Check PostgreSQL status (Windows)
Get-Service postgresql*

# Or on Linux
sudo systemctl status postgresql
```

### Issue: Port 3000 already in use

**Solution**: Either stop the process using port 3000 or change the PORT in `.env`

### Issue: Module not found errors

**Solution**: Reinstall dependencies

```bash
pnpm install --force
```

---

## Contact

**Project Maintainer**: [Your Name]

For questions, bug reports, or feature requests, please contact:

📧 **Email**: [your.email@example.com](mailto:your.email@example.com)

📱 **Phone**: [+1 (XXX) XXX-XXXX]

💼 **LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/yourprofile)

🐙 **GitHub**: [Your GitHub Profile](https://github.com/yourprofile)

---

## License

This project is **UNLICENSED**.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

---

**Last Updated**: May 2026
