"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { URLS, navigateTo, isNavActive } from "@/lib/urls";
import { HambergerMenu, CloseCircle, LogoutCurve, Shield, Home2, People, Chart } from "iconsax-react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { label: "Overview",  href: URLS.adminDashboard, icon: Home2,  color: "#EBFF45" },
  { label: "Users",     href: URLS.adminUsers,     icon: People, color: "#a855f7" },
  { label: "Campaigns", href: URLS.adminCampaigns, icon: Chart,  color: "#3b82f6" },
];

const pageTitles = Object.fromEntries(
  navItems.map(({ href, label }) => {
    const path = href.startsWith("http") ? new URL(href).pathname : href;
    return [path || "/", label];
  }),
);

function getInitial(name: string) {
  return name?.charAt(0)?.toUpperCase() ?? "A";
}

export default function AdminNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigateTo(URLS.login);
  }

  return (
    <>
      <header className="h-16 border-b border-white/8 bg-[#0a0a0f]/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <HambergerMenu size={20} color="#a855f7" />
          </button>
          <h1 className="text-base font-semibold text-white">
            {pageTitles[pathname] ?? "Admin"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#a855f7]/10 border border-[#a855f7]/20">
            <Shield size={12} color="#a855f7" variant="Bold" />
            <span className="text-[11px] font-semibold text-[#a855f7] uppercase tracking-wider">Super Admin</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#a855f7] flex items-center justify-center text-xs font-bold text-white">
            {user ? getInitial(user.name) : "A"}
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#0a0a0f] border-r border-white/8 flex flex-col">
            <div className="px-6 py-5 border-b border-white/8 flex items-center justify-between">
              <Link href={URLS.adminDashboard} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#a855f7] flex items-center justify-center shrink-0">
                  <Shield size={16} color="#fff" variant="Bold" />
                </div>
                <span className="font-bold text-base">Adryx Admin</span>
              </Link>
              <button onClick={() => setMobileOpen(false)}>
                <CloseCircle size={22} color="#f87171" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
              {navItems.map((item) => {
                const active = isNavActive(pathname, item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active ? "bg-[#a855f7]/15 text-[#a855f7]" : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon size={20} color={active ? "#a855f7" : item.color} variant={active ? "Bold" : "Linear"} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
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
        </div>
      )}
    </>
  );
}
