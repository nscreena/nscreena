"use client";

import { useState } from "react";
import { TokenFilters, DEFAULT_FILTERS } from "@/types/token";

interface FilterPanelProps {
  filters: TokenFilters;
  onFiltersChange: (filters: TokenFilters) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const LAUNCHPADS = [
  { value: "Pump.fun", label: "Pump.fun" },
  { value: "Bonk", label: "Bonk" },
  { value: "LaunchLab", label: "LaunchLab" },
  { value: "Moonshot", label: "Moonshot" },
  { value: "boop", label: "boop.fun" },
];

export function FilterPanel({ filters, onFiltersChange, isOpen, onToggle }: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<TokenFilters>(filters);

  const updateFilter = <K extends keyof TokenFilters>(key: K, value: TokenFilters[K]) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
  };

  const resetFilters = () => {
    setLocalFilters(DEFAULT_FILTERS);
    onFiltersChange(DEFAULT_FILTERS);
  };

  const toggleLaunchpad = (launchpad: string) => {
    const current = localFilters.launchpadName || DEFAULT_FILTERS.launchpadName || [];
    const newList = current.includes(launchpad)
      ? current.filter(l => l !== launchpad)
      : [...current, launchpad];
    updateFilter("launchpadName", newList.length > 0 ? newList : undefined);
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 bg-bg-card hover:bg-bg-card-hover border border-border rounded-xl transition-all"
      >
        <span>🎛️</span>
        <span className="text-cream">Filter</span>
        {Object.keys(filters).length > Object.keys(DEFAULT_FILTERS).length && (
          <span className="w-2 h-2 bg-brown-primary rounded-full" />
        )}
      </button>
    );
  }

  return (
    <div className="bg-bg-card border border-border rounded-2xl p-4 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-cream flex items-center gap-2">
          <span>🎛️</span> Filter
        </h3>
        <button onClick={onToggle} className="text-text-muted hover:text-cream transition-colors">
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Launchpad Selection */}
        <div className="col-span-full">
          <label className="text-xs text-text-muted mb-2 block">Launchpads</label>
          <div className="flex flex-wrap gap-2">
            {LAUNCHPADS.map(lp => (
              <button
                key={lp.value}
                onClick={() => toggleLaunchpad(lp.value)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  (localFilters.launchpadName || DEFAULT_FILTERS.launchpadName)?.includes(lp.value)
                    ? "bg-brown-primary text-bg-dark"
                    : "bg-bg-elevated text-text-secondary hover:bg-bg-card-hover"
                }`}
              >
                {lp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Market Filters */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-brown-light">📊 Markt</h4>
          
          <div>
            <label className="text-xs text-text-muted">Market Cap ($)</label>
            <div className="flex gap-2 mt-1">
              <input
                type="number"
                placeholder="Min"
                value={localFilters.marketCapMin || ""}
                onChange={e => updateFilter("marketCapMin", e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-2 py-1.5 bg-bg-elevated border border-border rounded-lg text-sm text-cream placeholder:text-text-muted"
              />
              <input
                type="number"
                placeholder="Max"
                value={localFilters.marketCapMax || ""}
                onChange={e => updateFilter("marketCapMax", e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-2 py-1.5 bg-bg-elevated border border-border rounded-lg text-sm text-cream placeholder:text-text-muted"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-text-muted">Liquidität ($)</label>
            <div className="flex gap-2 mt-1">
              <input
                type="number"
                placeholder="Min"
                value={localFilters.liquidityMin || ""}
                onChange={e => updateFilter("liquidityMin", e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-2 py-1.5 bg-bg-elevated border border-border rounded-lg text-sm text-cream placeholder:text-text-muted"
              />
              <input
                type="number"
                placeholder="Max"
                value={localFilters.liquidityMax || ""}
                onChange={e => updateFilter("liquidityMax", e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-2 py-1.5 bg-bg-elevated border border-border rounded-lg text-sm text-cream placeholder:text-text-muted"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-text-muted">Volume 24h ($)</label>
            <div className="flex gap-2 mt-1">
              <input
                type="number"
                placeholder="Min"
                value={localFilters.volume24Min || ""}
                onChange={e => updateFilter("volume24Min", e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-2 py-1.5 bg-bg-elevated border border-border rounded-lg text-sm text-cream placeholder:text-text-muted"
              />
              <input
                type="number"
                placeholder="Max"
                value={localFilters.volume24Max || ""}
                onChange={e => updateFilter("volume24Max", e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-2 py-1.5 bg-bg-elevated border border-border rounded-lg text-sm text-cream placeholder:text-text-muted"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-text-muted">Holders</label>
            <div className="flex gap-2 mt-1">
              <input
                type="number"
                placeholder="Min"
                value={localFilters.holdersMin || ""}
                onChange={e => updateFilter("holdersMin", e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-2 py-1.5 bg-bg-elevated border border-border rounded-lg text-sm text-cream placeholder:text-text-muted"
              />
              <input
                type="number"
                placeholder="Max"
                value={localFilters.holdersMax || ""}
                onChange={e => updateFilter("holdersMax", e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-2 py-1.5 bg-bg-elevated border border-border rounded-lg text-sm text-cream placeholder:text-text-muted"
              />
            </div>
          </div>
        </div>

        {/* Trading Filters */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-brown-light">📈 Trading</h4>
          
          <div>
            <label className="text-xs text-text-muted">Käufe 24h</label>
            <div className="flex gap-2 mt-1">
              <input
                type="number"
                placeholder="Min"
                value={localFilters.buyCount24Min || ""}
                onChange={e => updateFilter("buyCount24Min", e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-2 py-1.5 bg-bg-elevated border border-border rounded-lg text-sm text-cream placeholder:text-text-muted"
              />
              <input
                type="number"
                placeholder="Max"
                value={localFilters.buyCount24Max || ""}
                onChange={e => updateFilter("buyCount24Max", e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-2 py-1.5 bg-bg-elevated border border-border rounded-lg text-sm text-cream placeholder:text-text-muted"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-text-muted">Verkäufe 24h</label>
            <div className="flex gap-2 mt-1">
              <input
                type="number"
                placeholder="Min"
                value={localFilters.sellCount24Min || ""}
                onChange={e => updateFilter("sellCount24Min", e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-2 py-1.5 bg-bg-elevated border border-border rounded-lg text-sm text-cream placeholder:text-text-muted"
              />
              <input
                type="number"
                placeholder="Max"
                value={localFilters.sellCount24Max || ""}
                onChange={e => updateFilter("sellCount24Max", e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-2 py-1.5 bg-bg-elevated border border-border rounded-lg text-sm text-cream placeholder:text-text-muted"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-text-muted">Transaktionen 24h</label>
            <div className="flex gap-2 mt-1">
              <input
                type="number"
                placeholder="Min"
                value={localFilters.txnCount24Min || ""}
                onChange={e => updateFilter("txnCount24Min", e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-2 py-1.5 bg-bg-elevated border border-border rounded-lg text-sm text-cream placeholder:text-text-muted"
              />
              <input
                type="number"
                placeholder="Max"
                value={localFilters.txnCount24Max || ""}
                onChange={e => updateFilter("txnCount24Max", e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-2 py-1.5 bg-bg-elevated border border-border rounded-lg text-sm text-cream placeholder:text-text-muted"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-text-muted">Preisänderung 24h (%)</label>
            <div className="flex gap-2 mt-1">
              <input
                type="number"
                placeholder="Min %"
                value={localFilters.change24Min || ""}
                onChange={e => updateFilter("change24Min", e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-2 py-1.5 bg-bg-elevated border border-border rounded-lg text-sm text-cream placeholder:text-text-muted"
              />
              <input
                type="number"
                placeholder="Max %"
                value={localFilters.change24Max || ""}
                onChange={e => updateFilter("change24Max", e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-2 py-1.5 bg-bg-elevated border border-border rounded-lg text-sm text-cream placeholder:text-text-muted"
              />
            </div>
          </div>
        </div>

        {/* Bonding Filters */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-brown-light">🎯 Bonding Curve</h4>
          
          <div>
            <label className="text-xs text-text-muted">Graduation Progress (%)</label>
            <div className="flex gap-2 mt-1">
              <input
                type="number"
                placeholder="Min %"
                min="0"
                max="100"
                value={localFilters.graduationPercentMin || ""}
                onChange={e => updateFilter("graduationPercentMin", e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-2 py-1.5 bg-bg-elevated border border-border rounded-lg text-sm text-cream placeholder:text-text-muted"
              />
              <input
                type="number"
                placeholder="Max %"
                min="0"
                max="100"
                value={localFilters.graduationPercentMax || ""}
                onChange={e => updateFilter("graduationPercentMax", e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-2 py-1.5 bg-bg-elevated border border-border rounded-lg text-sm text-cream placeholder:text-text-muted"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.freezable === false}
                onChange={e => updateFilter("freezable", e.target.checked ? false : undefined)}
                className="w-4 h-4 accent-brown-primary"
              />
              <span className="text-sm text-text-secondary">Nur nicht-freezable</span>
            </label>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.includeScams === true}
                onChange={e => updateFilter("includeScams", e.target.checked ? true : undefined)}
                className="w-4 h-4 accent-brown-primary"
              />
              <span className="text-sm text-text-secondary">Scams einschließen</span>
            </label>
          </div>
        </div>

        {/* Security/Anti-Rug Filters */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-red">🛡️ Anti-Rug</h4>
          
          <div>
            <label className="text-xs text-text-muted">Max Sniper %</label>
            <input
              type="number"
              placeholder="z.B. 10"
              min="0"
              max="100"
              value={localFilters.sniperHeldPercentageMax || ""}
              onChange={e => updateFilter("sniperHeldPercentageMax", e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full px-2 py-1.5 mt-1 bg-bg-elevated border border-border rounded-lg text-sm text-cream placeholder:text-text-muted"
            />
          </div>

          <div>
            <label className="text-xs text-text-muted">Max Bundler %</label>
            <input
              type="number"
              placeholder="z.B. 15"
              min="0"
              max="100"
              value={localFilters.bundlerHeldPercentageMax || ""}
              onChange={e => updateFilter("bundlerHeldPercentageMax", e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full px-2 py-1.5 mt-1 bg-bg-elevated border border-border rounded-lg text-sm text-cream placeholder:text-text-muted"
            />
          </div>

          <div>
            <label className="text-xs text-text-muted">Max Dev %</label>
            <input
              type="number"
              placeholder="z.B. 5"
              min="0"
              max="100"
              value={localFilters.devHeldPercentageMax || ""}
              onChange={e => updateFilter("devHeldPercentageMax", e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full px-2 py-1.5 mt-1 bg-bg-elevated border border-border rounded-lg text-sm text-cream placeholder:text-text-muted"
            />
          </div>

          <div>
            <label className="text-xs text-text-muted">Max Insider %</label>
            <input
              type="number"
              placeholder="z.B. 20"
              min="0"
              max="100"
              value={localFilters.insiderHeldPercentageMax || ""}
              onChange={e => updateFilter("insiderHeldPercentageMax", e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full px-2 py-1.5 mt-1 bg-bg-elevated border border-border rounded-lg text-sm text-cream placeholder:text-text-muted"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
        <button
          onClick={resetFilters}
          className="px-4 py-2 text-sm text-text-secondary hover:text-cream transition-colors"
        >
          Zurücksetzen
        </button>
        <button
          onClick={applyFilters}
          className="px-6 py-2 bg-brown-primary hover:bg-brown-light text-bg-dark font-medium rounded-xl transition-all"
        >
          Filter anwenden
        </button>
      </div>
    </div>
  );
}
