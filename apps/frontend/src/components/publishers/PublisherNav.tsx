"use client";
import { Notification, EmptyWallet, HambergerMenu } from "iconsax-react";

export default function PublisherNav() {
  return (
    <header className="h-16 border-b border-white/8 bg-[#0d0d1a]/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Mobile menu */}
      <button className="md:hidden p-2 hover:bg-white/5 rounded-lg transition-colors">
        <HambergerMenu size={20} color="#4ade80" />
      </button>

      {/* Search / Breadcrumb */}
      <div className="hidden md:block">
        <p className="text-sm text-white/40">
          Welcome back, <span className="text-white font-medium">Publisher</span>
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Wallet */}
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/8 transition-colors border border-white/8">
          <EmptyWallet size={18} color="#4ade80" variant="Bold" />
          <span className="text-sm font-medium text-white hidden sm:block">
            0.00 SOL
          </span>
        </button>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
          <Notification size={20} color="#a855f7" variant="Bold" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#4ade80] rounded-full" />
        </button>

        {/* Avatar */}
        <button className="w-8 h-8 rounded-lg bg-linear-to-br from-[#4ade80] to-[#22d3ee] flex items-center justify-center text-white text-sm font-bold">
          P
        </button>
      </div>
    </header>
  );
}
