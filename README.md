# ECONIRVA Global Industrial SaaS Backend

ECONIRVA is now structured as a **multi-tenant, globally scalable, AI-enabled industrial SaaS platform** for:
- Manufacturing companies
- Wholesale distributors
- Retail chains
- Export businesses
- Multi-country operations

This backend provides the foundation for Phases 29–38.

## Core Architecture Delivered

- **Multi-tenant isolation** using `Tenant` + tenant-scoped relations.
- **Subdomain/header tenant resolution** (`company.econirva.com` or `x-tenant-id`).
- **Subscription plans**: Basic / Pro / Enterprise.
- **Feature-based access control** with tenant feature flags.
- **Usage tracking + billing invoice records**.
- **Globalization base**: i18n locales, multi-currency, tax and region pricing engine.
- **Traceability base** for material origin + digital certification hash.
- **ESG and investor dashboards** data layer.
- **AI forecast endpoint** for demand/reorder/churn foundation.
- **Enterprise security middleware** (JWT + tenant checks + role checks + audit logs).
- **Event-driven foundation** with publish/subscribe abstraction (in-memory now; Kafka/RabbitMQ-ready).

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

## Quick Start

1. Install dependencies
   ```bash
   npm install
   ```
2. Copy env file
   ```bash
   cp server/.env.example .env
   ```
3. Configure PostgreSQL and secrets in `.env`.

## Prisma

Schema path:
- `server/models/prisma/schema.prisma`

Run:
```bash
npm run prisma:generate
npm run prisma:migrate
```

## Run API

```bash
npm run server
```

Health:
- `GET /health`

## Key Endpoints

### Auth
- `POST /auth/signup`
- `POST /auth/login`

### Core ERP
- `GET /products`
- `GET /products/:id`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`

- `POST /orders`
- `GET /orders`
- `GET /orders/:id`
- `PUT /orders/:id/status`

- `GET /customers`
- `GET /customers/:id`

### Platform SaaS
- `GET /platform/plans`
- `POST /platform/tenants`
- `GET /platform/tenant/context`
- `GET /platform/localization/options`
- `POST /platform/tax/estimate`
- `GET /platform/billing/invoices`
- `POST /platform/billing/invoices`
- `POST /platform/traceability/material-batches`
- `POST /platform/traceability/certificates`
- `GET /platform/esg/dashboard`
- `GET /platform/investor/dashboard`
- `POST /platform/ai/forecast`

## Security Enhancements

- Helmet
- CORS
- Rate limiting
- bcrypt hashing (12 rounds)
- JWT expiry (`8h`)
- Tenant-aware token validation
- Audit log structure (SOC2-oriented)
- OIDC/SSO env placeholders for Google/Microsoft

## Deployment Direction (next implementation phases)

- External message broker (Kafka/RabbitMQ)
- Kubernetes manifests + autoscaling
- Multi-region deployment strategy + DR playbooks
- White-label custom domains and theme engine
- Dedicated AI model services and MLOps pipeline
