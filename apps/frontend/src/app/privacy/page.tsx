import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sections = [
  {
    title: "1. Information We Collect",
    content: "We collect information that you provide directly to us, including:",
    list: [
      "Stellar wallet address",
      "Email address (optional)",
      "Campaign and site information",
      "Usage data and analytics",
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: "We use the information we collect to:",
    list: [
      "Provide and maintain our services",
      "Process transactions and payments",
      "Send you technical notices and updates",
      "Respond to your comments and questions",
      "Analyze usage patterns and improve our platform",
    ],
  },
  {
    title: "3. Data Storage",
    content:
      "Your data is stored securely using industry-standard encryption. Campaign funds and payment information are stored on the Stellar blockchain, which is public and immutable.",
  },
  {
    title: "4. Data Sharing",
    content:
      "We do not sell your personal information. We may share your information with service providers who assist us in operating our platform, subject to confidentiality agreements.",
  },
  {
    title: "5. Your Rights",
    content: "You have the right to:",
    list: [
      "Access your personal data",
      "Correct inaccurate data",
      "Request deletion of your data",
      "Object to data processing",
      "Export your data",
    ],
  },
  {
    title: "6. Contact Us",
    contactEmail: "privacy@adryx.xyz",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#08080a] pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          {/* Hero */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
              Privacy Policy
            </h1>
            <p className="text-sm text-white/35">
              Last updated: June 19, 2025
            </p>
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
                  <ul className="space-y-2">
                    {sec.list.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-white/55 text-sm">
                        <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: "#EBFF45" }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {sec.contactEmail && (
                  <p className="text-white/60 leading-relaxed">
                    If you have questions about this Privacy Policy, please contact
                    us at{" "}
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
