"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Token } from "@/types/token";
import { TokenChart } from "@/components/TokenChart";
import { HolderDistribution } from "@/components/HolderDistribution";
import { RecentTrades } from "@/components/RecentTrades";
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
  "LaunchLab": {
    url: (address) => `https://launchlab.xyz/token/${address}`,
    icon: "🚀",
    name: "LaunchLab",
  },
};

export default function TokenDetailPage() {
  const params = useParams();
  const router = useRouter();
  const address = params.address as string;
  
  const [token, setToken] = useState<Token | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Fetch token data
  const fetchToken = async (showLoadingState = true) => {
    if (showLoadingState) {
      setIsLoading(true);
    }
    
    try {
      const response = await fetch(`/api/tokens/${address}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setToken({
          ...data.data,
          createdAt: new Date(data.data.createdAt),
        });
        setLastUpdate(new Date());
        setError(null);
      } else {
        setError(data.error || "Token not found");
      }
    } catch (err) {
      setError("Failed to fetch token");
    } finally {
      if (showLoadingState) {
        setIsLoading(false);
      }
    }
  };

  // Initial load
  useEffect(() => {
    if (!address) return;
    fetchToken(true);
  }, [address]);

  // Auto-refresh every 15 seconds
  useEffect(() => {
    if (!address || !token) return;

    const interval = setInterval(() => {
      fetchToken(false); // Don't show loading spinner for background refresh
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, [address, token]);

  // Market cap color
  const getMarketCapStyle = (mcap: number) => {
    if (mcap >= 100000) return "neon-red font-bold";
    if (mcap >= 30000) return "text-orange";
    return "text-cream";
  };

  // Get launchpad info
  const launchpadInfo = token?.launchpad ? LAUNCHPAD_URLS[token.launchpad] : undefined;

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
          <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 w-20 bg-bg-elevated rounded animate-pulse" />
              <div className="h-4 w-40 bg-bg-elevated rounded animate-pulse" />
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-bg-elevated animate-pulse" />
                <div>
                  <div className="h-10 w-48 bg-bg-elevated rounded animate-pulse mb-2" />
                  <div className="h-5 w-24 bg-bg-elevated rounded animate-pulse" />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="bg-bg-card px-4 py-2 rounded-xl w-32 h-16 animate-pulse" />
                <div className="bg-bg-card px-4 py-2 rounded-xl w-32 h-16 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Skeleton Main Content */}
        <div className="relative z-10 max-w-[1800px] mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column Skeleton */}
            <div className="space-y-4">
              <div className="bg-bg-card rounded-2xl p-4 border border-border h-24 animate-pulse" />
              <div className="bg-bg-card rounded-2xl p-4 border border-border h-48 animate-pulse" />
              <div className="bg-bg-card rounded-2xl p-4 border border-border h-32 animate-pulse" />
            </div>
            {/* Right Column Skeleton - Chart */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-bg-card rounded-2xl border border-border h-[500px] lg:h-[600px] animate-pulse flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full border-4 border-brown-primary border-t-transparent animate-spin mx-auto mb-3" />
                  <p className="text-text-muted font-marker">Loading chart...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !token) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4 block">😵</span>
          <h1 className="gta-text text-3xl mb-2">Token Not Found</h1>
          <p className="text-text-muted mb-6">{error || "This token doesn't exist or couldn't be loaded."}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-brown-primary text-bg-dark font-marker rounded-xl hover:bg-brown-light transition-colors"
          >
            Go Back
          </button>
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
        <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 py-6">
          {/* Back Button & Last Update */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-text-muted hover:text-cream transition-colors"
            >
              <span>←</span>
              <span className="font-marker">Back</span>
            </button>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span>🔄</span>
              <span>Auto-refresh (15s)</span>
              <span className="text-text-secondary">
                • Updated {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Token Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-bg-elevated flex items-center justify-center text-3xl overflow-hidden">
                {token.logo ? (
                  <img src={token.logo} alt={token.symbol} className="w-full h-full object-cover" />
                ) : (
                  <span>🪙</span>
                )}
              </div>
              <div>
                <h1 className="gta-text text-3xl sm:text-4xl tracking-wide">
                  {token.name}
                </h1>
                <p className="text-text-muted text-lg">${token.symbol}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="bg-bg-card px-4 py-2 rounded-xl">
                <p className="text-text-muted text-xs">Market Cap</p>
                <p className={`text-xl font-bold font-[family-name:var(--font-space-mono)] ${getMarketCapStyle(token.marketCap)}`}>
                  {formatNumber(token.marketCap)}
                </p>
              </div>
              <div className="bg-bg-card px-4 py-2 rounded-xl">
                <p className="text-text-muted text-xs">24h Change</p>
                <p className={`text-xl font-bold font-[family-name:var(--font-space-mono)] ${token.priceChange24h >= 0 ? "text-green" : "text-red"}`}>
                  {token.priceChange24h >= 0 ? "+" : ""}{token.priceChange24h.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-[1800px] mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Token Info */}
          <div className="space-y-4">
            {/* Contract Address */}
            <div className="bg-bg-card rounded-2xl p-4 border border-border">
              <h3 className="font-marker text-brown-primary mb-3">Contract Address</h3>
              <ClickToCopyAddress address={token.address} />
            </div>

            {/* Stats Grid */}
            <div className="bg-bg-card rounded-2xl p-4 border border-border">
              <h3 className="font-marker text-brown-primary mb-3">Token Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <StatBox label="Volume 24h" value={formatNumber(token.volume24h)} />
                <StatBox label="Liquidity" value={formatNumber(token.liquidity)} />
                <StatBox label="Holders" value={token.holders && token.holders > 0 ? token.holders.toLocaleString() : "—"} />
                <StatBox label="Age" value={formatAge(token.createdAt)} />
                <StatBox 
                  label="Buyers 24h" 
                  value={token.buyers24h?.toString() || "—"} 
                  valueClass="text-green"
                />
                <StatBox 
                  label="Sellers 24h" 
                  value={token.sellers24h?.toString() || "—"} 
                  valueClass="text-red"
                />
              </div>
            </div>

            {/* Bonding Progress - Only show if token is NOT migrated/bonded */}
            {!token.isMigrated && token.bondingProgress !== undefined && token.bondingProgress > 0 && (
              <div className="bg-bg-card rounded-2xl p-4 border border-border">
                <h3 className="font-marker text-brown-primary mb-3">Bonding Curve</h3>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-text-muted">Progress</span>
                  <span className={`font-bold ${token.bondingProgress >= 90 ? "neon-red" : token.bondingProgress >= 80 ? "text-yellow" : "text-brown-primary"}`}>
                    {token.bondingProgress.toFixed(2)}%
                  </span>
                </div>
                <div className="spray-progress">
                  <div
                    className={`spray-progress-bar ${token.bondingProgress >= 90 ? "hot" : token.bondingProgress >= 80 ? "warm" : "normal"}`}
                    style={{ width: `${Math.min(token.bondingProgress, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Holder Distribution */}
            {token.topHolders && token.top10HoldersPercentage && (
              <HolderDistribution 
                topHolders={token.topHolders} 
                top10Percentage={token.top10HoldersPercentage}
                security={token.security}
              />
            )}

            {/* Links */}
            <div className="bg-bg-card rounded-2xl p-4 border border-border">
              <h3 className="font-marker text-brown-primary mb-3">Links</h3>
              <div className="flex flex-wrap gap-2">
                {launchpadInfo && (
                  <a
                    href={launchpadInfo.url(token.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-bg-elevated rounded-lg text-sm text-text-secondary hover:text-cream hover:bg-bg-card-hover transition-colors"
                  >
                    <span>{launchpadInfo.icon}</span>
                    <span>{launchpadInfo.name}</span>
                  </a>
                )}
                {token.twitter && (
                  <a
                    href={token.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-bg-elevated rounded-lg text-sm text-text-secondary hover:text-cream hover:bg-bg-card-hover transition-colors"
                  >
                    <span>𝕏</span>
                    <span>Twitter</span>
                  </a>
                )}
                {token.website && (
                  <a
                    href={token.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-bg-elevated rounded-lg text-sm text-text-secondary hover:text-cream hover:bg-bg-card-hover transition-colors"
                  >
                    <span>🌐</span>
                    <span>Website</span>
                  </a>
                )}
                {token.telegram && (
                  <a
                    href={token.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-bg-elevated rounded-lg text-sm text-text-secondary hover:text-cream hover:bg-bg-card-hover transition-colors"
                  >
                    <span>✈️</span>
                    <span>Telegram</span>
                  </a>
                )}
                <a
                  href={`https://solscan.io/token/${token.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-bg-elevated rounded-lg text-sm text-text-secondary hover:text-cream hover:bg-bg-card-hover transition-colors"
                >
                  <span>🔍</span>
                  <span>Solscan</span>
                </a>
              </div>
            </div>
          </div>

          {/* Center & Right Column - Chart & Trades */}
          <div className="lg:col-span-2 space-y-4">
            {/* Chart */}
            <div className="bg-bg-card rounded-2xl border border-border overflow-hidden h-[500px] lg:h-[600px]">
              <TokenChart 
                address={token.address} 
                symbol={token.symbol} 
                totalSupply={token.marketCap > 0 && token.price > 0 ? token.marketCap / token.price : 1000000000}
              />
            </div>

            {/* Recent Trades */}
            {token.recentTrades && token.recentTrades.length > 0 && (
              <RecentTrades trades={token.recentTrades} symbol={token.symbol} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, valueClass = "text-cream" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="bg-bg-elevated rounded-lg p-3">
      <p className="text-text-muted text-xs mb-1">{label}</p>
      <p className={`font-bold font-[family-name:var(--font-space-mono)] ${valueClass}`}>{value}</p>
    </div>
  );
}

// Clickable address component that copies to clipboard on click
function ClickToCopyAddress({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg transition-all duration-200 group cursor-pointer ${
        copied 
          ? "bg-green/20 border border-green" 
          : "bg-bg-elevated hover:bg-border"
      }`}
      title="Click to copy"
    >
      <code className={`text-xs overflow-hidden text-ellipsis transition-colors ${
        copied ? "text-green" : "text-text-secondary"
      }`}>
        {copied ? "Copied to clipboard!" : address}
      </code>
      <span className={`text-base shrink-0 transition-all duration-200 ${
        copied ? "scale-125" : "group-hover:scale-110"
      }`}>
        {copied ? "✅" : "📋"}
      </span>
    </button>
  );
}
