import type { Metadata } from "next";
import "./globals.css";
import BGMPlayer from "./components/BGMPlayer";

export const metadata: Metadata = {
  title: "Jirawish Portfolio - RPG Edition",
  description: "Minecraft & RPG themed portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="bg-[#050814] text-white relative min-h-screen">
        <BGMPlayer />
        {children}
      </body>
    </html>
  );
}