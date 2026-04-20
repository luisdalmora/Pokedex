import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PokéHub | A Enciclopédia Pokémon Profissional",
  description: "A Pokédex mais completa e profissional, baseada no padrão Pokémon Database com artes oficiais e dados em tempo real.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${outfit.className} bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-rose-500/30`}>
        <Navbar />
        <main className="min-h-screen pt-20 lg:pt-0">
          {children}
        </main>
      </body>
    </html>
  );
}
