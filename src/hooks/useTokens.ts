"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Token, TokenFilters } from "@/types/token";

interface UseTokensOptions {
  type: "new" | "bonding" | "migrated" | "trending";
  pollInterval?: number; // in ms
  filters?: TokenFilters;
}

interface UseTokensReturn {
  tokens: Token[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  lastUpdated: Date | null;
}

// Convert filters object to URL query string
function filtersToQueryString(filters: TokenFilters): string {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        params.set(key, value.join(","));
      } else {
        params.set(key, String(value));
      }
    }
  });
  
  return params.toString();
}

export function useTokens({ type, pollInterval = 10000, filters = {} }: UseTokensOptions): UseTokensReturn {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Memoize filters to prevent unnecessary re-renders
  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);
  const stableFilters = useMemo(() => filters, [filtersKey]);
  
  // Track if initial fetch has been done
  const hasFetchedRef = useRef(false);

  const fetchTokens = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setIsLoading(true);
      
      const filterQuery = filtersToQueryString(stableFilters);
      const url = `/api/tokens?type=${type}${filterQuery ? `&${filterQuery}` : ""}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch tokens");
      }

      // Parse dates from JSON
      const parsedTokens = data.data.map((token: Token & { createdAt: string }) => ({
        ...token,
        createdAt: new Date(token.createdAt),
      }));

      setTokens(parsedTokens);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [type, stableFilters]);

  // Initial fetch
  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchTokens(true);
    }
  }, [fetchTokens]);

  // Refetch when filters change (not initial)
  useEffect(() => {
    if (hasFetchedRef.current) {
      fetchTokens(true);
    }
  }, [filtersKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Polling - silent updates without loading state
  useEffect(() => {
    if (pollInterval <= 0) return;

    const interval = setInterval(() => fetchTokens(false), pollInterval);
    return () => clearInterval(interval);
  }, [fetchTokens, pollInterval]);

  return {
    tokens,
    isLoading,
    error,
    refresh: () => fetchTokens(true),
    lastUpdated,
  };
}
