import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { contactEmail } from "~/lib/home-content";
import { CopyEmail } from "./CopyEmail";

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("CopyEmail", () => {
  it("copies, announces it, then goes back to copy", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn(() => Promise.resolve());
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
    render(<CopyEmail />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "copy" }));
    });
    expect(writeText).toHaveBeenCalledWith(contactEmail);
    expect(screen.getByRole("button", { name: "copied ✓" })).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe("Email address copied");

    await act(async () => {
      vi.advanceTimersByTime(2400);
    });
    expect(screen.getByRole("button", { name: "copy" })).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe("");
  });

  it("selects the address when the clipboard is refused", async () => {
    const writeText = vi.fn(() => Promise.reject(new Error("denied")));
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
    render(<CopyEmail />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "copy" }));
    });
    expect(getSelection()?.toString()).toBe(contactEmail);
    expect(screen.getByRole("button", { name: "selected" })).toBeTruthy();
  });
});
