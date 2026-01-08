import { NextResponse } from "next/server";
import { getKOLInfo, getAllKOLAddresses } from "@/data/known-kols";

// CACHE - Store results for 3 minutes
let cachedData: { wallets: any[]; timestamp: string } | null = null;
let cacheTime = 0;
const CACHE_DURATION = 3 * 60 * 1000; // 3 minutes

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
const MORALIS_BASE = "https://solana-gateway.moralis.io";

// Moralis Swap Response Type (flexible to handle different structures)
interface MoralisSwap {
  transactionHash?: string;
  blockTimestamp?: string;
  walletAddress?: string;
  transactionType?: "buy" | "sell";
  // Token info can be in different formats
  tokenIn?: {
    symbol?: string;
    amount?: string;
    amountUsd?: string | null;
  };
  tokenOut?: {
    symbol?: string;
    amount?: string;
    amountUsd?: string | null;
  };
  // Alternative field names
  baseToken?: { symbol?: string; amount?: string; usdAmount?: string };
  quoteToken?: { symbol?: string; amount?: string; usdAmount?: string };
  bought?: { symbol?: string; amount?: string; usdValue?: string };
  sold?: { symbol?: string; amount?: string; usdValue?: string };
  // Direct fields
  usdValue?: string | number;
  solAmount?: string | number;
  [key: string]: any; // Allow any other fields
}

interface MoralisSwapsResponse {
  result: MoralisSwap[];
  cursor?: string;
}

// Fetch SOL price
async function getSolPrice(): Promise<number> {
  try {
    const res = await fetch("https://api.dexscreener.com/latest/dex/tokens/So11111111111111111111111111111111111111112");
    const data = await res.json();
    return parseFloat(data.pairs?.[0]?.priceUsd || "140");
  } catch {
    return 140;
  }
}

