import type { Metadata } from "next";
import { Sora, Space_Mono, Permanent_Marker } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Graffiti/Street style font
const permanentMarker = Permanent_Marker({
  variable: "--font-marker",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Niggascreener | Solana Trenches",
  description: "Real-time Solana token tracking for degens. Track new pairs, bonding curves, and fresh migrations on pump.fun and bonk.",
  keywords: ["solana", "pump.fun", "bonk", "crypto", "degen", "token tracker", "memecoin"],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Niggascreener | Solana Trenches",
    description: "Real-time Solana token tracking for degens. Track new pairs, bonding curves, and fresh migrations.",
    type: "website",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary",
    title: "Niggascreener | Solana Trenches",
    description: "Real-time Solana token tracking for degens.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Pricedown-style font for GTA aesthetic */}
        <link rel="preconnect" href="https://fonts.cdnfonts.com" />
        <style>{`
          @font-face {
            font-family: 'Pricedown';
            src: url('https://fonts.cdnfonts.com/s/14195/pricedown.woff') format('woff');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
        `}</style>
      </head>
      <body
        className={`${sora.variable} ${spaceMono.variable} ${permanentMarker.variable} antialiased font-[family-name:var(--font-sora)]`}
      >
        <Navbar />
        <main className="pt-14 pb-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
