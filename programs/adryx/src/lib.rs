use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod adryx {
    use super::*;

    /// Register a new ad campaign on-chain.
    pub fn create_campaign(
        _ctx: Context<CreateCampaign>,
        _campaign_id: String,
        _budget_lamports: u64,
    ) -> Result<()> {
        // TODO: implement campaign creation logic
        Ok(())
    }

    /// Record an ad interaction (impression or click).
    pub fn record_interaction(
        _ctx: Context<RecordInteraction>,
        _campaign_id: String,
        _interaction_type: u8, // 0 = impression, 1 = click
    ) -> Result<()> {
        // TODO: implement interaction tracking logic
        Ok(())
    }

    /// Distribute micro-rewards to a user for engagement.
    pub fn distribute_reward(
        _ctx: Context<DistributeReward>,
        _campaign_id: String,
        _amount_lamports: u64,
    ) -> Result<()> {
        // TODO: implement reward distribution logic
        Ok(())
    }
}

// ─── Account Contexts (scaffolded) ───────────────────────────────────────────

#[derive(Accounts)]
pub struct CreateCampaign<'info> {
    #[account(mut)]
    pub advertiser: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RecordInteraction<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct DistributeReward<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}
