"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTokens } from "@/hooks/useTokens";
import { Token, SortField, SortDirection } from "@/types/token";
import { CopyButton } from "@/components/CopyButton";
import { formatNumber, formatPrice, formatAge } from "@/utils/format";

// Launchpad URLs
const LAUNCHPAD_URLS: Record<string, { url: (address: string) => string; icon: string; name: string }> = {
  "Pump.fun": {
    url: (address) => `https://pump.fun/coin/${address}`,
    icon: "🟢",
    name: "Pump.fun",
  },
  "Bonk": {
    url: (address) => `https://letsbonk.fun/token/${address}`,
    icon: "🐕",
    name: "Bonk",
  },
};

export default function TrendingPage() {
  const { tokens, isLoading, lastUpdated } = useTokens({ 
    type: "trending", 
    pollInterval: 15000 
  });
  
  const [sortField, setSortField] = useState<SortField>("volume24h");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedTokens = [...tokens]
    .sort((a, b) => {
      let aVal: number, bVal: number;
      
      switch (sortField) {
        case "price":
          aVal = a.price;
          bVal = b.price;
          break;
        case "marketCap":
          aVal = a.marketCap;
          bVal = b.marketCap;
          break;
        case "volume24h":
          aVal = a.volume24h;
          bVal = b.volume24h;
          break;
        case "liquidity":
          aVal = a.liquidity;
          bVal = b.liquidity;
          break;
        case "holders":
          aVal = a.holders;
          bVal = b.holders;
          break;
        case "priceChange24h":
          aVal = a.priceChange24h;
          bVal = b.priceChange24h;
          break;
        case "age":
          aVal = a.createdAt.getTime();
          bVal = b.createdAt.getTime();
          break;
        default:
          aVal = a.volume24h;
          bVal = b.volume24h;
      }
      
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    });

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

      {/* Hero Section - GTA Style */}
      <div className="relative overflow-hidden z-10">
        <div className="relative max-w-[1800px] mx-auto px-3 sm:px-6 py-3 sm:py-6">
          <div className="text-center mb-2 sm:mb-4">
            <h1 className="gta-text text-3xl sm:text-5xl lg:text-6xl mb-2 sm:mb-3 tracking-wider drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
              What&apos;s poppin
            </h1>
            <p className="text-cream-muted text-sm sm:text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <span className="graffiti-tag text-brown-primary text-base sm:text-lg">Trending tokens</span>{" "}
              on Solana right now
            </p>
            <p className="mt-1 sm:mt-2 text-cream-muted text-xs sm:text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {sortedTokens.length} tokens • Updated {lastUpdated ? formatAge(lastUpdated) + " ago" : "..."}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="relative z-10 hidden lg:block max-w-[1800px] mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-bg-main rounded-2xl border border-border overflow-hidden torn-edge">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-bg-card/50">
                  <th className="text-left p-4 text-text-muted font-marker text-sm">#</th>
                  <th className="text-left p-4 text-text-muted font-marker text-sm">Token</th>
                  <SortableHeader 
                    label="Price" 
                    field="price" 
                    currentField={sortField} 
                    direction={sortDirection}
                    onClick={handleSort}
                  />
                  <SortableHeader 
                    label="24h %" 
                    field="priceChange24h" 
                    currentField={sortField} 
                    direction={sortDirection}
                    onClick={handleSort}
                  />
                  <SortableHeader 
                    label="Market Cap" 
                    field="marketCap" 
                    currentField={sortField} 
                    direction={sortDirection}
                    onClick={handleSort}
                  />
                  <SortableHeader 
                    label="Volume 24h" 
                    field="volume24h" 
                    currentField={sortField} 
                    direction={sortDirection}
                    onClick={handleSort}
                  />
                  <SortableHeader 
                    label="Liquidity" 
                    field="liquidity" 
                    currentField={sortField} 
                    direction={sortDirection}
                    onClick={handleSort}
                  />
                  <th className="text-left p-4 text-text-muted font-marker text-sm">B/S 24h</th>
                  <SortableHeader 
                    label="Age" 
                    field="age" 
                    currentField={sortField} 
                    direction={sortDirection}
                    onClick={handleSort}
                  />
                  <th className="text-left p-4 text-text-muted font-marker text-sm">Links</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="border-b border-border">
                      <td colSpan={10} className="p-4">
                        <div className="skeleton h-8 rounded-lg" />
                      </td>
                    </tr>
                  ))
                ) : (
                  sortedTokens.map((token, index) => (
                    <TokenRow key={token.address} token={token} rank={index + 1} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="relative z-10 lg:hidden px-3 pb-6">
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-bg-card rounded-xl p-4 border border-border">
                <div className="skeleton h-16 rounded-lg" />
              </div>
            ))
          ) : (
            sortedTokens.map((token, index) => (
              <MobileTokenCard key={token.address} token={token} rank={index + 1} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function SortableHeader({
  label,
  field,
  currentField,
  direction,
  onClick,
}: {
  label: string;
  field: SortField;
  currentField: SortField;
  direction: SortDirection;
  onClick: (field: SortField) => void;
}) {
  const isActive = currentField === field;
  
  return (
    <th 
      className={`text-left p-4 font-marker text-sm cursor-pointer hover:text-cream transition-colors select-none ${
        isActive ? "text-brown-primary" : "text-text-muted"
      }`}
      onClick={() => onClick(field)}
    >
      <span className="flex items-center gap-1">
        {label}
        <span className={`transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`}>
          {direction === "asc" ? "↑" : "↓"}
        </span>
      </span>
    </th>
  );
}

function TokenRow({ token, rank }: { token: Token; rank: number }) {
  const router = useRouter();
  const priceChangeColor = token.priceChange24h >= 0 ? "neon-green" : "neon-red";
  const priceChangePrefix = token.priceChange24h >= 0 ? "+" : "";
  const launchpadInfo = token.launchpad ? LAUNCHPAD_URLS[token.launchpad] : undefined;

  // Market cap color
  const getMarketCapStyle = (mcap: number) => {
    if (mcap >= 100000) return "neon-red font-bold"; 
    if (mcap >= 30000) return "text-orange";
    return "text-text-secondary";
  };

  const handleRowClick = () => {
    router.push(`/token/${token.address}`);
  };

  return (
    <tr 
      onClick={handleRowClick}
      className="border-b border-border hover:bg-bg-card/50 transition-colors slide-in-up cursor-pointer" 
      style={{ animationDelay: `${rank * 30}ms` }}
    >
      <td className="p-4 text-text-muted font-marker">{rank}</td>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-bg-elevated flex items-center justify-center text-sm overflow-hidden">
            {token.logo ? (
              <img src={token.logo} alt={token.symbol} className="w-full h-full object-cover" />
            ) : (
              <span>🪙</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-cream">{token.name}</span>
            </div>
            <span className="text-text-muted text-sm">${token.symbol}</span>
          </div>
        </div>
      </td>
      <td className="p-4 font-[family-name:var(--font-space-mono)] text-cream">
        {formatPrice(token.price)}
      </td>
      <td className={`p-4 font-medium ${priceChangeColor}`}>
        {priceChangePrefix}{token.priceChange24h.toFixed(2)}%
      </td>
      <td className={`p-4 font-[family-name:var(--font-space-mono)] ${getMarketCapStyle(token.marketCap)}`}>
        {formatNumber(token.marketCap)}
      </td>
      <td className="p-4 font-[family-name:var(--font-space-mono)] text-text-secondary">
        {formatNumber(token.volume24h)}
      </td>
      <td className="p-4 font-[family-name:var(--font-space-mono)] text-text-secondary">
        {formatNumber(token.liquidity)}
      </td>
      <td className="p-4">
        <div className="flex items-center gap-1 text-sm">
          <span className="text-green font-medium">{token.buyers24h || 0}</span>
          <span className="text-text-muted">/</span>
          <span className="text-red font-medium">{token.sellers24h || 0}</span>
        </div>
      </td>
      <td className="p-4 text-text-muted">
        {formatAge(token.createdAt)}
      </td>
      <td className="p-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-1.5">
          <CopyButton text={token.address} />
          {launchpadInfo && (
            <a
              href={launchpadInfo.url(token.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 flex items-center justify-center rounded bg-bg-elevated hover:bg-brown-muted/30 transition-colors"
              title={launchpadInfo.name}
            >
              <span className="text-xs">{launchpadInfo.icon}</span>
            </a>
          )}
          {token.twitter && (
            <a
              href={token.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 flex items-center justify-center rounded bg-bg-elevated hover:bg-brown-muted/30 transition-colors"
              title="Twitter/X"
            >
              <span className="text-xs">𝕏</span>
            </a>
          )}
          {token.website && (
            <a
              href={token.website}
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 flex items-center justify-center rounded bg-bg-elevated hover:bg-brown-muted/30 transition-colors"
              title="Website"
            >
              <span className="text-xs">🌐</span>
            </a>
          )}
        </div>
      </td>
    </tr>
  );
}

// Mobile Card Component for Trending
function MobileTokenCard({ token, rank }: { token: Token; rank: number }) {
  const router = useRouter();
  const priceChangeColor = token.priceChange24h >= 0 ? "text-green" : "text-red";
  const priceChangePrefix = token.priceChange24h >= 0 ? "+" : "";
  const launchpadInfo = token.launchpad ? LAUNCHPAD_URLS[token.launchpad] : undefined;

  const getMarketCapStyle = (mcap: number) => {
    if (mcap >= 100000) return "text-red font-bold"; 
    if (mcap >= 30000) return "text-orange";
    return "text-cream";
  };

  return (
    <div 
      onClick={() => router.push(`/token/${token.address}`)}
      className="bg-bg-card rounded-xl p-4 border border-border active:border-brown-primary/50 cursor-pointer"
    >
      {/* Header: Rank, Token Info, Price Change */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-text-muted font-marker text-sm">#{rank}</span>
          <div className="w-10 h-10 rounded-lg bg-bg-elevated flex items-center justify-center overflow-hidden">
            {token.logo ? (
              <img src={token.logo} alt={token.symbol} className="w-full h-full object-cover" />
            ) : (
              <span>🪙</span>
            )}
          </div>
          <div>
            <p className="font-semibold text-cream text-sm">{token.name}</p>
            <p className="text-text-muted text-xs">${token.symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-cream font-[family-name:var(--font-space-mono)] text-sm">
            {formatPrice(token.price)}
          </p>
          <p className={`text-xs font-medium ${priceChangeColor}`}>
            {priceChangePrefix}{token.priceChange24h.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-bg-elevated rounded-lg p-2">
          <p className="text-[10px] text-text-muted">MCap</p>
          <p className={`text-xs font-bold font-[family-name:var(--font-space-mono)] ${getMarketCapStyle(token.marketCap)}`}>
            {formatNumber(token.marketCap)}
          </p>
        </div>
        <div className="bg-bg-elevated rounded-lg p-2">
          <p className="text-[10px] text-text-muted">Vol 24h</p>
          <p className="text-xs font-bold text-text-secondary font-[family-name:var(--font-space-mono)]">
            {formatNumber(token.volume24h)}
          </p>
        </div>
        <div className="bg-bg-elevated rounded-lg p-2">
          <p className="text-[10px] text-text-muted">B/S</p>
          <p className="text-xs font-bold">
            <span className="text-green">{token.buyers24h || 0}</span>
            <span className="text-text-muted">/</span>
            <span className="text-red">{token.sellers24h || 0}</span>
          </p>
        </div>
      </div>

      {/* Footer: Age & Links */}
      <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
        <span className="text-text-muted text-xs">{formatAge(token.createdAt)}</span>
        <div className="flex items-center gap-2">
          <CopyButton text={token.address} size="sm" />
          {launchpadInfo && (
            <a
              href={launchpadInfo.url(token.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 flex items-center justify-center rounded bg-bg-elevated"
            >
              <span className="text-xs">{launchpadInfo.icon}</span>
            </a>
          )}
          {token.twitter && (
            <a
              href={token.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 flex items-center justify-center rounded bg-bg-elevated"
            >
              <span className="text-xs">𝕏</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
