import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
          <p className="text-white/60 mb-12">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-white/70 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Adryx, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">2. Description of Service</h2>
              <p>
                Adryx is a decentralized advertising platform that connects advertisers with publishers using blockchain technology. We provide tools for creating campaigns, displaying ads, and processing payments via smart contracts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">3. User Responsibilities</h2>
              <p className="mb-4">As a user, you agree to:</p>
              <ul className="space-y-2 ml-6">
                <li>• Provide accurate and complete information</li>
                <li>• Maintain the security of your wallet and credentials</li>
                <li>• Comply with all applicable laws and regulations</li>
                <li>• Not engage in fraudulent or malicious activities</li>
                <li>• Not create misleading or inappropriate ad content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">4. Fees and Payments</h2>
              <p className="mb-4">
                Adryx charges platform fees on transactions:
              </p>
              <ul className="space-y-2 ml-6">
                <li>• Advertisers: 5% fee on ad spend</li>
                <li>• Publishers: 10% fee on earnings</li>
              </ul>
              <p className="mt-4">
                All payments are processed through Solana smart contracts. Transaction fees (gas) are paid by the transaction initiator.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">5. Content Guidelines</h2>
              <p className="mb-4">Prohibited content includes:</p>
              <ul className="space-y-2 ml-6">
                <li>• Illegal products or services</li>
                <li>• Adult or explicit content</li>
                <li>• Misleading or fraudulent claims</li>
                <li>• Hate speech or discriminatory content</li>
                <li>• Malware or phishing attempts</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">6. Limitation of Liability</h2>
              <p>
                Adryx is provided "as is" without warranties. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform. Smart contract interactions are irreversible.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">7. Termination</h2>
              <p>
                We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">8. Changes to Terms</h2>
              <p>
                We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">9. Contact</h2>
              <p>
                For questions about these Terms, contact us at{" "}
                <a href="mailto:legal@adryx.io" className="text-orange-500 hover:text-orange-400">
                  legal@adryx.io
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
