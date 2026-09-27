import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const { parseCalendar, parseTotal, longestStreak } = await import("./github");

const html = `
<td tabindex="0" data-ix="0" data-date="2026-03-02" id="contribution-day-component-1-0" data-level="0" class="ContributionCalendar-day"></td>
<td tabindex="0" data-ix="0" data-date="2026-03-01" id="contribution-day-component-0-0" data-level="2" class="ContributionCalendar-day"></td>
<td tabindex="0" data-date="2026-03-03" id="contribution-day-component-2-0" data-level="4"></td>
<tool-tip for="contribution-day-component-0-0" class="sr-only">5 contributions on March 1st.</tool-tip>
<tool-tip for="contribution-day-component-1-0" class="sr-only">No contributions on March 2nd.</tool-tip>
<tool-tip for="contribution-day-component-2-0" class="sr-only">1,204 contributions on March 3rd.</tool-tip>`;

describe("github calendar", () => {
  it("reads dates, levels and counts in date order", () => {
    expect(parseCalendar(html)).toEqual([
      { date: "2026-03-01", level: 2, count: 5 },
      { date: "2026-03-02", level: 0, count: 0 },
      { date: "2026-03-03", level: 4, count: 1204 },
    ]);
  });
  it("reads the total GitHub prints", () => {
    expect(
      parseTotal(
        '<h2 class="f4">\n  1,465\n contributions\n in the last year\n</h2>',
      ),
    ).toBe(1465);
    expect(parseTotal("<h2></h2>")).toBeNull();
  });
  it("finds the longest run of active days", () => {
    const d = (count: number) => ({ date: "", level: 0, count });
    expect(longestStreak([d(1), d(2), d(0), d(1), d(1), d(1), d(0)])).toBe(3);
  });
});
