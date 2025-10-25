import { api, HydrateClient } from "~/trpc/server";
import ClientHome from "./ClientHome";

export const dynamic = "force-dynamic";

export default async function Home() {
  await api.blog.list.prefetch();

  return (
    <HydrateClient>
      <ClientHome />
    </HydrateClient>
  );
}
