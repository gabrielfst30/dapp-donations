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

export default function Web3Provider({ children }: Props) {
  const [provider, setProvider] = useState<ReturnType<typeof Web3Provider>>();
  const [contract, setContract] = useState<ethers.Contract>();
  const [donations, setDonations] = useState<DonationItemFormat[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [total, setTotal] = useState("0");
  const [loadingDonate, setLoadingDonate] = useState(false);
  const [loadingDonations, setLoadingDonations] = useState(false);

  return (
    <Web3ProviderContext.Provider value={{}}>
      {children}
    </Web3ProviderContext.Provider>
  );
}
