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

    /// Create a new campaign
    pub fn create_campaign(
        ctx: Context<CreateCampaign>,
        name: String,
        budget: u64,
        cpc_rate: u64, // Cost per click in lamports
        start_time: i64,
        end_time: i64,
    ) -> Result<()> {
        instructions::create_campaign::handler(ctx, name, budget, cpc_rate, start_time, end_time)
    }

    /// Fund a campaign
    pub fn fund_campaign(ctx: Context<FundCampaign>, amount: u64) -> Result<()> {
        instructions::fund_campaign::handler(ctx, amount)
    }

    /// Register a publisher site
    pub fn register_site(
        ctx: Context<RegisterSite>,
        name: String,
        url: String,
    ) -> Result<()> {
        instructions::register_site::handler(ctx, name, url)
    }

    /// Record an ad impression
    pub fn record_impression(
        ctx: Context<RecordImpression>,
        campaign_id: Pubkey,
        site_id: Pubkey,
    ) -> Result<()> {
        instructions::record_impression::handler(ctx, campaign_id, site_id)
    }

    /// Record an ad click and pay publisher
    pub fn record_click(
        ctx: Context<RecordClick>,
        campaign_id: Pubkey,
        site_id: Pubkey,
    ) -> Result<()> {
        instructions::record_click::handler(ctx, campaign_id, site_id)
    }

    /// Withdraw campaign funds (advertiser)
    pub fn withdraw_campaign(ctx: Context<WithdrawCampaign>, amount: u64) -> Result<()> {
        instructions::withdraw_campaign::handler(ctx, amount)
    }

    /// Claim publisher earnings
    pub fn claim_earnings(ctx: Context<ClaimEarnings>) -> Result<()> {
        instructions::claim_earnings::handler(ctx)
    }

    /// Pause/unpause a campaign
    pub fn toggle_campaign(ctx: Context<ToggleCampaign>) -> Result<()> {
        instructions::toggle_campaign::handler(ctx)
    }
}
