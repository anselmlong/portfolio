-- Apply once to the same PostgreSQL database used by DATABASE_URL before rollout.
-- One global counter for the homepage shutter button; no visitor identifiers.
CREATE TABLE IF NOT EXISTS public.portfolio_clicks (
  id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  total bigint NOT NULL DEFAULT 0 CHECK (total >= 0)
);
INSERT INTO public.portfolio_clicks (id, total) VALUES (1, 0) ON CONFLICT (id) DO NOTHING;
