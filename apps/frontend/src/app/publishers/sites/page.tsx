"use client";
import { motion } from "framer-motion";
import { AddCircle, Global, Mobile, TickCircle, CloseCircle, Copy } from "iconsax-react";
import { publisherSites } from "@/lib/publisher-mock-data";
import { useState } from "react";

export default function SitesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSite, setSelectedSite] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Sites & Apps</h1>
          <p className="text-sm text-white/40 mt-1">
            Manage and verify your properties
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#f7931a] hover:bg-[#f7931a]/90 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <AddCircle size={18} color="#ffffff" variant="Bold" />
          Add Site/App
        </button>
      </motion.div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 gap-4">
        {publisherSites.map((site, i) => (
          <motion.div
            key={site.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="glass rounded-2xl p-6 border border-white/8 hover:border-white/12 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    site.type === "website"
                      ? "bg-[#a855f7]/10"
                      : "bg-[#22d3ee]/10"
                  }`}
                >
                  {site.type === "website" ? (
                    <Global size={24} color="#a855f7" variant="Bold" />
                  ) : (
                    <Mobile size={24} color="#22d3ee" variant="Bold" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {site.name}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                        site.verified
                          ? "bg-[#4ade80]/10 text-[#4ade80]"
                          : "bg-[#f7931a]/10 text-[#f7931a]"
                      }`}
                    >
                      {site.verified ? (
                        <>
                          <TickCircle size={14} color="#4ade80" variant="Bold" />
                          Verified
                        </>
                      ) : (
                        <>
                          <CloseCircle size={14} color="#f7931a" variant="Bold" />
                          Pending Verification
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-white/60 mb-3">{site.url}</p>
                  <div className="flex items-center gap-4 text-xs text-white/40">
                    <span>Added: {site.addedDate}</span>
                    {site.verified && (
                      <span>Verified: {site.verifiedDate}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {!site.verified && (
                  <button
                    onClick={() => setSelectedSite(site.id)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#f7931a]/15 text-[#f7931a] hover:bg-[#f7931a]/25 transition-colors"
                  >
                    Verify Now
                  </button>
                )}
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 text-white/60 hover:bg-white/8 transition-colors">
                  Settings
                </button>
              </div>
            </div>

            {/* Stats */}
            {site.verified && (
              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/5">
                <div>
                  <p className="text-xs text-white/40 mb-1">Placements</p>
                  <p className="text-lg font-semibold text-white">
                    {site.stats.placements}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1">Impressions</p>
                  <p className="text-lg font-semibold text-white">
                    {(site.stats.impressions / 1000).toFixed(0)}K
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1">Clicks</p>
                  <p className="text-lg font-semibold text-white">
                    {(site.stats.clicks / 1000).toFixed(1)}K
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1">Earnings</p>
                  <p className="text-lg font-semibold text-[#4ade80]">
                    ${site.stats.earnings.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Verification Modal */}
      {selectedSite && (
        <VerificationModal
          site={publisherSites.find((s) => s.id === selectedSite)!}
          onClose={() => setSelectedSite(null)}
        />
      )}

      {/* Add Site Modal */}
      {showAddModal && <AddSiteModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}

function VerificationModal({
  site,
  onClose,
}: {
  site: any;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const metaTag = `<meta name="adryx-site-verification" content="${site.verificationCode}" />`;

  const handleCopy = () => {
    navigator.clipboard.writeText(metaTag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-6 border border-white/8 max-w-2xl w-full"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Verify {site.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <CloseCircle size={20} color="#ffffff" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Step 1 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#4ade80]/10 flex items-center justify-center text-[#4ade80] text-xs font-bold">
                1
              </div>
              <h3 className="text-sm font-semibold text-white">
                Add Meta Tag to Your Site
              </h3>
            </div>
            <p className="text-sm text-white/60 mb-3 ml-8">
              Copy the meta tag below and paste it in the{" "}
              <code className="px-1.5 py-0.5 bg-white/5 rounded text-[#4ade80]">
                &lt;head&gt;
              </code>{" "}
              section of your website's HTML.
            </p>
            <div className="ml-8 relative">
              <pre className="bg-[#0d0d1a] rounded-xl p-4 text-sm text-white/80 overflow-x-auto border border-white/5">
                <code>{metaTag}</code>
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 text-white/60 hover:bg-white/8 transition-colors"
              >
                <Copy size={14} color="#22d3ee" />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#4ade80]/10 flex items-center justify-center text-[#4ade80] text-xs font-bold">
                2
              </div>
              <h3 className="text-sm font-semibold text-white">
                Verify Your Site
              </h3>
            </div>
            <p className="text-sm text-white/60 mb-3 ml-8">
              Once you've added the meta tag, click the button below to verify
              your site. This usually takes a few seconds.
            </p>
            <div className="ml-8">
              <button className="px-4 py-2.5 bg-[#4ade80] hover:bg-[#4ade80]/90 text-white text-sm font-medium rounded-xl transition-colors">
                Verify Site
              </button>
            </div>
          </div>

          {/* Alternative Method */}
          <div className="pt-4 border-t border-white/5">
            <h3 className="text-sm font-semibold text-white mb-2">
              Alternative: DNS Verification
            </h3>
            <p className="text-sm text-white/60 mb-3">
              Add a TXT record to your domain's DNS settings:
            </p>
            <div className="bg-[#0d0d1a] rounded-xl p-4 border border-white/5">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-white/40 mb-1">Type</p>
                  <p className="text-white font-mono">TXT</p>
                </div>
                <div>
                  <p className="text-white/40 mb-1">Name</p>
                  <p className="text-white font-mono">@</p>
                </div>
                <div>
                  <p className="text-white/40 mb-1">Value</p>
                  <p className="text-white font-mono text-xs">
                    adryx-verification={site.verificationCode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function AddSiteModal({ onClose }: { onClose: () => void }) {
  const [siteType, setSiteType] = useState<"website" | "app">("website");

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-6 border border-white/8 max-w-lg w-full"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Add New Site/App</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <CloseCircle size={20} color="#ffffff" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              Property Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSiteType("website")}
                className={`p-4 rounded-xl border transition-colors ${
                  siteType === "website"
                    ? "bg-[#a855f7]/10 border-[#a855f7]/50"
                    : "bg-white/3 border-white/5 hover:bg-white/5"
                }`}
              >
                <Global
                  size={24}
                  color={siteType === "website" ? "#a855f7" : "#ffffff40"}
                  variant={siteType === "website" ? "Bold" : "Linear"}
                />
                <p className="text-sm font-medium text-white mt-2">Website</p>
              </button>
              <button
                onClick={() => setSiteType("app")}
                className={`p-4 rounded-xl border transition-colors ${
                  siteType === "app"
                    ? "bg-[#22d3ee]/10 border-[#22d3ee]/50"
                    : "bg-white/3 border-white/5 hover:bg-white/5"
                }`}
              >
                <Mobile
                  size={24}
                  color={siteType === "app" ? "#22d3ee" : "#ffffff40"}
                  variant={siteType === "app" ? "Bold" : "Linear"}
                />
                <p className="text-sm font-medium text-white mt-2">
                  Mobile App
                </p>
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              {siteType === "website" ? "Site Name" : "App Name"}
            </label>
            <input
              type="text"
              placeholder={
                siteType === "website" ? "My Awesome Site" : "My Awesome App"
              }
              className="w-full px-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#4ade80]/50 transition-colors"
            />
          </div>

          {/* URL/Package */}
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              {siteType === "website" ? "Website URL" : "Package Name"}
            </label>
            <input
              type="text"
              placeholder={
                siteType === "website"
                  ? "https://example.com"
                  : "com.example.app"
              }
              className="w-full px-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#4ade80]/50 transition-colors"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              Category
            </label>
            <select className="w-full px-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-white focus:outline-none focus:border-[#4ade80]/50 transition-colors">
              <option>Technology</option>
              <option>Finance</option>
              <option>Gaming</option>
              <option>News</option>
              <option>Entertainment</option>
              <option>Education</option>
              <option>Other</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/8 text-white text-sm font-medium rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button className="flex-1 px-4 py-2.5 bg-[#f7931a] hover:bg-[#f7931a]/90 text-white text-sm font-medium rounded-xl transition-colors">
              Add Property
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
