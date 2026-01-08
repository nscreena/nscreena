"use client";

import { useState, useMemo } from "react";
import { TokenColumn } from "@/components/TokenColumn";
import { useTokens } from "@/hooks/useTokens";
import { TokenFilters, DEFAULT_FILTERS } from "@/types/token";

// Default filters for each column type
const NEW_COLUMN_DEFAULTS: TokenFilters = {
  ...DEFAULT_FILTERS,
  liquidityMin: 1000,
};

// Helper to get timestamp for "max age" filter
const getMaxAgeTimestamp = (maxAgeSeconds: number) => Math.floor(Date.now() / 1000) - maxAgeSeconds;

const BONDING_COLUMN_DEFAULTS: TokenFilters = {
  ...DEFAULT_FILTERS,
  liquidityMin: 5000,
  marketCapMin: 15000,
  createdAfter: getMaxAgeTimestamp(24 * 60 * 60), // Max 1 day old
};

const MIGRATED_COLUMN_DEFAULTS: TokenFilters = {
  ...DEFAULT_FILTERS,
  liquidityMin: 1000,
};

export default function Home() {
  // Separate filters for each column
  const [newFilters, setNewFilters] = useState<TokenFilters>(NEW_COLUMN_DEFAULTS);
  const [bondingFilters, setBondingFilters] = useState<TokenFilters>(BONDING_COLUMN_DEFAULTS);
  const [migratedFilters, setMigratedFilters] = useState<TokenFilters>(MIGRATED_COLUMN_DEFAULTS);

  // Memoize filters to prevent unnecessary re-fetches
  const memoizedNewFilters = useMemo(() => newFilters, [JSON.stringify(newFilters)]);
  const memoizedBondingFilters = useMemo(() => bondingFilters, [JSON.stringify(bondingFilters)]);
  const memoizedMigratedFilters = useMemo(() => migratedFilters, [JSON.stringify(migratedFilters)]);

  const { tokens: newTokens, isLoading: loadingNew } = useTokens({ 
    type: "new", 
    pollInterval: 10000,
    filters: memoizedNewFilters,
  });
  
  const { tokens: bondingTokens, isLoading: loadingBonding } = useTokens({ 
    type: "bonding", 
    pollInterval: 10000,
    filters: memoizedBondingFilters,
  });
  
  const { tokens: migratedTokens, isLoading: loadingMigrated } = useTokens({ 
    type: "migrated", 
    pollInterval: 10000,
    filters: memoizedMigratedFilters,
  });

  return (
    <div className="h-[calc(100vh-56px-40px)] bg-bg-dark relative overflow-hidden flex flex-col">
      {/* Hero Background Image - positioned behind everything */}
      <div 
        className="absolute top-0 left-0 right-0 h-[400px] pointer-events-none z-0"
        style={{
          backgroundImage: 'url(/hero.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Gradient fade to transparent at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-dark" />
        {/* Additional darker overlay for better text readability */}
        <div className="absolute inset-0 bg-bg-dark/40" />
      </div>

      {/* Hero Section - GTA Style (Compact) */}
      <div className="relative z-10 shrink-0">
        <div className="relative w-full px-3 sm:px-6 py-2">
          <div className="text-center">
            {/* GTA-Style Main Title */}
            <h1 className="gta-text text-xl sm:text-3xl lg:text-4xl tracking-wider drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
              Ah shiet, here we go again
            </h1>
            
            {/* Graffiti subtitle - hidden on mobile */}
            <p className="hidden sm:block text-text-secondary text-xs max-w-2xl mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <span className="graffiti-tag text-brown-primary text-sm">Screening tokens</span>{" "}
              so you don&apos;t have to explain your losses to your mom.
            </p>
          </div>
        </div>
      </div>

      {/* 3-Column Layout - Full Width */}
      <div className="relative z-10 w-full px-2 sm:px-4 flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-4 h-full">
          <TokenColumn
            title="New Pairs"
            emoji="🍗"
            description="Fresh tokens ready to vamp"
            tokens={newTokens}
            type="new"
            isLoading={loadingNew}
            filters={newFilters}
            onFiltersChange={setNewFilters}
          />
          
          <TokenColumn
            title="Near Bonding"
            emoji="🍌"
            description="Shortly before niggration"
            tokens={bondingTokens}
            type="bonding"
            isLoading={loadingBonding}
            filters={bondingFilters}
            onFiltersChange={setBondingFilters}
          />
          
          <TokenColumn
            title="Just Migrated"
            emoji="/logo.png"
            description="Recently niggered"
            tokens={migratedTokens}
            type="migrated"
            isLoading={loadingMigrated}
            filters={migratedFilters}
            onFiltersChange={setMigratedFilters}
          />
        </div>
      </div>
    </div>
  );
}
