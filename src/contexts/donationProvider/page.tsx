import {
  createContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
  useMemo,
  useContext,
  ProviderProps,
} from "react";

import { ethers, BigNumberish } from "ethers";
import { DonationItemFormat, Props } from "./types";
import { Web3ProviderContext } from "./web-context";
import { BrowserProvider } from "ethers";


export default function Web3Provider({ children }: Props) {
  const [provider, setProvider] = useState<BrowserProvider>();
  const [contract, setContract] = useState<ethers.Contract>();
  const [donations, setDonations] = useState<DonationItemFormat[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [total, setTotal] = useState("0");
  const [loadingDonate, setLoadingDonate] = useState(false);
  const [loadingDonations, setLoadingDonations] = useState(false);

  //Validando se o metamask esta instalado
  useEffect(() => {
    if (window.ethereum) {
      const newProvider = new BrowserProvider(window.ethereum);
      setProvider(newProvider);
    }
  }, []);

  const connectWallet = async () => {
    try {
      const accounts = await provider?.send("eth_requestAccounts", []);
      if (accounts?.length) {
        setIsConnected(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Web3ProviderContext.Provider value={{}}>
      {children}
    </Web3ProviderContext.Provider>
  );
}
