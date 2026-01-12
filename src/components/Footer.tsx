"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Footer() {
  const [solPrice, setSolPrice] = useState<number | null>(null);

  // Fetch SOL price
  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
        const data = await response.json();
        setSolPrice(data.solana?.usd || null);
      } catch {
        // Silently fail
      }
    };
    fetchSolPrice();
    const interval = setInterval(fetchSolPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-bg-dark/95 backdrop-blur-sm">
      <div className="w-full px-3 sm:px-4 py-2">
        <div className="flex items-center justify-between gap-2">
          {/* Left: Logo & Name */}
          <div className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="Niggascreena" 
              className="w-6 h-6 rounded-lg opacity-80"
            />
            <span className="font-marker text-text-muted text-xs hidden sm:inline">Niggascreena</span>
          </div>

          {/* Center: SOL Price & Stats */}
          <div className="flex items-center gap-3 sm:gap-6 text-[10px] sm:text-xs">
            {solPrice && (
              <div className="flex items-center gap-1">
                <span className="text-text-muted">SOL</span>
                <span className="text-green font-bold font-[family-name:var(--font-space-mono)]">
                  ${solPrice.toFixed(2)}
                </span>
              </div>
            )}
            <div className="hidden sm:flex items-center gap-1">
              <span className="text-text-muted">Network</span>
              <span className="text-green">●</span>
              <span className="text-text-secondary">Solana</span>
            </div>
          </div>

          {/* Right: Links */}
          <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs">
            <Link 
              href="/" 
              className="text-text-muted hover:text-cream transition-colors"
            >
              Screena
            </Link>
            <Link 
              href="/trending" 
              className="text-text-muted hover:text-cream transition-colors hidden sm:inline"
            >
              Top Hoods
            </Link>
            <Link 
              href="/realest-niggas" 
              className="text-text-muted hover:text-cream transition-colors hidden sm:inline"
            >
              Realest Niggas
            </Link>
            <span className="text-text-muted/20 hidden sm:inline">|</span>
            <Link 
              href="/terms" 
              className="text-text-muted hover:text-cream transition-colors hidden sm:inline"
            >
              Terms
            </Link>
            <Link 
              href="/privacy" 
              className="text-text-muted hover:text-cream transition-colors hidden sm:inline"
            >
              Privacy
            </Link>
            <a 
              href="https://x.com/nscreena" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-text-muted hover:text-cream transition-colors"
            >
              𝕏
            </a>
            <span className="text-text-muted/40 hidden sm:inline">© 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
