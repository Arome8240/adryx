import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-white/60 mb-12">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-white/70 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">1. Information We Collect</h2>
              <p className="mb-4">We collect information that you provide directly to us, including:</p>
              <ul className="space-y-2 ml-6">
                <li>• Solana wallet address</li>
                <li>• Email address (optional)</li>
                <li>• Campaign and site information</li>
                <li>• Usage data and analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">2. How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="space-y-2 ml-6">
                <li>• Provide and maintain our services</li>
                <li>• Process transactions and payments</li>
                <li>• Send you technical notices and updates</li>
                <li>• Respond to your comments and questions</li>
                <li>• Analyze usage patterns and improve our platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">3. Data Storage</h2>
              <p>
                Your data is stored securely using industry-standard encryption. Campaign funds and payment information are stored on the Solana blockchain, which is public and immutable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">4. Data Sharing</h2>
              <p>
                We do not sell your personal information. We may share your information with service providers who assist us in operating our platform, subject to confidentiality agreements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">5. Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="space-y-2 ml-6">
                <li>• Access your personal data</li>
                <li>• Correct inaccurate data</li>
                <li>• Request deletion of your data</li>
                <li>• Object to data processing</li>
                <li>• Export your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">6. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:privacy@adryx.io" className="text-orange-500 hover:text-orange-400">
                  privacy@adryx.io
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
