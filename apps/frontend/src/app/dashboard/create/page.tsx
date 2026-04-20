"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCampaigns } from "@/hooks/useCampaigns";
import { ArrowLeft, TickCircle, CloseCircle, InfoCircle } from "iconsax-react";

const AD_FORMATS = [
  { value: "banner", label: "Banner", desc: "Static or animated image ad" },
  { value: "video", label: "Video", desc: "Short-form video ad" },
  { value: "native", label: "Native", desc: "Blends with site content" },
  {
    value: "interstitial",
    label: "Interstitial",
    desc: "Full-screen overlay ad",
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
  "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 outline-none focus:border-[#f7931a]/50 transition-colors";

export default function CreateCampaignPage() {
  const router = useRouter();
  const { createCampaign } = useCampaigns();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
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

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
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
      showToast("Campaign created successfully");
      setTimeout(() => router.push("/dashboard/campaigns"), 1000);
    } catch (err: any) {
      showToast(err.message, false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
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
                    ? "border-[#f7931a]/50 bg-[#f7931a]/8"
                    : "border-white/8 bg-white/3 hover:border-white/15"
                }`}
              >
                <span
                  className={`text-sm font-semibold ${formData.format === f.value ? "text-[#f7931a]" : "text-white/70"}`}
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
            label="Budget (SOL)"
            hint="Initial budget — you can fund the campaign later"
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
                className={`${inputCls} pr-12`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/30 font-mono">
                SOL
              </span>
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Start Date">
              <input
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
                className={inputCls}
              />
            </Field>
            <Field label="End Date">
              <input
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                required
                className={inputCls}
              />
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
              required
              placeholder="https://yoursite.com/landing"
              className={inputCls}
            />
          </Field>

          <Field
            label="Creative URL"
            hint="URL to your ad image or video asset"
          >
            <input
              name="creativeUrl"
              type="url"
              value={formData.creativeUrl}
              onChange={handleChange}
              placeholder="https://yoursite.com/banner.jpg"
              className={inputCls}
            />
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
            className="flex-1 px-4 py-3 rounded-xl bg-[#f7931a] hover:bg-[#f7931a]/90 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Creating…" : "Create Campaign"}
          </button>
        </div>
      </form>
    </div>
  );
}
