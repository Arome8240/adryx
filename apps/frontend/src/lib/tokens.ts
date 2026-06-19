// Token utilities for Stellar USDC/USDT

// Stellar returns balances as formatted decimal strings from Horizon.
// parseFloat("100.0000000") = 100 — no raw integer conversion needed.
export const TOKEN_DECIMALS = 7; // Stellar uses 7 decimal places (stroop precision)
export const TOKEN_MULTIPLIER = 10_000_000; // stroops per XLM/token

export type StablecoinSymbol = 'USDC' | 'USDT';

export const TOKEN_COLORS: Record<StablecoinSymbol, string> = {
  USDC: '#2775ca',
  USDT: '#26a17b',
};

export function toRaw(amount: number): bigint {
  return BigInt(Math.round(amount * TOKEN_MULTIPLIER));
}

export function fromRaw(raw: bigint | number): number {
  const n = typeof raw === 'bigint' ? Number(raw) : raw;
  return n / TOKEN_MULTIPLIER;
}

export function formatToken(amount: number): string {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Aliases kept for backward compatibility
export const formatUsdc = formatToken;
export const USDC_MULTIPLIER = TOKEN_MULTIPLIER;
export const usdcToRaw = toRaw;
export const rawToUsdc = fromRaw;

// Balance helpers re-exported from stellar.ts for convenience
export { getUsdcBalance, getXlmBalance } from './stellar';
