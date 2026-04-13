"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

const navItems = [
  { label: "Overview", href: "/publishers", icon: <Home2 size={20} />, color: "#4ade80" },
  {
    label: "Sites & Apps",
    href: "/publishers/sites",
    icon: <Global size={20} />,
    color: "#a855f7",
  },
  {
    label: "Ad Placements",
    href: "/publishers/placements",
    icon: <Code1 size={20} />,
    color: "#22d3ee",
  },
  {
    label: "Earnings",
    href: "/publishers/earnings",
    icon: <DollarCircle size={20} />,
    color: "#4ade80",
  },
  {
    label: "Analytics",
    href: "/publishers/analytics",
    icon: <PresentionChart size={20} />,
    color: "#f7931a",
  },
  {
    label: "Integration",
    href: "/publishers/integrate",
    icon: <Book1 size={20} />,
    color: "#22d3ee",
  },
  {
    label: "Settings",
    href: "/publishers/settings",
    icon: <Setting2 size={20} />,
    color: "#a855f7",
  },
];

export default function PublisherSidebar() {
  const pathname = usePathname();

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

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        <p className="px-3 mb-2 text-[10px] font-semibold text-white/30 uppercase tracking-widest">
          Menu
        </p>
        {navItems.map((item) => {
          const active = pathname === item.href;
          const IconComponent = item.icon.type;
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
              <IconComponent
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
