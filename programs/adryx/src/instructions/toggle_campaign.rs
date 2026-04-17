use anchor_lang::prelude::*;
use crate::{state::*, constants::*, errors::AdryxError};

#[derive(Accounts)]
pub struct ToggleCampaign<'info> {
    #[account(
        mut,
        seeds = [
            CAMPAIGN_SEED,
            campaign_escrow.advertiser.as_ref(),
            campaign_escrow.campaign_id.as_bytes()
        ],
        bump = campaign_escrow.bump,
        has_one = advertiser @ AdryxError::Unauthorized
    )]
    pub campaign_escrow: Account<'info, CampaignEscrow>,
    
    pub advertiser: Signer<'info>,
}

pub fn handler(ctx: Context<ToggleCampaign>) -> Result<()> {
    let campaign_escrow = &mut ctx.accounts.campaign_escrow;
    
    // Toggle active status
    campaign_escrow.is_active = !campaign_escrow.is_active;

    msg!(
        "Campaign {} is now {}",
        campaign_escrow.campaign_id,
        if campaign_escrow.is_active { "active" } else { "paused" }
    );

    Ok(())
}
