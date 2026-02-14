# ECONIRVA Bio Solutions - ERP Backend Foundation

Production-ready backend foundation for internal ERP workflows using **Node.js + Express + PostgreSQL + Prisma**.

## Tech Stack
- Node.js + Express
- PostgreSQL with Prisma ORM
- JWT authentication + role-based authorization
- Multer file upload for logos/artwork
- Security middleware: Helmet, CORS, rate limiting

## Project Structure
```text
server/
 ├── config/
 │    └── database.js
 ├── controllers/
 ├── routes/
 ├── models/
 │    └── prisma/
 ├── middleware/
 ├── services/
 ├── utils/
 ├── uploads/
 ├── migrations/
 ├── index.js
 └── .env.example
```

## Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment file:
   ```bash
   cp server/.env.example .env
   ```
3. Update `.env` values for PostgreSQL and secrets.

## Prisma Migrations
Use the schema located at `server/models/prisma/schema.prisma`.

1. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```
2. Create and apply migration:
   ```bash
   npm run prisma:migrate
   ```

## Run Server
```bash
npm run server
```
The API runs by default at `http://localhost:5001`.

## API Testing (Quick Start)
Use Postman/Insomnia or curl:
- `POST /auth/signup`
- `POST /auth/login`
- `GET /products`
- `POST /products` (JWT + role required)
- `POST /orders` (multipart/form-data, optional `logo` file)
- `GET /customers`

## Security Included
- Helmet for secure HTTP headers
- CORS configured using `FRONTEND_URL`
- Global rate limiter
- Password hashing with bcrypt (12 rounds)
- JWT tokens with expiry (`8h`)
