"use client";

import { useCallback, useRef } from "react";
import { apiClient } from "@/lib/api-client";

/**
 * useTracking — records impressions and clicks for an ad placement.
 *
 * Usage in a publisher's ad component:
 *   const { trackImpression, trackClick } = useTracking(campaignId, placementId, publisherWallet);
 *
 *   // On ad render:
 *   useEffect(() => { trackImpression(); }, []);
 *
 *   // On ad click:
 *   <a onClick={trackClick} href={targetUrl}>...</a>
 */
export function useTracking(
  campaignId: string,
  placementId: string,
  publisherWallet: string,
) {
  const impressionSent = useRef(false);

  const trackImpression = useCallback(async () => {
    if (impressionSent.current) return; // only once per mount
    impressionSent.current = true;
    try {
      await apiClient.recordImpression(campaignId, placementId);
    } catch {
      // Silently fail — don't break the publisher's page
    }
  }, [campaignId, placementId]);

  const trackClick = useCallback(async () => {
    try {
      const result = await apiClient.recordClick(
        campaignId,
        placementId,
        publisherWallet,
      );
      return result;
    } catch {
      return null;
    }
  }, [campaignId, placementId, publisherWallet]);

  return { trackImpression, trackClick };
}
