// Esse componente é a base de um provedor Web3 em React, com objetivo de:
// Detectar MetaMask,
// Conectar a carteira do usuário,
// Armazenar dados de doações (em desenvolvimento),
// Expor tudo via Context para os filhos.

"use client";

import {
  useEffect,
  useState,
  useCallback,
  ReactNode,
  useMemo,
  useContext,
  ProviderProps,
} from "react";

import { Bounce, ToastContainer, toast } from "react-toastify";
import { ethers, BigNumberish } from "ethers";
import { DonationItem, DonationItemFormat, Props } from "./types";
import { Web3ProviderContext } from "./web-context";
import { BrowserProvider } from "ethers";

//importando o json do contrato donation.sol para pegarmos o ABI (Interface Web)
import donationArtifact from "../../artifacts/contracts/Donation.sol/Donation.json";
//endereço do nosso contrato
const contractAddress = "0x40363F328B639b12BE269246b7C30230e1fe3dd0";

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

  useEffect(() => {
    if (provider) {
      connectWallet();
    } else {
      disconnectWallet();
    }
  }, [provider]);

  const errorMsg = (error: any, title = "Erro na transação") => {
    const description = error?.reason ? error.reason : "Erro. tente novamente.";

    toast.error("Erro. tente novamente.", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  };

  //Conectando a nossa wallet, utilizando o useCallback para re-renderizar apenas quando o provider for alterado
  const connectWallet = useCallback(async () => {
    try {
      //Solicitando conexão a carteira
      const accounts = await provider.send("eth_requestAccounts", []);
      if (accounts?.length) {
        //Se estiver conectado seta para true
        setIsConnected(true);
      }
    } catch (error) {
      errorMsg(error);
    }
  }, [provider]);
  //
  const disconnectWallet = async () => {
    try {
      //Se estiver desconectado seta para false
      setIsConnected(false);
    } catch (error) {
      errorMsg(error);
    }
  };

  // Gerando nosso contrato inteligente
  const generateContract = useCallback(async () => {
    // Função gerada com useCallback para evitar recriação desnecessária (espera-se três parâmetros nessa função)
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

  //Pegando a lista de doaçoes
  //evitando loop infinito utilizando callback
  const getDonations = useCallback(async () => {
    if (!contract) return;
    try {
      setLoadingDonations(true);
      const data = (await contract?.getDonations()) as DonationItem[]; //data chama as donations e retorna tipado com DonationItem
      const totalValue = (await contract?.total()) as BigNumberish; //chama o totalrecebe tipagem BigNumberish

      //formatando os dados recebidos de getDonations
      const dataFormat = data.map((item) => ({
        id: item.id.toString(),
        donor: item.donor,
        value: ethers.formatEther(item.value),
      }));

      //formatando o valor em ether e convertendo para string
      setTotal(ethers.formatEther(totalValue.toString()));

      //pegando as 5 ultimas doaçoes
      setDonations(dataFormat.slice(-5));
    } catch (error) {
      errorMsg(error);
    } finally {
      setLoadingDonations(false);
    }
  }, [contract]);

  const donate = useCallback(
    async (amount: string) => {
      //valor da doação que vamos receber
      try {
        setLoadingDonate(true);
        //formatando value para ether
        const value = ethers.parseEther(amount);
        //enviando donate
        const donatePending = await contract?.donate({
          value,
        });

        toast.info("Transação pendente", {
          position: "top-center",
          autoClose: 7000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });

        //aguardando transação
        await donatePending.wait();

        toast.success("Transação concluída!", {
          position: "top-center",
          autoClose: loadingDonate ? 100000 : 0,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });

        //atualizando a lista de donations
        getDonations();
      } catch (error) {
        errorMsg(error);
      } finally {
        setLoadingDonate(false);
      }
    },
    [getDonations, contract, toast]
  );

  // UseEffect para chamar a função apenas uma vez
  // gerando contract donation
  useEffect(() => {
    generateContract();
  }, [generateContract]); // O useEffect chama a função apenas quando 'generateContract' mudar

  //chamando a funçao getDonations
  useEffect(() => {
    if (contract) {
      getDonations();
    }
  }, [contract]);

  //useMemo para evitar re-renderizaçoes desnecessárias do value a cada interação do componente na tela
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
    donations,
    loadingDonations,
    isConnected,
    loadingDonate,
    total,
  ]);

  return (
    //Englobando o nosso context em todas as paginas para podermos passar os dados necessários
    <Web3ProviderContext.Provider value={values}>
      {children}
    </Web3ProviderContext.Provider>
  );
}
