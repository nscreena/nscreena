import { 
  Codex,
  TokenRankingAttribute, 
  RankingDirection 
} from "@codex-data/sdk";
import { Token, TokenFilters } from "@/types/token";

// Initialize Codex SDK
const sdk = new Codex(process.env.CODEX_API_KEY!);

// Solana network ID
const SOLANA_NETWORK = 1399811149;

// Helper to safely parse numbers
function safeNumber(value: string | number | undefined | null): number {
  if (value === undefined || value === null) return 0;
  const num = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(num) ? 0 : num;
}

// Format age from timestamp (seconds to human readable)
function formatAge(timestamp: number | undefined | null): string {
  if (!timestamp) return "—";
  
  // Codex returns unix timestamps in seconds
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60);
  const hours = Math.floor(diff / 3600);
  const days = Math.floor(diff / 86400);
  
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

// Detect launchpad from token address suffix
function detectLaunchpad(address: string): string | undefined {
  if (!address) return undefined;
  const lowerAddress = address.toLowerCase();
  if (lowerAddress.endsWith("pump")) return "Pump.fun";
  if (lowerAddress.endsWith("bonk")) return "Bonk";
  // Could add more patterns if needed
  return undefined;
}

// Transform SDK token to our Token type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformToken(data: any): Token {
  // The SDK returns data with nested token object
  const token = data.token || data;
  const launchpad = token.launchpad;
  const info = token.info;
  const socialLinks = token.socialLinks;
  const address = token.address || "";
  
  // Calculate scam score based on security metrics
  const calculateScamScore = () => {
    let score = 0;
    const sniperPct = safeNumber(data.sniperHeldPercentage);
    const devPct = safeNumber(data.devHeldPercentage);
    const bundlerPct = safeNumber(data.bundlerHeldPercentage);
    const insiderPct = safeNumber(data.insiderHeldPercentage);
    
    if (sniperPct > 30) score += 25;
    else if (sniperPct > 15) score += 15;
    
    if (devPct > 20) score += 25;
    else if (devPct > 10) score += 15;
    
    if (bundlerPct > 20) score += 20;
    else if (bundlerPct > 10) score += 10;
    
    if (insiderPct > 40) score += 20;
    
    if (token.freezable) score += 15;
    
    return Math.min(100, score);
  };
  
  // Build security info from Codex data
  // Debug: Log security data to see what we're getting
  const hasSecurityData = data.sniperCount !== undefined || 
                          data.devHeldPercentage !== undefined || 
                          data.bundlerHeldPercentage !== undefined ||
                          data.insiderHeldPercentage !== undefined;
  
  const security = hasSecurityData ? {
    sniperCount: data.sniperCount,
    sniperHeldPercentage: safeNumber(data.sniperHeldPercentage),
    bundlerCount: data.bundlerCount,
    bundlerHeldPercentage: safeNumber(data.bundlerHeldPercentage),
    devHeldPercentage: safeNumber(data.devHeldPercentage),
    insiderHeldPercentage: safeNumber(data.insiderHeldPercentage),
    freezable: token.freezable === true,
    isScam: token.isScam === true,
    scamScore: calculateScamScore(),
  } : undefined;
  
  // Debug log
  if (security) {
    console.log(`[Codex Security] ${token.symbol}:`, {
      sniper: security.sniperHeldPercentage,
      dev: security.devHeldPercentage,
      bundler: security.bundlerHeldPercentage,
      insider: security.insiderHeldPercentage,
    });
  }
  
  return {
    address,
    name: token.name || info?.name || "Unknown",
    symbol: token.symbol || info?.symbol || "???",
    price: safeNumber(data.priceUsd),
    priceChange24h: safeNumber(data.change24) * 100, // Convert to percentage
    marketCap: safeNumber(data.marketCap),
    volume24h: safeNumber(data.volume24),
    liquidity: safeNumber(data.liquidity),
    holders: data.holders || 0,
    age: formatAge(launchpad?.migratedAt || launchpad?.completedAt || token.createdAt),
    createdAt: new Date((token.createdAt || 0) * 1000),
    logo: info?.imageSmallUrl || info?.imageLargeUrl,
    bondingProgress: launchpad?.graduationPercent,
    isMigrated: launchpad?.migrated || launchpad?.completed,
    launchpad: launchpad?.name || detectLaunchpad(address),
    // Social links
    twitter: socialLinks?.twitter,
    website: socialLinks?.website,
    telegram: socialLinks?.telegram,
    // Buyer/Seller counts
    buyers24h: data.buyCount24,
    sellers24h: data.sellCount24,
    // Security data from Codex
    security,
  };
}

