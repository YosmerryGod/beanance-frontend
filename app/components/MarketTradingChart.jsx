"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CandlestickSeries, HistogramSeries, createChart } from "lightweight-charts";
import { ChevronDown, Expand, LayoutGrid, SlidersHorizontal } from "lucide-react";

const TIMEFRAME_SECONDS = {
  "1m": 60,
  "5m": 300,
  "15m": 900,
  "30m": 1800,
  "1h": 3600,
  "2h": 7200,
  "4h": 14400,
  "1d": 86400,
};

// [ADDED] Convert the selected base asset into the backend USDT-M market symbol.
function marketSymbol(value) {
  const normalized = String(value || "").trim().toUpperCase();
  return normalized.endsWith("USDT") ? normalized : normalized + "USDT";
}

// [ADDED] Normalize the backend's millisecond candle timestamps for Lightweight Charts.
function normalizeCandle(candle) {
  const openTime = Number(candle?.openTime ?? candle?.time);
  const open = Number(candle?.open);
  const high = Number(candle?.high);
  const low = Number(candle?.low);
  const close = Number(candle?.close);
  const volume = Number(candle?.volume ?? 0);

  if (![openTime, open, high, low, close].every(Number.isFinite)) return null;

  return {
    time: Math.floor(openTime / 1000),
    open,
    high,
    low,
    close,
    volume: Number.isFinite(volume) && volume >= 0 ? volume : 0,
  };
}

// [ADDED] Convert the selected interval into the WebSocket stream name.
function klineStream(timeframe) {
  return "kline_" + timeframe;
}

// [ADDED] Use a configured public WebSocket URL when provided, otherwise use same-origin proxy.
function marketWebSocketUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_MARKET_WS_URL;
  if (configuredUrl) return configuredUrl;

  if (typeof window === "undefined") return "";

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return protocol + "//" + window.location.host + "/ws/market";
}

