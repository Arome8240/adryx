import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Location, DollarCircle, Chart, Flash, Lock, Brush } from 'iconsax-react';

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
              <div className="flex items-center gap-3 mb-4">
                <Location size={32} color="#f97316" variant="Bold" />
                <h2 className="text-2xl font-bold">Smart Targeting</h2>
              </div>
              <p className="text-white/60">
                Reach your ideal audience with advanced targeting options including demographics, interests, and behavior.
              </p>
            </div>

            <div className="glass p-8 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <DollarCircle size={32} color="#f97316" variant="Bold" />
                <h2 className="text-2xl font-bold">On-Chain Escrow</h2>
              </div>
              <p className="text-white/60">
                Campaign funds are secured in Solana smart contracts, ensuring transparent and automated payments.
              </p>
            </div>

            <div className="glass p-8 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Chart size={32} color="#f97316" variant="Bold" />
                <h2 className="text-2xl font-bold">Real-Time Analytics</h2>
              </div>
              <p className="text-white/60">
                Track impressions, clicks, conversions, and ROI with detailed analytics dashboards.
              </p>
            </div>

            <div className="glass p-8 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Flash size={32} color="#f97316" variant="Bold" />
                <h2 className="text-2xl font-bold">Instant Payments</h2>
              </div>
              <p className="text-white/60">
                Publishers receive payments instantly to their Solana wallet after each verified interaction.
              </p>
            </div>

            <div className="glass p-8 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Lock size={32} color="#f97316" variant="Bold" />
                <h2 className="text-2xl font-bold">Wallet Authentication</h2>
              </div>
              <p className="text-white/60">
                Secure login with Solana wallet signatures - no passwords needed.
              </p>
            </div>

            <div className="glass p-8 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Brush size={32} color="#f97316" variant="Bold" />
                <h2 className="text-2xl font-bold">Multiple Ad Formats</h2>
              </div>
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
