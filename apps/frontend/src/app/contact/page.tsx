import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-white/60 mb-12">
            Get in touch with our team
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="glass p-8 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-bold mb-4">📧 Email</h2>
              <p className="text-white/60 mb-2">General inquiries</p>
              <a href="mailto:hello@adryx.io" className="text-orange-500 hover:text-orange-400">
                hello@adryx.io
              </a>
              <p className="text-white/60 mt-4 mb-2">Support</p>
              <a href="mailto:support@adryx.io" className="text-orange-500 hover:text-orange-400">
                support@adryx.io
              </a>
            </div>

            <div className="glass p-8 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-bold mb-4">💬 Community</h2>
              <p className="text-white/60 mb-2">Discord</p>
              <a href="#" className="text-orange-500 hover:text-orange-400 block mb-4">
                Join our Discord
              </a>
              <p className="text-white/60 mb-2">Twitter</p>
              <a href="#" className="text-orange-500 hover:text-orange-400">
                @adryx_io
              </a>
            </div>
          </div>

          <div className="glass p-8 rounded-2xl border border-white/10">
            <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-orange-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-orange-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-orange-500"
                  placeholder="How can we help?"
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
