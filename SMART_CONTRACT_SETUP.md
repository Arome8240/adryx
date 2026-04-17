# Adryx Smart Contract Setup 🚀

## Overview

The Adryx smart contract is built using Anchor framework on Solana. It handles:
- Campaign creation and management
- Publisher site registration
- Ad impressions and clicks tracking
- Automated payments to publishers
- Platform fee collection

## Structure Created

```
programs/adryx/
├── Cargo.toml
├── Xargo.toml
└── src/
    ├── lib.rs                    # Main program entry
    ├── constants.rs              # Program constants
    ├── errors.rs                 # Custom error types
    ├── state/
    │   ├── mod.rs
    │   ├── platform.rs           # Platform state
    │   ├── campaign.rs           # Campaign state
    │   ├── site.rs               # Publisher site state
    │   └── interaction.rs        # Interaction records
    └── instructions/
        ├── mod.rs
        ├── initialize.rs         # ✅ Created
        ├── create_campaign.rs    # ✅ Created
        ├── fund_campaign.rs      # TODO
        ├── register_site.rs      # TODO
        ├── record_impression.rs  # TODO
        ├── record_click.rs       # TODO
        ├── withdraw_campaign.rs  # TODO
        ├── claim_earnings.rs     # TODO
        └── toggle_campaign.rs    # TODO
```

## Key Features

### 1. Platform Management
- Initialize platform with configurable fee
- Treasury for collecting platform fees
- Track total campaigns, sites, and volume

### 2. Campaign Management
- Create campaigns with budget and CPC rate
- Fund campaigns with SOL
- Pause/resume campaigns
- Withdraw unused funds
- Automatic budget tracking

### 3. Publisher Sites
- Register sites with verification
- Track impressions and clicks
- Accumulate earnings
- Claim earnings to wallet

### 4. Interactions
- Record impressions (free)
- Record clicks (pays publisher)
- On-chain proof of interactions
- Automatic payment distribution

## State Accounts

### Platform
```rust
pub struct Platform {
    pub authority: Pubkey,
    pub fee_percentage: u16,      // Basis points (100 = 1%)
    pub total_campaigns: u64,
    pub total_sites: u64,
    pub total_volume: u64,
    pub treasury: Pubkey,
    pub bump: u8,
}
```

### Campaign
```rust
pub struct Campaign {
    pub advertiser: Pubkey,
    pub name: String,
    pub budget: u64,
    pub spent: u64,
    pub cpc_rate: u64,           // Cost per click
    pub impressions: u64,
    pub clicks: u64,
    pub start_time: i64,
    pub end_time: i64,
    pub is_active: bool,
    pub created_at: i64,
    pub bump: u8,
}
```

### Site
```rust
pub struct Site {
    pub publisher: Pubkey,
    pub name: String,
    pub url: String,
    pub total_impressions: u64,
    pub total_clicks: u64,
    pub total_earned: u64,
    pub pending_earnings: u64,
    pub is_verified: bool,
    pub created_at: i64,
    pub bump: u8,
}
```

## Instructions

### Initialize
```rust
pub fn initialize(ctx: Context<Initialize>, fee_percentage: u16) -> Result<()>
```
- Sets up the platform
- Creates treasury PDA
- Sets platform fee (max 10%)

### Create Campaign
```rust
pub fn create_campaign(
    ctx: Context<CreateCampaign>,
    name: String,
    budget: u64,
    cpc_rate: u64,
    start_time: i64,
    end_time: i64,
) -> Result<()>
```
- Creates a new ad campaign
- Validates budget (min 0.1 SOL)
- Validates CPC rate (min 0.001 SOL)
- Sets time range

### Fund Campaign
```rust
pub fn fund_campaign(ctx: Context<FundCampaign>, amount: u64) -> Result<()>
```
- Adds SOL to campaign budget
- Transfers from advertiser to campaign PDA

### Register Site
```rust
pub fn register_site(
    ctx: Context<RegisterSite>,
    name: String,
    url: String,
) -> Result<()>
```
- Registers a publisher site
- Creates site PDA
- Initializes earnings tracking

