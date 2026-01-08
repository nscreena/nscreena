"use client";

import { useRouter } from "next/navigation";
import { Token } from "@/types/token";
import { CopyButton } from "./CopyButton";
import { Tooltip } from "./Tooltip";
import { formatNumber, formatPrice, formatAge } from "@/utils/format";

interface TokenCardProps {
  token: Token;
  isNew?: boolean;
  type?: "new" | "bonding" | "migrated";
}

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
  "Moonshot": {
    url: (address) => `https://moonshot.cc/token/${address}`,
    icon: "🌙",
    name: "Moonshot",
  },
  "boop": {
    url: (address) => `https://boop.fun/token/${address}`,
    icon: "👆",
    name: "boop.fun",
  },
};

export function TokenCard({ token, isNew, type, index = 0 }: TokenCardProps & { index?: number }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/token/${token.address}`);
  };

  // Determine progress bar color based on progress
  const getProgressColor = (progress: number) => {
    if (progress >= 90) return "hot"; // About to graduate - RED HOT!
    if (progress >= 80) return "warm"; // Getting close
    return "normal"; // Early stage
  };

  const bondingProgress = token.bondingProgress ?? 0;
  const showProgress = type !== "migrated" && bondingProgress > 0;
  const isHot = bondingProgress >= 90;
  const isWarm = bondingProgress >= 80 && bondingProgress < 90;
  const isMoon = token.marketCap >= 100000;
  const isMegaMoon = token.marketCap >= 200000; // 200K+ for WANTED poster in migrated column

  // Market cap color and style based on value
  const getMarketCapStyle = (mcap: number) => {
    if (mcap >= 100000) return "neon-red font-bold"; // Over 100K = NEON RED
    if (mcap >= 30000) return "text-orange"; // 30K-100K = orange (warming up)
    return "text-cream"; // Under 30K = normal cream
  };

  // Get launchpad info
  const launchpadInfo = token.launchpad ? LAUNCHPAD_URLS[token.launchpad] : undefined;
  
  // Get sticker based on status and column type
  const getSticker = () => {
    // For migrated column: show MOON sticker for 200K+ MCap
    if (type === "migrated" && isMegaMoon) return { text: "🔥 HOT", class: "sticker sticker-hot" };
    if (type === "migrated" && isMoon) return { text: "🚀 MOON", class: "sticker sticker-moon" };
    // For bonding column: show HOT sticker for 90%+ but no WANTED poster
    if (type === "bonding" && isHot) return { text: "🔥 HOT", class: "sticker sticker-hot" };
    // For new column
    if (isMoon) return { text: "🚀 MOON", class: "sticker sticker-moon" };
    if (isNew) return { text: "✨ NEW", class: "sticker sticker-new" };
    return null;
  };
  
  const sticker = getSticker();

  // Card classes - WANTED poster logic:
  // - Column 1 (new): No wanted poster
  // - Column 2 (bonding): No wanted poster
  // - Column 3 (migrated): Wanted poster only for 200K+ MCap
  const showWantedPoster = type === "migrated" && isMegaMoon;
  
  const cardClasses = showWantedPoster 
    ? "wanted-poster" 
    : "bg-bg-card hover:bg-bg-card-hover border border-border hover:border-brown-muted rounded-xl";

  return (
    <div
      onClick={handleClick}
      className={`group p-2 transition-all hover-lift cursor-pointer h-[130px] flex flex-col slide-in-up ${cardClasses} ${
        isNew ? "new-token" : ""
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Top Section: 3 Columns - Compact Layout */}
      <div className="grid grid-cols-[160px_1fr_auto] gap-2 mb-1">
        {/* Column 1: Logo + Name (fixed width for consistent layout) */}
        <div className="flex items-start gap-2 w-[160px] overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-bg-elevated flex items-center justify-center text-base flex-shrink-0 overflow-hidden">
            {token.logo ? (
              <img src={token.logo} alt={token.symbol} className="w-full h-full object-cover" />
            ) : (
              <span>🪙</span>
            )}
          </div>
          <div className="min-w-0 w-[120px]">
            <h3 className="font-semibold text-cream truncate text-xs leading-tight w-full">
              {token.name}
            </h3>
            <p className="text-text-muted text-[10px] truncate">${token.symbol}</p>
            {/* Sticker/Badge below name */}
            {sticker && (
              <span className={`${sticker.class} inline-block mt-0.5 text-[9px] px-1 py-0`}>
                {sticker.text}
              </span>
            )}
            {type === "migrated" && !sticker && (
              <span className="text-[9px] text-text-muted bg-bg-elevated px-1 py-0 rounded-full inline-block mt-0.5">
                {formatAge(token.createdAt)}
              </span>
            )}
          </div>
        </div>
        
        {/* Column 2: Market Cap + Price */}
        <div>
          <span className="text-[9px] text-text-muted">MC</span>
          <div className={`text-base font-bold font-[family-name:var(--font-space-mono)] ${getMarketCapStyle(token.marketCap)}`}>
            {formatNumber(token.marketCap)}
          </div>
        </div>
        
        {/* Column 3: Vol, B/S + Security Badges */}
        <div className="text-[10px] space-y-0.5 text-right">
          <div className="flex items-center justify-end gap-1">
            <span className="text-text-muted">Vol</span>
            <span className="text-text-secondary font-medium font-[family-name:var(--font-space-mono)]">
              {token.volume24h > 0 ? formatNumber(token.volume24h) : "—"}
            </span>
          </div>
          {(token.buyers24h !== undefined || token.sellers24h !== undefined) && (token.buyers24h! > 0 || token.sellers24h! > 0) && (
            <div className="flex items-center justify-end gap-1">
              <span className="text-text-muted">B/S</span>
              <span className="text-green font-medium font-[family-name:var(--font-space-mono)]">{token.buyers24h || 0}</span>
              <span className="text-text-muted">/</span>
              <span className="text-red font-medium font-[family-name:var(--font-space-mono)]">{token.sellers24h || 0}</span>
            </div>
          )}
          
          {/* Security Badges */}
          {token.security && (() => {
            const sniperPct = token.security.sniperHeldPercentage || 0;
            const devPct = token.security.devHeldPercentage || 0;
            const bundlerPct = token.security.bundlerHeldPercentage || 0;
            const insiderPct = token.security.insiderHeldPercentage || 0;
            
            return (
              <div className="flex flex-wrap gap-0.5 justify-end mt-1">
                <Tooltip content={`${sniperPct.toFixed(1)}% held by snipers`}>
                  <span 
                    className={`text-[8px] px-1 py-0.5 rounded font-bold cursor-help ${
                      sniperPct > 30 ? "bg-red/20 text-red" : 
                      sniperPct > 15 ? "bg-orange/20 text-orange" : 
                      sniperPct > 5 ? "bg-yellow/20 text-yellow" :
                      "bg-green/20 text-green"
                    }`}
                  >
                    🎯{sniperPct.toFixed(0)}%
                  </span>
                </Tooltip>
                <Tooltip content={`${devPct.toFixed(1)}% held by dev`}>
                  <span 
                    className={`text-[8px] px-1 py-0.5 rounded font-bold cursor-help ${
                      devPct > 20 ? "bg-red/20 text-red" : 
                      devPct > 10 ? "bg-orange/20 text-orange" :
                      devPct > 5 ? "bg-yellow/20 text-yellow" :
                      "bg-green/20 text-green"
                    }`}
                  >
                    👨‍💻{devPct.toFixed(0)}%
                  </span>
                </Tooltip>
                <Tooltip content={`${bundlerPct.toFixed(1)}% held by bundlers`}>
                  <span 
                    className={`text-[8px] px-1 py-0.5 rounded font-bold cursor-help ${
                      bundlerPct > 20 ? "bg-red/20 text-red" : 
                      bundlerPct > 10 ? "bg-orange/20 text-orange" :
                      bundlerPct > 5 ? "bg-yellow/20 text-yellow" :
                      "bg-green/20 text-green"
                    }`}
                  >
                    📦{bundlerPct.toFixed(0)}%
                  </span>
                </Tooltip>
                <Tooltip content={`${insiderPct.toFixed(1)}% held by insiders`}>
                  <span 
                    className={`text-[8px] px-1 py-0.5 rounded font-bold cursor-help ${
                      insiderPct > 50 ? "bg-red/20 text-red" : 
                      insiderPct > 30 ? "bg-orange/20 text-orange" :
                      insiderPct > 15 ? "bg-yellow/20 text-yellow" :
                      "bg-green/20 text-green"
                    }`}
                  >
                    🤝{insiderPct.toFixed(0)}%
                  </span>
                </Tooltip>
                {token.security.freezable && (
                  <Tooltip content="Token can be frozen">
                    <span className="text-[8px] px-1 py-0.5 rounded font-bold bg-red/20 text-red cursor-help">
                      ❄️
                    </span>
                  </Tooltip>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Bonding Progress */}
      {showProgress && (
        <div className="mb-1">
          <div className="flex justify-between text-[10px] mb-0.5">
            <span className="text-text-muted font-marker">Bonding</span>
            <span className={`font-bold ${isHot ? "neon-red" : isWarm ? "text-yellow" : "text-brown-primary"}`}>
              {bondingProgress >= 99 ? bondingProgress.toFixed(2) : bondingProgress.toFixed(1)}%
            </span>
          </div>
          <div className={`spray-progress h-1.5 ${isHot ? "progress-glow-red" : ""}`}>
            <div
              className={`spray-progress-bar ${getProgressColor(bondingProgress)} transition-all duration-500`}
              style={{ width: `${Math.min(bondingProgress, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Spacer to push footer to bottom */}
      <div className="flex-1" />

      {/* Footer: Contract & Social Links */}
      <div className="pt-1 border-t border-border mt-auto">
        <div className="flex items-center justify-between">
          <CopyButton text={token.address} />
          
          {/* Social Links */}
          <div className="flex items-center gap-1">
            {launchpadInfo && (
              <a
                href={launchpadInfo.url(token.address)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-5 h-5 flex items-center justify-center rounded bg-bg-elevated hover:bg-brown-muted/30 transition-colors"
                title={launchpadInfo.name}
              >
                <span className="text-[10px]">{launchpadInfo.icon}</span>
              </a>
            )}
            {token.twitter && (
              <a
                href={token.twitter}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-5 h-5 flex items-center justify-center rounded bg-bg-elevated hover:bg-brown-muted/30 transition-colors"
                title="Twitter/X"
              >
                <span className="text-[10px]">𝕏</span>
              </a>
            )}
            {token.website && (
              <a
                href={token.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-5 h-5 flex items-center justify-center rounded bg-bg-elevated hover:bg-brown-muted/30 transition-colors"
                title="Website"
              >
                <span className="text-[10px]">🌐</span>
              </a>
            )}
            {token.telegram && (
              <a
                href={token.telegram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-5 h-5 flex items-center justify-center rounded bg-bg-elevated hover:bg-brown-muted/30 transition-colors"
                title="Telegram"
              >
                <span className="text-[10px]">✈️</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
