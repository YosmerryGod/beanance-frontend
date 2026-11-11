"use client";

import { useEffect, useState } from "react";
import { TokenIcon } from "@web3icons/react/dynamic";

/* Logos whose brand colour is yellow/gold. In Light mode they would blend into the
   yellow canvas, so styles/design-system-pages.css flips them to black (data-tone="yellow").
   Add more symbols here when needed. BNB is handled separately with a dark chip. */
const YELLOW_SYMBOLS = new Set(["DOGE", "1000DOGE", "BUSD", "XAUT", "PAXG", "BEAN", "BTCB", "OKB", "FTT"]);

function normalizeSymbol(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[-_/](USDT|USDC|USD|PERP)$/i, "")
    .replace(/(USDT|USDC|BUSD|USDP|FDUSD|USD|PERP)$/i, "");
}

export default function CoinLogo({ symbol, size, logo, className = "" }) {
  const normalizedSymbol = normalizeSymbol(symbol);
  const [logoFailed, setLogoFailed] = useState(false);
  const tone = YELLOW_SYMBOLS.has(normalizedSymbol) ? "yellow" : undefined;

  // Reset the remote-logo fallback when the market asset changes.
  useEffect(() => {
    setLogoFailed(false);
  }, [logo]);
  const fallback = (
    <span className="coin-logo-fallback" aria-hidden="true">
      {normalizedSymbol.slice(0, 3) || "?"}
    </span>
  );

  // Official MILION token mark for the BEAN asset.
  if (normalizedSymbol === "BEAN") {
    return (
      <span
        className={`coin-logo ${className}`}
        style={size ? { width: size, height: size } : undefined}
        role="img"
        aria-label="BEAN"
        data-symbol="BEAN"
        data-tone={tone}
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
      data-tone={tone}
    >
      {/* Prefer the logo URL supplied by MILION Market Backend. */}
      {logo && !logoFailed ? (
        <img
          src={logo}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setLogoFailed(true)}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      ) : (
      <TokenIcon
        symbol={normalizedSymbol}
        size={size || "100%"}
        variant="branded"
        fallback={fallback}
      />
      )}
    </span>
  );
}
