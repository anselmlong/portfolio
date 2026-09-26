import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PostReader } from "./PostReader";

const post = () =>
  render(
    <>
      <PostReader />
      <article
        data-article
        dangerouslySetInnerHTML={{
          __html:
            '<p>text</p><img src="/a.png" alt="cup"><a href="/x"><img src="/b.png" alt="linked"></a>',
        }}
      />
    </>,
  );
const viewer = () => document.querySelector("dialog")!;

beforeEach(() => {
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: q.includes("reduce") }));
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
});
afterEach(() => vi.unstubAllGlobals());

describe("PostReader image viewer", () => {
  it("makes article images keyboard-openable, but leaves linked images alone", () => {
    post();
    const img = screen.getByRole("button", { name: "Enlarge image: cup" });
    expect(img).toHaveAttribute("tabindex", "0");
    expect(screen.getByAltText("linked")).not.toHaveAttribute("role");
  });

  it("opens on Enter, focuses close, and returns focus to the image on Escape", () => {
    post();
    const img = screen.getByRole("button", { name: "Enlarge image: cup" });
    img.focus();
    fireEvent.keyDown(img, { key: "Enter" });
    expect(viewer()).toHaveAttribute("open");
    expect(viewer()).toHaveAccessibleName("Enlarged image: cup");
    const close = screen.getByRole("button", { name: /close/ });
    expect(close).toHaveFocus();

    fireEvent(viewer(), new Event("cancel", { cancelable: true }));
    expect(viewer()).not.toHaveAttribute("open");
    expect(img).toHaveFocus();
  });

  it("opens on click and closes on a click anywhere", () => {
    post();
    fireEvent.click(screen.getByAltText("cup"));
    expect(viewer()).toHaveAttribute("open");
    fireEvent.click(screen.getByRole("button", { name: /close/ }));
    expect(viewer()).not.toHaveAttribute("open");
    expect(screen.queryByRole("button", { name: /close/ })).toBeNull();
  });
});
