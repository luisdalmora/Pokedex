import type { Metadata } from "next";
import { Outfit, Press_Start_2P } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: '--font-outfit' 
});
const pressStart2P = Press_Start_2P({ 
  weight: "400", 
  subsets: ["latin"],
  variable: '--font-pixel' 
});

export const metadata: Metadata = {
  title: "Pokédex Kanto | Premium Device Edition",
  description: "A sua Enciclopédia Pokémon, inspirada no design clássico da região de Kanto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${outfit.variable} ${pressStart2P.variable} font-sans bg-[#1e1e1e] text-white overflow-hidden w-screen h-screen flex justify-center items-center`}>
        {children}
      </body>
    </html>
  );
}
