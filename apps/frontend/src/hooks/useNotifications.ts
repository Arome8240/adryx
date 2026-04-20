"use client";

import { useMemo } from "react";
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

export function useNotifications() {
  const { campaigns } = useCampaigns();

  const notifications = useMemo<Notification[]>(() => {
    const now = new Date();
    const items: Notification[] = [];

    for (const c of campaigns) {
      const endDate = new Date(c.endDate);
      const daysLeft = Math.ceil(
        (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      const budgetUsedPct = c.budget > 0 ? (c.spent / c.budget) * 100 : 0;

      // Campaign ending within 3 days
      if (c.status === "active" && daysLeft <= 3 && daysLeft >= 0) {
        items.push({
          id: `ending-${c._id}`,
          type: "warning",
          title: "Campaign ending soon",
          message: `"${c.name}" ends in ${daysLeft === 0 ? "less than a day" : `${daysLeft} day${daysLeft === 1 ? "" : "s"}`}.`,
          href: `/dashboard/campaigns`,
          createdAt: now,
        });
      }

      // Budget over 85% spent
      if (c.status === "active" && budgetUsedPct >= 85) {
        items.push({
          id: `budget-${c._id}`,
          type: "warning",
          title: "Budget running low",
          message: `"${c.name}" has used ${budgetUsedPct.toFixed(0)}% of its budget.`,
          href: `/dashboard/campaigns`,
          createdAt: now,
        });
      }

      // Campaign expired but still active
      if (c.status === "active" && daysLeft < 0) {
        items.push({
          id: `expired-${c._id}`,
          type: "error",
          title: "Campaign expired",
          message: `"${c.name}" passed its end date and may need attention.`,
          href: `/dashboard/campaigns`,
          createdAt: now,
        });
      }

      // Draft campaigns older than 7 days
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
            href: `/dashboard/campaigns`,
            createdAt: now,
          });
        }
      }
    }

    return items;
  }, [campaigns]);

  return { notifications, count: notifications.length };
}
