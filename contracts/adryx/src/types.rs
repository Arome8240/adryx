use soroban_sdk::{contracttype, Address, String};

/// Storage key namespace — one enum variant per record type.
#[contracttype]
pub enum DataKey {
    /// Singleton platform config (instance storage).
    Platform,
    /// Per-campaign escrow, keyed by (advertiser, campaign_id).
    Campaign(Address, String),
    /// Per-publisher accumulated earnings, keyed by publisher address.
    Publisher(Address),
}

// ── Platform ──────────────────────────────────────────────────────────────────

#[contracttype]
#[derive(Clone, Debug)]
pub struct Platform {
    /// Admin address that can pay publishers and update config.
    pub authority: Address,
    /// Platform fee in basis points (e.g. 250 = 2.5%).
    pub fee_bps: u32,
    /// Treasury address that receives platform fees.
    pub treasury: Address,
    /// Stellar token contract used for all payments (e.g. USDC).
    pub token: Address,
    pub total_campaigns: u64,
    pub total_sites: u64,
    /// Cumulative token units settled through the platform.
    pub total_volume: i128,
}

// ── Campaign escrow ───────────────────────────────────────────────────────────

#[contracttype]
#[derive(Clone, Debug)]
pub struct CampaignEscrow {
    pub advertiser: Address,
    /// Off-chain MongoDB campaign ID for cross-reference.
    pub campaign_id: String,
    /// Total tokens deposited by the advertiser.
    pub balance: i128,
    /// Tokens already spent paying publishers (net of fees).
    pub spent: i128,
    pub is_active: bool,
    /// Ledger timestamp at creation (Unix seconds).
    pub created_at: u64,
}

// ── Publisher earnings ────────────────────────────────────────────────────────

#[contracttype]
#[derive(Clone, Debug)]
pub struct PublisherEarnings {
    pub publisher: Address,
    /// Tokens earned but not yet claimed.
    pub pending: i128,
    pub total_claimed: i128,
    pub total_earned: i128,
}

// ── Constants ─────────────────────────────────────────────────────────────────

pub const MAX_FEE_BPS: u32 = 1000;       // 10%
pub const MAX_CAMPAIGN_ID_LEN: u32 = 50;
/// Minimum campaign budget: 1 USDC (7 decimals on Stellar = 10_000_000 stroops).
pub const MIN_CAMPAIGN_BUDGET: i128 = 10_000_000;
