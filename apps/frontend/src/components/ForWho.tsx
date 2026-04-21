"use client";
import { motion } from "framer-motion";
import { Code, Briefcase, People } from "iconsax-react";

const audiences = [
  {
    icon: <Code size={20} variant="Bold" color="#f97316" />,
    color: "text-primary",
    bg: "bg-primary/10",
    title: "Developers",
    subtitle: "Web2 & Web3",
    desc: "Whether you're building a SaaS product, a mobile app, or a dApp on Solana — Adryx gives you a revenue stream that's transparent, instant, and fully in your control.",
    perks: ["Drop-in SDK", "Real-time SOL payouts", "Works with any stack"],
    cta: "Start Earning",
  },
  {
    icon: <Briefcase size={20} variant="Bold" color="#a855f7" />,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    title: "Advertisers",
    subtitle: "Brands & Projects",
    desc: "Reach engaged Web2 and Web3 audiences with campaigns that are verifiable on-chain. Set your budget, define your audience, and watch every dollar work.",
    perks: [
      "On-chain campaign tracking",
      "Fraud-proof metrics",
      "Web2 + Web3 reach",
    ],
    cta: "Launch Campaign",
  },
  {
    icon: <People size={20} variant="Bold" color="#22c55e" />,
    color: "text-green-500",
    bg: "bg-green-500/10",
    title: "Users",
    subtitle: "Earn for Engagement",
    desc: "Opt in to earn rewards for engaging with ads. Your attention has value — Adryx lets you capture a share of it, paid directly to your wallet.",
    perks: ["Opt-in rewards", "Privacy preserved", "Direct wallet payouts"],
    cta: "Learn More",
  },
];

export default function ForWho() {
  return (
    <section id="for-who" className="relative py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="label-sm text-text-tertiary mb-3">Who It&apos;s For</div>
          <h2 className="heading-2 mb-4">
            Built for the{" "}
            <span className="text-primary">entire ecosystem</span>
          </h2>
          <p className="body text-text-secondary max-w-2xl mx-auto">
            Adryx aligns incentives for developers, advertisers, and users —
            everyone wins.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {audiences.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="card flex flex-col gap-4 group"
            >
              <div
                className={`w-10 h-10 rounded-lg ${a.bg} flex items-center justify-center ${a.color} transition-all duration-200 group-hover:scale-110`}
              >
                {a.icon}
              </div>
              <div>
                <div className="label-xs text-text-tertiary mb-1">
                  {a.subtitle}
                </div>
                <h3 className="heading-4">{a.title}</h3>
              </div>
              <p className="body-sm text-text-secondary">{a.desc}</p>
              <ul className="flex flex-col gap-2">
                {a.perks.map((perk) => (
                  <li
                    key={perk}
                    className="flex items-center gap-2 body-sm text-text-secondary"
                  >
                    <span
                      className={`w-1 h-1 rounded-full shrink-0 ${a.color}`}
                    />
                    {perk}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className={`mt-auto inline-flex items-center gap-1 label-sm ${a.color} hover:opacity-70 transition-opacity`}
              >
                {a.cta} →
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
