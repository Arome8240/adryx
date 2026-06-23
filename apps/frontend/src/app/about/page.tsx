import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Global, Code1, Flash, ShieldTick } from "iconsax-react";
import { URLS } from "@/lib/urls";

const pillars = [
  {
    icon: Global,
    title: "Our mission",
    desc: "Adryx is rebuilding digital advertising on transparent rails. Advertisers and publishers connect directly — no intermediaries, no opaque auctions, no 60-day payment cycles. Every impression is verified, every payout is instant.",
  },
  {
    icon: Flash,
    title: "Why Stellar",
    desc: "We chose Stellar for its sub-second finality, near-zero transaction fees, and first-class USDC support. Soroban smart contracts give us programmable escrow without the gas costs of EVM chains — making micro-payouts economically viable at any scale.",
  },
  {
    icon: Code1,
    title: "Open by default",
    desc: "Our Soroban contracts are open source. Anyone can audit the escrow logic, verify fee calculations, and build on top of our payment primitives. Transparency isn't a feature — it's the foundation.",
  },
  {
    icon: ShieldTick,
    title: "Publisher-first",
    desc: "Most ad networks treat publishers as an afterthought. We don't. Earnings accrue to your wallet in real time. There are no minimum thresholds, no payment delays, and no platform that holds your money.",
  },
];

const stats = [
  { value: "< 5 s", label: "Average payout time" },
  { value: "$0.00", label: "Setup cost" },
  { value: "100%", label: "On-chain verifiable" },
  { value: "USDC", label: "Settlement currency" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#08080a] pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Hero */}
          <div className="mb-14">
            <span
              className="c-eyebrow mb-5"
              style={{ color: "#EBFF45", borderColor: "rgba(235,255,69,.2)", background: "rgba(235,255,69,.08)" }}
            >
              <span className="c-dot" style={{ "--dot-color": "#EBFF45" } as React.CSSProperties} />
              About Adryx
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-5">
              Advertising for the{" "}
              <span style={{ color: "#EBFF45" }}>open web</span>
            </h1>
            <p className="text-lg text-white/50 max-w-xl leading-relaxed">
              We&apos;re building the infrastructure layer for honest, instant, on-chain
              advertising — starting with Stellar and USDC.
            </p>
          </div>

          {/* Stats strip */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-px mb-14 rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,.08)" }}
          >
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center py-8 px-4 text-center"
                style={{ background: "rgba(255,255,255,.025)" }}
              >
                <span
                  className="text-3xl font-black tracking-tight mb-1"
                  style={{ color: "#EBFF45" }}
                >
                  {value}
                </span>
                <span className="text-xs text-white/40 uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>

          {/* Pillars */}
          <div className="space-y-5 mb-14">
            {pillars.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex gap-6 p-7 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,.025)",
                  border: "1px solid rgba(255,255,255,.08)",
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(235,255,69,.1)" }}
                >
                  <Icon size={20} color="#EBFF45" variant="Bold" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white mb-2">{title}</h2>
                  <p className="text-sm text-white/55 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA row */}
          <div className="flex flex-wrap gap-4">
            <Link href={URLS.signup} className="c-btn-y">
              Get started
            </Link>
            <Link
              href="/contact"
              className="c-btn-ghost"
              style={{ padding: "10px 22px", fontSize: 14 }}
            >
              Talk to the team
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
