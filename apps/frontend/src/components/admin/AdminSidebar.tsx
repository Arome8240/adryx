"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { URLS, navigateTo, isNavActive } from "@/lib/urls";
import {
  Home2,
  People,
  Chart,
  LogoutCurve,
  Shield,
} from "iconsax-react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { label: "Overview",  href: URLS.adminDashboard, icon: Home2,   color: "#EBFF45" },
  { label: "Users",     href: URLS.adminUsers,     icon: People,  color: "#EBFF45" },
  { label: "Campaigns", href: URLS.adminCampaigns, icon: Chart,   color: "#3b82f6" },
];

function getInitial(name: string) {
  return name?.charAt(0)?.toUpperCase() ?? "A";
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigateTo(URLS.adminLogin);
  }

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 min-h-screen bg-[#0a0a0f] border-r border-white/8">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/8">
        <Link href={URLS.adminDashboard} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#EBFF45] flex items-center justify-center shrink-0">
            <Shield size={16} color="#0e0e00" variant="Bold" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight block">Adryx</span>
            <span className="text-[10px] text-white/40 uppercase tracking-wider">Super Admin</span>
          </div>
        </Link>
      </div>

      {/* User info */}
      {user && (
        <div className="px-4 py-3 border-b border-white/8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#EBFF45] flex items-center justify-center text-xs font-bold text-[#0e0e00] shrink-0">
            {getInitial(user.name)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            <span className="text-[10px] text-[#EBFF45] uppercase tracking-wider">Admin</span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        <p className="px-3 mb-2 text-[10px] font-semibold text-white/30 uppercase tracking-widest">
          Management
        </p>
        {navItems.map((item) => {
          const active = isNavActive(pathname, item.href);
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
              <Icon size={20} color={active ? "#EBFF45" : item.color} variant={active ? "Bold" : "Linear"} />
              {item.label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#EBFF45]" />}
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
