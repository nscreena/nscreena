import { NextResponse } from "next/server";
import { Token, TokenHolder, Trade, SecurityInfo } from "@/types/token";
import { getTokenInfo as getCodexTokenInfo } from "@/lib/codex";

// Helper to safely parse numbers
function safeNumber(value: string | number | undefined | null): number {
  if (value === undefined || value === null) return 0;
  const num = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(num) ? 0 : num;
}

// Fetch top holders from Helius API
async function fetchTopHolders(address: string): Promise<{ holders: TokenHolder[]; top10Percentage: number }> {
  const heliusApiKey = process.env.HELIUS_API_KEY;
  
  if (!heliusApiKey) {
    console.error("HELIUS_API_KEY not configured");
    return { holders: [], top10Percentage: 0 };
  }
  
  try {
    const response = await fetch(
      `https://mainnet.helius-rpc.com/?api-key=${heliusApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "top-holders",
          method: "getTokenLargestAccounts",
          params: [address],
        }),
      }
    );
    
    if (!response.ok) {
      console.error("Helius API error:", response.status);
      return { holders: [], top10Percentage: 0 };
    }
    
    const data = await response.json();
    
    if (data.result && data.result.value) {
      const accounts = data.result.value;
      
      // Get total supply
      const supplyResponse = await fetch(
        `https://mainnet.helius-rpc.com/?api-key=${heliusApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: "supply",
            method: "getTokenSupply",
            params: [address],
          }),
        }
      );
      
      const supplyData = await supplyResponse.json();
      const totalSupply = supplyData.result?.value?.uiAmount || 0;
      
      if (totalSupply === 0) {
        return { holders: [], top10Percentage: 0 };
      }
      
      // Transform to TokenHolder format
      const holders: TokenHolder[] = accounts.slice(0, 10).map((account: any) => {
        const amount = account.uiAmount || 0;
        const percentage = (amount / totalSupply) * 100;
        
        return {
          address: account.address,
          percentage,
          amount,
        };
      });
      
      const top10Percentage = holders.reduce((sum, h) => sum + h.percentage, 0);
      
      return { holders, top10Percentage };
    }
  } catch (error) {
    console.error("Error fetching top holders:", error);
  }
  
  return { holders: [], top10Percentage: 0 };
}

// Fetch security data from Codex API (better data) with GoPlus as fallback
async function fetchSecurityInfo(address: string, codexData?: any): Promise<SecurityInfo | undefined> {
  // First try to use Codex data if provided
  if (codexData) {
    const sniperPct = codexData.sniperHeldPercentage || 0;
    const devPct = codexData.devHeldPercentage || 0;
    const bundlerPct = codexData.bundlerHeldPercentage || 0;
    const insiderPct = codexData.insiderHeldPercentage || 0;
    
    // Calculate scam score
    let scamScore = 0;
    if (sniperPct > 30) scamScore += 25;
    else if (sniperPct > 15) scamScore += 15;
    if (devPct > 20) scamScore += 25;
    else if (devPct > 10) scamScore += 15;
    if (bundlerPct > 20) scamScore += 20;
    else if (bundlerPct > 10) scamScore += 10;
    if (insiderPct > 40) scamScore += 20;
    if (codexData.freezable) scamScore += 15;
    
    return {
      sniperCount: codexData.sniperCount,
      sniperHeldPercentage: sniperPct,
      bundlerCount: codexData.bundlerCount,
      bundlerHeldPercentage: bundlerPct,
      devHeldPercentage: devPct,
      insiderHeldPercentage: insiderPct,
      freezable: codexData.freezable === true,
      isScam: codexData.isScam === true,
      scamScore: Math.min(100, scamScore),
    };
  }
  
  // Fallback to GoPlus Labs API
  try {
    const response = await fetch(
      `https://api.gopluslabs.io/api/v1/token_security/solana?contract_addresses=${address}`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    );
    
    if (!response.ok) {
      console.error("GoPlus API error:", response.status);
      return undefined;
    }
    
    const data = await response.json();
    
    if (data.result && data.result[address.toLowerCase()]) {
      const secData = data.result[address.toLowerCase()];
      
      // Calculate scam score based on various factors
      let scamScore = 0;
      
      if (secData.is_honeypot === "1") scamScore += 50;
      if (secData.is_blacklisted === "1") scamScore += 30;
      if (secData.is_open_source === "0") scamScore += 10;
      if (parseFloat(secData.holder_count || "0") < 10) scamScore += 20;
      
      const creatorPercent = parseFloat(secData.creator_percent || "0");
      const ownerPercent = parseFloat(secData.owner_percent || "0");
      
      if (creatorPercent > 50) scamScore += 20;
      if (ownerPercent > 50) scamScore += 20;
      
      return {
        sniperCount: undefined,
        sniperHeldPercentage: undefined,
        bundlerCount: undefined,
        bundlerHeldPercentage: undefined,
        devHeldPercentage: creatorPercent,
        insiderHeldPercentage: creatorPercent + ownerPercent,
        freezable: secData.is_mintable === "1",
        isScam: secData.is_honeypot === "1" || secData.is_blacklisted === "1",
        scamScore: Math.min(100, scamScore),
      };
    }
  } catch (error) {
    console.error("Error fetching security info from GoPlus:", error);
  }
  
  return undefined;
}

