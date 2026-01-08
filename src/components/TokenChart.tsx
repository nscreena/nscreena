"use client";

import { useEffect, useRef, useState } from "react";
import { 
  createChart, 
  ColorType, 
  IChartApi, 
  ISeriesApi, 
  CandlestickData, 
  Time,
  CandlestickSeries,
  HistogramSeries,
} from "lightweight-charts";

interface TokenChartProps {
  address: string;
  symbol: string;
  totalSupply?: number; // Total supply for market cap calculation
}

interface OHLCVData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Time intervals
const INTERVALS = [
  { label: "30s", value: "30s", seconds: 30 },
  { label: "1m", value: "1m", seconds: 60 },
  { label: "5m", value: "5m", seconds: 300 },
  { label: "15m", value: "15m", seconds: 900 },
  { label: "1h", value: "1h", seconds: 3600 },
  { label: "4h", value: "4h", seconds: 14400 },
  { label: "1D", value: "1d", seconds: 86400 },
] as const;

type ChartMode = "price" | "mcap";

export function TokenChart({ address, symbol, totalSupply }: TokenChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  
  const [interval, setInterval] = useState<string>("1m");
  const [chartMode, setChartMode] = useState<ChartMode>("price");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastPrice, setLastPrice] = useState<number | null>(null);
  const [lastMcap, setLastMcap] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number | null>(null);
  const [rawOhlcvData, setRawOhlcvData] = useState<OHLCVData[]>([]);

  // Fetch OHLCV data from DexScreener
  const fetchOHLCVData = async (timeInterval: string): Promise<OHLCVData[]> => {
    try {
      // DexScreener doesn't have a public OHLCV API, so we'll use Birdeye
      // For now, let's use a proxy through our API
      const response = await fetch(`/api/chart/${address}?interval=${timeInterval}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch chart data");
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (err) {
      console.error("Error fetching OHLCV:", err);
      throw err;
    }
  };

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart with custom styling
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#1a1410" },
        textColor: "#a89585",
        fontFamily: "'Space Mono', monospace",
      },
      grid: {
        vertLines: { color: "#2d231a", style: 1 },
        horzLines: { color: "#2d231a", style: 1 },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: "#c4a77d",
          width: 1,
          style: 2,
          labelBackgroundColor: "#c4a77d",
        },
        horzLine: {
          color: "#c4a77d",
          width: 1,
          style: 2,
          labelBackgroundColor: "#c4a77d",
        },
      },
      rightPriceScale: {
        borderColor: "#3d2f24",
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
      },
      timeScale: {
        borderColor: "#3d2f24",
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    // Add candlestick series (v5 API) with proper price formatting for small values
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#4ade80",
      downColor: "#ef4444",
      borderUpColor: "#4ade80",
      borderDownColor: "#ef4444",
      wickUpColor: "#4ade80",
      wickDownColor: "#ef4444",
      priceFormat: {
        type: "price",
        precision: 8,
        minMove: 0.00000001,
      },
    });

    // Add volume series (v5 API) with USD formatting
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: "#c4a77d",
      priceFormat: {
        type: "custom",
        formatter: (price: number) => {
          if (price >= 1000000) return `$${(price / 1000000).toFixed(2)}M`;
          if (price >= 1000) return `$${(price / 1000).toFixed(2)}K`;
          return `$${price.toFixed(2)}`;
        },
        minMove: 0.01,
      },
      priceScaleId: "volume",
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  // Helper function to transform data based on mode
  const transformData = (ohlcvData: OHLCVData[], mode: ChartMode) => {
    const multiplier = mode === "mcap" && totalSupply ? totalSupply : 1;
    
    const candleData: CandlestickData<Time>[] = ohlcvData.map((d) => ({
      time: d.time as Time,
      open: d.open * multiplier,
      high: d.high * multiplier,
      low: d.low * multiplier,
      close: d.close * multiplier,
    }));

    const volumeData = ohlcvData.map((d) => ({
      time: d.time as Time,
      value: d.volume,
      color: d.close >= d.open ? "rgba(74, 222, 128, 0.3)" : "rgba(239, 68, 68, 0.3)",
    }));

    return { candleData, volumeData };
  };

  // Load data when interval changes
  useEffect(() => {
    const loadData = async () => {
      if (!candleSeriesRef.current || !volumeSeriesRef.current) return;

      setIsLoading(true);
      setError(null);

      try {
        const ohlcvData = await fetchOHLCVData(interval);

        if (ohlcvData.length === 0) {
          setError("No chart data available");
          setIsLoading(false);
          return;
        }

        // Store raw data for mode switching
        setRawOhlcvData(ohlcvData);

        // Transform and display data
        const { candleData, volumeData } = transformData(ohlcvData, chartMode);
        candleSeriesRef.current.setData(candleData);
        volumeSeriesRef.current.setData(volumeData);

        // Calculate price/mcap change
        if (ohlcvData.length >= 2) {
          const latest = ohlcvData[ohlcvData.length - 1];
          const first = ohlcvData[0];
          setLastPrice(latest.close);
          if (totalSupply) {
            setLastMcap(latest.close * totalSupply);
          }
          setPriceChange(((latest.close - first.close) / first.close) * 100);
        }

        // Fit content
        chartRef.current?.timeScale().fitContent();
      } catch (err) {
        setError("Failed to load chart data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Refresh data periodically (15 seconds to match token data refresh)
    const refreshInterval = window.setInterval(loadData, 15000);
    return () => window.clearInterval(refreshInterval);
  }, [interval, address]);

  // Update chart when mode changes
  useEffect(() => {
    if (!candleSeriesRef.current || !volumeSeriesRef.current || rawOhlcvData.length === 0) return;

    const { candleData, volumeData } = transformData(rawOhlcvData, chartMode);
    candleSeriesRef.current.setData(candleData);
    volumeSeriesRef.current.setData(volumeData);
    
    // Update price format based on mode
    if (chartMode === "mcap") {
      candleSeriesRef.current.applyOptions({
        priceFormat: {
          type: "custom",
          formatter: (price: number) => {
            if (price >= 1000000) return `$${(price / 1000000).toFixed(2)}M`;
            if (price >= 1000) return `$${(price / 1000).toFixed(2)}K`;
            return `$${price.toFixed(2)}`;
          },
          minMove: 0.01,
        },
      });
    } else {
      candleSeriesRef.current.applyOptions({
        priceFormat: {
          type: "price",
          precision: 8,
          minMove: 0.00000001,
        },
      });
    }
    
    chartRef.current?.timeScale().fitContent();
  }, [chartMode, totalSupply, rawOhlcvData]);

  return (
    <div className="flex flex-col h-full">
      {/* Chart Header */}
      <div className="flex items-center justify-between p-2 border-b border-border">
        <div className="flex items-center gap-2">
          <h3 className="font-marker text-brown-primary text-sm">{symbol}/SOL</h3>
          
          {/* Price/MCap Toggle */}
          {totalSupply && (
            <div className="flex items-center bg-bg-elevated rounded overflow-hidden">
              <button
                onClick={() => setChartMode("price")}
                className={`px-2 py-0.5 text-[10px] transition-colors ${
                  chartMode === "price"
                    ? "bg-brown-primary text-bg-dark font-bold"
                    : "text-text-muted hover:text-cream"
                }`}
              >
                Price
              </button>
              <button
                onClick={() => setChartMode("mcap")}
                className={`px-2 py-0.5 text-[10px] transition-colors ${
                  chartMode === "mcap"
                    ? "bg-brown-primary text-bg-dark font-bold"
                    : "text-text-muted hover:text-cream"
                }`}
              >
                MCap
              </button>
            </div>
          )}
          
          {/* Current Value */}
          {chartMode === "price" && lastPrice !== null && (
            <span className="text-cream font-mono text-xs">
              ${lastPrice.toFixed(lastPrice < 0.01 ? 8 : 4)}
            </span>
          )}
          {chartMode === "mcap" && lastMcap !== null && (
            <span className="text-cream font-mono text-xs">
              {lastMcap >= 1000000 ? `$${(lastMcap / 1000000).toFixed(2)}M` : 
               lastMcap >= 1000 ? `$${(lastMcap / 1000).toFixed(2)}K` : 
               `$${lastMcap.toFixed(2)}`}
            </span>
          )}
          
          {priceChange !== null && (
            <span className={`text-xs font-mono ${priceChange >= 0 ? "text-green" : "text-red"}`}>
              {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}%
            </span>
          )}
          <span className="text-[9px] text-text-muted hidden sm:inline">🔄 15s</span>
        </div>
        
        {/* Interval Selector */}
        <div className="flex items-center gap-0.5">
          {INTERVALS.map((int) => (
            <button
              key={int.value}
              onClick={() => setInterval(int.value)}
              className={`px-1.5 py-0.5 text-[10px] rounded transition-colors ${
                interval === int.value
                  ? "bg-brown-primary text-bg-dark font-bold"
                  : "text-text-muted hover:text-cream hover:bg-bg-elevated"
              }`}
            >
              {int.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative flex-1">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-bg-dark/80 z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-brown-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-text-muted text-sm">Loading chart...</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-bg-dark/80 z-10">
            <div className="flex flex-col items-center gap-2 text-center px-4">
              <span className="text-3xl">📊</span>
              <span className="text-text-muted text-sm">{error}</span>
              <button
                onClick={() => setInterval(interval)}
                className="mt-2 px-3 py-1 text-xs bg-brown-primary text-bg-dark rounded hover:bg-brown-light transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        
        <div ref={chartContainerRef} className="w-full h-full" />
        
        {/* Custom Logo Watermark - replaces TradingView logo */}
        <div className="absolute bottom-2 left-2 z-20 pointer-events-none">
          <img 
            src="/logo.png" 
            alt="Niggascreena" 
            className="w-8 h-8 opacity-70"
          />
        </div>
      </div>
    </div>
  );
}
