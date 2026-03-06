-- Add template column to restaurants table
ALTER TABLE restaurants
  ADD COLUMN IF NOT EXISTS template text NOT NULL DEFAULT 'classic'
  CHECK (template IN ('classic', 'card'));
