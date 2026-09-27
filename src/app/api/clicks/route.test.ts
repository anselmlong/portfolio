// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
const db = vi.hoisted(() => ({ total: 100 }));
vi.mock("~/server/pg", () => ({ pool: {} }));
vi.mock("~/server/clicks", () => ({
  addClicks: vi.fn(async (_db: unknown, n: number) => (db.total += n)),
  readClicks: vi.fn(async () => db.total),
}));
import { GET, POST } from "./route";

const post = (body: unknown, ip = "1.2.3.4", origin = "https://site.example") =>
  POST(
    new Request("https://site.example/api/clicks", {
      method: "POST",
      headers: {
        Origin: origin,
        "Content-Type": "application/json",
        "x-forwarded-for": ip,
      },
      body: JSON.stringify(body),
    }),
  );

beforeEach(() => {
  db.total = 100;
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

describe("shutter counter", () => {
  it("reads and adds to the global total", async () => {
    expect(await (await GET()).json()).toEqual({ total: 100 });
    expect(await (await post({ n: 5 })).json()).toEqual({ total: 105 });
  });

  it("rejects foreign origins and bad batches", async () => {
    expect(
      (await post({ n: 1 }, "9.9.9.1", "https://evil.example")).status,
    ).toBe(403);
    for (const n of [0, -3, 41, 1.5, "7"])
      expect((await post({ n }, "9.9.9.2")).status).toBe(400);
    expect(db.total).toBe(100);
  });

  it("slows down one address that sends too much", async () => {
    let last = 200;
    for (let i = 0; i < 16; i++)
      last = (await post({ n: 40 }, "5.5.5.5")).status;
    expect(last).toBe(429);
    expect((await post({ n: 1 }, "6.6.6.6")).status).toBe(200);
  });
});
