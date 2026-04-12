import {
  broadcastTransaction,
  makeContractCall,
  standardPrincipalCV,
  uintCV,
} from "@stacks/transactions";
import { STACKS_MAINNET, STACKS_TESTNET, createNetwork } from "@stacks/network";
import { config } from "dotenv";
config();

const PRIVATE_KEY =
  process.env.PRIVATE_KEY ||
  process.env.DEPLOYER_KEY ||
  process.env.privateKey ||
  "0xPrivateKey";

const STACKS_NETWORK = "mainnet";
const STACKS_API_URL = process.env.STACKS_API_URL;

const CONTRACT_ADDRESS =
  process.env.CONTRACT_ADDRESS || "SP25H46Z9YCAB1TW93YG42WM0SREG9SC5EZB977TJ";
const CONTRACT_NAME = "stackads-token";
const RECIPIENT_ADDRESS =
  process.env.RECIPIENT_ADDRESS || "SP1EQNTKNRGME36P9EEXZCFFNCYBA50VN51676JB";

const TX_COUNT = Number.parseInt(process.env.TX_COUNT || "100", 10);
const FEE = Number.parseInt(process.env.FEE || "6000", 10);
const DELAY_MS = Number.parseInt(process.env.DELAY_MS || "5000", 10);
const PAUSE_ON_RATE_LIMIT_MS = Number.parseInt(
  process.env.PAUSE_ON_RATE_LIMIT_MS || "30000",
  10,
);

if (!PRIVATE_KEY) {
  throw new Error("Set PRIVATE_KEY or DEPLOYER_KEY in .env");
}

if (!CONTRACT_ADDRESS) {
  throw new Error(
    "Set CONTRACT_ADDRESS in .env (deployer address of the contract)",
  );
}

function buildNetwork() {
  const base = STACKS_NETWORK === "mainnet" ? STACKS_MAINNET : STACKS_TESTNET;
  return createNetwork({
    network: base,
    client: { baseUrl: STACKS_API_URL || base.client.baseUrl },
  });
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function isRateLimit(err: any) {
  const msg = JSON.stringify(err || "").toLowerCase();
  return msg.includes("rate") || msg.includes("per-minute");
}

async function sendTx(index: number) {
  const network = buildNetwork();
  const recipient = RECIPIENT_ADDRESS || CONTRACT_ADDRESS;

  // Vary the amount slightly to produce distinct tx payloads
  const amount = 1_000_000n + BigInt(index); // base 1 STAD (6 decimals) + index

  console.log(
    `\n[${index}/${TX_COUNT}] Broadcasting mint ${amount} to ${recipient}...`,
  );

  try {
    const tx = await makeContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: "mint",
      functionArgs: [uintCV(amount), standardPrincipalCV(recipient)],
      senderKey: PRIVATE_KEY,
      network,
      fee: FEE,
    });

    const result = await broadcastTransaction({ transaction: tx, network });

    if ("error" in result) {
      console.error(`❌ Tx ${index} failed:`, result.error);
      return { ok: false, txid: null, error: result.error };
    } else {
      console.log(`✅ Tx ${index} broadcast: ${result.txid}`);
      console.log(
        `🔗 https://explorer.hiro.so/txid/${result.txid}?chain=${STACKS_NETWORK}`,
      );
      return { ok: true, txid: result.txid, error: null };
    }
  } catch (error: any) {
    console.error(`❌ Tx ${index} threw:`, error);
    return { ok: false, txid: null, error };
  }
}

async function main() {
  console.log(
    `Sending ${TX_COUNT} mint transactions to ${STACKS_NETWORK} for ${CONTRACT_ADDRESS}.${CONTRACT_NAME}`,
  );

  let success = 0;
  let failed = 0;
  const errors: Array<{ index: number; error: any }> = [];

  for (let i = 1; i <= TX_COUNT; i++) {
    const res = await sendTx(i);

    if (res.ok) {
      success++;
    } else {
      failed++;
      errors.push({ index: i, error: res.error });

      if (isRateLimit(res.error) && PAUSE_ON_RATE_LIMIT_MS > 0) {
        console.log(
          `⏸ Rate limit detected, pausing ${PAUSE_ON_RATE_LIMIT_MS}ms before continuing...`,
        );
        await sleep(PAUSE_ON_RATE_LIMIT_MS);
      }
    }

    if (DELAY_MS > 0) await sleep(DELAY_MS);
  }

  console.log(`\nDone. Success: ${success}, Failed: ${failed}`);

  if (errors.length) {
    console.log("Failures:");
    for (const e of errors) {
      console.log(`  #${e.index}: ${JSON.stringify(e.error)}`);
    }
  }
}

main().catch((err) => {
  console.error("❌ Script failed:", err);
  process.exit(1);
});
