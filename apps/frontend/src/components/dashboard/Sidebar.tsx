"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home2,
  Chart,
  PresentionChart,
  EmptyWallet,
  LogoutCurve,
  Setting2,
} from "iconsax-react";
import { URLS, isNavActive } from "@/lib/urls";

const navItems = [
  {
    label: "Overview",
    href: URLS.dashboard,
    icon: (active: boolean) => (
      <Home2 size={20} color={active ? "#EBFF45" : "#6366f1"} />
    ),
  },
  {
    label: "Campaigns",
    href: URLS.dashboardCampaigns,
    icon: (active: boolean) => (
      <Chart size={20} color={active ? "#EBFF45" : "#a855f7"} />
    ),
  },
  {
    label: "Analytics",
    href: URLS.dashboardAnalytics,
    icon: (active: boolean) => (
      <PresentionChart size={20} color={active ? "#EBFF45" : "#3b82f6"} />
    ),
  },
  {
    label: "Wallet",
    href: URLS.dashboardWallet,
    icon: (active: boolean) => (
      <EmptyWallet size={20} color={active ? "#EBFF45" : "#f59e0b"} />
    ),
  },
  {
    label: "Settings",
    href: URLS.dashboardSettings,
    icon: (active: boolean) => (
      <Setting2 size={20} color={active ? "#EBFF45" : "#6b7280"} />
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 min-h-screen bg-[#0d0d1a] border-r border-white/8">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/8">
        <Link href={URLS.home} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#EBFF45] to-[#a0f045] flex items-center justify-center">
            <span className="text-[#0e0e00] font-bold text-sm">A</span>
          </div>
          <span className="font-bold text-base tracking-tight">Adryx</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        <p className="px-3 mb-2 text-[10px] font-semibold text-white/30 uppercase tracking-widest">
          Menu
        </p>
        {navItems.map((item) => {
          const active = isNavActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-[#EBFF45]/12 text-[#EBFF45]"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{item.icon(active)}</span>
              {item.label}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#EBFF45]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/8">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          <LogoutCurve size={20} color="#f87171" />
          <span>Back to Site</span>
        </Link>
      </div>
    </aside>
  );
}
