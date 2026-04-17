use anchor_lang::prelude::*;
use crate::{state::*, constants::*, errors::AdryxError};

#[derive(Accounts)]
pub struct ClaimEarnings<'info> {
    #[account(
        mut,
        seeds = [
            PUBLISHER_SEED,
            publisher.key().as_ref()
        ],
        bump = publisher_earnings.bump,
        has_one = publisher @ AdryxError::Unauthorized
    )]
    pub publisher_earnings: Account<'info, PublisherEarnings>,
    
    #[account(mut)]
    pub publisher: Signer<'info>,
}

pub fn handler(ctx: Context<ClaimEarnings>) -> Result<()> {
    let publisher_earnings = &mut ctx.accounts.publisher_earnings;
    
    // Check if there are earnings to claim
    require!(
        publisher_earnings.pending > 0,
        AdryxError::NoEarnings
    );

    let amount = publisher_earnings.pending;

    // Transfer from earnings escrow to publisher wallet
    **publisher_earnings.to_account_info().try_borrow_mut_lamports()? -= amount;
    **ctx.accounts.publisher.to_account_info().try_borrow_mut_lamports()? += amount;

    // Update earnings tracking
    publisher_earnings.pending = 0;
    publisher_earnings.total_claimed = publisher_earnings.total_claimed
        .checked_add(amount)
        .ok_or(AdryxError::ArithmeticOverflow)?;

    msg!(
        "Publisher claimed {} lamports. Total claimed: {}",
        amount,
        publisher_earnings.total_claimed
    );

    Ok(())
}
