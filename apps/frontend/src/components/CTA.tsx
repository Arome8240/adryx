"use client";
import { motion } from "framer-motion";
import { ArrowRight, DocumentText } from "iconsax-react";

export default function CTA() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="card-lg"
        >
          <span className="badge badge-primary mb-6">
            <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
            Now in Public Beta
          </span>

          <h2 className="heading-1 mb-4">
            Start Monetizing <span className="text-primary">Today</span>
          </h2>
          <p className="body text-text-secondary max-w-2xl mx-auto mb-10">
            Join thousands of developers already earning with Adryx. Set up in
            minutes, earn forever.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.a
              href="/publishers"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary"
            >
              Get Started Free
              <ArrowRight size={16} color="#000000" />
            </motion.a>
            <motion.a
              href="/dashboard"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-secondary"
            >
              <DocumentText size={16} color="#f0f0f5" />
              Launch Campaign
            </motion.a>
          </div>

          <p className="mt-6 label-xs text-text-tertiary">
            No credit card required. Free tier available for all publishers.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