// Fetch recent trades from Helius API
async function fetchRecentTrades(address: string, symbol: string): Promise<Trade[]> {
  const heliusApiKey = process.env.HELIUS_API_KEY;
  
  if (!heliusApiKey) {
    console.error("HELIUS_API_KEY not configured");
    return [];
  }
  
  try {
    // Use Helius Enhanced Transactions API
    const response = await fetch(
      `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${heliusApiKey}&limit=20&type=SWAP`,
      { next: { revalidate: 10 } } // Cache for 10 seconds
    );
    
    if (!response.ok) {
      console.error("Helius transactions API error:", response.status);
      return [];
    }
    
    const transactions = await response.json();
    const trades: Trade[] = [];
    
    for (const tx of transactions) {
      if (!tx.tokenTransfers || tx.tokenTransfers.length === 0) continue;
      
      // Find transfers involving our token
      const tokenTransfer = tx.tokenTransfers.find(
        (t: any) => t.mint === address
      );
      
      if (!tokenTransfer) continue;
      
      const isBuy = tokenTransfer.toUserAccount !== tx.feePayer;
      const amount = tokenTransfer.tokenAmount || 0;
      
      // Try to get price from native transfers (SOL)
      const nativeTransfer = tx.nativeTransfers?.[0];
      const solAmount = nativeTransfer?.amount ? nativeTransfer.amount / 1e9 : 0;
      const solPrice = 200; // Approximate, should fetch real SOL price
      const totalUSD = solAmount * solPrice;
      const priceUSD = amount > 0 ? totalUSD / amount : 0;
      
      trades.push({
        type: isBuy ? "buy" : "sell",
        amount,
        priceUSD,
        totalUSD,
        totalSOL: solAmount, // Include SOL amount
        maker: tx.feePayer || "Unknown",
        timestamp: tx.timestamp || Math.floor(Date.now() / 1000),
        txHash: tx.signature || "",
      });
      
      if (trades.length >= 15) break;
    }
    
    return trades;
  } catch (error) {
    console.error("Error fetching recent trades:", error);
  }
  
  return [];
}