// Fetch swaps for a wallet from Moralis
async function getWalletSwaps(address: string): Promise<MoralisSwap[]> {
  if (!MORALIS_API_KEY) {
    console.error("[Smart Wallets] MORALIS_API_KEY not configured!");
    return [];
  }

  try {
    const allSwaps: MoralisSwap[] = [];
    let cursor: string | undefined = undefined;
    let pageCount = 0;
    const maxPages = 100; // Up to 10,000 swaps for very active traders
    
    // Get swaps from last 24h
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    while (pageCount < maxPages) {
      const url = new URL(`${MORALIS_BASE}/account/mainnet/${address}/swaps`);
      url.searchParams.set("limit", "100"); // Max per page
      url.searchParams.set("order", "DESC");
      url.searchParams.set("transactionTypes", "buy,sell");
      if (cursor) {
        url.searchParams.set("cursor", cursor);
      }

      const response = await fetch(url.toString(), {
        headers: {
          "X-API-Key": MORALIS_API_KEY,
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Smart Wallets] Moralis error for ${address.slice(0, 8)}: ${response.status} - ${errorText.slice(0, 100)}`);
        break;
      }

      const data: MoralisSwapsResponse = await response.json();
      
      if (!data.result || data.result.length === 0) break;
      
      // Filter swaps from last 24h
      const recentSwaps = data.result.filter(swap => {
        if (!swap.blockTimestamp) return true; // Keep swaps without timestamp
        const swapTime = new Date(swap.blockTimestamp).getTime();
        return swapTime > Date.now() - 24 * 60 * 60 * 1000;
      });
      
      allSwaps.push(...recentSwaps);
      
      // If we got swaps older than 24h, stop paginating
      if (recentSwaps.length < data.result.length) break;
      
      cursor = data.cursor;
      if (!cursor) break;
      
      pageCount++;
    }

    console.log(`[Smart Wallets] ${address.slice(0, 8)}: Fetched ${allSwaps.length} swaps from ${pageCount + 1} pages`);
    return allSwaps;
  } catch (error) {
    console.error(`[Smart Wallets] Error fetching swaps for ${address}:`, error);
    return [];
  }
}

// Calculate stats from swaps
function calculateStats(swaps: MoralisSwap[], solPrice: number) {
  let totalVolumeUSD = 0;
  let buyVolumeUSD = 0;
  let sellVolumeUSD = 0;
  const uniqueTokens = new Set<string>();
  let lastTradeTime = 0;

  for (const swap of swaps) {
    // Cast to any for flexible field access
    const s = swap as any;
    
    // Use totalValueUsd directly from Moralis (most accurate!)
    const swapValueUSD = parseFloat(s.totalValueUsd || "0") || 0;
    
    totalVolumeUSD += swapValueUSD;
    
    if (s.transactionType === "buy") {
      buyVolumeUSD += swapValueUSD;
    } else {
      sellVolumeUSD += swapValueUSD;
    }
    
    // Track unique tokens from bought/sold fields
    const bought = s.bought || {};
    const sold = s.sold || {};
    
    // Add non-SOL tokens to unique set
    if (bought.symbol && bought.symbol !== "SOL" && bought.symbol !== "WSOL") {
      uniqueTokens.add(bought.symbol);
    }
    if (sold.symbol && sold.symbol !== "SOL" && sold.symbol !== "WSOL") {
      uniqueTokens.add(sold.symbol);
    }
    
    if (s.blockTimestamp) {
      const swapTime = new Date(s.blockTimestamp).getTime();
      if (swapTime > lastTradeTime) {
        lastTradeTime = swapTime;
      }
    }
  }

  const totalTrades = swaps.length;
  const buys = swaps.filter(s => s.transactionType === "buy").length;
  const sells = swaps.filter(s => s.transactionType === "sell").length;

  // Convert USD to SOL for display
  const volumeSOL = totalVolumeUSD / solPrice;

  return {
    totalTrades,
    buys,
    sells,
    volumeSOL,
    volume: totalVolumeUSD,
    buyVolume: buyVolumeUSD,
    sellVolume: sellVolumeUSD,
    uniqueTokens: uniqueTokens.size,
    avgTradeSize: totalTrades > 0 ? totalVolumeUSD / totalTrades : 0,
    lastActivity: Math.floor(lastTradeTime / 1000), // Convert to seconds for frontend
  };
}

export async function GET() {
  try {
    // Return cached data if fresh
    if (cachedData && Date.now() - cacheTime < CACHE_DURATION) {
      console.log("[Smart Wallets] Returning cached data");
      return NextResponse.json({
        success: true,
        ...cachedData,
        source: "cache",
      });
    }

    if (!MORALIS_API_KEY) {
      return NextResponse.json(
        { success: false, error: "MORALIS_API_KEY not configured" },
        { status: 500 }
      );
    }

    console.log("[Smart Wallets] Fetching fresh data from Moralis...");

    // Get SOL price first
    const solPrice = await getSolPrice();
    console.log(`[Smart Wallets] SOL price: $${solPrice.toFixed(2)}`);

    const kolAddresses = getAllKOLAddresses();
    const allWallets: any[] = [];

    // Process wallets sequentially to avoid rate limits
    for (const address of kolAddresses) {
      const kolInfo = getKOLInfo(address);
      
      console.log(`[Smart Wallets] Fetching swaps for ${kolInfo?.name || address.slice(0, 8)}...`);
      
      const swaps = await getWalletSwaps(address);
      const stats = calculateStats(swaps, solPrice);

      console.log(`[Smart Wallets] ${kolInfo?.name}: ${stats.totalTrades} trades, $${(stats.volume / 1000).toFixed(1)}k (${stats.volumeSOL.toFixed(1)} SOL)`);

      if (stats.totalTrades > 0) {
        allWallets.push({
          address,
          name: kolInfo?.name || "Unknown",
          twitter: kolInfo?.twitter,
          image: kolInfo?.image,
          ...stats,
        });
      }

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Sort by volume (highest first)
    const wallets = allWallets
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 10);

    console.log(`[Smart Wallets] Found ${wallets.length} active KOLs`);
    if (wallets.length > 0) {
      console.log(`[Smart Wallets] Top 3: ${wallets.slice(0, 3).map(w => `${w.name}: $${(w.volume / 1000).toFixed(1)}k`).join(", ")}`);
    }

    // Cache the results
    cachedData = {
      wallets,
      timestamp: new Date().toISOString(),
    };
    cacheTime = Date.now();

    return NextResponse.json({
      success: true,
      wallets,
      source: "moralis",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Smart Wallets] Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
