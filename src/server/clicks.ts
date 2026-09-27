import { type Pool } from "pg";

/** Adds a batch of shutter presses to the global count and returns the new total. */
export async function addClicks(db: Pick<Pool, "query">, n: number) {
  const result = await db.query<{ total: string }>(
    `INSERT INTO public.portfolio_clicks (id, total) VALUES (1, $1)
     ON CONFLICT (id) DO UPDATE SET total = portfolio_clicks.total + $1
     RETURNING total`,
    [n],
  );
  return Number(result.rows[0]?.total ?? 0);
}

export async function readClicks(db: Pick<Pool, "query">) {
  const result = await db.query<{ total: string }>(
    "SELECT total FROM public.portfolio_clicks WHERE id = 1",
  );
  return Number(result.rows[0]?.total ?? 0);
}