// Fetch holder count from Helius API
async function fetchHolderCount(address: string): Promise<number> {
  const heliusApiKey = process.env.HELIUS_API_KEY;
  
  if (!heliusApiKey) {
    console.error("HELIUS_API_KEY not configured");
    return 0;
  }
  
  // Use Helius Token Holders API
  try {
    const response = await fetch(
      `https://api.helius.xyz/v1/mintlist?api-key=${heliusApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: {
            mints: [address],
          },
          options: {
            limit: 1,
          },
        }),
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.result && data.result.length > 0 && data.result[0].holder_count) {
        return data.result[0].holder_count;
      }
    }
  } catch (error) {
    console.error("Helius mintlist error:", error);
  }
  
  // Fallback: Use getTokenAccounts with pagination info
  try {
    let totalHolders = 0;
    let cursor: string | undefined;
    let hasMore = true;
    let iterations = 0;
    const maxIterations = 10; // Limit to avoid too many requests
    
    while (hasMore && iterations < maxIterations) {
      const response = await fetch(
        `https://mainnet.helius-rpc.com/?api-key=${heliusApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: "holder-count",
            method: "getTokenAccounts",
            params: {
              mint: address,
              limit: 1000,
              cursor: cursor,
              displayOptions: {
                showZeroBalance: false,
              },
            },
          }),
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.result) {
          const accounts = data.result.token_accounts || [];
          totalHolders += accounts.length;
          
          // Check if there's more data
          cursor = data.result.cursor;
          hasMore = !!cursor && accounts.length === 1000;
        } else {
          hasMore = false;
        }
      } else {
        hasMore = false;
      }
      
      iterations++;
    }
    
    if (totalHolders > 0) {
      return totalHolders;
    }
  } catch (error) {
    console.error("Helius getTokenAccounts error:", error);
  }
  
  // Helius is our primary source for holder data
  // If Helius fails, we return 0 (displayed as "—" in the UI)
  
  return 0;
}

// Detect launchpad from token address
function detectLaunchpad(address: string): string | undefined {
  if (address.endsWith("pump")) return "Pump.fun";
  if (address.endsWith("bonk")) return "Bonk";
  return undefined;
}

// Transform DexScreener pair data to Token
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function transformDexScreenerPair(pair: any, address: string, holders: number = 0): Promise<Token> {
  const price = safeNumber(pair.priceUsd);
  const symbol = pair.baseToken?.symbol || "???";

  // Fetch real data in parallel
  const [holderData, security, trades] = await Promise.all([
    fetchTopHolders(address),
    fetchSecurityInfo(address, undefined), // Use GoPlus Labs for security
    fetchRecentTrades(address, symbol),
  ]);

  return {
    address: address,
    name: pair.baseToken?.name || "Unknown",
    symbol: symbol,
    price: price,
    priceChange24h: safeNumber(pair.priceChange?.h24),
    marketCap: safeNumber(pair.fdv),
    volume24h: safeNumber(pair.volume?.h24),
    liquidity: safeNumber(pair.liquidity?.usd),
    holders: holders,
    age: "—",
    createdAt: new Date(pair.pairCreatedAt || 0),
    logo: pair.info?.imageUrl,
    bondingProgress: undefined,
    isMigrated: true,
    twitter: pair.info?.socials?.find((s: { type: string }) => s.type === "twitter")?.url,
    website: pair.info?.websites?.[0]?.url,
    telegram: pair.info?.socials?.find((s: { type: string }) => s.type === "telegram")?.url,
    buyers24h: safeNumber(pair.txns?.h24?.buys),
    sellers24h: safeNumber(pair.txns?.h24?.sells),
    launchpad: detectLaunchpad(address),
    topHolders: holderData.holders,
    top10HoldersPercentage: holderData.top10Percentage,
    security: security,
    recentTrades: trades,
  };
}

