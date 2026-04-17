import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Adryx</h1>
          <p className="text-xl text-white/60 mb-12">
            Building the future of decentralized advertising
          </p>

          <div className="space-y-8 text-white/70 leading-relaxed">
            <div className="glass p-8 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-bold mb-4 text-white">Our Mission</h2>
              <p>
                Adryx is revolutionizing digital advertising by bringing transparency, fairness, and instant payments to the ecosystem. Built on Solana blockchain, we enable advertisers and publishers to connect directly without intermediaries.
              </p>
            </div>

            <div className="glass p-8 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-bold mb-4 text-white">Why Blockchain?</h2>
              <p className="mb-4">
                Traditional advertising platforms suffer from opacity, delayed payments, and high fees. Blockchain technology solves these problems by:
              </p>
              <ul className="space-y-2 ml-6">
                <li>• Providing transparent, verifiable ad metrics</li>
                <li>• Enabling instant, automated payments</li>
                <li>• Reducing platform fees through automation</li>
                <li>• Eliminating payment disputes with smart contracts</li>
              </ul>
            </div>

            <div className="glass p-8 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-bold mb-4 text-white">Built on Solana</h2>
              <p>
                We chose Solana for its high throughput, low transaction costs, and fast finality. This enables us to process millions of ad interactions efficiently while keeping costs minimal for both advertisers and publishers.
              </p>
            </div>

            <div className="glass p-8 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-bold mb-4 text-white">Open Source</h2>
              <p>
                Adryx is committed to transparency and community-driven development. Our smart contracts and core infrastructure are open source, allowing anyone to audit, contribute, and build on top of our platform.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
