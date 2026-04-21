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

const navItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: (active: boolean) => (
      <Home2 size={18} color={active ? "#f97316" : "#a1a1aa"} variant={active ? "Bold" : "Linear"} />
    ),
  },
  {
    label: "Campaigns",
    href: "/dashboard/campaigns",
    icon: (active: boolean) => (
      <Chart size={18} color={active ? "#f97316" : "#a1a1aa"} variant={active ? "Bold" : "Linear"} />
    ),
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: (active: boolean) => (
      <PresentionChart size={18} color={active ? "#f97316" : "#a1a1aa"} variant={active ? "Bold" : "Linear"} />
    ),
  },
  {
    label: "Wallet",
    href: "/dashboard/wallet",
    icon: (active: boolean) => (
      <EmptyWallet size={18} color={active ? "#f97316" : "#a1a1aa"} variant={active ? "Bold" : "Linear"} />
    ),
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: (active: boolean) => (
      <Setting2 size={18} color={active ? "#f97316" : "#a1a1aa"} variant={active ? "Bold" : "Linear"} />
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 min-h-screen bg-bg-secondary border-r border-border">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-semibold text-base">Adryx</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5">
        <p className="px-3 mb-1 label-xs text-text-tertiary">
          Menu
        </p>
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
              }`}
            >
              <span>{item.icon(active)}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 border-t border-border">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-all duration-200"
        >
          <LogoutCurve size={18} color="#ef4444" variant="Linear" />
          <span>Back to Site</span>
        </Link>
      </div>
    </aside>
  );
}
