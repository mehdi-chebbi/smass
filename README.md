# SMAS — Système de Management et d'Administration

## Architecture

```
smas-final/
├── backend/    Express + Prisma + PostgreSQL  (port 3001)
└── frontend/   Next.js                        (port 3000)
```

Toutes les requêtes API passent par le **backend Express** (port 3001).
Le frontend Next.js ne contient **aucune connexion directe à la base de données**.

---

## Démarrage rapide

### 1. Configurer les variables d'environnement

```bash
# Backend
cp backend/.env.example backend/.env
# Éditez backend/.env — mettez à jour DATABASE_URL, JWT_SECRET, ADMIN_PASSWORD

# Frontend
cp frontend/.env.example frontend/.env.local
# Éditez frontend/.env.local — mettez à jour NEXT_PUBLIC_BACKEND_URL si besoin
```

### 2. Installer les dépendances

```bash
cd backend  && npm install   # ou bun install
cd frontend && npm install   # ou bun install
```

### 3. Initialiser / migrer la base de données

Le backend lance automatiquement `prisma db push` au démarrage pour créer/mettre à jour les tables.

Si vous avez une base existante avec l'ancienne version, exécutez manuellement :

```bash
cd backend
npx prisma db push
# ou
npx prisma generate && npx prisma db push
```

Ou exécutez le script SQL de migration :
```bash
psql -U postgres -d smas -f backend/prisma/migrations/add_layer_style_fields.sql
```

### 4. Démarrer les serveurs

```bash
# Terminal 1 — Backend
cd backend && npm run dev   # ou: bun run dev

# Terminal 2 — Frontend
cd frontend && npm run dev  # ou: bun run dev
```

- Frontend : http://localhost:3000
- Backend API : http://localhost:3001
- Admin : http://localhost:3000/admin

---

## Variables d'environnement

### Backend (`backend/.env`)

| Variable | Description | Défaut |
|----------|-------------|--------|
| `DATABASE_URL` | URL PostgreSQL | `postgresql://postgres:...` |
| `PORT` | Port du serveur Express | `3001` |
| `NODE_ENV` | Environnement | `development` |
| `JWT_SECRET` | Secret pour les tokens JWT | *(à changer)* |
| `JWT_EXPIRES_IN` | Durée du token | `7d` |
| `ADMIN_EMAIL` | Email admin initial | `admin@smas.oss` |
| `ADMIN_PASSWORD` | Mot de passe admin initial | `admin123` |
| `FRONTEND_URL` | URL du frontend (CORS) | `http://localhost:3000` |
| `ALLOWED_ORIGINS` | Origines CORS autorisées | `http://localhost:3000` |
| `UPLOAD_DIR` | Dossier des fichiers uploadés | `./uploads` |
| `MAX_UPLOAD_MB` | Taille max d'upload | `50` |

### Frontend (`frontend/.env.local`)

| Variable | Description | Défaut |
|----------|-------------|--------|
| `NEXT_PUBLIC_BACKEND_URL` | URL backend (côté navigateur) | `http://localhost:3001` |
| `NEXT_PUBLIC_BACKEND_PORT` | Port backend | `3001` |
| `BACKEND_URL` | URL backend (côté serveur SSR) | `http://localhost:3001` |
| `JWT_SECRET` | Secret JWT (même que backend) | *(à changer)* |

---

## Routes API (backend Express)

Toutes les routes commencent par `/api/` :

| Route | Description |
|-------|-------------|
| `GET /api/health` | Statut du serveur |
| `POST /api/auth/login` | Connexion |
| `GET /api/contents` | Contenus |
| `GET /api/news` | Actualités |
| `GET /api/publications` | Publications |
| `GET /api/tenders` | Appels d'offres |
| `GET /api/statistics` | Statistiques |
| `GET /api/partners` | Partenaires |
| `GET /api/map/layers` | Couches cartographiques |
| `GET /api/map/points` | Points cartographiques |
| `GET /api/map/download` | Télécharger une couche |
| `GET /api/search` | Recherche full-text |
| `GET /api/settings` | Paramètres |
| `POST /api/upload/image` | Upload image |
| `POST /api/upload/pdf` | Upload PDF |

---

## Nouveau schéma de couche cartographique

Les couches carte supportent maintenant des options de style avancées, configurables depuis le panneau admin :

- **Couleur de remplissage** + opacité indépendante
- **Couleur de bordure** + opacité indépendante  
- **Affichage des étiquettes** : champ source + taille de police
- **Catégorisation** : grouper les entités par valeur d'un champ GeoJSON

