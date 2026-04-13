"use client";
import { motion } from "framer-motion";
import {
  Profile,
  EmptyWallet,
  Notification,
  SecuritySafe,
  Setting2,
} from "iconsax-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-white/40 mt-1">
          Manage your account and preferences
        </p>
      </motion.div>

      {/* Profile Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#4ade80]/10 flex items-center justify-center">
            <Profile size={20} color="#4ade80" variant="Bold" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Profile</h2>
            <p className="text-xs text-white/40">
              Update your profile information
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              Publisher Name
            </label>
            <input
              type="text"
              defaultValue="My Publisher Account"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#4ade80]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              Email
            </label>
            <input
              type="email"
              defaultValue="publisher@example.com"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#4ade80]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              Website
            </label>
            <input
              type="url"
              defaultValue="https://myapp.com"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#4ade80]/50 transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#f7931a] hover:bg-[#f7931a]/90 text-white text-sm font-medium rounded-xl transition-colors">
            Save Changes
          </button>
        </div>
      </motion.div>

      {/* Wallet Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#f7931a]/10 flex items-center justify-center">
            <EmptyWallet size={20} color="#f7931a" variant="Bold" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">
              Wallet & Payouts
            </h2>
            <p className="text-xs text-white/40">
              Configure your payout preferences
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              Solana Wallet Address
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                defaultValue="7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-white font-mono text-sm placeholder:text-white/30 focus:outline-none focus:border-[#4ade80]/50 transition-colors"
                readOnly
              />
              <button className="px-4 py-2.5 bg-white/5 hover:bg-white/8 text-white text-sm font-medium rounded-xl transition-colors border border-white/8">
                Change
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              Minimum Payout Threshold
            </label>
            <select className="w-full px-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-white focus:outline-none focus:border-[#4ade80]/50 transition-colors">
              <option>$100</option>
              <option>$250</option>
              <option>$500</option>
              <option>$1000</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              Payout Frequency
            </label>
            <select className="w-full px-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-white focus:outline-none focus:border-[#4ade80]/50 transition-colors">
              <option>Monthly (15th of each month)</option>
              <option>Bi-weekly</option>
              <option>Weekly</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#a855f7]/10 flex items-center justify-center">
            <Notification
              size={20}
              className="text-[#a855f7]"
              variant="Bold"
            />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">
              Notifications
            </h2>
            <p className="text-xs text-white/40">
              Choose what updates you receive
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { label: "Payout notifications", defaultChecked: true },
            { label: "Performance alerts", defaultChecked: true },
            { label: "New placement opportunities", defaultChecked: false },
            { label: "Weekly reports", defaultChecked: true },
            { label: "Product updates", defaultChecked: false },
          ].map((item) => (
            <label
              key={item.label}
              className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5 cursor-pointer hover:bg-white/5 transition-colors group"
            >
              <span className="text-sm text-white">{item.label}</span>
              <div className="relative">
                <input
                  type="checkbox"
                  defaultChecked={item.defaultChecked}
                  className="w-4 h-4 rounded bg-white/5 border-white/20 text-[#4ade80] focus:ring-[#4ade80] focus:ring-offset-0 cursor-pointer"
                />
              </div>
            </label>
          ))}
        </div>
      </motion.div>

      {/* Security Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#22d3ee]/10 flex items-center justify-center">
            <SecuritySafe
              size={20}
              className="text-[#22d3ee]"
              variant="Bold"
            />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Security</h2>
            <p className="text-xs text-white/40">
              Manage your account security
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 transition-colors text-left">
            <div>
              <p className="text-sm font-medium text-white">Change Password</p>
              <p className="text-xs text-white/40 mt-0.5">
                Last changed 3 months ago
              </p>
            </div>
            <span className="text-[#22d3ee]">→</span>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 transition-colors text-left">
            <div>
              <p className="text-sm font-medium text-white">
                Two-Factor Authentication
              </p>
              <p className="text-xs text-white/40 mt-0.5">Not enabled</p>
            </div>
            <span className="text-[#22d3ee]">→</span>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 transition-colors text-left">
            <div>
              <p className="text-sm font-medium text-white">API Keys</p>
              <p className="text-xs text-white/40 mt-0.5">
                Manage your API access
              </p>
            </div>
            <span className="text-[#22d3ee]">→</span>
          </button>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="glass rounded-2xl p-6 border border-red-500/20"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <Setting2 size={20} color="#ef4444" variant="Bold" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Danger Zone</h2>
            <p className="text-xs text-white/40">
              Irreversible account actions
            </p>
          </div>
        </div>
        <button className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-medium rounded-xl transition-colors border border-red-500/20">
          Delete Account
        </button>
      </motion.div>
    </div>
  );
}
