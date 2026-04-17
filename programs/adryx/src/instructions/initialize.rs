use anchor_lang::prelude::*;
use crate::{state::Platform, constants::*, errors::AdryxError};

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = Platform::LEN,
        seeds = [PLATFORM_SEED],
        bump
    )]
    pub platform: Account<'info, Platform>,
    
    /// CHECK: Treasury PDA
    #[account(
        seeds = [TREASURY_SEED],
        bump
    )]
    pub treasury: AccountInfo<'info>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<Initialize>, fee_percentage: u16) -> Result<()> {
    require!(
        fee_percentage <= MAX_FEE_PERCENTAGE,
        AdryxError::InvalidFeePercentage
    );

    let platform = &mut ctx.accounts.platform;
    platform.authority = ctx.accounts.authority.key();
    platform.fee_percentage = fee_percentage;
    platform.total_campaigns = 0;
    platform.total_sites = 0;
    platform.total_volume = 0;
    platform.treasury = ctx.accounts.treasury.key();
    platform.bump = ctx.bumps.platform;

    msg!("Adryx platform initialized with {}% fee", fee_percentage as f64 / 100.0);

    Ok(())
}
