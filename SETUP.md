# SMAS v2.0 — Setup & Architecture Guide

## 🏗️ Architecture

```
smas/
├── backend/          ← Express + Prisma + PostgreSQL (Port 3001)
│   ├── index.ts      ← Main server entry point
│   ├── routes/       ← All API routes
│   │   ├── auth.ts
│   │   ├── contents.ts
│   │   ├── news.ts       ← NEW: Full CRUD for news/events
│   │   ├── tenders.ts    ← NEW: Full CRUD for tenders + PDF
│   │   ├── statistics.ts ← NEW: Full CRUD
│   │   ├── partners.ts   ← NEW: Full CRUD
│   │   ├── settings.ts   ← NEW: Full CRUD (batch update)
│   │   ├── upload.ts     ← NEW: PDF + Image upload
│   │   ├── mapLayers.ts  ← Fixed: now requires auth for mutations
│   │   └── mapPoints.ts  ← Fixed: now requires auth for mutations
│   ├── controllers/
│   ├── middleware/auth.ts
│   ├── utils/db.ts
│   ├── uploads/          ← Uploaded files (gitignored)
│   │   ├── pdfs/
│   │   └── images/
│   └── prisma/schema.prisma
└── frontend/         ← Next.js + Tailwind + shadcn (Port 3000)
    └── src/
        ├── app/admin/page.tsx  ← Complete admin panel (REBUILT)
        └── lib/api/
            ├── config.ts   ← FIXED: unified token key, correct endpoints
            ├── client.ts   ← FIXED: supports FormData for file upload
            └── auth.ts     ← FIXED: uses smas_auth_token key consistently
```

---

## 🚀 Quick Start

### 1. Start PostgreSQL
```bash
# Make sure PostgreSQL is running locally on port 5432
# Database: smas, User: postgres, Password: pk617181
```

### 2. Start Backend
```bash
cd backend
bun install
bunx prisma generate
bunx prisma db push       # Creates/updates tables
bun index.ts              # Starts on port 3001
```

### 3. Start Frontend
```bash
cd frontend
bun install
bun dev                   # Starts on port 3000
```

### 4. Access Admin
- URL: http://localhost:3000/admin/login
- Email: admin@smas.oss
- Password: admin123

---

## 🔧 What Was Fixed

### Backend Fixes
| Issue | Fix |
|-------|-----|
| Missing news CRUD routes | Created `/api/news` with full CRUD + `/api/news/all` for admin |
| Missing tenders CRUD | Created `/api/tenders` with full CRUD |
| Missing statistics CRUD | Created `/api/statistics` with full CRUD |
| Missing partners CRUD | Created `/api/partners` with full CRUD |
| Missing settings CRUD | Created `/api/settings` with batch update |
| No PDF upload | Created `/api/upload/pdf` + `/api/upload/image` with multer |
| Map routes had no auth | Fixed: mutations now require `authenticate + requireEditor` |

### Frontend Fixes
| Issue | Fix |
|-------|-----|
| Token key mismatch (`token` vs `auth_token`) | Unified to `smas_auth_token` across all files |
| Admin panel missing news/tenders/statistics/partners/users | Fully rebuilt admin panel with all sections |
| No PDF upload UI | Added `PdfUploader` component in all relevant forms |
| `apiFetch` used wrong localStorage key | Unified via `TOKEN_KEY` constant in config |
| Next.js admin API routes had wrong Prisma field `author.name` | Converted to backend proxies |
| Admin panel had no toast notifications | Added toast system |
| No delete confirmation | Added confirm dialog |
| Map routes not properly authenticated | Fixed in routes |

---

## 📁 PDF Upload

PDFs are uploaded via multipart form to `/api/upload/pdf`:
- Max size: **50MB**
- Stored at: `backend/uploads/pdfs/`
- Served at: `http://localhost:3001/uploads/pdfs/<filename>`
- Admin UI: PDF uploader appears in Tender forms and Content forms

---

## 🌐 Bilingual Content (EN/FR)

All content models support bilingual fields:
- `title` / `titleFr`
- `content` / `contentFr`
- `excerpt` / `excerptFr`
- `description` / `descriptionFr`

The frontend reads the appropriate language based on the user's locale.
Translation is stored directly in the database.

---

## 🔐 Roles

| Role | Permissions |
|------|-------------|
| ADMIN | Everything: all CRUD, users, settings |
| EDITOR | Content, news, tenders, map |
| VIEWER | Read-only (no admin access) |

---

## 🗺️ API Reference

### Auth
- `POST /api/auth/login` → `{ token, user }`
- `GET /api/auth/me` → current user (requires Bearer token)

### Content
- `GET /api/contents` (protected) — all with filters
- `GET /api/contents/published` (public) — published only
- `POST /api/contents` (editor+) — create
- `PUT /api/contents/:id` (editor+) — update
- `DELETE /api/contents/:id` (editor+) — delete

### News
- `GET /api/news` (public) — published news
- `GET /api/news/all` (editor+) — all including drafts
- `POST /api/news` (editor+) — create
- `PUT /api/news/:id` (editor+) — update
- `DELETE /api/news/:id` (editor+) — delete

### Tenders
- `GET /api/tenders` (public)
- `POST /api/tenders` (editor+)
- `PUT /api/tenders/:id` (editor+)
- `DELETE /api/tenders/:id` (editor+)

### Upload
- `POST /api/upload/pdf` (editor+) — multipart/form-data, field: `file`
- `POST /api/upload/image` (editor+) — multipart/form-data, field: `file`
- `DELETE /api/upload/:type/:filename` (editor+)

### Map
- `GET /api/map/layers` (public)
- `POST /api/map/layers` (editor+)
- `GET /api/map/points` (public)
- `POST /api/map/points` (editor+)
