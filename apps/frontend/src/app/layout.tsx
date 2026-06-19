import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";
import { AuthInitializer } from "@/components/providers/AuthInitializer";
import { ToastProvider } from "@/components/ui/toast";

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

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Adryx — Internet advertising, settled in stablecoins",
  description:
    "Adryx is an ad network for the open web. Publishers earn in USDC for every verified impression. Advertisers spend with full on-chain transparency.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-icon.png",
  },
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
    <html lang="en" data-theme="dark" className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} ${manrope.variable}`}>
      <body>
        <ToastProvider>
          <AuthInitializer />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
