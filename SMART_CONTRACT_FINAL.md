# Adryx Smart Contract - Simplified & Optimized ✅

## Architecture Decision

**Hybrid Approach**: Only financial operations on-chain, everything else off-chain (MongoDB + Backend)

### 💰 Cost Savings
- **Traditional (all on-chain)**: ~$1,010 for 1M impressions + 10K clicks
- **Our approach**: ~$10 for same volume
- **Savings**: 99% reduction in costs

## Smart Contract Scope

### ✅ On-Chain (Solana)
1. Campaign escrow management
2. Payment distribution to publishers
3. Platform fee collection
4. Earnings claims

### 💾 Off-Chain (Backend/MongoDB)
1. User accounts & authentication
2. Campaign metadata (name, description, targeting)
3. Site registration & verification
4. Impression tracking (high volume, free)
5. Click tracking & validation
6. Analytics & reporting
7. Ad serving logic

## State Accounts

### Platform
```rust
pub struct Platform {
    pub authority: Pubkey,
    pub fee_percentage: u16,
    pub total_campaigns: u64,
    pub total_sites: u64,
    pub total_volume: u64,
    pub treasury: Pubkey,
    pub bump: u8,
}
```

### CampaignEscrow
```rust
pub struct CampaignEscrow {
    pub advertiser: Pubkey,
    pub campaign_id: String,  // MongoDB reference
    pub balance: u64,
    pub spent: u64,
    pub is_active: bool,
    pub created_at: i64,
    pub bump: u8,
}
```

### PublisherEarnings
```rust
pub struct PublisherEarnings {
    pub publisher: Pubkey,
    pub pending: u64,
    pub total_claimed: u64,
    pub total_earned: u64,
    pub bump: u8,
}
```

## Instructions

### 1. initialize
```rust
pub fn initialize(ctx: Context<Initialize>, fee_percentage: u16) -> Result<()>
```
- Initialize platform
- Set platform fee (max 10%)
- Create treasury PDA

### 2. create_campaign_escrow
```rust
pub fn create_campaign_escrow(
    ctx: Context<CreateCampaignEscrow>,
    campaign_id: String,  // MongoDB campaign ID
    initial_amount: u64,
) -> Result<()>
```
- Create escrow PDA for campaign
- Transfer initial funds from advertiser
- Link to MongoDB campaign via ID

### 3. fund_campaign
```rust
pub fn fund_campaign(ctx: Context<FundCampaign>, amount: u64) -> Result<()>
```
- Add more funds to existing escrow
- Update balance

### 4. pay_publisher
```rust
pub fn pay_publisher(
    ctx: Context<PayPublisher>,
    amount: u64,
) -> Result<()>
```
- Called by backend after click validation
- Deduct from campaign escrow
- Add to publisher earnings
- Collect platform fee

### 5. withdraw_campaign
```rust
pub fn withdraw_campaign(ctx: Context<WithdrawCampaign>, amount: u64) -> Result<()>
```
- Advertiser withdraws unused funds
- Only if campaign is paused/ended

### 6. claim_earnings
```rust
pub fn claim_earnings(ctx: Context<ClaimEarnings>) -> Result<()>
```
- Publisher claims accumulated earnings
- Transfer from earnings PDA to wallet

### 7. toggle_campaign
```rust
pub fn toggle_campaign(ctx: Context<ToggleCampaign>) -> Result<()>
```
- Pause/resume campaign escrow
- Prevents new payments when paused

## Data Flow Examples

### Campaign Creation
```
1. Frontend → Backend: Create campaign with metadata
2. Backend → MongoDB: Store campaign details
3. Frontend → Smart Contract: Create escrow with campaign_id
4. Smart Contract: Lock funds in escrow PDA
5. Backend: Update campaign status to "Active"
```

