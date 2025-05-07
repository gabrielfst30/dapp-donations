import { createContext, useContext } from "react"; //função do React usada para criar um contexto.
import { Web3Context } from "./types"; //Tipagem de dados que iremos utilizar baseado no donation.sol


//Criando um context e especificando quais funções e valores estarão disponiveis para o provider
export const Web3ProviderContext = createContext<Web3Context>({
      connectWallet() {},
      disconnectWallet() {},
      async donate() {},
      donations:[],
      loadingDonate: false,
      loadingDonations: false,
      // showConfetti: false,
      isConnected: false,
      total: "0",
})

//hook customizado que você usa em componentes filhos para acessar o contexto sem precisar importar diretamente useContext e Web3ProviderContext.
export const useWeb3 = () => useContext(Web3ProviderContext)