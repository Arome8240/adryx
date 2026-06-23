/**
 * Centralised URL registry for multi-tenancy.
 *
 * In development (localhost) all values resolve to plain paths so existing
 * router.push / Link hrefs work without any DNS changes.
 *
 * In production each path is prefixed with the owning subdomain so browsers
 * navigate between subdomains automatically.
 */

const isProd = process.env.NODE_ENV === "production";

const BASE = {
  marketing: isProd ? "https://adryx.xyz" : "",
  auth: isProd ? "https://auth.adryx.xyz" : "",
  publisher: isProd ? "https://publisher.adryx.xyz" : "",
  advertiser: isProd ? "https://advertiser.adryx.xyz" : "",
} as const;

// ── URL constants ────────────────────────────────────────────────────────────

export const URLS = {
  // ── Marketing (adryx.xyz) ──────────────────────────────────────────────
  home: `${BASE.marketing}/`,
  about: `${BASE.marketing}/about`,
  features: `${BASE.marketing}/features`,
  pricing: `${BASE.marketing}/pricing`,
  docs: `${BASE.marketing}/docs`,
  careers: `${BASE.marketing}/careers`,
  contact: `${BASE.marketing}/contact`,
  privacy: `${BASE.marketing}/privacy`,
  terms: `${BASE.marketing}/terms`,

  // ── Auth (auth.adryx.xyz) ──────────────────────────────────────────────
  login: `${BASE.auth}/login`,
  signup: `${BASE.auth}/signup`,
  signupAdvertiser: `${BASE.auth}/signup?role=advertiser`,
  forgotPassword: `${BASE.auth}/forgot-password`,
  resetPassword: `${BASE.auth}/reset-password`,

  // ── Publisher (publisher.adryx.xyz) ────────────────────────────────────
  publishers: `${BASE.publisher}/publishers`,
  publisherIntegrate: `${BASE.publisher}/publishers/integrate`,
  publisherAnalytics: `${BASE.publisher}/publishers/analytics`,
  publisherPlacements: `${BASE.publisher}/publishers/placements`,
  publisherSites: `${BASE.publisher}/publishers/sites`,
  publisherSettings: `${BASE.publisher}/publishers/settings`,

  // ── Advertiser (advertiser.adryx.xyz) ──────────────────────────────────
  dashboard: `${BASE.advertiser}/dashboard`,
  dashboardCampaigns: `${BASE.advertiser}/dashboard/campaigns`,
  dashboardCreate: `${BASE.advertiser}/dashboard/create`,
  dashboardAnalytics: `${BASE.advertiser}/dashboard/analytics`,
  dashboardSettings: `${BASE.advertiser}/dashboard/settings`,
  dashboardWallet: `${BASE.advertiser}/dashboard/wallet`,
} as const;

// ── Programmatic cross-subdomain navigation ──────────────────────────────────
//
// Use instead of router.push() whenever the target might be on a different
// subdomain. In dev the URL is a plain path so router behaviour is unchanged.
// In prod the full URL triggers a same-tab cross-origin navigation.

export function navigateTo(url: string): void {
  if (typeof window === "undefined") return;
  if (url.startsWith("http")) {
    window.location.href = url;
  } else {
    window.location.pathname = url;
  }
}
