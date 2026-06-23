import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ── Config ────────────────────────────────────────────────────────────────────

const BASE_DOMAIN = "adryx.xyz";
const KNOWN_SUBDOMAINS = ["auth", "publisher", "advertiser", "admin"] as const;
type KnownSubdomain = (typeof KNOWN_SUBDOMAINS)[number];

// Auth subdomain owns these path prefixes (enforce redirect to correct subdomain)
const AUTH_PATHS = ["/login", "/signup", "/forgot-password", "/reset-password", "/auth"];

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Returns null for any host that isn't an Adryx domain so the middleware
 * passes through without touching localhost, Vercel preview URLs, etc.
 */
function parseSite(hostname: string): KnownSubdomain | "marketing" | null {
  if (hostname === BASE_DOMAIN || hostname === `www.${BASE_DOMAIN}`) return "marketing";
  for (const sub of KNOWN_SUBDOMAINS) {
    if (hostname === `${sub}.${BASE_DOMAIN}`) return sub;
  }
  return null;
}

function isAuthPath(pathname: string): boolean {
  return AUTH_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
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

  // Unknown host (localhost, Vercel preview, CI, etc.) — never redirect/rewrite
  if (site === null) return NextResponse.next();

  // ── publisher.adryx.xyz ───────────────────────────────────────────────────
  // Rewrite clean URLs to the internal /publishers/* route tree.
  // The browser URL stays clean (e.g. /sites); Next.js serves /publishers/sites.
  if (site === "publisher") {
    // Auth paths on publisher subdomain → redirect to auth subdomain
    if (isAuthPath(pathname)) {
      const target = new URL(request.url);
      target.host = `auth.${BASE_DOMAIN}`;
      return NextResponse.redirect(target);
    }
    // Root → internal /publishers
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/publishers", request.url));
    }
    // Already prefixed (shouldn't normally happen; guard against double-rewrite)
    if (pathname.startsWith("/publishers") || pathname.startsWith("/publisher/")) {
      return NextResponse.next();
    }
    // All other paths → /publishers{pathname}
    return NextResponse.rewrite(new URL(`/publishers${pathname}`, request.url));
  }

  // ── admin.adryx.xyz ───────────────────────────────────────────────────────
  // Admin has its own login page — never redirect to auth subdomain.
  // Rewrite clean paths to the internal /admin/* route tree.
  if (site === "admin") {
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/admin", request.url));
    }
    // Already prefixed — pass through to avoid double-rewrite
    if (pathname.startsWith("/admin")) {
      return NextResponse.next();
    }
    return NextResponse.rewrite(new URL(`/admin${pathname}`, request.url));
  }

  // ── advertiser.adryx.xyz ──────────────────────────────────────────────────
  // Rewrite clean URLs to the internal /dashboard/* route tree.
  if (site === "advertiser") {
    if (isAuthPath(pathname)) {
      const target = new URL(request.url);
      target.host = `auth.${BASE_DOMAIN}`;
      return NextResponse.redirect(target);
    }
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/dashboard", request.url));
    }
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.next();
    }
    return NextResponse.rewrite(new URL(`/dashboard${pathname}`, request.url));
  }

  // ── auth.adryx.xyz ────────────────────────────────────────────────────────
  if (site === "auth") {
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // ── adryx.xyz (marketing) ─────────────────────────────────────────────────
  // Redirect any non-marketing paths to the correct subdomain.
  if (isAuthPath(pathname)) {
    const target = new URL(request.url);
    target.host = `auth.${BASE_DOMAIN}`;
    return NextResponse.redirect(target);
  }
  if (pathname.startsWith("/publishers") || pathname.startsWith("/publisher/")) {
    const target = new URL(request.url);
    target.host = `publisher.${BASE_DOMAIN}`;
    // Strip the /publishers prefix so the subdomain gets a clean path
    target.pathname = pathname.replace(/^\/publishers/, "") || "/";
    return NextResponse.redirect(target);
  }
  if (pathname.startsWith("/dashboard")) {
    const target = new URL(request.url);
    target.host = `advertiser.${BASE_DOMAIN}`;
    target.pathname = pathname.replace(/^\/dashboard/, "") || "/";
    return NextResponse.redirect(target);
  }
  if (pathname.startsWith("/admin")) {
    const target = new URL(request.url);
    target.host = `admin.${BASE_DOMAIN}`;
    target.pathname = pathname.replace(/^\/admin/, "") || "/";
    return NextResponse.redirect(target);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt).*)",
  ],
};
