import { NextResponse } from "next/server";

interface OHLCVData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Map interval to GeckoTerminal timeframe
const INTERVAL_MAP: Record<string, { seconds: number; geckoTimeframe: string; aggregate: number }> = {
  "30s": { seconds: 30, geckoTimeframe: "minute", aggregate: 1 }, // Smallest available, will show 1m data
  "1m": { seconds: 60, geckoTimeframe: "minute", aggregate: 1 },
  "5m": { seconds: 300, geckoTimeframe: "minute", aggregate: 5 },
  "15m": { seconds: 900, geckoTimeframe: "minute", aggregate: 15 },
  "1h": { seconds: 3600, geckoTimeframe: "hour", aggregate: 1 },
  "4h": { seconds: 14400, geckoTimeframe: "hour", aggregate: 4 },
  "1d": { seconds: 86400, geckoTimeframe: "day", aggregate: 1 },
};

// Fetch pool address from DexScreener first
async function getPoolAddress(tokenAddress: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    // Find the best Solana pool (highest liquidity)
    const solanaPairs = data.pairs?.filter(
      (p: { chainId: string }) => p.chainId === "solana"
    );
    
    if (!solanaPairs || solanaPairs.length === 0) return null;
    
    // Sort by liquidity and return the best pool
    const bestPair = solanaPairs.sort(
      (a: { liquidity?: { usd?: number } }, b: { liquidity?: { usd?: number } }) => 
        (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0)
    )[0];
    
    return bestPair.pairAddress || null;
  } catch (error) {
    console.error("DexScreener pool fetch error:", error);
    return null;
  }
}

// Fetch from GeckoTerminal API (free, no auth required)
async function fetchGeckoTerminalOHLCV(
  poolAddress: string,
  interval: string
): Promise<OHLCVData[]> {
  const intervalConfig = INTERVAL_MAP[interval] || INTERVAL_MAP["15m"];
  
  try {
    // GeckoTerminal API for Solana pools
    const url = `https://api.geckoterminal.com/api/v2/networks/solana/pools/${poolAddress}/ohlcv/${intervalConfig.geckoTimeframe}?aggregate=${intervalConfig.aggregate}&limit=300`;
    
    console.log("Fetching GeckoTerminal OHLCV:", url);
    
    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
      },
    });
    
    if (!response.ok) {
      console.error(`GeckoTerminal API error: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    
    if (!data.data?.attributes?.ohlcv_list) {
      console.error("No OHLCV data in response:", data);
      return [];
    }
    
    // GeckoTerminal returns [timestamp_unix_seconds, open, high, low, close, volume]
    // Timestamps are already in seconds
    const ohlcvList = data.data.attributes.ohlcv_list;
    console.log("First candle raw:", ohlcvList[0]);
    
    return ohlcvList.map((item: number[]) => ({
      time: item[0], // Already in seconds
      open: item[1],
      high: item[2],
      low: item[3],
      close: item[4],
      volume: item[5],
    })).reverse(); // GeckoTerminal returns newest first, we need oldest first
  } catch (error) {
    console.error("GeckoTerminal OHLCV error:", error);
    return [];
  }
}

// Fallback: Generate mock data based on current price
async function fetchDexScreenerPrice(address: string): Promise<number | null> {
  try {
    const response = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${address}`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const solanaPair = data.pairs?.find(
      (p: { chainId: string }) => p.chainId === "solana"
    );
    
    return solanaPair ? parseFloat(solanaPair.priceUsd) : null;
  } catch {
    return null;
  }
}

// Generate synthetic OHLCV data when no historical data is available
function generateSyntheticData(
  currentPrice: number,
  interval: string,
  count: number = 100
): OHLCVData[] {
  const intervalConfig = INTERVAL_MAP[interval] || INTERVAL_MAP["15m"];
  const now = Math.floor(Date.now() / 1000);
  const data: OHLCVData[] = [];
  
  let price = currentPrice * 0.8; // Start 20% lower
  const volatility = 0.02; // 2% volatility per candle
  
  for (let i = 0; i < count; i++) {
    const time = now - (count - i) * intervalConfig.seconds;
    
    // Random walk with slight upward bias
    const change = (Math.random() - 0.48) * volatility * price;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    const volume = Math.random() * 100000 * currentPrice;
    
    data.push({
      time,
      open,
      high,
      low,
      close,
      volume,
    });
    
    price = close;
  }
  
  // Adjust last candle to match current price
  if (data.length > 0) {
    const last = data[data.length - 1];
    last.close = currentPrice;
    last.high = Math.max(last.high, currentPrice);
    last.low = Math.min(last.low, currentPrice);
  }
  
  return data;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;
  const { searchParams } = new URL(request.url);
  const interval = searchParams.get("interval") || "15m";

  if (!address) {
    return NextResponse.json(
      { success: false, error: "Address is required" },
      { status: 400 }
    );
  }

  try {
    let ohlcvData: OHLCVData[] = [];
    let source = "none";
    
    // First, get the pool address from DexScreener
    const poolAddress = await getPoolAddress(address);
    
    if (poolAddress) {
      // Fetch OHLCV from GeckoTerminal
      ohlcvData = await fetchGeckoTerminalOHLCV(poolAddress, interval);
      if (ohlcvData.length > 0) {
        source = "geckoterminal";
      }
    }
    
    // If no data, try to generate synthetic data
    if (ohlcvData.length === 0) {
      const currentPrice = await fetchDexScreenerPrice(address);
      
      if (currentPrice) {
        ohlcvData = generateSyntheticData(currentPrice, interval);
        source = "synthetic";
      }
    }

    return NextResponse.json({
      success: true,
      data: ohlcvData,
      source,
      interval,
      poolAddress,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chart API Error:", error);

    return NextResponse.json(
      {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
