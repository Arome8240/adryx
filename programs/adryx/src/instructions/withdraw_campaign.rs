use anchor_lang::prelude::*;
use crate::{state::*, constants::*, errors::AdryxError};

#[derive(Accounts)]
pub struct WithdrawCampaign<'info> {
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
}

pub fn handler(ctx: Context<WithdrawCampaign>, amount: u64) -> Result<()> {
    require!(amount > 0, AdryxError::InvalidAmount);
    
    let campaign_escrow = &mut ctx.accounts.campaign_escrow;
    
    // Can only withdraw if campaign is paused
    require!(
        !campaign_escrow.is_active,
        AdryxError::CampaignNotActive
    );
    
    // Check if sufficient balance
    let available = campaign_escrow.remaining_balance();
    require!(
        amount <= available,
        AdryxError::InsufficientBalance
    );

    // Transfer from escrow to advertiser
    **campaign_escrow.to_account_info().try_borrow_mut_lamports()? -= amount;
    **ctx.accounts.advertiser.to_account_info().try_borrow_mut_lamports()? += amount;

    // Update balance
    campaign_escrow.balance = campaign_escrow.balance
        .checked_sub(amount)
        .ok_or(AdryxError::ArithmeticOverflow)?;

    msg!(
        "Withdrawn {} lamports from campaign {}. Remaining: {}",
        amount,
        campaign_escrow.campaign_id,
        campaign_escrow.remaining_balance()
    );

    Ok(())
}
