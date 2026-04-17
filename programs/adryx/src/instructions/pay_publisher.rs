use anchor_lang::prelude::*;
use crate::{state::*, constants::*, errors::AdryxError};

#[derive(Accounts)]
pub struct PayPublisher<'info> {
    #[account(
        mut,
        seeds = [
            CAMPAIGN_SEED,
            campaign_escrow.advertiser.as_ref(),
            campaign_escrow.campaign_id.as_bytes()
        ],
        bump = campaign_escrow.bump
    )]
    pub campaign_escrow: Account<'info, CampaignEscrow>,
    
    #[account(
        init_if_needed,
        payer = payer,
        space = PublisherEarnings::LEN,
        seeds = [
            PUBLISHER_SEED,
            publisher.key().as_ref()
        ],
        bump
    )]
    pub publisher_earnings: Account<'info, PublisherEarnings>,
    
    #[account(
        mut,
        seeds = [PLATFORM_SEED],
        bump = platform.bump
    )]
    pub platform: Account<'info, Platform>,
    
    /// CHECK: Treasury PDA for collecting fees
    #[account(
        mut,
        seeds = [TREASURY_SEED],
        bump
    )]
    pub treasury: AccountInfo<'info>,
    
    /// CHECK: Publisher wallet to receive earnings
    pub publisher: AccountInfo<'info>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<PayPublisher>, amount: u64) -> Result<()> {
    require!(amount > 0, AdryxError::InvalidAmount);
    
    let campaign_escrow = &mut ctx.accounts.campaign_escrow;
    let publisher_earnings = &mut ctx.accounts.publisher_earnings;
    let platform = &ctx.accounts.platform;

    // Check if campaign is active and has sufficient balance
    require!(
        campaign_escrow.is_active,
        AdryxError::CampaignNotActive
    );
    
    require!(
        campaign_escrow.can_pay(amount),
        AdryxError::InsufficientBalance
    );

    // Calculate platform fee
    let fee_amount = (amount as u128)
        .checked_mul(platform.fee_percentage as u128)
        .and_then(|v| v.checked_div(10000))
        .and_then(|v| u64::try_from(v).ok())
        .ok_or(AdryxError::ArithmeticOverflow)?;
    
    let publisher_amount = amount
        .checked_sub(fee_amount)
        .ok_or(AdryxError::ArithmeticOverflow)?;

    // Initialize publisher earnings if needed
    if publisher_earnings.publisher == Pubkey::default() {
        publisher_earnings.publisher = ctx.accounts.publisher.key();
        publisher_earnings.pending = 0;
        publisher_earnings.total_claimed = 0;
        publisher_earnings.total_earned = 0;
        publisher_earnings.bump = ctx.bumps.publisher_earnings;
    }

    // Transfer fee to treasury
    if fee_amount > 0 {
        **campaign_escrow.to_account_info().try_borrow_mut_lamports()? -= fee_amount;
        **ctx.accounts.treasury.try_borrow_mut_lamports()? += fee_amount;
    }

    // Transfer payment to publisher earnings escrow
    **campaign_escrow.to_account_info().try_borrow_mut_lamports()? -= publisher_amount;
    **publisher_earnings.to_account_info().try_borrow_mut_lamports()? += publisher_amount;

    // Update campaign escrow
    campaign_escrow.spent = campaign_escrow.spent
        .checked_add(amount)
        .ok_or(AdryxError::ArithmeticOverflow)?;

    // Update publisher earnings
    publisher_earnings.pending = publisher_earnings.pending
        .checked_add(publisher_amount)
        .ok_or(AdryxError::ArithmeticOverflow)?;
    
    publisher_earnings.total_earned = publisher_earnings.total_earned
        .checked_add(publisher_amount)
        .ok_or(AdryxError::ArithmeticOverflow)?;

    msg!(
        "Paid {} lamports to publisher. Fee: {} lamports. Campaign spent: {}",
        publisher_amount,
        fee_amount,
        campaign_escrow.spent
    );

    Ok(())
}
