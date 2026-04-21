"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HambergerMenu, CloseCircle } from "iconsax-react";

const links = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Who It's For", href: "#for-who" },
  { label: "Docs", href: "/docs" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled 
          ? "bg-dark-bg-primary/80 backdrop-blur-xl border-b border-dark-border" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 hover-lift">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-bold text-lg tracking-tight">Adryx</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1 text-sm">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="px-3 py-2 rounded-md text-secondary hover:text-primary hover:bg-dark-bg-tertiary transition-all"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/publishers"
            className="btn-ghost text-sm px-4 py-2"
          >
            Publishers
          </Link>
          <Link
            href="/dashboard"
            className="btn-primary text-sm px-4 py-2"
          >
            Advertisers
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-secondary hover:text-primary transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <CloseCircle size={24} color="#f0f0f5" />
          ) : (
            <HambergerMenu size={24} color="#f0f0f5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-dark-bg-secondary/95 backdrop-blur-xl border-t border-dark-border px-6 py-4 flex flex-col gap-2"
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="px-3 py-2 rounded-md text-sm text-secondary hover:text-primary hover:bg-dark-bg-tertiary transition-all"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2 mt-2 border-t border-dark-border">
            <Link
              href="/publishers"
              className="btn-secondary text-sm px-4 py-2.5 text-center"
              onClick={() => setMenuOpen(false)}
            >
              For Publishers
            </Link>
            <Link
              href="/dashboard"
              className="btn-primary text-sm px-4 py-2.5 text-center"
              onClick={() => setMenuOpen(false)}
            >
              For Advertisers
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
