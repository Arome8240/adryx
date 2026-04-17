'use client';

import { WalletProvider } from "@/components/providers/WalletProvider";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WalletProvider>{children}</WalletProvider>;
}
