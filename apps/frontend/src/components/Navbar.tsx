"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { HambergerMenu, CloseCircle } from "iconsax-react";
import { URLS } from "@/lib/urls";

const NAV_LINKS = [
  { label: "Publishers",  href: URLS.publishers },
  { label: "Advertisers", href: URLS.dashboard },
  { label: "Docs",        href: "/docs" },
  { label: "Pricing",     href: "/pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`c-nav${scrolled ? " scrolled" : ""}`}>
      <div className="c-wrap c-row c-between" style={{ height: 60 }}>
        {/* Brand */}
        <Link href="/" className="c-brand">
          <span className="c-mark" />
          Adryx
        </Link>

        {/* Desktop links — hidden on mobile */}
        <div className="hidden md:flex items-center" style={{ gap: 2 }}>
          {NAV_LINKS.map((l) => (
            <Link key={l.label} href={l.href} className="c-nav-link">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs — hidden on mobile */}
        <div className="hidden md:flex items-center" style={{ gap: 10 }}>
          <Link href={URLS.login} className="c-btn-ghost" style={{ padding: "8px 16px", fontSize: 13 }}>
            Sign in
          </Link>
          <Link href={URLS.signup} className="c-btn-y" style={{ padding: "8px 18px", fontSize: 13 }}>
            Get started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open
            ? <CloseCircle size={22} color="#f87171" />
            : <HambergerMenu size={22} color="rgba(245,245,245,.7)" />
          }
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          style={{
            background: "rgba(8,8,10,.96)",
            borderTop: "1px solid rgba(255,255,255,.08)",
            padding: "16px 24px 20px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 16 }}>
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="c-nav-link"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Link href={URLS.login} className="c-btn-ghost" style={{ justifyContent: "center", fontSize: 13 }}>
              Sign in
            </Link>
            <Link href={URLS.signup} className="c-btn-y" style={{ justifyContent: "center", fontSize: 13 }}>
              Get started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
