import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { TickCircle } from "iconsax-react";

const tiers = [
  {
    name: "Advertisers",
    price: "5%",
    unit: "of ad spend",
    desc: "Launch and manage campaigns with full transparency.",
    featured: false,
    items: [
      "Unlimited campaigns",
      "Real-time analytics",
      "On-chain escrow (Soroban)",
      "Automated USDC payouts",
    ],
    cta: { label: "Start advertising", href: "/signup" },
  },
  {
    name: "Publishers",
    price: "10%",
    unit: "of earnings",
    desc: "Monetise your audience and get paid instantly.",
    featured: true,
    items: [
      "Unlimited sites & apps",
      "Instant USDC payouts",
      "Multiple ad formats",
      "Detailed fill-rate reporting",
    ],
    cta: { label: "Become a publisher", href: "/signup" },
  },
  {
    name: "Enterprise",
    price: "Custom",
    unit: "volume pricing",
    desc: "High-volume or custom infrastructure needs.",
    featured: false,
    items: [
      "Volume discounts",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantees",
    ],
    cta: { label: "Talk to us", href: "mailto:hello@adryx.xyz" },
  },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#08080a] pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Hero */}
          <div className="text-center mb-16">
            <span
              className="c-eyebrow mb-5"
              style={{ color: "#EBFF45", borderColor: "rgba(235,255,69,.2)", background: "rgba(235,255,69,.08)" }}
            >
              <span
                className="c-dot"
                style={{ "--dot-color": "#EBFF45" } as React.CSSProperties}
              />
              No setup fees. Ever.
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-lg text-white/50 max-w-lg mx-auto">
              Pay only on successful delivery. No subscriptions, no minimums, no
              hidden charges.
            </p>
          </div>

          {/* Tier cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className="relative flex flex-col rounded-2xl p-8"
                style={{
                  background: tier.featured
                    ? "rgba(235,255,69,.04)"
                    : "rgba(255,255,255,.025)",
                  border: tier.featured
                    ? "1px solid rgba(235,255,69,.30)"
                    : "1px solid rgba(255,255,255,.08)",
                }}
              >
                {tier.featured && (
                  <span
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest"
                    style={{ background: "#EBFF45", color: "#08080a" }}
                  >
                    Most Popular
                  </span>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white/80 mb-3">
                    {tier.name}
                  </h3>
                  <div className="flex items-end gap-1 mb-1">
                    <span
                      className="text-5xl font-black tracking-tighter"
                      style={{ color: tier.featured ? "#EBFF45" : "#f5f5f5" }}
                    >
                      {tier.price}
                    </span>
                  </div>
                  <p className="text-sm text-white/40">{tier.unit}</p>
                  <p className="text-sm text-white/50 mt-3">{tier.desc}</p>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {tier.items.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-white/60">
                      <TickCircle size={16} color="#EBFF45" variant="Bold" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  href={tier.cta.href}
                  className={
                    tier.featured
                      ? "c-btn-y text-center"
                      : "flex items-center justify-center h-11 rounded-xl text-sm font-semibold text-white/70 hover:text-white transition-colors border border-white/10 hover:border-white/20 hover:bg-white/5"
                  }
                >
                  {tier.cta.label}
                </Link>
              </div>
            ))}
          </div>

          {/* Bottom note */}
          <p className="text-center text-sm text-white/30 mt-12">
            All fees are deducted automatically by the Soroban smart contract. No
            invoices, no billing cycles.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
