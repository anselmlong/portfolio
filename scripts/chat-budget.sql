-- Apply once to the same PostgreSQL database used by DATABASE_URL before rollout.
-- Daily aggregate counters contain no visitor identifiers or message content.
CREATE TABLE IF NOT EXISTS public.portfolio_chat_budget (
  day date PRIMARY KEY,
  requests integer NOT NULL CHECK (requests > 0)
);
