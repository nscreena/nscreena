"use client";

import { useState, useEffect } from "react";
import { TokenFilters, DEFAULT_FILTERS } from "@/types/token";

interface ColumnFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: TokenFilters;
  onFiltersChange: (filters: TokenFilters) => void;
  columnTitle: string;
  columnEmoji: string;
}

const LAUNCHPADS = [
  { value: "Pump.fun", label: "Pump.fun" },
  { value: "Bonk", label: "Bonk" },
  { value: "LaunchLab", label: "LaunchLab" },
  { value: "Moonshot", label: "Moonshot" },
  { value: "boop", label: "boop.fun" },
];

const AGE_OPTIONS = [
  { value: 5 * 60, label: "5 min" },
  { value: 15 * 60, label: "15 min" },
  { value: 30 * 60, label: "30 min" },
  { value: 60 * 60, label: "1 hour" },
  { value: 2 * 60 * 60, label: "2 hours" },
  { value: 6 * 60 * 60, label: "6 hours" },
  { value: 12 * 60 * 60, label: "12 hours" },
  { value: 24 * 60 * 60, label: "1 day" },
  { value: 3 * 24 * 60 * 60, label: "3 days" },
  { value: 7 * 24 * 60 * 60, label: "7 days" },
];

export function ColumnFilterModal({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange,
  columnTitle,
  columnEmoji,
}: ColumnFilterModalProps) {
  const [localFilters, setLocalFilters] = useState<TokenFilters>(filters);

  // Sync local filters when prop changes
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const updateFilter = <K extends keyof TokenFilters>(key: K, value: TokenFilters[K]) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const resetFilters = () => {
    setLocalFilters(DEFAULT_FILTERS);
  };

  const toggleLaunchpad = (launchpad: string) => {
    const current = localFilters.launchpadName || DEFAULT_FILTERS.launchpadName || [];
    const newList = current.includes(launchpad)
      ? current.filter(l => l !== launchpad)
      : [...current, launchpad];
    updateFilter("launchpadName", newList.length > 0 ? newList : undefined);
  };

  // Calculate createdAfter timestamp from max age in seconds
  const setMaxAge = (maxAgeSeconds: number | undefined) => {
    if (maxAgeSeconds === undefined) {
      updateFilter("createdAfter", undefined);
    } else {
      const now = Math.floor(Date.now() / 1000);
      updateFilter("createdAfter", now - maxAgeSeconds);
    }
  };

  // Get current max age from createdAfter timestamp
  // Returns the closest matching AGE_OPTION value
  const getCurrentMaxAge = (): number | undefined => {
    if (!localFilters.createdAfter) return undefined;
    const now = Math.floor(Date.now() / 1000);
    const actualAge = now - localFilters.createdAfter;
    
    // Find the closest AGE_OPTION (within 10% tolerance)
    for (const opt of AGE_OPTIONS) {
      const tolerance = opt.value * 0.1; // 10% tolerance
      if (Math.abs(actualAge - opt.value) <= tolerance) {
        return opt.value;
      }
    }
    
    // If no close match, find the nearest option
    let closest = AGE_OPTIONS[0].value;
    let minDiff = Math.abs(actualAge - closest);
    for (const opt of AGE_OPTIONS) {
      const diff = Math.abs(actualAge - opt.value);
      if (diff < minDiff) {
        minDiff = diff;
        closest = opt.value;
      }
    }
    return closest;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-bg-card border border-border rounded-2xl p-5 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-border">
          <h3 className="text-xl font-bold text-cream flex items-center gap-2">
            <span className="text-2xl">{columnEmoji}</span>
            <span>Filter: {columnTitle}</span>
          </h3>
          <button 
            onClick={onClose} 
            className="text-text-muted hover:text-cream transition-colors text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg-elevated"
          >
            ✕
          </button>
        </div>

        {/* Launchpad Selection */}
        <div className="mb-5">
          <label className="text-sm text-text-secondary mb-2 block font-medium">Launchpads</label>
          <div className="flex flex-wrap gap-2">
            {LAUNCHPADS.map(lp => (
              <button
                key={lp.value}
                onClick={() => toggleLaunchpad(lp.value)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  (localFilters.launchpadName || DEFAULT_FILTERS.launchpadName)?.includes(lp.value)
                    ? "bg-brown-primary text-bg-dark font-medium"
                    : "bg-bg-elevated text-text-secondary hover:bg-bg-card-hover"
                }`}
              >
                {lp.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Market Filters */}
          <div className="space-y-3 p-4 bg-bg-elevated rounded-xl">
            <h4 className="text-sm font-bold text-brown-light flex items-center gap-2">
              <span>📊</span> Market
            </h4>
            
            <FilterRange
              label="Market Cap ($)"
              minValue={localFilters.marketCapMin}
              maxValue={localFilters.marketCapMax}
              onMinChange={v => updateFilter("marketCapMin", v)}
              onMaxChange={v => updateFilter("marketCapMax", v)}
            />
            
            <FilterRange
              label="Volume 24h ($)"
              minValue={localFilters.volume24Min}
              maxValue={localFilters.volume24Max}
              onMinChange={v => updateFilter("volume24Min", v)}
              onMaxChange={v => updateFilter("volume24Max", v)}
            />
            
            <FilterRange
              label="Holders"
              minValue={localFilters.holdersMin}
              maxValue={localFilters.holdersMax}
              onMinChange={v => updateFilter("holdersMin", v)}
              onMaxChange={v => updateFilter("holdersMax", v)}
            />

            {/* Max Age Filter */}
            <div>
              <label className="text-xs text-text-muted mb-1 block">Max Age</label>
              <select
                value={getCurrentMaxAge() || ""}
                onChange={e => setMaxAge(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-2 py-1.5 bg-bg-card border border-border rounded-lg text-sm text-cream focus:border-brown-muted focus:outline-none"
              >
                <option value="">No limit</option>
                {AGE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Trading Filters */}
          <div className="space-y-3 p-4 bg-bg-elevated rounded-xl">
            <h4 className="text-sm font-bold text-brown-light flex items-center gap-2">
              <span>📈</span> Trading
            </h4>
            
            <FilterRange
              label="Buys 24h"
              minValue={localFilters.buyCount24Min}
              maxValue={localFilters.buyCount24Max}
              onMinChange={v => updateFilter("buyCount24Min", v)}
              onMaxChange={v => updateFilter("buyCount24Max", v)}
            />
            
            <FilterRange
              label="Sells 24h"
              minValue={localFilters.sellCount24Min}
              maxValue={localFilters.sellCount24Max}
              onMinChange={v => updateFilter("sellCount24Min", v)}
              onMaxChange={v => updateFilter("sellCount24Max", v)}
            />
            
            <FilterRange
              label="Transactions 24h"
              minValue={localFilters.txnCount24Min}
              maxValue={localFilters.txnCount24Max}
              onMinChange={v => updateFilter("txnCount24Min", v)}
              onMaxChange={v => updateFilter("txnCount24Max", v)}
            />
            
            <FilterRange
              label="Price Change 24h (%)"
              minValue={localFilters.change24Min}
              maxValue={localFilters.change24Max}
              onMinChange={v => updateFilter("change24Min", v)}
              onMaxChange={v => updateFilter("change24Max", v)}
              placeholderMin="Min %"
              placeholderMax="Max %"
            />
          </div>

          {/* Bonding Curve Filters */}
          <div className="space-y-3 p-4 bg-bg-elevated rounded-xl">
            <h4 className="text-sm font-bold text-brown-light flex items-center gap-2">
              <span>🎯</span> Bonding Curve
            </h4>
            
            <FilterRange
              label="Graduation Progress (%)"
              minValue={localFilters.graduationPercentMin}
              maxValue={localFilters.graduationPercentMax}
              onMinChange={v => updateFilter("graduationPercentMin", v)}
              onMaxChange={v => updateFilter("graduationPercentMax", v)}
              placeholderMin="Min %"
              placeholderMax="Max %"
            />

            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.freezable === false}
                  onChange={e => updateFilter("freezable", e.target.checked ? false : undefined)}
                  className="w-4 h-4 accent-brown-primary rounded"
                />
                <span className="text-sm text-text-secondary">Non-freezable only</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.includeScams === true}
                  onChange={e => updateFilter("includeScams", e.target.checked ? true : undefined)}
                  className="w-4 h-4 accent-brown-primary rounded"
                />
                <span className="text-sm text-text-secondary">Include scams</span>
              </label>
            </div>
          </div>

          {/* Anti-Rug Filters */}
          <div className="space-y-3 p-4 bg-bg-elevated rounded-xl border border-red/20">
            <h4 className="text-sm font-bold text-red flex items-center gap-2">
              <span>🛡️</span> Anti-Rug
            </h4>
            
            <FilterInput
              label="Max Sniper %"
              value={localFilters.sniperHeldPercentageMax}
              onChange={v => updateFilter("sniperHeldPercentageMax", v)}
              placeholder="e.g. 10"
            />
            
            <FilterInput
              label="Max Bundler %"
              value={localFilters.bundlerHeldPercentageMax}
              onChange={v => updateFilter("bundlerHeldPercentageMax", v)}
              placeholder="e.g. 15"
            />
            
            <FilterInput
              label="Max Dev %"
              value={localFilters.devHeldPercentageMax}
              onChange={v => updateFilter("devHeldPercentageMax", v)}
              placeholder="e.g. 5"
            />
            
            <FilterInput
              label="Max Insider %"
              value={localFilters.insiderHeldPercentageMax}
              onChange={v => updateFilter("insiderHeldPercentageMax", v)}
              placeholder="e.g. 20"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-sm text-text-secondary hover:text-cream transition-colors"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-text-secondary hover:text-cream transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={applyFilters}
            className="px-6 py-2 bg-brown-primary hover:bg-brown-light text-bg-dark font-medium rounded-xl transition-all"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper component for min/max range inputs
function FilterRange({
  label,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  placeholderMin = "Min",
  placeholderMax = "Max",
}: {
  label: string;
  minValue?: number;
  maxValue?: number;
  onMinChange: (value: number | undefined) => void;
  onMaxChange: (value: number | undefined) => void;
  placeholderMin?: string;
  placeholderMax?: string;
}) {
  return (
    <div>
      <label className="text-xs text-text-muted mb-1 block">{label}</label>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder={placeholderMin}
          value={minValue ?? ""}
          onChange={e => onMinChange(e.target.value ? parseFloat(e.target.value) : undefined)}
          className="w-full px-2 py-1.5 bg-bg-card border border-border rounded-lg text-sm text-cream placeholder:text-text-muted focus:border-brown-muted focus:outline-none"
        />
        <input
          type="number"
          placeholder={placeholderMax}
          value={maxValue ?? ""}
          onChange={e => onMaxChange(e.target.value ? parseFloat(e.target.value) : undefined)}
          className="w-full px-2 py-1.5 bg-bg-card border border-border rounded-lg text-sm text-cream placeholder:text-text-muted focus:border-brown-muted focus:outline-none"
        />
      </div>
    </div>
  );
}

// Helper component for single value inputs
function FilterInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value?: number;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs text-text-muted mb-1 block">{label}</label>
      <input
        type="number"
        placeholder={placeholder}
        min="0"
        max="100"
        value={value ?? ""}
        onChange={e => onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
        className="w-full px-2 py-1.5 bg-bg-card border border-border rounded-lg text-sm text-cream placeholder:text-text-muted focus:border-brown-muted focus:outline-none"
      />
    </div>
  );
}
