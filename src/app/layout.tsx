
import "~/styles/globals.css";

import { ConditionalTopNav } from "./_components/ConditionalTopNav";
import { type Metadata } from "next";
import { Geist } from "next/font/google";

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

export default function RootLayout({
  children,
}: Readonly<{ 
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="bg-black text-white min-h-screen">
        <ConditionalTopNav />
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
