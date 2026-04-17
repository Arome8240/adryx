use anchor_lang::prelude::*;

#[account]
pub struct CampaignEscrow {
    pub advertiser: Pubkey,
    pub campaign_id: String,  // Reference to MongoDB campaign
    pub balance: u64,
    pub spent: u64,
    pub is_active: bool,
    pub created_at: i64,
    pub bump: u8,
}

impl CampaignEscrow {
    pub const MAX_CAMPAIGN_ID_LEN: usize = 50;
    
    pub const LEN: usize = 8 + // discriminator
        32 + // advertiser
        4 + Self::MAX_CAMPAIGN_ID_LEN + // campaign_id
        8 +  // balance
        8 +  // spent
        1 +  // is_active
        8 +  // created_at
        1;   // bump

    pub fn remaining_balance(&self) -> u64 {
        self.balance.saturating_sub(self.spent)
    }

    pub fn can_pay(&self, amount: u64) -> bool {
        self.is_active && self.remaining_balance() >= amount
    }
}

#[account]
pub struct PublisherEarnings {
    pub publisher: Pubkey,
    pub pending: u64,
    pub total_claimed: u64,
    pub total_earned: u64,
    pub bump: u8,
}

impl PublisherEarnings {
    pub const LEN: usize = 8 + // discriminator
        32 + // publisher
        8 +  // pending
        8 +  // total_claimed
        8 +  // total_earned
        1;   // bump
}
