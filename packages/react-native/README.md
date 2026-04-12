# @stackads/react-native

> React Native components for [StackAds](https://github.com/stackads/stackads-sdk) — decentralized advertising powered by the Stacks blockchain.

## Requirements

- React Native 0.70+
- React 17+

## Install

```bash
npm install @stackads/react-native
# or
pnpm add @stackads/react-native
# or
yarn add @stackads/react-native
```

## Usage

```tsx
import { AdBanner } from '@stackads/react-native';

export default function App() {
  return <AdBanner />;
}
```

## Components

### `<AdBanner />`

Renders a StackAds ad unit using native `<Text>`. Currently outputs a placeholder — full ad rendering with blockchain integration is coming in the next release.

## Coming Soon

- `<StackAdsProvider config={...}>` — context provider for SDK config
- `<AdBanner slotId="..." />` — targeted ad slot rendering
- `useAd(slotId)` — hook for custom ad rendering

## Expo

Compatible with Expo managed and bare workflow.

## License

MIT
