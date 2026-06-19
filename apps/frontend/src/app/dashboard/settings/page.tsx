"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/toast";
import { useStellarWallet } from "@/components/providers/WalletProvider";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api-client";
import WalletButton from "@/components/dashboard/WalletButton";
import {
  User,
  Lock,
  Notification,
  EmptyWallet,
  Global,
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

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-[#0d0d1a] border border-white/8 p-5 space-y-5">
      <div className="flex items-center gap-2 pb-1 border-b border-white/8">
        {icon}
        <p className="text-sm font-semibold text-white">{title}</p>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { user, loadUser } = useAuth();
  const { address: publicKey } = useStellarWallet();

  const toast = useToast();

  // Profile form
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    timezone: "UTC",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);

  // Notification prefs (stored in localStorage)
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
      await apiClient.updateProfile({
        name: profile.name,
        email: profile.email,
        timezone: profile.timezone,
      });
      await loadUser();
      toast("Profile updated");
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (passwords.next !== passwords.confirm)
      return toast("Passwords don't match", 'error');
    if (passwords.next.length < 8)
      return toast("Password must be at least 8 characters", 'error');
    setSavingPassword(true);
    try {
      await apiClient.changePassword(passwords.current, passwords.next);
      setPasswords({ current: "", next: "", confirm: "" });
      toast("Password changed");
    } catch (err: any) {
      toast(err.message, 'error');
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
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <p className="text-sm text-white/40 mt-0.5">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile */}
      <Section title="Profile" icon={<User size={16} color="#a855f7" />}>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
              Name
            </label>
            <input
              value={profile.name}
              onChange={(e) =>
                setProfile((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="Your name"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile((p) => ({ ...p, email: e.target.value }))
              }
              placeholder="you@example.com"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
              <span className="flex items-center gap-1.5">
                <Global size={12} color="#ffffff40" /> Timezone
              </span>
            </label>
            <select
              value={profile.timezone}
              onChange={(e) =>
                setProfile((p) => ({ ...p, timezone: e.target.value }))
              }
              className={`${inputCls} cursor-pointer`}
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingProfile}
              className="px-5 py-2.5 rounded-xl bg-[#EBFF45] hover:bg-[#EBFF45]/90 text-[#0e0e00] text-sm font-bold disabled:opacity-40 transition-colors"
            >
              {savingProfile ? "Saving…" : "Save Profile"}
            </button>
          </div>
        </form>
      </Section>

      {/* Password */}
      <Section
        title="Change Password"
        icon={<Lock size={16} color="#3b82f6" />}
      >
        {!(user as any)?.password && !user?.email ? (
          <p className="text-sm text-white/40">
            Your account uses wallet login — no password is set.
          </p>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-4">
            {[
              { label: "Current Password", key: "current" },
              { label: "New Password", key: "next" },
              { label: "Confirm New Password", key: "confirm" },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                  {label}
                </label>
                <input
                  type="password"
                  value={(passwords as any)[key]}
                  onChange={(e) =>
                    setPasswords((p) => ({ ...p, [key]: e.target.value }))
                  }
                  placeholder="••••••••"
                  className={inputCls}
                />
              </div>
            ))}
            <div className="flex justify-end">
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
      </Section>

      {/* Notifications */}
      <Section
        title="Notification Preferences"
        icon={<Notification size={16} color="#EBFF45" />}
      >
        <div>
          <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
            Budget alert threshold
          </label>
          <p className="text-xs text-white/30 mb-3">
            Get notified when a campaign has spent this percentage of its
            budget.
          </p>
          <div className="flex flex-wrap gap-2">
            {BUDGET_THRESHOLDS.map((t) => (
              <button
                key={t}
                onClick={() => handleSaveBudgetThreshold(t)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  budgetThreshold === t
                    ? "bg-[#EBFF45]/15 text-[#EBFF45] border border-[#EBFF45]/30"
                    : "bg-white/5 text-white/50 border border-white/8 hover:border-white/20"
                }`}
              >
                {t}%
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Wallet */}
      <Section
        title="Connected Wallet"
        icon={<EmptyWallet size={16} color="#4ade80" />}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            {publicKey ? (
              <>
                <p className="text-xs text-white/40 mb-1">Connected wallet</p>
                <p className="text-sm font-mono text-white/70 break-all">
                  {publicKey}
                </p>
              </>
            ) : (
              <p className="text-sm text-white/40">No wallet connected</p>
            )}
          </div>
          <WalletButton />
        </div>
        {user?.walletAddress &&
          user.walletAddress !== publicKey?.toString() && (
            <p className="text-xs text-yellow-400/70 mt-2">
              Your profile wallet ({user.walletAddress.slice(0, 8)}…) differs
              from the currently connected wallet.
            </p>
          )}
      </Section>
    </div>
  );
}
