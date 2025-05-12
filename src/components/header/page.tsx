"use client";
import { useWeb3 } from "@/contexts/donationProvider/web-context";
import Image from "next/image";

export default function Header() {
  const { connectWallet, isConnected } = useWeb3();

  // console.log(isConnected);

  return (
    <header className="flex flex-col sm:flex-row w-full py-6 px-4 lg:px-20 bg-transparent items-center justify-between gap-4">
      {/* Seção da Esquerda */}
      <div className="flex items-center gap-2">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          Penguin Donation
        </h1>

        {/* Logo */}
        <Image
          alt="logo de penguin"
          src="/penguinho.png"
          width={50}
          height={50}
          className="object-contain"
        />
      </div>

      {/* Seção da Direita */}
      <div className="flex items-center">
        <button
          className="w-fit px-4 py-2 text-base sm:text-xl rounded-md border-2 border-white text-white hover:bg-white hover:text-black hover:border-black"
          onClick={connectWallet}
        >
          {!isConnected ? "Conectar" : "Conectado"}
        </button>
      </div>
    </header>
  );
}
