import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Adam Blueprint | Botswana Real Estate",
  description: "Premium property listings across Botswana. Buy, rent, and sell with Segolame Adam.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-950`}>
        <Header />
        <main className="relative">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}