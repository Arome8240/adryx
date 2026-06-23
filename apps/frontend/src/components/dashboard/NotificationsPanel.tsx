"use client";
import { useRef, useEffect } from "react";
import Link from "next/link";
import {
  Notification as NotifIcon,
  TickCircle,
  Warning2,
  InfoCircle,
  CloseCircle,
} from "iconsax-react";
import {
  useNotifications,
  type NotificationType,
} from "@/hooks/useNotifications";
import { URLS } from "@/lib/urls";

const TYPE_STYLES: Record<
  NotificationType,
  { icon: React.ReactNode; bg: string }
> = {
  warning: {
    icon: <Warning2 size={14} color="#f7931a" />,
    bg: "bg-[#f7931a]/8",
  },
  error: {
    icon: <CloseCircle size={14} color="#f87171" />,
    bg: "bg-[#f87171]/8",
  },
  info: {
    icon: <InfoCircle size={14} color="#a855f7" />,
    bg: "bg-[#a855f7]/8",
  },
  success: {
    icon: <TickCircle size={14} color="#4ade80" />,
    bg: "bg-emerald-400/8",
  },
};

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function NotificationsPanel({
  open,
  onClose,
}: NotificationsPanelProps) {
  const { notifications, dismiss, dismissAll } = useNotifications();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node))
        onClose();
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-[#13131f] border border-white/10 shadow-xl shadow-black/40 overflow-hidden z-50"
    >
      <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <NotifIcon size={15} color="#f7931a" />
          <span className="text-sm font-semibold text-white">
            Notifications
          </span>
          {notifications.length > 0 && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#f7931a]/15 text-[#f7931a]">
              {notifications.length}
            </span>
          )}
        </div>
        {notifications.length > 0 && (
          <button
            onClick={() => dismissAll(notifications.map((n) => n.id))}
            className="text-[10px] text-white/30 hover:text-white/60 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <TickCircle size={28} color="#4ade8040" />
            <p className="text-sm text-white/30">All caught up</p>
          </div>
        ) : (
          <ul className="p-2 flex flex-col gap-1">
            {notifications.map((n) => {
              const style = TYPE_STYLES[n.type];
              const inner = (
                <div
                  className={`flex items-start gap-3 px-3 py-2.5 rounded-xl ${style.bg} transition-colors`}
                >
                  <div className="mt-0.5 shrink-0">{style.icon}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white leading-tight">
                      {n.title}
                    </p>
                    <p className="text-xs text-white/50 mt-0.5 leading-snug">
                      {n.message}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      dismiss(n.id);
                    }}
                    className="shrink-0 text-white/20 hover:text-white/50 transition-colors mt-0.5"
                  >
                    <CloseCircle size={13} color="currentColor" />
                  </button>
                </div>
              );

              return (
                <li key={n.id}>
                  {n.href ? (
                    <Link href={n.href} onClick={onClose}>
                      {inner}
                    </Link>
                  ) : (
                    inner
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="px-4 py-2.5 border-t border-white/8">
          <Link
            href={URLS.dashboardCampaigns}
            onClick={onClose}
            className="text-xs text-[#a855f7] hover:text-[#c084fc] transition-colors"
          >
            View all campaigns →
          </Link>
        </div>
      )}
    </div>
  );
}