// Helper to build number filter (gte/lte)
function buildNumberFilter(min?: number, max?: number) {
  if (min === undefined && max === undefined) return undefined;
  const filter: { gte?: number; lte?: number } = {};
  if (min !== undefined) filter.gte = min;
  if (max !== undefined) filter.lte = max;
  return filter;
}

// Convert our TokenFilters to Codex SDK filters
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildCodexFilters(userFilters: TokenFilters, baseFilters: any = {}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filters: any = {
    network: [SOLANA_NETWORK],
    ...baseFilters,
  };

  // Launchpad name
  if (userFilters.launchpadName?.length) {
    filters.launchpadName = userFilters.launchpadName;
  }

  // Market filters
  const marketCapFilter = buildNumberFilter(userFilters.marketCapMin, userFilters.marketCapMax);
  if (marketCapFilter) filters.marketCap = marketCapFilter;

  const liquidityFilter = buildNumberFilter(userFilters.liquidityMin, userFilters.liquidityMax);
  if (liquidityFilter) filters.liquidity = liquidityFilter;

  const volume24Filter = buildNumberFilter(userFilters.volume24Min, userFilters.volume24Max);
  if (volume24Filter) filters.volume24 = volume24Filter;

  const holdersFilter = buildNumberFilter(userFilters.holdersMin, userFilters.holdersMax);
  if (holdersFilter) filters.holders = holdersFilter;

  // Trading filters
  const buyCount24Filter = buildNumberFilter(userFilters.buyCount24Min, userFilters.buyCount24Max);
  if (buyCount24Filter) filters.buyCount24 = buyCount24Filter;

  const sellCount24Filter = buildNumberFilter(userFilters.sellCount24Min, userFilters.sellCount24Max);
  if (sellCount24Filter) filters.sellCount24 = sellCount24Filter;

  const txnCount24Filter = buildNumberFilter(userFilters.txnCount24Min, userFilters.txnCount24Max);
  if (txnCount24Filter) filters.txnCount24 = txnCount24Filter;

  // Price change (convert from percentage to decimal for API)
  const change24Filter = buildNumberFilter(
    userFilters.change24Min !== undefined ? userFilters.change24Min / 100 : undefined,
    userFilters.change24Max !== undefined ? userFilters.change24Max / 100 : undefined
  );
  if (change24Filter) filters.change24 = change24Filter;

  // Graduation percent
  const graduationFilter = buildNumberFilter(userFilters.graduationPercentMin, userFilters.graduationPercentMax);
  if (graduationFilter) filters.launchpadGraduationPercent = graduationFilter;

  // Security/Anti-Rug filters (only max values make sense)
  if (userFilters.sniperCountMax !== undefined) {
    filters.sniperCount = { lte: userFilters.sniperCountMax };
  }
  if (userFilters.sniperHeldPercentageMax !== undefined) {
    filters.sniperHeldPercentage = { lte: userFilters.sniperHeldPercentageMax };
  }
  if (userFilters.bundlerCountMax !== undefined) {
    filters.bundlerCount = { lte: userFilters.bundlerCountMax };
  }
  if (userFilters.bundlerHeldPercentageMax !== undefined) {
    filters.bundlerHeldPercentage = { lte: userFilters.bundlerHeldPercentageMax };
  }
  if (userFilters.devHeldPercentageMax !== undefined) {
    filters.devHeldPercentage = { lte: userFilters.devHeldPercentageMax };
  }
  if (userFilters.insiderHeldPercentageMax !== undefined) {
    filters.insiderHeldPercentage = { lte: userFilters.insiderHeldPercentageMax };
  }

  // Boolean filters
  if (userFilters.freezable !== undefined) {
    filters.freezable = userFilters.freezable;
  }
  if (userFilters.includeScams !== undefined) {
    filters.includeScams = userFilters.includeScams;
  }

  // Time filters
  const createdAtFilter = buildNumberFilter(userFilters.createdAfter, userFilters.createdBefore);
  if (createdAtFilter) filters.createdAt = createdAtFilter;

  return filters;
}

// Get new tokens (0-60% bonding progress) with user filters
export async function getNewTokens(limit: number = 20, userFilters: TokenFilters = {}): Promise<Token[]> {
  try {
    const filters = buildCodexFilters(userFilters, {
      launchpadName: userFilters.launchpadName || ["Pump.fun", "Bonk", "LaunchLab"],
      launchpadMigrated: false,
      launchpadGraduationPercent: { lte: 60 },
      liquidity: { gte: userFilters.liquidityMin || 1000 },
    });

    const response = await sdk.queries.filterTokens({
      filters,
      rankings: [{ 
        attribute: TokenRankingAttribute.CreatedAt, 
        direction: RankingDirection.Desc 
      }],
      limit,
    });

    const tokens = response?.filterTokens?.results || [];
    return tokens.map(transformToken);
  } catch (error) {
    console.error("Error fetching new tokens:", error);
    return [];
  }
}

