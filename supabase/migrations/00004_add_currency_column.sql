-- Add currency column to restaurants table
ALTER TABLE restaurants
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'EUR';
