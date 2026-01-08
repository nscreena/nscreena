import { Token } from "@/types/token";

const DEXSCREENER_API = "https://api.dexscreener.com";

// Helper to safely parse numbers
function safeNumber(value: string | number | undefined | null): number {
  if (value === undefined || value === null) return 0;
  const num = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(num) ? 0 : num;
}

// Format age from timestamp
function formatAge(timestamp: number | undefined | null): string {
  if (!timestamp) return "—";
  
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
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
  return undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformDexScreenerToken(pair: any): Token {
  const baseToken = pair.baseToken;
  const txns = pair.txns?.h24 || {};
  const priceChange = pair.priceChange?.h24 || 0;
  const createdAt = pair.pairCreatedAt ? new Date(pair.pairCreatedAt) : new Date();
  
  return {
    address: baseToken?.address || "",
    name: baseToken?.name || "Unknown",
    symbol: baseToken?.symbol || "???",
    price: safeNumber(pair.priceUsd),
    priceChange24h: safeNumber(priceChange),
    marketCap: safeNumber(pair.marketCap || pair.fdv),
    volume24h: safeNumber(pair.volume?.h24),
    liquidity: safeNumber(pair.liquidity?.usd),
    holders: 0, // DexScreener doesn't provide holder count
    age: formatAge(pair.pairCreatedAt),
    createdAt,
    logo: pair.info?.imageUrl || baseToken?.logoURI,
    bondingProgress: undefined,
    isMigrated: true, // All DexScreener tokens are migrated (on DEX)
    launchpad: detectLaunchpad(baseToken?.address || ""),
    // Social links
    twitter: pair.info?.socials?.find((s: { type: string }) => s.type === "twitter")?.url,
    website: pair.info?.websites?.[0]?.url,
    telegram: pair.info?.socials?.find((s: { type: string }) => s.type === "telegram")?.url,
    // Trading stats
    buyers24h: txns.buys || 0,
    sellers24h: txns.sells || 0,
  };
}

// Get trending tokens from DexScreener (Solana only)
export async function getTrendingTokens(limit: number = 50): Promise<Token[]> {
  try {
    // Get boosted tokens (trending) on Solana
    const response = await fetch(`${DEXSCREENER_API}/token-boosts/top/v1`, {
      headers: {
        "Accept": "application/json",
      },
      next: { revalidate: 30 }, // Cache for 30 seconds
    });

    if (!response.ok) {
      console.error("DexScreener API error:", response.status);
      return [];
    }

    const data = await response.json();
    
    // Filter for Solana tokens only
    const solanaTokens = (data || [])
      .filter((item: { chainId: string }) => item.chainId === "solana")
      .slice(0, limit);

    if (solanaTokens.length === 0) {
      // Fallback: get Solana pairs sorted by volume
      return await getSolanaTopPairs(limit);
    }

    // Get detailed pair info for each token
    const tokenAddresses = solanaTokens.map((t: { tokenAddress: string }) => t.tokenAddress);
    const pairs = await getTokenPairs(tokenAddresses);
    
    return pairs;
  } catch (error) {
    console.error("Error fetching trending tokens:", error);
    return [];
  }
}

// Get pair info for multiple tokens
async function getTokenPairs(addresses: string[]): Promise<Token[]> {
  if (addresses.length === 0) return [];
  
  try {
    // DexScreener allows up to 30 addresses per request
    const chunks = [];
    for (let i = 0; i < addresses.length; i += 30) {
      chunks.push(addresses.slice(i, i + 30));
    }

    const allTokens: Token[] = [];

    for (const chunk of chunks) {
      const response = await fetch(
        `${DEXSCREENER_API}/tokens/v1/solana/${chunk.join(",")}`,
        {
          headers: { "Accept": "application/json" },
          next: { revalidate: 30 },
        }
      );

      if (!response.ok) continue;

      const pairs = await response.json();
      
      // Get the best pair for each token (highest liquidity)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tokenMap = new Map<string, any>();
      
      for (const pair of pairs || []) {
        const address = pair.baseToken?.address;
        if (!address) continue;
        
        const existing = tokenMap.get(address);
        if (!existing || (pair.liquidity?.usd || 0) > (existing.liquidity?.usd || 0)) {
          tokenMap.set(address, pair);
        }
      }

      for (const pair of tokenMap.values()) {
        allTokens.push(transformDexScreenerToken(pair));
      }
    }

    return allTokens;
  } catch (error) {
    console.error("Error fetching token pairs:", error);
    return [];
  }
}

// Fallback: Get top Solana pairs by volume
async function getSolanaTopPairs(limit: number): Promise<Token[]> {
  try {
    const response = await fetch(
      `${DEXSCREENER_API}/latest/dex/pairs/solana`,
      {
        headers: { "Accept": "application/json" },
        next: { revalidate: 30 },
      }
    );

    if (!response.ok) return [];

    const data = await response.json();
    const pairs = data.pairs || [];

    // Sort by volume and take top
    return pairs
      .sort((a: { volume?: { h24?: number } }, b: { volume?: { h24?: number } }) => 
        (b.volume?.h24 || 0) - (a.volume?.h24 || 0)
      )
      .slice(0, limit)
      .map(transformDexScreenerToken);
  } catch (error) {
    console.error("Error fetching Solana pairs:", error);
    return [];
  }
}
