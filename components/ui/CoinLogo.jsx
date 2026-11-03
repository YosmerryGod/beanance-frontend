"use client";

import { TokenIcon } from "@web3icons/react/dynamic";

function normalizeSymbol(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[-_/](USDT|USDC|USD|PERP)$/i, "")
    .replace(/(USDT|USDC|BUSD|USDP|FDUSD|USD|PERP)$/i, "");
}

export default function CoinLogo({ symbol, size, className = "" }) {
  const normalizedSymbol = normalizeSymbol(symbol);
  const fallback = (
    <span className="coin-logo-fallback" aria-hidden="true">
      {normalizedSymbol.slice(0, 3) || "?"}
    </span>
  );

  // [ADDED] Use the official Beanance token mark for the BEAN asset.
  if (normalizedSymbol === "BEAN") {
    return (
      <span
        className={`coin-logo ${className}`}
        style={size ? { width: size, height: size } : undefined}
        role="img"
        aria-label="BEAN"
        data-symbol="BEAN"
      >
        <img src="/icons/bean.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </span>
    );
  }

  if (!normalizedSymbol) {
    return (
      <span
        className={`coin-logo ${className}`}
        style={size ? { width: size, height: size } : undefined}
        role="img"
        aria-label="Unknown coin"
      >
        {fallback}
      </span>
    );
  }

  return (
    <span
      className={`coin-logo ${className}`}
      style={size ? { width: size, height: size } : undefined}
      role="img"
      aria-label={normalizedSymbol}
      data-symbol={normalizedSymbol}
    >
      <TokenIcon
        symbol={normalizedSymbol}
        size={size || "100%"}
        variant="branded"
        fallback={fallback}
      />
    </span>
  );
}
