import type { Metadata } from "next";
import "./globals.css";
import { Inter, Montserrat } from 'next/font/google'
import Header from "@/components/header/page";

export const metadata: Metadata = {
  title: "Crypto Donations",
  description: "Doações de criptomoedas",
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
      <Header />
        {children}
      </body>
    </html>
  );
}
