import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
            <p className="text-xl text-white/60">
              No hidden fees. Pay only for what you use.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="glass p-8 rounded-2xl border border-white/10">
              <h3 className="text-2xl font-bold mb-2">Advertisers</h3>
              <div className="text-4xl font-bold mb-4">5%</div>
              <p className="text-white/60 mb-6">Platform fee on ad spend</p>
              <ul className="space-y-3 text-sm text-white/60">
                <li>✓ Unlimited campaigns</li>
                <li>✓ Real-time analytics</li>
                <li>✓ On-chain escrow</li>
                <li>✓ Automated payments</li>
              </ul>
            </div>

            <div className="glass p-8 rounded-2xl border border-orange-500/50 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-orange-500 rounded-full text-xs font-semibold">
                POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2">Publishers</h3>
              <div className="text-4xl font-bold mb-4">10%</div>
              <p className="text-white/60 mb-6">Platform fee on earnings</p>
              <ul className="space-y-3 text-sm text-white/60">
                <li>✓ Unlimited sites</li>
                <li>✓ Instant payouts</li>
                <li>✓ Multiple ad formats</li>
                <li>✓ Detailed reporting</li>
              </ul>
            </div>

            <div className="glass p-8 rounded-2xl border border-white/10">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <div className="text-4xl font-bold mb-4">Custom</div>
              <p className="text-white/60 mb-6">Tailored solutions</p>
              <ul className="space-y-3 text-sm text-white/60">
                <li>✓ Volume discounts</li>
                <li>✓ Dedicated support</li>
                <li>✓ Custom integrations</li>
                <li>✓ SLA guarantees</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
