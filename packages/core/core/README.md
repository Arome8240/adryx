# @stackads/core

> Framework-agnostic core SDK for [StackAds](https://github.com/stackads/stackads-sdk) — decentralized advertising powered by the Stacks blockchain.

## Install

```bash
npm install @stackads/core
# or
pnpm add @stackads/core
# or
yarn add @stackads/core
```

## Usage

```ts
import { hello } from '@stackads/core';

console.log(hello()); // "Hello from StackAds Core"
```

## API

### `hello()`

Returns a greeting string. This is the initial hello-world export — full SDK methods are coming in the next release.

```ts
hello(): string
```

## Coming Soon

- `initialize(config)` — set up your StackAds integration
- `loadAd()` — fetch an ad from the decentralized network
- `trackImpression(adId)` — record an impression on-chain
- `trackClick(adId)` — record a click on-chain

## License

MIT
