#![no_std]

use soroban_sdk::{
    contract, contractimpl,
    symbol_short,
    Address, Env, String, token,
};

mod errors;
mod types;

use errors::AdryxError;
use types::*;

// ── Storage helpers ───────────────────────────────────────────────────────────

fn require_platform(env: &Env) -> Result<Platform, AdryxError> {
    env.storage()
        .instance()
        .get(&DataKey::Platform)
        .ok_or(AdryxError::NotInitialized)
}

fn save_platform(env: &Env, platform: &Platform) {
    env.storage().instance().set(&DataKey::Platform, platform);
}

fn require_campaign(env: &Env, advertiser: &Address, campaign_id: &String) -> Result<CampaignEscrow, AdryxError> {
    env.storage()
        .persistent()
        .get(&DataKey::Campaign(advertiser.clone(), campaign_id.clone()))
        .ok_or(AdryxError::CampaignNotFound)
}

fn save_campaign(env: &Env, advertiser: &Address, campaign_id: &String, escrow: &CampaignEscrow) {
    env.storage()
        .persistent()
        .set(&DataKey::Campaign(advertiser.clone(), campaign_id.clone()), escrow);
}

fn load_publisher(env: &Env, publisher: &Address) -> PublisherEarnings {
    env.storage()
        .persistent()
        .get(&DataKey::Publisher(publisher.clone()))
        .unwrap_or(PublisherEarnings {
            publisher: publisher.clone(),
            pending: 0,
            total_claimed: 0,
            total_earned: 0,
        })
}

fn save_publisher(env: &Env, publisher: &Address, earnings: &PublisherEarnings) {
    env.storage()
        .persistent()
        .set(&DataKey::Publisher(publisher.clone()), earnings);
}

// ── Contract ──────────────────────────────────────────────────────────────────

#[contract]
pub struct AdryxContract;

#[contractimpl]
impl AdryxContract {
    /// One-time platform setup. Must be called by the deploying authority.
    ///
    /// * `fee_bps`  — platform fee in basis points (e.g. 250 = 2.5%, max 1000 = 10%).
    /// * `treasury` — address that receives collected fees.
    /// * `token`    — Stellar token contract used for all payments (USDC recommended).
    pub fn initialize(
        env: Env,
        authority: Address,
        fee_bps: u32,
        treasury: Address,
        token: Address,
    ) -> Result<(), AdryxError> {
        if env.storage().instance().has(&DataKey::Platform) {
            return Err(AdryxError::AlreadyInitialized);
        }
        authority.require_auth();

        if fee_bps > MAX_FEE_BPS {
            return Err(AdryxError::InvalidFeePercentage);
        }

        save_platform(&env, &Platform {
            authority,
            fee_bps,
            treasury,
            token,
            total_campaigns: 0,
            total_sites: 0,
            total_volume: 0,
        });

        env.events().publish((symbol_short!("INIT"),), ());
        Ok(())
    }

    /// Create a campaign escrow and deposit the initial budget.
    ///
    /// Transfers `amount` tokens from `advertiser` to this contract.
    /// The advertiser must have signed the transaction and pre-approved the transfer.
    pub fn create_campaign(
        env: Env,
        advertiser: Address,
        campaign_id: String,
        amount: i128,
    ) -> Result<(), AdryxError> {
        advertiser.require_auth();

        if amount <= 0 {
            return Err(AdryxError::InvalidAmount);
        }
        if amount < MIN_CAMPAIGN_BUDGET {
            return Err(AdryxError::BudgetTooLow);
        }
        if campaign_id.len() > MAX_CAMPAIGN_ID_LEN {
            return Err(AdryxError::CampaignIdTooLong);
        }

        let mut platform = require_platform(&env)?;

        // Deposit tokens into this contract's balance.
        token::Client::new(&env, &platform.token)
            .transfer(&advertiser, &env.current_contract_address(), &amount);

        let escrow = CampaignEscrow {
            advertiser: advertiser.clone(),
            campaign_id: campaign_id.clone(),
            balance: amount,
            spent: 0,
            is_active: true,
            created_at: env.ledger().timestamp(),
        };
        save_campaign(&env, &advertiser, &campaign_id, &escrow);

        platform.total_campaigns = platform
            .total_campaigns
            .checked_add(1)
            .ok_or(AdryxError::ArithmeticOverflow)?;
        save_platform(&env, &platform);

        env.events().publish(
            (symbol_short!("CAMPAIGN"), symbol_short!("CREATE")),
            (advertiser, campaign_id, amount),
        );
        Ok(())
    }

