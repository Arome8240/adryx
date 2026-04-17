# Adryx Hybrid Architecture

## On-Chain vs Off-Chain Design

### 🔗 On-Chain (Solana Smart Contract)
**Only critical financial operations:**

1. **Campaign Funding**
   - Advertiser deposits SOL to campaign escrow
   - Funds locked in program-controlled account

2. **Payment Distribution**
   - Automated publisher payouts on verified clicks
   - Platform fee collection
   - Withdrawal of unused campaign funds

3. **Escrow Management**
   - Campaign budget escrow
   - Publisher earnings escrow
   - Platform treasury

### 💾 Off-Chain (Backend + MongoDB)
**Everything else:**

1. **User Management**
   - Registration, authentication
   - User profiles, roles
   - Email verification

2. **Campaign Metadata**
   - Campaign details (name, description, targeting)
   - Creative assets (images, videos)
   - Targeting rules
   - Status management

3. **Site Management**
   - Site registration and verification
   - Site metadata (name, URL, category)
   - Verification codes

4. **Analytics & Tracking**
   - Impression tracking (free, high volume)
   - Click tracking (before payment)
   - Performance metrics
   - Reports and dashboards

5. **Ad Serving**
   - Ad selection algorithm
   - Targeting logic
   - Creative delivery
   - Frequency capping

## Data Flow

### Campaign Creation Flow
```
1. User creates campaign in Backend (MongoDB)
   ↓
2. User funds campaign via Smart Contract (Solana)
   ↓
3. Backend updates campaign status to "Active"
```

### Ad Click Flow
```
1. User clicks ad → Backend records click (MongoDB)
   ↓
2. Backend validates click (fraud detection)
   ↓
3. Backend triggers Smart Contract payment
   ↓
4. Smart Contract pays publisher from campaign escrow
   ↓
5. Backend updates analytics
```

### Publisher Earnings Flow
```
1. Earnings accumulate in Smart Contract escrow
   ↓
2. Publisher views balance in Backend (reads from chain)
   ↓
3. Publisher claims via Smart Contract
   ↓
4. Backend updates claimed status
```

## Why This Approach?

### ✅ Benefits

1. **Cost Efficient**
   - Impressions are free (off-chain)
   - Only pay for actual payments
   - Reduced transaction fees

2. **Scalable**
   - Handle millions of impressions
   - Fast analytics queries
   - No blockchain bottlenecks

3. **Flexible**
   - Easy to update business logic
   - Rich querying capabilities
   - Complex targeting rules

4. **Transparent**
   - All payments on-chain
   - Verifiable transactions
   - Trustless escrow

### 🎯 What Goes Where

| Feature | Location | Reason |
|---------|----------|--------|
| User accounts | Off-chain | High volume, mutable |
| Campaign metadata | Off-chain | Frequently updated |
| Site registration | Off-chain | Verification process |
| Impressions | Off-chain | High volume, low value |
| Clicks | Off-chain → On-chain | Validate then pay |
| Payments | On-chain | Trust & transparency |
| Escrow | On-chain | Security |
| Analytics | Off-chain | Complex queries |
| Reports | Off-chain | Aggregations |

## Smart Contract Scope (Simplified)

### State Accounts
```rust
// Platform configuration
Platform {
    authority: Pubkey,
    fee_percentage: u16,
    treasury: Pubkey,
}

// Campaign escrow
CampaignEscrow {
    advertiser: Pubkey,
    campaign_id: String,  // Reference to MongoDB
    balance: u64,
    is_active: bool,
}

// Publisher earnings
PublisherEarnings {
    publisher: Pubkey,
    pending: u64,
    total_claimed: u64,
}
```

### Instructions (Minimal)
```rust
1. initialize_platform()
2. create_campaign_escrow(campaign_id, amount)
3. fund_campaign(campaign_id, amount)
4. pay_publisher(campaign_id, publisher, amount)
5. withdraw_campaign(campaign_id, amount)
6. claim_earnings(publisher)
```

## Backend Responsibilities

### Campaign Service
- Create/update campaigns
- Store metadata
- Manage status
- Track budget (sync with chain)

### Ad Serving Service
- Select ads based on targeting
- Serve creatives
- Track impressions
- Validate clicks

### Payment Service
- Aggregate clicks
- Trigger on-chain payments
- Handle payment failures
- Reconcile balances

### Analytics Service
- Real-time metrics
- Historical reports
- Performance insights
- Fraud detection

## Integration Points

### Backend → Smart Contract
```typescript
// When click is validated
await payPublisher({
  campaignId: 'mongo_campaign_id',
  publisher: publisherWallet,
  amount: cpcRate,
});
```

### Smart Contract → Backend
```typescript
// Listen to payment events
program.addEventListener('PaymentMade', (event) => {
  // Update MongoDB with payment confirmation
  updateCampaignSpent(event.campaignId, event.amount);
  updatePublisherEarnings(event.publisher, event.amount);
});
```

## Security Model

### Off-Chain Security
- JWT authentication
- Rate limiting
- Fraud detection
- Input validation

### On-Chain Security
- PDA-based accounts
- Signer validation
- Balance checks
- Reentrancy protection

## Cost Analysis

### Traditional (Everything On-Chain)
- 1M impressions × 0.000005 SOL = 5 SOL (~$1000)
- 10K clicks × 0.000005 SOL = 0.05 SOL (~$10)
- **Total: ~$1010**

### Hybrid (Our Approach)
- 1M impressions × $0 = $0 (off-chain)
- 10K clicks × 0.000005 SOL = 0.05 SOL (~$10)
- **Total: ~$10**

**Savings: 99%** 🎉

## Implementation Priority

### Phase 1: Core Smart Contract ✅
- [x] Platform initialization
- [x] Campaign escrow
- [ ] Payment distribution
- [ ] Earnings claims

### Phase 2: Backend Integration
- [ ] Campaign service with escrow
- [ ] Payment trigger service
- [ ] Event listeners
- [ ] Balance sync

### Phase 3: Frontend Integration
- [ ] Wallet connection
- [ ] Campaign funding UI
- [ ] Earnings claim UI
- [ ] Transaction history

### Phase 4: Advanced Features
- [ ] Batch payments
- [ ] Automated payouts
- [ ] Multi-currency support
- [ ] Advanced analytics

---

**This hybrid approach gives us:**
- 💰 99% cost reduction
- ⚡ High performance
- 🔒 Financial security
- 📊 Rich analytics
- 🚀 Easy to scale
