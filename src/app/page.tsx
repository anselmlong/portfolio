import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

const imageUrls = [
  "https://cdwwp1j6bk.ufs.sh/f/YDTKbsayXpbwwzxlo7pnySrvfcji6sUtDQHepkYTIG1FJh3N",
  "https://cdwwp1j6bk.ufs.sh/f/YDTKbsayXpbwjECSjVZXQx9wikGsu3IvaoFqRj6fyEA1BL2Y"
];

const pictures = imageUrls.map((url, index) => ({
  id: index + 1,
  url
}));

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <main className="">
        <div className="flex flex-wrap gap-4">
          {pictures.map((pic) => (
            <div key={pic.id} className="w-48">
              <img
                src={pic.url}
                alt={`Picture ${pic.id}`}
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
        Hello! Work in progress :)
      </main>
    </HydrateClient>
  );
}
