import { Token } from "@/types/token";

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
const BASE_URL = "https://solana-gateway.moralis.io";

// Helper to safely parse numbers from API (could be string or number)
function safeParseNumber(value: string | number | undefined | null): number {
  if (value === undefined || value === null) return 0;
  const num = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(num) ? 0 : num;
}

// Moralis Response Types
interface MoralisNewToken {
  tokenAddress: string;
  name: string;
  symbol: string;
  logo?: string | null;
  decimals: string | number;
  priceUsd?: string | null;
  priceNative?: string | null;
  liquidity?: string | number | null;
  fullyDilutedValuation?: string | number | null;
  createdAt?: string;
  pairAddress?: string;
  pairCreatedAt?: string;
  exchange?: string;
}

interface MoralisBondingToken {
  tokenAddress: string;
  name: string;
  symbol: string;
  logo?: string | null;
  decimals: string | number;
  priceUsd?: string | null;
  priceNative?: string | null;
  liquidity?: string | number | null;
  bondingCurveProgress?: string | number | null;
  fullyDilutedValuation?: string | number | null;
  marketCap?: string | number | null;
  createdAt?: string;
  exchange?: string;
}

interface MoralisGraduatedToken {
  tokenAddress: string;
  name: string;
  symbol: string;
  logo?: string | null;
  decimals: string | number;
  priceUsd?: string | null;
  priceNative?: string | null;
  liquidity?: string | number | null;
  fullyDilutedValuation?: string | number | null;
  graduatedAt?: string;
  createdAt?: string;
  pairAddress?: string;
  exchange?: string;
}

