"use client";
import { motion } from "framer-motion";
import { Code1, Copy, DocumentCode, Book1 } from "iconsax-react";
import { useState } from "react";

const codeSnippets = {
  react: `import { AdBanner } from '@adryx/react';

function App() {
  return (
    <div>
      <AdBanner
        placementId="your-placement-id"
        format="banner"
        onImpression={(data) => console.log('Impression:', data)}
        onClick={(data) => console.log('Click:', data)}
      />
    </div>
  );
}`,
  reactNative: `import { AdBanner } from '@adryx/react-native';

function App() {
  return (
    <View>
      <AdBanner
        placementId="your-placement-id"
        format="banner"
        onImpression={(data) => console.log('Impression:', data)}
        onClick={(data) => console.log('Click:', data)}
      />
    </View>
  );
}`,
  html: `<!-- Add Adryx SDK -->
<script src="https://cdn.adryx.io/sdk.js"></script>

<!-- Ad Placement -->
<div id="adryx-ad-1"></div>

<script>
  Adryx.init({ publisherId: 'your-publisher-id' });
  Adryx.createAd({
    element: '#adryx-ad-1',
    placementId: 'your-placement-id',
    format: 'banner'
  });
</script>`,
};

export default function IntegratePage() {
  const [activeTab, setActiveTab] = useState<"react" | "reactNative" | "html">(
    "react",
  );
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-white">Integration Guide</h1>
        <p className="text-sm text-white/40 mt-1">
          Get started with Adryx SDK in minutes
        </p>
      </motion.div>

      {/* Quick Start */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#f7931a]/10 flex items-center justify-center">
            <Book1 size={20} color="#f7931a" variant="Bold" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Quick Start</h2>
            <p className="text-xs text-white/40">
              Choose your platform and follow the steps
            </p>
          </div>
        </div>

        {/* Platform Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("react")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "react"
                ? "bg-[#f7931a]/15 text-[#f7931a]"
                : "bg-white/5 text-white/40 hover:bg-white/8"
            }`}
          >
            React
          </button>
          <button
            onClick={() => setActiveTab("reactNative")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "reactNative"
                ? "bg-[#f7931a]/15 text-[#f7931a]"
                : "bg-white/5 text-white/40 hover:bg-white/8"
            }`}
          >
            React Native
          </button>
          <button
            onClick={() => setActiveTab("html")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "html"
                ? "bg-[#f7931a]/15 text-[#f7931a]"
                : "bg-white/5 text-white/40 hover:bg-white/8"
            }`}
          >
            HTML/JS
          </button>
        </div>

        {/* Installation */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-white mb-3">
            1. Install the SDK
          </h3>
          <div className="relative">
            <pre className="bg-[#0d0d1a] rounded-xl p-4 text-sm text-white/80 overflow-x-auto border border-white/5">
              <code>
                {activeTab === "react" && "npm install @adryx/react"}
                {activeTab === "reactNative" &&
                  "npm install @adryx/react-native"}
                {activeTab === "html" &&
                  "<!-- Include via CDN (see code example) -->"}
              </code>
            </pre>
          </div>
        </div>

        {/* Code Example */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">
              2. Add to your app
            </h3>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 text-white/60 hover:bg-white/8 transition-colors"
            >
              <Copy size={14} color="#22d3ee" />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="relative">
            <pre className="bg-[#0d0d1a] rounded-xl p-4 text-sm text-white/80 overflow-x-auto border border-white/5">
              <code>{codeSnippets[activeTab]}</code>
            </pre>
          </div>
        </div>
      </motion.div>

      {/* Ad Formats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#a855f7]/10 flex items-center justify-center">
            <DocumentCode
              size={20}
              color="#a855f7"
              variant="Bold"
            />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Ad Formats</h2>
            <p className="text-xs text-white/40">
              Supported ad formats and sizes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: "Banner",
              sizes: ["320x50", "728x90", "300x250"],
              color: "#f7931a",
            },
            {
              name: "Native",
              sizes: ["Custom", "Responsive"],
              color: "#a855f7",
            },
            {
              name: "Video",
              sizes: ["16:9", "9:16", "1:1"],
              color: "#22d3ee",
            },
            {
              name: "Interstitial",
              sizes: ["Fullscreen"],
              color: "#4ade80",
            },
          ].map((format) => (
            <div
              key={format.name}
              className="p-4 rounded-xl bg-white/3 border border-white/5"
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: format.color }}
                />
                <h4 className="text-sm font-semibold text-white">
                  {format.name}
                </h4>
              </div>
              <p className="text-xs text-white/40">
                Sizes: {format.sizes.join(", ")}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#22d3ee]/10 flex items-center justify-center">
            <Code1 size={20} color="#22d3ee" variant="Bold" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Resources</h2>
            <p className="text-xs text-white/40">
              Documentation and support links
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { label: "API Documentation", href: "#" },
            { label: "SDK Reference", href: "#" },
            { label: "Code Examples", href: "#" },
            { label: "Support Forum", href: "#" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5 hover:border-white/10 transition-colors group"
            >
              <span className="text-sm text-white/80 group-hover:text-white">
                {link.label}
              </span>
              <span className="text-[#22d3ee] group-hover:text-[#4ade80] transition-colors">
                →
              </span>
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
