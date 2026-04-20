import { PublicKey } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  getAccount,
} from "@solana/spl-token";
import type { Connection } from "@solana/web3.js";

// ── USDC ──────────────────────────────────────────────────────────────────────
export const USDC_MINT_DEVNET = new PublicKey(
  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
);
export const USDC_MINT_MAINNET = new PublicKey(
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
);

// ── USDT ──────────────────────────────────────────────────────────────────────
export const USDT_MINT_DEVNET = new PublicKey(
  "EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS", // devnet USDT
);
export const USDT_MINT_MAINNET = new PublicKey(
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", // mainnet USDT
);

// Both USDC and USDT use 6 decimal places
export const TOKEN_DECIMALS = 6;
export const TOKEN_MULTIPLIER = 1_000_000;

export type StablecoinSymbol = "USDC" | "USDT";

export const TOKEN_MINTS: Record<StablecoinSymbol, PublicKey> = {
  USDC: USDC_MINT_DEVNET,
  USDT: USDT_MINT_DEVNET,
};

export const TOKEN_COLORS: Record<StablecoinSymbol, string> = {
  USDC: "#2775ca",
  USDT: "#26a17b",
};

export function toRaw(amount: number): bigint {
  return BigInt(Math.round(amount * TOKEN_MULTIPLIER));
}

export function fromRaw(raw: bigint | number): number {
  const n = typeof raw === "bigint" ? Number(raw) : raw;
  return n / TOKEN_MULTIPLIER;
}

export function formatToken(amount: number): string {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Fetch token balance for a given mint */
export async function getTokenBalance(
  connection: Connection,
  walletPubkey: PublicKey,
  mint: PublicKey,
): Promise<number> {
  try {
    const ata = await getAssociatedTokenAddress(mint, walletPubkey);
    const account = await getAccount(connection, ata);
    return fromRaw(account.amount);
  } catch {
    return 0;
  }
}

// Re-export for backward compat with existing usdc.ts imports
export const USDC_MULTIPLIER = TOKEN_MULTIPLIER;
export const usdcToRaw = toRaw;
export const rawToUsdc = fromRaw;
export const formatUsdc = formatToken;
export const getUsdcBalance = (connection: Connection, wallet: PublicKey) =>
  getTokenBalance(connection, wallet, USDC_MINT_DEVNET);

export { getAssociatedTokenAddress, createTransferInstruction };
