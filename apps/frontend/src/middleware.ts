import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ── Config ────────────────────────────────────────────────────────────────────

const BASE_DOMAIN = "adryx.xyz";

const KNOWN_SUBDOMAINS = ["auth", "publisher", "advertiser"] as const;
type KnownSubdomain = (typeof KNOWN_SUBDOMAINS)[number];

// Paths owned by each subdomain (prefix match)
const SUBDOMAIN_PATHS: Record<KnownSubdomain, string[]> = {
  auth: ["/login", "/signup", "/forgot-password", "/reset-password", "/auth"],
  publisher: ["/publisher", "/publishers"],
  advertiser: ["/dashboard"],
};

// Subdomain root redirects when "/" is accessed
const ROOT_REDIRECT: Record<KnownSubdomain, string> = {
  auth: "/login",
  publisher: "/publishers",
  advertiser: "/dashboard",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Returns null for any host that isn't an Adryx domain so the middleware
 * passes through without touching local dev, Vercel preview URLs, etc.
 */
function parseSite(hostname: string): KnownSubdomain | "marketing" | null {
  if (hostname === BASE_DOMAIN || hostname === `www.${BASE_DOMAIN}`) {
    return "marketing";
  }
  for (const sub of KNOWN_SUBDOMAINS) {
    if (hostname === `${sub}.${BASE_DOMAIN}`) return sub;
  }
  return null; // localhost, preview URLs, unknown hosts
}

function ownerOf(pathname: string): KnownSubdomain | "marketing" {
  for (const [sub, prefixes] of Object.entries(SUBDOMAIN_PATHS) as [
    KnownSubdomain,
    string[],
  ][]) {
    if (prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
      return sub;
    }
  }
  return "marketing";
}

// ── Middleware ────────────────────────────────────────────────────────────────

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";
  const { pathname } = request.nextUrl;

  // Always skip Next.js internals and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const site = parseSite(hostname);

  // Unknown host (localhost, Vercel preview, CI, etc.) — never redirect
  if (site === null) {
    return NextResponse.next();
  }

  // Subdomain root "/" → redirect to its home page (one hop, no loop)
  if (pathname === "/") {
    if (site !== "marketing") {
      return NextResponse.redirect(
        new URL(ROOT_REDIRECT[site], request.url),
      );
    }
    return NextResponse.next();
  }

  const pathOwner = ownerOf(pathname);

  // Already on the correct site — let Next.js handle it
  if (pathOwner === site) {
    return NextResponse.next();
  }

  // Marketing paths accessed from a subdomain → redirect to main domain
  if (pathOwner === "marketing" && site !== "marketing") {
    const target = new URL(request.url);
    target.host = BASE_DOMAIN;
    return NextResponse.redirect(target);
  }

  // Subdomain paths accessed from wrong subdomain → redirect to correct one
  // (covers both main-domain → subdomain and wrong-subdomain → right-subdomain)
  if (pathOwner !== "marketing") {
    const target = new URL(request.url);
    target.host = `${pathOwner}.${BASE_DOMAIN}`;
    return NextResponse.redirect(target);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip static, image, and well-known files
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt).*)",
  ],
};
