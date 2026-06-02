// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IAdryx, AuctionStatus, BidStatus, AuctionRecord, BidRecord} from "./interfaces/IAdryx.sol";

/**
 * @title AuctionManager
 * @notice On-chain second-price RTB auction registry.
 *         The Adryx ad-server calls openAuction() when a bid request arrives,
 *         then each DSP calls placeBid(). The protocol calls settle() after the
 *         auction window closes.
 *
 * ERD entities: Auction + Bid (on-chain)
 */
contract AuctionManager is Ownable {

    // ── State ────────────────────────────────────────────────────────────────

    uint256 public nextAuctionId = 1;
    uint256 public nextBidId     = 1;

    mapping(uint256 => AuctionRecord) public auctions; // auctionId → AuctionRecord
    mapping(uint256 => BidRecord)     public bids;     // bidId     → BidRecord
    mapping(uint256 => uint256[])     public auctionBids; // auctionId → bidId[]

    address public adServer; // off-chain ad-server authorised to open/settle auctions

    // ── Events ───────────────────────────────────────────────────────────────

    event AuctionOpened(uint256 indexed auctionId, bytes32 slotRef, uint256 reservePrice);
    event BidPlaced(uint256 indexed auctionId, uint256 indexed bidId, address bidder, uint256 amount);
    event AuctionSettled(uint256 indexed auctionId, uint256 indexed winningBidId, address winner);
    event AuctionCancelled(uint256 indexed auctionId);

    // ── Errors ───────────────────────────────────────────────────────────────

    error Unauthorised();
    error AuctionNotOpen(uint256 auctionId);
    error BidBelowReserve(uint256 bid, uint256 reserve);
    error AuctionAlreadySettled(uint256 auctionId);

    // ── Constructor ──────────────────────────────────────────────────────────

    constructor(address _adServer, address _owner) Ownable(_owner) {
        adServer = _adServer;
    }

    // ── Modifiers ────────────────────────────────────────────────────────────

    modifier onlyAdServer() {
        if (msg.sender != adServer) revert Unauthorised();
        _;
    }

    // ── Admin ────────────────────────────────────────────────────────────────

    function setAdServer(address _adServer) external onlyOwner {
        adServer = _adServer;
    }

    // ── Core ─────────────────────────────────────────────────────────────────

    /**
     * @notice Opens a new auction for an ad slot.
     * @param slotRef    bytes32 of the off-chain AdSlot._id
     * @param reserve    Minimum bid in USDC (6 dec)
     * @return auctionId The new auction's ID (cross-boundary FK for BidRequest)
     */
    function openAuction(bytes32 slotRef, uint256 reserve)
        external onlyAdServer returns (uint256 auctionId)
    {
        auctionId = nextAuctionId++;
        auctions[auctionId] = AuctionRecord({
            auctionId:    auctionId,
            slotRef:      slotRef,
            reservePrice: reserve,
            winningBidId: 0,
            status:       AuctionStatus.Open
        });
        emit AuctionOpened(auctionId, slotRef, reserve);
    }

    /**
     * @notice DSP submits a bid for an open auction.
     * @return bidId The new bid's ID
     */
    function placeBid(uint256 auctionId, uint256 amountUsdc)
        external returns (uint256 bidId)
    {
        AuctionRecord storage a = auctions[auctionId];
        if (a.status != AuctionStatus.Open) revert AuctionNotOpen(auctionId);
        if (amountUsdc < a.reservePrice) revert BidBelowReserve(amountUsdc, a.reservePrice);

        bidId = nextBidId++;
        bids[bidId] = BidRecord({
            bidId:        bidId,
            auctionId:    auctionId,
            bidderWallet: msg.sender,
            amountUsdc:   amountUsdc,
            status:       BidStatus.Pending
        });
        auctionBids[auctionId].push(bidId);
        emit BidPlaced(auctionId, bidId, msg.sender, amountUsdc);
    }

    /**
     * @notice Settles the auction by selecting the highest bid (second-price
     *         clearing happens off-chain; only the winner is recorded here).
     * @param winningBidId The bid selected as winner by the ad-server
     */
    function settle(uint256 auctionId, uint256 winningBidId)
        external onlyAdServer
    {
        AuctionRecord storage a = auctions[auctionId];
        if (a.status != AuctionStatus.Open) revert AuctionAlreadySettled(auctionId);

        a.winningBidId = winningBidId;
        a.status       = AuctionStatus.Settled;

        bids[winningBidId].status = BidStatus.Won;

        // Mark all other bids as lost
        uint256[] storage ids = auctionBids[auctionId];
        for (uint256 i; i < ids.length; ++i) {
            if (ids[i] != winningBidId) bids[ids[i]].status = BidStatus.Lost;
        }

        emit AuctionSettled(auctionId, winningBidId, bids[winningBidId].bidderWallet);
    }

    function cancelAuction(uint256 auctionId) external onlyAdServer {
        auctions[auctionId].status = AuctionStatus.Cancelled;
        emit AuctionCancelled(auctionId);
    }

    // ── View ─────────────────────────────────────────────────────────────────

    function getAuction(uint256 id) external view returns (AuctionRecord memory) {
        return auctions[id];
    }

    function getBid(uint256 id) external view returns (BidRecord memory) {
        return bids[id];
    }

    function getAuctionBids(uint256 auctionId) external view returns (uint256[] memory) {
        return auctionBids[auctionId];
    }
}