    /// Top up an existing campaign with additional tokens.
    pub fn fund_campaign(
        env: Env,
        advertiser: Address,
        campaign_id: String,
        amount: i128,
    ) -> Result<(), AdryxError> {
        advertiser.require_auth();

        if amount <= 0 {
            return Err(AdryxError::InvalidAmount);
        }

        let mut escrow = require_campaign(&env, &advertiser, &campaign_id)?;

        token::Client::new(&env, &require_platform(&env)?.token)
            .transfer(&advertiser, &env.current_contract_address(), &amount);

        escrow.balance = escrow
            .balance
            .checked_add(amount)
            .ok_or(AdryxError::ArithmeticOverflow)?;
        save_campaign(&env, &advertiser, &campaign_id, &escrow);

        env.events().publish(
            (symbol_short!("CAMPAIGN"), symbol_short!("FUND")),
            (advertiser, campaign_id, amount),
        );
        Ok(())
    }

    /// Credit a publisher for verified ad delivery and charge the campaign.
    ///
    /// Only the platform authority may call this — it is invoked by the Adryx
    /// backend after impression/click verification. The fee is routed to the
    /// treasury; the remainder accrues to the publisher's pending balance.
    pub fn pay_publisher(
        env: Env,
        advertiser: Address,
        campaign_id: String,
        publisher: Address,
        amount: i128,
    ) -> Result<(), AdryxError> {
        let platform = require_platform(&env)?;
        platform.authority.require_auth();

        if amount <= 0 {
            return Err(AdryxError::InvalidAmount);
        }

        let mut escrow = require_campaign(&env, &advertiser, &campaign_id)?;

        if !escrow.is_active {
            return Err(AdryxError::CampaignNotActive);
        }

        let remaining = escrow
            .balance
            .checked_sub(escrow.spent)
            .ok_or(AdryxError::ArithmeticOverflow)?;
        if amount > remaining {
            return Err(AdryxError::InsufficientBalance);
        }

        // fee = amount * fee_bps / 10_000
        let fee: i128 = amount
            .checked_mul(platform.fee_bps as i128)
            .and_then(|v| v.checked_div(10_000))
            .ok_or(AdryxError::ArithmeticOverflow)?;

        let publisher_amount = amount
            .checked_sub(fee)
            .ok_or(AdryxError::ArithmeticOverflow)?;

        let token_client = token::Client::new(&env, &platform.token);

        // Route fee to treasury.
        if fee > 0 {
            token_client.transfer(
                &env.current_contract_address(),
                &platform.treasury,
                &fee,
            );
        }

        // Accumulate publisher earnings in contract balance (claimed later).
        // (tokens remain in contract; we track the obligation in storage)

        // Update campaign escrow.
        escrow.spent = escrow
            .spent
            .checked_add(amount)
            .ok_or(AdryxError::ArithmeticOverflow)?;
        save_campaign(&env, &advertiser, &campaign_id, &escrow);

        // Update publisher earnings record.
        let mut earnings = load_publisher(&env, &publisher);
        earnings.pending = earnings
            .pending
            .checked_add(publisher_amount)
            .ok_or(AdryxError::ArithmeticOverflow)?;
        earnings.total_earned = earnings
            .total_earned
            .checked_add(publisher_amount)
            .ok_or(AdryxError::ArithmeticOverflow)?;
        save_publisher(&env, &publisher, &earnings);

        env.events().publish(
            (symbol_short!("PAY"),),
            (campaign_id, publisher, publisher_amount, fee),
        );
        Ok(())
    }

