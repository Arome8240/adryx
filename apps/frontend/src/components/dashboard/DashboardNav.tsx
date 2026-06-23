"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { URLS, navigateTo } from "@/lib/urls";
import {
  Notification,
  SearchNormal1,
  Home2,
  Chart,
  PresentionChart,
  EmptyWallet,
  HambergerMenu,
  CloseCircle,
  LogoutCurve,
  Copy,
  Setting2,
} from "iconsax-react";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import SearchPanel from "./SearchPanel";
import NotificationsPanel from "./NotificationsPanel";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: <Home2 size={20} /> },
  {
    label: "Campaigns",
    href: "/dashboard/campaigns",
    icon: <Chart size={20} />,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: <PresentionChart size={20} />,
  },
  {
    label: "Wallet",
    href: "/dashboard/wallet",
    icon: <EmptyWallet size={20} />,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: <Setting2 size={20} />,
  },
];

const pageTitles: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/campaigns": "Campaigns",
  "/dashboard/analytics": "Analytics",
  "/dashboard/wallet": "Wallet",
  "/dashboard/settings": "Settings",
};

function truncateWallet(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

function getInitial(name: string) {
  return name?.charAt(0)?.toUpperCase() ?? "?";
}

export default function DashboardNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { count: notifCount } = useNotifications();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ⌘K / Ctrl+K to open search
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  function handleLogout() {
    logout();
    navigateTo(URLS.login);
  }

  function handleCopyWallet() {
    if (!user?.walletAddress) return;
    navigator.clipboard.writeText(user.walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-[#0d0d1a]/80 backdrop-blur-md border-b border-white/8">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-white/60 hover:text-white"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <HambergerMenu size={22} color="#f0f0f5" />
          </button>
          <h1 className="text-base font-semibold text-white">
            {pageTitles[pathname] ?? "Dashboard"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
            aria-label="Search"
          >
            <SearchNormal1 size={16} color="#a855f7" />
          </button>
          <kbd className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-lg border border-white/10 text-[10px] text-white/25 font-mono select-none">
            ⌘K
          </kbd>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setNotifOpen((v) => !v);
                setProfileOpen(false);
              }}
              className="relative w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              aria-label="Notifications"
            >
              <Notification size={16} color="#EBFF45" />
              {notifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EBFF45]" />
              )}
            </button>
            <NotificationsPanel
              open={notifOpen}
              onClose={() => setNotifOpen(false)}
            />
          </div>

          <div
            className="relative pl-2 border-l border-white/10"
            ref={dropdownRef}
          >
            <button
              onClick={() => {
                setProfileOpen((v) => !v);
                setNotifOpen(false);
              }}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              aria-label="Profile menu"
            >
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#EBFF45] to-[#a0f045] flex items-center justify-center text-xs font-bold text-[#0e0e00]">
                {user ? getInitial(user.name) : "?"}
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-medium text-white/90 leading-tight max-w-[120px] truncate">
                  {user?.name ?? "Loading..."}
                </span>
                <span className="text-[10px] text-white/40 capitalize leading-tight">
                  {user?.role ?? ""}
                </span>
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl bg-[#13131f] border border-white/10 shadow-xl shadow-black/40 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#EBFF45] to-[#a0f045] flex items-center justify-center text-sm font-bold text-[#0e0e00] shrink-0">
                      {user ? getInitial(user.name) : "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {user?.name}
                      </p>
                      {user?.email && (
                        <p className="text-xs text-white/40 truncate">
                          {user.email}
                        </p>
                      )}
                      <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded-md bg-[#EBFF45]/15 text-[#EBFF45] text-[10px] font-semibold capitalize">
                        {user?.role}
                      </span>
                    </div>
                  </div>

                  {user?.walletAddress && (
                    <button
                      onClick={handleCopyWallet}
                      className="mt-2 w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <span className="text-xs text-white/50 font-mono">
                        {truncateWallet(user.walletAddress)}
                      </span>
                      <Copy
                        size={12}
                        color={copied ? "#4ade80" : "#ffffff80"}
                      />
                    </button>
                  )}
                </div>

                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-white/60 hover:text-[#f87171] hover:bg-[#f87171]/10 transition-all"
                  >
                    <LogoutCurve size={16} color="currentColor" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#0d0d1a] border-r border-white/8 flex flex-col">
            <div className="px-6 py-5 border-b border-white/8 flex items-center justify-between">
              <Link href={URLS.home} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#EBFF45] to-[#a0f045] flex items-center justify-center">
                  <span className="text-[#0e0e00] font-bold text-sm">A</span>
                </div>
                <span className="font-bold text-base">Adryx</span>
              </Link>
              <button onClick={() => setMobileOpen(false)}>
                <CloseCircle size={22} color="#f87171" />
              </button>
            </div>

            {user && (
              <div className="px-4 py-3 border-b border-white/8 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#EBFF45] to-[#a0f045] flex items-center justify-center text-sm font-bold text-[#0e0e00] shrink-0">
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

            <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "bg-[#EBFF45]/12 text-[#EBFF45]"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span
                      className={active ? "text-[#EBFF45]" : "text-white/40"}
                    >
                      {item.icon}
                    </span>
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

      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
