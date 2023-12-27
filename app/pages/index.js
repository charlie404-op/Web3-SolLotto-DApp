import Header from "../components/Header";
import PotCard from "../components/PotCard";
import Table from "../components/Table";
import style from "../styles/Home.module.css";

import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
require("@solana/wallet-adapter-react-ui/styles.css");
import { BackpackWalletAdapter } from "@solana/wallet-adapter-wallets";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { BraveWalletAdapter } from "@solana/wallet-adapter-wallets";
import { AppProvider } from "../context/context";

export default function Home() {
  const endpoint =
    "https://old-solitary-cherry.solana-devnet.quiknode.pro/f6e889f7044b5794b1826e222eac410b83638dcf/"; //rpc node(quicknode)
  //for multiple wallets (memo) and use WalletMultiButton func. to link 
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new BackpackWalletAdapter(), 
      new SolflareWalletAdapter(),
      new BraveWalletAdapter(),//add here for multiple wallets
    ],
    []
  );

  return (
    //setup connection provider and walletprovider
    //parent is connection provider
    <ConnectionProvider endpoint={endpoint}> 
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>

          <AppProvider>
          <div className={style.wrapper}>
            <Header />
            <PotCard />
            <Table />
          </div>
          </AppProvider>
          
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
