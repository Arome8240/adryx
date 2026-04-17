use anchor_lang::prelude::*;

#[constant]
pub const PLATFORM_SEED: &[u8] = b"platform";

#[constant]
pub const CAMPAIGN_SEED: &[u8] = b"campaign";

#[constant]
pub const PUBLISHER_SEED: &[u8] = b"publisher";

#[constant]
pub const TREASURY_SEED: &[u8] = b"treasury";

#[constant]
pub const MAX_FEE_PERCENTAGE: u16 = 1000; // 10%

#[constant]
pub const MIN_CAMPAIGN_BUDGET: u64 = 100_000_000; // 0.1 SOL
