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

describe("PostReader contents", () => {
  const withContents = () =>
    render(
      <>
        <PostReader />
        <nav data-toc>
          <a href="#one">One</a>
          <a href="#two">Two</a>
        </nav>
        <details data-toc-phone open>
          <summary>
            on this page <b data-toc-now>One</b>
          </summary>
          <nav data-toc>
            <a href="#one">One</a>
            <a href="#two">Two</a>
          </nav>
        </details>
        <article
          data-article
          dangerouslySetInnerHTML={{
            __html: '<h2 id="one">One</h2><p>a</p><h2 id="two">Two</h2><p>b</p>',
          }}
        />
      </>,
    );
  const strip = () => document.querySelector("details")!;

  it("lights the current section in both lists and names it in the phone strip", () => {
    withContents();
    // jsdom puts every heading at the top, so the last one is current.
    const current = screen.getAllByRole("link", { name: "Two" });
    expect(current).toHaveLength(2);
    current.forEach((a) => expect(a).toHaveAttribute("aria-current", "location"));
    screen.getAllByRole("link", { name: "One" }).forEach((a) => expect(a).not.toHaveAttribute("aria-current"));
    expect(document.querySelector("[data-toc-now]")).toHaveTextContent("Two");
  });

  it("folds the phone strip after a jump, on Escape, and on a tap elsewhere", () => {
    withContents();
    const [, phoneLink] = screen.getAllByRole("link", { name: "One" });
    fireEvent.click(phoneLink!);
    expect(strip().open).toBe(false);

    strip().open = true;
    fireEvent.keyDown(phoneLink!, { key: "Escape" });
    expect(strip().open).toBe(false);
    expect(document.querySelector("summary")).toHaveFocus();

    strip().open = true;
    fireEvent.pointerDown(document.querySelector("article")!);
    expect(strip().open).toBe(false);
  });
});
