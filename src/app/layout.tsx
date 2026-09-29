import "~/styles/globals.css";

import { type Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: {
    default: "portfolio - anselm long",
    template: "%s — anselm long",
  },
  description: "my projects, thoughts, and more!",
  metadataBase: new URL("https://anselmlong.com"),
  openGraph: {
    type: "website",
    title: "anselm long",
    description:
      "i build small tools that fix everyday annoyances, film things, and climb when i can.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Anselm Long, over the Golden Gate",
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Analytics />
      </body>
    </html>
  );
}