### Record Impression
```rust
pub fn record_impression(
    ctx: Context<RecordImpression>,
    campaign_id: Pubkey,
    site_id: Pubkey,
) -> Result<()>
```
- Records an ad impression
- Increments counters
- No payment (impressions are free)

### Record Click
```rust
pub fn record_click(
    ctx: Context<RecordClick>,
    campaign_id: Pubkey,
    site_id: Pubkey,
) -> Result<()>
```
- Records an ad click
- Pays publisher (CPC rate - platform fee)
- Deducts from campaign budget
- Adds to site pending earnings

### Claim Earnings
```rust
pub fn claim_earnings(ctx: Context<ClaimEarnings>) -> Result<()>
```
- Publisher claims accumulated earnings
- Transfers SOL from site PDA to publisher wallet
- Resets pending earnings

## Constants

```rust
pub const PLATFORM_SEED: &[u8] = b"platform";
pub const CAMPAIGN_SEED: &[u8] = b"campaign";
pub const SITE_SEED: &[u8] = b"site";
pub const TREASURY_SEED: &[u8] = b"treasury";

pub const MAX_FEE_PERCENTAGE: u16 = 1000;      // 10%
pub const MIN_CAMPAIGN_BUDGET: u64 = 100_000_000;  // 0.1 SOL
pub const MIN_CPC_RATE: u64 = 1_000_000;           // 0.001 SOL
```

## Error Codes

```rust
pub enum AdryxError {
    NameTooLong,
    UrlTooLong,
    InvalidFeePercentage,
    BudgetTooLow,
    CpcRateTooLow,
    CampaignNotActive,
    CampaignEnded,
    CampaignNotStarted,
    InsufficientBudget,
    InvalidTimeRange,
    SiteNotVerified,
    NoEarnings,
    Unauthorized,
    ArithmeticOverflow,
}
```

## Next Steps

### 1. Complete Remaining Instructions
Create the following instruction files:
- `fund_campaign.rs`
- `register_site.rs`
- `record_impression.rs`
- `record_click.rs`
- `withdraw_campaign.rs`
- `claim_earnings.rs`
- `toggle_campaign.rs`

### 2. Build the Program
```bash
anchor build
```

### 3. Run Tests
```bash
anchor test
```

### 4. Deploy
```bash
# Devnet
anchor deploy --provider.cluster devnet

# Mainnet
anchor deploy --provider.cluster mainnet
```

## TypeScript SDK

After building, generate the TypeScript SDK:

```bash
anchor build
# IDL will be in target/idl/adryx.json
```

Use in frontend/backend:
```typescript
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { Adryx } from './types/adryx';
import idl from './idl/adryx.json';

const program = new Program<Adryx>(
  idl as Adryx,
  provider
);

// Create campaign
await program.methods
  .createCampaign(
    "My Campaign",
    new BN(1000000000), // 1 SOL budget
    new BN(10000000),   // 0.01 SOL per click
    startTime,
    endTime
  )
  .accounts({
    campaign,
    platform,
    advertiser: wallet.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

## Security Considerations

1. ✅ PDA-based accounts (no private keys needed)
2. ✅ Signer validation on all mutations
3. ✅ Budget checks before payments
4. ✅ Time-based campaign validation
5. ✅ Overflow protection with checked math
6. ✅ Platform fee limits (max 10%)

## Testing Strategy

1. Unit tests for each instruction
2. Integration tests for workflows
3. Fuzzing for edge cases
4. Devnet deployment testing
5. Audit before mainnet

## Deployment Checklist

- [ ] Complete all instructions
- [ ] Write comprehensive tests
- [ ] Build successfully
- [ ] Test on localnet
- [ ] Deploy to devnet
- [ ] Frontend integration
- [ ] Security audit
- [ ] Deploy to mainnet

---

**Status**: 🟡 In Progress
- ✅ Project structure
- ✅ State definitions
- ✅ Constants and errors
- ✅ Initialize instruction
- ✅ Create campaign instruction
- 🟡 Remaining instructions (7/9)
- ⏳ Tests
- ⏳ Deployment
