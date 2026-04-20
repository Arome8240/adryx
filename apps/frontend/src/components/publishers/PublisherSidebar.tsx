"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home2,
  Global,
  Code1,
  DollarCircle,
  PresentionChart,
  Setting2,
  Book1,
  LogoutCurve,
} from "iconsax-react";
import { useAuth } from "@/hooks/useAuth";

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

function getInitial(name: string) {
  return name?.charAt(0)?.toUpperCase() ?? "?";
}

export default function PublisherSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 min-h-screen bg-[#0d0d1a] border-r border-white/8">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#4ade80] to-[#22d3ee] flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <div>
            <span className="font-bold text-base tracking-tight block">
              Adryx
            </span>
            <span className="text-[10px] text-white/40 uppercase tracking-wider">
              Publisher
            </span>
          </div>
        </Link>
      </div>

      {/* User info */}
      {user && (
        <div className="px-4 py-3 border-b border-white/8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#4ade80] to-[#22d3ee] flex items-center justify-center text-xs font-bold text-white shrink-0">
            {getInitial(user.name)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user.name}
            </p>
            <span className="text-[10px] text-[#4ade80] capitalize">
              {user.role}
            </span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        <p className="px-3 mb-2 text-[10px] font-semibold text-white/30 uppercase tracking-widest">
          Menu
        </p>
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-[#4ade80]/15 text-[#4ade80]"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon
                size={20}
                color={active ? "#4ade80" : item.color}
                variant={active ? "Bold" : "Linear"}
              />
              {item.label}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/8">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-[#f87171] hover:bg-[#f87171]/10 transition-all"
        >
          <LogoutCurve size={20} color="currentColor" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
