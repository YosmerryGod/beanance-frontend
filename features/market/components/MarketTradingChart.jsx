"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CandlestickSeries, HistogramSeries, LineSeries, createChart } from "lightweight-charts";
import { ChevronDown, Expand, LayoutGrid, SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { translationKeys } from "../../../i18n/config";
import "./MarketIndicatorLegend.css";

const TIMEFRAME_SECONDS = {
  "1m": 60,
  "5m": 300,
  "15m": 900,
  "30m": 1800,
  "1h": 3600,
  "2h": 7200,
  "4h": 14400,
  "1d": 86400,
  "1w": 604800,
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


export default function MarketTradingChart({ symbol, timeframe, onTimeframeChange }) {
  const { t: translate, i18n: translator } = useTranslation();
  const locale = translator.resolvedLanguage || translator.language || "en";
  const t = useCallback((value) => translate(translationKeys[value] || value, { defaultValue: value }), [translate]);
  const [activeTheme, setActiveTheme] = useState("dark");

  useEffect(() => {
    const syncTheme = () => setActiveTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const indicatorSeriesRef = useRef(null); // [ADDED] Native overlay series references.
  const indicatorCandleTimeRef = useRef(null); // [ADDED] Refresh overlays only when a new candle starts.
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastCandle, setLastCandle] = useState(null);
  const [hoverCandle, setHoverCandle] = useState(null);
  const [moreTimeframesOpen, setMoreTimeframesOpen] = useState(false);
  const [chartToolsOpen, setChartToolsOpen] = useState(false);
  const [candles, setCandles] = useState([]);
  const [indicatorData, setIndicatorData] = useState(null); // [ADDED] Backend-calculated overlay values.
  const [enabledIndicators, setEnabledIndicators] = useState({ ma: true, ema: true, bollinger: false, sar: true, supertrend: true }); // [ADDED] Chart overlay visibility.
  const [chartError, setChartError] = useState("");
  const normalizedSymbol = useMemo(() => marketSymbol(symbol), [symbol]);
  const interval = TIMEFRAME_SECONDS[timeframe] ? timeframe : "1m"; // [MODIFIED] Keep chart requests on supported timeframes.

  // [MODIFIED] Load historical candles over REST and consume the app-wide market WebSocket.
  useEffect(() => {
    if (!normalizedSymbol) return undefined;

    let active = true;
    const controller = new AbortController();

    const loadCandles = async () => {
      try {
        setChartError("");
        const response = await fetch(
          "/market-api/futures/" + encodeURIComponent(normalizedSymbol) +
          "/indicators?interval=" + encodeURIComponent(interval) + "&limit=500&includeFunding=false",
          { cache: "no-store", signal: controller.signal }
        );
        if (!response.ok) throw new Error("Market indicators API returned HTTP " + response.status);
        const payload = await response.json();
        if (!payload?.success || !Array.isArray(payload.candles) || !payload.indicators) {
          throw new Error(payload?.message || "Invalid market indicators response");
        }
        const normalized = payload.candles
          .map(normalizeCandle)
          .filter(Boolean)
          .sort((a, b) => a.time - b.time);
        if (!active) return;
        setCandles(normalized.slice(-1500));
        indicatorCandleTimeRef.current = normalized.length ? normalized[normalized.length - 1].time : null;
        setIndicatorData(payload.indicators);
        if (!normalized.length) setChartError(t("No candle data is available for this market."));
      } catch (error) {
        if (active && error.name !== "AbortError") {
          setCandles([]);
          setIndicatorData(null);
          setChartError(error.message || t("Failed to load candle data."));
        }
      }
    };

    const handleMarketKline = (event) => {
      const message = event.detail;
      if (
        message?.type !== "market.detail.kline" ||
        String(message.symbol || "").toUpperCase() !== normalizedSymbol ||
        message.stream !== klineStream(interval)
      ) return;

      const candle = normalizeCandle(message.data);
      if (!candle || !active) return;
      const previousCandleTime = indicatorCandleTimeRef.current;
      if (previousCandleTime === null || candle.time > previousCandleTime) {
        indicatorCandleTimeRef.current = candle.time;
      }
      if (previousCandleTime !== null && candle.time > previousCandleTime) {
        // [ADDED] Recalculate overlays once at each new candle, not on every live kline update.
        fetch(
          "/market-api/futures/" + encodeURIComponent(normalizedSymbol) +
          "/indicators?interval=" + encodeURIComponent(interval) + "&limit=500&includeFunding=false",
          { cache: "no-store", signal: controller.signal }
        )
          .then((response) => {
            if (!response.ok) throw new Error("Indicator refresh failed");
            return response.json();
          })
          .then((payload) => {
            if (!active || !payload?.success || !Array.isArray(payload.candles) || !payload.indicators) return;
            const refreshedCandles = payload.candles.map(normalizeCandle).filter(Boolean).sort((a, b) => a.time - b.time);
            setCandles(refreshedCandles);
            setIndicatorData(payload.indicators);
            indicatorCandleTimeRef.current = refreshedCandles.length ? refreshedCandles[refreshedCandles.length - 1].time : candle.time;
          })
          .catch((error) => {
            if (active && error.name !== "AbortError") console.warn("Beanance indicator refresh:", error.message);
          });
      }
      setCandles((current) => {
        const next = [...current];
        const existingIndex = next.findIndex((item) => item.time === candle.time);
        if (existingIndex >= 0) next[existingIndex] = candle;
        else next.push(candle);
        return next.sort((a, b) => a.time - b.time).slice(-1500);
      });
    };

    setCandles([]);
    setIndicatorData(null);
    indicatorCandleTimeRef.current = null;
    window.addEventListener("beanance:market-kline", handleMarketKline);
    loadCandles();

    return () => {
      active = false;
      controller.abort();
      window.removeEventListener("beanance:market-kline", handleMarketKline);
    };
  }, [normalizedSymbol, interval, t]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const styles = getComputedStyle(container.closest(".app-shell") || container);
    const background = styles.getPropertyValue("--bg").trim() || "#090909";
    const textColor = styles.getPropertyValue("--text-muted").trim() || "#a8a18e";
    const gridColor = styles.getPropertyValue("--border").trim() || "rgba(255,216,77,.13)";
    const accentColor = styles.getPropertyValue("--accent").trim() || "#f5c400";
    const positiveColor = styles.getPropertyValue("--positive").trim() || "#35cf86";
    const negativeColor = styles.getPropertyValue("--negative").trim() || "#ef5368";
    const chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
      layout: {
        background: { type: "solid", color: background },
        textColor,
        attributionLogo: false, // [MODIFIED] Remove the TradingView attribution watermark.
        fontFamily: getComputedStyle(document.body).fontFamily,
        fontSize: 10,
        panes: { separatorColor: gridColor, separatorHoverColor: gridColor },
      },
      grid: {
        vertLines: { color: gridColor },
        horzLines: { color: gridColor },
      },
      crosshair: {
        mode: 0,
        vertLine: { color: accentColor, width: 1, style: 2, labelBackgroundColor: accentColor },
        horzLine: { color: accentColor, width: 1, style: 2, labelBackgroundColor: accentColor },
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
          ? value.toLocaleString(locale, { maximumFractionDigits: 2 })
          : value.toLocaleString(locale, { maximumFractionDigits: 8 }),
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: positiveColor,
      downColor: negativeColor,
      borderUpColor: positiveColor,
      borderDownColor: negativeColor,
      wickUpColor: positiveColor,
      wickDownColor: negativeColor,
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

    // [ADDED] Create native Lightweight Charts overlay series for backend indicators.
    const lineOptions = { priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false, lineWidth: 2 };
    const indicatorSeries = {
      ma: {
        20: chart.addSeries(LineSeries, { ...lineOptions, color: "#f0b90b", title: "MA 20" }),
        50: chart.addSeries(LineSeries, { ...lineOptions, color: "#9b7cff", title: "MA 50" }),
      },
      ema: {
        9: chart.addSeries(LineSeries, { ...lineOptions, color: "#35b9e9", title: "EMA 9" }),
        21: chart.addSeries(LineSeries, { ...lineOptions, color: "#f28b52", title: "EMA 21" }),
      },
      bollinger: {
        upper: chart.addSeries(LineSeries, { ...lineOptions, color: "rgba(154,164,178,.75)", lineWidth: 1, title: "BB Upper" }),
        middle: chart.addSeries(LineSeries, { ...lineOptions, color: "#a0a8b5", lineWidth: 1, lineStyle: 2, title: "BB Basis" }),
        lower: chart.addSeries(LineSeries, { ...lineOptions, color: "rgba(154,164,178,.75)", lineWidth: 1, title: "BB Lower" }),
      },
      sar: chart.addSeries(LineSeries, { ...lineOptions, color: "#e6a23c", lineWidth: 1, lineStyle: 2, pointMarkersVisible: true, pointMarkersRadius: 2, title: "SAR" }),
      supertrend: {
        up: chart.addSeries(LineSeries, { ...lineOptions, color: "#20bd88", lineWidth: 2, title: "Supertrend Up" }),
        down: chart.addSeries(LineSeries, { ...lineOptions, color: "#ef5368", lineWidth: 2, title: "Supertrend Down" }),
      },
    };

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
    indicatorSeriesRef.current = indicatorSeries; // [ADDED] Keep overlay series available for updates.

    return () => {
      resizeObserver.disconnect();
      chart.unsubscribeCrosshairMove(handleCrosshairMove);
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
      indicatorSeriesRef.current = null;
    };
  }, [activeTheme, locale]);

  // [ADDED] Update chart series without recreating the chart on every live candle.
  useEffect(() => {
    const candleSeries = candleSeriesRef.current;
    const volumeSeries = volumeSeriesRef.current;
    const overlays = indicatorSeriesRef.current;
    if (!candleSeries || !volumeSeries) return;

    candleSeries.setData(candles);
    volumeSeries.setData(candles.map((candle) => ({
      time: candle.time,
      value: candle.volume,
      color: candle.close >= candle.open ? getComputedStyle(containerRef.current || document.documentElement).getPropertyValue("--positive").trim() || "#35cf86" : getComputedStyle(containerRef.current || document.documentElement).getPropertyValue("--negative").trim() || "#ef5368",
    })));

    // [ADDED] Align backend indicator arrays with the exact candle timestamps.
    if (overlays && indicatorData && candles.length) {
      const toLineData = (values) => candles.flatMap((candle, index) => {
        if (values?.[index] === null || values?.[index] === undefined) return [];
        const value = Number(values[index]);
        return Number.isFinite(value) ? [{ time: candle.time, value }] : [];
      });
      for (const [period, series] of Object.entries(overlays.ma)) {
        series.setData(toLineData(indicatorData.ma?.[period]));
        series.applyOptions({ visible: enabledIndicators.ma });
      }
      for (const [period, series] of Object.entries(overlays.ema)) {
        series.setData(toLineData(indicatorData.ema?.[period]));
        series.applyOptions({ visible: enabledIndicators.ema });
      }
      overlays.bollinger.upper.setData(toLineData(indicatorData.bollinger?.upper));
      overlays.bollinger.middle.setData(toLineData(indicatorData.bollinger?.middle));
      overlays.bollinger.lower.setData(toLineData(indicatorData.bollinger?.lower));
      Object.values(overlays.bollinger).forEach((series) => series.applyOptions({ visible: enabledIndicators.bollinger }));
      overlays.sar.setData(toLineData(indicatorData.sar));
      overlays.sar.applyOptions({ visible: enabledIndicators.sar });
      const supertrendUp = [];
      const supertrendDown = [];
      candles.forEach((candle, index) => {
        const value = indicatorData.supertrend?.value?.[index];
        const direction = indicatorData.supertrend?.direction?.[index];
        if (value === null || value === undefined) return;
        if (direction === 1) supertrendUp.push({ time: candle.time, value: Number(value) });
        if (direction === -1) supertrendDown.push({ time: candle.time, value: Number(value) });
      });
      overlays.supertrend.up.setData(supertrendUp);
      overlays.supertrend.down.setData(supertrendDown);
      overlays.supertrend.up.applyOptions({ visible: enabledIndicators.supertrend });
      overlays.supertrend.down.applyOptions({ visible: enabledIndicators.supertrend });
    }

    if (candles.length) setLastCandle(candles[candles.length - 1]);
    else setLastCandle(null);
  }, [candles, indicatorData, enabledIndicators, activeTheme]);

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
  const formatPrice = (value) => Number(value).toLocaleString(locale, { maximumFractionDigits: 8 });
  const formatVolume = (value) => Number(value || 0).toLocaleString(locale, { maximumFractionDigits: 2 });
  const candleChange = displayedCandle && displayedCandle.open
    ? ((displayedCandle.close - displayedCandle.open) / displayedCandle.open) * 100
    : 0;
  const candleRange = displayedCandle && displayedCandle.low
    ? ((displayedCandle.high - displayedCandle.low) / displayedCandle.low) * 100
    : 0;
  const candleTime = displayedCandle
    ? new Date(displayedCandle.time * 1000).toLocaleString(locale, {
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", hour12: false
      })
    : t("Waiting for data");

  // [ADDED] Indicator legend: values follow the crosshair candle, or the latest candle when idle.
  const legendTime = hoverCandle?.time ?? candles[candles.length - 1]?.time;
  const legendIndex = useMemo(
    () => (legendTime == null ? -1 : candles.findIndex((c) => c.time === legendTime)),
    [candles, legendTime]
  );

  const indicatorLegend = useMemo(() => {
    if (!indicatorData || legendIndex < 0) return [];
    const at = (arr) => {
      const raw = arr?.[legendIndex];
      if (raw === null || raw === undefined) return null;
      const n = Number(raw);
      return Number.isFinite(n) ? n : null;
    };
    const st = indicatorData.supertrend;
    const dir = st?.direction?.[legendIndex];
    return [
      { key: "ma", label: "MA 20", color: "#f0b90b", value: at(indicatorData.ma?.[20]) },
      { key: "ma", label: "MA 50", color: "#9b7cff", value: at(indicatorData.ma?.[50]) },
      { key: "ema", label: "EMA 9", color: "#35b9e9", value: at(indicatorData.ema?.[9]) },
      { key: "ema", label: "EMA 21", color: "#f28b52", value: at(indicatorData.ema?.[21]) },
      { key: "bollinger", label: "BB Upper", color: "#9aa4b2", value: at(indicatorData.bollinger?.upper) },
      { key: "bollinger", label: "BB Basis", color: "#a0a8b5", value: at(indicatorData.bollinger?.middle) },
      { key: "bollinger", label: "BB Lower", color: "#9aa4b2", value: at(indicatorData.bollinger?.lower) },
      { key: "sar", label: "SAR", color: "#e6a23c", value: at(indicatorData.sar) },
      {
        key: "supertrend",
        label: dir === -1 ? "ST ▼" : "ST ▲",
        color: dir === -1 ? "#ef5368" : "#20bd88",
        value: at(st?.value),
      },
    ].filter((item) => enabledIndicators[item.key]);
  }, [indicatorData, legendIndex, enabledIndicators]);

  const visibleTimeframes = ["1m", "5m", "15m", "1h"];
  const extraTimeframes = ["4h", "1d", "1w"];
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
              {time === "1h" ? "1h" : time}
            </button>
          ))}
          <div className="market-chart-more-wrap">
            <button
              type="button"
              className={activeExtraTimeframe ? "selected" : ""}
              onClick={() => setMoreTimeframesOpen((open) => !open)}
              aria-expanded={moreTimeframesOpen}
            >
              {activeExtraTimeframe ? (timeframe === "1d" ? "1D" : timeframe === "1w" ? "1W" : timeframe) : "Lainnya"}
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
                    {time === "1d" ? "1D" : time === "1w" ? "1W" : time}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="market-chart-icon-actions">
          <button type="button" onClick={toggleFullscreen} aria-label={t("Fullscreen chart")} title={t("Fullscreen")}>
            <Expand size={18} />
          </button>
          <button type="button" onClick={() => setChartToolsOpen((open) => !open)} aria-label={t("Chart settings")} title={t("Chart settings")}>
            <SlidersHorizontal size={18} />
          </button>
          <button type="button" onClick={resetChart} aria-label={t("Reset chart view")} title={t("Reset chart")}>
            <LayoutGrid size={18} />
          </button>
          {chartToolsOpen && (
            <div className="market-chart-tools-menu market-indicator-settings-menu">
              <div className="market-indicator-settings-heading">Indicators</div>
              {[
                { key: "ma", label: "MA", detail: "20 / 50" },
                { key: "ema", label: "EMA", detail: "9 / 21" },
                { key: "bollinger", label: "Bollinger Bands", detail: "20, 2" },
                { key: "sar", label: "Parabolic SAR", detail: "0.02 / 0.2" },
                { key: "supertrend", label: "Supertrend", detail: "10, 3" },
              ].map((item) => (
                <button
                  type="button"
                  key={item.key}
                  className="market-indicator-setting-row"
                  aria-pressed={enabledIndicators[item.key]}
                  onClick={() => setEnabledIndicators((current) => ({ ...current, [item.key]: !current[item.key] }))}
                >
                  <span className="market-indicator-setting-copy">
                    <strong>{item.label}</strong>
                    <small>{item.detail}</small>
                  </span>
                  <span className={enabledIndicators[item.key] ? "market-indicator-switch is-on" : "market-indicator-switch"}>
                    <span />
                  </span>
                </button>
              ))}
              <div className="market-indicator-settings-divider" />
              <div className="market-indicator-settings-heading">Chart</div>
              <button type="button" onClick={zoomIn}>{t("Zoom in")}</button>
              <button type="button" onClick={zoomOut}>{t("Zoom out")}</button>
              <button type="button" onClick={resetChart}>{t("Reset view")}</button>
            </div>
          )}
        </div>
      </div>
      {/* [ADDED] Indicator values legend, shown directly below the timeframe toolbar. */}
      {indicatorLegend.length > 0 && (
        <div className="market-indicator-legend" aria-label="Indicator values">
          {indicatorLegend.map((item) => (
            <span className="market-indicator-legend-item" key={item.label}>
              <i style={{ background: item.color }} />
              <em>{item.label}</em>
              <b style={{ color: item.color }}>
                {item.value === null ? "—" : formatPrice(item.value)}
              </b>
            </span>
          ))}
        </div>
      )}
      {/* [MODIFIED] Indicator controls are now inside the chart settings icon menu. */}
      <div className="market-trading-chart-canvas" ref={containerRef} role="img" aria-label={symbol + " interactive candlestick chart, " + timeframe}>
        {/* [ADDED] Low-opacity Beanance watermark centered behind the chart data. */}
        <div className="market-chart-watermark" aria-hidden="true">
          {/* [MODIFIED] Use the existing Beanance brand logo from public assets. */}
          <img src="/icons/logo.png" alt="" />
          <span>BEANANCE</span>
        </div>
        {/* [ADDED] Floating candle information panel, updated from crosshair position. */}
        {/* [MODIFIED] Keep the compact OHLC panel hidden until a candle is selected by crosshair. */}
        {displayedCandle && (
          <div className="market-candle-info" aria-live="polite">
            <span className="market-candle-info-time">{t("Time")} {candleTime}</span>
            <div><span>{t("Open")}</span><b>{formatPrice(displayedCandle.open)}</b></div>
            <div><span>High</span><b>{formatPrice(displayedCandle.high)}</b></div>
            <div><span>Low</span><b>{formatPrice(displayedCandle.low)}</b></div>
            <div><span>Close</span><b>{formatPrice(displayedCandle.close)}</b></div>
            <div><span>{t("Change")}</span><b className={candleChange >= 0 ? "positive" : "negative"}>{(candleChange >= 0 ? "+" : "") + candleChange.toFixed(2) + "%"}</b></div>
            <div><span>{t("Change %")}</span><b className={candleChange >= 0 ? "positive" : "negative"}>{(candleChange >= 0 ? "+" : "") + candleChange.toFixed(2) + "%"}</b></div>
            <div><span>{t("Range")}</span><b>{candleRange.toFixed(2) + "%"}</b></div>
            <div><span>{t("Volume")}</span><b>{formatVolume(displayedCandle.volume)}</b></div>
          </div>
        )}
      </div>
      {chartError && <div className="market-trading-chart-error">{chartError}</div>}
      {!chartError && !candles.length && <div className="market-trading-chart-error">{t("Loading market data...")}</div>}
    </div>
  );
}