// Generic fetch with auth
async function moralisFetch<T>(endpoint: string): Promise<T> {
  if (!MORALIS_API_KEY) {
    throw new Error("MORALIS_API_KEY is not set");
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "X-API-Key": MORALIS_API_KEY,
      "Accept": "application/json",
    },
    next: { revalidate: 10 },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Moralis API error: ${response.status} - ${errorText}`);
    throw new Error(`Moralis API error: ${response.status}`);
  }

  return response.json();
}

// Token metadata response
interface TokenMetadata {
  metaplex?: {
    metadataUri?: string;
  };
}

// IPFS metadata response (from pump.fun tokens)
interface IPFSMetadata {
  twitter?: string;
  website?: string;
  telegram?: string;
}

// Cache for social links
const socialsCache = new Map<string, { twitter?: string; website?: string; telegram?: string }>();

// Fetch socials for a token from IPFS metadata
async function fetchTokenSocials(tokenAddress: string): Promise<{ twitter?: string; website?: string; telegram?: string }> {
  // Check cache first
  if (socialsCache.has(tokenAddress)) {
    return socialsCache.get(tokenAddress)!;
  }

  try {
    // Get token metadata from Moralis
    const metadata = await moralisFetch<TokenMetadata>(
      `/token/mainnet/${tokenAddress}/metadata`
    );

    if (!metadata?.metaplex?.metadataUri) {
      return {};
    }

    // Extract IPFS hash and fetch metadata
    const metadataUri = metadata.metaplex.metadataUri;
    let ipfsUrl = metadataUri;
    
    // Convert to ipfs.io gateway if needed
    if (metadataUri.includes("cf-ipfs.com")) {
      ipfsUrl = metadataUri.replace("cf-ipfs.com", "ipfs.io");
    }

    const ipfsResponse = await fetch(ipfsUrl, { 
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (!ipfsResponse.ok) {
      return {};
    }

    const ipfsData: IPFSMetadata = await ipfsResponse.json();
    
    const socials = {
      twitter: ipfsData.twitter || undefined,
      website: ipfsData.website || undefined,
      telegram: ipfsData.telegram || undefined,
    };

    // Cache the result
    socialsCache.set(tokenAddress, socials);
    
    return socials;
  } catch (error) {
    // Silently fail - socials are optional
    return {};
  }
}

// Token Analytics API response
interface TokenAnalyticsResponse {
  tokenAddress: string;
  totalBuyVolume: { "5m": number; "1h": number; "6h": number; "24h": number };
  totalSellVolume: { "5m": number; "1h": number; "6h": number; "24h": number };
  totalBuyers: { "5m": number; "1h": number; "6h": number; "24h": number };
  totalSellers: { "5m": number; "1h": number; "6h": number; "24h": number };
  totalBuys: { "5m": number; "1h": number; "6h": number; "24h": number }; // Number of buy trades
  totalSells: { "5m": number; "1h": number; "6h": number; "24h": number }; // Number of sell trades
  uniqueWallets: { "5m": number; "1h": number; "6h": number; "24h": number };
  pricePercentChange: { "5m": number; "1h": number; "6h": number; "24h": number };
}

// Pairs API response (more reliable for volume)
interface PairsResponse {
  pairs: Array<{
    volume24hrUsd?: number;
    usdPrice24hrPercentChange?: number;
    inactivePair?: boolean;
  }>;
}

// Fetch volume from pairs endpoint (more reliable for all tokens)
async function fetchVolumeFromPairs(tokenAddress: string): Promise<{ volume24h: number; priceChange24h: number }> {
  try {
    const data = await moralisFetch<PairsResponse>(`/token/mainnet/${tokenAddress}/pairs`);
    
    let totalVolume = 0;
    let priceChange = 0;
    
    for (const pair of data.pairs || []) {
      // Include ALL pairs (active and inactive) for total volume
      if (pair.volume24hrUsd) {
        totalVolume += pair.volume24hrUsd;
      }
      // Use active pair's price change
      if (priceChange === 0 && !pair.inactivePair && pair.usdPrice24hrPercentChange) {
        priceChange = pair.usdPrice24hrPercentChange;
      }
    }
    
    return { volume24h: totalVolume, priceChange24h: priceChange };
  } catch (error) {
    return { volume24h: 0, priceChange24h: 0 };
  }
}

// DexScreener API response
interface DexScreenerResponse {
  pairs: Array<{
    txns: {
      h24: { buys: number; sells: number };
    };
  }>;
}

// Fetch buy/sell trade counts from DexScreener API (more accurate, sums all DEXs)
async function fetchBuyerSellerStats(tokenAddress: string): Promise<{
  buyers24h: number;
  sellers24h: number;
}> {
  try {
    const response = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`,
      {
        next: { revalidate: 30 },
      }
    );

    if (!response.ok) {
      return { buyers24h: 0, sellers24h: 0 };
    }

    const data: DexScreenerResponse = await response.json();
    
    // Sum buys/sells from ALL pairs (PumpSwap, PumpFun, Raydium, etc.)
    let totalBuys = 0;
    let totalSells = 0;
    
    for (const pair of data.pairs || []) {
      totalBuys += pair.txns?.h24?.buys || 0;
      totalSells += pair.txns?.h24?.sells || 0;
    }
    
    return {
      buyers24h: totalBuys,
      sellers24h: totalSells,
    };
  } catch (error) {
    console.error(`Error fetching DexScreener stats for ${tokenAddress}:`, error);
    return { buyers24h: 0, sellers24h: 0 };
  }
}

// Batch fetch socials, volume, and buyer/seller stats for multiple tokens
async function enrichTokensWithSocials(tokens: Token[], limit: number = 10): Promise<Token[]> {
  const tokensToEnrich = tokens.slice(0, limit);
  
  const enrichedPromises = tokensToEnrich.map(async (token) => {
    // Fetch socials, volume (from pairs), and buyer/seller (from analytics) in parallel
    const [socials, volumeStats, buyerSellerStats] = await Promise.all([
      fetchTokenSocials(token.address),
      fetchVolumeFromPairs(token.address),
      fetchBuyerSellerStats(token.address),
    ]);
    
    return { 
      ...token, 
      ...socials,
      volume24h: volumeStats.volume24h,
      priceChange24h: volumeStats.priceChange24h || token.priceChange24h,
      buyers24h: buyerSellerStats.buyers24h,
      sellers24h: buyerSellerStats.sellers24h,
      // Use buyers + sellers as holder activity indicator
      holders: buyerSellerStats.buyers24h + buyerSellerStats.sellers24h,
    };
  });

  const enrichedTokens = await Promise.all(enrichedPromises);
  
  // Return enriched tokens + remaining tokens without extra data
  return [...enrichedTokens, ...tokens.slice(limit)];
}

// Cache for token creation dates (from /new endpoint)
const tokenCreationCache = new Map<string, string>();

