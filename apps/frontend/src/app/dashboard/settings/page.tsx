"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/toast";
import { useStellarWallet } from "@/components/providers/WalletProvider";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api-client";
import WalletButton from "@/components/dashboard/WalletButton";
import { Select } from "@/components/ui/select";
import {
  User,
  Lock,
  Notification,
  EmptyWallet,
  Global,
  TickCircle,
} from "iconsax-react";

const inputCls =
  "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 outline-none focus:border-[#EBFF45]/40 transition-colors";

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const BUDGET_THRESHOLDS = [50, 70, 80, 85, 90, 95];

type TabId = "profile" | "security" | "notifications" | "wallet";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  {
    id: "profile",
    label: "Profile",
    icon: <User size={15} color="currentColor" />,
  },
  {
    id: "security",
    label: "Security",
    icon: <Lock size={15} color="currentColor" />,
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: <Notification size={15} color="currentColor" />,
  },
  {
    id: "wallet",
    label: "Wallet",
    icon: <EmptyWallet size={15} color="currentColor" />,
  },
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
      {children}
    </label>
  );
}

export default function SettingsPage() {
  const { user, loadUser } = useAuth();
  const { address: publicKey } = useStellarWallet();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<TabId>("profile");

  // Profile form
  const [profile, setProfile] = useState({ name: "", email: "", timezone: "UTC" });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [savingPassword, setSavingPassword] = useState(false);

  // Notification prefs
  const [budgetThreshold, setBudgetThreshold] = useState(85);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name ?? "",
        email: user.email ?? "",
        timezone: (user as any).timezone ?? "UTC",
      });
    }
    const saved = localStorage.getItem("adryx_budget_threshold");
    if (saved) setBudgetThreshold(parseInt(saved));
  }, [user]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await apiClient.updateProfile({ name: profile.name, email: profile.email, timezone: profile.timezone });
      await loadUser();
      toast("Profile updated");
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (passwords.next !== passwords.confirm)
      return toast("Passwords don't match", "error");
    if (passwords.next.length < 8)
      return toast("Password must be at least 8 characters", "error");
    setSavingPassword(true);
    try {
      await apiClient.changePassword(passwords.current, passwords.next);
      setPasswords({ current: "", next: "", confirm: "" });
      toast("Password changed");
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setSavingPassword(false);
    }
  }

  function handleSaveBudgetThreshold(val: number) {
    setBudgetThreshold(val);
    localStorage.setItem("adryx_budget_threshold", String(val));
    toast("Notification preference saved");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <p className="text-sm text-white/40 mt-0.5">
          Manage your account and preferences
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/4 border border-white/8">
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-[#EBFF45]/12 text-[#EBFF45]"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="rounded-2xl bg-[#0d0d1a] border border-white/8 p-6">
        {/* Profile tab */}
        {activeTab === "profile" && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-4 border-b border-white/8">
              <User size={16} color="#a855f7" />
              <p className="text-sm font-semibold text-white">Profile</p>
            </div>

            {/* Avatar row */}
            <div className="flex items-center gap-4 pb-5 border-b border-white/8">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#EBFF45] to-[#a0f045] flex items-center justify-center text-xl font-bold text-[#0e0e00] shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() ?? "?"}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{user?.name ?? "—"}</p>
                <p className="text-xs text-white/40 mt-0.5">{user?.email ?? ""}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-[#EBFF45]/12 text-[#EBFF45] text-[10px] font-semibold capitalize">
                  {user?.role ?? "advertiser"}
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <FieldLabel>Name</FieldLabel>
                <input
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Your name"
                  className={inputCls}
                />
              </div>
              <div>
                <FieldLabel>Email</FieldLabel>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com"
                  className={inputCls}
                />
              </div>
              <div>
                <FieldLabel>
                  <span className="flex items-center gap-1.5">
                    <Global size={12} color="#ffffff40" /> Timezone
                  </span>
                </FieldLabel>
                <Select
                  value={profile.timezone}
                  onChange={(v) => setProfile((p) => ({ ...p, timezone: v }))}
                  options={TIMEZONES.map((tz) => ({ value: tz, label: tz }))}
                />
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2.5 rounded-xl bg-[#EBFF45] hover:bg-[#EBFF45]/90 text-[#0e0e00] text-sm font-bold disabled:opacity-40 transition-colors"
                >
                  {savingProfile ? "Saving…" : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Security tab */}
        {activeTab === "security" && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-4 border-b border-white/8">
              <Lock size={16} color="#3b82f6" />
              <p className="text-sm font-semibold text-white">Security</p>
            </div>

            {!(user as any)?.password && !user?.email ? (
              <div className="flex items-start gap-3 px-4 py-4 rounded-xl bg-white/4 border border-white/8">
                <Lock size={16} color="#ffffff30" className="mt-0.5 shrink-0" />
                <p className="text-sm text-white/40">
                  Your account uses wallet login — no password is set.
                </p>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4">
                {[
                  { label: "Current Password", key: "current" },
                  { label: "New Password", key: "next" },
                  { label: "Confirm New Password", key: "confirm" },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <FieldLabel>{label}</FieldLabel>
                    <input
                      type="password"
                      value={(passwords as any)[key]}
                      onChange={(e) => setPasswords((p) => ({ ...p, [key]: e.target.value }))}
                      placeholder="••••••••"
                      className={inputCls}
                    />
                  </div>
                ))}
                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="px-5 py-2.5 rounded-xl bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white text-sm font-semibold disabled:opacity-40 transition-colors"
                  >
                    {savingPassword ? "Updating…" : "Update Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Notifications tab */}
        {activeTab === "notifications" && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-4 border-b border-white/8">
              <Notification size={16} color="#EBFF45" />
              <p className="text-sm font-semibold text-white">Notifications</p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-white/80 mb-1">
                  Budget alert threshold
                </p>
                <p className="text-xs text-white/30 mb-4">
                  Get notified when a campaign has spent this percentage of its budget.
                </p>
                <div className="flex flex-wrap gap-2">
                  {BUDGET_THRESHOLDS.map((t) => (
                    <button
                      key={t}
                      onClick={() => handleSaveBudgetThreshold(t)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                        budgetThreshold === t
                          ? "bg-[#EBFF45]/15 text-[#EBFF45] border border-[#EBFF45]/30"
                          : "bg-white/5 text-white/50 border border-white/8 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {budgetThreshold === t && (
                        <TickCircle size={13} color="currentColor" variant="Bold" />
                      )}
                      {t}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 px-4 py-4 rounded-xl bg-white/3 border border-white/8">
                <p className="text-xs text-white/40 leading-relaxed">
                  When any campaign's spend hits <span className="text-[#EBFF45] font-semibold">{budgetThreshold}%</span> of its budget, you'll see an alert in the dashboard and budget health indicator will turn red.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Wallet tab */}
        {activeTab === "wallet" && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-4 border-b border-white/8">
              <EmptyWallet size={16} color="#4ade80" />
              <p className="text-sm font-semibold text-white">Connected Wallet</p>
            </div>

            <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white/3 border border-white/8">
              <div className="min-w-0">
                {publicKey ? (
                  <>
                    <p className="text-xs text-white/40 mb-1">Connected address</p>
                    <p className="text-sm font-mono text-white/70 break-all">
                      {publicKey}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-white/60">No wallet connected</p>
                    <p className="text-xs text-white/30 mt-0.5">Connect your Stellar wallet to fund campaigns</p>
                  </>
                )}
              </div>
              <div className="shrink-0">
                <WalletButton />
              </div>
            </div>

            {publicKey && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#4ade80]/8 border border-[#4ade80]/20">
                <TickCircle size={14} color="#4ade80" variant="Bold" />
                <p className="text-xs text-[#4ade80] font-medium">Wallet connected</p>
              </div>
            )}

            {user?.walletAddress && user.walletAddress !== publicKey?.toString() && (
              <div className="px-4 py-3 rounded-xl bg-yellow-400/8 border border-yellow-400/20">
                <p className="text-xs text-yellow-400/80 leading-relaxed">
                  Your profile wallet ({user.walletAddress.slice(0, 12)}…) differs from the currently connected wallet. Transactions will use the connected wallet.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
