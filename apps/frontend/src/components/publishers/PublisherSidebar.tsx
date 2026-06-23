"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { URLS, navigateTo } from "@/lib/urls";
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
  { label: "Overview", href: "/publishers", icon: Home2, color: "#EBFF45" },
  {
    label: "Sites & Apps",
    href: "/publishers/sites",
    icon: Global,
    color: "#EBFF45",
  },
  {
    label: "Ad Placements",
    href: "/publishers/placements",
    icon: Code1,
    color: "#d4e63c",
  },
  {
    label: "Earnings",
    href: "/publishers/earnings",
    icon: DollarCircle,
    color: "#EBFF45",
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
    color: "#d4e63c",
  },
  {
    label: "Settings",
    href: "/publishers/settings",
    icon: Setting2,
    color: "#EBFF45",
  },
];

function getInitial(name: string) {
  return name?.charAt(0)?.toUpperCase() ?? "?";
}

export default function PublisherSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigateTo(URLS.login);
  }

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 min-h-screen bg-[#0f0f13] border-r border-white/8">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/8">
        <Link href={URLS.home} className="flex items-center gap-2.5">
          <div style={{width:32,height:32,borderRadius:8,background:'#EBFF45',position:'relative',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <span style={{fontSize:14,fontWeight:900,color:'#08080a',letterSpacing:'-0.5px'}}>A</span>
            <span style={{position:'absolute',bottom:3,right:3,width:5,height:5,borderRadius:'50%',background:'#08080a'}} />
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
          <div className="w-8 h-8 rounded-full bg-[#EBFF45] flex items-center justify-center text-xs font-bold text-[#08080a] shrink-0">
            {getInitial(user.name)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user.name}
            </p>
            <span className="text-[10px] text-[#EBFF45] capitalize">
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
                  ? "bg-[#EBFF45]/15 text-[#EBFF45]"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon
                size={20}
                color={active ? "#EBFF45" : item.color}
                variant={active ? "Bold" : "Linear"}
              />
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
