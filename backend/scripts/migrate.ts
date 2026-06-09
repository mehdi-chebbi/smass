/**
 * Script de migration manuel
 * Usage : bun scripts/migrate.ts
 * 
 * Ajoute les nouvelles colonnes de style aux couches cartographiques.
 * Ce script est idempotent (peut être exécuté plusieurs fois sans risque).
 */
import { prisma } from '../utils/db';

async function migrate() {
  console.log('🔄 Migration SMAS — Nouvelles colonnes map_layers\n');

  const migrations = [
    { col: 'fill_color',       sql: `ALTER TABLE map_layers ADD COLUMN IF NOT EXISTS fill_color VARCHAR(255)` },
    { col: 'fill_opacity',     sql: `ALTER TABLE map_layers ADD COLUMN IF NOT EXISTS fill_opacity DOUBLE PRECISION NOT NULL DEFAULT 0.35` },
    { col: 'border_color',     sql: `ALTER TABLE map_layers ADD COLUMN IF NOT EXISTS border_color VARCHAR(255)` },
    { col: 'border_opacity',   sql: `ALTER TABLE map_layers ADD COLUMN IF NOT EXISTS border_opacity DOUBLE PRECISION NOT NULL DEFAULT 1.0` },
    { col: 'show_labels',      sql: `ALTER TABLE map_layers ADD COLUMN IF NOT EXISTS show_labels BOOLEAN NOT NULL DEFAULT FALSE` },
    { col: 'label_field',      sql: `ALTER TABLE map_layers ADD COLUMN IF NOT EXISTS label_field VARCHAR(255)` },
    { col: 'label_font_size',  sql: `ALTER TABLE map_layers ADD COLUMN IF NOT EXISTS label_font_size INTEGER NOT NULL DEFAULT 12` },
    { col: 'categorize',       sql: `ALTER TABLE map_layers ADD COLUMN IF NOT EXISTS categorize BOOLEAN NOT NULL DEFAULT FALSE` },
    { col: 'categorize_field', sql: `ALTER TABLE map_layers ADD COLUMN IF NOT EXISTS categorize_field VARCHAR(255)` },
  ];

  let ok = 0, skip = 0;
  for (const { col, sql } of migrations) {
    try {
      await prisma.$executeRawUnsafe(sql);
      console.log(`  ✅ ${col}`);
      ok++;
    } catch (e: any) {
      if (e.message?.includes('already exists')) {
        console.log(`  ⏭️  ${col} (already exists)`);
        skip++;
      } else {
        console.error(`  ❌ ${col}: ${e.message}`);
      }
    }
  }

  console.log(`\n✅ Done — ${ok} columns added, ${skip} already present`);
  await prisma.$disconnect();
}

migrate().catch(e => { console.error(e); process.exit(1); });
