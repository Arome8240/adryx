"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useCampaigns } from "@/hooks/useCampaigns";
import { URLS, navigateTo } from "@/lib/urls";
import {
  ArrowLeft,
  CloseCircle,
  InfoCircle,
  DocumentText,
  Eye,
} from "iconsax-react";

const DRAFT_KEY = "adryx_campaign_draft";

const AD_FORMATS = [
  {
    value: "banner",
    label: "Banner",
    desc: "Static or animated image ad",
    budgetHint: "$50–$500/day typical",
  },
  {
    value: "video",
    label: "Video",
    desc: "Short-form video ad",
    budgetHint: "$100–$1,000/day typical",
  },
  {
    value: "native",
    label: "Native",
    desc: "Blends with site content",
    budgetHint: "$30–$300/day typical",
  },
  {
    value: "interstitial",
    label: "Interstitial",
    desc: "Full-screen overlay ad",
    budgetHint: "$200–$1,500/day typical",
  },
];

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
          {label}
        </label>
        {hint && (
          <span title={hint}>
            <InfoCircle size={12} color="#ffffff30" />
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 outline-none focus:border-[#EBFF45]/40 transition-colors";

export default function CreateCampaignPage() {
  const router = useRouter();
  const { createCampaign } = useCampaigns();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const [hasDraft, setHasDraft] = useState(false);
  const [urlError, setUrlError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    format: "banner",
    budget: "",
    startDate: "",
    endDate: "",
    targetUrl: "",
    creativeUrl: "",
  });

  // Load draft on mount
  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
        setHasDraft(true);
      } catch {}
    }
  }, []);

  // Auto-save draft on change
  useEffect(() => {
    const hasContent =
      formData.name || formData.description || formData.targetUrl;
    if (hasContent) localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
  }, [formData]);

  function clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
  }


  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createCampaign({
        ...formData,
        budget: parseFloat(formData.budget),
      });
      toast("Campaign created successfully");
      clearDraft();
      setTimeout(() => navigateTo(URLS.dashboardCampaigns), 1000);
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ArrowLeft size={16} color="currentColor" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">New Campaign</h1>
          <p className="text-sm text-white/40">
            Set up a new advertising campaign
          </p>
        </div>
      </div>

      {/* Draft restored banner */}
      {hasDraft && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#a855f7]/10 border border-[#a855f7]/20 text-[#a855f7] text-xs font-medium">
          <DocumentText size={14} color="currentColor" />
          Draft restored from your last session.
          <button
            onClick={() => {
              clearDraft();
              setFormData({
                name: "",
                description: "",
                format: "banner",
                budget: "",
                startDate: "",
                endDate: "",
                targetUrl: "",
                creativeUrl: "",
              });
            }}
            className="ml-auto underline hover:no-underline"
          >
            Clear
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic info */}
        <div className="rounded-2xl bg-[#0d0d1a] border border-white/8 p-5 space-y-5">
          <p className="text-xs font-semibold text-white/30 uppercase tracking-widest">
            Basic Info
          </p>

          <Field label="Campaign Name">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. Summer Sale 2025"
              className={inputCls}
            />
          </Field>

          <Field label="Description">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe your campaign goals…"
              className={`${inputCls} resize-none`}
            />
          </Field>
        </div>

        {/* Ad Format */}
        <div className="rounded-2xl bg-[#0d0d1a] border border-white/8 p-5 space-y-4">
          <p className="text-xs font-semibold text-white/30 uppercase tracking-widest">
            Ad Format
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {AD_FORMATS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, format: f.value }))
                }
                className={`flex flex-col items-start px-4 py-3 rounded-xl border text-left transition-all ${
                  formData.format === f.value
                    ? "border-[#EBFF45]/50 bg-[#EBFF45]/8"
                    : "border-white/8 bg-white/3 hover:border-white/15"
                }`}
              >
                <span
                  className={`text-sm font-semibold ${formData.format === f.value ? "text-[#EBFF45]" : "text-white/70"}`}
                >
                  {f.label}
                </span>
                <span className="text-xs text-white/30 mt-0.5">{f.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Budget & Dates */}
        <div className="rounded-2xl bg-[#0d0d1a] border border-white/8 p-5 space-y-5">
          <p className="text-xs font-semibold text-white/30 uppercase tracking-widest">
            Budget & Schedule
          </p>

          <Field
            label="Budget (USDC)"
            hint="Initial budget in USDC — you can fund the campaign later"
          >
            <div className="relative">
              <input
                name="budget"
                type="number"
                step="0.01"
                min="0"
                value={formData.budget}
                onChange={handleChange}
                required
                placeholder="0.00"
                className={`${inputCls} pr-16`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/30 font-mono">
                USDC
              </span>
            </div>
            {/* T14 — Budget hint */}
            <p className="text-xs text-white/30 mt-1">
              {AD_FORMATS.find((f) => f.value === formData.format)?.budgetHint}
            </p>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Start Date">
              <div className="relative">
                <input
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className={`${inputCls} cursor-pointer [color-scheme:dark]`}
                />
              </div>
            </Field>
            <Field label="End Date">
              <div className="relative">
                <input
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  min={
                    formData.startDate || new Date().toISOString().split("T")[0]
                  }
                  className={`${inputCls} cursor-pointer [color-scheme:dark]`}
                />
              </div>
            </Field>
          </div>
        </div>

        {/* URLs */}
        <div className="rounded-2xl bg-[#0d0d1a] border border-white/8 p-5 space-y-5">
          <p className="text-xs font-semibold text-white/30 uppercase tracking-widest">
            Links
          </p>

          <Field
            label="Target URL"
            hint="Where users land after clicking your ad"
          >
            <input
              name="targetUrl"
              type="url"
              value={formData.targetUrl}
              onChange={handleChange}
              onBlur={(e) => {
                const val = e.target.value;
                if (!val) {
                  setUrlError("");
                  return;
                }
                try {
                  new URL(val);
                  setUrlError("");
                } catch {
                  setUrlError("Enter a valid URL including https://");
                }
              }}
              required
              placeholder="https://yoursite.com/landing"
              className={`${inputCls} ${urlError ? "border-[#f87171]/50" : ""}`}
            />
            {urlError && (
              <p className="text-xs text-[#f87171] mt-1">{urlError}</p>
            )}
          </Field>

          <Field
            label="Creative URL"
            hint="URL to your ad image or video asset"
          >
            <div className="flex gap-2">
              <input
                name="creativeUrl"
                type="url"
                value={formData.creativeUrl}
                onChange={handleChange}
                placeholder="https://yoursite.com/banner.jpg"
                className={`${inputCls} flex-1`}
              />
              {formData.creativeUrl && (
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/50 hover:text-white text-xs font-medium transition-colors shrink-0"
                >
                  <Eye size={13} color="currentColor" /> Preview
                </button>
              )}
            </div>
          </Field>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pb-6">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white/60 text-sm hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 rounded-xl bg-[#EBFF45] hover:bg-[#EBFF45]/90 text-[#0e0e00] text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Creating…" : "Create Campaign"}
          </button>
        </div>
      </form>

      {/* T12 — Creative preview modal */}
      {showPreview && formData.creativeUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowPreview(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-[#13131f] border border-white/10 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
              <p className="text-sm font-semibold text-white">Ad Preview</p>
              <button
                onClick={() => setShowPreview(false)}
                className="text-white/30 hover:text-white transition-colors"
              >
                <CloseCircle size={18} color="currentColor" />
              </button>
            </div>
            <div className="p-5">
              {/* Simulated ad unit */}
              <div className="rounded-xl border border-white/10 overflow-hidden bg-white/3">
                {formData.format === "video" ? (
                  <video
                    src={formData.creativeUrl}
                    controls
                    className="w-full max-h-64 object-contain"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={formData.creativeUrl}
                    alt="Ad creative preview"
                    className="w-full max-h-64 object-contain"
                  />
                )}
              </div>
              <div className="mt-3 p-3 rounded-xl bg-white/3 border border-white/8">
                <p className="text-xs font-semibold text-white truncate">
                  {formData.name || "Campaign Name"}
                </p>
                {formData.targetUrl && (
                  <p className="text-[10px] text-white/30 truncate mt-0.5">
                    {formData.targetUrl}
                  </p>
                )}
                <span className="inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EBFF45]/15 text-[#EBFF45] capitalize">
                  {formData.format}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
