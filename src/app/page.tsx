import Link from "next/link";
import Image from 'next/image'
import { LatestPost } from "~/app/_components/post";
import { DownloadButton } from "~/app/_components/DownloadButton";
import ChatInterface from "~/app/_components/ChatInterface";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { api, HydrateClient } from "~/trpc/server";
import { projects, imageUrls, experiences } from "~/data";
import TypingLine from "~/app/_components/TypingLine";

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
  // const posts = await api.post.getAll();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  const roles = [
    'student.',
    'coffee lover.',
    'machine learning enthusiast.',
    'software engineer.',
    'data analyst.',
    'web developer.',
    'storyteller.',
    'photographer.',
    'rock toucher.'
  ];


  return (
    <HydrateClient>
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 bg-clip-text text-transparent">
                hi, i'm anselm.
              </h1>
              <TypingLine strings={roles} />
              <p className="text-base text-gray-400 mb-8 max-w-4xl mx-auto leading-relaxed">
                want to know more about me? just ask!
              </p>

            </div>

          </div>
          {/* Chatbot Interface */}
          <ChatInterface />



          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gray-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-gray-400/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 left-3/4 w-24 h-24 bg-gray-500/10 rounded-full blur-3xl animate-pulse"></div>
          </div>
        </section>

      </main>
    </HydrateClient>
  );
}