### Ad Click & Payment
```
1. User clicks ad → Backend
2. Backend: Validate click (fraud detection)
3. Backend → MongoDB: Record click
4. Backend → Smart Contract: pay_publisher(campaign_id, publisher, amount)
5. Smart Contract: Transfer SOL from escrow to publisher earnings
6. Backend: Update analytics
```

### Publisher Claim
```
1. Publisher → Frontend: View earnings
2. Frontend → Smart Contract: Read earnings balance
3. Publisher → Smart Contract: claim_earnings()
4. Smart Contract: Transfer SOL to publisher wallet
5. Backend: Update claimed status
```

## Integration Points

### Backend Service
```typescript
// Payment service
class PaymentService {
  async processClick(clickData) {
    // 1. Validate click
    const isValid = await this.validateClick(clickData);
    if (!isValid) return;
    
    // 2. Get campaign from MongoDB
    const campaign = await Campaign.findById(clickData.campaignId);
    
    // 3. Trigger on-chain payment
    await this.program.methods
      .payPublisher(new BN(campaign.cpcRate))
      .accounts({
        campaignEscrow,
        publisherEarnings,
        platform,
        treasury,
      })
      .rpc();
    
    // 4. Update MongoDB
    await this.updateAnalytics(clickData);
  }
}
```

### Event Listener
```typescript
// Listen to on-chain events
program.addEventListener('PaymentMade', async (event) => {
  await Campaign.findOneAndUpdate(
    { _id: event.campaignId },
    { $inc: { spent: event.amount } }
  );
  
  await Site.findOneAndUpdate(
    { publisherId: event.publisher },
    { $inc: { totalEarned: event.amount } }
  );
});
```

## Security Features

✅ PDA-based accounts (no private keys)
✅ Signer validation on all mutations
✅ Balance checks before payments
✅ Overflow protection
✅ Platform fee limits (max 10%)
✅ Campaign pause mechanism
✅ Escrow-based payments

## File Structure

```
programs/adryx/
├── Cargo.toml
├── Xargo.toml
└── src/
    ├── lib.rs                           # ✅ Main program
    ├── constants.rs                     # ✅ Constants
    ├── errors.rs                        # ✅ Error codes
    ├── state/
    │   ├── mod.rs                       # ✅
    │   ├── platform.rs                  # ✅ Platform state
    │   └── campaign.rs                  # ✅ Escrow & earnings
    └── instructions/
        ├── mod.rs                       # ✅
        ├── initialize.rs                # ✅ Done
        ├── create_campaign_escrow.rs    # ✅ Done
        ├── fund_campaign.rs             # TODO
        ├── pay_publisher.rs             # TODO
        ├── withdraw_campaign.rs         # TODO
        ├── claim_earnings.rs            # TODO
        └── toggle_campaign.rs           # TODO
```

## Next Steps

### 1. Complete Instructions (5 remaining)
- [ ] fund_campaign.rs
- [ ] pay_publisher.rs
- [ ] withdraw_campaign.rs
- [ ] claim_earnings.rs
- [ ] toggle_campaign.rs

### 2. Testing
- [ ] Unit tests for each instruction
- [ ] Integration tests
- [ ] Localnet deployment

### 3. Backend Integration
- [ ] Payment service
- [ ] Event listeners
- [ ] Balance sync

### 4. Frontend Integration
- [ ] Wallet connection
- [ ] Campaign funding UI
- [ ] Earnings claim UI

## Build & Deploy

```bash
# Build
anchor build

# Test
anchor test

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Deploy to mainnet
anchor deploy --provider.cluster mainnet
```

## Benefits Summary

✅ **99% cost reduction** - Only pay for actual payments
✅ **High scalability** - Handle millions of impressions off-chain
✅ **Fast queries** - MongoDB for analytics
✅ **Transparent payments** - All financial transactions on-chain
✅ **Flexible logic** - Easy to update business rules
✅ **Trustless escrow** - Funds secured by smart contract

---

**Status**: 🟡 Core structure complete, 5 instructions remaining
**Next**: Complete remaining instruction handlers
