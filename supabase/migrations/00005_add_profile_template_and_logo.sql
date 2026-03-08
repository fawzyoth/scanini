-- Add logo_image column to restaurants table
ALTER TABLE restaurants
  ADD COLUMN IF NOT EXISTS logo_image text;

-- Update template check constraint to include 'profile'
ALTER TABLE restaurants DROP CONSTRAINT IF EXISTS restaurants_template_check;
ALTER TABLE restaurants
  ADD CONSTRAINT restaurants_template_check CHECK (template IN ('classic', 'card', 'profile'));
