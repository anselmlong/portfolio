import { getGithubActivity } from "~/server/github";
import { api } from "~/trpc/server";
import { viewfinderFonts } from "./_home/fonts";
import HomeExperience from "./_home/HomeExperience";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [posts, github] = await Promise.all([
    api.blog.list(),
    getGithubActivity().catch(() => null),
  ]);

  return (
    <div className={viewfinderFonts}>
      <HomeExperience
        totalPosts={posts.length}
        github={github}
        posts={posts.slice(0, 5).map(({ slug, title, date }) => ({ slug, title, date }))}
      />
    </div>
  );
}
