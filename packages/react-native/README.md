# @adryx/react-native

> React Native components for [Adryx](https://github.com/adryx/adryx-sdk) — decentralized advertising powered by Solana.

## Requirements

- React Native 0.70+
- React 17+

## Install

```bash
npm install @adryx/react-native
# or
pnpm add @adryx/react-native
# or
yarn add @adryx/react-native
```

## Usage

```tsx
import { AdBanner } from "@adryx/react-native";

export default function App() {
  return <AdBanner />;
}
```

## Components

### `<AdBanner />`

Renders an Adryx ad unit using native `<Text>`. Currently outputs a placeholder — full ad rendering with Solana integration is coming in the next release.

## Coming Soon

- `<AdryxProvider config={...}>` — context provider for SDK config
- `<AdBanner slotId="..." />` — targeted ad slot rendering
- `useAd(slotId)` — hook for custom ad rendering

## Expo

Compatible with Expo managed and bare workflow.

## License

MIT
