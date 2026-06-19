import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Location, DollarCircle, Chart, Flash, Lock, Brush } from "iconsax-react";

const features = [
  {
    icon: Location,
    title: "Smart Targeting",
    desc: "Reach your ideal audience with advanced targeting options including wallet holdings, on-chain activity, and DeFi behaviour.",
  },
  {
    icon: DollarCircle,
    title: "On-Chain Escrow",
    desc: "Campaign funds are secured in Soroban smart contracts on Stellar, ensuring transparent and fully automated payments.",
  },
  {
    icon: Chart,
    title: "Real-Time Analytics",
    desc: "Track impressions, clicks, conversions, and ROI with detailed dashboards updated in real time.",
  },
  {
    icon: Flash,
    title: "Instant Payments",
    desc: "Publishers receive USDC payouts instantly to their Stellar wallet after each verified interaction.",
  },
  {
    icon: Lock,
    title: "Wallet Authentication",
    desc: "Secure, password-free login with Stellar wallet signatures — you own your account.",
  },
  {
    icon: Brush,
    title: "Multiple Ad Formats",
    desc: "Support for banner, native, video, and interactive ad formats across web and mobile.",
  },
];

export default function FeaturesPage() {
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
              Platform features
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-4">
              Features
            </h1>
            <p className="text-lg text-white/50 max-w-xl">
              Everything you need to run successful ad campaigns on Stellar — built
              for the next generation of the open web.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid md:grid-cols-2 gap-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group flex gap-5 p-7 rounded-2xl transition-all"
                style={{
                  background: "rgba(255,255,255,.025)",
                  border: "1px solid rgba(255,255,255,.08)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center"
                  style={{ background: "rgba(235,255,69,.1)" }}
                >
                  <Icon size={22} color="#EBFF45" variant="Bold" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white mb-2">{title}</h2>
                  <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
