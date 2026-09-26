-- Apply once to the same PostgreSQL database used by DATABASE_URL before rollout.
-- A daily count of Jev reveal decisions; no visitor identifiers or message content.
CREATE TABLE IF NOT EXISTS public.portfolio_reveal_budget (
  day date PRIMARY KEY,
  requests integer NOT NULL CHECK (requests > 0)
);
