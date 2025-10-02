import Link from "next/link";
import Image from 'next/image'
import { LatestPost } from "~/app/_components/post";
import { DownloadButton } from "~/app/_components/DownloadButton";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { api, HydrateClient } from "~/trpc/server";
import { projects, imageUrls } from "~/data";

export const dynamic = "force-dynamic";

// Create pictures array once at the module level
const pictures = imageUrls.map((url, index) => ({
  id: index + 1,
  url
}));

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  // Use the new public route to get all posts
  const posts = await api.post.getAll();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  function Projects() {
    return (
      <div className="mb-8">
        {projects.map(p => (
          <a key={p.title} href={p.href} className="rounded-2xl p-6 shadow hover:scale-[1.01] transition">
            <h3 className="text-xl font-semibold">{p.title}</h3>
            <p className="mt-2 text-sm opacity-80">{p.description}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs opacity-70">
              {p.tech.map(t => <span key={t} className="rounded bg-neutral-100 px-2 py-1">{t}</span>)}
            </div>
          </a>
        ))}
      </div>
    );
  }
  function Pictures() {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
        <div className="flex flex-wrap gap-4">
          {pictures.map((pic) => (
            <div key={pic.id} className="w-48">
              <Link href={`/photos/${pic.id}`}>
              <Image
                src={pic.url}
                alt={`Picture ${pic.id}`}
                width={192}
                height={108}
                className="w-full h-auto rounded-lg"
              />
              </Link>
            </div>

          ))}
        </div>
      </div>
    );
  }
  

  return (
    <HydrateClient>

      <main className="container mx-auto p-4">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Anselm Long</h1>
              <p className="text-gray-600 mb-4 md:mb-0">Software Developer & Creative Problem Solver</p>
            </div>
            <div className="flex gap-3 p-3">
              <DownloadButton 
                filePath="/resume.pdf" 
                fileName="resume.pdf"
                buttonText="Resume"
                variant="primary"
              />
            </div>
          </div>

          {/* Posts Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Recent Posts</h2>

            {/* Show create post form if logged in */}
            {session?.user && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Create New Post</h3>
                <LatestPost />
              </div>
            )}

            {posts.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                    <h3 className="text-xl font-medium mb-2">{post.name}</h3>
                    <div className="text-sm text-gray-300">
                      <p>By: {post.createdBy.name}</p>
                      <p>Created: {new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No posts yet.</p>
            )}
          </div>
          <Projects />
          <Pictures />
        </div>
      </main>
    </HydrateClient>
  );
}
