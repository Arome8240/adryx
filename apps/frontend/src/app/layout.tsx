import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Adryx — Internet advertising, settled in stablecoins",
  description:
    "Adryx is an ad network for the open web. Publishers earn in USDC for every verified impression. Advertisers spend with full on-chain transparency.",
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
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
