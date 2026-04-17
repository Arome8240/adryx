use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};
use crate::{state::*, constants::*, errors::AdryxError};

#[derive(Accounts)]
#[instruction(campaign_id: String)]
pub struct CreateCampaignEscrow<'info> {
    #[account(
        init,
        payer = advertiser,
        space = CampaignEscrow::LEN,
        seeds = [
            CAMPAIGN_SEED,
            advertiser.key().as_ref(),
            campaign_id.as_bytes()
        ],
        bump
    )]
    pub campaign_escrow: Account<'info, CampaignEscrow>,
    
    #[account(
        mut,
        seeds = [PLATFORM_SEED],
        bump = platform.bump
    )]
    pub platform: Account<'info, Platform>,
    
    #[account(mut)]
    pub advertiser: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<CreateCampaignEscrow>,
    campaign_id: String,
    initial_amount: u64,
) -> Result<()> {
    require!(
        campaign_id.len() <= CampaignEscrow::MAX_CAMPAIGN_ID_LEN,
        AdryxError::CampaignIdTooLong
    );
    
    require!(
        initial_amount >= MIN_CAMPAIGN_BUDGET,
        AdryxError::BudgetTooLow
    );

    let campaign_escrow = &mut ctx.accounts.campaign_escrow;
    let platform = &mut ctx.accounts.platform;
    let clock = Clock::get()?;

    // Initialize escrow account
    campaign_escrow.advertiser = ctx.accounts.advertiser.key();
    campaign_escrow.campaign_id = campaign_id.clone();
    campaign_escrow.balance = 0; // Will be funded via transfer
    campaign_escrow.spent = 0;
    campaign_escrow.is_active = true;
    campaign_escrow.created_at = clock.unix_timestamp;
    campaign_escrow.bump = ctx.bumps.campaign_escrow;

    // Transfer initial funds to escrow
    let cpi_context = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        Transfer {
            from: ctx.accounts.advertiser.to_account_info(),
            to: campaign_escrow.to_account_info(),
        },
    );
    transfer(cpi_context, initial_amount)?;

    // Update escrow balance
    campaign_escrow.balance = initial_amount;

    // Update platform stats
    platform.total_campaigns = platform.total_campaigns
        .checked_add(1)
        .ok_or(AdryxError::ArithmeticOverflow)?;

    msg!(
        "Campaign escrow created: {} with {} lamports",
        campaign_id,
        initial_amount
    );

    Ok(())
}
