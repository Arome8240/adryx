import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function DocsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Documentation</h1>
          <p className="text-xl text-white/60 mb-12">
            Everything you need to integrate Adryx into your application
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <Link href="/docs/quickstart" className="glass p-8 rounded-2xl border border-white/10 hover:border-orange-500/50 transition-colors">
              <h2 className="text-2xl font-bold mb-4">🚀 Quick Start</h2>
              <p className="text-white/60">
                Get up and running in 5 minutes with our quick start guide.
              </p>
            </Link>

            <Link href="/docs/sdk" className="glass p-8 rounded-2xl border border-white/10 hover:border-orange-500/50 transition-colors">
              <h2 className="text-2xl font-bold mb-4">📦 SDK Reference</h2>
              <p className="text-white/60">
                Complete API reference for JavaScript, TypeScript, and Rust SDKs.
              </p>
            </Link>

            <Link href="/docs/smart-contracts" className="glass p-8 rounded-2xl border border-white/10 hover:border-orange-500/50 transition-colors">
              <h2 className="text-2xl font-bold mb-4">⛓️ Smart Contracts</h2>
              <p className="text-white/60">
                Learn about our Solana smart contracts and on-chain architecture.
              </p>
            </Link>

            <a href="https://github.com/adryx" target="_blank" rel="noopener noreferrer" className="glass p-8 rounded-2xl border border-white/10 hover:border-orange-500/50 transition-colors">
              <h2 className="text-2xl font-bold mb-4">💻 GitHub</h2>
              <p className="text-white/60">
                View our open-source code and contribute to the project.
              </p>
            </a>
          </div>

          <div className="mt-16 glass p-8 rounded-2xl border border-white/10">
            <h2 className="text-2xl font-bold mb-6">API Endpoints</h2>
            <div className="space-y-4 font-mono text-sm">
              <div>
                <span className="text-green-400">POST</span> <span className="text-white/60">/api/v1/auth/register</span>
              </div>
              <div>
                <span className="text-green-400">POST</span> <span className="text-white/60">/api/v1/auth/wallet-login</span>
              </div>
              <div>
                <span className="text-blue-400">GET</span> <span className="text-white/60">/api/v1/campaigns</span>
              </div>
              <div>
                <span className="text-green-400">POST</span> <span className="text-white/60">/api/v1/campaigns</span>
              </div>
              <div>
                <span className="text-blue-400">GET</span> <span className="text-white/60">/api/v1/analytics/dashboard</span>
              </div>
            </div>
            <a href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3001'}/api/docs`} target="_blank" rel="noopener noreferrer" className="inline-block mt-6 px-6 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors">
              View Full API Docs
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
