"use client";

import Head from "next/head";
import Image from "next/image";
import { useState } from "react";

const amounts = ["0.05 ETH", "0.02 ETH", "0.01 ETH"];

export default function Page() {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [donations, setDonations] = useState([]);

  function handleDonate() {
    console.log(selectedValue);
    setDonations([...donations, selectedValue]);
  }

  return (
    <div>
      <Head>
        <title>Penguin Donation</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        className="flex flex-row h-full pl-80 pr-80"
        style={{ height: "calc(100vh - 120px)" }}
      >
        {/* Lado Esquerdo */}
        <section className="flex-1 flex w-1/2 items-center">
          <div className="w-full max-w-xl h-[500px] flex flex-col justify-start rounded-md">
            {/* Título alinhado */}
            <p className="text-2xl mb-4 text-white">
              Ajude a proteger nossos penguins-imperadores doando em Cripto.
            </p>

            {/* Card de doação */}
            <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl w-full text-center space-y-4 shadow-lg border border-white/10">
              <div className="flex justify-start space-x-2">
                {amounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setSelectedValue(amount)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      selectedValue === amount
                        ? "bg-blue-600 text-white"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    {amount}
                  </button>
                ))}
              </div>
              <hr className="border-white/20" />
              <button
                className="w-full h-10 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-1xl cursor-pointer"
                onClick={handleDonate}
              >
                Donate Now
              </button>
            </div>
          </div>
        </section>

        {/* Lado Direito */}
        <section className="flex-1 flex w-1/2 items-center justify-end">
          <div className="w-full h-[500px] flex flex-col justify-end rounded-md">
            {/* Título alinhado */}
            <p className="text-2xl mb-4 text-white">Últimas cinco doações</p>

            {/* Lista com scroll */}
            <ul className="flex-1 overflow-y-auto space-y-2 pr-2">
              {donations.map((_, itens) => (
                <li
                  key={itens}
                  className="flex justify-between bg-gray-100 p-4 rounded-lg shadow-md"
                >
                  <span className="text-black">Address</span>
                  <span className="text-black">{donations[itens]}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
