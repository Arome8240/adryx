export interface PublisherPlacement {
  id: string;
  name: string;
  location: string;
  format: "Banner" | "Native" | "Video" | "Interstitial";
  status: "Active" | "Paused";
  impressions: number;
  clicks: number;
  earnings: number;
  fillRate: number;
}

export interface PublisherEarningsPoint {
  date: string;
  earnings: number;
  impressions: number;
}

export interface PublisherPayout {
  id: string;
  amount: number;
  date: string;
  status: "Completed" | "Pending" | "Processing";
  txHash: string;
}

export const publisherPlacements: PublisherPlacement[] = [
  {
    id: "p1",
    name: "Homepage Hero",
    location: "myapp.com/",
    format: "Banner",
    status: "Active",
    impressions: 450000,
    clicks: 18200,
    earnings: 2340,
    fillRate: 98.5,
  },
  {
    id: "p2",
    name: "Article Sidebar",
    location: "myapp.com/blog/*",
    format: "Native",
    status: "Active",
    impressions: 320000,
    clicks: 11400,
    earnings: 1890,
    fillRate: 95.2,
  },
  {
    id: "p3",
    name: "Video Pre-roll",
    location: "myapp.com/watch/*",
    format: "Video",
    status: "Active",
    impressions: 195000,
    clicks: 6800,
    earnings: 1620,
    fillRate: 92.8,
  },
  {
    id: "p4",
    name: "Mobile Interstitial",
    location: "Mobile App",
    format: "Interstitial",
    status: "Paused",
    impressions: 85000,
    clicks: 3200,
    earnings: 780,
    fillRate: 88.4,
  },
  {
    id: "p5",
    name: "Footer Banner",
    location: "myapp.com/*",
    format: "Banner",
    status: "Active",
    impressions: 280000,
    clicks: 9800,
    earnings: 1240,
    fillRate: 96.7,
  },
];

export const publisherEarningsData: PublisherEarningsPoint[] = [
  { date: "Mar 1", earnings: 180, impressions: 95 },
  { date: "Mar 5", earnings: 245, impressions: 128 },
  { date: "Mar 9", earnings: 220, impressions: 115 },
  { date: "Mar 13", earnings: 310, impressions: 162 },
  { date: "Mar 17", earnings: 340, impressions: 178 },
  { date: "Mar 21", earnings: 395, impressions: 206 },
  { date: "Mar 25", earnings: 365, impressions: 191 },
  { date: "Mar 29", earnings: 425, impressions: 222 },
  { date: "Apr 2", earnings: 480, impressions: 251 },
  { date: "Apr 3", earnings: 510, impressions: 267 },
];

export const publisherPayouts: PublisherPayout[] = [
  {
    id: "pay1",
    amount: 3240,
    date: "2026-03-15",
    status: "Completed",
    txHash: "0x7f3a...2e9d",
  },
  {
    id: "pay2",
    amount: 2890,
    date: "2026-02-15",
    status: "Completed",
    txHash: "0x4c8b...1f6a",
  },
  {
    id: "pay3",
    amount: 3120,
    date: "2026-01-15",
    status: "Completed",
    txHash: "0x9e2d...5c7b",
  },
  {
    id: "pay4",
    amount: 7870,
    date: "2026-04-15",
    status: "Pending",
    txHash: "—",
  },
];

export const publisherMetrics = {
  totalEarnings: 7870,
  impressions: 1330000,
  clicks: 49400,
  ecpm: 5.92,
  pendingPayout: 7870,
  activePlacements: 4,
  totalApps: 2,
  fillRate: 95.3,
};

export interface PublisherSite {
  id: string;
  name: string;
  url: string;
  type: "website" | "app";
  verified: boolean;
  verificationCode: string;
  addedDate: string;
  verifiedDate?: string;
  stats: {
    placements: number;
    impressions: number;
    clicks: number;
    earnings: number;
  };
}

export const publisherSites: PublisherSite[] = [
  {
    id: "site1",
    name: "My Tech Blog",
    url: "https://mytechblog.com",
    type: "website",
    verified: true,
    verificationCode: "adryx-7f3a2e9d1c8b5f4a",
    addedDate: "2026-02-15",
    verifiedDate: "2026-02-15",
    stats: {
      placements: 3,
      impressions: 730000,
      clicks: 28000,
      earnings: 4820,
    },
  },
  {
    id: "site2",
    name: "Crypto News App",
    url: "com.cryptonews.app",
    type: "app",
    verified: true,
    verificationCode: "adryx-9b2c4d6e8f1a3c5b",
    addedDate: "2026-03-01",
    verifiedDate: "2026-03-02",
    stats: {
      placements: 2,
      impressions: 600000,
      clicks: 21400,
      earnings: 3050,
    },
  },
  {
    id: "site3",
    name: "Gaming Portal",
    url: "https://gamingportal.io",
    type: "website",
    verified: false,
    verificationCode: "adryx-3e5f7a9b1c2d4e6f",
    addedDate: "2026-04-10",
    stats: {
      placements: 0,
      impressions: 0,
      clicks: 0,
      earnings: 0,
    },
  },
];
