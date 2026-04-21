"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  { label: "Overview", href: "/dashboard", icon: <Home2 size={18} color="#a1a1aa" /> },
  {
    label: "Campaigns",
    href: "/dashboard/campaigns",
    icon: <Chart size={18} color="#a1a1aa" />,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: <PresentionChart size={18} color="#a1a1aa" />,
  },
  {
    label: "Wallet",
    href: "/dashboard/wallet",
    icon: <EmptyWallet size={18} color="#a1a1aa" />,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: <Setting2 size={18} color="#a1a1aa" />,
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
  const router = useRouter();
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
    router.push("/login");
  }

  function handleCopyWallet() {
    if (!user?.walletAddress) return;
    navigator.clipboard.writeText(user.walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 bg-bg-secondary/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-text-secondary hover:text-text-primary transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <HambergerMenu size={20} color="#a1a1aa" />
          </button>
          <h1 className="heading-4">
            {pageTitles[pathname] ?? "Dashboard"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-8 h-8 rounded-md border border-border flex items-center justify-center text-text-tertiary hover:text-text-primary hover:border-border-hover transition-all duration-200"
            aria-label="Search"
          >
            <SearchNormal1 size={14} color="#a1a1aa" />
          </button>
          <kbd className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-md border border-border label-xs text-text-tertiary font-mono select-none">
            ⌘K
          </kbd>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setNotifOpen((v) => !v);
                setProfileOpen(false);
              }}
              className="relative w-8 h-8 rounded-md border border-border flex items-center justify-center text-text-tertiary hover:text-text-primary hover:border-border-hover transition-all duration-200"
              aria-label="Notifications"
            >
              <Notification size={14} color="#f97316" />
              {notifCount > 0 && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
            <NotificationsPanel
              open={notifOpen}
              onClose={() => setNotifOpen(false)}
            />
          </div>

          <div
            className="relative pl-2 border-l border-border"
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
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-xs font-semibold text-white">
                {user ? getInitial(user.name) : "?"}
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="label-sm text-text-primary leading-tight max-w-[120px] truncate">
                  {user?.name ?? "Loading..."}
                </span>
                <span className="label-xs text-text-tertiary capitalize leading-tight">
                  {user?.role ?? ""}
                </span>
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 rounded-lg bg-bg-tertiary border border-border shadow-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-sm font-semibold text-white shrink-0">
                      {user ? getInitial(user.name) : "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="label-sm text-text-primary truncate">
                        {user?.name}
                      </p>
                      {user?.email && (
                        <p className="label-xs text-text-tertiary truncate">
                          {user.email}
                        </p>
                      )}
                      <span className="inline-block mt-1 badge badge-primary">
                        {user?.role}
                      </span>
                    </div>
                  </div>

                  {user?.walletAddress && (
                    <button
                      onClick={handleCopyWallet}
                      className="mt-2 w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-md bg-bg-secondary hover:bg-bg-primary transition-colors duration-200"
                    >
                      <span className="label-xs text-text-secondary font-mono">
                        {truncateWallet(user.walletAddress)}
                      </span>
                      <Copy
                        size={12}
                        color={copied ? "#22c55e" : "#a1a1aa"}
                      />
                    </button>
                  )}
                </div>

                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md body-sm text-text-secondary hover:text-error-500 hover:bg-error-500/10 transition-all duration-200"
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
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-bg-secondary border-r border-border flex flex-col">
            <div className="px-4 py-4 border-b border-border flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="font-semibold text-base">Adryx</span>
              </Link>
              <button onClick={() => setMobileOpen(false)}>
                <CloseCircle size={20} color="#ef4444" />
              </button>
            </div>

            {user && (
              <div className="px-4 py-3 border-b border-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-semibold text-white shrink-0">
                  {getInitial(user.name)}
                </div>
                <div className="min-w-0">
                  <p className="label-sm text-text-primary truncate">
                    {user.name}
                  </p>
                  <span className="label-xs text-primary capitalize">
                    {user.role}
                  </span>
                </div>
              </div>
            )}

            <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                    }`}
                  >
                    <span>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="px-2 py-3 border-t border-border">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-text-tertiary hover:text-error-500 hover:bg-error-500/10 transition-all duration-200"
              >
                <LogoutCurve size={18} color="currentColor" />
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
