import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Luxe Beauty",
    default: "Luxe Beauty | Neo-Premium E-commerce",
  },
  description: "Experience the finest selection of luxury beauty products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans flex flex-col min-h-screen bg-ivory text-obsidian selection:bg-champagne selection:text-ivory">
        <Header />
        <CartDrawer />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
