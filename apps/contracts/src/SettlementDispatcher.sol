// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {SettlementRecord} from "./interfaces/IAdryx.sol";
import {ImpressionRegistry} from "./ImpressionRegistry.sol";
import {CampaignEscrow} from "./CampaignEscrow.sol";

/**
 * @title SettlementDispatcher
 * @notice Orchestrates USDC payouts from CampaignEscrow to publishers after
 *         an ImpressionProof is attested on ImpressionRegistry.
 *
 *         Flow:
 *           1. Relayer attests impression → ImpressionRegistry.attest()
 *           2. Relayer calls dispatch() here with (proofId, escrowAddr, publisher, amount)
 *           3. SettlementDispatcher verifies proof existence, then calls
 *              CampaignEscrow.release(publisher, amount)
 *           4. Settlement event emitted and record stored on-chain
 *
 * ERD entity: Settlement (on-chain, payout)
 */
contract SettlementDispatcher is Ownable {

    // ── State ────────────────────────────────────────────────────────────────

    uint256 public nextSettlementId = 1;

    ImpressionRegistry public immutable registry;

    mapping(uint256 => SettlementRecord) public settlements; // settlementId → record
    mapping(uint256 => bool) public proofSettled;            // prevent double-payout

    mapping(address => bool) public isRelayer;

    // ── Events ───────────────────────────────────────────────────────────────

    event Settled(
        uint256 indexed settlementId,
        uint256 indexed proofId,
        address indexed publisher,
        address escrow,
        uint256 amountUsdc
    );

    // ── Errors ───────────────────────────────────────────────────────────────

    error NotRelayer(address caller);
    error ProofNotFound(uint256 proofId);
    error AlreadySettled(uint256 proofId);
    error ZeroAmount();

    // ── Constructor ──────────────────────────────────────────────────────────

    constructor(
        address _registry,
        address _relayer,
        address _owner
    ) Ownable(_owner) {
        registry = ImpressionRegistry(_registry);
        isRelayer[_relayer] = true;
    }

    // ── Modifiers ────────────────────────────────────────────────────────────

    modifier onlyRelayer() {
        if (!isRelayer[msg.sender]) revert NotRelayer(msg.sender);
        _;
    }

    // ── Admin ────────────────────────────────────────────────────────────────

    function addRelayer(address r) external onlyOwner { isRelayer[r] = true; }
    function removeRelayer(address r) external onlyOwner { isRelayer[r] = false; }

    // ── Core ─────────────────────────────────────────────────────────────────

    /**
     * @notice Dispatches USDC from an escrow to a publisher after proof verification.
     * @param proofId         ID from ImpressionRegistry
     * @param escrowAddr      CampaignEscrow contract that holds the budget
     * @param publisherWallet Recipient of the payout
     * @param amountUsdc      USDC amount (6 dec) — second-price clearing amount
     * @return settlementId   Unique settlement record ID
     */
    function dispatch(
        uint256 proofId,
        address escrowAddr,
        address publisherWallet,
        uint256 amountUsdc
    ) external onlyRelayer returns (uint256 settlementId) {
        if (amountUsdc == 0) revert ZeroAmount();
        if (proofSettled[proofId]) revert AlreadySettled(proofId);

        // Verify proof exists in ImpressionRegistry
        ImpressionProofRecord memory proof = registry.getProof(proofId);
        if (proof.proofId == 0) revert ProofNotFound(proofId);

        proofSettled[proofId] = true;
        settlementId = nextSettlementId++;

        settlements[settlementId] = SettlementRecord({
            settlementId:    settlementId,
            proofId:         proofId,
            escrowId:        escrowAddr,
            publisherWallet: publisherWallet,
            amountUsdc:      amountUsdc,
            txHash:          bytes32(0) // post-confirmation, set off-chain
        });

        // Execute the transfer through the escrow
        CampaignEscrow(escrowAddr).release(publisherWallet, amountUsdc);

        emit Settled(settlementId, proofId, publisherWallet, escrowAddr, amountUsdc);
    }

    // ── View ─────────────────────────────────────────────────────────────────

    function getSettlement(uint256 id) external view returns (SettlementRecord memory) {
        return settlements[id];
    }
}
