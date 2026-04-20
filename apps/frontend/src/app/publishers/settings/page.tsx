"use client";
import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api-client";
import WalletButton from "@/components/dashboard/WalletButton";
import {
  User,
  Lock,
  Notification,
  EmptyWallet,
  TickCircle,
  CloseCircle,
  Global,
  ToggleOff,
  ToggleOn,
} from "iconsax-react";

const inputCls =
  "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 outline-none focus:border-[#4ade80]/50 transition-colors";

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
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

const NOTIF_KEY = "adryx_publisher_notifications";

interface NotifPrefs {
  earningsAlert: boolean;
  earningsThreshold: number;
  payoutAlert: boolean;
  lowFillRate: boolean;
  fillRateThreshold: number;
  newCampaignMatch: boolean;
  weeklyReport: boolean;
}

const DEFAULT_PREFS: NotifPrefs = {
  earningsAlert: true,
  earningsThreshold: 10,
  payoutAlert: true,
  lowFillRate: true,
  fillRateThreshold: 50,
  newCampaignMatch: true,
  weeklyReport: false,
};

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

function Toggle({
  enabled,
  onChange,
  label,
  description,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-white">{label}</p>
        {description && (
          <p className="text-xs text-white/40 mt-0.5">{description}</p>
        )}
      </div>
      <button onClick={() => onChange(!enabled)} className="shrink-0 mt-0.5">
        {enabled ? (
          <ToggleOn size={28} color="#4ade80" variant="Bold" />
        ) : (
          <ToggleOff size={28} color="#ffffff30" variant="Bold" />
        )}
      </button>
    </div>
  );
}

export default function PublisherSettingsPage() {
  const { user, loadUser } = useAuth();
  const { publicKey } = useWallet();
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  // Profile
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    timezone: "UTC",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);

  // Notifications
  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs>(DEFAULT_PREFS);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name ?? "",
        email: user.email ?? "",
        timezone: (user as any).timezone ?? "UTC",
      });
    }
    try {
      const saved = localStorage.getItem(NOTIF_KEY);
      if (saved) setNotifPrefs({ ...DEFAULT_PREFS, ...JSON.parse(saved) });
    } catch {}
  }, [user]);

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  function updateNotif(patch: Partial<NotifPrefs>) {
    setNotifPrefs((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(NOTIF_KEY, JSON.stringify(next));
      return next;
    });
  }

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
      showToast("Profile updated");
    } catch (err: any) {
      showToast(err.message, false);
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (passwords.next !== passwords.confirm)
      return showToast("Passwords don't match", false);
    if (passwords.next.length < 8)
      return showToast("Password must be at least 8 characters", false);
    setSavingPassword(true);
    try {
      await apiClient.changePassword(passwords.current, passwords.next);
      setPasswords({ current: "", next: "", confirm: "" });
      showToast("Password changed");
    } catch (err: any) {
      showToast(err.message, false);
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl text-sm font-medium ${
            toast.ok
              ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-400"
              : "bg-[#f87171]/10 border-[#f87171]/20 text-[#f87171]"
          }`}
        >
          {toast.ok ? (
            <TickCircle size={16} color="currentColor" />
          ) : (
            <CloseCircle size={16} color="currentColor" />
          )}
          {toast.msg}
        </div>
      )}

      <div>
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <p className="text-sm text-white/40 mt-0.5">
          Manage your publisher account
        </p>
      </div>

      {/* Profile */}
      <Section title="Profile" icon={<User size={16} color="#4ade80" />}>
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
              className="px-5 py-2.5 rounded-xl bg-[#4ade80] hover:bg-[#4ade80]/90 text-black text-sm font-bold disabled:opacity-40 transition-colors"
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
      </Section>

      {/* Notifications */}
      <Section
        title="Notification Preferences"
        icon={<Notification size={16} color="#f7931a" />}
      >
        <div className="space-y-5">
          {/* Earnings alert */}
          <Toggle
            enabled={notifPrefs.earningsAlert}
            onChange={(v) => updateNotif({ earningsAlert: v })}
            label="Earnings alerts"
            description="Notify when daily earnings exceed a threshold"
          />
          {notifPrefs.earningsAlert && (
            <div className="ml-0 pl-4 border-l border-white/8 space-y-1.5">
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider">
                Alert when daily earnings exceed ($)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/30">$</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={notifPrefs.earningsThreshold}
                  onChange={(e) =>
                    updateNotif({
                      earningsThreshold: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-28 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#4ade80]/50 transition-colors"
                />
                <span className="text-xs text-white/30">USDC / day</span>
              </div>
            </div>
          )}

          <div className="border-t border-white/5" />

          {/* Payout alert */}
          <Toggle
            enabled={notifPrefs.payoutAlert}
            onChange={(v) => updateNotif({ payoutAlert: v })}
            label="Payout notifications"
            description="Notify when earnings are ready to claim"
          />

          <div className="border-t border-white/5" />

          {/* Low fill rate */}
          <Toggle
            enabled={notifPrefs.lowFillRate}
            onChange={(v) => updateNotif({ lowFillRate: v })}
            label="Low fill rate warning"
            description="Alert when a placement's fill rate drops below threshold"
          />
          {notifPrefs.lowFillRate && (
            <div className="pl-4 border-l border-white/8 space-y-1.5">
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider">
                Alert when fill rate drops below (%)
              </label>
              <div className="flex flex-wrap gap-2">
                {[30, 50, 70, 80].map((t) => (
                  <button
                    key={t}
                    onClick={() => updateNotif({ fillRateThreshold: t })}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      notifPrefs.fillRateThreshold === t
                        ? "bg-[#f7931a]/20 text-[#f7931a] border border-[#f7931a]/30"
                        : "bg-white/5 text-white/50 border border-white/8 hover:border-white/20"
                    }`}
                  >
                    {t}%
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-white/5" />

          {/* New campaign match */}
          <Toggle
            enabled={notifPrefs.newCampaignMatch}
            onChange={(v) => updateNotif({ newCampaignMatch: v })}
            label="New campaign matches"
            description="Notify when a new advertiser campaign matches your placements"
          />

          <div className="border-t border-white/5" />

          {/* Weekly report */}
          <Toggle
            enabled={notifPrefs.weeklyReport}
            onChange={(v) => updateNotif({ weeklyReport: v })}
            label="Weekly performance report"
            description="Receive a weekly summary of impressions, clicks, and earnings"
          />
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
                  {publicKey.toString()}
                </p>
              </>
            ) : (
              <p className="text-sm text-white/40">No wallet connected</p>
            )}
          </div>
          <WalletButton />
        </div>
        {publicKey && (
          <p className="text-xs text-white/30 mt-1">
            This wallet receives your USDC/USDT earnings when you claim.
          </p>
        )}
      </Section>
    </div>
  );
}
