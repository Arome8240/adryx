# Adryx On-Chain Protocol

EVM L2 contracts implementing the on-chain half of the Adryx Backend ERD.
All USDC values use **6 decimal places** (USDC standard on Base / Optimism / Polygon).

## Contracts

| Contract | ERD Entity | Description |
|---|---|---|
| `CampaignEscrow.sol` | `CampaignEscrow` | Holds advertiser USDC budget per campaign. One instance per campaign, deployed by a factory. |
| `AuctionManager.sol` | `Auction` + `Bid` | Second-price RTB auction registry. Ad-server opens auctions; DSPs submit bids. |
| `ImpressionRegistry.sol` | `ImpressionProof` | Attestation store. The Relayer writes a proof after verifying a human impression. |
| `SettlementDispatcher.sol` | `Settlement` | Orchestrates USDC release from escrow to publisher wallets after proof verification. |
| `interfaces/IAdryx.sol` | Shared types | Enums, structs, and event interfaces used across all contracts. |

## Data flow

```
Off-chain                            On-chain
─────────────────────────────────────────────────────────────
Campaign created ─────────────────► CampaignEscrow.lock()
                                          │ (locks budget_usdc)
Bid request fires ────────────────► AuctionManager.openAuction()
DSPs bid (off-chain RTB)          ► AuctionManager.placeBid() × N
Ad-server picks winner            ► AuctionManager.settle(winningBidId)
Ad served → Impression record
Relayer verifies impression ──────► ImpressionRegistry.attest()
                                          │ proof_id written back
Relayer dispatches payout ────────► SettlementDispatcher.dispatch()
                                          │ calls CampaignEscrow.release()
                                          ▼
                                    Publisher wallet receives USDC
```

## Cross-boundary references (↗)

Fields marked `↗` in the ERD cross the off-chain ↔ on-chain boundary:

| Off-chain field | On-chain target |
|---|---|
| `Advertiser.walletAddress` | `CampaignEscrow.advertiserWallet` |
| `Campaign.escrowId` | `address(CampaignEscrow)` |
| `BidRequest.auctionId` | `AuctionManager.auctions[id].auctionId` |
| `Impression.proofId` | `ImpressionRegistry.proofs[id].proofId` |
| `Publisher.payoutAddress` | `Settlement.publisherWallet` |

## Stack

- Solidity `^0.8.24`
- OpenZeppelin Contracts v5 (IERC20, SafeERC20, Ownable)
- Target: Base, Optimism, or any EVM L2 with USDC
