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
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function createDemoCandles(symbol, price, timeframe) {
  const interval = TIMEFRAME_SECONDS[timeframe] || 1800;
  const seed = Array.from(symbol).reduce((total, character) => total + character.charCodeAt(0), 0);
  const now = Math.floor(Date.now() / 1000 / interval) * interval;
  const candles = [];
  let previousClose = price * (0.965 + (seed % 35) / 1000);

  for (let index = 119; index >= 0; index -= 1) {
    const wave = Math.sin((index + seed) * 0.47) * 0.004;
    const drift = Math.cos((index + seed) * 0.13) * 0.002;
    const open = previousClose;
    const close = Math.max(price * 0.7, open * (1 + wave + drift));
    const wick = Math.max(price * 0.0007, close * (0.0015 + (index % 5) * 0.00035));
    candles.push({
      time: now - index * interval,
      open,
      high: Math.max(open, close) + wick,
      low: Math.max(0.00000001, Math.min(open, close) - wick),
      close,
    });
    previousClose = close;
  }

  const last = candles[candles.length - 1];
  const adjustment = price / last.close;
  return candles.map((candle) => ({
    ...candle,
    open: candle.open * adjustment,
    high: candle.high * adjustment,
    low: candle.low * adjustment,
    close: candle.close * adjustment,
  }));
}

export default function MarketTradingChart({ symbol, price, timeframe }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastCandle, setLastCandle] = useState(null);
  const numeric = useMemo(() => numericPrice(price), [price]);
  const candles = useMemo(
    () => createDemoCandles(symbol, numeric, timeframe),
    [symbol, numeric, timeframe]
  );

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

    candleSeries.setData(candles);
    volumeSeries.setData(candles.map((candle, index) => ({
      time: candle.time,
      value: 80 + ((index * 37 + symbol.length * 19) % 180),
      color: candle.close >= candle.open ? "rgba(32,189,136,.42)" : "rgba(239,83,104,.42)",
    })));
    chart.timeScale().fitContent();
    setLastCandle(candles[candles.length - 1]);

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

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
    };
  }, [candles, symbol]);

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
