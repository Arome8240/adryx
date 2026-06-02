// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ImpressionProofRecord} from "./interfaces/IAdryx.sol";

/**
 * @title ImpressionRegistry
 * @notice On-chain attestation store for served impressions.
 *         The Relayer (off-chain oracle) calls attest() after verifying that
 *         a real human viewed the ad. The resulting proof_id is written back
 *         to the off-chain Impression document and triggers Settlement.
 *
 * ERD entity: ImpressionProof (on-chain, attestation)
 */
contract ImpressionRegistry is Ownable {

    // ── State ────────────────────────────────────────────────────────────────

    uint256 public nextProofId = 1;

    mapping(uint256 => ImpressionProofRecord) public proofs; // proofId → record
    mapping(bytes32 => bool) public usedHashes;              // prevent double-attest

    mapping(address => bool) public isRelayer; // authorised attestors

    // ── Events ───────────────────────────────────────────────────────────────

    event ProofAttested(
        uint256 indexed proofId,
        uint256 indexed auctionId,
        bytes32 impressionHash,
        address attestor,
        uint256 blockNo
    );

    // ── Errors ───────────────────────────────────────────────────────────────

    error NotRelayer(address caller);
    error AlreadyAttested(bytes32 impressionHash);

    // ── Constructor ──────────────────────────────────────────────────────────

    constructor(address _relayer, address _owner) Ownable(_owner) {
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
     * @notice Relayer attests that an impression was verifiably human-served.
     * @param auctionId     On-chain auction that won this slot
     * @param impressionHash keccak256(impression_id ‖ content_hash) — built off-chain
     * @return proofId      Cross-boundary FK written back to Impression.proof_id
     */
    function attest(uint256 auctionId, bytes32 impressionHash)
        external onlyRelayer returns (uint256 proofId)
    {
        if (usedHashes[impressionHash]) revert AlreadyAttested(impressionHash);
        usedHashes[impressionHash] = true;

        proofId = nextProofId++;
        proofs[proofId] = ImpressionProofRecord({
            proofId:        proofId,
            auctionId:      auctionId,
            impressionHash: impressionHash,
            attestor:       msg.sender,
            blockNo:        block.number
        });

        emit ProofAttested(proofId, auctionId, impressionHash, msg.sender, block.number);
    }

    // ── View ─────────────────────────────────────────────────────────────────

    function getProof(uint256 proofId) external view returns (ImpressionProofRecord memory) {
        return proofs[proofId];
    }

    function isAttested(bytes32 impressionHash) external view returns (bool) {
        return usedHashes[impressionHash];
    }
}
