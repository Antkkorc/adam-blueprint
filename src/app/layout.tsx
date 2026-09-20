import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Adam Blueprint | Botswana Real Estate",
    template: "%s | Adam Blueprint",
  },
  description: "Trusted property experts in Botswana.",
  keywords: ["Botswana property", "Gaborone real estate", "property for sale", "property to rent"],
  openGraph: {
    title: "Adam Blueprint | Botswana Real Estate",
    description: "Find verified homes, plots, rentals, and commercial property across Botswana.",
    type: "website",
    locale: "en_BW",
  },
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
        <ThemeProvider>
          <AuthProvider>
            <ScrollToTop />
            <Header />
            <div className="min-h-screen">{children}</div>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}