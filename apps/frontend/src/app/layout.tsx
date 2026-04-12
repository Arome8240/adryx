import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "Adryx — Decentralized Ad Network on Solana",
  description:
    "Monetize your app without limits. The decentralized advertising network powered by Solana.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="min-h-screen bg-[#07070f] text-[#f0f0f5] overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
