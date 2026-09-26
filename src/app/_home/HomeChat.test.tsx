import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HomeChat } from "./HomeChat";

type Handler = (url: string, init: RequestInit) => Promise<Response>;
function stubFetch(handler: Handler) {
  const fetcher = vi.fn(handler);
  vi.stubGlobal("fetch", fetcher);
  return fetcher;
}
const setup = () => {
  const props = {
    still: true,
    onTopic: vi.fn(),
    onPeek: vi.fn(),
    onType: vi.fn(),
    onSeeAll: vi.fn(),
  };
  render(<HomeChat {...props} />);
  return props;
};
const box = () => screen.getByRole("textbox", { name: "Ask Anselm" });
const send = (text: string) => {
  fireEvent.change(box(), { target: { value: text } });
  fireEvent.click(screen.getByRole("button", { name: "send" }));
};

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("homepage chat", () => {
  it("streams the RAG answer for a question chip and shows that chip's card", async () => {
    const fetcher = stubFetch(
      async () => new Response("mostly small telegram bots"),
    );
    const props = setup();
    fireEvent.click(
      screen.getByRole("button", { name: "what have you shipped?" }),
    );
    expect(props.onTopic).toHaveBeenCalledWith("shipped");
    expect(
      await screen.findByText("mostly small telegram bots"),
    ).toBeInTheDocument();
    // A chip already knows its card, so Jev isn't asked.
    expect(fetcher.mock.calls.map(([url]) => url)).toEqual(["/api/chat"]);
    // The RAG gets the chip's specific question; the visitor sees the short one.
    const sent = JSON.parse(fetcher.mock.calls[0]![1].body as string) as {
      messages: { parts: { text: string }[] }[];
    };
    expect(sent.messages.at(-1)!.parts[0]!.text).toMatch(
      /computah, ava, optifiner/,
    );
    expect(
      screen.getByText("what have you shipped?", { selector: "[data-id]" }),
    ).toBeInTheDocument();
    // Follow-up questions replace the starters.
    expect(
      screen.getByRole("button", {
        name: "what's the most technical thing you've built?",
      }),
    ).toBeInTheDocument();
  });

  it("lets Jev pick a trusted card for free text, and never takes text from it", async () => {
    stubFetch(async (url) =>
      url === "/api/reveal"
        ? Response.json({
            intent: "work",
            projects: ["Optifiner (evolutionary multi-agent code optimiser)"],
            text: "<b>injected</b>",
          })
        : new Response("probably optifiner"),
    );
    const props = setup();
    send("hardest thing you've built?");
    expect(await screen.findByText("probably optifiner")).toBeInTheDocument();
    await waitFor(() =>
      expect(props.onTopic).toHaveBeenCalledWith("technical"),
    );
    expect(screen.queryByText("injected")).not.toBeInTheDocument();
  });

  it("names the failing phase and puts the question back when the backend errors", async () => {
    stubFetch(async (url) =>
      url === "/api/reveal"
        ? Response.json({ intent: "clarify", projects: [] })
        : Response.json({ code: "retrieval" }, { status: 502 }),
    );
    setup();
    send("what is bonsai?");
    expect(await screen.findByRole("alert")).toHaveTextContent("retrieval");
    expect(box()).toHaveValue("what is bonsai?");
  });

  it("offers the full site after two answers, but never scrolls on its own", async () => {
    stubFetch(async (url) =>
      url === "/api/reveal"
        ? Response.json({ intent: "clarify", projects: [] })
        : new Response("an answer"),
    );
    const props = setup();
    send("hello");
    await screen.findByText("an answer");
    expect(
      screen.queryByRole("button", { name: /see the full site/ }),
    ).not.toBeInTheDocument();
    send("and?");
    await waitFor(() =>
      expect(screen.getAllByText("an answer")).toHaveLength(2),
    );
    const nudge = screen.getByRole("button", { name: /see the full site/ });
    expect(props.onSeeAll).not.toHaveBeenCalled();
    fireEvent.click(nudge);
    expect(props.onSeeAll).toHaveBeenCalledOnce();
  });

  it("previews a question's scene on hover", () => {
    stubFetch(async () => new Response(""));
    const props = setup();
    const chips = screen.getByLabelText("Suggested questions");
    fireEvent.pointerEnter(
      within(chips).getByRole("button", { name: "let me play something" }),
    );
    expect(props.onPeek).toHaveBeenCalledWith("kopi");
  });
});
