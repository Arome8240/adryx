"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  SearchNormal1,
  CloseCircle,
  Chart,
  Code1,
  Global,
} from "iconsax-react";
import { useCampaigns } from "@/hooks/useCampaigns";
import { usePlacements, useSites } from "@/hooks/usePublisher";
import { useAuth } from "@/hooks/useAuth";

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
  const { user } = useAuth();
  const isPublisher = user?.role === "publisher";

  const { campaigns } = useCampaigns();
  const { placements } = usePlacements();
  const { sites } = useSites();

  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const q = query.trim().toLowerCase();

  const matchedCampaigns = useMemo(() => {
    if (isPublisher) return [];
    const list = q
      ? campaigns.filter(
          (c) =>
            c.name?.toLowerCase().includes(q) ||
            c.status?.toLowerCase().includes(q) ||
            c.format?.toLowerCase().includes(q) ||
            c.description?.toLowerCase().includes(q),
        )
      : campaigns.slice(0, 4);
    return list;
  }, [campaigns, q, isPublisher]);

  const matchedPlacements = useMemo(() => {
    if (!isPublisher && !q) return [];
    return q
      ? placements.filter(
          (p) =>
            p.name?.toLowerCase().includes(q) ||
            p.format?.toLowerCase().includes(q),
        )
      : placements.slice(0, 3);
  }, [placements, q, isPublisher]);

  const matchedSites = useMemo(() => {
    if (!isPublisher && !q) return [];
    return q
      ? sites.filter(
          (s) =>
            s.name?.toLowerCase().includes(q) ||
            s.url?.toLowerCase().includes(q) ||
            s.category?.toLowerCase().includes(q),
        )
      : sites.slice(0, 3);
  }, [sites, q, isPublisher]);

  const totalResults =
    matchedCampaigns.length + matchedPlacements.length + matchedSites.length;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg rounded-2xl bg-[#13131f] border border-white/10 shadow-2xl shadow-black/60 overflow-hidden">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8">
          <SearchNormal1 size={18} color="#a855f7" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isPublisher
                ? "Search placements, sites…"
                : "Search campaigns, placements, sites…"
            }
            className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")}>
              <CloseCircle size={16} color="#ffffff40" />
            </button>
          )}
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {totalResults === 0 && q ? (
            <p className="px-4 py-6 text-sm text-white/30 text-center">
              No results for &ldquo;{query}&rdquo;
            </p>
          ) : (
            <ul>
              {/* Campaigns */}
              {matchedCampaigns.length > 0 && (
                <>
                  <li className="px-4 pt-3 pb-1">
                    <span className="text-[10px] font-semibold text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                      <Chart size={10} color="#f7931a" /> Campaigns
                    </span>
                  </li>
                  {matchedCampaigns.map((c) => (
                    <li key={c._id}>
                      <button
                        onClick={() => {
                          router.push("/dashboard/campaigns");
                          onClose();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
                      >
                        <div className="w-7 h-7 rounded-lg bg-linear-to-br from-[#f7931a]/20 to-[#a855f7]/20 flex items-center justify-center text-xs font-bold text-white/60 shrink-0">
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
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_COLOR[c.status] ?? "text-white/40 bg-white/5"}`}
                        >
                          {c.status}
                        </span>
                      </button>
                    </li>
                  ))}
                </>
              )}

              {/* Placements */}
              {matchedPlacements.length > 0 && (
                <>
                  <li className="px-4 pt-3 pb-1">
                    <span className="text-[10px] font-semibold text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                      <Code1 size={10} color="#22d3ee" /> Placements
                    </span>
                  </li>
                  {matchedPlacements.map((p) => (
                    <li key={p._id}>
                      <button
                        onClick={() => {
                          router.push("/publishers/placements");
                          onClose();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#22d3ee]/10 flex items-center justify-center shrink-0">
                          <Code1 size={13} color="#22d3ee" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white truncate">
                            {p.name}
                          </p>
                          <p className="text-xs text-white/40 capitalize">
                            {p.format}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </>
              )}

              {/* Sites */}
              {matchedSites.length > 0 && (
                <>
                  <li className="px-4 pt-3 pb-1">
                    <span className="text-[10px] font-semibold text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                      <Global size={10} color="#a855f7" /> Sites
                    </span>
                  </li>
                  {matchedSites.map((s) => (
                    <li key={s._id}>
                      <button
                        onClick={() => {
                          router.push("/publishers/sites");
                          onClose();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#a855f7]/10 flex items-center justify-center shrink-0">
                          <Global size={13} color="#a855f7" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white truncate">
                            {s.name}
                          </p>
                          <p className="text-xs text-white/40 truncate">
                            {s.url}
                          </p>
                        </div>
                        {s.verified && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400">
                            Verified
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </>
              )}
            </ul>
          )}
        </div>

        <div className="px-4 py-2 border-t border-white/8 flex items-center justify-between">
          <span className="text-[10px] text-white/20">
            {totalResults} result{totalResults !== 1 ? "s" : ""}
          </span>
          <span className="text-[10px] text-white/20">ESC to close</span>
        </div>
      </div>
    </div>
  );
}