// Fetch new tokens to get creation dates
async function fetchNewTokensForDates(): Promise<void> {
  try {
    const data = await moralisFetch<{ result: MoralisNewToken[] }>(
      "/token/mainnet/exchange/pumpfun/new?limit=100"
    );
    for (const token of data.result || []) {
      if (token.createdAt) {
        tokenCreationCache.set(token.tokenAddress, token.createdAt);
      }
    }
  } catch (error) {
    console.error("Error fetching new tokens for dates:", error);
  }
}

// Strategy: Get all bonding tokens and split them into categories
async function getAllBondingTokens(): Promise<MoralisBondingToken[]> {
  try {
    // Fetch new tokens in parallel to get creation dates
    const [bondingData] = await Promise.all([
      moralisFetch<{ result: MoralisBondingToken[] }>(
        "/token/mainnet/exchange/pumpfun/bonding?limit=100"
      ),
      fetchNewTokensForDates(),
    ]);
    
    // Enrich bonding tokens with createdAt from cache
    const enrichedTokens = (bondingData.result || []).map(token => ({
      ...token,
      createdAt: token.createdAt || tokenCreationCache.get(token.tokenAddress),
    }));
    
    return enrichedTokens;
  } catch (error) {
    console.error("Error fetching bonding tokens:", error);
    return [];
  }
}

// Get NEW PAIRS - the absolute newest tokens with liquidity
// Sorted by creation date (newest first)
export async function getNewPumpFunTokens(): Promise<Token[]> {
  try {
    // Fetch from /new endpoint - has createdAt and sorted by newest
    const data = await moralisFetch<{ result: MoralisNewToken[] }>(
      "/token/mainnet/exchange/pumpfun/new?limit=100"
    );
    
    // Filter for tokens that have liquidity (active trading)
    const validTokens = (data.result || []).filter(token => {
      const liquidity = safeParseNumber(token.liquidity);
      return liquidity > 1000; // Must have at least $1K liquidity
    });

    // Already sorted by newest from API, just transform
    const tokens = validTokens
      .slice(0, 20)
      .map(transformNewTokenToToken);

    // Enrich first 10 tokens with social links
    const enrichedTokens = await enrichTokensWithSocials(tokens, 10);

    console.log(`Fetched ${enrichedTokens.length} newest tokens (with socials)`);
    return enrichedTokens;
  } catch (error) {
    console.error("Error fetching new pump.fun tokens:", error);
    return [];
  }
}

// Transform new token to our Token type
function transformNewTokenToToken(token: MoralisNewToken): Token {
  const liquidity = safeParseNumber(token.liquidity);
  const marketCap = safeParseNumber(token.fullyDilutedValuation);
  const price = safeParseNumber(token.priceUsd);
  
  return {
    address: token.tokenAddress,
    name: token.name || "Unknown",
    symbol: token.symbol || "???",
    logo: token.logo || undefined,
    price,
    priceChange24h: 0,
    marketCap,
    volume24h: 0,
    liquidity,
    holders: 0,
    age: "",
    createdAt: token.createdAt ? new Date(token.createdAt) : new Date(),
    bondingProgress: Math.min((liquidity / 69000) * 100, 99), // Estimate progress from liquidity
    isMigrated: false,
  };
}

// Get NEAR BONDING - tokens approaching graduation (high progress + valid MCap)
// Real Pump.fun tokens at 90%+ progress should have $30K+ MCap
export async function getBondingPumpFunTokens(): Promise<Token[]> {
  try {
    const allBonding = await getAllBondingTokens();
    
    // Max age: 3 days (only applied if we know the age)
    const maxAgeMs = 3 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    
    // Filter for REAL pump.fun tokens near graduation:
    // - High liquidity ($15K+) 
    // - Market cap that matches progress (at 90%+ should be $25K+)
    // - Exclude tokens at 99.95%+ (those are basically migrating)
    // - If age is known, must be < 3 days old
    const validTokens = allBonding.filter(token => {
      const liquidity = safeParseNumber(token.liquidity);
      const marketCap = safeParseNumber(token.fullyDilutedValuation);
      const progress = safeParseNumber(token.bondingCurveProgress);
      
      // Check age if available
      let isRecentEnough = true;
      if (token.createdAt) {
        const createdAt = new Date(token.createdAt).getTime();
        const age = now - createdAt;
        isRecentEnough = age > 0 && age < maxAgeMs;
      }
      
      // Real pump.fun tokens at high progress should have proportional MCap
      const minExpectedMCap = progress >= 90 ? 25000 : 10000;
      
      return liquidity > 15000 && marketCap > minExpectedMCap && progress < 99.95 && isRecentEnough;
    });

    // Sort by highest progress first
    const tokens = validTokens
      .sort((a, b) => safeParseNumber(b.bondingCurveProgress) - safeParseNumber(a.bondingCurveProgress))
      .slice(0, 20)
      .map(transformBondingTokenToToken);

    // Enrich first 10 tokens with social links
    const enrichedTokens = await enrichTokensWithSocials(tokens, 10);

    console.log(`Fetched ${enrichedTokens.length} near-bonding tokens (with socials)`);
    return enrichedTokens;
  } catch (error) {
    console.error("Error fetching bonding pump.fun tokens:", error);
    return [];
  }
}

