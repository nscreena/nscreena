"use client";

import { useEffect, useState } from "react";
import { formatNumber } from "@/utils/format";

interface SmartWallet {
  address: string;
  name?: string;
  twitter?: string;
  image?: string;
  
  // 24h Activity Stats (from Moralis)
  volumeSOL: number;
  volume: number;
  buyVolume: number;
  sellVolume: number;
  totalTrades: number;
  buys: number;
  sells: number;
  uniqueTokens: number;
  avgTradeSize: number;
  lastActivity: number;
}

export default function RealestNiggasPage() {
  const [wallets, setWallets] = useState<SmartWallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSmartWallets = async () => {
      try {
        const response = await fetch("/api/smart-wallets");
        const data = await response.json();
        
        if (data.success) {
          setWallets(data.wallets);
        }
      } catch (error) {
        console.error("Error fetching smart wallets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSmartWallets();
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchSmartWallets, 60000);
    return () => clearInterval(interval);
  }, []);

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-dark relative">
        {/* Hero Background Image */}
        <div 
          className="absolute top-0 left-0 right-0 h-[400px] sm:h-[500px] lg:h-[600px] pointer-events-none z-0"
          style={{
            backgroundImage: 'url(/hero.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-dark" />
          <div className="absolute inset-0 bg-bg-dark/40" />
        </div>

        {/* Skeleton Hero Header */}
        <div className="relative overflow-hidden z-10">
          <div className="relative max-w-[1800px] mx-auto px-3 sm:px-6 py-4 sm:py-12">
            <div className="text-center">
              <h1 className="gta-text text-3xl sm:text-6xl mb-2 sm:mb-4 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                Realest <span className="text-brown-primary">Niggas</span>
              </h1>
              <p className="text-cream-muted text-sm sm:text-lg max-w-2xl mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Top 10 most active KOL wallets by trading volume in the last 24h.
              </p>
            </div>
          </div>
        </div>

        {/* Skeleton Wallet List */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-3 sm:px-6 py-4 sm:py-8">
          {/* Table Header Skeleton */}
          <div className="hidden lg:grid lg:grid-cols-[2fr_1.2fr_1fr_0.8fr_1fr_0.8fr_100px] gap-6 px-6 py-3 text-xs text-cream-muted mb-2">
            <div>Trader</div>
            <div>Volume 24h</div>
            <div>Trades 24h</div>
            <div>Tokens</div>
            <div>Avg Trade</div>
            <div>Last Trade</div>
            <div></div>
          </div>

          <div className="space-y-3">
            {/* Skeleton Cards */}
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className="bg-bg-card rounded-2xl border border-border p-4 lg:p-6 animate-pulse"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Desktop Skeleton */}
                <div className="hidden lg:grid lg:grid-cols-[2fr_1.2fr_1fr_0.8fr_1fr_0.8fr_100px] gap-6 items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-bg-elevated" />
                    <div className="w-10 h-10 rounded-full bg-bg-elevated" />
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-bg-elevated rounded" />
                      <div className="h-3 w-20 bg-bg-elevated rounded" />
                    </div>
                  </div>
                  <div className="h-6 w-20 bg-bg-elevated rounded" />
                  <div className="h-6 w-16 bg-bg-elevated rounded" />
                  <div className="h-6 w-12 bg-bg-elevated rounded" />
                  <div className="h-6 w-16 bg-bg-elevated rounded" />
                  <div className="h-6 w-14 bg-bg-elevated rounded" />
                  <div className="h-8 w-20 bg-bg-elevated rounded-xl" />
                </div>

                {/* Mobile Skeleton */}
                <div className="lg:hidden">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-bg-elevated" />
                    <div className="w-10 h-10 rounded-full bg-bg-elevated" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-24 bg-bg-elevated rounded" />
                      <div className="h-3 w-20 bg-bg-elevated rounded" />
                    </div>
                    <div className="h-8 w-20 bg-bg-elevated rounded-xl" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-bg-elevated rounded-lg h-14" />
                    <div className="bg-bg-elevated rounded-lg h-14" />
                    <div className="bg-bg-elevated rounded-lg h-14" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark relative">
      {/* Hero Background Image */}
      <div 
        className="absolute top-0 left-0 right-0 h-[400px] sm:h-[500px] lg:h-[600px] pointer-events-none z-0"
        style={{
          backgroundImage: 'url(/hero.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-dark" />
        <div className="absolute inset-0 bg-bg-dark/40" />
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden z-10">
        <div className="relative max-w-[1800px] mx-auto px-3 sm:px-6 py-4 sm:py-12">
          <div className="text-center">
            <h1 className="gta-text text-3xl sm:text-6xl mb-2 sm:mb-4 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
              Realest <span className="text-brown-primary">Niggas</span>
            </h1>
            <p className="text-cream-muted text-sm sm:text-lg max-w-2xl mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Top 10 most active KOL wallets by trading volume in the last 24h.
            </p>
          </div>
        </div>
      </div>

      {/* Wallets List */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* Table Header */}
        <div className="hidden lg:grid lg:grid-cols-[2fr_1.2fr_1fr_0.8fr_1fr_0.8fr_100px] gap-6 px-6 py-3 text-xs text-cream-muted mb-2">
          <div>Trader</div>
          <div>Volume 24h</div>
          <div>Trades 24h</div>
          <div>Tokens</div>
          <div>Avg Trade</div>
          <div>Last Trade</div>
          <div></div>
        </div>

        <div className="space-y-3">
          {wallets.map((wallet, index) => (
            <div
              key={wallet.address}
              className="bg-bg-card rounded-2xl border border-border p-4 lg:p-6 hover:border-brown-primary/50 transition-all group"
            >
              {/* Desktop Layout */}
              <div className="hidden lg:grid lg:grid-cols-[2fr_1.2fr_1fr_0.8fr_1fr_0.8fr_100px] gap-6 items-center">
                {/* Trader Info */}
                <div className="flex items-center gap-3">
                  {/* Rank Badge */}
                  <div
                    className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center font-bold text-sm ${
                      index === 0
                        ? "bg-yellow/20 text-yellow"
                        : index === 1
                        ? "bg-yellow/20 text-yellow"
                        : index === 2
                        ? "bg-orange/20 text-orange"
                        : "bg-bg-elevated text-text-muted"
                    }`}
                  >
                    {index === 0 ? (
                      <img src="/logo.png" alt="1st" className="w-6 h-6 object-contain" />
                    ) : index === 1 ? "🍌" : index === 2 ? "🍗" : `#${index + 1}`}
                  </div>
                  
                  {/* Profile Picture */}
                  <div className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden border-2 border-border group-hover:border-brown-primary transition-colors">
                    {wallet.image ? (
                      <img
                        src={wallet.image}
                        alt={wallet.name || "KOL"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`${wallet.image ? 'hidden' : ''} absolute inset-0 bg-brown-primary/20 flex items-center justify-center text-brown-primary font-bold`}>
                      {(wallet.name || "?").charAt(0).toUpperCase()}
                    </div>
                  </div>
                  
                  {/* Name & Address */}
                  <div className="min-w-0">
                    {wallet.twitter ? (
                      <a
                        href={wallet.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cream font-bold hover:text-brown-primary transition-colors flex items-center gap-1 truncate"
                      >
                        <span className="truncate">{wallet.name || shortenAddress(wallet.address)}</span>
                        <span className="text-text-muted text-sm shrink-0">𝕏</span>
                      </a>
                    ) : (
                      <span className="text-cream font-bold truncate block">
                        {wallet.name || shortenAddress(wallet.address)}
                      </span>
                    )}
                    <p className="text-xs text-text-muted font-mono truncate">
                      {shortenAddress(wallet.address)}
                    </p>
                  </div>
                </div>

                {/* Volume */}
                <div>
                  <p className="text-lg font-bold text-green font-[family-name:var(--font-space-mono)]">
                    {(wallet.volumeSOL ?? 0).toFixed(1)} SOL
                  </p>
                  <p className="text-[10px] text-text-muted">
                    {formatNumber(wallet.volume ?? 0)}
                  </p>
                </div>
                
                {/* Trades */}
                <div>
                  <p className="text-lg font-bold text-brown-primary">
                    {wallet.totalTrades ?? 0}
                  </p>
                  <p className="text-[10px] text-text-muted">
                    <span className="text-green">{wallet.buys ?? 0}B</span>
                    {" / "}
                    <span className="text-red">{wallet.sells ?? 0}S</span>
                  </p>
                </div>
                
                {/* Tokens */}
                <div>
                  <p className="text-lg font-bold text-yellow">
                    {wallet.uniqueTokens ?? 0}
                  </p>
                  <p className="text-[10px] text-text-muted">unique</p>
                </div>
                
                {/* Avg Trade */}
                <div>
                  <p className="text-base font-bold text-text-secondary font-[family-name:var(--font-space-mono)]">
                    {formatNumber(wallet.avgTradeSize ?? 0)}
                  </p>
                </div>
                
                {/* Last Trade */}
                <div>
                  <p className="text-sm font-bold text-text-secondary">
                    {(wallet.lastActivity ?? 0) > 0 ? formatTimeAgo(wallet.lastActivity) : "N/A"}
                  </p>
                </div>

                {/* Action */}
                <div>
                  <a
                    href={`https://solscan.io/account/${wallet.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-bg-elevated text-text-secondary font-marker text-sm rounded-xl hover:bg-brown-muted/30 transition-colors block text-center"
                  >
                    Solscan
                  </a>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="lg:hidden">
                <div className="flex items-center gap-3 mb-4">
                  {/* Rank Badge */}
                  <div
                    className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center font-bold text-sm ${
                      index === 0
                        ? "bg-yellow/20 text-yellow"
                        : index === 1
                        ? "bg-yellow/20 text-yellow"
                        : index === 2
                        ? "bg-orange/20 text-orange"
                        : "bg-bg-elevated text-text-muted"
                    }`}
                  >
                    {index === 0 ? (
                      <img src="/logo.png" alt="1st" className="w-6 h-6 object-contain" />
                    ) : index === 1 ? "🍌" : index === 2 ? "🍗" : `#${index + 1}`}
                  </div>
                  
                  {/* Profile Picture */}
                  <div className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden border-2 border-border">
                    {wallet.image ? (
                      <img
                        src={wallet.image}
                        alt={wallet.name || "KOL"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`${wallet.image ? 'hidden' : ''} absolute inset-0 bg-brown-primary/20 flex items-center justify-center text-brown-primary font-bold`}>
                      {(wallet.name || "?").charAt(0).toUpperCase()}
                    </div>
                  </div>
                  
                  {/* Name & Address */}
                  <div className="flex-1 min-w-0">
                    {wallet.twitter ? (
                      <a
                        href={wallet.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cream font-bold hover:text-brown-primary transition-colors flex items-center gap-1"
                      >
                        <span className="truncate">{wallet.name || shortenAddress(wallet.address)}</span>
                        <span className="text-text-muted text-sm">𝕏</span>
                      </a>
                    ) : (
                      <span className="text-cream font-bold truncate block">
                        {wallet.name || shortenAddress(wallet.address)}
                      </span>
                    )}
                    <p className="text-xs text-text-muted font-mono">
                      {shortenAddress(wallet.address)}
                    </p>
                  </div>

                  <a
                    href={`https://solscan.io/account/${wallet.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-bg-elevated text-text-secondary font-marker text-sm rounded-xl hover:bg-brown-muted/30 transition-colors shrink-0"
                  >
                    Solscan
                  </a>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-bg-elevated rounded-lg p-2">
                    <p className="text-[10px] text-text-muted">Volume</p>
                    <p className="text-sm font-bold text-green font-[family-name:var(--font-space-mono)]">
                      {(wallet.volumeSOL ?? 0).toFixed(1)} SOL
                    </p>
                  </div>
                  <div className="bg-bg-elevated rounded-lg p-2">
                    <p className="text-[10px] text-text-muted">Trades</p>
                    <p className="text-sm font-bold text-brown-primary">
                      {wallet.totalTrades ?? 0}
                    </p>
                  </div>
                  <div className="bg-bg-elevated rounded-lg p-2">
                    <p className="text-[10px] text-text-muted">Tokens</p>
                    <p className="text-sm font-bold text-yellow">
                      {wallet.uniqueTokens ?? 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {wallets.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">📊</span>
            <p className="text-text-muted font-marker text-xl">No smart money data available yet</p>
            <p className="text-text-muted text-sm mt-2">Check back soon for top traders</p>
          </div>
        )}
      </div>
    </div>
  );
}

