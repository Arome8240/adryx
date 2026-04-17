use anchor_lang::prelude::*;

#[error_code]
pub enum AdryxError {
    #[msg("Campaign ID is too long")]
    CampaignIdTooLong,
    
    #[msg("Invalid fee percentage")]
    InvalidFeePercentage,
    
    #[msg("Campaign budget is too low")]
    BudgetTooLow,
    
    #[msg("Campaign escrow is not active")]
    CampaignNotActive,
    
    #[msg("Insufficient campaign balance")]
    InsufficientBalance,
    
    #[msg("No earnings to claim")]
    NoEarnings,
    
    #[msg("Unauthorized")]
    Unauthorized,
    
    #[msg("Arithmetic overflow")]
    ArithmeticOverflow,
    
    #[msg("Invalid amount")]
    InvalidAmount,
}
