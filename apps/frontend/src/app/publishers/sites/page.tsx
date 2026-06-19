"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  AddCircle,
  Global,
  Mobile,
  TickCircle,
  CloseCircle,
  Copy,
  Trash,
} from "iconsax-react";
import { useSites } from "@/hooks/usePublisher";

const inputCls =
  "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 outline-none focus:border-[#f7931a]/50 transition-colors";

export default function SitesPage() {
  const { sites, isLoading, createSite, deleteSite, verifySite } = useSites();
  const [showAddModal, setShowAddModal] = useState(false);
  const [verifyingSite, setVerifyingSite] = useState<any | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    url: "",
    type: "website" as "website" | "app",
    category: "",
  });

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      await createSite({
        name: form.name,
        url: form.url,
        type: form.type,
        category: form.category || undefined,
      });
      showToast("Site added successfully");
      setShowAddModal(false);
      setForm({ name: "", url: "", type: "website", category: "" });
    } catch (err: any) {
      showToast(err.message, false);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleVerify(site: any) {
    try {
      await verifySite(site._id);
      showToast("Site verified!");
      setVerifyingSite(null);
    } catch (err: any) {
      showToast(err.message, false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteSite(id);
      showToast("Site deleted");
    } catch (err: any) {
      showToast(err.message, false);
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
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

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl font-bold text-white">Sites & Apps</h1>
          <p className="text-sm text-white/40 mt-0.5">
            Manage and verify your properties
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#f7931a] hover:bg-[#f7931a]/90 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <AddCircle size={16} color="#ffffff" variant="Bold" />
          Add Site/App
        </button>
      </motion.div>

      {/* Sites list */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-[#0f0f13] border border-white/8 p-5 animate-pulse"
            >
              <div className="h-4 bg-white/10 rounded w-1/3 mb-2" />
              <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : sites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-white/10 gap-3">
          <Global size={28} color="#f7931a" />
          <p className="text-white font-semibold">No sites yet</p>
          <p className="text-sm text-white/40">
            Add your first site or app to start monetizing
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#f7931a] hover:bg-[#f7931a]/90 text-white text-sm font-semibold rounded-xl transition-colors mt-2"
          >
            <AddCircle size={15} color="white" /> Add Site
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sites.map((site, i) => (
            <motion.div
              key={site._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="rounded-2xl bg-[#0f0f13] border border-white/8 p-5 hover:border-white/15 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      site.type === "website"
                        ? "bg-[#EBFF45]/15"
                        : "bg-[#d4e63c]/15"
                    }`}
                  >
                    {site.type === "website" ? (
                      <Global size={20} color="#EBFF45" variant="Bold" />
                    ) : (
                      <Mobile size={20} color="#d4e63c" variant="Bold" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-white">
                        {site.name}
                      </h3>
                      {site.verified ? (
                        <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                          <TickCircle size={10} color="currentColor" /> Verified
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
                          Unverified
                        </span>
                      )}
                      <span className="text-[10px] text-white/30 capitalize px-2 py-0.5 rounded-full bg-white/5">
                        {site.type}
                      </span>
                    </div>
                    <p className="text-xs text-white/40 mt-0.5 truncate">
                      {site.url}
                    </p>
                    {site.category && (
                      <p className="text-xs text-white/30 mt-0.5 capitalize">
                        {site.category}
                      </p>
                    )}
                    <p className="text-xs text-white/30 mt-1">
                      {site.placements?.length ?? 0} placement
                      {(site.placements?.length ?? 0) !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!site.verified && (
                    <button
                      onClick={() => setVerifyingSite(site)}
                      className="px-3 py-1.5 rounded-lg bg-[#f7931a]/15 hover:bg-[#f7931a]/25 text-[#f7931a] text-xs font-semibold transition-colors"
                    >
                      Verify
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(site._id)}
                    className="p-1.5 rounded-lg bg-[#f87171]/10 hover:bg-[#f87171]/20 text-[#f87171] transition-colors"
                  >
                    <Trash size={14} color="currentColor" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add site modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-[#0f0f13] border border-white/10 shadow-2xl p-6">
            <h2 className="text-base font-bold text-white mb-5">
              Add Site or App
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                  Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                  placeholder="My Website"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                  URL
                </label>
                <input
                  type="url"
                  value={form.url}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, url: e.target.value }))
                  }
                  required
                  placeholder="https://mysite.com"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                  Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["website", "app"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, type: t }))}
                      className={`px-3 py-2 rounded-xl border text-sm capitalize transition-all ${
                        form.type === t
                          ? "border-[#f7931a]/50 bg-[#f7931a]/8 text-[#f7931a]"
                          : "border-white/8 text-white/50 hover:border-white/15"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                  Category (optional)
                </label>
                <input
                  value={form.category}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, category: e.target.value }))
                  }
                  placeholder="e.g. DeFi, Gaming, News"
                  className={inputCls}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#f7931a] hover:bg-[#f7931a]/90 text-white text-sm font-semibold disabled:opacity-40 transition-colors"
                >
                  {isSaving ? "Adding…" : "Add Site"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verify modal — P20/P21 */}
      {verifyingSite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setVerifyingSite(null)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0f0f13] border border-white/10 shadow-2xl p-6">
            <h2 className="text-base font-bold text-white mb-1">
              Verify {verifyingSite.name}
            </h2>
            <p className="text-xs text-white/40 mb-5">
              Add this meta tag to the{" "}
              <code className="text-[#EBFF45]">&lt;head&gt;</code> of your site,
              then click Verify.
            </p>
            <div className="relative mb-5">
              <pre className="text-xs text-[#EBFF45] bg-white/5 border border-white/10 rounded-xl p-4 overflow-x-auto whitespace-pre-wrap break-all">
                {`<meta name="adryx:verification" content="${verifyingSite.verificationCode}">`}
              </pre>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `<meta name="adryx:verification" content="${verifyingSite.verificationCode}">`,
                  )
                }
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Copy size={13} color="#ffffff80" />
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setVerifyingSite(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleVerify(verifyingSite)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#f7931a] hover:bg-[#f7931a]/90 text-white text-sm font-semibold transition-colors"
              >
                Verify Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
