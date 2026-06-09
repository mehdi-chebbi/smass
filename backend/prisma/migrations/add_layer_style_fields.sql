-- Migration: Add advanced styling fields to map_layers
-- Run this against your PostgreSQL database after deploying

ALTER TABLE map_layers
  ADD COLUMN IF NOT EXISTS fill_color       VARCHAR(255),
  ADD COLUMN IF NOT EXISTS fill_opacity     DOUBLE PRECISION NOT NULL DEFAULT 0.35,
  ADD COLUMN IF NOT EXISTS border_color     VARCHAR(255),
  ADD COLUMN IF NOT EXISTS border_opacity   DOUBLE PRECISION NOT NULL DEFAULT 1.0,
  ADD COLUMN IF NOT EXISTS show_labels      BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS label_field      VARCHAR(255),
  ADD COLUMN IF NOT EXISTS label_font_size  INTEGER NOT NULL DEFAULT 12,
  ADD COLUMN IF NOT EXISTS categorize       BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS categorize_field VARCHAR(255);

ALTER TABLE map_layers ALTER COLUMN opacity SET DEFAULT 0.8;
