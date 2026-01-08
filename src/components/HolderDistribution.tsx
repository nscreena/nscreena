"use client";

import { TokenHolder, SecurityInfo } from "@/types/token";
import { CopyButton } from "./CopyButton";
import { Tooltip } from "./Tooltip";

interface HolderDistributionProps {
  topHolders: TokenHolder[];
  top10Percentage: number;
  security?: SecurityInfo;
}

export function HolderDistribution({ topHolders, top10Percentage, security }: HolderDistributionProps) {
  const colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8",
    "#F7DC6F", "#BB8FCE", "#85C1E2", "#F8B739", "#52B788"
  ];

  // Calculate "Others" percentage
  const othersPercentage = Math.max(0, 100 - top10Percentage);
  
  // Always show security badges, even if values are 0
  const sniperPct = security?.sniperHeldPercentage || 0;
  const devPct = security?.devHeldPercentage || 0;
  const bundlerPct = security?.bundlerHeldPercentage || 0;
  const insiderPct = security?.insiderHeldPercentage || 0;

  return (
    <div className="bg-bg-card rounded-2xl p-4 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-marker text-brown-primary">Token Distribution</h3>
        <div className="text-right">
          <p className="text-xs text-text-muted">Top 10 Concentration</p>
          <p className={`font-bold ${top10Percentage > 70 ? "neon-red" : top10Percentage > 50 ? "text-orange" : "text-green"}`}>
            {top10Percentage.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Security Badges - Small with icons only */}
      <div className="flex flex-wrap gap-0.5 mb-4">
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
        {security?.freezable && (
          <Tooltip content="Token can be frozen">
            <span className="text-[8px] px-1 py-0.5 rounded font-bold bg-red/20 text-red cursor-help">
              ❄️
            </span>
          </Tooltip>
        )}
      </div>

      {/* Simple Pie Chart */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {topHolders.slice(0, 10).map((holder, index) => {
              const startAngle = topHolders
                .slice(0, index)
                .reduce((sum, h) => sum + h.percentage, 0);
              const angle = holder.percentage;
              const x1 = 50 + 45 * Math.cos((startAngle * Math.PI) / 50);
              const y1 = 50 + 45 * Math.sin((startAngle * Math.PI) / 50);
              const x2 = 50 + 45 * Math.cos(((startAngle + angle) * Math.PI) / 50);
              const y2 = 50 + 45 * Math.sin(((startAngle + angle) * Math.PI) / 50);
              const largeArc = angle > 50 ? 1 : 0;

              return (
                <path
                  key={holder.address}
                  d={`M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={colors[index]}
                  opacity="0.9"
                />
              );
            })}
            {/* Others segment */}
            {othersPercentage > 0 && (
              <path
                d={`M 50 50 L ${50 + 45 * Math.cos((top10Percentage * Math.PI) / 50)} ${
                  50 + 45 * Math.sin((top10Percentage * Math.PI) / 50)
                } A 45 45 0 ${othersPercentage > 50 ? 1 : 0} 1 50 5 Z`}
                fill="#333"
                opacity="0.5"
              />
            )}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-1 max-h-32 overflow-y-auto">
          {topHolders.slice(0, 5).map((holder, index) => (
            <div key={holder.address} className="flex items-center gap-2 text-xs">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: colors[index] }}
              />
              <span className="text-text-muted flex-1 truncate">
                #{index + 1}: {holder.percentage.toFixed(2)}%
              </span>
            </div>
          ))}
          {othersPercentage > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-sm bg-[#333]" />
              <span className="text-text-muted">Others: {othersPercentage.toFixed(2)}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Top 10 Holders List */}
      <div className="space-y-2">
        <h4 className="text-sm text-text-muted font-marker mb-2">Top 10 Holders</h4>
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {topHolders.slice(0, 10).map((holder, index) => (
            <div
              key={holder.address}
              className="flex items-center gap-2 bg-bg-elevated rounded-lg p-2"
            >
              <div
                className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-bg-dark"
                style={{ backgroundColor: colors[index] }}
              >
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <a
                    href={`https://solscan.io/account/${holder.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-text-secondary hover:text-brown-primary transition-colors truncate block max-w-[200px] font-mono"
                  >
                    {holder.address.slice(0, 6)}...{holder.address.slice(-4)}
                  </a>
                  <CopyButton text={holder.address} size="sm" />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-bg-card rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${holder.percentage}%`,
                        backgroundColor: colors[index],
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-cream">{holder.percentage.toFixed(2)}%</p>
                <p className="text-xs text-text-muted">
                  {holder.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

