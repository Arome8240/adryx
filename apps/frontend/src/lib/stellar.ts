// Stellar Horizon API utilities — no SDK required, pure REST

const NETWORK = process.env.NEXT_PUBLIC_STELLAR_NETWORK ?? 'testnet';
const HORIZON =
  NETWORK === 'mainnet'
    ? 'https://horizon.stellar.org'
    : 'https://horizon-testnet.stellar.org';

export const STELLAR_EXPLORER =
  NETWORK === 'mainnet'
    ? 'https://stellar.expert/explorer/public'
    : 'https://stellar.expert/explorer/testnet';

// USDC issuer on Stellar
// testnet: Circle's testnet USDC
// mainnet: Centre (official USDC on Stellar)
export const USDC_ISSUER =
  NETWORK === 'mainnet'
    ? 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN'
    : 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5';

interface HorizonBalance {
  asset_type: string;
  asset_code?: string;
  asset_issuer?: string;
  balance: string;
}

async function fetchAccountBalances(address: string): Promise<HorizonBalance[] | null> {
  try {
    const res = await fetch(`${HORIZON}/accounts/${address}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.balances ?? null;
  } catch {
    return null;
  }
}

export async function getUsdcBalance(address: string): Promise<number> {
  const balances = await fetchAccountBalances(address);
  if (!balances) return 0;
  const usdc = balances.find(
    (b) => b.asset_code === 'USDC' && b.asset_type !== 'native',
  );
  return usdc ? parseFloat(usdc.balance) : 0;
}

export async function getXlmBalance(address: string): Promise<number> {
  const balances = await fetchAccountBalances(address);
  if (!balances) return 0;
  const xlm = balances.find((b) => b.asset_type === 'native');
  return xlm ? parseFloat(xlm.balance) : 0;
}

export function txExplorerUrl(txHash: string): string {
  return `${STELLAR_EXPLORER}/tx/${txHash}`;
}

export function accountExplorerUrl(address: string): string {
  return `${STELLAR_EXPLORER}/account/${address}`;
}
