// ── New Adryx design-system mock data ──────────────────────────────────────

export const CAMPAIGNS = [
  { id:'cmp_924', name:'Q2 — Anchorset Launch', status:'active', budget:8000, spent:4820.40, imps:1284000, ctr:1.82, ecpm:3.74, geos:['US','EU'], updated:'2h ago', spark:[12,18,22,30,28,34,40,46,52,58,64,70] },
  { id:'cmp_915', name:'Wallet Onboarding · NA', status:'active', budget:4000, spent:3211.10, imps:842500, ctr:1.42, ecpm:3.81, geos:['US','CA'], updated:'4h ago', spark:[20,24,22,26,30,28,32,30,36,34,38,40] },
  { id:'cmp_902', name:'Spring Brand Awareness', status:'paused', budget:12000, spent:7843.20, imps:3210000, ctr:0.92, ecpm:2.44, geos:['Global'], updated:'yesterday', spark:[40,42,44,40,38,32,28,22,18,16,12,10] },
  { id:'cmp_887', name:'DevTools Audience Test', status:'review', budget:1500, spent:0, imps:0, ctr:0, ecpm:0, geos:['US','UK','DE'], updated:'2d ago', spark:[0,0,0,0,0,0,0,0,0,0,0,0] },
  { id:'cmp_873', name:'L2 Migration Push', status:'active', budget:6000, spent:5120.00, imps:1654000, ctr:1.71, ecpm:3.10, geos:['Global'], updated:'1h ago', spark:[14,18,22,28,34,40,44,48,52,58,62,68] },
  { id:'cmp_812', name:'Retargeting — Holders', status:'ended', budget:3000, spent:3000.00, imps:1240000, ctr:2.10, ecpm:2.42, geos:['Global'], updated:'7d ago', spark:[50,48,45,40,36,30,26,22,18,14,12,8] },
];

export const SITES = [
  { d:'tesserawire.com', rev:8420.10, imps:2840000, ecpm:2.96, fill:94, units:6, st:'active' },
  { d:'devbrief.io', rev:2814.40, imps:1240000, ecpm:2.27, fill:91, units:4, st:'active' },
  { d:'forecast.blog', rev:1140.20, imps:512000, ecpm:2.22, fill:88, units:3, st:'active' },
  { d:'climate.report', rev:472.50, imps:204000, ecpm:2.31, fill:84, units:2, st:'warning' },
];

export const ACCT_AD = { name:'Forecast Labs', short:'FL', role:'Advertiser · Pro', color:'#0f172a' };
export const ACCT_PUB = { name:'Tessera Wire', short:'TW', role:'Publisher · Pro', color:'#2563eb' };

export const A_NAV = [
  { route:'/dashboard', label:'Overview', ico:'home' },
  { route:'/dashboard/campaigns', label:'Campaigns', ico:'campaign', badge: 4 },
  { route:'/dashboard/analytics', label:'Analytics', ico:'chart' },
  { route:'/dashboard/settings', label:'Settings', ico:'settings' },
];

export const P_NAV = [
  { route:'/publisher', label:'Overview', ico:'home' },
  { route:'/publisher/sites', label:'Sites', ico:'globe', badge: 4 },
  { route:'/publisher/ad-units', label:'Ad units', ico:'layers2' },
  { route:'/publisher/analytics', label:'Analytics', ico:'chart' },
  { route:'/publisher/payouts', label:'Payouts', ico:'wallet' },
  { route:'/publisher/settings', label:'Settings', ico:'settings' },
];

export const fmtNum = (n: number): string => {
  if (n == null) return '—';
  if (Math.abs(n) >= 1e6) return (n/1e6).toFixed(1).replace(/\.0$/,'') + 'M';
  if (Math.abs(n) >= 1e3) return (n/1e3).toFixed(1).replace(/\.0$/,'') + 'k';
  return n.toLocaleString();
};

export const fmtMoney = (n: number, sym = '$'): string => sym + n.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});

// ── Legacy types (kept for backwards compat) ───────────────────────────────

export type CampaignStatus = "Active" | "Paused" | "Completed";

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  ctr: number;
  startDate: string;
  endDate: string;
  format: "Banner" | "Native" | "Video";
}

