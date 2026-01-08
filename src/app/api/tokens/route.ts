import { NextResponse } from "next/server";
import {
  getNewTokens,
  getBondingTokens,
  getGraduatedTokens,
} from "@/lib/codex";
import { getTrendingTokens } from "@/lib/dexscreener";
import { TokenFilters } from "@/types/token";

// Parse filters from query params
function parseFilters(searchParams: URLSearchParams): TokenFilters {
  const filters: TokenFilters = {};

  // Market filters
  const marketCapMin = searchParams.get("marketCapMin");
  const marketCapMax = searchParams.get("marketCapMax");
  const liquidityMin = searchParams.get("liquidityMin");
  const liquidityMax = searchParams.get("liquidityMax");
  const volume24Min = searchParams.get("volume24Min");
  const volume24Max = searchParams.get("volume24Max");
  const holdersMin = searchParams.get("holdersMin");
  const holdersMax = searchParams.get("holdersMax");

  if (marketCapMin) filters.marketCapMin = parseFloat(marketCapMin);
  if (marketCapMax) filters.marketCapMax = parseFloat(marketCapMax);
  if (liquidityMin) filters.liquidityMin = parseFloat(liquidityMin);
  if (liquidityMax) filters.liquidityMax = parseFloat(liquidityMax);
  if (volume24Min) filters.volume24Min = parseFloat(volume24Min);
  if (volume24Max) filters.volume24Max = parseFloat(volume24Max);
  if (holdersMin) filters.holdersMin = parseFloat(holdersMin);
  if (holdersMax) filters.holdersMax = parseFloat(holdersMax);

  // Trading filters
  const buyCount24Min = searchParams.get("buyCount24Min");
  const buyCount24Max = searchParams.get("buyCount24Max");
  const sellCount24Min = searchParams.get("sellCount24Min");
  const sellCount24Max = searchParams.get("sellCount24Max");
  const txnCount24Min = searchParams.get("txnCount24Min");
  const txnCount24Max = searchParams.get("txnCount24Max");
  const change24Min = searchParams.get("change24Min");
  const change24Max = searchParams.get("change24Max");

  if (buyCount24Min) filters.buyCount24Min = parseFloat(buyCount24Min);
  if (buyCount24Max) filters.buyCount24Max = parseFloat(buyCount24Max);
  if (sellCount24Min) filters.sellCount24Min = parseFloat(sellCount24Min);
  if (sellCount24Max) filters.sellCount24Max = parseFloat(sellCount24Max);
  if (txnCount24Min) filters.txnCount24Min = parseFloat(txnCount24Min);
  if (txnCount24Max) filters.txnCount24Max = parseFloat(txnCount24Max);
  if (change24Min) filters.change24Min = parseFloat(change24Min);
  if (change24Max) filters.change24Max = parseFloat(change24Max);

  // Launchpad filters
  const launchpadName = searchParams.get("launchpadName");
  const graduationPercentMin = searchParams.get("graduationPercentMin");
  const graduationPercentMax = searchParams.get("graduationPercentMax");

  if (launchpadName) filters.launchpadName = launchpadName.split(",");
  if (graduationPercentMin) filters.graduationPercentMin = parseFloat(graduationPercentMin);
  if (graduationPercentMax) filters.graduationPercentMax = parseFloat(graduationPercentMax);

  // Security/Anti-Rug filters
  const sniperCountMax = searchParams.get("sniperCountMax");
  const sniperHeldPercentageMax = searchParams.get("sniperHeldPercentageMax");
  const bundlerCountMax = searchParams.get("bundlerCountMax");
  const bundlerHeldPercentageMax = searchParams.get("bundlerHeldPercentageMax");
  const devHeldPercentageMax = searchParams.get("devHeldPercentageMax");
  const insiderHeldPercentageMax = searchParams.get("insiderHeldPercentageMax");
  const freezable = searchParams.get("freezable");
  const includeScams = searchParams.get("includeScams");

  if (sniperCountMax) filters.sniperCountMax = parseFloat(sniperCountMax);
  if (sniperHeldPercentageMax) filters.sniperHeldPercentageMax = parseFloat(sniperHeldPercentageMax);
  if (bundlerCountMax) filters.bundlerCountMax = parseFloat(bundlerCountMax);
  if (bundlerHeldPercentageMax) filters.bundlerHeldPercentageMax = parseFloat(bundlerHeldPercentageMax);
  if (devHeldPercentageMax) filters.devHeldPercentageMax = parseFloat(devHeldPercentageMax);
  if (insiderHeldPercentageMax) filters.insiderHeldPercentageMax = parseFloat(insiderHeldPercentageMax);
  if (freezable) filters.freezable = freezable === "true";
  if (includeScams) filters.includeScams = includeScams === "true";

  // Time filters
  const createdAfter = searchParams.get("createdAfter");
  const createdBefore = searchParams.get("createdBefore");

  if (createdAfter) filters.createdAfter = parseInt(createdAfter);
  if (createdBefore) filters.createdBefore = parseInt(createdBefore);

  return filters;
}

// GET /api/tokens
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as "new" | "bonding" | "migrated" | "trending" | null;
  const filters = parseFilters(searchParams);

  try {
    let tokens;

    switch (type) {
      case "new":
        tokens = await getNewTokens(20, filters);
        break;
      case "bonding":
        tokens = await getBondingTokens(20, filters);
        break;
      case "migrated":
        tokens = await getGraduatedTokens(20, filters);
        break;
      case "trending":
        tokens = await getTrendingTokens(50);
        break;
      default:
        tokens = await getNewTokens(20, filters);
    }

    return NextResponse.json({
      success: true,
      data: tokens,
      source: "codex",
      filters,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json({
      success: false,
      data: [],
      source: "error",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
