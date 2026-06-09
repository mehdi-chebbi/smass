# SMAS Backend API

Backend Express.js avec PostgreSQL pour le projet SMAS (Système Aquifère Sénégalo-Mauritanien).

## Configuration requise

- Node.js 18+ ou Bun
- PostgreSQL 14+

## Installation

```bash
# Installer les dépendances
bun install

# Générer le client Prisma
bun run db:generate

# Pousser le schéma vers la base de données
bun run db:push

# (Optionnel) Seeder la base de données
bun run db:seed
```

## Configuration

Créer un fichier `.env` à la racine:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:pk617181@localhost:5432/smas?schema=public"

# JWT Configuration
JWT_SECRET="smas-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:3000"

# Admin Configuration
ADMIN_EMAIL="admin@smas.oss"
ADMIN_PASSWORD="admin123"
```

## Démarrage

```bash
# Mode développement (avec hot reload)
bun run dev

# Mode production
bun run start
```

## API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `GET /api/auth/me` - Utilisateur actuel
- `POST /api/auth/change-password` - Changer le mot de passe

### Contenu CMS
- `GET /api/contents` - Liste des contenus
- `GET /api/contents/:slug` - Contenu par slug
- `POST /api/contents` - Créer un contenu
- `PUT /api/contents/:id` - Modifier un contenu
- `DELETE /api/contents/:id` - Supprimer un contenu

### Carte Interactive
- `GET /api/map/layers` - Liste des couches
- `GET /api/map/layers/:id` - Couche par ID
- `POST /api/map/layers` - Créer une couche
- `PUT /api/map/layers/:id` - Modifier une couche
- `DELETE /api/map/layers/:id` - Supprimer une couche

- `GET /api/map/points` - Liste des points
- `GET /api/map/points/:id` - Point par ID
- `POST /api/map/points` - Créer un point
- `PUT /api/map/points/:id` - Modifier un point
- `DELETE /api/map/points/:id` - Supprimer un point

### Autres
- `GET /api/news` - Actualités
- `GET /api/statistics` - Statistiques
- `GET /api/partners` - Partenaires
- `GET /api/tenders` - Appels d'offres
- `GET /api/health` - Health check

## Structure du projet

```
backend/
├── controllers/
│   ├── authController.ts
│   ├── contentController.ts
│   ├── mapLayerController.ts
│   ├── mapPointController.ts
│   └── ...
├── routes/
│   ├── auth.ts
│   ├── contents.ts
│   ├── mapLayers.ts
│   ├── mapPoints.ts
│   └── ...
├── middleware/
│   └── auth.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── utils/
│   └── db.ts
├── index.ts
├── package.json
└── .env
```

## Modèles de données

### MapLayer
- Couches vectorielles (GeoJSON)
- Support des shapefiles
- Propriétés de style (couleur, opacité)

### MapPoint
- Points d'intérêt
- Coordonnées lat/lng
- Popups personnalisables

## Utilisateur admin par défaut

- **Email**: admin@smas.oss
- **Password**: admin123
