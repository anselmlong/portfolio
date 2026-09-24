import { type Pool } from "pg";

/** Atomic database-wide request allowance. Each request can make at most two chat calls. */
export async function reserveChatRequest(db: Pick<Pool, "query">) {
  const result = await db.query<{ requests: number }>(`
    INSERT INTO public.portfolio_chat_budget (day, requests)
    VALUES ((CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::date, 1)
    ON CONFLICT (day) DO UPDATE
      SET requests = portfolio_chat_budget.requests + 1
      WHERE portfolio_chat_budget.requests < 200
    RETURNING requests
  `);
  return result.rows.length > 0;
}
