"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CandlestickSeries, HistogramSeries, createChart } from "lightweight-charts";

const TIMEFRAME_SECONDS = {
  "1m": 60,
  "5m": 300,
  "15m": 900,
  "30m": 1800,
  "1h": 3600,
  "4h": 14400,
  "1d": 86400,
};

function numericPrice(value) {
  const parsed = Number(String(value ?? "").replace(/,/g, "").replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

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

export default function MarketTradingChart({ symbol, price, timeframe }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastCandle, setLastCandle] = useState(null);
  const [candles, setCandles] = useState([]);
  const [chartError, setChartError] = useState("");
  const numeric = useMemo(() => numericPrice(price), [price]);
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
          setCandles(normalized);
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
    const background = styles.getPropertyValue("--panel-soft").trim() || "#17191e";
    const textColor = styles.getPropertyValue("--muted").trim() || "#8b909b";
    const gridColor = styles.getPropertyValue("--line").trim() || "rgba(130,140,155,.13)";
    const chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
      layout: {
        background: { type: "solid", color: background },
        textColor,
        attributionLogo: true,
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

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    return () => {
      resizeObserver.disconnect();
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

  return (
    <div className="market-trading-chart">
      <div className="market-trading-chart-readout">
        <span>O <b>{lastCandle?.open?.toLocaleString("en-US", { maximumFractionDigits: 8 }) ?? "—"}</b></span>
        <span>H <b>{lastCandle?.high?.toLocaleString("en-US", { maximumFractionDigits: 8 }) ?? "—"}</b></span>
        <span>L <b>{lastCandle?.low?.toLocaleString("en-US", { maximumFractionDigits: 8 }) ?? "—"}</b></span>
        <span>C <b>{lastCandle?.close?.toLocaleString("en-US", { maximumFractionDigits: 8 }) ?? "—"}</b></span>
      </div>
      <div className="market-trading-chart-canvas" ref={containerRef} role="img" aria-label={symbol + " interactive candlestick chart, " + timeframe} />
      {chartError && <div className="market-trading-chart-error">{chartError}</div>}
      {!chartError && !candles.length && <div className="market-trading-chart-error">Memuat data market...</div>}
      <div className="market-trading-chart-controls">
        <span>Drag chart to move · Drag price axis to scale</span>
        <div>
          <button type="button" onClick={zoomOut} aria-label="Zoom out chart">−</button>
          <button type="button" onClick={zoomIn} aria-label="Zoom in chart">+</button>
          <button type="button" onClick={resetChart} aria-label="Reset chart scale">Reset</button>
          <button type="button" onClick={toggleFullscreen} aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen chart"}>{isFullscreen ? "Exit" : "⛶"}</button>
        </div>
      </div>
    </div>
  );
}
