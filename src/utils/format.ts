export function formatNumber(num: number | string | undefined | null, isCurrency = true): string {
  // Handle edge cases
  if (num === undefined || num === null) return isCurrency ? "$0" : "0";
  
  // Convert to number if string
  const numValue = typeof num === "string" ? parseFloat(num) : num;
  
  // Handle NaN or invalid numbers
  if (isNaN(numValue)) return isCurrency ? "$0" : "0";
  if (numValue === 0) return isCurrency ? "$0" : "0";
  
  const prefix = isCurrency ? "$" : "";
  
  if (numValue >= 1_000_000_000) {
    return `${prefix}${(numValue / 1_000_000_000).toFixed(2)}B`;
  }
  if (numValue >= 1_000_000) {
    return `${prefix}${(numValue / 1_000_000).toFixed(2)}M`;
  }
  if (numValue >= 1_000) {
    return `${prefix}${(numValue / 1_000).toFixed(2)}K`;
  }
  
  return `${prefix}${numValue.toFixed(isCurrency ? 2 : 0)}`;
}

export function formatPrice(price: number | string | undefined | null): string {
  // Handle edge cases
  if (price === undefined || price === null) return "$0.00";
  
  // Convert to number if string
  const priceValue = typeof price === "string" ? parseFloat(price) : price;
  
  // Handle NaN or invalid numbers
  if (isNaN(priceValue)) return "$0.00";
  if (priceValue === 0) return "$0.00";
  
  if (priceValue < 0.00001) {
    // Show in scientific notation for very small prices
    const exp = Math.floor(Math.log10(priceValue));
    const mantissa = priceValue / Math.pow(10, exp);
    return `$${mantissa.toFixed(2)}e${exp}`;
  }
  
  if (priceValue < 0.01) {
    // Count leading zeros and format nicely
    const priceStr = priceValue.toFixed(10);
    const match = priceStr.match(/0\.(0+)(\d{4})/);
    if (match) {
      const zeros = match[1].length;
      const digits = match[2];
      return `$0.0${subscriptNumber(zeros)}${digits}`;
    }
  }
  
  if (priceValue < 1) {
    return `$${priceValue.toFixed(6)}`;
  }
  
  if (priceValue < 1000) {
    return `$${priceValue.toFixed(2)}`;
  }
  
  return `$${formatNumber(priceValue, false)}`;
}

function subscriptNumber(num: number): string {
  const subscripts = "₀₁₂₃₄₅₆₇₈₉";
  return String(num)
    .split("")
    .map((d) => subscripts[parseInt(d)])
    .join("");
}

export function formatAge(date: Date | string | undefined | null): string {
  if (!date) return "?";
  
  // Convert string to Date if needed
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  // Check if valid date
  if (isNaN(dateObj.getTime())) return "?";
  
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return `${diffSec}s`;
  if (diffMin < 60) return `${diffMin}m`;
  if (diffHour < 24) return `${diffHour}h`;
  if (diffDay < 30) return `${diffDay}d`;
  
  return `${Math.floor(diffDay / 30)}mo`;
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return "???";
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}
