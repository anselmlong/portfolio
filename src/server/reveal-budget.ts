import { type Pool } from "pg";

/** Atomic database-wide allowance for Jev reveal decisions (TypeSafe calls). */
export async function reserveRevealRequest(db: Pick<Pool, "query">) {
  const result = await db.query<{ requests: number }>(`
    INSERT INTO public.portfolio_reveal_budget (day, requests)
    VALUES ((CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::date, 1)
    ON CONFLICT (day) DO UPDATE
      SET requests = portfolio_reveal_budget.requests + 1
      WHERE portfolio_reveal_budget.requests < 300
    RETURNING requests
  `);
  return result.rows.length > 0;
}
