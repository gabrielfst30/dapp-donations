// Esse componente é a base de um provedor Web3 em React, com objetivo de:
// Detectar MetaMask,
// Conectar a carteira do usuário,
// Armazenar dados de doações (em desenvolvimento),
// Expor tudo via Context para os filhos.

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

import { ToastContainer, toast } from "react-toastify";
import { ethers, BigNumberish } from "ethers";
import { DonationItemFormat, Props } from "./types";
import { Web3ProviderContext } from "./web-context";
import { BrowserProvider } from "ethers";

//importando o json do contrato donation.sol para pegarmos o ABI (Interface Web)
import donationArtifact from "../../artifacts/contracts/Donation.sol/Donation.json";

//endereço do nosso contrato
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

//Cria um componente provider que consome o context para passar os valores para páginas ou componentes filhos via Context API.
//Forcedor do context
export default function Web3Provider({ children }: Props) {
  const [provider, setProvider] = useState<BrowserProvider>(); //instância do provedor de conexão com MetaMask.
  const [contract, setContract] = useState<ethers.Contract>(); //instância do contrato inteligente.
  const [donations, setDonations] = useState<DonationItemFormat[]>([]); //array com as doações.
  const [isConnected, setIsConnected] = useState(false); //se a carteira está conectada.
  const [total, setTotal] = useState("0"); //valor total doado.
  const [loadingDonate, setLoadingDonate] = useState(false); //status de carregamento de ações.
  const [loadingDonations, setLoadingDonations] = useState(false); //status de carregamento de ações.

  //Validando se o metamask esta instalado
  //gerando o provider pegando a api da metamask
  useEffect(() => {
    //Se tiver instalado cria um novo provider e salva no estado
    if (window.ethereum) {
      const newProvider = new BrowserProvider(window.ethereum);
      setProvider(newProvider);
    }
  }, []);

  //Conectando a nossa wallet
  const connectWallet = async () => {
    try {
      //Solicitando conexão a carteira
      const accounts = await provider?.send("eth_requestAccounts", []);
      if (accounts?.length) {
        //Se estiver conectado seta para true
        setIsConnected(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Função gerada com useCallback para evitar recriação desnecessária (espera-se três parâmetros nessa função)
  const generateContract = useCallback(async () => {
    // 1. Obtém o "signer" conectado — a conta que vai assinar as transações (ex: do MetaMask)
    const signerConnected = await provider?.getSigner();
    // 2. Cria uma instância do contrato inteligente
    const donationContract = new ethers.Contract(
      contractAddress, // Endereço do contrato
      donationArtifact.abi, // ABI (interface do contrato)
      signerConnected // Signer: quem interage com o contrato
    );
    // 3. Armazena esse contrato em um estado para usar depois
    setContract(donationContract);
  }, [provider, contractAddress, donationArtifact.abi]); // Adicione dependências que mudam (provider, contractAddress)

  // UseEffect para chamar a função apenas uma vez
  useEffect(() => {
    generateContract();
  }, [generateContract]); // O useEffect chama a função apenas quando 'generateContract' mudar

  return (
    //Englobando o nosso context em todas as paginas para podermos passar os dados necessários
    <Web3ProviderContext.Provider value={{ connectWallet }}>
      {children}
    </Web3ProviderContext.Provider>
  );
}
