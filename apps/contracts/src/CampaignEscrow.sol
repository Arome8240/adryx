// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IAdryx} from "./interfaces/IAdryx.sol";

/**
 * @title CampaignEscrow
 * @notice Holds an advertiser's USDC budget for a single campaign.
 *         Deployed once per campaign by the Adryx protocol factory.
 *
 * ERD entity: CampaignEscrow (on-chain)
 *   escrow_id       → address(this)
 *   advertiser_wallet → advertiserWallet
 *   locked_usdc     → lockedUsdc
 *   spent_usdc      → spentUsdc
 *   campaign_ref    → campaignRef (bytes32 of off-chain campaign_id)
 */
contract CampaignEscrow is Ownable {
    using SafeERC20 for IERC20;

    // ── State ────────────────────────────────────────────────────────────────

    IERC20  public immutable usdc;
    address public immutable advertiserWallet;
    bytes32 public immutable campaignRef; // keccak256(off-chain campaign_id)

    uint256 public lockedUsdc;
    uint256 public spentUsdc;

    address public settlementDispatcher; // authorised to call release()

    // ── Events (from IAdryx interface) ──────────────────────────────────────

    event EscrowLocked(address indexed escrow, address indexed advertiser, uint256 amountUsdc, bytes32 campaignRef);
    event EscrowReleased(address indexed escrow, address indexed publisher, uint256 amountUsdc);
    event EscrowRefunded(address indexed escrow, address indexed advertiser, uint256 amountUsdc);

    // ── Errors ───────────────────────────────────────────────────────────────

    error InsufficientBalance(uint256 available, uint256 requested);
    error Unauthorised();
    error ZeroAmount();

    // ── Constructor ──────────────────────────────────────────────────────────

    constructor(
        address _usdc,
        address _advertiserWallet,
        bytes32 _campaignRef,
        address _owner
    ) Ownable(_owner) {
        usdc              = IERC20(_usdc);
        advertiserWallet  = _advertiserWallet;
        campaignRef       = _campaignRef;
    }

    // ── Modifiers ────────────────────────────────────────────────────────────

    modifier onlyDispatcher() {
        if (msg.sender != settlementDispatcher) revert Unauthorised();
        _;
    }

    // ── Admin ────────────────────────────────────────────────────────────────

    function setSettlementDispatcher(address _dispatcher) external onlyOwner {
        settlementDispatcher = _dispatcher;
    }

    // ── Core ─────────────────────────────────────────────────────────────────

    /**
     * @notice Advertiser calls this to lock USDC into escrow.
     *         Must first approve(address(this), amount) on the USDC contract.
     */
    function lock(uint256 amount) external {
        if (amount == 0) revert ZeroAmount();
        usdc.safeTransferFrom(msg.sender, address(this), amount);
        lockedUsdc += amount;
        emit EscrowLocked(address(this), advertiserWallet, amount, campaignRef);
    }

    /**
     * @notice Called by SettlementDispatcher after a verified impression proof.
     *         Transfers `amount` USDC to `publisher`.
     */
    function release(address publisher, uint256 amount) external onlyDispatcher {
        if (amount == 0) revert ZeroAmount();
        if (amount > lockedUsdc - spentUsdc) {
            revert InsufficientBalance(lockedUsdc - spentUsdc, amount);
        }
        spentUsdc += amount;
        usdc.safeTransfer(publisher, amount);
        emit EscrowReleased(address(this), publisher, amount);
    }

    /**
     * @notice Returns unspent budget to the advertiser (campaign ended / cancelled).
     */
    function refund() external onlyOwner {
        uint256 remaining = lockedUsdc - spentUsdc;
        if (remaining == 0) revert ZeroAmount();
        lockedUsdc = spentUsdc; // mark as fully spent
        usdc.safeTransfer(advertiserWallet, remaining);
        emit EscrowRefunded(address(this), advertiserWallet, remaining);
    }

    // ── View ─────────────────────────────────────────────────────────────────

    function availableBalance() external view returns (uint256) {
        return lockedUsdc - spentUsdc;
    }
}
