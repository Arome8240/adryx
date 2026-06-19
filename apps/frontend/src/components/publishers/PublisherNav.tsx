"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Notification,
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
  Copy,
  TickCircle,
} from "iconsax-react";
import { useAuth } from "@/hooks/useAuth";
import {
  usePublisherDashboard,
  usePublisherEarningsBreakdown,
} from "@/hooks/usePublisher";

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

const pageTitles: Record<string, string> = {
  "/publishers": "Overview",
  "/publishers/sites": "Sites & Apps",
  "/publishers/placements": "Ad Placements",
  "/publishers/earnings": "Earnings",
  "/publishers/analytics": "Analytics",
  "/publishers/integrate": "Integration",
  "/publishers/settings": "Settings",
};

// Publisher-specific notification types derived from localStorage prefs
const NOTIF_KEY = "adryx_publisher_notifications";

function getInitial(name: string) {
  return name?.charAt(0)?.toUpperCase() ?? "P";
}

function truncateWallet(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export default function PublisherNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { dashboard } = usePublisherDashboard();
  const { earnings: breakdown } = usePublisherEarningsBreakdown();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setNotifOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
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

  // Read notification prefs from localStorage
  const notifPrefs = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      return JSON.parse(localStorage.getItem(NOTIF_KEY) ?? "null");
    } catch {
      return null;
    }
  }, []);

  // Generate real alerts from live data + preferences
  const alerts = useMemo(() => {
    const items: { color: string; title: string; desc: string }[] = [];

    if (breakdown && breakdown.pendingEarnings > 0 && notifPrefs?.payoutAlert) {
      items.push({
        color: "#EBFF45",
        title: "Earnings ready to claim",
        desc: `$${breakdown.pendingEarnings.toFixed(2)} USDC pending payout`,
      });
    }

    if (notifPrefs?.earningsAlert && dashboard) {
      const ctr = parseFloat(dashboard.ctr);
      if (ctr === 0 && dashboard.impressions > 0) {
        items.push({
          color: "#f87171",
          title: "Zero clicks today",
          desc: `${dashboard.impressions.toLocaleString()} impressions but no clicks — check your creatives`,
        });
      }
    }

    if (notifPrefs?.lowFillRate && dashboard && dashboard.totalPlacements > 0) {
      const fillRate = dashboard.impressions > 0 ? 100 : 0;
      if (fillRate < (notifPrefs.fillRateThreshold ?? 50)) {
        items.push({
          color: "#f87171",
          title: "Low fill rate",
          desc: `Fill rate below ${notifPrefs.fillRateThreshold}% — add more placements`,
        });
      }
    }

    return items;
  }, [breakdown, dashboard, notifPrefs]);

  const activeNotifCount = alerts.length;

  return (
    <>
      <header className="h-16 border-b border-white/8 bg-[#0f0f13]/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
        {/* Mobile menu + page title */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <HambergerMenu size={20} color="#EBFF45" />
          </button>
          <h1 className="text-base font-semibold text-white">
            {pageTitles[pathname] ?? "Publisher Dashboard"}
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setNotifOpen((v) => !v);
                setProfileOpen(false);
              }}
              className="relative w-9 h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 flex items-center justify-center transition-colors"
              aria-label="Notifications"
            >
              <Notification size={16} color="#EBFF45" />
              {activeNotifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EBFF45] rounded-full" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-[#0f0f13] border border-white/10 shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Notification size={14} color="#EBFF45" />
                    <span className="text-sm font-semibold text-white">
                      Notifications
                    </span>
                  </div>
                  <Link
                    href="/publishers/settings"
                    onClick={() => setNotifOpen(false)}
                    className="text-[10px] text-[#EBFF45] hover:text-[#d4e63c] transition-colors"
                  >
                    Manage →
                  </Link>
                </div>
                <div className="p-4 space-y-3">
                  {alerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-4 gap-2">
                      <TickCircle size={24} color="#ffffff20" />
                      <p className="text-xs text-white/30">All caught up</p>
                      <Link
                        href="/publishers/settings"
                        onClick={() => setNotifOpen(false)}
                        className="text-xs text-[#EBFF45] hover:text-[#EBFF45]/80 transition-colors"
                      >
                        Configure alerts →
                      </Link>
                    </div>
                  ) : (
                    alerts.map((alert, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-xl"
                        style={{ backgroundColor: `${alert.color}12` }}
                      >
                        <span
                          className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                          style={{ backgroundColor: alert.color }}
                        />
                        <div>
                          <p className="text-xs font-semibold text-white">
                            {alert.title}
                          </p>
                          <p className="text-xs text-white/40 mt-0.5">
                            {alert.desc}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setProfileOpen((v) => !v);
                setNotifOpen(false);
              }}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              aria-label="Profile menu"
            >
              <div className="w-8 h-8 rounded-full bg-[#EBFF45] flex items-center justify-center text-xs font-bold text-[#08080a]">
                {user ? getInitial(user.name) : "P"}
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-medium text-white/90 leading-tight max-w-[120px] truncate">
                  {user?.name ?? "Publisher"}
                </span>
                <span className="text-[10px] text-white/40 capitalize leading-tight">
                  {user?.role ?? "publisher"}
                </span>
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl bg-[#0f0f13] border border-white/10 shadow-xl shadow-black/40 overflow-hidden z-50">
                {/* User info */}
                <div className="px-4 py-3 border-b border-white/8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#EBFF45] flex items-center justify-center text-sm font-bold text-[#08080a] shrink-0">
                      {user ? getInitial(user.name) : "P"}
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
                      {copied ? (
                        <TickCircle size={12} color="#EBFF45" />
                      ) : (
                        <Copy size={12} color="#ffffff80" />
                      )}
                    </button>
                  )}
                </div>

                {/* Actions */}
                <div className="p-2 space-y-0.5">
                  <Link
                    href="/publishers/settings"
                    onClick={() => setProfileOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <Setting2 size={15} color="currentColor" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-white/60 hover:text-[#f87171] hover:bg-[#f87171]/10 transition-all"
                  >
                    <LogoutCurve size={15} color="currentColor" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#0f0f13] border-r border-white/8 flex flex-col">
            <div className="px-6 py-5 border-b border-white/8 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2.5">
                <div style={{width:32,height:32,borderRadius:8,background:'#EBFF45',position:'relative',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <span style={{fontSize:14,fontWeight:900,color:'#08080a',letterSpacing:'-0.5px'}}>A</span>
                  <span style={{position:'absolute',bottom:3,right:3,width:5,height:5,borderRadius:'50%',background:'#08080a'}} />
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

            {/* Mobile user info */}
            {user && (
              <div className="px-4 py-3 border-b border-white/8 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#EBFF45] flex items-center justify-center text-sm font-bold text-[#08080a] shrink-0">
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
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
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
