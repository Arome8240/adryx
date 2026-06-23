"use client";
import { useState, useEffect } from "react";
import { useAdminUsers } from "@/hooks/useAdmin";
import { SearchNormal1, People, Refresh } from "iconsax-react";

const ROLE_COLORS: Record<string, string> = {
  admin:      "#a855f7",
  advertiser: "#EBFF45",
  publisher:  "#f7931a",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AdminUsersPage() {
  const [page, setPage]               = useState(1);
  const [roleFilter, setRoleFilter]   = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch]           = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data, isLoading, refetch, updateRole, updateStatus } = useAdminUsers({
    page,
    limit: 20,
    role:   roleFilter   || undefined,
    status: statusFilter || undefined,
    search: search       || undefined,
  });

  async function handleRoleChange(userId: string, role: string) {
    setActionLoading(userId + "-role");
    try { await updateRole(userId, role); } catch {}
    setActionLoading(null);
  }

  async function handleStatusToggle(userId: string, current: boolean) {
    setActionLoading(userId + "-status");
    try { await updateStatus(userId, !current); } catch {}
    setActionLoading(null);
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <People size={22} color="#a855f7" />
            Users
          </h1>
          <p className="text-sm text-white/40 mt-0.5">
            {data ? `${data.total.toLocaleString()} registered users` : "Loading…"}
          </p>
        </div>
        <button
          onClick={refetch}
          className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          aria-label="Refresh"
        >
          <Refresh size={16} color="#ffffff80" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <SearchNormal1 size={14} color="#ffffff40" className="absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search name or email…"
            className="w-full pl-9 pr-4 py-2.5 bg-[#0f0f13] border border-white/10 rounded-xl text-sm text-white placeholder-white/25 outline-none focus:border-[#a855f7]/40 transition-colors"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="px-3 py-2.5 bg-[#0f0f13] border border-white/10 rounded-xl text-sm text-white/70 outline-none focus:border-[#a855f7]/40 transition-colors"
        >
          {["", "advertiser", "publisher", "admin"].map((r) => (
            <option key={r} value={r}>{r ? r.charAt(0).toUpperCase() + r.slice(1) : "All roles"}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2.5 bg-[#0f0f13] border border-white/10 rounded-xl text-sm text-white/70 outline-none focus:border-[#a855f7]/40 transition-colors"
        >
          {["", "active", "suspended"].map((s) => (
            <option key={s} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1) : "All statuses"}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#0f0f13] border border-white/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 text-xs text-white/30 uppercase tracking-wider">
                <th className="px-5 py-3 text-left font-semibold">User</th>
                <th className="px-5 py-3 text-left font-semibold">Role</th>
                <th className="px-5 py-3 text-left font-semibold">Status</th>
                <th className="px-5 py-3 text-left font-semibold">Joined</th>
                <th className="px-5 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {[...Array(5)].map((__, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-3.5 bg-white/5 rounded animate-pulse w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data?.users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-white/30 text-sm">
                    No users match your filters
                  </td>
                </tr>
              ) : (
                data?.users.map((u: any) => (
                  <tr key={u._id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ backgroundColor: `${ROLE_COLORS[u.role] ?? "#6b7280"}20`, color: ROLE_COLORS[u.role] ?? "#6b7280" }}
                        >
                          {u.name?.charAt(0)?.toUpperCase() ?? "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-white truncate max-w-40">{u.name}</p>
                          <p className="text-xs text-white/30 truncate max-w-40">{u.email ?? "—"}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <select
                        value={u.role}
                        disabled={actionLoading === u._id + "-role"}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="px-2 py-1 rounded-lg text-xs font-semibold capitalize bg-transparent border border-white/10 outline-none cursor-pointer hover:border-white/20 transition-colors disabled:opacity-40"
                        style={{ color: ROLE_COLORS[u.role] ?? "#6b7280" }}
                      >
                        <option value="advertiser">Advertiser</option>
                        <option value="publisher">Publisher</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${u.isActive ? "bg-emerald-400/10 text-emerald-400" : "bg-[#f87171]/10 text-[#f87171]"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? "bg-emerald-400" : "bg-[#f87171]"}`} />
                        {u.isActive ? "Active" : "Suspended"}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-xs text-white/30">
                      {timeAgo(u.createdAt)}
                    </td>

                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleStatusToggle(u._id, u.isActive)}
                        disabled={actionLoading === u._id + "-status"}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 ${u.isActive ? "bg-[#f87171]/10 text-[#f87171] hover:bg-[#f87171]/20" : "bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20"}`}
                      >
                        {actionLoading === u._id + "-status" ? "…" : u.isActive ? "Suspend" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {data && data.pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-white/8">
            <p className="text-xs text-white/30">Page {data.page} of {data.pages} · {data.total} users</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-white/50 hover:bg-white/10 disabled:opacity-30 transition-colors">Previous</button>
              <button onClick={() => setPage((p) => Math.min(data.pages, p + 1))} disabled={page === data.pages} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-white/50 hover:bg-white/10 disabled:opacity-30 transition-colors">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
