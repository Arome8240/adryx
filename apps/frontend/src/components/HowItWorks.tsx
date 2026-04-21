"use client";
import { motion } from "framer-motion";
import { Additem, Code1, Monitor, DollarCircle } from "iconsax-react";

const steps = [
  {
    icon: <Additem size={20} variant="Bold" />,
    color: "text-primary",
    bg: "bg-primary/10",
    step: "01",
    title: "Advertisers Create Campaigns",
    desc: "Set your budget, targeting, and creative assets. Campaign parameters are written to Solana — immutable and verifiable.",
  },
  {
    icon: <Code1 size={20} variant="Bold" />,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    step: "02",
    title: "Developers Integrate the SDK",
    desc: "Drop in a single script tag or npm package. Works with any framework — React, Next.js, Vue, or plain HTML.",
  },
  {
    icon: <Monitor size={20} variant="Bold" />,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    step: "03",
    title: "Ads Are Displayed",
    desc: "Relevant, privacy-respecting ads are served to your users. Every impression is logged on-chain for full transparency.",
  },
  {
    icon: <DollarCircle size={20} variant="Bold" />,
    color: "text-green-500",
    bg: "bg-green-500/10",
    step: "04",
    title: "Revenue Is Shared Transparently",
    desc: "SOL flows directly to publisher wallets in real time. No intermediaries, no delays, no hidden cuts.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 overflow-hidden border-y border-border">
      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="label-sm text-text-tertiary mb-3">How It Works</div>
          <h2 className="heading-2 mb-4">
            Up and running in <span className="text-primary">minutes</span>
          </h2>
          <p className="body text-text-secondary max-w-2xl mx-auto">
            Four simple steps from campaign creation to transparent revenue
            sharing.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-4"
            >
              <div
                className={`relative w-12 h-12 rounded-lg ${s.bg} flex items-center justify-center ${s.color} transition-all duration-200 hover:scale-110`}
              >
                {s.icon}
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-bg-secondary border border-border flex items-center justify-center text-[10px] font-medium text-text-tertiary">
                  {s.step}
                </span>
              </div>
              <h3 className="heading-4">{s.title}</h3>
              <p className="body-sm text-text-secondary">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
