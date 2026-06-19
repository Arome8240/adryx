use soroban_sdk::contracterror;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum AdryxError {
    AlreadyInitialized   = 1,
    NotInitialized       = 2,
    Unauthorized         = 3,
    InvalidFeePercentage = 4,
    BudgetTooLow         = 5,
    CampaignIdTooLong    = 6,
    CampaignNotFound     = 7,
    CampaignNotActive    = 8,
    CampaignNotPaused    = 9,
    InsufficientBalance  = 10,
    NoEarnings           = 11,
    ArithmeticOverflow   = 12,
    InvalidAmount        = 13,
}
