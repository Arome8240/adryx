import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Features</h1>
          <p className="text-xl text-white/60 mb-12">
            Everything you need to run successful ad campaigns on the blockchain
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-bold mb-4">🎯 Smart Targeting</h2>
              <p className="text-white/60">
                Reach your ideal audience with advanced targeting options including demographics, interests, and behavior.
              </p>
            </div>

            <div className="glass p-8 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-bold mb-4">💰 On-Chain Escrow</h2>
              <p className="text-white/60">
                Campaign funds are secured in Solana smart contracts, ensuring transparent and automated payments.
              </p>
            </div>

            <div className="glass p-8 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-bold mb-4">📊 Real-Time Analytics</h2>
              <p className="text-white/60">
                Track impressions, clicks, conversions, and ROI with detailed analytics dashboards.
              </p>
            </div>

            <div className="glass p-8 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-bold mb-4">⚡ Instant Payments</h2>
              <p className="text-white/60">
                Publishers receive payments instantly to their Solana wallet after each verified interaction.
              </p>
            </div>

            <div className="glass p-8 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-bold mb-4">🔐 Wallet Authentication</h2>
              <p className="text-white/60">
                Secure login with Solana wallet signatures - no passwords needed.
              </p>
            </div>

            <div className="glass p-8 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-bold mb-4">🎨 Multiple Ad Formats</h2>
              <p className="text-white/60">
                Support for banner, native, video, and interactive ad formats.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
