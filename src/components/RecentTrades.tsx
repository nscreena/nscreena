"use client";

import { Trade } from "@/types/token";
import { formatPrice, formatNumber } from "@/utils/format";

interface RecentTradesProps {
  trades: Trade[];
  symbol: string;
}

export function RecentTrades({ trades, symbol }: RecentTradesProps) {
  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = Math.floor((now - timestamp * 1000) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (!trades || trades.length === 0) {
    return (
      <div className="bg-bg-card rounded-2xl border border-border p-6 text-center">
        <p className="text-text-muted">No recent trades available</p>
      </div>
    );
  }

  return (
    <div className="bg-bg-card rounded-2xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="font-marker text-brown-primary">Recent Trades</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-xs text-text-muted">
              <th className="text-left px-4 py-2 font-normal">Type</th>
              <th className="text-right px-4 py-2 font-normal">Amount</th>
              <th className="text-right px-4 py-2 font-normal">Price</th>
              <th className="text-right px-4 py-2 font-normal">Total</th>
              <th className="text-left px-4 py-2 font-normal">Maker</th>
              <th className="text-right px-4 py-2 font-normal">Time</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, index) => {
              const isBigTrade = trade.totalUSD >= 1000;
              return (
              <tr
                key={`${trade.txHash}-${index}`}
                className={`border-b border-border/50 hover:bg-bg-elevated transition-colors ${
                  isBigTrade ? "big-trade-glow bg-yellow/5" : ""
                }`}
              >
                {/* Type */}
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${
                      trade.type === "buy"
                        ? "bg-green/20 text-green"
                        : "bg-red/20 text-red"
                    }`}
                  >
                    {trade.type.toUpperCase()}
                  </span>
                </td>

                {/* Amount */}
                <td className="px-4 py-3 text-right">
                  <p className="text-sm text-cream font-[family-name:var(--font-space-mono)]">
                    {formatNumber(trade.amount)}
                  </p>
                  <p className="text-xs text-text-muted">{symbol}</p>
                </td>

                {/* Price */}
                <td className="px-4 py-3 text-right">
                  <p className="text-sm text-text-secondary font-[family-name:var(--font-space-mono)]">
                    {formatPrice(trade.priceUSD)}
                  </p>
                </td>

                {/* Total */}
                <td className="px-4 py-3 text-right">
                  <p className={`text-sm font-bold font-[family-name:var(--font-space-mono)] ${
                    isBigTrade ? "text-yellow" : trade.type === "buy" ? "text-green" : "text-red"
                  }`}>
                    {formatNumber(trade.totalUSD)}
                    {isBigTrade && " 💰"}
                  </p>
                  {trade.totalSOL !== undefined && trade.totalSOL > 0 && (
                    <p className="text-xs text-text-muted font-[family-name:var(--font-space-mono)]">
                      {trade.totalSOL.toFixed(4)} SOL
                    </p>
                  )}
                </td>

                {/* Maker */}
                <td className="px-4 py-3">
                  <a
                    href={`https://solscan.io/account/${trade.maker}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-text-muted hover:text-brown-primary transition-colors font-[family-name:var(--font-space-mono)]"
                  >
                    {formatAddress(trade.maker)}
                  </a>
                </td>

                {/* Time */}
                <td className="px-4 py-3 text-right">
                  <a
                    href={`https://solscan.io/tx/${trade.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-text-muted hover:text-brown-primary transition-colors"
                  >
                    {formatTime(trade.timestamp)}
                  </a>
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary footer */}
      <div className="px-4 py-3 bg-bg-elevated border-t border-border flex items-center justify-between text-xs">
        <p className="text-text-muted">
          Showing last {trades.length} trade{trades.length !== 1 ? "s" : ""}
        </p>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green" />
            <span className="text-text-muted">
              {trades.filter(t => t.type === "buy").length} Buys
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red" />
            <span className="text-text-muted">
              {trades.filter(t => t.type === "sell").length} Sells
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

