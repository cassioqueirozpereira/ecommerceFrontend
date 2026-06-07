import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Toaster } from "sonner";
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
    template: "%s | VS BEAUTY",
    default: "VS BEAUTY | Beleza e Cuidados Premium",
  },
  description: "Descubra os melhores produtos de beleza, perfumes e cuidados com a pele. VS BEAUTY traz o auge do autocuidado para a sua rotina.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ecommerce-vilmara.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: 'VS BEAUTY',
    title: 'VS BEAUTY | Beleza e Cuidados Premium',
    description: 'Descubra os melhores produtos de beleza, perfumes e cuidados com a pele. VS BEAUTY traz o auge do autocuidado para a sua rotina.',
    images: [{ url: '/produto1.jpeg', width: 1200, height: 630, alt: 'VS BEAUTY - Beleza Premium' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VS BEAUTY | Beleza e Cuidados Premium',
    description: 'Descubra os melhores produtos de beleza, perfumes e cuidados com a pele.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans flex flex-col min-h-screen bg-ivory text-obsidian selection:bg-blush selection:text-ivory">
        <Suspense fallback={null}>
          <Header />
        </Suspense>
        <CartDrawer />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            style: {
              background: '#0D0D12',
              color: '#FAF8F5',
              border: '1px solid rgba(250, 248, 245, 0.2)',
            }
          }} 
        />
      </body>
    </html>
  );
}
