"use client";
import Link from "next/link";

const COLS: Record<string, { label: string; href: string; soon?: boolean }[]> = {
  Product: [
    { label: "Features",     href: "/features" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "Pricing",      href: "/pricing" },
    { label: "Changelog",    href: "#", soon: true },
  ],
  Developers: [
    { label: "Documentation", href: "/docs" },
    { label: "SDK reference", href: "/docs" },
    { label: "GitHub",        href: "https://github.com/adryx" },
    { label: "Status",        href: "#", soon: true },
  ],
  Company: [
    { label: "About",    href: "/about" },
    { label: "Careers",  href: "/careers" },
    { label: "Contact",  href: "/contact" },
    { label: "Blog",     href: "#", soon: true },
  ],
  Legal: [
    { label: "Privacy",       href: "/privacy" },
    { label: "Terms",         href: "/terms" },
    { label: "Cookie policy", href: "#", soon: true },
    { label: "DPA",           href: "#", soon: true },
  ],
};

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,.07)",
        background: "#0a0a0c",
        padding: "56px 0 32px",
      }}
    >
      <div className="c-wrap">
        {/* Main grid — 2 cols on mobile, 3 on sm, 5 on lg */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-x-8 gap-y-10 mb-12">

          {/* Brand column — full width on mobile/sm, normal on lg */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1 c-col" style={{ gap: 14 }}>
            <Link href="/" className="c-brand">
              <span className="c-mark" />
              Adryx
            </Link>
            <p className="c-sm c-muted" style={{ maxWidth: 240 }}>
              Internet advertising, settled in stablecoins. USDC payouts on
              Stellar for every verified impression.
            </p>
          </div>

          {/* Link columns — each takes one cell in the responsive grid */}
          {Object.entries(COLS).map(([group, links]) => (
            <div key={group}>
              <p className="c-label" style={{ marginBottom: 16 }}>{group}</p>
              <div className="c-col" style={{ gap: 9 }}>
                {links.map((l) =>
                  l.soon ? (
                    <span
                      key={l.label}
                      className="c-sm"
                      style={{
                        color: "rgba(245,245,245,.22)",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        cursor: "default",
                      }}
                    >
                      {l.label}
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 600,
                          letterSpacing: ".06em",
                          textTransform: "uppercase",
                          color: "rgba(235,255,69,.5)",
                          border: "1px solid rgba(235,255,69,.2)",
                          borderRadius: 3,
                          padding: "1px 5px",
                          lineHeight: 1.6,
                        }}
                      >
                        soon
                      </span>
                    </span>
                  ) : (
                    <Link
                      key={l.label}
                      href={l.href}
                      className="c-sm"
                      style={{
                        color: "rgba(245,245,245,.42)",
                        textDecoration: "none",
                        transition: "color .1s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "rgba(245,245,245,.75)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "rgba(245,245,245,.42)")
                      }
                    >
                      {l.label}
                    </Link>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,.06)",
            paddingTop: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p className="c-xs c-muted">© 2026 Adryx. All rights reserved.</p>
          <div className="c-row" style={{ gap: 16 }}>
            {[
              { label: "Help",    href: "/contact" },
              { label: "Privacy", href: "/privacy" },
              { label: "Terms",   href: "/terms" },
            ].map((l) => (
              <Link key={l.label} href={l.href} className="c-xs c-muted" style={{ textDecoration: "none" }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
