"use client";

import { useState } from "react";

interface CopyButtonProps {
  text: string;
  displayText?: string;
  className?: string;
  size?: "sm" | "md";
}

export function CopyButton({ text, displayText, className = "", size = "md" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shortenAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const sizeClasses = size === "sm" 
    ? "px-1 py-0.5 text-[9px]" 
    : "px-1 py-0.5 text-[9px]";

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-0.5 rounded-md bg-bg-elevated hover:bg-border transition-colors font-mono ${sizeClasses} ${className}`}
      title={text}
    >
      {displayText !== undefined && (
        <span className="text-text-secondary">
          {displayText}
        </span>
      )}
      {displayText === undefined && size === "md" && (
        <span className="text-text-secondary">
          {shortenAddress(text)}
        </span>
      )}
      <span className={size === "sm" ? "text-[10px]" : "text-xs"}>
        {copied ? "✅" : "📋"}
      </span>
    </button>
  );
}
