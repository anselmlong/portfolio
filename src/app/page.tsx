import { api, HydrateClient } from "~/trpc/server";
import ClientHome from "./ClientHome";

export const dynamic = "force-dynamic";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  return (
    <HydrateClient>
      <ClientHome hello={hello} />
    </HydrateClient>
  );
}
