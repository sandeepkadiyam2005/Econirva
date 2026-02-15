# ECONIRVA Global Industrial SaaS Platform

This project now includes two connected surfaces:

1. **Premium Public Website (B2B Lead + Bulk Orders)**
2. **Private Internal Admin System (Operations + Finance + Production)**

## 1) Premium Company Website (Public Facing)

Implemented in `src/pages/Home.jsx` with:
- Premium hero + brand credibility messaging
- Smart price estimator
- Custom color preview tool
- Order intake form with artwork file selection
- WhatsApp sales integration CTA

## 2) Internal Admin System (Private)

Implemented in `src/pages/Admin.jsx` with module-first UI:
- **Orders**: tracking, logo preview, status action, delivered/not-delivered filter
- **Production**: raw material + stage + batch tracking overview
- **Inventory**: stock tracking + low-stock concept + deduction workflow notes
- **Finance**: revenue and invoice workflow overview

## 3) Role System

Role-based module visibility is implemented for:
- `SUPER_ADMIN`
- `SALES`
- `PRODUCTION`
- `FINANCE`
- `ORDER_HANDLER`

Backend role aliases are enforced in middleware and mapped to tenant roles when needed.

## Backend Architecture (Structured)

```text
server/
 ├── config/
 ├── controllers/
 ├── middleware/
 ├── models/prisma/
 ├── routes/
 ├── services/
 ├── utils/
 └── index.js
```

- PostgreSQL + Prisma
- JWT auth
- Tenant-aware architecture
- Service/controller/route separation

## New Internal APIs

All under `/internal` (tenant + auth protected):
- `GET /internal/orders?delivered=all|delivered|pending`
- `GET /internal/production`
- `GET /internal/inventory`
- `GET /internal/finance`

## Docker Deployment

Use:
```bash
docker compose up --build
```

Includes:
- API container
- PostgreSQL container

## Cloud + Secure Storage

File uploads are abstracted in `server/services/storageService.js`:
- `STORAGE_PROVIDER=local` or `s3`
- S3-compatible secure object storage support
- Tenant-segmented keys
- Server-side encryption support

## Environment

Use `server/.env`:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/econirva
PORT=5001
JWT_SECRET=change-this-in-production
STORAGE_PROVIDER=local
```

## Run

```bash
npm install
npm run server
npm run dev
```
