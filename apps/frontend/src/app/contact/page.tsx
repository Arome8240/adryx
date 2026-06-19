"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MessageQuestion, Sms, Buildings2 } from "iconsax-react";
import Link from "next/link";
import { useState } from "react";

const channels = [
  {
    icon: Sms,
    title: "General enquiries",
    desc: "Questions about the platform, pricing, or how Adryx works.",
    email: "hello@adryx.xyz",
  },
  {
    icon: MessageQuestion,
    title: "Publisher support",
    desc: "Help with ad placements, payouts, or your publisher account.",
    email: "publishers@adryx.xyz",
  },
  {
    icon: Buildings2,
    title: "Enterprise & partnerships",
    desc: "Custom volume pricing, white-label solutions, or integration deals.",
    email: "enterprise@adryx.xyz",
  },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:hello@adryx.xyz?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#08080a] pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          {/* Hero */}
          <div className="mb-14">
            <span
              className="c-eyebrow mb-5"
              style={{ color: "#EBFF45", borderColor: "rgba(235,255,69,.2)", background: "rgba(235,255,69,.08)" }}
            >
              <span className="c-dot" style={{ "--dot-color": "#EBFF45" } as React.CSSProperties} />
              Get in touch
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-4">
              Contact us
            </h1>
            <p className="text-lg text-white/50 max-w-lg">
              We&apos;re a small team that moves fast. You&apos;ll hear back from a real person,
              usually within one business day.
            </p>
          </div>

          {/* Channel cards */}
          <div className="grid md:grid-cols-3 gap-5 mb-12">
            {channels.map(({ icon: Icon, title, desc, email }) => (
              <div
                key={title}
                className="flex flex-col gap-4 p-7 rounded-2xl"
                style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.08)" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(235,255,69,.1)" }}
                >
                  <Icon size={20} color="#EBFF45" variant="Bold" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white mb-1">{title}</h2>
                  <p className="text-sm text-white/50 leading-relaxed mb-4">{desc}</p>
                  <a href={`mailto:${email}`} className="c-link text-sm font-medium">
                    {email}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Contact form + sidebar */}
          <div className="grid md:grid-cols-5 gap-8">
            {/* Form */}
            <div
              className="md:col-span-3 rounded-2xl p-8"
              style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.08)" }}
            >
              <h2 className="text-xl font-bold text-white mb-6">Send us a message</h2>

              {sent ? (
                <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(235,255,69,.12)" }}
                  >
                    <span style={{ fontSize: 22 }}>✓</span>
                  </div>
                  <p className="text-white font-semibold">Email client opened</p>
                  <p className="text-sm text-white/40">
                    Your message is ready to send. If your email client didn't open,{" "}
                    <a href="mailto:hello@adryx.xyz" className="c-link">email us directly</a>.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }}
                    className="text-sm text-white/40 hover:text-white/70 transition-colors mt-2"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="c-input"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="c-input"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      className="c-input"
                      style={{ height: "auto", resize: "vertical", paddingTop: 10, paddingBottom: 10 }}
                      placeholder="How can we help?"
                    />
                  </div>
                  <button type="submit" className="c-btn-y w-full justify-center">
                    Send message
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div className="md:col-span-2 flex flex-col gap-5">
              <div
                className="rounded-2xl p-6"
                style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.08)" }}
              >
                <h3 className="text-sm font-bold text-white mb-2">Legal</h3>
                <p className="text-sm text-white/50 mb-4 leading-relaxed">
                  For privacy or data removal requests contact{" "}
                  <a href="mailto:legal@adryx.xyz" className="c-link">legal@adryx.xyz</a>.
                </p>
                <div className="flex gap-4">
                  <Link href="/privacy" className="text-xs text-white/40 hover:text-white/70 transition-colors">
                    Privacy →
                  </Link>
                  <Link href="/terms" className="text-xs text-white/40 hover:text-white/70 transition-colors">
                    Terms →
                  </Link>
                </div>
              </div>

              <div
                className="rounded-2xl p-6"
                style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.08)" }}
              >
                <h3 className="text-sm font-bold text-white mb-2">Careers</h3>
                <p className="text-sm text-white/50 mb-4 leading-relaxed">
                  Interested in joining the team? View our open roles.
                </p>
                <Link href="/careers" className="c-link text-sm font-medium">
                  Open positions →
                </Link>
              </div>

              <div
                className="rounded-2xl p-6"
                style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.08)" }}
              >
                <h3 className="text-sm font-bold text-white mb-3">Response time</h3>
                <div className="space-y-2">
                  {[
                    ["General", "1–2 business days"],
                    ["Support", "Same business day"],
                    ["Enterprise", "Within 4 hours"],
                  ].map(([type, time]) => (
                    <div key={type} className="flex items-center justify-between text-sm">
                      <span className="text-white/40">{type}</span>
                      <span className="text-white/70">{time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
