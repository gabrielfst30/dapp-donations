import { createContext } from "react";
import { Web3Context } from "./types";


//Context que vai englobar a aplicaçao
export const Web3ProviderContext = createContext<Web3Context>({
      connectWallet() {},
      disconnectWallet() {},
      async donate() {},
      donations:[],
      loadingDonate: false,
      loadingDonations: false,
      showConfetti: false,
      isConnected: false,
      total: "0",
})