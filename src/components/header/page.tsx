"use client";
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex flex-row w-full h-30 pt-10 bg-transparent items-center justify-between pl-80 pr-80">
      {/* Seção da Esquerda */}
      <div className="flex items-center gap-2">
        {/* Title */}
        <h1 className="text-4xl font-bold">Penguin Donation</h1>

        {/* Logo */}
        <Image
          alt="logo de penguin"
          src="/penguinho.png"
          width={60}
          height={60}
        />
      </div>
      {/* Seção da Direita */}
      <div className="flex items-center">
        {/* Button */}
        <button className="w-fit p-2 text-xl rounded-md border-2 border-white text-white hover:bg-white hover:text-black hover:border-black">
          Connect Wallet
        </button>
      </div>
    </header>
  );
}
