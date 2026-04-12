# @adryx/core

> Framework-agnostic core SDK for [Adryx](https://github.com/adryx/adryx-sdk) — decentralized advertising powered by Solana.

## Install

```bash
npm install @adryx/core
# or
pnpm add @adryx/core
# or
yarn add @adryx/core
```

## Usage

```ts
import { hello } from "@adryx/core";

console.log(hello()); // "Hello from Adryx Core"
```

## Coming Soon

- `initialize(config)` — set up your Adryx integration
- `loadAd()` — fetch an ad from the decentralized network
- `trackImpression(adId)` — record an impression on-chain (Solana)
- `trackClick(adId)` — record a click on-chain (Solana)

## License

MIT
