import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: "Adryx — Decentralized Ad Network on Solana",
  description:
    "Monetize your app without limits. The decentralized advertising network powered by Solana.",
  other: {
    "talentapp:project_verification":
      "619fee09dfcfd401865900e9122b0d1b8892a462a15fd3cfc0c21277911676989f175755858b6020b006b710f3c1fc8bda9c703e9f99ed83bd7845d67ccbb046",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