// GET /api/tokens/[address]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;

  if (!address) {
    return NextResponse.json({
      success: false,
      error: "Address is required",
    }, { status: 400 });
  }

  try {
    console.log(`[API] Fetching token details for ${address}...`);
    
    // 1. FIRST: Try Codex API (same as homepage - has security data!)
    if (process.env.CODEX_API_KEY) {
      try {
        const codexToken = await getCodexTokenInfo(address);
        
        if (codexToken) {
          console.log("[API] ✅ Got token from Codex with security data!");
          
          // Fetch additional data that Codex doesn't provide
          const [holderData, trades] = await Promise.all([
            fetchTopHolders(address),
            fetchRecentTrades(address, codexToken.symbol),
          ]);
          
          // Merge Codex data with additional data
          const token: Token = {
            ...codexToken,
            topHolders: holderData.holders,
            top10HoldersPercentage: holderData.top10Percentage,
            recentTrades: trades,
          };
          
          return NextResponse.json({
            success: true,
            data: token,
            source: "codex",
            timestamp: new Date().toISOString(),
          });
        } else {
          console.log("[API] ⚠️ Codex returned no data, trying fallbacks...");
        }
      } catch (codexError) {
        console.error("[API] ❌ Codex API error:", codexError);
      }
    } else {
      console.log("[API] ⚠️ CODEX_API_KEY not configured, using fallbacks");
    }
    
    // 2. FALLBACK: DexScreener API
    const response = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${address}`,
      { next: { revalidate: 30 } }
    );
    
    const data = await response.json();

    if (data.pairs && data.pairs.length > 0) {
      // Get the pair with most liquidity on Solana
      const solanaPairs = data.pairs.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (p: any) => p.chainId === "solana"
      );
      
      if (solanaPairs.length > 0) {
        console.log("[API] ✅ Got token from DexScreener");
        
        // Sort by liquidity and take the best one
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bestPair = solanaPairs.sort((a: any, b: any) => 
          safeNumber(b.liquidity?.usd) - safeNumber(a.liquidity?.usd)
        )[0];
        
        // Fetch holder count
        const holders = await fetchHolderCount(address);
        
        const token = await transformDexScreenerPair(bestPair, address, holders);
        
        return NextResponse.json({
          success: true,
          data: token,
          source: "dexscreener",
          timestamp: new Date().toISOString(),
        });
      }
    }

    // 3. FALLBACK: Pump.fun API for unbonded tokens
    try {
      const pumpResponse = await fetch(
        `https://frontend-api.pump.fun/coins/${address}`
      );
      
      if (pumpResponse.ok) {
        console.log("[API] ✅ Got token from Pump.fun");
        
        const pumpData = await pumpResponse.json();
        
        // Fetch holder count
        const holders = await fetchHolderCount(address);
        const totalSupply = safeNumber(pumpData.total_supply) || 1000000000;
        const price = safeNumber(pumpData.usd_market_cap) / totalSupply || 0;
        const symbol = pumpData.symbol || "???";
        
        // Fetch real data in parallel
        const [holderData, security, trades] = await Promise.all([
          fetchTopHolders(address),
          fetchSecurityInfo(address, undefined), // Use GoPlus Labs for security
          fetchRecentTrades(address, symbol),
        ]);
        
        const token: Token = {
          address: address,
          name: pumpData.name || "Unknown",
          symbol: symbol,
          price: price,
          priceChange24h: 0,
          marketCap: safeNumber(pumpData.usd_market_cap),
          volume24h: 0,
          liquidity: safeNumber(pumpData.virtual_sol_reserves) * 200, // rough estimate
          holders: holders,
          age: "—",
          createdAt: new Date(pumpData.created_timestamp || 0),
          logo: pumpData.image_uri,
          bondingProgress: safeNumber(pumpData.bonding_curve_progress) * 100,
          isMigrated: pumpData.complete || false,
          twitter: pumpData.twitter,
          website: pumpData.website,
          telegram: pumpData.telegram,
          buyers24h: 0,
          sellers24h: 0,
          launchpad: "Pump.fun",
          topHolders: holderData.holders,
          top10HoldersPercentage: holderData.top10Percentage,
          security: security,
          recentTrades: trades,
        };
        
        return NextResponse.json({
          success: true,
          data: token,
          source: "pump.fun",
          timestamp: new Date().toISOString(),
        });
      }
    } catch (pumpError) {
      console.error("[API] Pump.fun API Error:", pumpError);
    }

    // Token not found
    console.log("[API] ❌ Token not found in any source");
    return NextResponse.json({
      success: false,
      error: "Token not found",
    }, { status: 404 });

  } catch (error) {
    console.error("[API] ❌ API Error:", error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}
