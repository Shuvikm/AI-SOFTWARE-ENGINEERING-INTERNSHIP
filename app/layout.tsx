import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OneAtlas — AI Model Discovery & Intelligence Platform",
  description: "Discover, explore, compare, and benchmark frontier AI models, providers, and research laboratories.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased" data-scroll-behavior="smooth">
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <body className="min-h-full flex flex-col bg-[#0d0b04] text-[#fffbeb] font-mono selection:bg-amber-500/30 selection:text-amber-100 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
