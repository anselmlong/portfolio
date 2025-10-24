
import "~/styles/globals.css";

import { ConditionalTopNav } from "./_components/ConditionalTopNav";
import { type Metadata } from "next";
import { Geist, Bricolage_Grotesque } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "portfolio - anselm long",
  description: "my projects, thoughts, and more!",
  icons: [{ rel: "icon", url: "/favicon.png" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bg-sans"
})

export default function RootLayout({
  children,
}: Readonly<{ 
  children: React.ReactNode;
}>) {
  return (
     <html lang="en" className={`${geist.variable} ${bricolageGrotesque.variable}`}>
      <body className="bg-black text-white min-h-screen">
        <ConditionalTopNav />
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Analytics />
      </body>
    </html>
  );
}
