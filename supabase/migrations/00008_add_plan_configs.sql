-- Plan configuration table: stores editable plan limits, prices, and features
CREATE TABLE IF NOT EXISTS plan_configs (
  id TEXT PRIMARY KEY,  -- 'free', 'starter', 'pro', 'business'
  display_name TEXT NOT NULL DEFAULT '',
  monthly_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  yearly_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  description TEXT NOT NULL DEFAULT '',
  max_menus INT NOT NULL DEFAULT 1,
  max_dishes INT NOT NULL DEFAULT 15,
  max_scans_per_month INT NOT NULL DEFAULT 1000,
  templates TEXT[] NOT NULL DEFAULT '{classic}',
  languages TEXT[] NOT NULL DEFAULT '{fr}',
  social_media TEXT[] NOT NULL DEFAULT '{}',
  reviews_enabled BOOLEAN NOT NULL DEFAULT false,
  search_enabled BOOLEAN NOT NULL DEFAULT false,
  custom_qr BOOLEAN NOT NULL DEFAULT false,
  white_label BOOLEAN NOT NULL DEFAULT false,
  custom_theme BOOLEAN NOT NULL DEFAULT false,
  advanced_stats BOOLEAN NOT NULL DEFAULT false,
  support_hours TEXT,
  scanini_logo BOOLEAN NOT NULL DEFAULT true,
  is_popular BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed default plan configs
INSERT INTO plan_configs (id, display_name, monthly_price, yearly_price, description, max_menus, max_dishes, max_scans_per_month, templates, languages, social_media, reviews_enabled, search_enabled, custom_qr, white_label, custom_theme, advanced_stats, support_hours, scanini_logo, is_popular)
VALUES
  ('free', 'Gratuit', 0, 0, 'Pour bien demarrer', 1, 15, 1000, '{classic}', '{fr}', '{}', false, false, false, false, false, false, NULL, true, false),
  ('starter', 'Starter', 19, 190, 'Pour les petits restaurants', 3, 50, 3000, '{classic,card}', '{fr}', '{facebook}', false, true, false, false, false, false, NULL, true, false),
  ('pro', 'Pro', 39, 490, 'Pour les restaurants en croissance', 10, 100, 5000, '{classic,card,profile}', '{fr,ar}', '{facebook,instagram,tiktok}', true, true, true, false, false, false, '48h', true, true),
  ('business', 'Pro Max', 69, 790, 'Pour les grandes enseignes', 999, 999, 999999, '{classic,card,profile,dark}', '{fr,ar,en}', '{facebook,instagram,tiktok}', true, true, true, true, true, true, '24h', false, false)
ON CONFLICT (id) DO NOTHING;

-- Auto-update updated_at
CREATE TRIGGER handle_plan_configs_updated_at
  BEFORE UPDATE ON plan_configs
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- RLS: admins can read/write, everyone else can read
ALTER TABLE plan_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read plan configs"
  ON plan_configs FOR SELECT
  USING (true);

CREATE POLICY "Admins can update plan configs"
  ON plan_configs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert plan configs"
  ON plan_configs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
