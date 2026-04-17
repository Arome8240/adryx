use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;
pub mod errors;
pub mod constants;

use instructions::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod adryx {
    use super::*;

    /// Initialize the Adryx platform
    pub fn initialize(ctx: Context<Initialize>, fee_percentage: u16) -> Result<()> {
        instructions::initialize::handler(ctx, fee_percentage)
    }

    /// Create campaign escrow and fund it
    pub fn create_campaign_escrow(
        ctx: Context<CreateCampaignEscrow>,
        campaign_id: String,
        initial_amount: u64,
    ) -> Result<()> {
        instructions::create_campaign_escrow::handler(ctx, campaign_id, initial_amount)
    }

    /// Add funds to existing campaign escrow
    pub fn fund_campaign(ctx: Context<FundCampaign>, amount: u64) -> Result<()> {
        instructions::fund_campaign::handler(ctx, amount)
    }

    /// Pay publisher for verified clicks (called by backend)
    pub fn pay_publisher(
        ctx: Context<PayPublisher>,
        amount: u64,
    ) -> Result<()> {
        instructions::pay_publisher::handler(ctx, amount)
    }

    /// Withdraw unused campaign funds
    pub fn withdraw_campaign(ctx: Context<WithdrawCampaign>, amount: u64) -> Result<()> {
        instructions::withdraw_campaign::handler(ctx, amount)
    }

    /// Publisher claims accumulated earnings
    pub fn claim_earnings(ctx: Context<ClaimEarnings>) -> Result<()> {
        instructions::claim_earnings::handler(ctx)
    }

    /// Pause/unpause campaign escrow
    pub fn toggle_campaign(ctx: Context<ToggleCampaign>) -> Result<()> {
        instructions::toggle_campaign::handler(ctx)
    }
}
