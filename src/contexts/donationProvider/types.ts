import { BigNumberish } from "ethers";
import { ReactNode } from "react";

export type DonationItem = {
  id: BigNumberish;
  donor: string;
  value: BigNumberish;
};

export type DonationItemFormat = {
  id: string;
  donor: string;
  value: string;
};

export type Props = {
  children: ReactNode;
}

export type Web3Context = {
  connectWallet: () => void;
  disconnectWallet: () => void;
  donate: (amount: string) => Promise<void>;
  donations: DonationItemFormat[];
  loadingDonate: boolean;
  loadingDonations: boolean;
  isConnected: boolean;
  total: string;
};
