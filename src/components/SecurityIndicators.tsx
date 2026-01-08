"use client";

import { SecurityInfo } from "@/types/token";

interface SecurityIndicatorsProps {
  security: SecurityInfo;
}

export function SecurityIndicators({ security }: SecurityIndicatorsProps) {
  // Calculate overall risk score (0-100, higher = more dangerous)
  const calculateRiskScore = () => {
    let risk = security.scamScore || 0;
    
    if (security.sniperHeldPercentage && security.sniperHeldPercentage > 30) risk += 20;
    else if (security.sniperHeldPercentage && security.sniperHeldPercentage > 15) risk += 10;
    
    if (security.devHeldPercentage && security.devHeldPercentage > 20) risk += 20;
    else if (security.devHeldPercentage && security.devHeldPercentage > 10) risk += 10;
    
    if (security.bundlerHeldPercentage && security.bundlerHeldPercentage > 20) risk += 15;
    
    if (security.freezable) risk += 25;
    if (security.isScam) risk = 100;
    
    return Math.min(100, risk);
  };

  const riskScore = calculateRiskScore();
  
  const getRiskLevel = (score: number): { level: string; color: string; emoji: string } => {
    if (score >= 80) return { level: "Extreme Risk", color: "neon-red", emoji: "🚨" };
    if (score >= 60) return { level: "High Risk", color: "text-red", emoji: "⚠️" };
    if (score >= 40) return { level: "Medium Risk", color: "text-orange", emoji: "⚡" };
    if (score >= 20) return { level: "Low Risk", color: "text-yellow", emoji: "✋" };
    return { level: "Safe", color: "text-green", emoji: "✅" };
  };

  const risk = getRiskLevel(riskScore);

  const getRiskColor = (value: number | undefined, threshold1: number, threshold2: number) => {
    if (!value) return "text-green";
    if (value > threshold2) return "neon-red";
    if (value > threshold1) return "text-orange";
    return "text-yellow";
  };

  return (
    <div className="bg-bg-card rounded-2xl p-4 border border-border">
      <h3 className="font-marker text-brown-primary mb-4">Security Analysis</h3>

      {/* Overall Risk Score */}
      <div className="bg-bg-elevated rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{risk.emoji}</span>
            <div>
              <p className="text-xs text-text-muted">Risk Level</p>
              <p className={`font-bold font-marker ${risk.color}`}>{risk.level}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-3xl font-bold font-[family-name:var(--font-space-mono)] ${risk.color}`}>
              {riskScore}
            </p>
            <p className="text-xs text-text-muted">/ 100</p>
          </div>
        </div>
        
        {/* Risk bar */}
        <div className="h-2 bg-bg-card rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              riskScore >= 80 ? "bg-red-500" :
              riskScore >= 60 ? "bg-orange-500" :
              riskScore >= 40 ? "bg-yellow-500" :
              riskScore >= 20 ? "bg-yellow-300" :
              "bg-green-500"
            }`}
            style={{ width: `${riskScore}%` }}
          />
        </div>
      </div>

      {/* Security Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Sniper Wallets */}
        <div className="bg-bg-elevated rounded-lg p-3">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-xs">🎯</span>
            <p className="text-text-muted text-xs">Snipers</p>
          </div>
          <p className={`font-bold font-[family-name:var(--font-space-mono)] ${getRiskColor(security.sniperHeldPercentage, 15, 30)}`}>
            {security.sniperCount || 0} ({security.sniperHeldPercentage?.toFixed(1) || "0"}%)
          </p>
        </div>

        {/* Dev Held */}
        <div className="bg-bg-elevated rounded-lg p-3">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-xs">👨‍💻</span>
            <p className="text-text-muted text-xs">Dev Held</p>
          </div>
          <p className={`font-bold font-[family-name:var(--font-space-mono)] ${getRiskColor(security.devHeldPercentage, 10, 20)}`}>
            {security.devHeldPercentage?.toFixed(1) || "0"}%
          </p>
        </div>

        {/* Bundler Wallets */}
        <div className="bg-bg-elevated rounded-lg p-3">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-xs">📦</span>
            <p className="text-text-muted text-xs">Bundlers</p>
          </div>
          <p className={`font-bold font-[family-name:var(--font-space-mono)] ${getRiskColor(security.bundlerHeldPercentage, 10, 20)}`}>
            {security.bundlerCount || 0} ({security.bundlerHeldPercentage?.toFixed(1) || "0"}%)
          </p>
        </div>

        {/* Insider Held */}
        <div className="bg-bg-elevated rounded-lg p-3">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-xs">🤝</span>
            <p className="text-text-muted text-xs">Insider</p>
          </div>
          <p className={`font-bold font-[family-name:var(--font-space-mono)] ${getRiskColor(security.insiderHeldPercentage, 20, 40)}`}>
            {security.insiderHeldPercentage?.toFixed(1) || "0"}%
          </p>
        </div>
      </div>

      {/* Warning Flags */}
      {(security.freezable || security.isScam) && (
        <div className="mt-3 space-y-2">
          {security.freezable && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-2">
              <span className="text-xl">❄️</span>
              <p className="text-xs text-red-400">Token can be frozen by authority</p>
            </div>
          )}
          {security.isScam && (
            <div className="flex items-center gap-2 bg-red-500/20 border border-red-500 rounded-lg p-2">
              <span className="text-xl">💀</span>
              <p className="text-xs text-red-400 font-bold">SCAM DETECTED</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

