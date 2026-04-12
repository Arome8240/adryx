# @stackads/react

> React components for [StackAds](https://github.com/stackads/stackads-sdk) — decentralized advertising powered by the Stacks blockchain.

## Requirements

- React 17+

## Install

```bash
npm install @stackads/react
# or
pnpm add @stackads/react
# or
yarn add @stackads/react
```

## Usage

```tsx
import { AdBanner } from '@stackads/react';

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

Renders a StackAds ad unit. Currently outputs a placeholder — full ad rendering with blockchain integration is coming in the next release.

## Coming Soon

- `<StackAdsProvider config={...}>` — context provider for SDK config
- `<AdBanner slotId="..." />` — targeted ad slot rendering
- `useAd(slotId)` — hook for custom ad rendering

## License

MIT
