import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { prisma } from './utils/db';

import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import contentRoutes from './routes/contents';
import categoryRoutes from './routes/categories';
import tagRoutes from './routes/tags';
import mapLayerRoutes from './routes/mapLayers';
import mapPointRoutes from './routes/mapPoints';
import newsRoutes from './routes/news';
import tenderRoutes from './routes/tenders';
import statisticsRoutes from './routes/statistics';
import partnersRoutes from './routes/partners';
import settingsRoutes from './routes/settings';
import uploadRoutes from './routes/upload';
import publicationsRoutes from './routes/publications';
import searchRoutes from './routes/search';
import mapDownloadRoutes from './routes/mapDownload';

dotenv.config();

// ─── Config from env ──────────────────────────────────────────────
const PORT        = parseInt(process.env.PORT        || '3001', 10);
const NODE_ENV    = process.env.NODE_ENV             || 'development';
const FRONTEND_URL = process.env.FRONTEND_URL        || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL          || 'admin@smas.oss';
const ADMIN_PASS  = process.env.ADMIN_PASSWORD       || 'admin123';
const UPLOAD_DIR  = process.env.UPLOAD_DIR           || path.join(process.cwd(), 'uploads');
const MAX_UPLOAD_MB = parseInt(process.env.MAX_UPLOAD_MB || '50', 10);
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || FRONTEND_URL)
  .split(',').map(s => s.trim()).filter(Boolean);

// ─── Auto-migrate database on startup ─────────────────────────────
// Uses raw SQL ALTER TABLE ADD COLUMN IF NOT EXISTS — safe & idempotent.
// Adds any missing columns without touching existing data.
async function runDbMigration() {
  const newColumns = [
    `ALTER TABLE map_layers ADD COLUMN IF NOT EXISTS fill_color VARCHAR(255)`,
    `ALTER TABLE map_layers ADD COLUMN IF NOT EXISTS fill_opacity DOUBLE PRECISION NOT NULL DEFAULT 0.35`,
    `ALTER TABLE map_layers ADD COLUMN IF NOT EXISTS border_color VARCHAR(255)`,
    `ALTER TABLE map_layers ADD COLUMN IF NOT EXISTS border_opacity DOUBLE PRECISION NOT NULL DEFAULT 1.0`,
    `ALTER TABLE map_layers ADD COLUMN IF NOT EXISTS show_labels BOOLEAN NOT NULL DEFAULT FALSE`,
    `ALTER TABLE map_layers ADD COLUMN IF NOT EXISTS label_field VARCHAR(255)`,
    `ALTER TABLE map_layers ADD COLUMN IF NOT EXISTS label_font_size INTEGER NOT NULL DEFAULT 12`,
    `ALTER TABLE map_layers ADD COLUMN IF NOT EXISTS categorize BOOLEAN NOT NULL DEFAULT FALSE`,
    `ALTER TABLE map_layers ADD COLUMN IF NOT EXISTS categorize_field VARCHAR(255)`,
  ];

  let applied = 0;
  for (const sql of newColumns) {
    try {
      await prisma.$executeRawUnsafe(sql);
      applied++;
    } catch (_) {
      // Column already exists — ignore
    }
  }
  if (applied > 0) console.log(`✅ DB migration: ${applied} new column(s) added`);
  else console.log('✅ DB schema already up to date');
}

const app = express();

