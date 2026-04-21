"use client";
import { motion } from "framer-motion";
import { ShieldTick, Global, Repeat } from "iconsax-react";

const pillars = [
  {
    icon: <ShieldTick size={20} variant="Bold" color="#f97316" />,
    bg: "bg-primary/10",
    text: "text-primary",
    title: "Decentralized",
    desc: "No single point of control. Campaigns, payouts, and metrics live on the Solana blockchain — immutable and auditable by anyone.",
  },
  {
    icon: <Global size={20} variant="Bold" color="#a855f7" />,
    bg: "bg-purple-500/10",
    text: "text-purple-500",
    title: "Cross-Platform",
    desc: "One SDK for Web2 websites, mobile apps, and Web3 dApps. Reach every developer, every platform, every user.",
  },
  {
    icon: <Repeat size={20} variant="Bold" color="#06b6d4" />,
    bg: "bg-cyan-500/10",
    text: "text-cyan-500",
    title: "Transparent",
    desc: "Every impression, click, and payout is recorded on-chain. No black boxes. No hidden fees. Just verifiable truth.",
  },
];

export default function Solution() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="label-sm text-text-tertiary mb-3">The Solution</div>
          <h2 className="heading-2 mb-4">
            Introducing <span className="text-primary">Adryx</span>
          </h2>
          <p className="body text-text-secondary max-w-2xl mx-auto">
            A new kind of ad network — built on trust, powered by blockchain,
            and designed for the open web.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="card text-center group"
            >
              <div
                className={`w-10 h-10 rounded-lg ${p.bg} flex items-center justify-center ${p.text} mx-auto mb-4 transition-all duration-200 group-hover:scale-110`}
              >
                {p.icon}
              </div>
              <h3 className="heading-4 mb-2">{p.title}</h3>
              <p className="body-sm text-text-secondary">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
