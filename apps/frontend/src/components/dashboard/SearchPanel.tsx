"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SearchNormal1, CloseCircle } from "iconsax-react";
import { useCampaigns } from "@/hooks/useCampaigns";

const STATUS_COLOR: Record<string, string> = {
  active: "text-emerald-400 bg-emerald-400/10",
  draft: "text-white/40 bg-white/5",
  paused: "text-yellow-400 bg-yellow-400/10",
  completed: "text-[#a855f7] bg-[#a855f7]/10",
};

interface SearchPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchPanel({ open, onClose }: SearchPanelProps) {
  const router = useRouter();
  const { campaigns } = useCampaigns();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const results = query.trim()
    ? campaigns.filter((c) => {
        const q = query.toLowerCase();
        return (
          c.name?.toLowerCase().includes(q) ||
          c.status?.toLowerCase().includes(q) ||
          c.format?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q)
        );
      })
    : campaigns.slice(0, 5);

  function handleSelect(id: string) {
    router.push(`/dashboard/campaigns`);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg rounded-2xl bg-[#13131f] border border-white/10 shadow-2xl shadow-black/60 overflow-hidden">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8">
          <SearchNormal1 size={18} color="#a855f7" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search campaigns..."
            className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")}>
              <CloseCircle size={16} color="#ffffff40" />
            </button>
          )}
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <p className="px-4 py-6 text-sm text-white/30 text-center">
              No campaigns match &ldquo;{query}&rdquo;
            </p>
          ) : (
            <ul>
              {!query && (
                <li className="px-4 pt-3 pb-1">
                  <span className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">
                    Recent campaigns
                  </span>
                </li>
              )}
              {results.map((c) => (
                <li key={c._id}>
                  <button
                    onClick={() => handleSelect(c._id)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#f7931a]/20 to-[#a855f7]/20 flex items-center justify-center text-xs font-bold text-white/60 shrink-0">
                      {c.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">
                        {c.name}
                      </p>
                      <p className="text-xs text-white/40 capitalize">
                        {c.format}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                        STATUS_COLOR[c.status] ?? "text-white/40 bg-white/5"
                      }`}
                    >
                      {c.status}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="px-4 py-2 border-t border-white/8 flex items-center justify-between">
          <span className="text-[10px] text-white/20">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </span>
          <span className="text-[10px] text-white/20">ESC to close</span>
        </div>
      </div>
    </div>
  );
}
