"use client";
import { motion } from "framer-motion";
import { Warning2, Lock, EmojiSad } from "iconsax-react";

const problems = [
  {
    icon: <Lock size={20} variant="Bold" color="#ef4444" />,
    title: "Centralized & Opaque",
    desc: "Web2 ad networks control your data, your payouts, and your audience — with zero transparency into how decisions are made.",
  },
  {
    icon: <Warning2 size={20} variant="Bold" color="#ef4444" />,
    title: "Developers Earn Less",
    desc: "Middlemen take the lion's share. Publishers see pennies on the dollar while platforms pocket the rest.",
  },
  {
    icon: <EmojiSad size={20} variant="Bold" color="#ef4444" />,
    title: "dApps Have No Options",
    desc: "Web3 apps are left out entirely. No ad network supports on-chain apps, leaving dApp developers with no monetization path.",
  },
];

export default function Problem() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="label-sm text-text-tertiary mb-3">The Problem</div>
          <h2 className="heading-2 mb-4">
            The current system is <span className="text-red-500">broken</span>
          </h2>
          <p className="body text-text-secondary max-w-2xl mx-auto">
            Advertising today is built on trust you can&apos;t verify, revenue
            you can&apos;t audit, and platforms that don&apos;t serve you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="card group"
            >
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 mb-4 transition-all duration-200 group-hover:bg-red-500/20">
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
