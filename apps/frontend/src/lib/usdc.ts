import { PublicKey } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  getAccount,
} from "@solana/spl-token";
import type { Connection } from "@solana/web3.js";

// USDC mint addresses
export const USDC_MINT_DEVNET = new PublicKey(
  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU", // devnet USDC
);
export const USDC_MINT_MAINNET = new PublicKey(
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // mainnet USDC
);

// 6 decimal places for USDC
export const USDC_DECIMALS = 6;
export const USDC_MULTIPLIER = 1_000_000;

export function usdcToRaw(amount: number): bigint {
  return BigInt(Math.round(amount * USDC_MULTIPLIER));
}

export function rawToUsdc(raw: bigint | number): number {
  const n = typeof raw === "bigint" ? Number(raw) : raw;
  return n / USDC_MULTIPLIER;
}

export function formatUsdc(amount: number): string {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Fetch the USDC balance for a wallet on devnet */
export async function getUsdcBalance(
  connection: Connection,
  walletPubkey: PublicKey,
): Promise<number> {
  try {
    const ata = await getAssociatedTokenAddress(USDC_MINT_DEVNET, walletPubkey);
    const account = await getAccount(connection, ata);
    return rawToUsdc(account.amount);
  } catch {
    return 0;
  }
}

export { getAssociatedTokenAddress, createTransferInstruction };
