use anchor_lang::prelude::*;

#[account]
pub struct Platform {
    pub authority: Pubkey,
    pub fee_percentage: u16, // Basis points (100 = 1%)
    pub total_campaigns: u64,
    pub total_sites: u64,
    pub total_volume: u64, // Total SOL processed
    pub treasury: Pubkey,
    pub bump: u8,
}

impl Platform {
    pub const LEN: usize = 8 + // discriminator
        32 + // authority
        2 +  // fee_percentage
        8 +  // total_campaigns
        8 +  // total_sites
        8 +  // total_volume
        32 + // treasury
        1;   // bump
}