// Get GRADUATED tokens (just migrated to Raydium)
export async function getGraduatedPumpFunTokens(): Promise<Token[]> {
  try {
    const data = await moralisFetch<{ result: MoralisGraduatedToken[] }>(
      "/token/mainnet/exchange/pumpfun/graduated?limit=20"
    );

    const tokens = (data.result || [])
      .filter(token => {
        const liquidity = safeParseNumber(token.liquidity);
        return liquidity > 1000;
      })
      .map(transformGraduatedTokenToToken);

    // Enrich first 10 tokens with social links
    const enrichedTokens = await enrichTokensWithSocials(tokens, 10);

    console.log(`Fetched ${enrichedTokens.length} graduated tokens (with socials)`);
    return enrichedTokens;
  } catch (error) {
    console.error("Error fetching graduated pump.fun tokens:", error);
    return [];
  }
}

// Get trending tokens (all with good liquidity)
export async function getTrendingTokens(): Promise<Token[]> {
  try {
    const [bondingData, graduatedData] = await Promise.all([
      moralisFetch<{ result: MoralisBondingToken[] }>(
        "/token/mainnet/exchange/pumpfun/bonding?limit=50"
      ),
      moralisFetch<{ result: MoralisGraduatedToken[] }>(
        "/token/mainnet/exchange/pumpfun/graduated?limit=50"
      ),
    ]);

    const bondingTokens = (bondingData.result || [])
      .filter(t => safeParseNumber(t.liquidity) > 5000)
      .map(transformBondingTokenToToken);

    const graduatedTokens = (graduatedData.result || [])
      .filter(t => safeParseNumber(t.liquidity) > 5000)
      .map(transformGraduatedTokenToToken);

    const allTokens = [...bondingTokens, ...graduatedTokens];
    return allTokens.sort((a, b) => b.liquidity - a.liquidity);
  } catch (error) {
    console.error("Error fetching trending tokens:", error);
    return [];
  }
}

// Transform bonding token to our Token format
function transformBondingTokenToToken(token: MoralisBondingToken): Token {
  const createdAt = token.createdAt ? new Date(token.createdAt) : new Date();
  const bondingProgress = safeParseNumber(token.bondingCurveProgress);

  return {
    address: token.tokenAddress || "",
    name: token.name || "Unknown",
    symbol: token.symbol || "???",
    price: safeParseNumber(token.priceUsd),
    priceChange24h: 0,
    marketCap: safeParseNumber(token.fullyDilutedValuation),
    volume24h: 0,
    liquidity: safeParseNumber(token.liquidity),
    holders: 0,
    age: "",
    createdAt,
    logo: token.logo || undefined,
    bondingProgress: Math.round(bondingProgress * 100) / 100, // Round to 2 decimals for accuracy
    isMigrated: false,
  };
}

// Transform graduated token to our Token format
function transformGraduatedTokenToToken(token: MoralisGraduatedToken): Token {
  const createdAt = token.graduatedAt 
    ? new Date(token.graduatedAt) 
    : token.createdAt 
      ? new Date(token.createdAt) 
      : new Date();

  return {
    address: token.tokenAddress || "",
    name: token.name || "Unknown",
    symbol: token.symbol || "???",
    price: safeParseNumber(token.priceUsd),
    priceChange24h: 0,
    marketCap: safeParseNumber(token.fullyDilutedValuation),
    volume24h: 0,
    liquidity: safeParseNumber(token.liquidity),
    holders: 0,
    age: "",
    createdAt,
    logo: token.logo || undefined,
    bondingProgress: 100,
    isMigrated: true,
  };
}
