import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adam Blueprint Real Estate",
  description: "Trusted property experts in Botswana.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning stops extensions from causing red boxes
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#070b15] text-white antialiased" suppressHydrationWarning>
        <Header />
        <div className="min-h-screen">{children}</div>
        <Footer />
      </body>
    </html>
  );
}