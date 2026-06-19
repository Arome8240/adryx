import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Briefcase, SearchNormal1 } from "iconsax-react";

const values = [
  {
    title: "Build in the open",
    desc: "Our smart contracts are open source. We default to transparency in everything we ship.",
  },
  {
    title: "Ownership mindset",
    desc: "Small team, broad scope. Everyone owns outcomes end-to-end, not just tickets.",
  },
  {
    title: "Async by default",
    desc: "We're remote-first and write things down. Good writing beats long meetings.",
  },
  {
    title: "Move fast, don't break trust",
    desc: "We ship often. But our products handle real money, so quality is non-negotiable.",
  },
];

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#08080a] pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Hero */}
          <div className="mb-16">
            <span
              className="c-eyebrow mb-5"
              style={{ color: "#EBFF45", borderColor: "rgba(235,255,69,.2)", background: "rgba(235,255,69,.08)" }}
            >
              <span className="c-dot" style={{ "--dot-color": "#EBFF45" } as React.CSSProperties} />
              We&apos;re hiring
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-4">
              Work with us
            </h1>
            <p className="text-lg text-white/50 max-w-xl">
              We&apos;re building the infrastructure for transparent, on-chain advertising
              on Stellar. If that excites you, we&apos;d love to talk.
            </p>
          </div>

          {/* No open roles — empty state */}
          <div
            className="rounded-2xl p-14 flex flex-col items-center text-center mb-16"
            style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.08)" }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: "rgba(235,255,69,.08)", border: "1px solid rgba(235,255,69,.15)" }}
            >
              <SearchNormal1 size={24} color="#EBFF45" variant="Linear" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No open positions right now</h2>
            <p className="text-sm text-white/45 max-w-sm leading-relaxed mb-8">
              We don&apos;t have any open roles at the moment, but we&apos;re always interested in
              hearing from exceptional people. Send us a speculative application and
              we&apos;ll keep you in mind for future openings.
            </p>
            <a
              href="mailto:careers@adryx.xyz?subject=Speculative application"
              className="c-btn-y"
            >
              <Briefcase size={16} color="#08080a" variant="Bold" />
              Send a speculative application
            </a>
          </div>

          {/* Values */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-8">How we work</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {values.map(({ title, desc }) => (
                <div
                  key={title}
                  className="p-6 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,.025)",
                    border: "1px solid rgba(255,255,255,.08)",
                    borderLeft: "2px solid rgba(235,255,69,.25)",
                  }}
                >
                  <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stay updated */}
          <div
            className="rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            style={{ background: "rgba(235,255,69,.04)", border: "1px solid rgba(235,255,69,.15)" }}
          >
            <div>
              <h3 className="text-base font-bold text-white mb-1">Stay in the loop</h3>
              <p className="text-sm text-white/50">
                Roles will be posted here first. Check back, or reach out directly.
              </p>
            </div>
            <Link href="/contact" className="c-btn-ghost shrink-0" style={{ padding: "10px 20px", fontSize: 13 }}>
              Contact us
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
