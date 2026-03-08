-- Add animations_enabled column to restaurants
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS animations_enabled boolean NOT NULL DEFAULT true;
