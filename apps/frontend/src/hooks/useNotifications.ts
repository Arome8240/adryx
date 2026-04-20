"use client";

import { useMemo, useState, useEffect } from "react";
import { useCampaigns } from "./useCampaigns";

export type NotificationType = "warning" | "info" | "error" | "success";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  href?: string;
  createdAt: Date;
}

const DISMISSED_KEY = "adryx_dismissed_notifications";

function getDismissed(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(DISMISSED_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

function saveDismissed(ids: Set<string>) {
  localStorage.setItem(DISMISSED_KEY, JSON.stringify([...ids]));
}

export function useNotifications() {
  const { campaigns } = useCampaigns();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    setDismissed(getDismissed());
  }, []);

  function dismiss(id: string) {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveDismissed(next);
      return next;
    });
  }

  function dismissAll(ids: string[]) {
    setDismissed((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      saveDismissed(next);
      return next;
    });
  }

  const allNotifications = useMemo<Notification[]>(() => {
    const now = new Date();
    const items: Notification[] = [];

    for (const c of campaigns) {
      const endDate = new Date(c.endDate);
      const daysLeft = Math.ceil(
        (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      const budgetUsedPct = c.budget > 0 ? (c.spent / c.budget) * 100 : 0;

      if (c.status === "active" && daysLeft <= 3 && daysLeft >= 0) {
        items.push({
          id: `ending-${c._id}`,
          type: "warning",
          title: "Campaign ending soon",
          message: `"${c.name}" ends in ${daysLeft === 0 ? "less than a day" : `${daysLeft} day${daysLeft === 1 ? "" : "s"}`}.`,
          href: "/dashboard/campaigns",
          createdAt: now,
        });
      }

      if (c.status === "active" && budgetUsedPct >= 85) {
        items.push({
          id: `budget-${c._id}`,
          type: "warning",
          title: "Budget running low",
          message: `"${c.name}" has used ${budgetUsedPct.toFixed(0)}% of its budget.`,
          href: "/dashboard/campaigns",
          createdAt: now,
        });
      }

      if (c.status === "active" && daysLeft < 0) {
        items.push({
          id: `expired-${c._id}`,
          type: "error",
          title: "Campaign expired",
          message: `"${c.name}" passed its end date and may need attention.`,
          href: "/dashboard/campaigns",
          createdAt: now,
        });
      }

      if (c.status === "draft") {
        const created = new Date(c.createdAt ?? now);
        const draftDays = Math.floor(
          (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (draftDays >= 7) {
          items.push({
            id: `draft-${c._id}`,
            type: "info",
            title: "Draft campaign idle",
            message: `"${c.name}" has been a draft for ${draftDays} days.`,
            href: "/dashboard/campaigns",
            createdAt: now,
          });
        }
      }
    }

    return items;
  }, [campaigns]);

  const notifications = useMemo(
    () => allNotifications.filter((n) => !dismissed.has(n.id)),
    [allNotifications, dismissed],
  );

  return { notifications, count: notifications.length, dismiss, dismissAll };
}
