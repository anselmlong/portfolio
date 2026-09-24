import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import GuidedPortfolio, { TYPING_PHRASE, TypingDemo } from "./GuidedPortfolio";

vi.mock("next/dynamic", () => ({
  default: () => () => <div>AI chat loaded</div>,
}));
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("guided portfolio", () => {
  it("lets visitors finish a hiring tour, go back, and reset without AI", () => {
    render(<GuidedPortfolio />);
    expect(screen.queryByText("AI chat loaded")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /I’m hiring/ }));
    expect(
      screen.getByRole("heading", { name: "Beyond the interface." }),
    ).toHaveFocus();
    fireEvent.click(screen.getByRole("button", { name: "Show me another" }));
    expect(
      screen.getByRole("heading", {
        name: "A climbing wall, made searchable.",
      }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Show me another" }));
    expect(
      screen.getByRole("link", { name: /That’s a little of me/ }),
    ).toHaveAttribute("href", "mailto:anselmpius@gmail.com");
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(
      screen.getByRole("button", { name: "Turn the post into a route" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Start a new tour" }));
    expect(screen.getByRole("button", { name: /I’m hiring/ })).toHaveFocus();
    expect(
      screen.queryByRole("button", { name: "Show me another" }),
    ).not.toBeInTheDocument();
  });

  it("resets interactive artifacts and detail when changing paths", () => {
    render(<GuidedPortfolio />);
    fireEvent.click(screen.getByRole("button", { name: /Just exploring/ }));
    expect(
      screen.getByRole("heading", { name: "Sometimes I put the laptop down." }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Show me another" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Turn the post into a route" }),
    );
    expect(
      screen.getByRole("button", { name: "Back to the caption" }),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "How did you build it?" }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: /Show me something cool/ }),
    );
    expect(
      screen.getByRole("button", { name: "How did you build it?" }),
    ).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(screen.getByRole("button", { name: "Show me another" }));
    expect(
      screen.getByRole("button", { name: "Turn the post into a route" }),
    ).toBeInTheDocument();
  });

  it("loads optional AI only when requested", () => {
    render(<GuidedPortfolio />);
    fireEvent.click(
      screen.getByRole("button", { name: /ask me your own question/ }),
    );
    expect(screen.getByText("AI chat loaded")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Close AI chat/ }));
    expect(screen.queryByText("AI chat loaded")).not.toBeInTheDocument();
  });
});

describe("typing preview", () => {
  it("requires an exact phrase, scores elapsed time, and resets", () => {
    const clock = vi.spyOn(Date, "now").mockReturnValue(1000);
    render(<TypingDemo />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "x" } });
    expect(input).toBeEnabled();
    clock.mockReturnValue(61000);
    fireEvent.change(input, { target: { value: TYPING_PHRASE } });
    expect(input).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent(
      `${Math.round(TYPING_PHRASE.length / 5)} WPM`,
    );
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(input).toHaveValue("");
    expect(input).toBeEnabled();
  });
});
