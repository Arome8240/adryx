import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ── Subdomain → owned path prefixes ──────────────────────────────────────────

const SUBDOMAIN_PATHS: Record<string, string[]> = {
  auth: ["/login", "/signup", "/forgot-password", "/reset-password", "/auth"],
  publisher: ["/publisher", "/publishers"],
  advertiser: ["/dashboard"],
};

// Paths that belong to the main marketing site (adryx.xyz)
const MARKETING_PATHS = [
  "/",
  "/features",
  "/pricing",
  "/about",
  "/careers",
  "/contact",
  "/docs",
  "/privacy",
  "/terms",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getSubdomain(hostname: string): string | null {
  // e.g. "auth.adryx.xyz" → "auth", "adryx.xyz" → null
  const parts = hostname.split(".");
  if (parts.length >= 3) return parts[0];
  return null;
}

function ownerOf(pathname: string): string {
  for (const [subdomain, prefixes] of Object.entries(SUBDOMAIN_PATHS)) {
    if (prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
      return subdomain;
    }
  }
  return "marketing";
}

function subdomainHost(subdomain: string | null, baseDomain: string): string {
  return subdomain ? `${subdomain}.${baseDomain}` : baseDomain;
}

// ── Middleware ────────────────────────────────────────────────────────────────

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";
  const { pathname } = request.nextUrl;

  // Skip static assets and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // In development (localhost) — allow everything through, no redirect enforcement
  if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
    // Root path on localhost → serve the marketing home
    return NextResponse.next();
  }

  // ── Production subdomain routing ──────────────────────────────────────────

  const baseDomain = "adryx.xyz";
  const currentSubdomain = getSubdomain(hostname); // null = main domain
  const requiredOwner = ownerOf(pathname);

  // Determine expected subdomain for this path
  const requiredSubdomain =
    requiredOwner === "marketing" ? null : requiredOwner;

  // Already on the correct subdomain — pass through
  if (currentSubdomain === requiredSubdomain) {
    // Redirect subdomain root "/" to its canonical home page
    if (pathname === "/") {
      if (currentSubdomain === "advertiser") {
        return NextResponse.redirect(
          new URL("/dashboard", request.url)
        );
      }
      if (currentSubdomain === "publisher") {
        return NextResponse.redirect(
          new URL("/publishers", request.url)
        );
      }
      if (currentSubdomain === "auth") {
        return NextResponse.redirect(
          new URL("/login", request.url)
        );
      }
    }
    return NextResponse.next();
  }

  // Wrong subdomain — redirect to the correct one
  const targetHost = subdomainHost(requiredSubdomain, baseDomain);
  const targetUrl = new URL(request.url);
  targetUrl.host = targetHost;

  return NextResponse.redirect(targetUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
