# ECONIRVA Global Industrial SaaS Backend

Production-ready backend foundation for a multi-tenant industrial SaaS platform using:
- **PostgreSQL + Prisma**
- **Structured Express architecture**
- **JWT authentication**
- **Docker deployment**
- **Cloud hosting readiness**
- **Secure file storage (local/S3)**

## Architecture

```text
server/
 ├── config/          # env + db config
 ├── controllers/     # HTTP controllers
 ├── middleware/      # auth, tenant, roles, feature flags, errors
 ├── models/prisma/   # PostgreSQL schema
 ├── routes/          # API route maps
 ├── services/        # business logic
 ├── utils/           # shared utilities
 ├── uploads/         # local file fallback
 └── index.js         # app bootstrap
```

## Core Capabilities

- Multi-tenant context resolution (subdomain/header)
- Tenant-isolated data access patterns
- JWT auth with role + feature authorization
- Product / Order / Customer APIs
- Platform APIs (plans, billing, localization, ESG, AI, traceability)
- Usage tracking + audit logs
- Event-driven hooks for order lifecycle

## PostgreSQL + Prisma

1. Set env (`server/.env`):
   - `DATABASE_URL=postgresql://username:password@localhost:5432/econirva`
2. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```
3. Run migrations:
   ```bash
   npm run prisma:migrate
   ```

## Run Locally

```bash
npm install
npm run server
```

## Docker Deployment

### Start with Docker Compose
```bash
docker compose up --build
```

Services:
- PostgreSQL on `localhost:5432`
- API on `localhost:5001`

### Files
- `Dockerfile`
- `docker-compose.yml`
- `.dockerignore`

## Cloud Hosting Guidance

Recommended deployment:
- **API**: AWS ECS/Fargate, GCP Cloud Run, Azure Container Apps, or Render/Railway
- **Database**: AWS RDS PostgreSQL / Cloud SQL / Azure Database for PostgreSQL
- **File storage**: S3-compatible object storage

Set `STORAGE_PROVIDER=s3` and configure:
- `AWS_REGION`
- `AWS_S3_BUCKET`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- Optional: `AWS_S3_ENDPOINT`, `AWS_S3_PUBLIC_URL`

## Secure File Storage

Upload flow supports:
- **Local secure fallback** (`STORAGE_PROVIDER=local`)
- **S3 secure object storage** (`STORAGE_PROVIDER=s3`)

Security controls:
- MIME/type validation
- 5MB max upload size
- Server-side encryption for S3 (`S3_SERVER_SIDE_ENCRYPTION`, default `AES256`)
- Tenant-segmented object keys (`tenants/{tenantId}/orders/...`)

## Security Stack

- Helmet
- CORS
- Rate limiting
- bcrypt password hashing
- JWT expiry
- Tenant/token mismatch prevention
- Audit logging middleware

## Important Env Files

- `server/.env.example` → template
- `server/.env` → runtime values (already added)
