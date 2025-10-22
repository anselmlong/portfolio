import Link from "next/link";
import Image from 'next/image'
import { LatestPost } from "~/app/_components/post";
import { DownloadButton } from "~/app/_components/DownloadButton";
import ChatInterface from "~/app/_components/ChatInterface";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { api, HydrateClient } from "~/trpc/server";
import { projects, imageUrls, experiences } from "~/data";

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

  function Projects() {
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
          Featured Projects
        </h2>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
          {projects.map(p => (
            <a 
              key={p.title} 
              href={p.href} 
              className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-gray-300 transition-colors">
                    {p.title}
                  </h3>
                  {p.position && (
                    <p className="text-sm font-medium text-gray-400 mb-3">{p.position}</p>
                  )}
                  <p className="text-base leading-relaxed text-gray-300 mb-4">
                    {p.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {p.tech.map(t => (
                      <span 
                        key={t} 
                        className="bg-white/10 text-gray-300 px-3 py-1 rounded-full text-sm font-medium border border-white/20"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right opacity-60 group-hover:opacity-100 transition-opacity">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    );
  }
  function Pictures() {
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
          Photography Gallery
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pictures.map((pic) => (
            <Link key={pic.id} href={`/photos/${pic.id}`} className="group">
              <div className="relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300">
                <Image
                  src={pic.url}
                  alt={`Gallery image ${pic.id}`}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-sm font-medium">View Details</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  function Experiences() {
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
          Work Experience
        </h2>
        <div className="space-y-8">
          {experiences.map((e, index) => (
            <div 
              key={e.title} 
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{e.title}</h3>
                  <h4 className="text-xl font-semibold text-gray-300 mb-2">{e.company}</h4>
                  <p className="text-sm font-medium text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full inline-block">
                    {e.start_date} - {e.end_date}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                {e.points.map((point, pointIndex) => (
                  <div key={pointIndex} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  function Education() {
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
          Education
        </h2>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/10 hover:border-white/20 transition-all duration-300">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">National University of Singapore</h3>
              <h4 className="text-xl font-semibold text-gray-300 mb-2">Bachelor of Science in Computer Science</h4>
              <p className="text-sm font-medium text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full inline-block">
                August 2023 - April 2027
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
              <p className="text-gray-300"><span className="font-semibold text-white">GPA:</span> 4.69/5.00</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
              <p className="text-gray-300"><span className="font-semibold text-white">Specialization:</span> Artificial Intelligence</p>
            </div>
            <div className="flex items-start gap-3 mt-4">
              <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-gray-300 font-semibold text-white mb-2">Relevant Coursework:</p>
                <p className="text-gray-300">Artificial Intelligence and Machine Learning, Software Engineering, Object Oriented Programming, Data Structures and Algorithms, Statistics and Probability</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  function Skills() {
    const skillCategories = [
      {
        title: "Languages",
        skills: ["Python", "Java", "JavaScript", "C", "C++", "HTML/CSS", "Go", "LaTeX"],
        gradient: "from-gray-200 to-gray-400"
      },
      {
        title: "Frameworks & Libraries",
        skills: ["Git", "React", "JavaFX", "Node.js", "Next.js", "tRPC", "YOLOv8", "PostgreSQL", "Render", "scikit-learn", "Numpy", "Pandas"],
        gradient: "from-gray-200 to-gray-400"
      }
    ];

    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
          Technical Skills
        </h2>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {skillCategories.map((category) => (
            <div 
              key={category.title}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <h3 className={`text-xl font-bold mb-4 bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent`}>
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span 
                    key={skill}
                    className="bg-gradient-to-r from-white/10 to-white/5 text-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium border border-white/10 hover:border-white/30 transition-all"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }


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
              <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
                Year 3 Computer Science @ NUS
              </p>
              <p className="text-base text-gray-400 mb-8 max-w-4xl mx-auto leading-relaxed">
                what else do i do? scroll down and ask!
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
