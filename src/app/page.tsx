"use client";

import Head from "next/head";
import Image from "next/image";
import { useState } from "react";

const amounts = ["0.05 ETH", "0.02 ETH", "0.01 ETH"];

export default function Page() {
  const [selected, setSelected] = useState<string | null>(null);

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
        {/* Lado esquerdo */}
        <section className="flex-1 flex w-1/2 items-center">
          <div className="w-3xl">
            <p className="text-3xl break-all">
              Ajude a proteger nossos penguins-imperadores doando em Cripto.
            </p>
            <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl w-full mt-5 text-center space-y-4 shadow-lg border border-white/10">
              <div className="flex justify-start space-x-2">
                {amounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setSelected(amount)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      selected === amount
                        ? "bg-blue-600 text-white"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    {amount}
                  </button>
                ))}
              </div>
              <hr className="border-white/20" />
              <button className="w-full h-10 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-1xl">
                Donate Now
              </button>
            </div>
          </div>
        </section>

        {/* Lado Direito */}
        <section className="flex-1 flex w-1/2 items-center justify-end">
          <div className="w-full max-w-lg">
            <p className="text-2xl mb-4 text-white">Últimas cinco doações</p>
            <ul className="space-y-4 text-black">
              <li className="flex justify-between bg-gray-100 p-4 rounded-md shadow-md hover:scale-105 transition duration-300">
                <span className="">Doação 1</span>
                <span className="text-black">0.05 ETH</span>
              </li>
              <li className="flex justify-between bg-gray-100 p-4 rounded-md shadow-md hover:scale-105 transition duration-300">
                <span className="">Doação 2</span>
                <span className="text-black">0.02 ETH</span>
              </li>
              <li className="flex justify-between bg-gray-100 p-4 rounded-md shadow-md hover:scale-105 transition duration-300">
                <span className="">Doação 3</span>
                <span className="text-black">0.02 ETH</span>
              </li>
              <li className="flex justify-between bg-gray-100 p-4 rounded-md shadow-md hover:scale-105 transition duration-300">
                <span className="">Doação 4</span>
                <span className="text-black">0.02 ETH</span>
              </li>
              <li className="flex justify-between bg-gray-100 p-4 rounded-md shadow-md hover:scale-105 transition duration-300">
                <span className="">Doação 5</span>
                <span className="text-black">0.01 ETH</span>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
