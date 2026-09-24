import {
  fireEvent,
  render,
  screen,
  within,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ConversationHome from "./ConversationHome";

afterEach(() => vi.unstubAllGlobals());
describe("conversation homepage", () => {
  it("preserves a new draft after an earlier request fails", async () => {
    let finish!: (value: unknown) => void;
    vi.stubGlobal(
      "fetch",
      vi.fn(
        () =>
          new Promise((resolve) => {
            finish = resolve;
          }),
      ),
    );
    render(<ConversationHome />);
    const input = screen.getByRole("textbox", {
      name: "Ask about Anselm’s work",
    });
    fireEvent.change(input, { target: { value: "First question" } });
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    fireEvent.change(input, { target: { value: "My next draft" } });
    finish({ ok: false, json: async () => ({ error: "offline" }) });
    await screen.findByRole("alert");
    expect(input).toHaveValue("My next draft");
  });
  it("appends choices and inline reveals without an API call", () => {
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    render(<ConversationHome />);
    fireEvent.click(screen.getByRole("button", { name: "Show me your work" }));
    expect(
      screen.getByRole("textbox", { name: "Ask about Anselm’s work" }),
    ).not.toHaveFocus();
    const log = screen.getByRole("log");
    expect(within(log).getAllByRole("link")).toHaveLength(3);
    fireEvent.click(
      screen.getByRole("button", { name: "What are you working on?" }),
    );
    expect(within(log).getByText("Show me your work")).toBeInTheDocument();
    expect(
      within(log).getByText("Open Government Products"),
    ).toBeInTheDocument();
    expect(fetcher).not.toHaveBeenCalled();
    fireEvent.click(
      screen.getByRole("button", { name: "Start a new conversation" }),
    );
    expect(
      within(log).queryByText("Open Government Products"),
    ).not.toBeInTheDocument();
  });
  it("keeps repeated game labels unique and filters the complete catalog", () => {
    render(<ConversationHome />);
    fireEvent.click(
      screen.getByRole("button", { name: "Let’s play something" }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Let’s play something" }),
    );
    const games = screen.getAllByRole("textbox", {
      name: "Type: steady lah, one step at a time",
    });
    expect(new Set(games.map((g) => g.id)).size).toBe(2);
    fireEvent.change(games[0]!, {
      target: { value: "steady lah, one step at a time" },
    });
    expect(screen.getByText(/WPM. Steady!/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Experiments" }));
    expect(screen.getAllByRole("article")).toHaveLength(3);
    fireEvent.click(screen.getByRole("button", { name: "All projects" }));
    expect(screen.getAllByRole("article")).toHaveLength(13);
  });
  it("renders a validated AI reply and restores the draft on failure", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          text: "A specific reply",
          intent: "contact",
          projects: [],
        }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "unavailable" }),
      });
    vi.stubGlobal("fetch", fetcher);
    render(<ConversationHome />);
    const input = screen.getByRole("textbox", {
      name: "Ask about Anselm’s work",
    });
    fireEvent.change(input, { target: { value: "Contact?" } });
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    expect(await screen.findByText("A specific reply")).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "Follow up" } });
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    await screen.findByRole("alert");
    expect(input).toHaveValue("Follow up");
  });
  it("does not append a stale response after resetting", async () => {
    let finish!: (value: unknown) => void;
    vi.stubGlobal(
      "fetch",
      vi.fn(
        () =>
          new Promise((resolve) => {
            finish = resolve;
          }),
      ),
    );
    render(<ConversationHome />);
    fireEvent.change(
      screen.getByRole("textbox", { name: "Ask about Anselm’s work" }),
      { target: { value: "Question" } },
    );
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Start a new conversation" }),
    );
    finish({
      ok: true,
      json: async () => ({
        text: "Stale answer",
        intent: "work",
        projects: [],
      }),
    });
    await waitFor(() =>
      expect(screen.queryByText("Stale answer")).not.toBeInTheDocument(),
    );
  });
});