// ─── Upload dirs ──────────────────────────────────────────────────
['pdfs', 'images', 'videos', 'docs', 'misc'].forEach(sub => {
  const dir = path.join(UPLOAD_DIR, sub);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ─── CORS ─────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || NODE_ENV === 'development') return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) callback(null, true);
    else callback(new Error(`CORS: ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: `${MAX_UPLOAD_MB}mb` }));
app.use(express.urlencoded({ extended: true, limit: `${MAX_UPLOAD_MB}mb` }));
app.use('/uploads', express.static(UPLOAD_DIR));

// ─── All routes under /api/ ────────────────────────────────────────
app.use('/api/auth',         authRoutes);
app.use('/api/users',        userRoutes);
app.use('/api/contents',     contentRoutes);
app.use('/api/categories',   categoryRoutes);
app.use('/api/tags',         tagRoutes);
app.use('/api/map/layers',   mapLayerRoutes);
app.use('/api/map/points',   mapPointRoutes);
app.use('/api/news',         newsRoutes);
app.use('/api/tenders',      tenderRoutes);
app.use('/api/statistics',   statisticsRoutes);
app.use('/api/partners',     partnersRoutes);
app.use('/api/settings',     settingsRoutes);
app.use('/api/upload',       uploadRoutes);
app.use('/api/publications', publicationsRoutes);
app.use('/api/search',       searchRoutes);
app.use('/api/map/download', mapDownloadRoutes);

app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'PostgreSQL ✅',
      version: '2.3.0',
      env: NODE_ENV,
    });
  } catch (e) {
    res.status(500).json({ status: 'ERROR', database: '❌', error: String(e) });
  }
});

// ─── 404 handler ──────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found. All API routes start with /api/' });
});

// ─── Seed data ────────────────────────────────────────────────────
async function seedData() {
  // Admin user
  try {
    const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
    if (!existing) {
      await prisma.user.create({
        data: {
          email: ADMIN_EMAIL,
          username: 'admin-smas',
          password: await bcrypt.hash(ADMIN_PASS, 10),
          firstName: 'Admin',
          lastName: 'SMAS',
          country: 'SENEGAL',
          role: 'ADMIN',
          isActive: true,
        },
      });
      console.log(`✅ Admin created: ${ADMIN_EMAIL}`);
    }
  } catch (e) {
    console.error('Admin seed error:', e);
  }

  // Default map data (only if empty)
  try {
    if (await prisma.mapLayer.count() === 0) {
      const layer = await prisma.mapLayer.create({
        data: {
          name: 'Aquifer Boundary',
          nameFr: "Limite de l'Aquifère SMAS",
          slug: 'aquifer-boundary',
          layerType: 'POLYGON',
          color: '#1e40af',
          fillColor: '#3b82f6',
          fillOpacity: 0.25,
          borderColor: '#1e40af',
          borderOpacity: 1.0,
          opacity: 0.85,
          weight: 2,
          showLabels: false,
          geoData: JSON.stringify({
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: { name: 'SMAS' },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [-17.5, 12.5], [-12.0, 12.5], [-12.0, 18.0],
                  [-17.5, 18.0], [-17.5, 12.5],
                ]],
              },
            }],
          }),
          isVisible: true,
          isDefault: true,
          order: 0,
          source: 'OSS',
        },
      });

      for (const pt of [
        { name: 'Dakar',      nameFr: 'Dakar',       latitude: 14.6928, longitude: -17.4467, category: 'Capitals', color: '#1e40af' },
        { name: 'Nouakchott', nameFr: 'Nouakchott',  latitude: 18.0735, longitude: -15.9582, category: 'Capitals', color: '#1e40af' },
        { name: 'Banjul',     nameFr: 'Banjul',      latitude: 13.4549, longitude: -16.5790, category: 'Capitals', color: '#1e40af' },
        { name: 'Bissau',     nameFr: 'Bissau',      latitude: 11.8599, longitude: -15.5955, category: 'Capitals', color: '#1e40af' },
      ]) {
        await prisma.mapPoint.create({ data: { ...pt, layerId: layer.id, size: 10 } });
      }
      console.log('✅ Default map data seeded');
    }
  } catch (e) {
    console.error('Map seed error:', e);
  }
}

// ─── Start ────────────────────────────────────────────────────────
app.listen(PORT, async () => {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║   SMAS Backend v2.3 — Starting…          ║');
  console.log(`║   http://localhost:${PORT}                   ║`);
  console.log(`║   ENV: ${NODE_ENV.padEnd(34)}║`);
  console.log('╚══════════════════════════════════════════╝\n');

  await runDbMigration();
  await seedData();

  console.log('\n🚀 Server ready — all routes prefixed with /api/\n');
});

export default app;
