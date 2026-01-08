export interface TokenHolder {
  address: string;
  percentage: number;
  amount: number;
}

export interface Trade {
  type: "buy" | "sell";
  amount: number;
  priceUSD: number;
  totalUSD: number;
  totalSOL?: number; // SOL amount for the trade
  maker: string;
  timestamp: number;
  txHash: string;
}

export interface SecurityInfo {
  sniperCount?: number;
  sniperHeldPercentage?: number;
  bundlerCount?: number;
  bundlerHeldPercentage?: number;
  devHeldPercentage?: number;
  insiderHeldPercentage?: number;
  freezable?: boolean;
  isScam?: boolean;
  scamScore?: number; // 0-100, higher = more suspicious
}

export interface Token {
  address: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  liquidity: number;
  holders: number;
  age: string; // "2m", "1h", "3d" etc.
  createdAt: Date;
  logo?: string;
  bondingProgress?: number; // 0-100 for pump.fun tokens
  isMigrated?: boolean;
  launchpad?: string; // "Pump.fun", "Bonk", "LaunchLab", etc.
  // Trading stats
  buyers24h?: number;
  sellers24h?: number;
  // Social links
  twitter?: string;
  website?: string;
  telegram?: string;
  // Holder info
  topHolders?: TokenHolder[];
  top10HoldersPercentage?: number; // Total % held by top 10
  // Security
  security?: SecurityInfo;
  // Recent trades
  recentTrades?: Trade[];
}

export interface TokenColumn {
  title: string;
  emoji: string;
  description: string;
  tokens: Token[];
  type: "new" | "bonding" | "migrated";
}

export type SortField = "price" | "marketCap" | "volume24h" | "liquidity" | "holders" | "age" | "priceChange24h";
export type SortDirection = "asc" | "desc";

// User-adjustable filters for token queries
export interface TokenFilters {
  // Market filters
  marketCapMin?: number;
  marketCapMax?: number;
  liquidityMin?: number;
  liquidityMax?: number;
  volume24Min?: number;
  volume24Max?: number;
  holdersMin?: number;
  holdersMax?: number;
  
  // Trading filters
  buyCount24Min?: number;
  buyCount24Max?: number;
  sellCount24Min?: number;
  sellCount24Max?: number;
  txnCount24Min?: number;
  txnCount24Max?: number;
  change24Min?: number; // Price change % (e.g., -50 to 500)
  change24Max?: number;
  
  // Launchpad filters
  launchpadName?: string[]; // ["Pump.fun", "Bonk", "LaunchLab"]
  graduationPercentMin?: number;
  graduationPercentMax?: number;
  
  // Security/Anti-Rug filters
  sniperCountMax?: number;
  sniperHeldPercentageMax?: number;
  bundlerCountMax?: number;
  bundlerHeldPercentageMax?: number;
  devHeldPercentageMax?: number;
  insiderHeldPercentageMax?: number;
  freezable?: boolean;
  includeScams?: boolean;
  
  // Time filters
  createdAfter?: number; // Unix timestamp
  createdBefore?: number;
}

// Default filter values
export const DEFAULT_FILTERS: TokenFilters = {
  liquidityMin: 1000,
  launchpadName: ["Pump.fun", "Bonk", "LaunchLab"],
  includeScams: false,
};
