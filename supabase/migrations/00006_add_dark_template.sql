-- Add 'dark' to the template check constraint
ALTER TABLE restaurants DROP CONSTRAINT IF EXISTS restaurants_template_check;
ALTER TABLE restaurants ADD CONSTRAINT restaurants_template_check
  CHECK (template IN ('classic', 'card', 'profile', 'dark'));
