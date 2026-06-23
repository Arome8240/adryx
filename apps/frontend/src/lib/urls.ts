/**
 * Centralised URL registry for multi-tenancy.
 *
 * In development (non-production) all values resolve to plain paths so
 * existing router.push / Link hrefs work without any DNS changes.
 *
 * In production each subdomain gets clean paths — no `/publishers` or
 * `/dashboard` prefix in the URL, just the page segment itself.
 *
 *   publisher.adryx.xyz/sites      (not /publishers/sites)
 *   advertiser.adryx.xyz/campaigns (not /dashboard/campaigns)
 */

const isProd = process.env.NODE_ENV === "production";

const DOMAIN = {
  marketing:  isProd ? "https://adryx.xyz" : "",
  auth:       isProd ? "https://auth.adryx.xyz" : "",
  publisher:  isProd ? "https://publisher.adryx.xyz" : "",
  advertiser: isProd ? "https://advertiser.adryx.xyz" : "",
} as const;

// In dev, publisher pages live at /publishers/* and advertiser at /dashboard/*
// In prod, they live at the clean subdomain path (e.g. /sites, /campaigns)
const pubPath  = (p: string) => isProd ? `${DOMAIN.publisher}${p}`  : `/publishers${p}`;
const advPath  = (p: string) => isProd ? `${DOMAIN.advertiser}${p}` : `/dashboard${p}`;

// ── URL constants ────────────────────────────────────────────────────────────

export const URLS = {
  // ── Marketing (adryx.xyz) ─────────────────────────────────────────────────
  home:     `${DOMAIN.marketing}/`,
  about:    `${DOMAIN.marketing}/about`,
  features: `${DOMAIN.marketing}/features`,
  pricing:  `${DOMAIN.marketing}/pricing`,
  docs:     `${DOMAIN.marketing}/docs`,
  careers:  `${DOMAIN.marketing}/careers`,
  contact:  `${DOMAIN.marketing}/contact`,
  privacy:  `${DOMAIN.marketing}/privacy`,
  terms:    `${DOMAIN.marketing}/terms`,

  // ── Auth (auth.adryx.xyz) ─────────────────────────────────────────────────
  login:            `${DOMAIN.auth}/login`,
  signup:           `${DOMAIN.auth}/signup`,
  signupAdvertiser: `${DOMAIN.auth}/signup?role=advertiser`,
  forgotPassword:   `${DOMAIN.auth}/forgot-password`,
  resetPassword:    `${DOMAIN.auth}/reset-password`,

  // ── Publisher (publisher.adryx.xyz — no /publishers prefix in prod) ────────
  publishers:          pubPath(""),           // /publishers  | publisher.adryx.xyz
  publisherSites:      pubPath("/sites"),
  publisherPlacements: pubPath("/placements"),
  publisherEarnings:   pubPath("/earnings"),
  publisherAnalytics:  pubPath("/analytics"),
  publisherIntegrate:  pubPath("/integrate"),
  publisherSettings:   pubPath("/settings"),

  // ── Advertiser (advertiser.adryx.xyz — no /dashboard prefix in prod) ───────
  dashboard:          advPath(""),            // /dashboard  | advertiser.adryx.xyz
  dashboardCampaigns: advPath("/campaigns"),
  dashboardCreate:    advPath("/create"),
  dashboardAnalytics: advPath("/analytics"),
  dashboardSettings:  advPath("/settings"),
  dashboardWallet:    advPath("/wallet"),
} as const;

// ── Navigation helpers ───────────────────────────────────────────────────────

/**
 * Use instead of router.push() for cross-subdomain navigation.
 * In dev the URL is a plain path so router behaviour is unchanged.
 * In prod the full URL triggers a cross-origin navigation.
 */
export function navigateTo(url: string): void {
  if (typeof window === "undefined") return;
  window.location.href = url;
}

/**
 * Determine whether a nav item href matches the current pathname.
 * Works for both absolute subdomain URLs (prod) and plain paths (dev).
 */
export function isNavActive(pathname: string, href: string): boolean {
  const path = href.startsWith("http") ? new URL(href).pathname : href;
  // Exact match, or child path
  if (path === "/" || path === "") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}
