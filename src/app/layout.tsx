import type { Metadata } from "next";
import { Suspense } from "react";
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
              const saved = localStorage.getItem("adam-blueprint-theme");
              if (saved === "neon" || saved === "light" || saved === "dark") {
                document.documentElement.dataset.theme = saved;
              }
            })();`,
          }}
        />
      </head>
      <body className="bg-[#070b15] text-white antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <Suspense fallback={null}>
              <ScrollToTop />
            </Suspense>
            <Header />
            <div className="min-h-screen">{children}</div>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}