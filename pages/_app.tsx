import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { createConfig, WagmiConfig } from "wagmi";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  metaMaskWallet,
  trustWallet,
  walletConnectWallet,
  ledgerWallet
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains} from "wagmi";
import {mainnet, sepolia, bsc} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import type { AppProps } from "next/app";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, sepolia, bsc],
  [publicProvider()]
);
const connectors = connectorsForWallets([
  {
    groupName: "Popular",
    wallets: [
      injectedWallet({ chains }),
      metaMaskWallet({ projectId: "3070123cded233b935f75e5531756a6a", chains }),
      ledgerWallet({ projectId: "3070123cded233b935f75e5531756a6a", chains }),      
      trustWallet({ projectId: "3070123cded233b935f75e5531756a6a", chains }),
    ],
  },
  {
    groupName: "Recommended",
    wallets: [walletConnectWallet({ projectId: "3070123cded233b935f75e5531756a6a", chains })],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const App = ({ Component, pageProps }: AppProps) => (
  <WagmiConfig config={wagmiConfig}>
    <RainbowKitProvider chains={chains}>
      <Component {...pageProps} />
    </RainbowKitProvider>
  </WagmiConfig>
);

export default App;
