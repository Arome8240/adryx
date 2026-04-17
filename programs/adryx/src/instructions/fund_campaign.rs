use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};
use crate::{state::*, constants::*, errors::AdryxError};

#[derive(Accounts)]
pub struct FundCampaign<'info> {
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
    
    #[account(mut)]
    pub advertiser: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<FundCampaign>, amount: u64) -> Result<()> {
    require!(amount > 0, AdryxError::InvalidAmount);

    let campaign_escrow = &mut ctx.accounts.campaign_escrow;

    // Transfer funds to escrow
    let cpi_context = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        Transfer {
            from: ctx.accounts.advertiser.to_account_info(),
            to: campaign_escrow.to_account_info(),
        },
    );
    transfer(cpi_context, amount)?;

    // Update balance
    campaign_escrow.balance = campaign_escrow.balance
        .checked_add(amount)
        .ok_or(AdryxError::ArithmeticOverflow)?;

    msg!(
        "Campaign {} funded with {} lamports. New balance: {}",
        campaign_escrow.campaign_id,
        amount,
        campaign_escrow.balance
    );

    Ok(())
}