export default function MarketTradingChart({ symbol, timeframe, onTimeframeChange }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastCandle, setLastCandle] = useState(null);
  const [hoverCandle, setHoverCandle] = useState(null);
  const [moreTimeframesOpen, setMoreTimeframesOpen] = useState(false);
  const [chartToolsOpen, setChartToolsOpen] = useState(false);
  const [candles, setCandles] = useState([]);
  const [chartError, setChartError] = useState("");
  const normalizedSymbol = useMemo(() => marketSymbol(symbol), [symbol]);
  const interval = TIMEFRAME_SECONDS[timeframe] ? timeframe : "30m";

  // [ADDED] Load historical candles from the real market REST API and stream live updates.
  useEffect(() => {
    if (!normalizedSymbol) return undefined;

    let active = true;
    let socket = null;
    let reconnectTimer = null;
    let reconnectDelay = 1000;
    let manuallyClosed = false;

    const loadCandles = async () => {
      try {
        setChartError("");
        const response = await fetch(
          "/market-api/futures/" + encodeURIComponent(normalizedSymbol) +
          "/klines?interval=" + encodeURIComponent(interval) + "&limit=500",
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error("Market candle API returned HTTP " + response.status);
        }

        const payload = await response.json();
        if (!payload?.success || !Array.isArray(payload.data)) {
          throw new Error(payload?.message || "Invalid candle API response");
        }

        const normalized = payload.data
          .map(normalizeCandle)
          .filter(Boolean)
          .sort((a, b) => a.time - b.time);

        if (active) {
          setCandles((current) => {
            const merged = new Map(normalized.map((candle) => [candle.time, candle]));
            current.forEach((candle) => merged.set(candle.time, candle));
            return Array.from(merged.values()).sort((a, b) => a.time - b.time).slice(-1500);
          });
          if (!normalized.length) setChartError("Belum ada data candle untuk market ini.");
        }
      } catch (error) {
        if (active) {
          setCandles([]);
          setChartError(error.message || "Gagal mengambil data candle.");
        }
      }
    };

    const connectWebSocket = () => {
      if (!active || manuallyClosed) return;

      const url = marketWebSocketUrl();
      if (!url) return;

      try {
        socket = new WebSocket(url);
      } catch {
        reconnectTimer = window.setTimeout(connectWebSocket, reconnectDelay);
        reconnectDelay = Math.min(reconnectDelay * 2, 15000);
        return;
      }

      socket.onopen = () => {
        if (!active || manuallyClosed) return;
        reconnectDelay = 1000;
        socket.send(JSON.stringify({
          type: "market.detail.subscribe",
          symbol: normalizedSymbol,
          streams: [klineStream(interval)],
        }));
      };

      socket.onmessage = (event) => {
        let message;
        try {
          message = JSON.parse(event.data);
        } catch {
          return;
        }

        if (
          message.type !== "market.detail.kline" ||
          String(message.symbol || "").toUpperCase() !== normalizedSymbol ||
          message.stream !== klineStream(interval)
        ) {
          return;
        }

        const candle = normalizeCandle(message.data);
        if (!candle || !active) return;

        setCandles((current) => {
          const next = [...current];
          const existingIndex = next.findIndex((item) => item.time === candle.time);

          if (existingIndex >= 0) {
            next[existingIndex] = candle;
          } else {
            next.push(candle);
            next.sort((a, b) => a.time - b.time);
          }

          return next.slice(-1500);
        });
      };

      socket.onclose = () => {
        if (!active || manuallyClosed) return;
        reconnectTimer = window.setTimeout(connectWebSocket, reconnectDelay);
        reconnectDelay = Math.min(reconnectDelay * 2, 15000);
      };

      socket.onerror = () => {
        socket?.close();
      };
    };

    setCandles([]);
    loadCandles();
    connectWebSocket();

    return () => {
      active = false;
      manuallyClosed = true;
      if (reconnectTimer) window.clearTimeout(reconnectTimer);
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: "market.detail.unsubscribe",
          symbol: normalizedSymbol,
          streams: [klineStream(interval)],
        }));
      }
      socket?.close();
    };
  }, [normalizedSymbol, interval]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const styles = getComputedStyle(container.closest(".app-shell") || container);
    const background = styles.getPropertyValue("--bg").trim() || "#000000"; // [MODIFIED] Blend chart canvas into the page instead of a card surface.
    const textColor = styles.getPropertyValue("--muted").trim() || "#8b909b";
    const gridColor = styles.getPropertyValue("--line").trim() || "rgba(130,140,155,.13)";
    const chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
      layout: {
        background: { type: "solid", color: background },
        textColor,
        attributionLogo: false, // [MODIFIED] Remove the TradingView attribution watermark.
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        fontSize: 10,
        panes: { separatorColor: gridColor, separatorHoverColor: gridColor },
      },
      grid: {
        vertLines: { color: gridColor },
        horzLines: { color: gridColor },
      },
      crosshair: {
        mode: 0,
        vertLine: { color: "rgba(245,196,0,.65)", width: 1, style: 2, labelBackgroundColor: "#d9aa00" },
        horzLine: { color: "rgba(245,196,0,.65)", width: 1, style: 2, labelBackgroundColor: "#d9aa00" },
      },
      rightPriceScale: {
        borderColor: gridColor,
        scaleMargins: { top: 0.08, bottom: 0.22 },
        autoScale: true,
      },
      timeScale: {
        borderColor: gridColor,
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 8,
        barSpacing: 8,
        minBarSpacing: 2,
        fixLeftEdge: false,
        fixRightEdge: false,
        rightBarStaysOnScroll: true,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: false,
      },
      handleScale: {
        mouseWheel: true,
        pinch: true,
        axisPressedMouseMove: { time: true, price: true },
        axisDoubleClickReset: { time: true, price: true },
      },
      localization: {
        priceFormatter: (value) => value >= 1000
          ? value.toLocaleString("en-US", { maximumFractionDigits: 2 })
          : value.toLocaleString("en-US", { maximumFractionDigits: 8 }),
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#20bd88",
      downColor: "#ef5368",
      borderUpColor: "#20bd88",
      borderDownColor: "#ef5368",
      wickUpColor: "#20bd88",
      wickDownColor: "#ef5368",
      priceLineVisible: true,
      lastValueVisible: true,
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "",
      lastValueVisible: false,
      priceLineVisible: false,
    });
    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.84, bottom: 0 },
    });

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry && entry.contentRect.width > 0 && entry.contentRect.height > 0) {
        chart.applyOptions({
          width: Math.floor(entry.contentRect.width),
          height: Math.floor(entry.contentRect.height),
        });
      }
    });
    resizeObserver.observe(container);

    // [ADDED] Track the candle under the crosshair for the floating OHLC panel.
    const handleCrosshairMove = (param) => {
      if (!param || !param.time) {
        setHoverCandle(null);
        return;
      }
      const data = param.seriesData.get(candleSeries);
      if (!data) {
        setHoverCandle(null);
        return;
      }
      setHoverCandle({
        time: Number(param.time),
        open: Number(data.open),
        high: Number(data.high),
        low: Number(data.low),
        close: Number(data.close),
        volume: Number(data.volume || 0),
      });
    };
    chart.subscribeCrosshairMove(handleCrosshairMove);

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    return () => {
      resizeObserver.disconnect();
      chart.unsubscribeCrosshairMove(handleCrosshairMove);
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
    };
  }, []);

  // [ADDED] Update chart series without recreating the chart on every live candle.
  useEffect(() => {
    const candleSeries = candleSeriesRef.current;
    const volumeSeries = volumeSeriesRef.current;
    if (!candleSeries || !volumeSeries) return;

    candleSeries.setData(candles);
    volumeSeries.setData(candles.map((candle) => ({
      time: candle.time,
      value: candle.volume,
      color: candle.close >= candle.open ? "rgba(32,189,136,.42)" : "rgba(239,83,104,.42)",
    })));

    if (candles.length) setLastCandle(candles[candles.length - 1]);
    else setLastCandle(null);
  }, [candles]);

  const zoomIn = () => {
    const chart = chartRef.current;
    if (!chart) return;
    const scale = chart.timeScale();
    const current = scale.options().barSpacing || 8;
    scale.applyOptions({ barSpacing: Math.min(current * 1.25, 40) });
  };

  const zoomOut = () => {
    const chart = chartRef.current;
    if (!chart) return;
    const scale = chart.timeScale();
    const current = scale.options().barSpacing || 8;
    scale.applyOptions({ barSpacing: Math.max(current / 1.25, 2) });
  };

  const resetChart = () => {
    const chart = chartRef.current;
    if (!chart) return;
    chart.priceScale("right").applyOptions({ autoScale: true });
    chart.timeScale().applyOptions({ barSpacing: 8 });
    chart.timeScale().fitContent();
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current?.parentElement;
    if (!container) return;
    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen?.();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen?.();
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const displayedCandle = hoverCandle; // [MODIFIED] Show candle details only while crosshair is over a candle.
  const formatPrice = (value) => Number(value).toLocaleString("en-US", { maximumFractionDigits: 8 });
  const formatVolume = (value) => Number(value || 0).toLocaleString("en-US", { maximumFractionDigits: 2 });
  const candleChange = displayedCandle && displayedCandle.open
    ? ((displayedCandle.close - displayedCandle.open) / displayedCandle.open) * 100
    : 0;
  const candleRange = displayedCandle && displayedCandle.low
    ? ((displayedCandle.high - displayedCandle.low) / displayedCandle.low) * 100
    : 0;
  const candleTime = displayedCandle
    ? new Date(displayedCandle.time * 1000).toLocaleString("id-ID", {
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", hour12: false
      })
    : "Menunggu data";

  const visibleTimeframes = ["1m", "5m", "15m", "30m", "1h"];
  const extraTimeframes = ["2h", "4h", "1d"];
  const activeExtraTimeframe = extraTimeframes.includes(timeframe);

  return (
    <div className="market-trading-chart">
      {/* [ADDED] Binance-style timeframe toolbar with three compact chart controls. */}
      <div className="market-chart-toolbar market-chart-toolbar-inside">
        <div className="market-timeframes">
          {visibleTimeframes.map((time) => (
            <button
              type="button"
              key={time}
              className={timeframe === time ? "selected" : ""}
              onClick={() => onTimeframeChange?.(time)}
            >
              {time === "1h" ? "1j" : time}
            </button>
          ))}
          <div className="market-chart-more-wrap">
            <button
              type="button"
              className={activeExtraTimeframe ? "selected" : ""}
              onClick={() => setMoreTimeframesOpen((open) => !open)}
              aria-expanded={moreTimeframesOpen}
            >
              {activeExtraTimeframe ? (timeframe === "1h" ? "1j" : timeframe) : "Lainnya"}
              <ChevronDown size={13} />
            </button>
            {moreTimeframesOpen && (
              <div className="market-chart-dropdown">
                {extraTimeframes.map((time) => (
                  <button
                    type="button"
                    key={time}
                    className={timeframe === time ? "selected" : ""}
                    onClick={() => {
                      onTimeframeChange?.(time);
                      setMoreTimeframesOpen(false);
                    }}
                  >
                    {time === "1h" ? "1j" : time}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="market-chart-icon-actions">
          <button type="button" onClick={toggleFullscreen} aria-label="Fullscreen chart" title="Fullscreen">
            <Expand size={18} />
          </button>
          <button type="button" onClick={() => setChartToolsOpen((open) => !open)} aria-label="Chart settings" title="Chart settings">
            <SlidersHorizontal size={18} />
          </button>
          <button type="button" onClick={resetChart} aria-label="Reset chart view" title="Reset chart">
            <LayoutGrid size={18} />
          </button>
          {chartToolsOpen && (
            <div className="market-chart-tools-menu">
              <button type="button" onClick={zoomIn}>Perbesar chart</button>
              <button type="button" onClick={zoomOut}>Perkecil chart</button>
              <button type="button" onClick={resetChart}>Reset tampilan</button>
            </div>
          )}
        </div>
      </div>
      <div className="market-trading-chart-canvas" ref={containerRef} role="img" aria-label={symbol + " interactive candlestick chart, " + timeframe}>
        {/* [ADDED] Low-opacity Beanance watermark centered behind the chart data. */}
        <div className="market-chart-watermark" aria-hidden="true">
          <svg viewBox="0 0 48 48" role="presentation" focusable="false">
            <path d="M4 8.5 22 6v16H4V8.5Zm22-3 18-2.5V22H26V5.5ZM4 26h18v16L4 39.5V26Zm22 0h18v21.5L26 45V26Z" fill="currentColor"/>
          </svg>
          <span>BEANANCE</span>
        </div>
        {/* [ADDED] Floating candle information panel, updated from crosshair position. */}
        {/* [MODIFIED] Keep the compact OHLC panel hidden until a candle is selected by crosshair. */}
        {displayedCandle && (
          <div className="market-candle-info" aria-live="polite">
            <span className="market-candle-info-time">Waktu {candleTime}</span>
            <div><span>Buka</span><b>{formatPrice(displayedCandle.open)}</b></div>
            <div><span>High</span><b>{formatPrice(displayedCandle.high)}</b></div>
            <div><span>Low</span><b>{formatPrice(displayedCandle.low)}</b></div>
            <div><span>Close</span><b>{formatPrice(displayedCandle.close)}</b></div>
            <div><span>Chg</span><b className={candleChange >= 0 ? "positive" : "negative"}>{(candleChange >= 0 ? "+" : "") + candleChange.toFixed(2) + "%"}</b></div>
            <div><span>%Chg</span><b className={candleChange >= 0 ? "positive" : "negative"}>{(candleChange >= 0 ? "+" : "") + candleChange.toFixed(2) + "%"}</b></div>
            <div><span>Rentang</span><b>{candleRange.toFixed(2) + "%"}</b></div>
            <div><span>Vol</span><b>{formatVolume(displayedCandle.volume)}</b></div>
          </div>
        )}
      </div>
      {chartError && <div className="market-trading-chart-error">{chartError}</div>}
      {!chartError && !candles.length && <div className="market-trading-chart-error">Memuat data market...</div>}
    </div>
  );
}
