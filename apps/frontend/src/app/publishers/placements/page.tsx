"use client";
import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { motion } from "framer-motion";
import {
  AddCircle,
  Code1,
  Eye,
  MouseCircle,
  TrendUp,
  DollarCircle,
  Pause,
  Play,
  Trash,
  Copy,
} from "iconsax-react";
import { usePlacements, useSites } from "@/hooks/usePublisher";
import { Select } from "@/components/ui/select";

const AD_FORMATS = ["banner", "native", "video", "interstitial"];
const inputCls =
  "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 outline-none focus:border-[#f7931a]/50 transition-colors";

export default function PlacementsPage() {
  const {
    placements,
    isLoading,
    createPlacement,
    updatePlacement,
    deletePlacement,
    getEmbedCode,
  } = usePlacements();
  const { sites } = useSites();
  const [showAddModal, setShowAddModal] = useState(false);
  const [embedCode, setEmbedCode] = useState<{
    name: string;
    code: string;
  } | null>(null);
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    siteId: "",
    format: "banner",
    description: "",
  });


  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.siteId) return toast("Select a site", 'error');
    setIsSaving(true);
    try {
      await createPlacement({
        name: form.name,
        siteId: form.siteId,
        format: form.format,
        description: form.description || undefined,
      });
      toast("Placement created");
      setShowAddModal(false);
      setForm({ name: "", siteId: "", format: "banner", description: "" });
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggle(p: any) {
    const newStatus = p.status === "active" ? "paused" : "active";
    try {
      await updatePlacement(p._id, { status: newStatus });
      toast(`Placement ${newStatus}`);
    } catch (err: any) {
      toast(err.message, 'error');
    }
  }

  async function handleDelete(id: string) {
    try {
      await deletePlacement(id);
      toast("Placement deleted");
    } catch (err: any) {
      toast(err.message, 'error');
    }
  }

  async function handleGetCode(p: any) {
    try {
      const result = await getEmbedCode(p._id);
      setEmbedCode({ name: p.name, code: result.code });
    } catch (err: any) {
      toast(err.message, 'error');
    }
  }

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
          <h1 className="text-xl font-bold text-white">Ad Placements</h1>
          <p className="text-sm text-white/40 mt-0.5">
            {placements.length} placement{placements.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#f7931a] hover:bg-[#f7931a]/90 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <AddCircle size={16} color="#ffffff" variant="Bold" />
          New Placement
        </button>
      </motion.div>

      {/* List */}
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
      ) : placements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-white/10 gap-3">
          <Code1 size={28} color="#f7931a" />
          <p className="text-white font-semibold">No placements yet</p>
          <p className="text-sm text-white/40">
            Create your first ad placement to start earning
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#f7931a] hover:bg-[#f7931a]/90 text-white text-sm font-semibold rounded-xl transition-colors mt-2"
          >
            <AddCircle size={15} color="white" /> New Placement
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {placements.map((p, i) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="rounded-2xl bg-[#0f0f13] border border-white/8 p-5 hover:border-white/15 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-sm font-semibold text-white">
                      {p.name}
                    </h3>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                        p.status === "active"
                          ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
                          : "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"
                      }`}
                    >
                      {p.status ?? "active"}
                    </span>
                    <span className="text-[10px] text-white/30 capitalize px-2 py-0.5 rounded-full bg-white/5">
                      {p.format}
                    </span>
                  </div>
                  {p.site && (
                    <p className="text-xs text-white/40 mt-0.5">
                      {p.site.name} · {p.site.url}
                    </p>
                  )}
                  {p.description && (
                    <p className="text-xs text-white/30 mt-0.5">
                      {p.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Stats — P26 */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  {
                    label: "Impressions",
                    value: (p.impressions ?? 0).toLocaleString(),
                    icon: <Eye size={12} color="#EBFF45" />,
                  },
                  {
                    label: "Clicks",
                    value: (p.clicks ?? 0).toLocaleString(),
                    icon: <MouseCircle size={12} color="#d4e63c" />,
                  },
                  {
                    label: "CTR",
                    value: `${p.ctr ?? "0.00"}%`,
                    icon: <TrendUp size={12} color="#f7931a" />,
                  },
                  {
                    label: "Earnings",
                    value: `$${parseFloat(p.earnings ?? "0").toFixed(2)}`,
                    icon: <DollarCircle size={12} color="#EBFF45" />,
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl bg-white/3 border border-white/5 p-3"
                  >
                    <div className="flex items-center gap-1 mb-1">
                      {s.icon}
                      <p className="text-[10px] text-white/30">{s.label}</p>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleGetCode(p)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EBFF45]/10 hover:bg-[#EBFF45]/20 text-[#EBFF45] text-xs font-semibold transition-colors"
                >
                  <Code1 size={13} color="currentColor" /> Get Code
                </button>
                <button
                  onClick={() => handleToggle(p)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    p.status === "active"
                      ? "bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400"
                      : "bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-400"
                  }`}
                >
                  {p.status === "active" ? (
                    <>
                      <Pause size={13} color="currentColor" /> Pause
                    </>
                  ) : (
                    <>
                      <Play size={13} color="currentColor" /> Resume
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f87171]/10 hover:bg-[#f87171]/20 text-[#f87171] text-xs font-semibold transition-colors ml-auto"
                >
                  <Trash size={13} color="currentColor" /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add placement modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-[#0f0f13] border border-white/10 shadow-2xl p-6">
            <h2 className="text-base font-bold text-white mb-5">
              New Placement
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
                  placeholder="Homepage Banner"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                  Site
                </label>
                <Select
                  value={form.siteId}
                  onChange={(v) => setForm((p) => ({ ...p, siteId: v }))}
                  placeholder="Select a site…"
                  options={[
                    { value: "", label: "Select a site…" },
                    ...sites.map((s) => ({ value: s._id, label: s.name })),
                  ]}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                  Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {AD_FORMATS.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, format: f }))}
                      className={`px-3 py-2 rounded-xl border text-sm capitalize transition-all ${
                        form.format === f
                          ? "border-[#f7931a]/50 bg-[#f7931a]/8 text-[#f7931a]"
                          : "border-white/8 text-white/50 hover:border-white/15"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                  Description (optional)
                </label>
                <input
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="e.g. Above the fold banner"
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
                  {isSaving ? "Creating…" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Embed code modal — P29 */}
      {embedCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setEmbedCode(null)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0f0f13] border border-white/10 shadow-2xl p-6">
            <h2 className="text-base font-bold text-white mb-1">Embed Code</h2>
            <p className="text-xs text-white/40 mb-4">
              Paste this into your site where you want the ad to appear.
            </p>
            <div className="relative">
              <pre className="text-xs text-[#EBFF45] bg-white/5 border border-white/10 rounded-xl p-4 overflow-x-auto whitespace-pre-wrap break-all max-h-48">
                {embedCode.code}
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(embedCode.code);
                  toast("Copied!");
                }}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Copy size={13} color="#ffffff80" />
              </button>
            </div>
            <button
              onClick={() => setEmbedCode(null)}
              className="mt-4 w-full px-4 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm hover:bg-white/5 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
