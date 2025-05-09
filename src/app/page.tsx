"use client";

import { useWeb3 } from "@/contexts/donationProvider/web-context";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { ToastContainer } from "react-toastify";

const amounts = ["0.05", "0.02", "0.01"];

export default function Page() {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const { donate, loadingDonate, loadingDonations, donations } = useWeb3(); //chamando nosso context

  function handleDonate() {
    if (selectedValue && selectedValue > "0") {
      try {
        donate(selectedValue); //enviando doaçao
      } catch (error) { }
    }
  }

  console.log(selectedValue);

  return (
    <div>
      <Head>
        <title>Penguin Donation</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToastContainer />

      <main
        className="flex flex-col lg:flex-row gap-8 px-4 lg:px-20 py-10"
        style={{ minHeight: "calc(100vh - 120px)" }}
      >
        {/* Lado Esquerdo */}
        <section className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-xl flex flex-col gap-6">
            <p className="text-2xl text-white">
              Ajude a proteger nossos penguins-imperadores doando em Cripto.
            </p>

            <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl w-full text-center space-y-4 shadow-lg border border-white/10">
              <div className="flex flex-wrap gap-2 justify-start">
                {amounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setSelectedValue(amount)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedValue === amount
                        ? "bg-blue-600 text-white"
                        : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                  >
                    {amount} ETH
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
        <section className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-xl flex flex-col gap-4">
            <p className="text-2xl text-white">Últimas cinco doações</p>

            <ul className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
              {donations.map((_, index) => (
                <li
                  key={index}
                  className="flex justify-between bg-gray-100 p-4 rounded-lg shadow-md"
                >
                  <span className="text-black">{donations[index].donor}</span>
                  <span className="text-black">{donations[index].value}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );

}
