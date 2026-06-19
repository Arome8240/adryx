import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Section = {
  title: string;
  content?: string;
  list?: string[];
  note?: string;
  contactEmail?: string;
};

const sections: Section[] = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing and using Adryx, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.",
  },
  {
    title: "2. Description of Service",
    content:
      "Adryx is a decentralised advertising platform that connects advertisers with publishers using blockchain technology. We provide tools for creating campaigns, displaying ads, and processing payments via Soroban smart contracts on the Stellar network.",
  },
  {
    title: "3. User Responsibilities",
    content: "As a user, you agree to:",
    list: [
      "Provide accurate and complete information",
      "Maintain the security of your wallet and credentials",
      "Comply with all applicable laws and regulations",
      "Not engage in fraudulent or malicious activities",
      "Not create misleading or inappropriate ad content",
    ],
  },
  {
    title: "4. Fees and Payments",
    content: "Adryx charges platform fees on transactions:",
    list: [
      "Advertisers: 5% fee on ad spend",
      "Publishers: 10% fee on earnings",
    ],
    note: "All payments are processed through Soroban smart contracts on Stellar. Transaction fees (network fees) are paid by the transaction initiator.",
  },
  {
    title: "5. Content Guidelines",
    content: "Prohibited content includes:",
    list: [
      "Illegal products or services",
      "Adult or explicit content",
      "Misleading or fraudulent claims",
      "Hate speech or discriminatory content",
      "Malware or phishing attempts",
    ],
  },
  {
    title: "6. Limitation of Liability",
    content:
      "Adryx is provided \"as is\" without warranties. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform. Smart contract interactions are irreversible.",
  },
  {
    title: "7. Termination",
    content:
      "We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activities.",
  },
  {
    title: "8. Changes to Terms",
    content:
      "We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the new terms.",
  },
  {
    title: "9. Contact",
    contactEmail: "legal@adryx.xyz",
  },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#08080a] pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          {/* Hero */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
              Terms of Service
            </h1>
            <p className="text-sm text-white/35">Last updated: June 19, 2025</p>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map((sec) => (
              <section
                key={sec.title}
                className="pl-5"
                style={{ borderLeft: "2px solid rgba(235,255,69,.18)" }}
              >
                <h2 className="text-xl font-bold text-white mb-3">{sec.title}</h2>

                {sec.content && (
                  <p className="text-white/60 leading-relaxed mb-3">{sec.content}</p>
                )}

                {sec.list && (
                  <ul className="space-y-2 mb-3">
                    {sec.list.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-white/55 text-sm">
                        <span
                          className="mt-1.5 w-1 h-1 rounded-full shrink-0"
                          style={{ background: "#EBFF45" }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {sec.note && (
                  <p className="text-white/50 text-sm leading-relaxed">{sec.note}</p>
                )}

                {sec.contactEmail && (
                  <p className="text-white/60 leading-relaxed">
                    For questions about these Terms, contact us at{" "}
                    <a href={`mailto:${sec.contactEmail}`} className="c-link">
                      {sec.contactEmail}
                    </a>
                  </p>
                )}
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
