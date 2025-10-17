import "~/styles/xuan.css";
import { TRPCReactProvider } from "~/trpc/react";

export default function XuanLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
	<TRPCReactProvider>{children}</TRPCReactProvider>
  );
}
