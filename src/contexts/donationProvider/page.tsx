"use client";

import {
  useEffect,
  useState,
  useCallback,
  ReactNode,
  useMemo,
} from "react";
import { Bounce, toast } from "react-toastify";
import { ethers, BigNumberish } from "ethers";
import { BrowserProvider } from "ethers";
import { DonationItem, DonationItemFormat, Props } from "./types";
import { Web3ProviderContext } from "./web-context";

import donationArtifact from "../../artifacts/contracts/Donation.sol/Donation.json";

// Endereço do contrato implantado na Monad
const contractAddress = "0x40363F328B639b12BE269246b7C30230e1fe3dd0";

export default function Web3Provider({ children }: Props) {
  // === 1. ESTADOS GERAIS ===
  const [provider, setProvider] = useState<BrowserProvider>();
  const [contract, setContract] = useState<ethers.Contract>();
  const [donations, setDonations] = useState<DonationItemFormat[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [total, setTotal] = useState("0");
  const [loadingDonate, setLoadingDonate] = useState(false);
  const [loadingDonations, setLoadingDonations] = useState(false);

  // === 2. CRIA PROVIDER AO DETECTAR METAMASK ===
  useEffect(() => {
    if (window.ethereum) {
      const newProvider = new BrowserProvider(window.ethereum);
      setProvider(newProvider);
    }
  }, []);

  // === 3. CONECTA WALLET SE PROVIDER EXISTIR ===
  useEffect(() => {
    if (provider) {
      connectWallet();
    } else {
      disconnectWallet();
    }
  }, [provider]);

  // === 4. EXIBE TOAST DE ERRO GENÉRICO ===
  const errorMsg = (error: any, title = "Erro na transação") => {
    const description = error?.reason || "Erro. tente novamente.";

    toast.error(description, {
      position: "top-center",
      autoClose: 5000,
      theme: "dark",
      transition: Bounce,
    });
  };

  // === 5. CONECTA WALLET PELO METAMASK ===
  const connectWallet = useCallback(async () => {
    try {
      const accounts = await provider?.send("eth_requestAccounts", []);
      if (accounts?.length) setIsConnected(true);
    } catch (error) {
      if (error?.code !== 4001) errorMsg(error); // ignora cancelamentos
    }
  }, [provider]);

  // === 6. DESCONECTA (SIMBOLICAMENTE) A WALLET ===
  const disconnectWallet = async () => {
    setIsConnected(false); // reset apenas local
  };

  // === 7. INSTANCIA O CONTRATO SE A WALLET ESTIVER CONECTADA ===
  const generateContract = useCallback(async () => {
    const signerConnected = await provider?.getSigner();
    if (!signerConnected) return;

    const donationContract = new ethers.Contract(
      contractAddress,
      donationArtifact.abi,
      signerConnected
    );

    setContract(donationContract);
  }, [provider]);

  // === 8. BUSCA DOAÇÕES E VALOR TOTAL ===
  const getDonations = useCallback(async () => {
    if (!contract) return;

    try {
      setLoadingDonations(true);

      const [data, totalValue] = await Promise.all([
        contract.getDonations(),
        contract.total(),
      ]);

      const dataFormat = data.map((item) => ({
        id: item.id.toString(),
        donor: item.donor,
        value: ethers.formatEther(item.value),
      }));

      setTotal(ethers.formatEther(totalValue.toString()));
      setDonations(dataFormat.slice(-5));
    } catch (error: any) {
      console.error("Erro ao buscar doações:", error);
      if (error.reason || error.code) errorMsg(error);
    } finally {
      setLoadingDonations(false);
    }
  }, [contract]);

  // === 9. ENVIA UMA DOAÇÃO PARA O CONTRATO ===
  const donate = useCallback(
    async (amount: string) => {
      try {
        setLoadingDonate(true);

        const value = ethers.parseEther(amount);
        const tx = await contract?.donate({ value });

        toast.info("Transação pendente", {
          position: "top-center",
          autoClose: 7000,
          theme: "dark",
          transition: Bounce,
        });

        await tx.wait();

        toast.success("Transação concluída!", {
          position: "top-center",
          autoClose: 5000,
          theme: "dark",
          transition: Bounce,
        });

        getDonations();
      } catch (error) {
        errorMsg(error);
      } finally {
        setLoadingDonate(false);
      }
    },
    [contract, getDonations]
  );

  // === 10. GERAR CONTRATO QUANDO O PROVIDER ESTIVER PRONTO ===
  useEffect(() => {
    generateContract();
  }, [generateContract]);

  // === 11. BUSCAR DOAÇÕES APÓS O CONTRATO SER GERADO ===
  useEffect(() => {
    if (contract) getDonations();
  }, [contract]);

  // === 12. MEMORIZA OS VALORES PARA O CONTEXTO ===
  const values = useMemo(() => {
    return {
      connectWallet,
      disconnectWallet,
      donate,
      loadingDonations,
      loadingDonate,
      donations,
      isConnected,
      total,
    };
  }, [
    connectWallet,
    disconnectWallet,
    donate,
    loadingDonations,
    loadingDonate,
    donations,
    isConnected,
    total,
  ]);

  // === 13. FORNECE O CONTEXTO AOS COMPONENTES FILHOS ===
  return (
    <Web3ProviderContext.Provider value={values}>
      {children}
    </Web3ProviderContext.Provider>
  );
}
