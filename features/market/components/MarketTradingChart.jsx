"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CandlestickSeries, HistogramSeries, LineSeries, createChart } from "lightweight-charts";
import { ChevronDown, Expand, LayoutGrid, Settings2, SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { translationKeys } from "../../../i18n/config";

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



// [ADDED] Calculate a configurable simple moving average from candle closes.
function calculateSma(candles, period) {
  let total = 0;
  return candles.map((candle, index) => {
    total += candle.close;
    if (index >= period) total -= candles[index - period].close;
    return index >= period - 1 ? total / period : null;
  });
}

// [ADDED] Calculate a configurable exponential moving average from candle closes.
function calculateEma(candles, period) {
  const values = Array(candles.length).fill(null);
  if (candles.length < period) return values;
  const multiplier = 2 / (period + 1);
  let previous = candles.slice(0, period).reduce((sum, candle) => sum + candle.close, 0) / period;
  values[period - 1] = previous;
  for (let index = period; index < candles.length; index += 1) {
    previous = (candles[index].close - previous) * multiplier + previous;
    values[index] = previous;
  }
  return values;
}

// [ADDED] Calculate configurable Bollinger Bands from candle closes.
function calculateBollinger(candles, period, multiplier) {
  const middle = calculateSma(candles, period);
  const upper = [];
  const lower = [];
  candles.forEach((candle, index) => {
    if (middle[index] === null) {
      upper.push(null);
      lower.push(null);
      return;
    }
    const window = candles.slice(index - period + 1, index + 1);
    const variance = window.reduce((sum, item) => sum + Math.pow(item.close - middle[index], 2), 0) / period;
    const deviation = Math.sqrt(variance) * multiplier;
    upper.push(middle[index] + deviation);
    lower.push(middle[index] - deviation);
  });
  return { upper, middle, lower };
}

// [ADDED] Calculate Parabolic SAR using configurable acceleration parameters.
function calculateParabolicSar(candles, step, maximum) {
  const values = Array(candles.length).fill(null);
  if (candles.length < 2) return values;
  let upTrend = candles[1].close >= candles[0].close;
  let sar = upTrend ? Math.min(candles[0].low, candles[1].low) : Math.max(candles[0].high, candles[1].high);
  let extreme = upTrend ? Math.max(candles[0].high, candles[1].high) : Math.min(candles[0].low, candles[1].low);
  let acceleration = step;
  for (let index = 2; index < candles.length; index += 1) {
    const previousSar = sar;
    sar = previousSar + acceleration * (extreme - previousSar);
    if (upTrend) {
      sar = Math.min(sar, candles[index - 1].low, candles[index - 2].low);
      if (candles[index].low < sar) {
        upTrend = false;
        sar = extreme;
        extreme = candles[index].low;
        acceleration = step;
      } else if (candles[index].high > extreme) {
        extreme = candles[index].high;
        acceleration = Math.min(acceleration + step, maximum);
      }
    } else {
      sar = Math.max(sar, candles[index - 1].high, candles[index - 2].high);
      if (candles[index].high > sar) {
        upTrend = true;
        sar = extreme;
        extreme = candles[index].high;
        acceleration = step;
      } else if (candles[index].low < extreme) {
        extreme = candles[index].low;
        acceleration = Math.min(acceleration + step, maximum);
      }
    }
    values[index] = sar;
  }
  return values;
}

// [ADDED] Calculate Supertrend using configurable ATR period and multiplier.
function calculateSupertrend(candles, period, multiplier) {
  const length = candles.length;
  const values = Array(length).fill(null);
  const directions = Array(length).fill(null);
  if (length < period) return { values, directions };
  const trueRanges = candles.map((candle, index) => {
    if (index === 0) return candle.high - candle.low;
    return Math.max(candle.high - candle.low, Math.abs(candle.high - candles[index - 1].close), Math.abs(candle.low - candles[index - 1].close));
  });
  const atr = Array(length).fill(null);
  let initial = trueRanges.slice(0, period).reduce((sum, value) => sum + value, 0) / period;
  atr[period - 1] = initial;
  for (let index = period; index < length; index += 1) atr[index] = (atr[index - 1] * (period - 1) + trueRanges[index]) / period;
  let finalUpper = null;
  let finalLower = null;
  let direction = 1;
  for (let index = period - 1; index < length; index += 1) {
    const midpoint = (candles[index].high + candles[index].low) / 2;
    const basicUpper = midpoint + multiplier * atr[index];
    const basicLower = midpoint - multiplier * atr[index];
    finalUpper = finalUpper === null || basicUpper < finalUpper || candles[index - 1]?.close > finalUpper ? basicUpper : finalUpper;
    finalLower = finalLower === null || basicLower > finalLower || candles[index - 1]?.close < finalLower ? basicLower : finalLower;
    if (index > period - 1) {
      if (direction === 1 && candles[index].close < finalLower) direction = -1;
      else if (direction === -1 && candles[index].close > finalUpper) direction = 1;
    }
    values[index] = direction === 1 ? finalLower : finalUpper;
    directions[index] = direction;
  }
  return { values, directions };
}

const DEFAULT_INDICATOR_SETTINGS = {
  ma: { periods: [{ period: 7, color: "#f0b90b" }, { period: 25, color: "#3b82f6" }, { period: 99, color: "#a855f7" }] },
  ema: { periods: [{ period: 9, color: "#35b9e9" }, { period: 21, color: "#f28b52" }] },
  bollinger: { period: 20, multiplier: 2, colors: { upper: "#9aa4b2", middle: "#a0a8b5", lower: "#9aa4b2" } },
  sar: { step: 0.02, maximum: 0.2, color: "#e6a23c" },
  supertrend: { period: 10, multiplier: 3, upColor: "#20bd88", downColor: "#ef5368" },
};

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
  // [ADDED] Persist configurable indicator periods, parameters, and colors.
  const [indicatorSettings, setIndicatorSettings] = useState(DEFAULT_INDICATOR_SETTINGS);
  const [openIndicatorSettings, setOpenIndicatorSettings] = useState("");
  const [newIndicatorPeriods, setNewIndicatorPeriods] = useState({ ma: "", ema: "" });
  const [indicatorSettingsLoaded, setIndicatorSettingsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("beanance-chart-indicator-settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        setIndicatorSettings({
          ...DEFAULT_INDICATOR_SETTINGS,
          ...parsed,
          ma: { ...DEFAULT_INDICATOR_SETTINGS.ma, ...parsed.ma },
          ema: { ...DEFAULT_INDICATOR_SETTINGS.ema, ...parsed.ema },
          bollinger: { ...DEFAULT_INDICATOR_SETTINGS.bollinger, ...parsed.bollinger, colors: { ...DEFAULT_INDICATOR_SETTINGS.bollinger.colors, ...parsed.bollinger?.colors } },
          sar: { ...DEFAULT_INDICATOR_SETTINGS.sar, ...parsed.sar },
          supertrend: { ...DEFAULT_INDICATOR_SETTINGS.supertrend, ...parsed.supertrend },
        });
      }
    } catch (error) {
      console.warn("Unable to load saved indicator settings:", error);
    }
    setIndicatorSettingsLoaded(true);
  }, []);

  useEffect(() => {
    if (!indicatorSettingsLoaded) return;
    window.localStorage.setItem("beanance-chart-indicator-settings", JSON.stringify(indicatorSettings));
  }, [indicatorSettings, indicatorSettingsLoaded]);
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

  // [ADDED] Calculate all configured indicators locally so every setting changes the actual chart.
  const indicatorValues = useMemo(() => ({
    ma: Object.fromEntries(indicatorSettings.ma.periods.map((item) => [item.period, calculateSma(candles, item.period)])),
    ema: Object.fromEntries(indicatorSettings.ema.periods.map((item) => [item.period, calculateEma(candles, item.period)])),
    bollinger: calculateBollinger(candles, indicatorSettings.bollinger.period, indicatorSettings.bollinger.multiplier),
    sar: calculateParabolicSar(candles, indicatorSettings.sar.step, indicatorSettings.sar.maximum),
    supertrend: calculateSupertrend(candles, indicatorSettings.supertrend.period, indicatorSettings.supertrend.multiplier),
  }), [candles, indicatorSettings]);

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

    // [MODIFIED] Build overlay series from the user's configurable periods and colors.
    const lineOptions = { priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false, lineWidth: 2 };
    const indicatorSeries = {
      ma: Object.fromEntries(indicatorSettings.ma.periods.map((item) => [item.period, chart.addSeries(LineSeries, { ...lineOptions, color: item.color })])),
      ema: Object.fromEntries(indicatorSettings.ema.periods.map((item) => [item.period, chart.addSeries(LineSeries, { ...lineOptions, color: item.color })])),
      bollinger: {
        upper: chart.addSeries(LineSeries, { ...lineOptions, color: indicatorSettings.bollinger.colors.upper, lineWidth: 1 }),
        middle: chart.addSeries(LineSeries, { ...lineOptions, color: indicatorSettings.bollinger.colors.middle, lineWidth: 1, lineStyle: 2 }),
        lower: chart.addSeries(LineSeries, { ...lineOptions, color: indicatorSettings.bollinger.colors.lower, lineWidth: 1 }),
      },
      sar: chart.addSeries(LineSeries, { ...lineOptions, color: indicatorSettings.sar.color, lineWidth: 1, lineStyle: 2, pointMarkersVisible: true, pointMarkersRadius: 2 }),
      supertrend: {
        up: chart.addSeries(LineSeries, { ...lineOptions, color: indicatorSettings.supertrend.upColor, lineWidth: 2 }),
        down: chart.addSeries(LineSeries, { ...lineOptions, color: indicatorSettings.supertrend.downColor, lineWidth: 2 }),
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
  }, [activeTheme, locale, indicatorSettings]);

  // [MODIFIED] Recalculate and update all overlay series from configurable client-side settings.
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

    const toLineData = (values) => candles.flatMap((candle, index) => {
      const value = values?.[index];
      return value === null || value === undefined || !Number.isFinite(Number(value)) ? [] : [{ time: candle.time, value: Number(value) }];
    });

    if (overlays && candles.length) {
      for (const item of indicatorSettings.ma.periods) {
        const values = indicatorValues.ma[item.period] || [];
        overlays.ma[item.period]?.setData(toLineData(values));
        overlays.ma[item.period]?.applyOptions({ visible: enabledIndicators.ma });
      }
      for (const item of indicatorSettings.ema.periods) {
        const values = indicatorValues.ema[item.period] || [];
        overlays.ema[item.period]?.setData(toLineData(values));
        overlays.ema[item.period]?.applyOptions({ visible: enabledIndicators.ema });
      }
      overlays.bollinger.upper.setData(toLineData(indicatorValues.bollinger.upper));
      overlays.bollinger.middle.setData(toLineData(indicatorValues.bollinger.middle));
      overlays.bollinger.lower.setData(toLineData(indicatorValues.bollinger.lower));
      Object.values(overlays.bollinger).forEach((series) => series.applyOptions({ visible: enabledIndicators.bollinger }));
      overlays.sar.setData(toLineData(indicatorValues.sar));
      overlays.sar.applyOptions({ visible: enabledIndicators.sar });
      const supertrendUp = [];
      const supertrendDown = [];
      candles.forEach((candle, index) => {
        const value = indicatorValues.supertrend.values[index];
        const direction = indicatorValues.supertrend.directions[index];
        if (value === null || value === undefined) return;
        if (direction === 1) supertrendUp.push({ time: candle.time, value });
        if (direction === -1) supertrendDown.push({ time: candle.time, value });
      });
      overlays.supertrend.up.setData(supertrendUp);
      overlays.supertrend.down.setData(supertrendDown);
      overlays.supertrend.up.applyOptions({ visible: enabledIndicators.supertrend });
      overlays.supertrend.down.applyOptions({ visible: enabledIndicators.supertrend });
    }

    if (candles.length) setLastCandle(candles[candles.length - 1]);
    else setLastCandle(null);
  }, [candles, indicatorValues, enabledIndicators, activeTheme, indicatorSettings]);

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

  const visibleTimeframes = ["1m", "5m", "15m", "1h"];
  const extraTimeframes = ["4h", "1d", "1w"];
  const activeExtraTimeframe = extraTimeframes.includes(timeframe);

  // [ADDED] Update one indicator setting without disturbing the remaining configurations.
  const updateIndicatorSetting = (indicator, field, value) => {
    setIndicatorSettings((current) => ({
      ...current,
      [indicator]: { ...current[indicator], [field]: value },
    }));
  };

  // [ADDED] Update one period or color for an MA/EMA line.
  const updateIndicatorPeriod = (indicator, index, field, value) => {
    setIndicatorSettings((current) => {
      if (field === "period" && current[indicator].periods.some((item, itemIndex) => itemIndex !== index && item.period === value)) return current;
      return {
        ...current,
        [indicator]: {
          ...current[indicator],
          periods: current[indicator].periods.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item),
        },
      };
    });
  };

  // [ADDED] Add a user-defined MA/EMA period with a distinct default color.
  const addIndicatorPeriod = (indicator) => {
    const period = Math.floor(Number(newIndicatorPeriods[indicator]));
    if (!Number.isInteger(period) || period < 1 || period > 1000) return;
    setIndicatorSettings((current) => {
      if (current[indicator].periods.some((item) => item.period === period)) return current;
      const palette = ["#f0b90b", "#3b82f6", "#a855f7", "#20bd88", "#f28b52", "#35b9e9", "#ef5368"];
      const color = palette[current[indicator].periods.length % palette.length];
      return { ...current, [indicator]: { ...current[indicator], periods: [...current[indicator].periods, { period, color }].sort((a, b) => a.period - b.period) } };
    });
    setNewIndicatorPeriods((current) => ({ ...current, [indicator]: "" }));
  };

  // [ADDED] Remove a configurable MA/EMA period.
  const removeIndicatorPeriod = (indicator, period) => {
    setIndicatorSettings((current) => ({
      ...current,
      [indicator]: { ...current[indicator], periods: current[indicator].periods.filter((item) => item.period !== period) },
    }));
  };

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
                { key: "ma", label: "MA", detail: indicatorSettings.ma.periods.map((item) => item.period).join(" / ") || "No periods" },
                { key: "ema", label: "EMA", detail: indicatorSettings.ema.periods.map((item) => item.period).join(" / ") || "No periods" },
                { key: "bollinger", label: "Bollinger Bands", detail: indicatorSettings.bollinger.period + ", " + indicatorSettings.bollinger.multiplier },
                { key: "sar", label: "Parabolic SAR", detail: indicatorSettings.sar.step + " / " + indicatorSettings.sar.maximum },
                { key: "supertrend", label: "Supertrend", detail: indicatorSettings.supertrend.period + ", " + indicatorSettings.supertrend.multiplier },
              ].map((item) => (
                <div className="market-indicator-setting-group" key={item.key}>
                  <div className="market-indicator-setting-row">
                    <span className="market-indicator-setting-copy">
                      <strong>{item.label}</strong>
                      <small>{item.detail}</small>
                    </span>
                    <div className="market-indicator-setting-actions">
                      <button type="button" className={openIndicatorSettings === item.key ? "market-indicator-config-button active" : "market-indicator-config-button"} aria-label={"Configure " + item.label} title={"Configure " + item.label} onClick={() => setOpenIndicatorSettings((current) => current === item.key ? "" : item.key)}>
                        <Settings2 size={15} />
                      </button>
                      <button type="button" className="market-indicator-toggle-button" aria-label={"Toggle " + item.label} aria-pressed={enabledIndicators[item.key]} onClick={() => setEnabledIndicators((current) => ({ ...current, [item.key]: !current[item.key] }))}>
                        <span className={enabledIndicators[item.key] ? "market-indicator-switch is-on" : "market-indicator-switch"}><span /></span>
                      </button>
                    </div>
                  </div>
                  {openIndicatorSettings === item.key && (
                    <div className="market-indicator-config-panel">
                      {(item.key === "ma" || item.key === "ema") && (
                        <>
                          {indicatorSettings[item.key].periods.map((periodItem, index) => (
                            <div className="market-indicator-period-row" key={periodItem.period}>
                              <label>Period<input type="number" min="1" max="1000" value={periodItem.period} onChange={(event) => {
                                const value = Math.max(1, Math.min(1000, Math.floor(Number(event.target.value) || 1)));
                                updateIndicatorPeriod(item.key, index, "period", value);
                              }} /></label>
                              <label>Color<input type="color" value={periodItem.color} aria-label={item.label + " period " + periodItem.period + " color"} onChange={(event) => updateIndicatorPeriod(item.key, index, "color", event.target.value)} /></label>
                              <button type="button" className="market-indicator-remove-button" aria-label={"Remove " + item.label + " " + periodItem.period} onClick={() => removeIndicatorPeriod(item.key, periodItem.period)}>×</button>
                            </div>
                          ))}
                          <div className="market-indicator-add-row">
                            <input type="number" min="1" max="1000" placeholder="New period" value={newIndicatorPeriods[item.key]} onChange={(event) => setNewIndicatorPeriods((current) => ({ ...current, [item.key]: event.target.value }))} />
                            <button type="button" onClick={() => addIndicatorPeriod(item.key)}>+ Add Period</button>
                          </div>
                        </>
                      )}
                      {item.key === "bollinger" && (
                        <>
                          <div className="market-indicator-parameter-row">
                            <label>Period<input type="number" min="2" max="500" value={indicatorSettings.bollinger.period} onChange={(event) => updateIndicatorSetting("bollinger", "period", Math.max(2, Math.min(500, Number(event.target.value) || 2)))} /></label>
                            <label>Deviation<input type="number" min="0.1" max="10" step="0.1" value={indicatorSettings.bollinger.multiplier} onChange={(event) => updateIndicatorSetting("bollinger", "multiplier", Math.max(0.1, Math.min(10, Number(event.target.value) || 0.1)))} /></label>
                          </div>
                          <div className="market-indicator-color-row">
                            {["upper", "middle", "lower"].map((line) => <label key={line}>{line}<input type="color" value={indicatorSettings.bollinger.colors[line]} onChange={(event) => setIndicatorSettings((current) => ({ ...current, bollinger: { ...current.bollinger, colors: { ...current.bollinger.colors, [line]: event.target.value } } }))} /></label>)}
                          </div>
                        </>
                      )}
                      {item.key === "sar" && (
                        <>
                          <div className="market-indicator-parameter-row">
                            <label>Acceleration<input type="number" min="0.001" max="1" step="0.001" value={indicatorSettings.sar.step} onChange={(event) => updateIndicatorSetting("sar", "step", Math.max(0.001, Math.min(1, Number(event.target.value) || 0.001)))} /></label>
                            <label>Maximum<input type="number" min="0.01" max="1" step="0.01" value={indicatorSettings.sar.maximum} onChange={(event) => updateIndicatorSetting("sar", "maximum", Math.max(0.01, Math.min(1, Number(event.target.value) || 0.01)))} /></label>
                          </div>
                          <div className="market-indicator-color-row"><label>SAR color<input type="color" value={indicatorSettings.sar.color} onChange={(event) => updateIndicatorSetting("sar", "color", event.target.value)} /></label></div>
                        </>
                      )}
                      {item.key === "supertrend" && (
                        <>
                          <div className="market-indicator-parameter-row">
                            <label>ATR Period<input type="number" min="1" max="500" value={indicatorSettings.supertrend.period} onChange={(event) => updateIndicatorSetting("supertrend", "period", Math.max(1, Math.min(500, Number(event.target.value) || 1)))} /></label>
                            <label>Multiplier<input type="number" min="0.1" max="20" step="0.1" value={indicatorSettings.supertrend.multiplier} onChange={(event) => updateIndicatorSetting("supertrend", "multiplier", Math.max(0.1, Math.min(20, Number(event.target.value) || 0.1)))} /></label>
                          </div>
                          <div className="market-indicator-color-row">
                            <label>Up color<input type="color" value={indicatorSettings.supertrend.upColor} onChange={(event) => updateIndicatorSetting("supertrend", "upColor", event.target.value)} /></label>
                            <label>Down color<input type="color" value={indicatorSettings.supertrend.downColor} onChange={(event) => updateIndicatorSetting("supertrend", "downColor", event.target.value)} /></label>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
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
      {/* [MODIFIED] Show enabled indicator values below timeframe for the crosshair-selected candle. */}
      {displayedCandle && (() => {
        const candleIndex = candles.findIndex((candle) => candle.time === displayedCandle.time);
        if (candleIndex < 0) return null;
        const indicatorRows = [];
        const addRow = (key, label, value, colorClass = "", color = "") => {
          if (value === null || value === undefined || !Number.isFinite(Number(value))) return;
          indicatorRows.push({ key, label, value: formatPrice(value), colorClass, color });
        };

        if (enabledIndicators.ma) {
          indicatorSettings.ma.periods.forEach((item) => addRow("ma-" + item.period, "MA(" + item.period + ")", indicatorValues.ma[item.period]?.[candleIndex], "ma-period-" + item.period, item.color));
        }
        if (enabledIndicators.ema) {
          indicatorSettings.ema.periods.forEach((item) => addRow("ema-" + item.period, "EMA(" + item.period + ")", indicatorValues.ema[item.period]?.[candleIndex], "ema-period-" + item.period, item.color));
        }
        if (enabledIndicators.bollinger) {
          addRow("bb-upper", "BB Upper", indicatorValues.bollinger.upper[candleIndex], "bb-upper", indicatorSettings.bollinger.colors.upper);
          addRow("bb-middle", "BB Basis", indicatorValues.bollinger.middle[candleIndex], "bb-middle", indicatorSettings.bollinger.colors.middle);
          addRow("bb-lower", "BB Lower", indicatorValues.bollinger.lower[candleIndex], "bb-lower", indicatorSettings.bollinger.colors.lower);
        }
        if (enabledIndicators.sar) addRow("sar", "SAR", indicatorValues.sar[candleIndex], "sar", indicatorSettings.sar.color);
        if (enabledIndicators.supertrend) {
          const supertrendValue = indicatorValues.supertrend.values[candleIndex];
          const supertrendDirection = indicatorValues.supertrend.directions[candleIndex];
          addRow("supertrend", "Supertrend" + (supertrendDirection === 1 ? " ↑" : supertrendDirection === -1 ? " ↓" : ""), supertrendValue, supertrendDirection === 1 ? "supertrend-up" : "supertrend-down", supertrendDirection === 1 ? indicatorSettings.supertrend.upColor : indicatorSettings.supertrend.downColor);
        }

        if (!indicatorRows.length) return null;
        return (
          <div className="market-chart-ma-values" aria-label="Indicator values">
            {indicatorRows.map((item) => (
              <div className={"market-chart-ma-value " + item.colorClass} key={item.key}>
                <span style={item.color ? { color: item.color } : undefined}>{item.label}</span>
                <b>{item.value}</b>
              </div>
            ))}
          </div>
        );
      })()}
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
