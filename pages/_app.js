import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { WagmiConfig, createClient, chain, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import Navbar from "../components/Navbar.jsx";
import {
  getDefaultWallets,
  midnightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

const { chains, provider } = configureChains(
  [chain.polygonMumbai],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Password Manager",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }) {
  return (
    // <div className="min-h-full">
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider theme={midnightTheme()} chains={chains}>
        <Navbar></Navbar>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
    // </div>
  );
}

export default MyApp;
