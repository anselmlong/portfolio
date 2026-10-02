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

  it("rolls the new section name in from the way you're reading, unless motion is reduced", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const animate = vi.fn<Element["animate"]>();
    Element.prototype.animate = animate;
    const { unmount } = withContents();
    // The first reading on load names the section without a flourish.
    expect(animate).not.toHaveBeenCalled();
    const [one, two] = [...document.querySelectorAll<HTMLElement>("article h2")];
    const at = (top: number) => () => ({ top }) as DOMRect;

    one!.getBoundingClientRect = at(0);
    two!.getBoundingClientRect = at(2000);
    fireEvent.scroll(window);
    expect(document.querySelector("[data-toc-now]")).toHaveTextContent("One");
    expect(animate).toHaveBeenLastCalledWith(
      [{ opacity: 0, transform: "translateY(-0.6em)" }, { opacity: 1, transform: "none" }],
      expect.objectContaining({ duration: 280 }),
    );

    two!.getBoundingClientRect = at(0);
    fireEvent.scroll(window);
    expect(document.querySelector("[data-toc-now]")).toHaveTextContent("Two");
    expect((animate.mock.lastCall![0] as Keyframe[])[0]!.transform).toBe("translateY(0.6em)");
    expect(animate).toHaveBeenCalledTimes(2);

    // Scrolling within a section doesn't replay it.
    fireEvent.scroll(window);
    expect(animate).toHaveBeenCalledTimes(2);

    // Under reduced motion the name just changes.
    unmount();
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    withContents();
    const [first, second] = [...document.querySelectorAll<HTMLElement>("article h2")];
    first!.getBoundingClientRect = at(0);
    second!.getBoundingClientRect = at(2000);
    fireEvent.scroll(window);
    expect(document.querySelector("[data-toc-now]")).toHaveTextContent("One");
    expect(animate).toHaveBeenCalledTimes(2);
    delete (Element.prototype as Partial<Element>).animate;
  });

  it("opens the phone list scrolled to the current section", () => {
    withContents();
    const list = strip().querySelector<HTMLElement>("[data-toc]")!;
    const [, current] = screen.getAllByRole("link", { name: "Two" });
    const box = (top: number, height: number) => () => ({ top, height }) as DOMRect;
    list.getBoundingClientRect = box(100, 200);
    current!.getBoundingClientRect = box(500, 40);
    strip().dispatchEvent(new Event("toggle"));
    // 400px below the list's top, less (200 - 40) / 2 to centre it.
    expect(list.scrollTop).toBe(320);
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
