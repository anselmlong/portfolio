import type { Metadata } from "next";
import { viewfinderFonts } from "~/app/_home/fonts";
import { getProjectMap } from "~/server/projects";
import { ProjectMap } from "./_map/ProjectMap";
import { makeBodies, settle } from "./_map/sim";

export const revalidate = 21600;

export const metadata: Metadata = {
  title: "project map",
  description:
    "Everything Anselm has made, half-made, and walked away from, as an interactive map: what's live, what's in progress, and how it all connects.",
};

export default async function ProjectsPage() {
  const { nodes, links } = await getProjectMap();
  // Laid out once here, so the first paint is already settled and identical in the browser.
  const placed = settle(makeBodies(nodes), links, "map").map(
    ({ vx: _vx, vy: _vy, fx: _fx, fy: _fy, x, y, ...rest }) => ({
      ...rest,
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
    }),
  );
  return (
    <div className={viewfinderFonts}>
      <ProjectMap placed={placed} links={links} />
    </div>
  );
}
