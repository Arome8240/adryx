"use client";
import { motion } from "framer-motion";
import { Chainlink, Flash, Code, Eye, ShieldCross } from "iconsax-react";

const features = [
  {
    icon: <Chainlink size={20} variant="Bold" color="#f97316" />,
    color: "text-primary-500",
    bg: "bg-primary-500/10",
    border: "border-primary-500/20",
    title: "On-Chain Ad Campaigns",
    desc: "Create and manage campaigns directly on Solana. Every spend, every impression — fully auditable.",
  },
  {
    icon: <Flash size={20} variant="Bold" color="#06b6d4" />,
    color: "text-info-500",
    bg: "bg-info-500/10",
    border: "border-info-500/20",
    title: "Instant Payouts",
    desc: "Revenue flows directly to your wallet in SOL. No waiting 30 days. No minimum thresholds. Just instant settlement.",
  },
  {
    icon: <Code size={20} variant="Bold" color="#22c55e" />,
    color: "text-success-500",
    bg: "bg-success-500/10",
    border: "border-success-500/20",
    title: "Developer SDK",
    desc: "Drop in our lightweight SDK with a single line of code. Works with React, Vue, vanilla JS, and any mobile framework.",
  },
  {
    icon: <Eye size={20} variant="Bold" color="#eab308" />,
    color: "text-warning-500",
    bg: "bg-warning-500/10",
    border: "border-warning-500/20",
    title: "Privacy-First Ads",
    desc: "No invasive tracking. No third-party cookies. Contextual targeting that respects your users and complies with regulations.",
  },
  {
    icon: <ShieldCross size={20} variant="Bold" color="#ef4444" />,
    color: "text-error-500",
    bg: "bg-error-500/10",
    border: "border-error-500/20",
    title: "Fraud-Resistant Metrics",
    desc: "On-chain verification makes click fraud and impression stuffing impossible. Every metric is cryptographically proven.",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <span className="label-small text-primary-500">
            Features
          </span>
          <h2 className="heading-2 mt-3">
            Everything you need to{" "}
            <span className="text-primary-500">monetize</span>
          </h2>
          <p className="body-large text-secondary mt-4 max-w-2xl mx-auto">
            Built for developers who demand transparency, speed, and control
            over their revenue.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="card-linear hover-lift p-6"
            >
              <div
                className={`w-10 h-10 rounded-lg ${f.bg} flex items-center justify-center ${f.color} mb-4`}
              >
                {f.icon}
              </div>
              <h3 className="heading-4 mb-2">{f.title}</h3>
              <p className="body-small text-secondary leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}

          {/* Wide CTA card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="card-linear hover-lift p-6 flex flex-col justify-between bg-gradient-to-br from-primary-500/5 to-transparent"
          >
            <div>
              <h3 className="heading-4 mb-2">And much more...</h3>
              <p className="body-small text-secondary leading-relaxed">
                Analytics dashboard, A/B testing, multi-chain support, and a
                growing ecosystem of integrations.
              </p>
            </div>
            <a
              href="/docs"
              className="mt-4 text-sm font-medium text-primary-500 hover:text-primary-400 transition-colors inline-flex items-center gap-1"
            >
              View full docs →
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