// Get tokens near bonding (70-99.9% progress) with user filters
export async function getBondingTokens(limit: number = 20, userFilters: TokenFilters = {}): Promise<Token[]> {
  try {
    const filters = buildCodexFilters(userFilters, {
      launchpadName: userFilters.launchpadName || ["Pump.fun", "Bonk", "LaunchLab"],
      launchpadMigrated: false,
      launchpadGraduationPercent: { gte: 70, lte: 99.9 },
      liquidity: { gte: userFilters.liquidityMin || 5000 },
      marketCap: { gte: userFilters.marketCapMin || 15000 },
    });

    const response = await sdk.queries.filterTokens({
      filters,
      rankings: [{ 
        attribute: TokenRankingAttribute.GraduationPercent, 
        direction: RankingDirection.Desc 
      }],
      limit,
    });

    const tokens = response?.filterTokens?.results || [];
    return tokens.map(transformToken);
  } catch (error) {
    console.error("Error fetching bonding tokens:", error);
    return [];
  }
}

// Get graduated/migrated tokens with user filters
export async function getGraduatedTokens(limit: number = 20, userFilters: TokenFilters = {}): Promise<Token[]> {
  try {
    const filters = buildCodexFilters(userFilters, {
      launchpadName: userFilters.launchpadName || ["Pump.fun", "Bonk", "LaunchLab"],
      launchpadMigrated: true,
      liquidity: { gte: userFilters.liquidityMin || 1000 },
    });

    const response = await sdk.queries.filterTokens({
      filters,
      rankings: [{ 
        attribute: TokenRankingAttribute.LaunchpadMigratedAt, 
        direction: RankingDirection.Desc 
      }],
      limit,
    });

    const tokens = response?.filterTokens?.results || [];
    return tokens.map(transformToken);
  } catch (error) {
    console.error("Error fetching graduated tokens:", error);
    return [];
  }
}

// Get trending tokens (sorted by volume) with user filters
export async function getTrendingTokens(limit: number = 50, userFilters: TokenFilters = {}): Promise<Token[]> {
  try {
    const filters = buildCodexFilters(userFilters, {
      launchpadName: userFilters.launchpadName || ["Pump.fun", "Bonk", "LaunchLab"],
      liquidity: { gte: userFilters.liquidityMin || 5000 },
    });

    const response = await sdk.queries.filterTokens({
      filters,
      rankings: [{ 
        attribute: TokenRankingAttribute.Volume24, 
        direction: RankingDirection.Desc 
      }],
      limit,
    });

    const tokens = response?.filterTokens?.results || [];
    return tokens.map(transformToken);
  } catch (error) {
    console.error("Error fetching trending tokens:", error);
    return [];
  }
}

// Get single token info by address using filterTokens with the tokens parameter
export async function getTokenInfo(address: string): Promise<Token | null> {
  if (!process.env.CODEX_API_KEY) {
    console.error("[Codex] CODEX_API_KEY not configured");
    return null;
  }
  
  try {
    console.log(`[Codex] Fetching token info for ${address}...`);
    
    // Use the `tokens` parameter to get a specific token by address
    const response = await sdk.queries.filterTokens({
      filters: {
        network: [SOLANA_NETWORK],
      },
      tokens: [address], // ⬅️ This is the key! Specify the token address directly
      limit: 1,
    });

    const tokens = response?.filterTokens?.results || [];
    const tokenData = tokens[0];
    
    if (!tokenData) {
      console.log(`[Codex] No token info found for ${address}`);
      return null;
    }

    console.log(`[Codex] ✅ Found token! Raw token data:`, {
      address: tokenData.token?.address,
      symbol: tokenData.token?.symbol,
      sniperHeldPercentage: tokenData.sniperHeldPercentage,
      devHeldPercentage: tokenData.devHeldPercentage,
      bundlerHeldPercentage: tokenData.bundlerHeldPercentage,
      insiderHeldPercentage: tokenData.insiderHeldPercentage,
      freezable: tokenData.token?.freezable,
    });

    const token = transformToken(tokenData);
    console.log(`[Codex] Transformed token security:`, token.security);
    
    return token;
  } catch (error) {
    console.error("[Codex] Error fetching single token info:", error);
    return null;
  }
}
