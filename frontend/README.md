# 🌊 SMAS Project - Système Aquifère Sénégalo-Mauritanien

A modern web application for managing and visualizing the Senegal-Mauritanian Aquifer System (SMAS) project data.

## 🏗️ Architecture

This project uses a decoupled architecture:
- **Frontend**: Next.js 16 with TypeScript, Tailwind CSS, and shadcn/ui
- **Backend**: Express.js with PostgreSQL
- **Database**: PostgreSQL with Prisma ORM

## 📋 Prerequisites

- Node.js 18+ or Bun
- PostgreSQL 14+
- bun (recommended) or npm

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
bun install

# Install backend dependencies
cd mini-services/backend
bun install
cd ../..
```

### 2. Configure Environment Variables

**Backend (.env in mini-services/backend/):**
```env
DATABASE_URL="postgresql://postgres:pk617181@localhost:5432/smas?schema=public"
JWT_SECRET="smas-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
ADMIN_EMAIL="admin@smas.oss"
ADMIN_PASSWORD="admin123"
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Setup Database

```bash
cd mini-services/backend

# Generate Prisma client
bun run db:generate

# Push schema to database
bun run db:push

# Seed initial data (optional)
bun run db:seed

cd ../..
```

### 4. Start Development Servers

**Option A: Start both servers separately**
```bash
# Terminal 1 - Backend
cd mini-services/backend
bun run dev

# Terminal 2 - Frontend
bun run dev
```

**Option B: Use start script**
```bash
./start-dev.sh
# or on Windows
./start-dev.ps1
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/health
- **Admin Panel**: http://localhost:3000/admin/login

## 🔐 Default Credentials

- **Email**: admin@smas.oss
- **Password**: admin123

## 📁 Project Structure

```
├── src/                        # Next.js Frontend
│   ├── app/                    # App Router pages
│   │   ├── admin/             # Admin panel
│   │   ├── map/               # Interactive map
│   │   └── ...
│   ├── components/            # React components
│   ├── lib/
│   │   ├── api/               # API client services
│   │   └── ...
│   └── i18n/                  # Internationalization
│
└── mini-services/
    └── backend/               # Express.js Backend
        ├── controllers/       # API controllers
        ├── routes/            # API routes
        ├── middleware/        # Auth middleware
        ├── prisma/
        │   └── schema.prisma  # Database schema
        └── index.ts           # Server entry point
```

## 🗺️ Features

### Interactive Map
- GeoJSON layer support
- Multiple map layers (Aquifer boundaries, Rivers, Monitoring stations)
- Customizable points with popups
- Layer visibility controls

### Admin Dashboard
- Content management (Pages, News, Reports, Events)
- Map layer management
- Map point management
- User authentication

### Internationalization
- English and French support
- Easy translation management

## 🛠️ Available Scripts

### Frontend
```bash
bun run dev        # Start development server
bun run build      # Build for production
bun run lint       # Run ESLint
```

### Backend
```bash
cd mini-services/backend
bun run dev        # Start development server with hot reload
bun run start      # Start production server
bun run db:generate # Generate Prisma client
bun run db:push    # Push schema changes to database
bun run db:migrate # Create and run migrations
bun run db:studio  # Open Prisma Studio
bun run db:seed    # Seed database with initial data
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password

### Content Management
- `GET /api/contents` - List all contents
- `POST /api/contents` - Create content
- `PUT /api/contents/:id` - Update content
- `DELETE /api/contents/:id` - Delete content

### Map
- `GET /api/map/layers` - List map layers
- `POST /api/map/layers` - Create layer
- `PUT /api/map/layers/:id` - Update layer
- `DELETE /api/map/layers/:id` - Delete layer

- `GET /api/map/points` - List map points
- `POST /api/map/points` - Create point
- `PUT /api/map/points/:id` - Update point
- `DELETE /api/map/points/:id` - Delete point

## 🗄️ Database Models

### Core Models
- **User** - User accounts with roles (ADMIN, EDITOR, VIEWER)
- **Content** - CMS content (Pages, News, Reports, Events)
- **Category** - Content categories
- **Tag** - Content tags

### Map Models
- **MapLayer** - Vector/Raster layers with GeoJSON
- **MapPoint** - Individual map markers

### Other Models
- **NewsItem** - News and events
- **Partner** - Partner organizations
- **Statistic** - Dashboard statistics
- **Tender** - Procurement opportunities

## 🎨 Tech Stack

### Frontend
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Leaflet for maps
- i18next for translations

### Backend
- Express.js
- Prisma ORM
- PostgreSQL
- JWT authentication
- bcryptjs for password hashing

## 📝 License

Built for the SMAS Project - Strengthening the Sustainable Management of the Senegal-Mauritanian Aquifer System.

---

Implemented by OSS (Observatoire du Sahara et du Sahel)
