// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IAdryx
 * @notice Shared types and interfaces for the Adryx on-chain protocol.
 *         All uint256 USDC values use 6 decimals (USDC standard).
 */

// ─── Enums ────────────────────────────────────────────────────────────────────

enum AuctionStatus { Open, Closed, Settled, Cancelled }
enum BidStatus     { Pending, Won, Lost, Cancelled }

// ─── Structs (mirrors ERD on-chain entities) ─────────────────────────────────

struct AuctionRecord {
    uint256 auctionId;
    bytes32 slotRef;       // off-chain AdSlot._id as bytes32
    uint256 reservePrice;  // USDC (6 dec)
    uint256 winningBidId;
    AuctionStatus status;
}

struct BidRecord {
    uint256 bidId;
    uint256 auctionId;
    address bidderWallet;
    uint256 amountUsdc;    // USDC (6 dec)
    BidStatus status;
}

struct ImpressionProofRecord {
    uint256 proofId;
    uint256 auctionId;
    bytes32 impressionHash; // keccak256 of impression_id + creative content_hash
    address attestor;       // Relayer address
    uint256 blockNo;
}

struct SettlementRecord {
    uint256 settlementId;
    uint256 proofId;
    address escrowId;       // CampaignEscrow contract address
    address publisherWallet;
    uint256 amountUsdc;     // USDC (6 dec)
    bytes32 txHash;         // self-referential; set post-confirmation
}

// ─── Events ───────────────────────────────────────────────────────────────────

interface IAdryx {
    // CampaignEscrow events
    event EscrowLocked(address indexed escrow, address indexed advertiser, uint256 amountUsdc, bytes32 campaignRef);
    event EscrowReleased(address indexed escrow, address indexed publisher, uint256 amountUsdc);
    event EscrowRefunded(address indexed escrow, address indexed advertiser, uint256 amountUsdc);

    // AuctionManager events
    event AuctionOpened(uint256 indexed auctionId, bytes32 slotRef, uint256 reservePrice);
    event BidPlaced(uint256 indexed auctionId, uint256 indexed bidId, address bidder, uint256 amount);
    event AuctionSettled(uint256 indexed auctionId, uint256 indexed winningBidId, address winner);

    // ImpressionRegistry events
    event ProofAttested(uint256 indexed proofId, uint256 indexed auctionId, bytes32 impressionHash, address attestor);

    // SettlementDispatcher events
    event Settled(uint256 indexed settlementId, uint256 indexed proofId, address indexed publisher, uint256 amountUsdc);
}
