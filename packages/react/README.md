# @adryx/react

> React components for [Adryx](https://github.com/adryx/adryx-sdk) — decentralized advertising powered by Solana.

## Requirements

- React 17+

## Install

```bash
npm install @adryx/react
# or
pnpm add @adryx/react
# or
yarn add @adryx/react
```

## Usage

```tsx
import { AdBanner } from "@adryx/react";

export default function App() {
  return (
    <main>
      <AdBanner />
    </main>
  );
}
```

## Components

### `<AdBanner />`

Renders an Adryx ad unit. Currently outputs a placeholder — full ad rendering with Solana integration is coming in the next release.

## Coming Soon

- `<AdryxProvider config={...}>` — context provider for SDK config
- `<AdBanner slotId="..." />` — targeted ad slot rendering
- `useAd(slotId)` — hook for custom ad rendering

## License

MIT
