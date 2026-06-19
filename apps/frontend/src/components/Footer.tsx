"use client";
import Link from "next/link";

const COLS: Record<string, { label: string; href: string }[]> = {
  Product: [
    { label: "Features",     href: "/features" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "Pricing",      href: "/pricing" },
    { label: "Changelog",    href: "#" },
  ],
  Developers: [
    { label: "Documentation", href: "/docs" },
    { label: "SDK reference", href: "/docs" },
    { label: "GitHub",        href: "https://github.com" },
    { label: "Status",        href: "#" },
  ],
  Company: [
    { label: "About",    href: "/about" },
    { label: "Blog",     href: "#" },
    { label: "Careers",  href: "/contact" },
    { label: "Contact",  href: "/contact" },
  ],
  Legal: [
    { label: "Privacy",       href: "/privacy" },
    { label: "Terms",         href: "/terms" },
    { label: "Cookie policy", href: "#" },
    { label: "DPA",           href: "#" },
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
        {/* Main grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
            gap: 32,
            marginBottom: 48,
          }}
        >
          {/* Brand column */}
          <div className="c-col" style={{ gap: 14 }}>
            <Link href="/" className="c-brand">
              <span className="c-mark" />
              Adryx
            </Link>
            <p className="c-sm c-muted" style={{ maxWidth: 240 }}>
              Internet advertising, settled in stablecoins. USDC payouts on
              Stellar for every verified impression.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(COLS).map(([group, links]) => (
            <div key={group}>
              <p className="c-label" style={{ marginBottom: 16 }}>{group}</p>
              <div className="c-col" style={{ gap: 9 }}>
                {links.map((l) => (
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
                ))}
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
