"use client";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "iconsax-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4, delay, ease: "easeOut" as const },
});

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary-500/5 blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-32 flex flex-col items-center text-center gap-6">
        {/* Badge */}
        <motion.div {...fadeUp(0)}>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-bg-tertiary border border-dark-border text-xs font-medium text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
            Powered by Solana
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.05)}
          className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] max-w-4xl"
          style={{ letterSpacing: '-0.02em' }}
        >
          Monetize Your App{" "}
          <span className="text-primary-500">Without Limits</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          {...fadeUp(0.1)}
          className="text-lg md:text-xl text-secondary max-w-2xl leading-relaxed"
        >
          The decentralized ad network for Web2 and Web3. Transparent payouts,
          on-chain campaigns, and a developer SDK that just works.
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fadeUp(0.15)}
          className="flex flex-col sm:flex-row gap-3 mt-2"
        >
          <a
            href="/publishers"
            className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm hover-lift"
          >
            Start Earning
            <ArrowRight size={16} color="#000000" />
          </a>
          <a
            href="/dashboard"
            className="btn-secondary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm hover-lift"
          >
            <Play size={16} variant="Bold" color="#f0f0f5" />
            Launch Campaign
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          {...fadeUp(0.2)}
          className="flex flex-col sm:flex-row gap-12 mt-12 pt-8 border-t border-dark-border w-full max-w-2xl justify-center"
        >
          {[
            { value: "$2M+", label: "Paid to Developers" },
            { value: "10K+", label: "Active Campaigns" },
            { value: "99.9%", label: "Uptime" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="text-3xl font-bold text-primary-500">
                {stat.value}
              </span>
              <span className="text-sm text-tertiary">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Visual illustration */}
        <motion.div
          {...fadeUp(0.25)}
          className="relative mt-16 w-full max-w-4xl"
        >
          <div className="card-linear p-6 hover-lift">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-error-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-warning-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-success-500" />
              <span className="ml-2 text-xs text-tertiary font-mono">
                adryx-sdk.js
              </span>
            </div>
            <pre className="text-left text-sm font-mono text-secondary overflow-x-auto leading-relaxed">
              <code>{`import { Adryx } from '@adryx/sdk'

const ads = new Adryx({
  publisherId: 'pub_xxxxxxxx',
  network: 'solana-mainnet',
})

// Render an ad unit
ads.display('#ad-container', {
  format: 'banner',
  onRevenue: (sol) => console.log(\`Earned: \${sol} SOL\`)
})`}</code>
            </pre>
          </div>
          {/* Floating revenue card */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 -right-4 card-linear px-4 py-3 hidden lg:block"
          >
            <div className="text-xs text-tertiary mb-0.5">
              Today&apos;s Revenue
            </div>
            <div className="text-lg font-bold text-primary-500">+0.42 SOL</div>
          </motion.div>
          {/* Floating on-chain badge */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-4 -left-4 card-linear px-4 py-3 hidden lg:block"
          >
            <div className="text-xs text-tertiary mb-0.5">
              Verified On-Chain
            </div>
            <div className="text-sm font-semibold text-success-500">
              TX: 0x4f2a...9c1e
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
