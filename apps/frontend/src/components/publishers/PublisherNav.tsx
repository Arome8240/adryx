"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Notification,
  EmptyWallet,
  HambergerMenu,
  CloseCircle,
  Home2,
  Global,
  Code1,
  DollarCircle,
  PresentionChart,
  Book1,
  Setting2,
  LogoutCurve,
} from "iconsax-react";

const navItems = [
  { label: "Overview", href: "/publishers", icon: Home2, color: "#4ade80" },
  {
    label: "Sites & Apps",
    href: "/publishers/sites",
    icon: Global,
    color: "#a855f7",
  },
  {
    label: "Ad Placements",
    href: "/publishers/placements",
    icon: Code1,
    color: "#22d3ee",
  },
  {
    label: "Earnings",
    href: "/publishers/earnings",
    icon: DollarCircle,
    color: "#4ade80",
  },
  {
    label: "Analytics",
    href: "/publishers/analytics",
    icon: PresentionChart,
    color: "#f7931a",
  },
  {
    label: "Integration",
    href: "/publishers/integrate",
    icon: Book1,
    color: "#22d3ee",
  },
  {
    label: "Settings",
    href: "/publishers/settings",
    icon: Setting2,
    color: "#a855f7",
  },
];

const pageTitles: Record<string, string> = {
  "/publishers": "Overview",
  "/publishers/sites": "Sites & Apps",
  "/publishers/placements": "Ad Placements",
  "/publishers/earnings": "Earnings",
  "/publishers/analytics": "Analytics",
  "/publishers/integrate": "Integration",
  "/publishers/settings": "Settings",
};

export default function PublisherNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="h-16 border-b border-white/8 bg-[#0d0d1a]/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-10">
        {/* Mobile menu + Page title */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <HambergerMenu size={20} color="#4ade80" />
          </button>

          <div className="hidden md:block">
            <h1 className="text-base font-semibold text-white">
              {pageTitles[pathname] ?? "Publisher Dashboard"}
            </h1>
          </div>
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

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#0d0d1a] border-r border-white/8 flex flex-col">
            <div className="px-6 py-5 border-b border-white/8 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#4ade80] to-[#22d3ee] flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <div>
                  <span className="font-bold text-base block">Adryx</span>
                  <span className="text-[10px] text-white/40 uppercase tracking-wider">
                    Publisher
                  </span>
                </div>
              </Link>
              <button onClick={() => setMobileOpen(false)}>
                <CloseCircle size={22} color="#f87171" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
              <p className="px-3 mb-2 text-[10px] font-semibold text-white/30 uppercase tracking-widest">
                Menu
              </p>
              {navItems.map((item) => {
                const active = pathname === item.href;
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "bg-[#4ade80]/15 text-[#4ade80]"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <IconComponent
                      size={20}
                      color={active ? "#4ade80" : item.color}
                      variant={active ? "Bold" : "Linear"}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="px-3 py-4 border-t border-white/8">
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-all"
              >
                <LogoutCurve size={20} color="#f87171" />
                Back to Site
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
