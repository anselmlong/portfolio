import { Pool } from "pg";

// Reuse a single Pool instance across requests to avoid connection churn
const globalForPg = globalThis as unknown as {
  pgPool?: Pool;
};

export const pool: Pool =
  globalForPg.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL!,
    // Optional: tune pool size if needed
    // max: 10,
    // idleTimeoutMillis: 30000,
  });

// Note: For small vector sets (< ~10k), you likely don't need IVFFlat tuning.
// Leave probes unset by default. Enable via env if you add an IVFFlat index later.
const enableIvfflatProbes = process.env.PGVECTOR_SET_PROBES === "1";
const probesVal = Number(process.env.PGVECTOR_PROBES ?? "10");

if (enableIvfflatProbes) {
  (pool as any).on?.("connect", (client: any) => {
    client
      .query(`SET ivfflat.probes = ${Number.isFinite(probesVal) ? probesVal : 10};`)
      .catch(() => {});
  });
}

if (process.env.NODE_ENV !== "production") {
  globalForPg.pgPool = pool;
}
