import { createContext, useContext, useMemo, useEffect, useState } from "react";
import { BN } from "@project-serum/anchor";
import { SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import bs58 from "bs58"


import { 
  getLotteryAddress, 
  getMasterAddress, 
  getProgram, 
  getTicketAddress, 
  getTotalPrize,
} from "../utils/program";
import { confirmTx, mockWallet} from "../utils/helper";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [masterAddress, setMasterAddress] = useState();
  const [initialized, setInitialized] = useState(false);

  //get provider
  const {connection} = useConnection()
  const wallet = useAnchorWallet()
  const program = useMemo(() => {
    if (connection) {
      return getProgram(connection, wallet ?? mockWallet());
    }
  } , [connection, wallet])


  useEffect(() => {
    updateState()
  }, [program]) //dependency module


  const updateState = async () => {
    if(!program) return;

    try{
      if(!masterAddress) {
        //get master address
        const masterAddress = await getMasterAddress()
        //useStateis used to save the seeds
        setMasterAddress(masterAddress)
        console.log(masterAddress)
      }
      const master = await program.account.master.fetch(
        masterAddress ?? (await getMasterAddress())
      )
      setInitialized(true)
    } catch(err) {
      console.log(err.message);
    }
  }


  //call solana program instructions here (initMaster)
  const initMaster = async () => {
    try {
      const txHash = await program.methods
      .initMaster()
      .accounts({
        master: masterAddress,
        payer: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc()
      await confirmTx(txHash, connection)

      updateState()
    } catch (err) {
      console.log(err.message)
    }
  }



  return (
    <AppContext.Provider
      value={{
        // Put functions/variables you want to bring out of context to App in here
        connected: wallet?.publicKey ? true : false,
        isMasterInitialized: initialized,
        initMaster,

      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
