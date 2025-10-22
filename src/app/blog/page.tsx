import Link from "next/link";

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 bg-clip-text text-transparent">
            blog
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            coming soon...
          </p>
          <p className="text-base text-gray-400 mb-12 max-w-2xl mx-auto">
            This space will feature articles, thoughts, and insights on software development, AI, and technology.
          </p>
          <Link
            href="/"
            className="inline-block bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 border border-white/20 hover:border-white/30"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
