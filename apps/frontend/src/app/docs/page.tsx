import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Send2, Box, Link2, Code } from "iconsax-react";

const docCards = [
  {
    href: "/docs/quickstart",
    icon: Send2,
    title: "Quick Start",
    desc: "Get up and running in 5 minutes with our quick-start guide.",
  },
  {
    href: "/docs/sdk",
    icon: Box,
    title: "SDK Reference",
    desc: "Complete API reference for JavaScript, TypeScript, and Rust SDKs.",
  },
  {
    href: "/docs/smart-contracts",
    icon: Link2,
    title: "Smart Contracts",
    desc: "Soroban contract architecture, data keys, and event schema.",
  },
  {
    href: "https://github.com/adryx",
    icon: Code,
    title: "GitHub",
    desc: "View our open-source code and contribute to the project.",
    external: true,
  },
];

const apiEndpoints = [
  { method: "POST", path: "/api/v1/auth/register" },
  { method: "POST", path: "/api/v1/auth/wallet-login" },
  { method: "GET",  path: "/api/v1/campaigns" },
  { method: "POST", path: "/api/v1/campaigns" },
  { method: "GET",  path: "/api/v1/analytics/dashboard" },
];

const methodColor: Record<string, string> = {
  POST: "#EBFF45",
  GET: "#60a5fa",
  DELETE: "#f87171",
  PATCH: "#fb923c",
};

export default function DocsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#08080a] pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Hero */}
          <div className="mb-14">
            <span
              className="c-eyebrow mb-5"
              style={{ color: "#EBFF45", borderColor: "rgba(235,255,69,.2)", background: "rgba(235,255,69,.08)" }}
            >
              <span
                className="c-dot"
                style={{ "--dot-color": "#EBFF45" } as React.CSSProperties}
              />
              Developer docs
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-4">
              Documentation
            </h1>
            <p className="text-lg text-white/50 max-w-xl">
              Everything you need to integrate Adryx into your application.
            </p>
          </div>

          {/* Doc category cards */}
          <div className="grid md:grid-cols-2 gap-5 mb-12">
            {docCards.map(({ href, icon: Icon, title, desc, external }) => {
              const Wrapper = external ? "a" : Link;
              const extraProps = external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {};
              return (
                <Wrapper
                  key={href}
                  href={href}
                  {...extraProps}
                  className="group flex gap-5 p-7 rounded-2xl c-card hover:border-[#EBFF45]/25 transition-all"
                >
                  <div
                    className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center"
                    style={{ background: "rgba(235,255,69,.1)" }}
                  >
                    <Icon size={22} color="#EBFF45" variant="Bold" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1 group-hover:text-[#EBFF45] transition-colors">
                      {title}
                    </h2>
                    <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
                  </div>
                </Wrapper>
              );
            })}
          </div>

          {/* API reference card */}
          <div
            className="rounded-2xl p-8"
            style={{
              background: "rgba(255,255,255,.025)",
              border: "1px solid rgba(255,255,255,.08)",
            }}
          >
            <h2 className="text-xl font-bold text-white mb-6">API Endpoints</h2>
            <div className="space-y-3 font-mono text-sm">
              {apiEndpoints.map(({ method, path }) => (
                <div key={path} className="flex items-center gap-4">
                  <span
                    className="w-14 text-center text-[11px] font-bold py-0.5 rounded"
                    style={{
                      color: methodColor[method] ?? "#f5f5f5",
                      background: `${methodColor[method] ?? "#f5f5f5"}18`,
                    }}
                  >
                    {method}
                  </span>
                  <span className="text-white/50">{path}</span>
                </div>
              ))}
            </div>
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:3001"}/api/docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="c-btn-y inline-flex mt-8"
            >
              View Full API Docs
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
