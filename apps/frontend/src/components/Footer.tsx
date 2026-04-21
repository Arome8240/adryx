"use client";
import { motion } from "framer-motion";
import { DocumentText, Code, Global } from "iconsax-react";
import Link from "next/link";

const links = {
  Product: [
    { name: "Features", href: "/features" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Pricing", href: "/pricing" },
    { name: "Changelog", href: "https://github.com/adryx/adryx/releases" },
  ],
  Developers: [
    { name: "Documentation", href: "/docs" },
    { name: "SDK Reference", href: "/docs#sdk" },
    { name: "GitHub", href: "https://github.com/adryx/adryx" },
    { name: "Status", href: "https://status.adryx.io" },
  ],
  Company: [
    { name: "About", href: "/about" },
    { name: "Blog", href: "https://blog.adryx.io" },
    { name: "Careers", href: "/contact" },
    { name: "Contact", href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-border pt-16 pb-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="col-span-2 md:col-span-1"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-semibold text-base">Adryx</span>
            </div>
            <p className="body-sm text-text-tertiary max-w-xs mb-4">
              The decentralized advertising network for Web2 and Web3.
              Transparent, instant, and built on Solana.
            </p>
            <div className="flex items-center gap-2">
              <Link
                href="/docs"
                aria-label="Documentation"
                className="w-8 h-8 rounded-md border border-border flex items-center justify-center text-text-tertiary hover:text-text-primary hover:border-border-hover transition-all duration-200"
              >
                <DocumentText size={16} color="#f97316" />
              </Link>
              <a
                href="https://github.com/adryx/adryx"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-8 h-8 rounded-md border border-border flex items-center justify-center text-text-tertiary hover:text-text-primary hover:border-border-hover transition-all duration-200"
              >
                <Code size={16} color="#a855f7" />
              </a>
              <a
                href="https://twitter.com/adryx_io"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-8 h-8 rounded-md border border-border flex items-center justify-center text-text-tertiary hover:text-text-primary hover:border-border-hover transition-all duration-200"
              >
                <Global size={16} color="#06b6d4" />
              </a>
            </div>
          </motion.div>

          {/* Link columns */}
          {Object.entries(links).map(([group, items], i) => (
            <motion.div
              key={group}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i + 1) * 0.05 }}
            >
              <h4 className="label-xs text-text-tertiary mb-3">
                {group}
              </h4>
              <ul className="flex flex-col gap-2">
                {items.map((item) => (
                  <li key={item.name}>
                    {item.href.startsWith('http') ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="body-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="body-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
                      >
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="label-xs text-text-tertiary">
            &copy; {new Date().getFullYear()} Adryx. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="label-xs text-text-tertiary hover:text-text-secondary transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="label-xs text-text-tertiary hover:text-text-secondary transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
