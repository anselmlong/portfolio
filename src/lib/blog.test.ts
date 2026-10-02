// @vitest-environment node
import { describe, expect, it } from "vitest";
import { renderPostMarkdown } from "./blog";

describe("renderPostMarkdown", () => {
  it("keeps display maths as one block instead of a heading", async () => {
    const html = await renderPostMarkdown(
      [
        "# Evaluation",
        "",
        "is defined as",
        "",
        "$$\\begin{equation}",
        "  \\operatorname{HitRate@K}",
        "  =",
        "  \\frac{1}{N}",
        "\\end{equation}$$",
        "",
        "where $N$ is the number of queries.",
      ].join("\n"),
    );
    expect(html.match(/<h\d/g)).toHaveLength(1);
    expect(html).toContain('<h2 id="evaluation">');
    expect(html).toMatch(/<pre><code class="hljs language-latex">[\s\S]*HitRate@K[\s\S]*<\/code><\/pre>/);
    expect(html).toContain("<p>where $N$ is the number of queries.</p>");
  });

  it("leaves dollar signs inside code fences alone", async () => {
    const html = await renderPostMarkdown("```sh\n$$ echo hi $$\n```\n");
    expect(html).not.toContain("language-latex");
  });
});