export interface Transaction {
  id: string;
  type: "Deposit" | "Spend" | "Refund";
  amount: number;
  date: string;
  description: string;
  txHash: string;
}

export interface AnalyticsPoint {
  date: string;
  impressions: number;
  clicks: number;
  spend: number;
}

export const campaigns: Campaign[] = [
  {
    id: "c1",
    name: "Stacks DeFi Launch",
    status: "Active",
    budget: 5000,
    spent: 2340,
    impressions: 480000,
    clicks: 18200,
    ctr: 3.79,
    startDate: "2026-03-01",
    endDate: "2026-04-30",
    format: "Banner",
  },
  {
    id: "c2",
    name: "NFT Marketplace Promo",
    status: "Active",
    budget: 3000,
    spent: 1890,
    impressions: 320000,
    clicks: 11400,
    ctr: 3.56,
    startDate: "2026-03-10",
    endDate: "2026-04-10",
    format: "Native",
  },
  {
    id: "c3",
    name: "Web3 Wallet Awareness",
    status: "Paused",
    budget: 2000,
    spent: 980,
    impressions: 195000,
    clicks: 6800,
    ctr: 3.49,
    startDate: "2026-02-15",
    endDate: "2026-03-31",
    format: "Video",
  },
  {
    id: "c4",
    name: "Adryx Publisher Drive",
    status: "Completed",
    budget: 4500,
    spent: 4500,
    impressions: 210000,
    clicks: 8600,
    ctr: 4.1,
    startDate: "2026-01-01",
    endDate: "2026-02-28",
    format: "Banner",
  },
  {
    id: "c5",
    name: "Bitcoin Halving Campaign",
    status: "Active",
    budget: 6000,
    spent: 740,
    impressions: 95000,
    clicks: 3800,
    ctr: 4.0,
    startDate: "2026-04-01",
    endDate: "2026-05-15",
    format: "Native",
  },
];

export const transactions: Transaction[] = [
  {
    id: "t1",
    type: "Deposit",
    amount: 5000,
    date: "2026-03-28",
    description: "Wallet top-up",
    txHash: "0x4f2a...9c1e",
  },
  {
    id: "t2",
    type: "Spend",
    amount: -340,
    date: "2026-03-27",
    description: "Stacks DeFi Launch — daily spend",
    txHash: "0x8b3c...2d4f",
  },
  {
    id: "t3",
    type: "Spend",
    amount: -210,
    date: "2026-03-26",
    description: "NFT Marketplace Promo — daily spend",
    txHash: "0x1e9d...7a2b",
  },
  {
    id: "t4",
    type: "Refund",
    amount: 120,
    date: "2026-03-25",
    description: "Web3 Wallet Awareness — paused refund",
    txHash: "0x6c7e...3f1a",
  },
  {
    id: "t5",
    type: "Deposit",
    amount: 2000,
    date: "2026-03-20",
    description: "Wallet top-up",
    txHash: "0x9a1b...5e8c",
  },
  {
    id: "t6",
    type: "Spend",
    amount: -430,
    date: "2026-03-19",
    description: "Adryx Publisher Drive — final spend",
    txHash: "0x3d5f...8b2e",
  },
];

export const analyticsData: AnalyticsPoint[] = [
  { date: "Mar 1", impressions: 28000, clicks: 980, spend: 120 },
  { date: "Mar 5", impressions: 42000, clicks: 1540, spend: 185 },
  { date: "Mar 9", impressions: 38000, clicks: 1320, spend: 160 },
  { date: "Mar 13", impressions: 55000, clicks: 2100, spend: 240 },
  { date: "Mar 17", impressions: 61000, clicks: 2380, spend: 275 },
  { date: "Mar 21", impressions: 74000, clicks: 2950, spend: 320 },
  { date: "Mar 25", impressions: 68000, clicks: 2640, spend: 295 },
  { date: "Mar 29", impressions: 82000, clicks: 3200, spend: 360 },
  { date: "Apr 2", impressions: 91000, clicks: 3580, spend: 410 },
  { date: "Apr 3", impressions: 95000, clicks: 3800, spend: 430 },
];

export const overviewMetrics = {
  totalSpend: 12450,
  impressions: 1200000,
  clicks: 45000,
  ctr: 3.75,
};
