# econirva

## Econirva Web + Admin API

Frontend runs with Vite (React).

## Frontend
- `npm run dev`
- Open `/` for website
- Open `/admin` for admin panel

## Backend API
Run:
- `npm run server`

Base URL: `http://localhost:5001`

### Default Accounts
- Admin: `admin@econirva.com` / `admin123`
- Sales: `sales@econirva.com` / `sales123`
- Viewer: `viewer@econirva.com` / `viewer123`
- Financer: `financer@econirva.com` / `financer123`
- User: `user@econirva.com` / `user123`

## How to access Admin Dashboard
1. Start backend API: `npm run server`.
2. Start frontend: `npm run dev`.
3. Open `http://localhost:5173/admin`.
4. Login with a **company account**:
   - `admin@econirva.com` / `admin123`
   - `sales@econirva.com` / `sales123`
   - `viewer@econirva.com` / `viewer123`

### Important
- Customer (`user` role) can login for customer flows, but **cannot** open admin dashboard.
- Admin APIs are role-protected and return `403 Forbidden` for non-company roles.


## New workflow features added
- Password change endpoint for all logged-in users: `POST /api/auth/change-password`.
- Admin password reset for team accounts: `POST /api/admin/users/:id/reset-password` (admin only).
- Web notifications feed for new orders, payment updates, sales concerns, and finance issues.
- Delivery OTP workflow:
  - Generate OTP: `POST /api/admin/orders/:id/start-delivery`
  - Confirm delivered with OTP: `POST /api/orders/:id/confirm-delivery-otp`
- Finance page APIs (admin/financer only):
  - `GET/POST /api/finance/records`
  - `GET/POST /api/admin/payment-options`
- Team concern reporting:
  - Sales concern: `GET/POST /api/admin/sales-concerns`
  - Finance issue: `GET/POST /api/admin/finance-issues`

## Features implemented for real workflow
- JWT session auth (HS256 token) with secure password hashing (PBKDF2).
- Role-based access (`admin`, `sales`, `viewer`, `user`).
- `/admin` panel for admin/sales/viewer login.
- Product Management CRUD with fields:
  - title/name, category, material, MOQ, lead time, price, image URL,
  - customization options,
  - status/availability,
  - stock qty,
  - dynamic pricing tiers.
- Availability statuses:
  - `in_stock`
  - `made_to_order`
  - `temp_unavailable`
- Cloud media URL pipeline:
  - save S3/Cloudinary URL to DB and optionally bind to product image.
- Order + Quote inbox in DB with admin dashboard visibility.
- Customer order payment modes: `cod` (cash on delivery) and `advance` (partial advance + balance due).
- Order lifecycle: `new -> approved -> production -> shipped -> delivered`.
- CSV export for inbox records.
- Public website automatically reflects product availability via API.

## Main Endpoints
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/products`

### Admin/Auth
- `GET /api/admin/me`
- `GET /api/admin/stats` (admin/sales/viewer, includes payment board stats)
- `POST /api/admin/users` (admin only, create admin/sales/viewer)

### Products
- `GET /api/admin/products` (admin/sales/viewer)
- `POST /api/admin/products` (admin/sales)
- `PUT /api/admin/products/:id` (admin/sales)
- `DELETE /api/admin/products/:id` (admin)
- `PATCH /api/admin/products/:id/availability` (admin/sales)

### Media Upload/Cloud links
- `POST /api/admin/media/cloud-link` (admin/sales)
  - payload: `{ cloudUrl, productId?, type? }`

### Orders/Quotes
- `POST /api/orders`
  - accepts: `paymentMethod` (`cod`/`advance`), `advancePercent`, `orderValue`, `advanceAmount`
- `POST /api/quotes`
- `GET /api/orders/my`
- `GET /api/admin/inbox` (admin/sales/viewer)
- `PATCH /api/admin/inbox/order/:id` (admin/sales)
- `PATCH /api/admin/inbox/quote/:id` (admin/sales)
- `GET /api/admin/inbox/export.csv` (admin/sales/viewer)

## What more you can add next
- Daily/weekly sales chart widgets by product category.
- Purchase-order approval queue before production start.
- Notification center (email/WhatsApp) for status transitions.
- Bulk import/export for products via CSV.
- Audit log for every admin change (who changed what/when).

## Rename repository from `my-1st-project` to `econirva`
1. In GitHub, open the repository and go to **Settings → General**.
2. Under **Repository name**, change `my-1st-project` to `econirva` and save.
3. Update your local git remote URL:

```bash
git remote -v
git remote set-url origin https://github.com/<your-username>/econirva.git
git remote -v
```

4. If Vercel/Netlify/GitHub Actions are connected, re-check the project/repo link.
