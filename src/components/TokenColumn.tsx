"use client";

import { useState } from "react";
import { Token, TokenFilters, DEFAULT_FILTERS } from "@/types/token";
import { TokenCard } from "./TokenCard";
import { ColumnFilterModal } from "./ColumnFilterModal";

interface TokenColumnProps {
  title: string;
  emoji: string;
  description: string;
  tokens: Token[];
  type: "new" | "bonding" | "migrated";
  isLoading?: boolean;
  filters: TokenFilters;
  onFiltersChange: (filters: TokenFilters) => void;
}

export function TokenColumn({
  title,
  emoji,
  description,
  tokens,
  type,
  isLoading,
  filters,
  onFiltersChange,
}: TokenColumnProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const borderColor = {
    new: "border-yellow/30",
    bonding: "border-brown-primary/30",
    migrated: "border-green/30",
  }[type];

  const headerBg = {
    new: "from-yellow/10 to-transparent",
    bonding: "from-brown-primary/10 to-transparent",
    migrated: "from-green/10 to-transparent",
  }[type];

  // Count active filters (excluding defaults)
  const activeFilterCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof TokenFilters];
    const defaultValue = DEFAULT_FILTERS[key as keyof TokenFilters];
    return value !== undefined && JSON.stringify(value) !== JSON.stringify(defaultValue);
  }).length;

  return (
    <>
      <div className={`flex flex-col h-full rounded-2xl border ${borderColor} bg-bg-main overflow-hidden torn-edge`}>
        {/* Header - Graffiti Style */}
        <div className={`px-4 py-3 bg-gradient-to-b ${headerBg} border-b border-border`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {emoji.startsWith("/") ? (
                <img src={emoji} alt="" className="w-8 h-8 rounded-lg" />
              ) : (
                <span className="text-2xl">{emoji}</span>
              )}
              <div>
                <h2 className="font-marker text-cream text-xl graffiti-tag">{title}</h2>
                <p className="text-text-muted text-xs">{description}</p>
              </div>
            </div>
            
            {/* Settings/Filter Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="relative p-2 rounded-lg hover:bg-bg-card transition-all group"
              title="Set Filters"
            >
              <svg 
                className="w-5 h-5 text-text-muted group-hover:text-brown-primary transition-colors group-hover:rotate-45 duration-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                />
              </svg>
              
              {/* Active filter indicator */}
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brown-primary text-bg-dark text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Token List - Slide-in Staggered */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 slide-in-stagger">
          {isLoading ? (
            // Skeleton Loading
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-32 rounded-xl" />
            ))
          ) : tokens.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-text-muted">
              <span className="text-3xl mb-2">🦗</span>
              <p className="text-sm font-marker">Ain&apos;t nobody here...</p>
            </div>
          ) : (
            tokens.map((token, index) => (
              <TokenCard
                key={token.address}
                token={token}
                isNew={index === 0}
                type={type}
                index={index}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-border bg-bg-card/50">
          <p className="text-xs text-text-muted text-center">
            {tokens.length} tokens • Updated live
          </p>
        </div>
      </div>

      {/* Filter Modal */}
      <ColumnFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={onFiltersChange}
        columnTitle={title}
        columnEmoji={emoji}
      />
    </>
  );
}