    /// Advertiser withdraws unused campaign tokens (campaign must be paused first).
    pub fn withdraw_campaign(
        env: Env,
        advertiser: Address,
        campaign_id: String,
        amount: i128,
    ) -> Result<(), AdryxError> {
        advertiser.require_auth();

        if amount <= 0 {
            return Err(AdryxError::InvalidAmount);
        }

        let mut escrow = require_campaign(&env, &advertiser, &campaign_id)?;

        if escrow.is_active {
            return Err(AdryxError::CampaignNotPaused);
        }

        let available = escrow
            .balance
            .checked_sub(escrow.spent)
            .ok_or(AdryxError::ArithmeticOverflow)?;
        if amount > available {
            return Err(AdryxError::InsufficientBalance);
        }

        token::Client::new(&env, &require_platform(&env)?.token)
            .transfer(&env.current_contract_address(), &advertiser, &amount);

        escrow.balance = escrow
            .balance
            .checked_sub(amount)
            .ok_or(AdryxError::ArithmeticOverflow)?;
        save_campaign(&env, &advertiser, &campaign_id, &escrow);

        env.events().publish(
            (symbol_short!("WITHDRAW"),),
            (advertiser, campaign_id, amount),
        );
        Ok(())
    }

    /// Publisher withdraws their accumulated earnings.
    ///
    /// Returns the amount transferred.
    pub fn claim_earnings(env: Env, publisher: Address) -> Result<i128, AdryxError> {
        publisher.require_auth();

        let mut earnings = load_publisher(&env, &publisher);

        if earnings.pending == 0 {
            return Err(AdryxError::NoEarnings);
        }

        let amount = earnings.pending;

        token::Client::new(&env, &require_platform(&env)?.token)
            .transfer(&env.current_contract_address(), &publisher, &amount);

        earnings.total_claimed = earnings
            .total_claimed
            .checked_add(amount)
            .ok_or(AdryxError::ArithmeticOverflow)?;
        earnings.pending = 0;
        save_publisher(&env, &publisher, &earnings);

        env.events().publish(
            (symbol_short!("CLAIM"),),
            (publisher, amount),
        );
        Ok(amount)
    }

    /// Toggle a campaign between active and paused.
    ///
    /// Returns the new `is_active` state.
    pub fn toggle_campaign(
        env: Env,
        advertiser: Address,
        campaign_id: String,
    ) -> Result<bool, AdryxError> {
        advertiser.require_auth();

        let mut escrow = require_campaign(&env, &advertiser, &campaign_id)?;
        escrow.is_active = !escrow.is_active;
        save_campaign(&env, &advertiser, &campaign_id, &escrow);

        env.events().publish(
            (symbol_short!("TOGGLE"),),
            (campaign_id, escrow.is_active),
        );
        Ok(escrow.is_active)
    }

    // ── Admin ─────────────────────────────────────────────────────────────────

    /// Update platform fee. Only authority.
    pub fn set_fee(env: Env, fee_bps: u32) -> Result<(), AdryxError> {
        let mut platform = require_platform(&env)?;
        platform.authority.require_auth();

        if fee_bps > MAX_FEE_BPS {
            return Err(AdryxError::InvalidFeePercentage);
        }
        platform.fee_bps = fee_bps;
        save_platform(&env, &platform);
        Ok(())
    }

    /// Transfer platform authority to a new address. Only current authority.
    pub fn transfer_authority(env: Env, new_authority: Address) -> Result<(), AdryxError> {
        let mut platform = require_platform(&env)?;
        platform.authority.require_auth();
        platform.authority = new_authority;
        save_platform(&env, &platform);
        Ok(())
    }

    // ── View ──────────────────────────────────────────────────────────────────

    pub fn get_platform(env: Env) -> Result<Platform, AdryxError> {
        require_platform(&env)
    }

    pub fn get_campaign(
        env: Env,
        advertiser: Address,
        campaign_id: String,
    ) -> Result<CampaignEscrow, AdryxError> {
        require_campaign(&env, &advertiser, &campaign_id)
    }

    pub fn get_publisher_earnings(
        env: Env,
        publisher: Address,
    ) -> PublisherEarnings {
        load_publisher(&env, &publisher)
    }

    /// Remaining unspent tokens in a campaign.
    pub fn campaign_available(
        env: Env,
        advertiser: Address,
        campaign_id: String,
    ) -> Result<i128, AdryxError> {
        let escrow = require_campaign(&env, &advertiser, &campaign_id)?;
        Ok(escrow.balance - escrow.spent)
    }
}
