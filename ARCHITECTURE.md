# Adryx Hybrid Architecture

## On-Chain vs Off-Chain Design

### On-Chain (Stellar / Soroban Smart Contract)

**Only critical financial operations:**

1. **Campaign Funding**
   - Advertiser deposits XLM or USDC to campaign escrow contract
   - Funds locked in Soroban contract-controlled account

2. **Payment Distribution**
   - Automated publisher payouts on verified clicks
   - Platform fee collection
   - Withdrawal of unused campaign funds

3. **Escrow Management**
   - Campaign budget escrow
   - Publisher earnings escrow
   - Platform treasury

### Off-Chain (Backend + MongoDB)

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
2. User funds campaign via Soroban contract (Stellar)
   ↓
3. Backend updates campaign status to "Active"
```

### Ad Click Flow

```
1. User clicks ad → Backend records click (MongoDB)
   ↓
2. Backend validates click (fraud detection)
   ↓
3. Backend triggers Soroban contract payment
   ↓
4. Contract pays publisher from campaign escrow
   ↓
5. Backend updates analytics
```

### Publisher Earnings Flow

```
1. Earnings accumulate in Soroban contract escrow
   ↓
2. Publisher views balance in Backend (reads from Horizon API)
   ↓
3. Publisher claims via contract invoke
   ↓
4. Backend updates claimed status
```

## Why This Approach?

### Benefits

1. **Cost Efficient**
   - Impressions are free (off-chain)
   - Only pay Stellar fees for actual payments (~0.00001 XLM per tx)
   - Significantly lower transaction fees than alternatives

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
   - Verifiable transactions on Stellar Expert
   - Trustless escrow

### What Goes Where

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

## Smart Contract Scope (Soroban / Rust)

### Contract Storage

```rust
// Platform configuration
Platform {
    authority: Address,
    fee_percentage: u32,
    treasury: Address,
}

// Campaign escrow
CampaignEscrow {
    advertiser: Address,
    campaign_id: String,  // Reference to MongoDB
    balance: i128,        // in stroops (XLM) or USDC units
    is_active: bool,
}

// Publisher earnings
PublisherEarnings {
    publisher: Address,
    pending: i128,
    total_claimed: i128,
}
```

### Contract Functions

```rust
1. initialize(authority, fee_pct)
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
- Track budget (sync with Stellar Horizon)

### Ad Serving Service
- Select ads based on targeting
- Serve creatives
- Track impressions
- Validate clicks

### Payment Service
- Aggregate clicks
- Invoke on-chain Soroban contract
- Handle payment failures
- Reconcile balances via Horizon API

### Analytics Service
- Real-time metrics
- Historical reports
- Performance insights
- Fraud detection

## Integration Points

### Backend → Smart Contract

```typescript
// When click is validated
await stellarClient.invokeContract({
  contractId: STELLAR_CONTRACT_ID,
  method: 'pay_publisher',
  args: [campaignId, publisherAddress, cpcRate],
});
```

### Horizon Event Listener

```typescript
// Poll Horizon for contract events
const server = new Horizon.Server(STELLAR_HORIZON_URL);
server.operations().forAccount(contractId).stream({
  onmessage: (op) => {
    updateCampaignSpent(op.campaignId, op.amount);
    updatePublisherEarnings(op.publisher, op.amount);
  },
});
```

## Security Model

### Off-Chain Security
- JWT authentication
- Rate limiting
- Fraud detection
- Input validation

### On-Chain Security
- Stellar address-based access control
- Soroban authorization framework
- Balance checks
- Atomic transactions

## Cost Analysis

### Traditional (Everything On-Chain)
- 1M impressions × 0.0001 XLM = 100 XLM (~$12)
- 10K clicks × 0.0001 XLM = 1 XLM (~$0.12)
- **Total: ~$12.12**

### Hybrid (Our Approach)
- 1M impressions × $0 = $0 (off-chain)
- 10K clicks × 0.0001 XLM = 1 XLM (~$0.12)
- **Total: ~$0.12**

**Savings: ~99%**

## Implementation Priority

### Phase 1: Core Smart Contract
- [x] Platform initialization design
- [x] Campaign escrow design
- [ ] Soroban contract deployment (Testnet)
- [ ] Payment distribution

### Phase 2: Backend Integration
- [ ] Campaign service with escrow
- [ ] Payment trigger service
- [ ] Horizon event listeners
- [ ] Balance sync

### Phase 3: Frontend Integration
- [x] Wallet connection (Freighter, LOBSTR, xBull, Rabet)
- [ ] Campaign funding UI
- [ ] Earnings claim UI
- [ ] Transaction history

### Phase 4: Advanced Features
- [ ] Batch payments
- [ ] Automated payouts
- [ ] USDC support (Stellar USDC)
- [ ] Advanced analytics

---

**This hybrid approach gives us:**
- 99% cost reduction vs fully on-chain
- High performance
- Financial security via Soroban escrow
- Rich analytics
- Easy to scale
