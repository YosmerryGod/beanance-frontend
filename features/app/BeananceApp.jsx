"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { sidebarTranslations, supportedLanguages, translationKeys } from "../../i18n/config";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  Users,
  CalendarDays,
  Camera, // [ADDED] Profile photo upload
  CheckCircle2, // [ADDED] Connected account indicator
  Circle, // [ADDED] Disconnected account indicator
  Save, // [ADDED] Save profile changes
  Activity,
  Bell,
  ChevronRight,
  CircleHelp,
  Compass,
  Copy,
  LayoutDashboard,
  Languages, // [ADDED] Language settings icon
  Palette, // [ADDED] Appearance settings icon
  Info, // [ADDED] About Beanance icon
  Menu, // [ADDED] Sidebar menu icon
  Plus,
  Search,
  Star,
  SlidersHorizontal,
  ShieldCheck,
  UserRound,
  Wallet,
  X,
  BarChart3,
  Layers, // [ADDED] Portfolio strategy tab icon
  TrendingUp, // [ADDED] Portfolio performance icon
  Clock3, // [ADDED] Portfolio transaction history icon
  Target, // [ADDED] Portfolio win-rate metric icon
  Moon,
  Sun,
  Sparkles,
  BadgeCheck,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Check,
  Headset, // [ADDED] Help Center support branding
  Rocket, // [ADDED] Help Center category icon
  CandlestickChart, // [ADDED] Help Center trading category icon
  AlertTriangle, // [ADDED] Help Center troubleshooting category icon
  FileText, // [ADDED] Help Center article icon
  MessageCircle, // [ADDED] Help Center contact support icon
  Maximize2, // [ADDED] Market chart fullscreen control
} from "lucide-react";
import CoinLogo from "../../components/ui/CoinLogo";
import MarketTradingChart from "../market/components/MarketTradingChart";
import { formatMarketPeriodReturn, formatMarketPrice, formatMarketVolume } from "../market/lib/format"; // [ADDED] Interactive TradingView-style market chart


const navigation = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "dapps", label: "Discover", icon: Compass },
  { id: "create", label: "Create", icon: Plus, primary: true },
  { id: "market", label: "Market", icon: BarChart3 },
  { id: "profile", label: "Portfolio", icon: Wallet }, // [MODIFIED] Rename the bottom navigation destination label and icon.
];

const traderProfiles = {
  tradewiz: { name: "TradeWiz", bio: "Trend trader focused on disciplined entries, market structure, and consistent risk management.", followers: "342", returns: "+124.5%", win: "68%", trades: "680", age: "240 days", strategies: [{ name: "BTC Trend Master", type: "Trend Following", risk: "Medium Risk", returns: "+124.5%", win: "68%", trades: "680" }, { name: "BTC Momentum", type: "Momentum", risk: "Medium Risk", returns: "+42.8%", win: "65%", trades: "214" }, { name: "Market Structure Pro", type: "Swing Trading", risk: "Low Risk", returns: "+28.4%", win: "71%", trades: "96" }] },
  cryptofox: { name: "CryptoFox", bio: "Systematic scalper looking for high-probability setups across major crypto pairs.", followers: "1.2K", returns: "+89.2%", win: "72%", trades: "1,240", age: "120 days", strategies: [{ name: "Scalping AI v2", type: "Scalping", risk: "Low Risk", returns: "+89.2%", win: "72%", trades: "1,240" }, { name: "ETH Quick Moves", type: "Scalping", risk: "Medium Risk", returns: "+36.7%", win: "69%", trades: "328" }] },
  moontrade: { name: "MoonTrade", bio: "Breakout trader combining momentum and volatility to capture market opportunities.", followers: "856", returns: "+68.1%", win: "63%", trades: "310", age: "75 days", strategies: [{ name: "ETH Breakout", type: "Breakout", risk: "Medium Risk", returns: "+68.1%", win: "63%", trades: "310" }, { name: "SOL Momentum", type: "Momentum", risk: "High Risk", returns: "+31.2%", win: "61%", trades: "184" }] },
  quantalab: { name: "QuantaLab", bio: "Quant-minded trader exploring rule-based strategies and measurable market edges.", followers: "432", returns: "+54.3%", win: "58%", trades: "92", age: "35 days", strategies: [{ name: "BNB Momentum", type: "Momentum", risk: "Low Risk", returns: "+54.3%", win: "58%", trades: "92" }] },
  solking: { name: "SolKing", bio: "Solana ecosystem trader focused on momentum and trend continuation.", followers: "321", returns: "+48.7%", win: "61%", trades: "45", age: "18 days", strategies: [{ name: "SOL Trend Rider", type: "Trend Following", risk: "Medium Risk", returns: "+48.7%", win: "61%", trades: "45" }] }
};

const marketAssets = [
  { symbol: "BTC", name: "Bitcoin", price: "$65,120.40", change: "+2.45%", positive: true, icon: "BTC", tone: "bitcoin", volume: "$28.4B", high: "$66,240.00", low: "$63,810.20", quoteVolume: "$28.4B" },
  { symbol: "ETH", name: "Ethereum", price: "$2,976.80", change: "+1.82%", positive: true, icon: "ETH", tone: "ethereum", volume: "$14.2B", high: "$3,025.40", low: "$2,910.15", quoteVolume: "$14.2B" },
  { symbol: "BNB", name: "BNB", price: "$651.23", change: "-0.64%", positive: false, icon: "BNB", tone: "bnb", volume: "$1.8B", high: "$662.80", low: "$644.10", quoteVolume: "$1.8B" },
  { symbol: "SOL", name: "Solana", price: "$158.72", change: "+4.21%", positive: true, icon: "SOL", tone: "solana", volume: "$3.9B", high: "$162.50", low: "$151.20", quoteVolume: "$3.9B" },
  { symbol: "XRP", name: "XRP", price: "$0.6241", change: "-1.12%", positive: false, tone: "xrp", volume: "$1.1B", high: "$0.6380", low: "$0.6152", quoteVolume: "$1.1B" },
];

// [ADDED] Short-term market movement examples for the Top Movers interface.
const topMoverEvents = [
  { symbol: "SOL", name: "Solana", change: "+3.82%", timeframe: "5 mnt", time: "14:05:50", status: "Rally", category: "Rally", positive: true },
  { symbol: "BTC", name: "Bitcoin", change: "+1.46%", timeframe: "15 mnt", time: "14:05:42", status: "Kenaikan tajam", category: "Kenaikan", positive: true },
  { symbol: "XRP", name: "XRP", change: "-2.65%", timeframe: "5 mnt", time: "14:05:31", status: "Penurunan tajam", category: "Penurunan", positive: false },
  { symbol: "ETH", name: "Ethereum", change: "+2.14%", timeframe: "1 jam", time: "14:04:58", status: "High baru 24 jam", category: "High Baru", positive: true },
  { symbol: "BNB", name: "BNB", change: "-1.92%", timeframe: "15 mnt", time: "14:04:20", status: "Pullback", category: "Pullback", positive: false },
  { symbol: "SOL", name: "Solana", change: "+5.28%", timeframe: "2 jam", time: "14:03:46", status: "High baru 7 hari", category: "High Baru", positive: true },
  { symbol: "BTC", name: "Bitcoin", change: "-1.18%", timeframe: "1 jam", time: "14:02:15", status: "Low baru 24 jam", category: "Low Baru", positive: false },
  { symbol: "ETH", name: "Ethereum", change: "+1.72%", timeframe: "30 mnt", time: "14:01:40", status: "Kenaikan tajam", category: "Kenaikan", positive: true },
  { symbol: "XRP", name: "XRP", change: "-3.24%", timeframe: "2 jam", time: "14:00:18", status: "Pullback", category: "Pullback", positive: false },
];




// [ADDED] Normalize Binance USDT-M ticker values for the existing Beanance market UI.
function mapLiveMarketAsset(item, locale = "en") {
  const symbol = item.baseAsset || String(item.symbol || "").replace(/USDT$/, "");
  const metadata = marketAssets.find((asset) => asset.symbol === symbol);
  const changeValue = Number(item.priceChangePercent || 0);
  return {
    symbol,
    name: metadata?.name || symbol,
    price: formatMarketPrice(item.lastPrice, locale),
    change: (changeValue > 0 ? "+" : "") + changeValue.toFixed(2) + "%",
    positive: changeValue >= 0,
    icon: symbol,
    tone: metadata?.tone || "",
    volume: formatMarketVolume(item.quoteVolume, "$", locale),
    baseVolume: formatMarketVolume(item.baseVolume, "", locale),
    high: formatMarketPrice(item.highPrice, locale),
    low: formatMarketPrice(item.lowPrice, locale),
    quoteVolume: formatMarketVolume(item.quoteVolume, "$", locale),
    priceNumber: Number(item.lastPrice || 0),
    changeNumber: changeValue,
    volumeNumber: Number(item.quoteVolume || 0),
    contractType: item.contractType,
    marketType: item.marketType,
    isTrading: item.isTrading,
    eventTime: item.eventTime || item.closeTime || null,
  };
}

// [MODIFIED] Normalize realtime one-minute candle momentum events from the market backend.
function mapLiveTopMover(item, locale = "en") {
  const symbol = String(item.baseAsset || item.symbol || "").replace(/USDT$/, "");
  const metadata = marketAssets.find((asset) => asset.symbol === symbol);
  const changeValue = Number(item.changePercent || 0);
  const eventTime = Number(item.eventTime || Date.now());
  const status = item.status || (changeValue >= 0 ? "Momentum naik" : "Momentum turun");
  return {
    symbol,
    name: metadata?.name || symbol,
    change: (changeValue > 0 ? "+" : "") + changeValue.toFixed(2) + "%",
    changeValue,
    positive: changeValue >= 0,
    category: changeValue >= 0 ? "Kenaikan" : "Penurunan",
    timeframe: "1m",
    time: new Date(eventTime).toLocaleTimeString(locale, { hour12: false }),
    status,
    volumeRatio: Number.isFinite(Number(item.volumeRatio)) ? Number(item.volumeRatio) : null,
    quoteVolume: Number(item.quoteVolume || 0),
    previousClose: Number(item.previousClose || 0),
    candleOpen: Number(item.candleOpen || 0),
    candleClosed: Boolean(item.candleClosed),
  };
}

function App() {
  const { t: translate, i18n: translator } = useTranslation(); // [ADDED] Subscribe every page section to global language changes.
  const [active, setActive] = useState("dashboard");
  const [helpReturnTo, setHelpReturnTo] = useState("dashboard"); // [ADDED] Return destination for standalone Help Center
  const [aboutReturnTo, setAboutReturnTo] = useState("dashboard"); // [ADDED] Return destination for standalone About page
  const [helpSearch, setHelpSearch] = useState(""); // [ADDED] Help Center article search
  const [helpCategory, setHelpCategory] = useState("All"); // [ADDED] Help Center category filter
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [notice, setNotice] = useState("");
  const [theme, setTheme] = useState("dark");
  const [themeReady, setThemeReady] = useState(false); // [ADDED] Avoid overwriting the pre-hydrated theme before it is restored.
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // [ADDED] Global navigation drawer
  const [profileName, setProfileName] = useState("Ezy"); // [ADDED] Editable Beanance username
  const [profileEmail, setProfileEmail] = useState(""); // [ADDED] Email is shown only when available
  const [profilePhoto, setProfilePhoto] = useState(""); // [ADDED] User-selected profile photo
  const [binanceConnected, setBinanceConnected] = useState(false); // [ADDED] Reflects a verified Binance connection when integration is available
  const [web3Connected, setWeb3Connected] = useState(false); // [ADDED] Reflects a verified Web3 wallet connection when integration is available
  const [walletPreviewMode, setWalletPreviewMode] = useState(false); // [ADDED] Lets users preview the connected wallet layout without claiming a real connection
  const profilePhotoInputRef = useRef(null); // [ADDED] Hidden profile photo picker
  const [language, setLanguage] = useState("en"); // [MODIFIED] App language, English by default
  const languageRef = useRef("en"); // [ADDED] Keep async market callbacks formatted in the active language.
  const [languageReady, setLanguageReady] = useState(false); // [ADDED] Wait for saved language before persisting
  const [languageOpen, setLanguageOpen] = useState(false); // [ADDED] Language picker visibility
  const [traderPeriod, setTraderPeriod] = useState("All");
  const [marketFilter, setMarketFilter] = useState("Favorites");
  const [marketNavTab, setMarketNavTab] = useState("all-market"); // [ADDED] Market navbar tabs
  const [selectedMarket, setSelectedMarket] = useState(marketAssets[0]); // [ADDED] Selected asset for full market detail
  const [liveMarketAssets, setLiveMarketAssets] = useState(marketAssets); // [ADDED] Live USDT-M futures data from Beanance Market API
  const [liveTopMoverEvents, setLiveTopMoverEvents] = useState([]); // [MODIFIED] Live one-minute candle momentum events
  const [marketConnectionStatus, setMarketConnectionStatus] = useState("connecting"); // [ADDED] Market feed connection state
  const [marketDetailTab, setMarketDetailTab] = useState("price"); // [ADDED] Market detail section tab
  const [marketTimeframe, setMarketTimeframe] = useState("30m"); // [ADDED] Market chart timeframe
  const [marketIndicator, setMarketIndicator] = useState("RSI"); // [ADDED] Active technical indicator
  const [marketOrderTab, setMarketOrderTab] = useState("book"); // [ADDED] Order book, depth, and trades tabs
  // [ADDED] Live market detail data from Beanance Market Backend.
  const [marketOrderBook, setMarketOrderBook] = useState({ bids: [], asks: [] });
  const [marketRecentTrades, setMarketRecentTrades] = useState([]);
  const [marketMetrics, setMarketMetrics] = useState(null);
  const [marketDailyCandles, setMarketDailyCandles] = useState([]); // [ADDED] Daily history used to calculate real period returns.
  const [marketDetailStatus, setMarketDetailStatus] = useState("loading");
  const [marketDetailError, setMarketDetailError] = useState("");

  const [moverCategory, setMoverCategory] = useState("Semua"); // [ADDED] Top Movers short-term filters
  const [marketSort, setMarketSort] = useState("volume"); // [ADDED] Market table sorting
  const [marketSortDirection, setMarketSortDirection] = useState("desc"); // [ADDED] Market sort direction
  const [pinnedMarketSymbols, setPinnedMarketSymbols] = useState([]); // [ADDED] Pinned market assets
  const [mobileDashboardTab, setMobileDashboardTab] = useState("traders");
  const [discoverTopTab, setDiscoverTopTab] = useState("strategies");
  const [selectedStrategy, setSelectedStrategy] = useState(null); // [ADDED] Strategy detail modal selection
  const [strategyDetailTab, setStrategyDetailTab] = useState("overview"); // [ADDED] Strategy detail modal tab
  const [strategyTimeframe, setStrategyTimeframe] = useState("ALL"); // [ADDED] Strategy performance chart timeframe
  const [discoverFilter, setDiscoverFilter] = useState("All");
  const [showDiscoverFilter, setShowDiscoverFilter] = useState(false);
  const [discoverCriteria, setDiscoverCriteria] = useState({ minWinRate: "0", minAge: "0", minTrades: "0", minReturn: "0", risk: "All", sort: "popular" });
  const [selectedTrader, setSelectedTrader] = useState("tradewiz");
  const [traderReturnTo, setTraderReturnTo] = useState("dashboard");
  const [traderProfileTab, setTraderProfileTab] = useState("trades");
  const [traderTradeFilter, setTraderTradeFilter] = useState("open");
  const [traderStrategyFilter, setTraderStrategyFilter] = useState("active");
  const [portfolioTab, setPortfolioTab] = useState("strategy"); // [MODIFIED] Default to the Strategy overview
  const [strategyFilter, setStrategyFilter] = useState("all"); // [ADDED] Filter strategies inside the Strategy tab
  const [historyFilter, setHistoryFilter] = useState("not-running"); // [ADDED] Filter portfolio strategy and wallet activity history
  const [portfolioStrategyStatus, setPortfolioStrategyStatus] = useState("active"); // [ADDED] Active/inactive strategy filter
  const searchInputRef = useRef(null);
  const pendingMarketUpdatesRef = useRef(new Map()); // [ADDED] Coalesce high-frequency ticker events before React state updates.
  const marketFlushTimerRef = useRef(null); // [ADDED] Limit ticker-driven renders to four per second.
  const marketInitialFetchRef = useRef(false); // [ADDED] Prevent repeated initial market snapshots when socket status changes.

  useEffect(() => {
    const savedProfileName = window.localStorage.getItem("beanance-profile-name");
    const savedProfileEmail = window.localStorage.getItem("beanance-profile-email");
    const savedProfilePhoto = window.localStorage.getItem("beanance-profile-photo");
    if (savedProfileName) setProfileName(savedProfileName);
    if (savedProfileEmail) setProfileEmail(savedProfileEmail);
    if (savedProfilePhoto) setProfilePhoto(savedProfilePhoto);
  }, []);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("beanance-theme");
    const initialTheme = savedTheme === "light" || savedTheme === "dark"
      ? savedTheme
      : document.documentElement.dataset.theme === "light" ? "light" : "dark";
    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
    setThemeReady(true);
  }, []);

  useEffect(() => {
    if (!themeReady) return;
    window.localStorage.setItem("beanance-theme", theme);
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute("content", theme === "light" ? "#fff9e8" : "#090909");
  }, [theme, themeReady]);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("beanance-language");
    if (supportedLanguages.some((item) => item.code === savedLanguage)) setLanguage(savedLanguage);
    setLanguageReady(true);
  }, []);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  useEffect(() => {
    if (!languageReady) return;
    window.localStorage.setItem("beanance-language", language);
    document.documentElement.lang = language;
    translator.changeLanguage(language); // [ADDED] Update the shared translation engine across all rendered pages.
  }, [language, languageReady]);

  // [ADDED] Keep one page-level WebSocket for live ticker and selected-market detail updates.
  useEffect(() => {
    let activeSocket = true;
    let socket = null;
    let reconnectTimer = null;
    let reconnectDelay = 1000;

    const connect = () => {
      if (!activeSocket) return;
      const configuredUrl = process.env.NEXT_PUBLIC_MARKET_WS_URL;
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const socketUrl = configuredUrl || protocol + "//" + window.location.host + "/ws/market";

      try {
        socket = new WebSocket(socketUrl);
      } catch {
        reconnectTimer = window.setTimeout(connect, reconnectDelay);
        reconnectDelay = Math.min(reconnectDelay * 2, 15000);
        return;
      }

      socket.onopen = () => {
        if (!activeSocket) return;
        reconnectDelay = 1000;
        setMarketConnectionStatus("connecting");
        if (active === "market-detail" && selectedMarket?.symbol) {
          socket.send(JSON.stringify({
            type: "market.detail.subscribe",
            symbol: selectedMarket.symbol + "USDT",
            streams: ["depth20@100ms", "aggTrade", "kline_" + marketTimeframe],
          }));
        }
      };

      socket.onmessage = (event) => {
        if (!activeSocket) return;
        let message;
        try {
          message = JSON.parse(event.data);
        } catch {
          return;
        }

        if (message.type === "market.snapshot" && Array.isArray(message.data)) {
          if (marketFlushTimerRef.current) window.clearTimeout(marketFlushTimerRef.current);
          marketFlushTimerRef.current = null;
          pendingMarketUpdatesRef.current.clear();
          const nextMarkets = message.data.map((item) => mapLiveMarketAsset(item, languageRef.current));
          if (nextMarkets.length) {
            setLiveMarketAssets(nextMarkets);
            setSelectedMarket((current) => current
              ? nextMarkets.find((asset) => asset.symbol === current.symbol) || current
              : current);
          }
          setMarketConnectionStatus("live");
          return;
        }

        if (message.type === "market.top-movers" && Array.isArray(message.data?.events)) {
          setLiveTopMoverEvents(message.data.events.map((item) => mapLiveTopMover(item, languageRef.current)));
          setMarketConnectionStatus("live");
          return;
        }

        if (message.type === "market.ticker" && message.data) {
          const updatedAsset = mapLiveMarketAsset(message.data, languageRef.current);
          pendingMarketUpdatesRef.current.set(updatedAsset.symbol, updatedAsset);
          if (marketFlushTimerRef.current === null) {
            marketFlushTimerRef.current = window.setTimeout(() => {
              const updates = new Map(pendingMarketUpdatesRef.current);
              pendingMarketUpdatesRef.current.clear();
              marketFlushTimerRef.current = null;
              if (!updates.size) return;
              setLiveMarketAssets((current) => current.map((asset) => updates.get(asset.symbol) || asset));
              setSelectedMarket((current) => current ? updates.get(current.symbol) || current : current);
            }, 250);
          }
          setMarketConnectionStatus("live");
          return;
        }

        if (
          message.type === "market.detail.kline" &&
          message.symbol === (selectedMarket?.symbol || "") + "USDT"
        ) {
          window.dispatchEvent(new CustomEvent("beanance:market-kline", { detail: message }));
          return;
        }

        if (
          message.type === "market.detail.depthUpdate" &&
          message.symbol === (selectedMarket?.symbol || "") + "USDT"
        ) {
          setMarketOrderBook({
            bids: Array.isArray(message.data?.bids) ? message.data.bids : [],
            asks: Array.isArray(message.data?.asks) ? message.data.asks : [],
          });
          setMarketDetailStatus("live");
          return;
        }

        if (
          message.type === "market.detail.aggTrade" &&
          message.symbol === (selectedMarket?.symbol || "") + "USDT"
        ) {
          const trade = message.data;
          if (trade) {
            setMarketRecentTrades((current) => [
              {
                ...trade,
                time: Number(trade.time || message.timestamp || Date.now()),
              },
              ...current,
            ].slice(0, 100));
            setMarketDetailStatus("live");
          }
        }
      };

      socket.onclose = () => {
        if (!activeSocket) return;
        setMarketConnectionStatus("offline");
        reconnectTimer = window.setTimeout(connect, reconnectDelay);
        reconnectDelay = Math.min(reconnectDelay * 2, 15000);
      };

      socket.onerror = () => {
        setMarketConnectionStatus("offline");
        socket?.close();
      };
    };

    connect();
    return () => {
      activeSocket = false;
      if (reconnectTimer) window.clearTimeout(reconnectTimer);
      if (marketFlushTimerRef.current) window.clearTimeout(marketFlushTimerRef.current);
      marketFlushTimerRef.current = null;
      pendingMarketUpdatesRef.current.clear();
      if (socket && socket.readyState === WebSocket.OPEN && active === "market-detail" && selectedMarket?.symbol) {
        socket.send(JSON.stringify({
          type: "market.detail.unsubscribe",
          symbol: selectedMarket.symbol + "USDT",
          streams: ["depth20@100ms", "aggTrade", "kline_" + marketTimeframe],
        }));
      }
      socket?.close();
    };
  }, [active, selectedMarket?.symbol, marketTimeframe]);

  // [ADDED] Load the selected market's REST snapshots before applying realtime updates.
  useEffect(() => {
    if (active !== "market-detail" || !selectedMarket?.symbol) return undefined;

    let activeRequest = true;
    const controller = new AbortController();
    const symbol = selectedMarket.symbol + "USDT";
    setMarketDetailStatus("loading");
    setMarketDetailError("");
    setMarketOrderBook({ bids: [], asks: [] });
    setMarketRecentTrades([]);
    setMarketMetrics(null);
    setMarketDailyCandles([]);

    const loadDetails = async () => {
      try {
        const [depthResponse, tradesResponse, metricsResponse, dailyResponse] = await Promise.all([
          fetch("/market-api/futures/" + encodeURIComponent(symbol) + "/depth?limit=20", { cache: "no-store", signal: controller.signal }),
          fetch("/market-api/futures/" + encodeURIComponent(symbol) + "/trades?limit=50", { cache: "no-store", signal: controller.signal }),
          fetch("/market-api/futures/" + encodeURIComponent(symbol) + "/metrics", { cache: "no-store", signal: controller.signal }),
          fetch("/market-api/futures/" + encodeURIComponent(symbol) + "/klines?interval=1d&limit=366", { cache: "no-store", signal: controller.signal }),
        ]);

        if (!depthResponse.ok || !tradesResponse.ok || !metricsResponse.ok) {
          throw new Error("Market detail API returned an unsuccessful response");
        }

        const [depthPayload, tradesPayload, metricsPayload, dailyPayload] = await Promise.all([
          depthResponse.json(),
          tradesResponse.json(),
          metricsResponse.json(),
          dailyResponse.ok ? dailyResponse.json() : Promise.resolve({ success: false, data: [] }),
        ]);

        if (!activeRequest) return;

        if (depthPayload.success && depthPayload.data) {
          setMarketOrderBook({
            bids: Array.isArray(depthPayload.data.bids) ? depthPayload.data.bids : [],
            asks: Array.isArray(depthPayload.data.asks) ? depthPayload.data.asks : [],
          });
        }

        if (tradesPayload.success && Array.isArray(tradesPayload.data)) {
          setMarketRecentTrades(tradesPayload.data.map((trade) => ({
            ...trade,
            time: Number(trade.time || Date.now()),
          })));
        }

        if (metricsPayload.success && metricsPayload.data) {
          setMarketMetrics(metricsPayload.data);
        }

        if (dailyPayload.success && Array.isArray(dailyPayload.data)) {
          setMarketDailyCandles(dailyPayload.data
            .map((candle) => ({ openTime: Number(candle.openTime), close: Number(candle.close) }))
            .filter((candle) => Number.isFinite(candle.openTime) && Number.isFinite(candle.close))
            .sort((a, b) => a.openTime - b.openTime));
        }

        setMarketDetailStatus("live");
      } catch (error) {
        if (activeRequest && error.name !== "AbortError") {
          setMarketDetailStatus("offline");
          setMarketDetailError(error.message || "Gagal mengambil detail market.");
        }
      }
    };

    loadDetails();
    return () => {
      activeRequest = false;
      controller.abort();
    };
  }, [active, selectedMarket?.symbol]);

  // [MODIFIED] Fetch one REST snapshot, then poll with backoff only while the market socket is offline.
  useEffect(() => {
    let activeRequest = true;
    let refreshTimer = null;
    const controller = new AbortController();
    let retryDelay = 10000;

    const refreshMarketData = async () => {
      if (document.hidden) return;
      try {
        const [marketsResponse, moversResponse] = await Promise.all([
          fetch("/market-api/futures?sort=quoteVolume&order=desc", { cache: "no-store", signal: controller.signal }),
          fetch("/market-api/top-movers?limit=20", { cache: "no-store", signal: controller.signal }),
        ]);
        if (!marketsResponse.ok || !moversResponse.ok) throw new Error("Market API returned an unsuccessful response");
        const [marketsPayload, moversPayload] = await Promise.all([marketsResponse.json(), moversResponse.json()]);
        if (!activeRequest) return;

        const nextMarkets = Array.isArray(marketsPayload.data) ? marketsPayload.data.map((item) => mapLiveMarketAsset(item, languageRef.current)) : [];
        if (nextMarkets.length) {
          setLiveMarketAssets(nextMarkets);
          setSelectedMarket((current) => current
            ? nextMarkets.find((asset) => asset.symbol === current.symbol) || current
            : current);
        }
        const moverEvents = Array.isArray(moversPayload.data?.events)
          ? moversPayload.data.events.map((item) => mapLiveTopMover(item, languageRef.current))
          : [];
        setLiveTopMoverEvents(moverEvents);
        retryDelay = 10000;
      } catch (error) {
        if (activeRequest && error.name !== "AbortError") {
          setMarketConnectionStatus((current) => current === "live" ? current : "offline");
          retryDelay = Math.min(retryDelay * 2, 60000);
        }
      }
    };

    if (!marketInitialFetchRef.current) {
      marketInitialFetchRef.current = true;
      refreshMarketData();
    }

    const scheduleFallback = () => {
      if (!activeRequest || marketConnectionStatus === "live" || document.hidden) return;
      refreshTimer = window.setTimeout(async () => {
        await refreshMarketData();
        scheduleFallback();
      }, retryDelay);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        if (refreshTimer) window.clearTimeout(refreshTimer);
        refreshTimer = null;
      } else if (marketConnectionStatus !== "live") {
        if (refreshTimer) window.clearTimeout(refreshTimer);
        refreshMarketData();
        scheduleFallback();
      }
    };

    if (marketConnectionStatus !== "live") scheduleFallback();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      activeRequest = false;
      controller.abort();
      if (refreshTimer) window.clearTimeout(refreshTimer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [marketConnectionStatus]);


  const t = (value, options = {}) => translate(translationKeys[value] || value, { defaultValue: value, ...options }); // [MODIFIED] Use the shared i18next catalog instead of a local-only lookup.
  const sidebarText = sidebarTranslations[language] || sidebarTranslations.en;
  const selectedLanguage = supportedLanguages.find((item) => item.code === language) || supportedLanguages[0];



  const toggleTheme = () => setTheme((current) => current === "dark" ? "light" : "dark");

  // [ADDED] Open a centered detail modal for the selected Discover strategy.
  const openStrategy = (strategy) => {
    const owner = String(strategy.user || strategy.owner || "@tradewiz").replace(/^@/, "").toLowerCase();
    const ownerProfile = traderProfiles[owner] || traderProfiles.tradewiz;
    const returnValue = Number(String(strategy.returns || ownerProfile.returns).replace(/[+%]/g, ""));
    const initialBalance = Number(strategy.initialBalance || 1000);
    setSelectedStrategy({
      ...strategy,
      owner,
      ownerName: ownerProfile.name,
      ownerFollowers: ownerProfile.followers,
      ownerBio: ownerProfile.bio,
      returns: strategy.returns || ownerProfile.returns,
      win: strategy.win || ownerProfile.win,
      trades: strategy.trades || Number(String(ownerProfile.trades).replace(/,/g, "")),
      age: strategy.age || Number(String(ownerProfile.age).split(" ")[0]),
      initialBalance,
      currentBalance: strategy.currentBalance || initialBalance * (1 + returnValue / 100),
      aum: strategy.aum || (owner === "cryptofox" ? 68200 : owner === "moontrade" ? 31500 : owner === "quantalab" ? 18400 : 48250),
      copiers: strategy.copiers || (owner === "cryptofox" ? 128 : owner === "moontrade" ? 74 : owner === "quantalab" ? 39 : 96),
      pair: strategy.pair || `${strategy.symbol || "BTC"}/USDT`,
      risk: strategy.risk || "Medium Risk",
      type: strategy.type || "Trend Following",
      maxDrawdown: strategy.maxDrawdown || (owner === "cryptofox" ? "-8.6%" : owner === "moontrade" ? "-15.2%" : "-12.8%"),
      profitFactor: strategy.profitFactor || (owner === "cryptofox" ? "2.18" : owner === "moontrade" ? "1.92" : "2.45"),
      sharpe: strategy.sharpe || "1.85",
      avgWin: strategy.avgWin || "+3.2%",
      avgLoss: strategy.avgLoss || "-1.4%",
      leverage: strategy.leverage || "Up to 5x",
      status: strategy.status || "active",
    });
    setStrategyDetailTab("overview");
    setStrategyTimeframe("ALL");
  };

  const closeStrategy = () => setSelectedStrategy(null);

  useEffect(() => {
    if (!selectedStrategy) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeStrategy();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedStrategy]);

  const openTrader = (username) => {
    const normalized = String(username || "").replace(/^@/, "").toLowerCase();
    setSelectedTrader(traderProfiles[normalized] ? normalized : "tradewiz");
    setTraderReturnTo(active === "trader-profile" ? traderReturnTo : active);
    setActive("trader-profile");
    setSearchOpen(false);
    setSearchQuery("");
    setShowNotifications(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const closeTraderProfile = () => {
    setActive(traderReturnTo);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const selectTab = (item) => {
    if (item.id === "edit-profile") {
      setActive("edit-profile");
      setSearchOpen(false);
      setSearchQuery("");
      setShowNotifications(false);
      setSidebarOpen(false);
      return;
    }
    if (item.id === "create") {
      setShowCreate(true);
      return;
    }
    setActive(item.id);
    setSearchOpen(false);
    setSearchQuery("");
    setShowNotifications(false);
  };

  const handleProfilePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setNotice("Please choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setNotice("Profile photo must be 5 MB or smaller");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setProfilePhoto(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const saveProfile = (event) => {
    event.preventDefault();
    const cleanName = profileName.trim();
    if (!cleanName) {
      setNotice("Username cannot be empty");
      return;
    }
    window.localStorage.setItem("beanance-profile-name", cleanName);
    window.localStorage.setItem("beanance-profile-photo", profilePhoto);
    setProfileName(cleanName);
    setNotice("Profile updated on this device");
    window.setTimeout(() => setNotice(""), 2200);
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
      setNotice("Wallet address copied");
      window.setTimeout(() => setNotice(""), 2200);
    } catch {
      setNotice("Clipboard is not available");
      window.setTimeout(() => setNotice(""), 2200);
    }
  };

  return (
    <main className={`app-shell ${theme === "light" ? "theme-light" : "theme-dark"}`}>
      <div className="app-content">
        {active !== "edit-profile" && active !== "help-center" && active !== "about" && active !== "market-detail" && <header style={active === "profile" ? { display: "none" } : undefined} className={`topbar ${searchOpen ? "search-expanded" : ""} ${active === "trader-profile" ? "trader-profile-topbar-hidden" : ""} ${active === "profile" ? "portfolio-topbar-hidden" : ""}`}>
          {active !== "trader-profile" && (
            <button className="icon-button sidebar-trigger" type="button" aria-label="Open navigation menu" aria-expanded={sidebarOpen} onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
          )}
          {active === "trader-profile" ? (
            <div className="trader-profile-header-placeholder" />
          ) : (
            <div className={`nav-greeting navbar-greeting-hidden ${active === "dapps" ? "discover-greeting-hidden" : ""}`}>
              <p className="eyebrow">{active === "profile" ? t("YOUR PORTFOLIO") : t("GOOD EVENING")}</p>
              <strong>{active === "profile" ? t("Portfolio overview") : t("Welcome back, {{name}}", { name: profileName })}</strong>
            </div>
          )}
          {active === "dapps" && (
            <div className={`discover-nav-tabs ${searchOpen ? "is-hidden" : ""}`} role="tablist" aria-label={t("Discover category")}>
              <button className={discoverTopTab === "strategies" ? "selected" : ""} onClick={() => {setDiscoverTopTab("strategies");setDiscoverFilter("All");}}>{t("Strategies")}</button>
              <button className={discoverTopTab === "traders" ? "selected" : ""} onClick={() => {setDiscoverTopTab("traders");setDiscoverFilter("All");}}>{t("Traders")}</button>
            </div>
          )}
          {active === "market" && (
            <div className={`discover-nav-tabs market-nav-tabs ${searchOpen ? "is-hidden" : ""}`} role="tablist" aria-label={t("Market sections")}>
              <button type="button" role="tab" aria-selected={marketNavTab === "all-market"} className={marketNavTab === "all-market" ? "selected" : ""} onClick={() => setMarketNavTab("all-market")}>{t("All Market")}</button>
              <button type="button" role="tab" aria-selected={marketNavTab === "top-movers"} className={marketNavTab === "top-movers" ? "selected" : ""} onClick={() => setMarketNavTab("top-movers")}>{t("Top Movers")}</button>
            </div>
          )}
          <div className="top-actions">

        {active === "dashboard" && (
              <div className="notification-wrap">
                <button className="icon-button notification-button" aria-label={t("Notifications")} aria-expanded={showNotifications} onClick={() => setShowNotifications((current) => !current)}>
                  <Bell size={19} />
                  <i />
                </button>
                {showNotifications && (
                  <div className="notification-popover">
                    <div className="notification-heading"><strong>{t("Notifications")}</strong><button onClick={() => setShowNotifications(false)} aria-label="Close notifications"><X size={16} /></button></div>
                    <div className="notification-item unread"><span className="notification-dot" /><div><strong>{t("Wallet connected")}</strong><p>{t("Your demo wallet is ready to use.")}</p><small>{t("Just now")}</small></div></div>
                    <div className="notification-item"><span className="notification-symbol"><ArrowUpRight size={17} strokeWidth={1.75} /></span><div><strong>{t("Market update")}</strong><p>{t("Bitcoin is up 2.45% in the demo market.")}</p><small>{t("12 minutes ago")}</small></div></div>
                    <div className="notification-item"><span className="notification-symbol"><Sparkles size={17} strokeWidth={1.75} /></span><div><strong>{t("Welcome to Beanance")}</strong><p>{t("Explore assets and discover Web3 apps.")}</p><small>{t("Today")}</small></div></div>
                    <button className="notification-footer" onClick={() => setShowNotifications(false)}>{t("Mark all as read")}</button>
                  </div>
                )}
              </div>
            )}
            {(active === "dapps" || active === "market") && (
              <div className={`header-search ${searchOpen ? "is-open" : ""}`}>
                <Search size={18} />
                <input
                  ref={searchInputRef}
                  aria-label={active === "dapps" ? t("Search strategies and traders") : t("Search market assets")}
                  placeholder={active === "dapps" ? t("Search strategies or traders...") : t("Search assets...")}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => { if (event.key === "Escape") { setSearchOpen(false); setSearchQuery(""); } }}
                  tabIndex={searchOpen ? 0 : -1}
                />
                {searchOpen && <button className="search-close" onClick={() => { setSearchOpen(false); setSearchQuery(""); }} aria-label={t("Close search")}><X size={17} /></button>}
                {!searchOpen && <button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label={t("Open search")} />}
              </div>
            )}
            {active !== "profile" && (
              <button className="icon-button theme-toggle" aria-label={theme === "dark" ? t("Switch to light mode") : t("Switch to dark mode")} onClick={toggleTheme}>
                {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
              </button>
            )}
          </div>
        </header>}

            {active === "help-center" && (
          <section className="page page-enter help-center-page">
            <div className="help-center-topline">
              <button type="button" className="help-center-back" onClick={() => {setActive(helpReturnTo);setHelpSearch("");setHelpCategory("All");}} aria-label={t("Back")}>
                <ArrowLeft size={19}/>
              </button>
              <div className="help-center-brand">
                <span className="help-center-brand-icon"><Headset size={23}/></span>
                <div><strong>Help Center</strong><small>Beanance Support</small></div>
              </div>
            </div>

            <section className="help-center-hero">
              <div className="help-center-hero-copy">
                <h1>How can we <span>help you?</span></h1>
                <p>Find answers, explore guides, or get support from our team.</p>
              </div>
              <div className="help-center-hero-art"><MessageCircle size={76}/><span>•••</span></div>
            </section>

            <label className="help-center-search">
              <Search size={21}/>
              <input type="search" value={helpSearch} onChange={(event) => {setHelpSearch(event.target.value);setHelpCategory("All");}} placeholder="Search for help, guides, or topics..." aria-label="Search help articles"/>
              {helpSearch && <button type="button" onClick={() => setHelpSearch("")} aria-label="Clear search"><X size={17}/></button>}
            </label>

            <section className="help-center-categories" aria-label="Help categories">
              {[
                {name:"Getting Started",description:"Set up and start using Beanance",icon:Rocket},
                {name:"Account & Security",description:"Profile, login, and account safety",icon:UserRound},
                {name:"Wallet & Assets",description:"Wallet, deposits, and assets",icon:Wallet},
                {name:"Markets & Trading",description:"Markets, orders, and trading",icon:CandlestickChart},
                {name:"Copy Trading",description:"Copy strategies from top traders",icon:Layers},
                {name:"Strategies & Traders",description:"Create, manage, and follow strategies",icon:Users},
                {name:"Portfolio",description:"Track your performance",icon:BarChart3},
                {name:"Troubleshooting",description:"Common issues and solutions",icon:AlertTriangle}
              ].map((category) => {
                const CategoryIcon=category.icon;
                return (
                  <button type="button" key={category.name} className={helpCategory===category.name ? "help-category-card selected" : "help-category-card"} onClick={() => {setHelpCategory(helpCategory===category.name ? "All" : category.name);setHelpSearch("");}}>
                    <span className="help-category-icon"><CategoryIcon size={25}/></span>
                    <span className="help-category-copy"><strong>{category.name}</strong><small>{category.description}</small></span>
                    <ChevronRight size={19}/>
                  </button>
                );
              })}
            </section>

            <section className="help-center-articles">
              <div className="help-center-section-heading">
                <div><h2>{helpSearch || helpCategory!=="All" ? "Help Articles" : "Popular Articles"}</h2><p>{helpSearch ? "Search results" : helpCategory!=="All" ? helpCategory : "Most frequently read by our users."}</p></div>
                {(helpSearch || helpCategory!=="All") && <button type="button" onClick={() => {setHelpSearch("");setHelpCategory("All");}}>Clear</button>}
              </div>
              {[
                {title:"How to get started with Beanance",category:"Getting Started",body:"Explore the Beanance dashboard, discover strategies, and learn where to find the tools you need. Start by completing your profile and reviewing the available sections."},
                {title:"How to secure your account",category:"Account & Security",body:"Use a unique password, keep your account details private, and only connect wallets or services you trust. Review connected accounts regularly."},
                {title:"Understanding your wallet and assets",category:"Wallet & Assets",body:"The wallet area helps you review connected wallet information and supported assets. Always verify network and address details before sending assets."},
                {title:"Understanding markets and trading",category:"Markets & Trading",body:"Review market pairs, price movements, volume, and trading information before making decisions. Market data and demo indicators may not represent live execution."},
                {title:"How Copy Trading works",category:"Copy Trading",body:"Copy Trading is designed to let users follow a strategy. Review its return, win rate, drawdown, trading history, and risk before copying. Copy execution is not yet available in this demo."},
                {title:"How to evaluate a trading strategy",category:"Strategies & Traders",body:"Compare strategy performance over time and review risk, drawdown, total trades, and trading style. Past performance does not guarantee future results."},
                {title:"Understanding your portfolio",category:"Portfolio",body:"Your portfolio brings together your strategies, wallet overview, and activity history so you can review your account from one place."},
                {title:"Troubleshooting common issues",category:"Troubleshooting",body:"If a page does not load, refresh the app and check your connection. If an issue continues, contact support and include the page name and a short description."}
              ].filter((article) => (helpCategory==="All" || article.category===helpCategory) && (!helpSearch || (article.title+" "+article.category+" "+article.body).toLowerCase().includes(helpSearch.toLowerCase()))).map((article) => (
                <details className="help-article-row" key={article.title}>
                  <summary><FileText size={19}/><span>{article.title}</span><ChevronRight size={18}/></summary>
                  <p>{article.body}</p>
                </details>
              ))}
              {[
                {title:"How to get started with Beanance",category:"Getting Started",body:"Explore the Beanance dashboard, discover strategies, and learn where to find the tools you need. Start by completing your profile and reviewing the available sections."},
                {title:"How to secure your account",category:"Account & Security",body:"Use a unique password, keep your account details private, and only connect wallets or services you trust. Review connected accounts regularly."},
                {title:"Understanding your wallet and assets",category:"Wallet & Assets",body:"The wallet area helps you review connected wallet information and supported assets. Always verify network and address details before sending assets."},
                {title:"Understanding markets and trading",category:"Markets & Trading",body:"Review market pairs, price movements, volume, and trading information before making decisions. Market data and demo indicators may not represent live execution."},
                {title:"How Copy Trading works",category:"Copy Trading",body:"Copy Trading is designed to let users follow a strategy. Review its return, win rate, drawdown, trading history, and risk before copying. Copy execution is not yet available in this demo."},
                {title:"How to evaluate a trading strategy",category:"Strategies & Traders",body:"Compare strategy performance over time and review risk, drawdown, total trades, and trading style. Past performance does not guarantee future results."},
                {title:"Understanding your portfolio",category:"Portfolio",body:"Your portfolio brings together your strategies, wallet overview, and activity history so you can review your account from one place."},
                {title:"Troubleshooting common issues",category:"Troubleshooting",body:"If a page does not load, refresh the app and check your connection. If an issue continues, contact support and include the page name and a short description."}
              ].filter((article) => (helpCategory==="All" || article.category===helpCategory) && (!helpSearch || (article.title+" "+article.category+" "+article.body).toLowerCase().includes(helpSearch.toLowerCase()))).length===0 && (
                <div className="help-center-empty"><Search size={23}/><strong>No articles found</strong><span>Try another search term or choose a different category.</span></div>
              )}
            </section>

            <section className="help-center-contact">
              <span className="help-contact-icon"><Headset size={38}/></span>
              <div><h2>Still need help?</h2><p>Our support team is here to help you anytime.</p></div>
              <button type="button" onClick={() => setNotice("Support contact is coming soon") }><MessageCircle size={17}/> Contact Support</button>
            </section>
            <p className="help-center-footnote">Beanance Help Center · Support resources</p>
          </section>
        )}

        {active === "about" && (
          <section className="page page-enter about-page">
            <div className="about-topline">
              <button type="button" className="help-center-back" onClick={() => setActive(aboutReturnTo)} aria-label={t("Back")}><ArrowLeft size={19}/></button>
              <div className="help-center-brand">
                <span className="help-center-brand-icon"><Info size={23}/></span>
                <div><strong>About Beanance</strong><small>Discover our platform</small></div>
              </div>
            </div>

            <section className="about-hero">
              <div className="about-hero-brand"><span className="about-logo-mark"><Layers size={34}/></span><strong>BEANANCE</strong></div>
              <p className="about-eyebrow">DISCOVER · CONNECT · GROW</p>
              <h1>Trade smarter.<br/><span>Build together.</span></h1>
              <p className="about-hero-description">A community-driven platform to discover traders, explore strategies, and navigate the crypto ecosystem.</p>
            </section>

            <section className="about-section">
              <div className="about-section-heading"><span>01</span><div><h2>Our Mission</h2><p>Why we are building Beanance</p></div></div>
              <p className="about-body-copy">We believe useful trading insights should be easier to discover and understand. Beanance brings traders, strategies, market information, and portfolio tools together in one place — helping the community make more informed decisions.</p>
            </section>

            <section className="about-section">
              <div className="about-section-heading"><span>02</span><div><h2>What matters to us</h2><p>The principles behind the platform</p></div></div>
              <div className="about-values-grid">
                <article className="about-value-card"><span><Users size={23}/></span><strong>Community</strong><p>Discover ideas and learn from other market participants.</p></article>
                <article className="about-value-card"><span><Activity size={23}/></span><strong>Transparency</strong><p>Make strategy performance and risk easier to review.</p></article>
                <article className="about-value-card"><span><ShieldCheck size={23}/></span><strong>Security</strong><p>Encourage careful account and wallet practices.</p></article>
                <article className="about-value-card"><span><Sparkles size={23}/></span><strong>Innovation</strong><p>Keep improving tools for the evolving crypto ecosystem.</p></article>
              </div>
            </section>

            <section className="about-section">
              <div className="about-section-heading"><span>03</span><div><h2>One platform, connected tools</h2><p>Explore the Beanance experience</p></div></div>
              <div className="about-feature-list">
                <div><span><Compass size={20}/></span><div><strong>Discover</strong><p>Explore traders and community strategies.</p></div></div>
                <div><span><BarChart3 size={20}/></span><div><strong>Markets</strong><p>Review market movements and asset information.</p></div></div>
                <div><span><Wallet size={20}/></span><div><strong>Portfolio</strong><p>Keep an eye on your strategies and portfolio activity.</p></div></div>
                <div><span><Layers size={20}/></span><div><strong>Strategy insights</strong><p>Review strategy metrics, trading style, and risk indicators.</p></div></div>
              </div>
            </section>

            <section className="about-disclaimer">
              <ShieldCheck size={21}/>
              <p>Crypto markets involve risk. Information and performance indicators on the platform are for informational purposes and should not be treated as financial advice or a guarantee of future results.</p>
            </section>

            <section className="about-platform-info">
              <h2>Platform Information</h2>
              <div><span>Platform</span><strong>Beanance</strong></div>
              <div><span>Category</span><strong>Crypto & Web3</strong></div>
              <div><span>Purpose</span><strong>Trading discovery & insights</strong></div>
              <div><span>Legal</span><button type="button" onClick={() => setNotice("Legal documents are coming soon")}>Terms & Privacy <ChevronRight size={15}/></button></div>
            </section>
            <p className="about-footer">© 2026 Beanance. Built for the crypto community.</p>
          </section>
        )}

        {active === "dashboard" && (
          <section className="page page-enter dashboard-page">
            <section className="dashboard-section">
              <div className="section-heading dashboard-section-heading">
                <div><h2>{t("Top Strategies")}</h2><p className="muted">{t("Best performing strategies from our community")}</p></div>
                <button className="text-link" onClick={() => selectTab({ id: "dapps" })}>{t("See All")} <ChevronRight size={15} /></button>
              </div>
              <div className="strategy-grid">
                {[
                  {name:"BTC Trend Master",user:"@tradewiz",symbol:"BTC",tone:"bitcoin",returns:"+124.5%",win:"68%",type:"Trend Following",risk:"Medium Risk",riskTone:"medium",chart:"M2 40 L18 31 L34 35 L50 23 L66 29 L82 19 L98 27 L114 17 L130 23 L146 12 L162 18 L178 9 L194 16 L210 5 L226 12 L242 3 L258 10 L274 0"},
                  {name:"Scalping AI v2",user:"@cryptofox",symbol:"ETH",tone:"ethereum",returns:"+89.2%",win:"72%",type:"Scalping",risk:"Low Risk",riskTone:"low",chart:"M2 42 L18 35 L34 38 L50 28 L66 31 L82 20 L98 26 L114 18 L130 22 L146 13 L162 18 L178 8 L194 13 L210 5 L226 10 L242 2 L258 7 L274 -1"},
                  {name:"ETH Breakout",user:"@moontrade",symbol:"SOL",tone:"solana",returns:"+68.1%",win:"63%",type:"Breakout",risk:"Medium Risk",riskTone:"medium",chart:"M2 43 L18 35 L34 39 L50 29 L66 34 L82 24 L98 29 L114 19 L130 24 L146 14 L162 20 L178 10 L194 15 L210 7 L226 12 L242 3 L258 8 L274 -2"}
                ].map((strategy) => (
                  <article className="strategy-card" key={strategy.name} role="button" tabIndex={0} aria-label={`View ${strategy.name} strategy details`} onClick={() => openStrategy(strategy)} onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); openStrategy(strategy); } }}>
                    <div className="strategy-card-head">
                      <div className={`strategy-coin ${strategy.tone}`}><Layers size={21} strokeWidth={1.75} /></div>
                      <div className="strategy-identity"><strong>{strategy.name}</strong><button className="strategy-owner-link" onClick={(event) => { event.stopPropagation(); openTrader(strategy.user); }}>{strategy.user}</button></div>
                      <button className="strategy-more" aria-label={`More about ${strategy.name}`} onClick={(event) => { event.stopPropagation(); openStrategy(strategy); }}>•••</button>
                    </div>
                    <svg className="strategy-chart" viewBox="0 0 276 48" preserveAspectRatio="none" aria-label="Strategy performance chart">
                      <defs><linearGradient id={`strategy-fill-${strategy.name.replaceAll(" ","-")}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#20c56a" stopOpacity=".24"/><stop offset="100%" stopColor="#20c56a" stopOpacity="0"/></linearGradient></defs>
                      <path d={`${strategy.chart} L274 48 L2 48 Z`} fill={`url(#strategy-fill-${strategy.name.replaceAll(" ","-")})`}/>
                      <path d={strategy.chart} fill="none" stroke="#20bd68" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                    </svg>
                    <div className="strategy-metrics"><div><strong className="positive">{strategy.returns}</strong><span>{t("Total Return")}</span></div><div><strong>{strategy.win}</strong><span>{t("Win Rate")}</span></div></div>
                    <div className="strategy-card-footer"><span className="strategy-tag">{t(strategy.type)}</span><span className={`risk-tag risk-${strategy.riskTone}`}>{t(strategy.risk)}</span><button onClick={(event) => { event.stopPropagation(); setNotice(`Copy trading for ${strategy.name} is coming soon`); }}>{t("Copy")}</button></div>
                  </article>
                ))}
              </div>
            </section>

            <div className="mobile-dashboard-tabs" role="tablist" aria-label={t("Dashboard data")}>
              <button role="tab" aria-selected={mobileDashboardTab === "traders"} className={mobileDashboardTab === "traders" ? "selected" : ""} onClick={() => setMobileDashboardTab("traders")}>{t("Top Traders")}</button>
              <button role="tab" aria-selected={mobileDashboardTab === "market"} className={mobileDashboardTab === "market" ? "selected" : ""} onClick={() => setMobileDashboardTab("market")}>{t("Market Overview")}</button>
            </div>
            <section className={`dashboard-section mobile-tab-panel mobile-traders-panel ${mobileDashboardTab === "traders" ? "mobile-tab-active" : ""}`}>
              <div className="section-heading dashboard-section-heading traders-heading">
                <div><h2>{t("Top Traders")}</h2><p className="muted">{t("Most consistent and successful traders")}</p></div>
                <div className="section-tools"><div className="period-tabs">{["All","1M","3M","6M","1Y"].map((period) => <button className={traderPeriod === period ? "selected" : ""} key={period} onClick={() => setTraderPeriod(period)}>{period}</button>)}</div><button className="text-link" onClick={() => {setDiscoverTopTab("traders");selectTab({ id: "dapps" });}}>{t("See All")} <ChevronRight size={15} /></button></div>
              </div>
              <div className="dashboard-table-wrap">
                <table className="dashboard-table trader-table">
                  <thead><tr><th>#</th><th>{t("Trader")}</th><th>{t("Followers")}</th><th>{t("Return (30D)")}</th><th>{t("Win Rate")}</th><th>{t("Equity Curve")}</th><th>{t("Action")}</th></tr></thead>
                  <tbody>
                    {[
                      ["tradewiz","342","+124.5%","68%"],
                      ["cryptofox","1.2K","+89.2%","72%"],
                      ["moontrade","856","+68.1%","63%"],
                      ["quantalab","432","+54.3%","58%",""],
                      ["solking","321","+48.7%","61%",""]
                    ].map((trader,index) => <tr key={trader[0]}><td><span className="rank-cell">{index+1}</span></td><td><button className="trader-name trader-name-button" onClick={() => openTrader(trader[0])}><span className={`trader-avatar trader-avatar-${index+1}`}>{["T","C","M","Q","S"][index]}</span><strong>{trader[0]}</strong><BadgeCheck className="verified-mark" size={15} strokeWidth={1.75} aria-label="Verified" /></button></td><td>{trader[1]}</td><td className="positive">{trader[2]}</td><td>{trader[3]}</td><td><svg className="table-sparkline" viewBox="0 0 110 28" preserveAspectRatio="none"><path d="M1 24 L10 19 L18 21 L27 13 L36 16 L45 10 L54 13 L63 8 L72 11 L81 5 L90 8 L100 2 L109 4" fill="none" stroke="#20bd68" strokeWidth="1.8"/></svg></td><td><button className="table-follow" onClick={() => setNotice(`Following @${trader[0]} is a demo action`)}>{t("Follow")}</button></td></tr>)}
                  </tbody>
                </table>
              </div>
            </section>

            <section className={`dashboard-section market-overview-section mobile-tab-panel mobile-market-panel ${mobileDashboardTab === "market" ? "mobile-tab-active" : ""}`}>
              <div className="section-heading dashboard-section-heading">
                <div><h2>{t("Market Overview")}</h2><p className="muted">{t("Top futures pairs by volume")} <span className={`market-feed-status ${marketConnectionStatus}`}>{marketConnectionStatus === "live" ? "● Live" : marketConnectionStatus === "stale" ? "● Stale" : marketConnectionStatus === "offline" ? "● Offline" : "● Connecting"}</span></p></div>
                <div className="section-tools"><div className="period-tabs market-tabs">{["Favorites","All","Futures","Crypto"].map((filter) => <button className={marketFilter === filter ? "selected" : ""} key={filter} onClick={() => setMarketFilter(filter)}>{filter}</button>)}</div><button className="text-link" onClick={() => setActive("market")}>{t("See All")} <ChevronRight size={15} /></button></div>
              </div>
              <div className="dashboard-table-wrap">
                <table className="dashboard-table market-table">
                  <thead><tr><th>#</th><th>{t("Pair")}</th><th>{t("Price")}</th><th>{t("24h Change")}</th><th>{t("24h Volume")}</th><th>{t("Chart")}</th><th><Star size={15} strokeWidth={1.75} aria-label="Favorites" /></th></tr></thead>
                  <tbody>
                    {/* [MODIFIED] Show the five highest-volume live markets in the compact dashboard preview. */}
                    {liveMarketAssets.filter((asset) => marketFilter !== "Favorites" || ["BTC","BNB"].includes(asset.symbol)).slice(0, 5).map((asset,index) => <tr key={asset.symbol} className="market-clickable-row" onClick={() => {setSelectedMarket(asset);setMarketDetailTab("price");setActive("market-detail");window.scrollTo({top:0,behavior:"instant"});}}><td>{index+1}</td><td><div className={"market-pair"}><span className={"asset-icon "+asset.tone}><CoinLogo symbol={asset.symbol} /></span><div><strong>{asset.symbol}USDT</strong><small>{asset.symbol}</small></div></div></td><td>{asset.price.replace("$","")}</td><td className={asset.positive ? "positive" : "negative"}>{asset.change}</td><td>{asset.volume}</td><td><svg className="table-sparkline" viewBox="0 0 110 28" preserveAspectRatio="none"><path d={asset.positive ? "M1 24 L10 19 L18 21 L27 13 L36 16 L45 10 L54 13 L63 8 L72 11 L81 5 L90 8 L100 2 L109 4" : "M1 3 L10 8 L18 5 L27 12 L36 9 L45 15 L54 12 L63 18 L72 15 L81 21 L90 18 L100 25 L109 23"} fill="none" stroke={asset.positive ? "#20bd68" : "#e45b5b"} strokeWidth="1.8"/></svg></td><td><button className="favorite-star" onClick={(event) => {event.stopPropagation();setNotice(asset.symbol+" favorites are demo only");}}><Star size={16} strokeWidth={1.75} /></button></td></tr>)}</tbody>
                </table>
              </div>
            </section>
          </section>
        )}

        {active === "dapps" && (
          <section className="page page-enter simple-page discover-page">
            <section className="discover-top-section">
              <div className="discover-podium">
                {(discoverTopTab === "strategies" ? [
                  {rank:2,name:"BTC Trend Master",user:"@tradewiz",metric:"+124.5%",detail:"Total return",avatar:"BTC",tone:"bitcoin"},
                  {rank:1,name:"Scalping AI v2",user:"@cryptofox",metric:"+89.2%",detail:"Total return",avatar:"ETH",tone:"ethereum"},
                  {rank:3,name:"ETH Breakout",user:"@moontrade",metric:"+68.1%",detail:"Total return",avatar:"SOL",tone:"solana"}
                ] : [
                  {rank:2,name:"cryptofox",user:"1.2K followers",metric:"+89.2%",detail:"30D return",avatar:"C",tone:"trader-avatar-2"},
                  {rank:1,name:"tradewiz",user:"342 followers",metric:"+124.5%",detail:"30D return",avatar:"T",tone:"trader-avatar-1"},
                  {rank:3,name:"moontrade",user:"856 followers",metric:"+68.1%",detail:"30D return",avatar:"M",tone:"trader-avatar-3"}
                ]).map((item) => (
                  <article className={`discover-podium-card podium-rank-${item.rank}`} key={item.name} role={discoverTopTab === "strategies" ? "button" : undefined} tabIndex={discoverTopTab === "strategies" ? 0 : undefined} onClick={() => { if (discoverTopTab === "strategies") openStrategy({ ...item, type: item.name === "Scalping AI v2" ? "Scalping" : item.name === "ETH Breakout" ? "Breakout" : "Trend Following", risk: item.name === "Scalping AI v2" ? "Low Risk" : "Medium Risk", win: item.name === "BTC Trend Master" ? "68%" : item.name === "Scalping AI v2" ? "72%" : "63%", trades: item.name === "BTC Trend Master" ? 680 : item.name === "Scalping AI v2" ? 1240 : 310, age: item.name === "BTC Trend Master" ? 240 : item.name === "Scalping AI v2" ? 120 : 75, symbol: item.avatar }); }} onKeyDown={(event) => { if (discoverTopTab === "strategies" && event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); openStrategy({ ...item, type: item.name === "Scalping AI v2" ? "Scalping" : item.name === "ETH Breakout" ? "Breakout" : "Trend Following", risk: item.name === "Scalping AI v2" ? "Low Risk" : "Medium Risk", win: item.name === "BTC Trend Master" ? "68%" : item.name === "Scalping AI v2" ? "72%" : "63%", trades: item.name === "BTC Trend Master" ? 680 : item.name === "Scalping AI v2" ? 1240 : 310, age: item.name === "BTC Trend Master" ? 240 : item.name === "Scalping AI v2" ? 120 : 75, symbol: item.avatar }); } }}>
                    <span className="podium-rank">{item.rank}</span>
                    <div className={`discover-avatar ${item.tone}`}>{discoverTopTab === "strategies" ? <Layers size={21} strokeWidth={1.75} /> : item.tone.startsWith("trader-avatar") ? item.avatar : <CoinLogo symbol={item.tone === "bitcoin" ? "BTC" : item.tone === "ethereum" ? "ETH" : "SOL"} />}</div>
                    <strong>{item.name}</strong>
                    <small>{item.user}</small>
                    <b className="positive">{item.metric}</b>
                    <span className="podium-detail">{t(item.detail)}</span>
                    <button onClick={(event) => { event.stopPropagation(); if (discoverTopTab === "strategies") setNotice(`Copy trading for ${item.name} is coming soon`); else openTrader(item.name); }}>{discoverTopTab === "strategies" ? t("Copy") : t("View profile")}</button>
                  </article>
                ))}
              </div>
            </section>

            <section className="discover-list-section">
              <div className="discover-section-heading discover-list-heading">
                <div><h2>{discoverTopTab === "strategies" ? t("Explore Strategies") : t("Explore Traders")}</h2><p className="muted">{discoverTopTab === "strategies" ? t("Pilih strategi sesuai gaya trading kamu.") : t("Kenali trader dan performa mereka.")}</p></div>
                <div className="discover-filter-wrap">
                  <button className={`discover-filter-icon ${showDiscoverFilter ? "selected" : ""}`} aria-label={t("Open filters")} aria-expanded={showDiscoverFilter} onClick={() => setShowDiscoverFilter((value) => !value)}><SlidersHorizontal size={17} /></button>
                  {showDiscoverFilter && (
                    <div className="discover-filter-popover">
                      <div className="discover-filter-popover-head"><strong>{t("Filter")} {discoverTopTab === "strategies" ? t("Strategies") : t("Traders")}</strong><button aria-label="Close filters" onClick={() => setShowDiscoverFilter(false)}><X size={16} /></button></div>
                      <label>{t("Minimum win rate")}<select value={discoverCriteria.minWinRate} onChange={(event) => setDiscoverCriteria((value) => ({ ...value, minWinRate: event.target.value }))}><option value="0">{t("Any win rate")}</option><option value="50">{t("Above 50%")}</option><option value="60">{t("Above 60%")}</option><option value="70">{t("Above 70%")}</option><option value="80">{t("Above 80%")}</option></select></label>
                      <label>{t("Trader age")}<select value={discoverCriteria.minAge} onChange={(event) => setDiscoverCriteria((value) => ({ ...value, minAge: event.target.value }))}><option value="0">{t("Any age")}</option><option value="30">{t("30+ days")}</option><option value="90">{t("90+ days")}</option><option value="180">{t("6+ months")}</option><option value="365">{t("1+ year")}</option></select></label>
                      <label>{t("Minimum total trades")}<select value={discoverCriteria.minTrades} onChange={(event) => setDiscoverCriteria((value) => ({ ...value, minTrades: event.target.value }))}><option value="0">{t("Any trades")}</option><option value="50">{t("50+ trades")}</option><option value="100">{t("100+ trades")}</option><option value="500">{t("500+ trades")}</option><option value="1000">{t("1,000+ trades")}</option></select></label>
                      {discoverTopTab === "strategies" && <><label>{t("Minimum return")}<select value={discoverCriteria.minReturn} onChange={(event) => setDiscoverCriteria((value) => ({ ...value, minReturn: event.target.value }))}><option value="0">{t("Any return")}</option><option value="20">{t("Above 20%")}</option><option value="50">{t("Above 50%")}</option><option value="80">{t("Above 80%")}</option><option value="100">{t("Above 100%")}</option></select></label><label>{t("Risk level")}<select value={discoverCriteria.risk} onChange={(event) => setDiscoverCriteria((value) => ({ ...value, risk: event.target.value }))}><option value="All">{t("All risk levels")}</option><option value="Low Risk">{t("Low risk")}</option><option value="Medium Risk">{t("Medium risk")}</option><option value="High Risk">{t("High risk")}</option></select></label></>}
                      <label>{t("Sort by")}<select value={discoverCriteria.sort} onChange={(event) => setDiscoverCriteria((value) => ({ ...value, sort: event.target.value }))}><option value="popular">{t("Most popular")}</option><option value="newest">{t("Newest")}</option><option value="win">{t("Highest win rate")}</option><option value="return">{t("Highest return")}</option></select></label>
                      <div className="discover-filter-actions"><button onClick={() => { setDiscoverCriteria({ minWinRate: "0", minAge: "0", minTrades: "0", minReturn: "0", risk: "All", sort: "popular" }); setDiscoverFilter("All"); }}>{t("Reset")}</button><button className="apply" onClick={() => setShowDiscoverFilter(false)}>{t("Apply filters")}</button></div>
                    </div>
                  )}
                </div>
              </div>
              <div className="discover-card-list">
                {discoverTopTab === "strategies" ? [
                  {name:"BTC Trend Master",user:"@tradewiz",type:"Trend Following",risk:"Medium Risk",returns:"+124.5%",win:"68%",age:240,trades:680,tone:"bitcoin",symbol:"BTC",tag:"Trending"},
                  {name:"Scalping AI v2",user:"@cryptofox",type:"Scalping",risk:"Low Risk",returns:"+89.2%",win:"72%",age:120,trades:1240,tone:"ethereum",symbol:"ETH",tag:"Low Risk"},
                  {name:"ETH Breakout",user:"@moontrade",type:"Breakout",risk:"Medium Risk",returns:"+68.1%",win:"63%",age:75,trades:310,tone:"solana",symbol:"SOL",tag:"Trending"},
                  {name:"BNB Momentum",user:"@quantalab",type:"Momentum",risk:"Low Risk",returns:"+54.3%",win:"58%",age:35,trades:92,tone:"bnb",symbol:"ETH",tag:"Low Risk"}
                ].filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.user.toLowerCase().includes(searchQuery.toLowerCase())).filter((item) => Number(item.win.replace("%","")) >= Number(discoverCriteria.minWinRate) && item.age >= Number(discoverCriteria.minAge) && item.trades >= Number(discoverCriteria.minTrades) && Number(item.returns.replace(/[+%]/g,"")) >= Number(discoverCriteria.minReturn) && (discoverCriteria.risk === "All" || item.risk === discoverCriteria.risk) && (discoverFilter === "All" || (discoverFilter === "Trending" ? item.tag === "Trending" : discoverFilter === "Low Risk" ? item.risk === "Low Risk" : Number(item.returns.replace(/[+%]/g,"")) >= 80))).sort((a,b) => discoverCriteria.sort === "win" ? Number(b.win.replace("%","")) - Number(a.win.replace("%","")) : discoverCriteria.sort === "return" ? Number(b.returns.replace(/[+%]/g,"")) - Number(a.returns.replace(/[+%]/g,"")) : discoverCriteria.sort === "newest" ? a.age - b.age : 0).map((item) => (
                  <article className="discover-list-card" key={item.name} role="button" tabIndex={0} aria-label={`View ${item.name} strategy details`} onClick={() => openStrategy(item)} onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); openStrategy(item); } }}>
                    <div className={`discover-avatar ${item.tone}`}><Layers size={21} strokeWidth={1.75} /></div>
                    <div className="discover-card-main"><button type="button" className="discover-strategy-title-button" onClick={() => openStrategy(item)}>{item.name}</button><button className="discover-owner-link" onClick={(event) => { event.stopPropagation(); openTrader(item.user); }}>{item.user} · {t(item.type)}</button><small>{t(item.risk)}</small></div>
                    <div className="discover-card-stats"><strong className="positive">{item.returns}</strong><span>{item.win} {t("win rate")}</span></div>
                    <button onClick={(event) => { event.stopPropagation(); setNotice(`Copy trading for ${item.name} is coming soon`); }}><Copy size={13}/>{t("Copy")}</button>
                  </article>
                )) : [
                  {name:"tradewiz",followers:"342",returns:"+124.5%",win:"68%",age:240,trades:680,avatar:"T",tone:"trader-avatar-1",verified:true},
                  {name:"cryptofox",followers:"1.2K",returns:"+89.2%",win:"72%",age:120,trades:1240,avatar:"C",tone:"trader-avatar-2",verified:true},
                  {name:"moontrade",followers:"856",returns:"+68.1%",win:"63%",age:75,trades:310,avatar:"M",tone:"trader-avatar-3",verified:true},
                  {name:"quantalab",followers:"432",returns:"+54.3%",win:"58%",age:35,trades:92,avatar:"Q",tone:"trader-avatar-4",verified:true},
                  {name:"solking",followers:"321",returns:"+48.7%",win:"61%",age:18,trades:45,avatar:"S",tone:"trader-avatar-5",verified:true}
                ].filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())).filter((item) => Number(item.win.replace("%","")) >= Number(discoverCriteria.minWinRate) && item.age >= Number(discoverCriteria.minAge) && item.trades >= Number(discoverCriteria.minTrades) && Number(item.returns.replace(/[+%]/g,"")) >= Number(discoverCriteria.minReturn) && (discoverFilter === "All" || discoverFilter === "Verified" || (discoverFilter === "Most Followers" ? parseFloat(item.followers) >= 800 : Number(item.returns.replace(/[+%]/g,"")) >= 80))).sort((a,b) => discoverCriteria.sort === "win" ? Number(b.win.replace("%","")) - Number(a.win.replace("%","")) : discoverCriteria.sort === "return" ? Number(b.returns.replace(/[+%]/g,"")) - Number(a.returns.replace(/[+%]/g,"")) : discoverCriteria.sort === "newest" ? a.age - b.age : discoverCriteria.sort === "popular" ? parseFloat(b.followers) - parseFloat(a.followers) : 0).map((item) => (
                  <article className="discover-list-card trader-discover-card" key={item.name} onClick={() => openTrader(item.name)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) openTrader(item.name); }}>
                    <div className={`discover-avatar ${item.tone}`}>{item.tone.startsWith("trader-avatar") ? item.avatar : <CoinLogo symbol={item.tone === "bitcoin" ? "BTC" : item.tone === "ethereum" ? "ETH" : "SOL"} />}</div>
                    <div className="discover-card-main"><strong>{item.name} <BadgeCheck className="verified-mark" size={15} strokeWidth={1.75} aria-label="Verified" /></strong><span>{item.followers} {t("followers")}</span><small>{t("Consistent trader")} · {item.age} {t("days active")}</small></div>
                    <div className="discover-card-stats"><strong className="positive">{item.returns}</strong><span>{item.win} {t("win rate")}</span></div>
                    <button onClick={(event) => { event.stopPropagation(); setNotice(`Following @${item.name} is a demo action`); }}>{t("Follow")}</button>
                  </article>
                ))}
              </div>
            </section>
          </section>
        )}


        {active === "trader-profile" && (
          <section className="page page-enter trader-profile-page">
            <div className="trader-profile-hero">
              <div className="trader-profile-cover">
                <button className="trader-profile-back trader-profile-inline-back" onClick={closeTraderProfile}><ArrowLeft size={17} /><span>{t("Back")}</span></button>
                <span>{t("BEANANCE TRADER")}</span><div className="trader-profile-cover-mark">B</div>
              </div>
              <div className="trader-profile-identity">
                <div className={`trader-profile-avatar trader-avatar-${["tradewiz","cryptofox","moontrade","quantalab","solking"].indexOf(selectedTrader)+1}`}>{selectedTrader.charAt(0).toUpperCase()}</div>
                <div className="trader-profile-name"><div><h1>@{selectedTrader}</h1><BadgeCheck className="verified-mark" size={15} strokeWidth={1.75} aria-label="Verified" /></div><p>{traderProfiles[selectedTrader].name} · Verified trader</p></div>
                <button className="trader-follow-button" onClick={() => setNotice(`Following @${selectedTrader} is a demo action`)}>{t("Follow Trader")}</button>
              </div>
              <p className="trader-profile-bio">{traderProfiles[selectedTrader].bio}</p>
              <div className="trader-profile-meta">
                <span><Users size={14}/>{traderProfiles[selectedTrader].followers} followers</span>
                <span><CalendarDays size={14}/>{t("Active for")} {traderProfiles[selectedTrader].age}</span>
                <span><Activity size={14}/>{traderProfiles[selectedTrader].strategies.length} {t("strategies")}</span>
              </div>
            </div>

            <div className="trader-profile-workspace">
              <div className="trader-profile-tabs" role="tablist" aria-label={t("Trader activity")}>
                <button role="tab" aria-selected={traderProfileTab === "trades"} className={traderProfileTab === "trades" ? "selected" : ""} onClick={() => setTraderProfileTab("trades")}>{t("Trades")} <span>{t("Activity")}</span></button>
                <button role="tab" aria-selected={traderProfileTab === "strategies"} className={traderProfileTab === "strategies" ? "selected" : ""} onClick={() => setTraderProfileTab("strategies")}>{t("Strategies")} <span>{traderProfiles[selectedTrader].strategies.length}</span></button>
              </div>

              {traderProfileTab === "trades" && (
                <section className="trader-profile-section trader-activity-section">
                  <div className="trader-profile-section-heading">
                    <div><h2>{t("Trade history")}</h2></div>
                    <span className="trader-strategy-count">{t("Demo activity")}</span>
                  </div>
                  <div className="trader-subtabs" role="tablist" aria-label={t("Trade status")}>
                    <button className={traderTradeFilter === "open" ? "selected" : ""} onClick={() => setTraderTradeFilter("open")}>{t("Open positions")} <span>2</span></button>
                    <button className={traderTradeFilter === "closed" ? "selected" : ""} onClick={() => setTraderTradeFilter("closed")}>{t("Closed trades")} <span>4</span></button>
                  </div>
                  <div className="trader-trade-list">
                    {(traderTradeFilter === "open" ? [
                      {pair:"BTC / USDT",side:"LONG",entry:"$67,420.50",mark:"$68,215.80",size:"0.42 BTC",pnl:"+$333.97",change:"+1.18%",date:"Opened 2h ago",strategy:traderProfiles[selectedTrader].strategies[0].name},
                      {pair:"ETH / USDT",side:"SHORT",entry:"$3,482.20",mark:"$3,451.60",size:"2.5 ETH",pnl:"+$76.50",change:"+0.88%",date:"Opened 5h ago",strategy:traderProfiles[selectedTrader].strategies[Math.min(1,traderProfiles[selectedTrader].strategies.length-1)].name}
                    ] : [
                      {pair:"SOL / USDT",side:"LONG",entry:"$148.20",mark:"$156.80",size:"18 SOL",pnl:"+$154.80",change:"+5.80%",date:"Closed Oct 30, 2026",strategy:traderProfiles[selectedTrader].strategies[0].name},
                      {pair:"BNB / USDT",side:"LONG",entry:"$612.40",mark:"$628.10",size:"3 BNB",pnl:"+$47.10",change:"+2.56%",date:"Closed Oct 29, 2026",strategy:traderProfiles[selectedTrader].strategies[0].name},
                      {pair:"BTC / USDT",side:"SHORT",entry:"$69,120.00",mark:"$68,420.00",size:"0.15 BTC",pnl:"+$105.00",change:"+1.01%",date:"Closed Oct 28, 2026",strategy:traderProfiles[selectedTrader].strategies[0].name},
                      {pair:"ETH / USDT",side:"LONG",entry:"$3,610.00",mark:"$3,548.00",size:"1.2 ETH",pnl:"-$74.40",change:"-1.72%",date:"Closed Oct 27, 2026",strategy:traderProfiles[selectedTrader].strategies[0].name}
                    ]).map((trade,index) => (
                      <article className="trader-trade-card" key={`${trade.pair}-${trade.date}`}>
                        <div className="trader-trade-top">
                          <div className="trader-trade-pair"><span className={`trader-trade-coin trader-trade-coin-${trade.pair.startsWith("BTC") ? "btc" : trade.pair.startsWith("ETH") ? "eth" : trade.pair.startsWith("SOL") ? "sol" : "bnb"}`}><CoinLogo symbol={trade.pair.split(" ")[0]} /></span><div><strong>{trade.pair}</strong><small>{trade.strategy}</small></div></div>
                          <div className="trader-trade-badges"><span className={`trade-side-badge ${trade.side.toLowerCase()}`}>{trade.side}</span><span className={`trade-status-badge ${traderTradeFilter}`}>{traderTradeFilter === "open" ? t("OPEN") : t("CLOSED")}</span></div>
                        </div>
                        <div className="trader-trade-data">
                          <div><span>{t("Entry price")}</span><strong>{trade.entry}</strong></div>
                          <div><span>{traderTradeFilter === "open" ? t("Mark price") : t("Exit price")}</span><strong>{trade.mark}</strong></div>
                          <div><span>{t("Position size")}</span><strong>{trade.size}</strong></div>
                          <div><span>{traderTradeFilter === "open" ? t("Unrealized PnL") : t("Realized PnL")}</span><strong className={trade.pnl.startsWith("-") ? "negative" : "positive"}>{trade.pnl}<small>{trade.change}</small></strong></div>
                        </div>
                        <div className="trader-trade-footer"><span>{t(trade.date)}</span><span>{traderTradeFilter === "open" ? t("Isolated · 5x") : t("Trade completed")}</span></div>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {traderProfileTab === "strategies" && (
                <section className="trader-profile-section trader-strategy-overview-section">
                  <div className="trader-profile-section-heading"><div><h2>{t("Strategies by")} @{selectedTrader}</h2></div><span className="trader-strategy-count">{traderProfiles[selectedTrader].strategies.length} total</span></div>
                  <div className="trader-subtabs" role="tablist" aria-label={t("Strategy status")}>
                    <button className={traderStrategyFilter === "active" ? "selected" : ""} onClick={() => setTraderStrategyFilter("active")}>{t("Active")} <span>{Math.max(1,traderProfiles[selectedTrader].strategies.length-1)}</span></button>
                    <button className={traderStrategyFilter === "inactive" ? "selected" : ""} onClick={() => setTraderStrategyFilter("inactive")}>{t("Inactive")} <span>{Math.max(0,traderProfiles[selectedTrader].strategies.length-Math.max(1,traderProfiles[selectedTrader].strategies.length-1))}</span></button>
                  </div>
                  <div className="trader-strategy-performance-list">
                    {traderProfiles[selectedTrader].strategies.filter((strategy,index) => traderStrategyFilter === "active" ? index < Math.max(1,traderProfiles[selectedTrader].strategies.length-1) : index >= Math.max(1,traderProfiles[selectedTrader].strategies.length-1)).length === 0 ? (
                      <div className="trader-empty-state"><Activity size={20}/><strong>{t("No inactive strategies")}</strong><span>{t("Trader ini belum memiliki strategi yang dinonaktifkan.")}</span></div>
                    ) : traderProfiles[selectedTrader].strategies.filter((strategy,index) => traderStrategyFilter === "active" ? index < Math.max(1,traderProfiles[selectedTrader].strategies.length-1) : index >= Math.max(1,traderProfiles[selectedTrader].strategies.length-1)).map((strategy,index) => (
                      <article className="trader-strategy-performance-card" key={strategy.name} role="button" tabIndex={0} aria-label={`View ${strategy.name} strategy details`} onClick={() => openStrategy({ ...strategy, user: `@${selectedTrader}` })} onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); openStrategy({ ...strategy, user: `@${selectedTrader}` }); } }}>
                        <div className="trader-strategy-performance-heading">
                          <div className="trader-owned-strategy-icon"><Layers size={21} strokeWidth={1.75} /></div>
                          <div className="trader-owned-strategy-main"><div className="trader-strategy-name-line"><strong>{strategy.name}</strong><span className={`trader-strategy-risk-inline ${strategy.risk.toLowerCase().replace(" risk","")}`}>{t(strategy.risk)}</span></div><span>{t(strategy.type)}</span></div>
                          <div className="trader-strategy-actions">
                            <span className={`strategy-status-pill ${traderStrategyFilter}`}>{traderStrategyFilter === "active" ? "Active" : "Inactive"}</span>
                            {traderStrategyFilter === "active" && <button className="trader-copy-button" onClick={(event) => { event.stopPropagation(); setNotice(`Copy trading for ${strategy.name} is coming soon`); }}><Copy size={13}/> Copy</button>}
                          </div>
                        </div>
                        <div className="trader-strategy-metrics">
                          <div><span>{t("30D Return")}</span><strong className="positive">{strategy.returns}</strong></div>
                          <div><span>{t("Win Rate")}</span><strong>{strategy.win}</strong></div>
                          <div><span>{t("Total Trades")}</span><strong>{strategy.trades}</strong></div>
                        </div>
                        <div className="trader-strategy-chart trader-strategy-chart-compact">
                          <svg viewBox="0 0 600 90" preserveAspectRatio="none" role="img" aria-label={`${strategy.name} performance chart`}>
                            <defs>
                              <linearGradient id={`strategy-chart-fill-${selectedTrader}-${index}`} x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#20bd68" stopOpacity=".2"/>
                                <stop offset="100%" stopColor="#20bd68" stopOpacity="0"/>
                              </linearGradient>
                            </defs>
                            <path d={index % 2 === 1 ? "M0 72 L40 64 L80 69 L120 49 L160 55 L200 42 L240 50 L280 31 L320 39 L360 25 L400 32 L440 17 L480 23 L520 13 L560 18 L600 6 L600 90 L0 90 Z" : "M0 77 L40 68 L80 72 L120 54 L160 60 L200 43 L240 51 L280 34 L320 40 L360 24 L400 31 L440 19 L480 25 L520 12 L560 17 L600 5 L600 90 L0 90 Z"} fill={`url(#strategy-chart-fill-${selectedTrader}-${index})`}/>
                            <path d={index % 2 === 1 ? "M0 72 L40 64 L80 69 L120 49 L160 55 L200 42 L240 50 L280 31 L320 39 L360 25 L400 32 L440 17 L480 23 L520 13 L560 18 L600 6" : "M0 77 L40 68 L80 72 L120 54 L160 60 L200 43 L240 51 L280 34 L320 40 L360 24 L400 31 L440 19 L480 25 L520 12 L560 17 L600 5"} fill="none" stroke="#20bd68" strokeWidth="2.5" vectorEffect="non-scaling-stroke"/>
                          </svg>
                          <div className="trader-chart-axis"><span>{t("30D ago")}</span><span>{t("Today")}</span></div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </div>
            <p className="trader-profile-disclaimer">{t("Trade history and strategy performance shown here are sample data for the Beanance demo.")}</p>
          </section>
        )}

        {active === "market" && (
          <section className="page page-enter simple-page market-page market-page-full">
            <div className={`market-feed-status market-page-feed-status ${marketConnectionStatus}`}>{marketConnectionStatus === "live" ? "● Live market data" : marketConnectionStatus === "stale" ? "● Market data delayed" : marketConnectionStatus === "offline" ? "● Market API unavailable" : "● Connecting to market feed"}</div>
            {marketNavTab === "all-market" ? (
              <div className="market-table-flat">
                <div className="market-table market-table-head">
                  <span className="market-star-column" aria-hidden="true"><Star size={15} strokeWidth={1.75} /></span>
                  <button className={marketSort === "name" ? "market-sort active" : "market-sort"} onClick={() => {setMarketSort("name");setMarketSortDirection((direction) => marketSort === "name" && direction === "asc" ? "desc" : "asc");}}>{t("Name")} <span>{marketSort === "name" ? (marketSortDirection === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />) : <ArrowUpDown size={13} />}</span></button>
                  <button className={marketSort === "volume" ? "market-sort active" : "market-sort"} onClick={() => {setMarketSort("volume");setMarketSortDirection((direction) => marketSort === "volume" && direction === "desc" ? "asc" : "desc");}}>{t("Vol")} <span>{marketSort === "volume" ? (marketSortDirection === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />) : <ArrowUpDown size={13} />}</span></button>
                  <button className={marketSort === "price" ? "market-sort active" : "market-sort"} onClick={() => {setMarketSort("price");setMarketSortDirection((direction) => marketSort === "price" && direction === "desc" ? "asc" : "desc");}}>{t("Last price")} <span>{marketSort === "price" ? (marketSortDirection === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />) : <ArrowUpDown size={13} />}</span></button>
                  <button className={marketSort === "change" ? "market-sort active" : "market-sort"} onClick={() => {setMarketSort("change");setMarketSortDirection((direction) => marketSort === "change" && direction === "desc" ? "asc" : "desc");}}>{t("24h change")} <span>{marketSort === "change" ? (marketSortDirection === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />) : <ArrowUpDown size={13} />}</span></button>
                </div>
                <div className="market-table-body">
                  {[...liveMarketAssets].filter((asset) => `${asset.name} ${asset.symbol}`.toLowerCase().includes(searchQuery.toLowerCase())).sort((a,b) => {
                    const aPinned = pinnedMarketSymbols.includes(a.symbol);
                    const bPinned = pinnedMarketSymbols.includes(b.symbol);
                    if (aPinned !== bPinned) return aPinned ? -1 : 1;
                    const values = {
                      name: [a.name.toLowerCase(), b.name.toLowerCase()],
                      volume: [a.volumeNumber ?? Number(a.volume.replace(/[^0-9.]/g, "")) * (a.volume.includes("B") ? 1000 : a.volume.includes("M") ? 1 : 0.001), b.volumeNumber ?? Number(b.volume.replace(/[^0-9.]/g, "")) * (b.volume.includes("B") ? 1000 : b.volume.includes("M") ? 1 : 0.001)],
                      price: [a.priceNumber ?? Number(a.price.replace(/[^0-9.]/g, "")), b.priceNumber ?? Number(b.price.replace(/[^0-9.]/g, ""))],
                      change: [a.changeNumber ?? Number(a.change.replace("%", "")), b.changeNumber ?? Number(b.change.replace("%", ""))]
                    }[marketSort];
                    const comparison = typeof values[0] === "string" ? values[0].localeCompare(values[1]) : values[0] - values[1];
                    return comparison * (marketSortDirection === "asc" ? 1 : -1);
                  }).map((asset) => (
                    <article className="market-table market-table-row market-clickable-row" key={asset.symbol} onClick={() => {setSelectedMarket(asset);setMarketDetailTab("price");setActive("market-detail");window.scrollTo({top:0,behavior:"instant"});}}>
                      <button className={pinnedMarketSymbols.includes(asset.symbol) ? "favorite-star is-pinned" : "favorite-star"} aria-label={pinnedMarketSymbols.includes(asset.symbol) ? `Unpin ${asset.symbol}` : `Pin ${asset.symbol}`} aria-pressed={pinnedMarketSymbols.includes(asset.symbol)} onClick={(event) => {event.stopPropagation();setPinnedMarketSymbols((current) => current.includes(asset.symbol) ? current.filter((symbol) => symbol !== asset.symbol) : [...current, asset.symbol]);}}><Star size={18} fill={pinnedMarketSymbols.includes(asset.symbol) ? "currentColor" : "none"} /></button>
                      <div className="market-pair"><div className={`asset-icon ${asset.tone}`}><CoinLogo symbol={asset.symbol} /></div><div><strong>{asset.symbol}<span className="market-quote">/USDT</span><small>{asset.name}</small></strong></div></div>
                      <div className="market-volume-cell">{asset.volume}</div>
                      <div className="market-price-cell">{asset.price}</div>
                      <div className={asset.positive ? "market-change-cell positive" : "market-change-cell negative"}>{asset.change}</div>
                    </article>
                  ))}
                </div>
              </div>
            ) : (
              <section className="top-movers-page">
                <div className="top-movers-categories" role="tablist" aria-label="Kategori pergerakan harga">
                  {["Semua", "Kenaikan", "Penurunan"].map((category) => (
                    <button key={category} type="button" role="tab" aria-selected={moverCategory === category} className={moverCategory === category ? "selected" : ""} onClick={() => setMoverCategory(category)}>{t(category)}</button>
                  ))}
                </div>
                <div className="top-movers-list-head"><span>{t("Pasangan")}</span><span>{t("Perubahan / Status")}</span></div>
                <div className="top-movers-list">
                  {liveTopMoverEvents.filter((event) => (moverCategory === "Semua" || event.category === moverCategory) && `${event.name} ${event.symbol}`.toLowerCase().includes(searchQuery.toLowerCase())).map((event, index) => (
                    <article className="top-mover-row market-clickable-row" key={`${event.symbol}-${event.time}-${index}`} onClick={() => {const asset=liveMarketAssets.find((item)=>item.symbol===event.symbol)||{symbol:event.symbol,name:event.name,price:"—",change:event.change,positive:event.positive,volume:"—",tone:""};setSelectedMarket(asset);setMarketDetailTab("price");setActive("market-detail");window.scrollTo({top:0,behavior:"instant"});}}>
                      <div className="top-mover-pair"><div className="top-mover-asset"><CoinLogo symbol={event.symbol} /><strong>{event.symbol}USDT</strong></div><small>{event.time} · 1m</small></div>
                      <div className="top-mover-movement"><strong className={event.positive ? "positive" : "negative"}>{event.change}</strong><span>{language === "en" ? ({ "Momentum naik": "Upward momentum", "Momentum turun": "Downward momentum", "Rally": "Rally", "Sell-off": "Sell-off", "Breakout": "Breakout", "Breakdown": "Breakdown" }[event.status] || event.status) : t(event.status)}</span></div>
                    </article>
                  ))}
                  {liveTopMoverEvents.filter((event) => (moverCategory === "Semua" || event.category === moverCategory) && `${event.name} ${event.symbol}`.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <div className="top-movers-empty">{t("Belum ada pergerakan untuk kategori ini.")}</div>
                  )}
                </div>
                <p className="top-movers-disclaimer">Top Movers menampilkan perubahan harga rolling 24 jam dari Binance USDⓈ-M Futures.</p>
              </section>
            )}
          </section>
        )}


        {active === "market-detail" && selectedMarket && (
          <section className="page page-enter market-detail-page">
            <div className="market-detail-header">
              <button type="button" className="market-detail-back" onClick={() => setActive("market")} aria-label="Back to market"><ArrowLeft size={21}/></button>
              <div className={"asset-icon "+selectedMarket.tone}><CoinLogo symbol={selectedMarket.symbol}/></div>
              <div className="market-detail-pair"><h1>{selectedMarket.symbol}USDT <span>Perp</span></h1><p>{selectedMarket.name} · USDT Perpetual</p></div>
              <button type="button" className="market-detail-icon" onClick={() => setPinnedMarketSymbols((current)=>current.includes(selectedMarket.symbol)?current.filter((symbol)=>symbol!==selectedMarket.symbol):[...current,selectedMarket.symbol])} aria-label="Toggle favorite"><Star size={20} fill={pinnedMarketSymbols.includes(selectedMarket.symbol)?"currentColor":"none"}/></button>
              <button type="button" className="market-detail-icon" onClick={() => setNotice("Price alert is coming soon")} aria-label="Price alert"><Bell size={20}/></button>
            </div>
            <div className="market-detail-tabs" role="tablist" aria-label="Market detail sections">
              {[["price","Harga"],["info","Info"],["trading-data","Data Perdagangan"],["trades","Trades"]].map(([id,label])=><button type="button" role="tab" aria-selected={marketDetailTab===id} className={marketDetailTab===id?"selected":""} key={id} onClick={()=>setMarketDetailTab(id)}>{label}</button>)}
            </div>
            {marketDetailTab==="price" && (
              <>
                <section className="market-price-summary">
                  <div className="market-last-price">
                    <span>Harga Terakhir</span>
                    <strong className={selectedMarket.positive?"positive":"negative"}>{selectedMarket.price}</strong>
                    <div><b>{selectedMarket.price}</b><em className={selectedMarket.positive?"positive":"negative"}>{selectedMarket.change}</em></div>
                    <small>Harga Mark {selectedMarket.price}</small>
                  </div>
                  <div className="market-compact-stats">
                    <div><span>High 24 jam</span><strong>{selectedMarket.high||"—"}</strong></div>
                    <div><span>Low 24 jam</span><strong>{selectedMarket.low||"—"}</strong></div>
                    <div><span>Vol 24 jam ({selectedMarket.symbol})</span><strong>{selectedMarket.baseVolume || selectedMarket.volume}</strong></div>
                    <div><span>Vol 24 jam (USDT)</span><strong>{selectedMarket.quoteVolume||"—"}</strong></div>
                  </div>
                </section>
                <section className="market-chart-section">
                  {/* [MODIFIED] Timeframe controls and three chart actions are now integrated into the chart toolbar. */}
                  <MarketTradingChart symbol={selectedMarket.symbol} timeframe={marketTimeframe} onTimeframeChange={setMarketTimeframe} />
                  <div className="market-indicators">{["SUPER","VOL","MACD","RSI","KDJ","OBV","WR","Stoch"].map((indicator)=><button type="button" key={indicator} className={marketIndicator===indicator?"selected":""} onClick={()=>setMarketIndicator(indicator)}>{indicator}</button>)}</div>
                </section>
                <section className="market-performance-grid">
                  {[["Hari Ini",selectedMarket.change],["7 Hari",formatMarketPeriodReturn(marketDailyCandles,7)],["30 Hari",formatMarketPeriodReturn(marketDailyCandles,30)],["90 Hari",formatMarketPeriodReturn(marketDailyCandles,90)],["180 Hari",formatMarketPeriodReturn(marketDailyCandles,180)],["1 Tahun",formatMarketPeriodReturn(marketDailyCandles,365)]].map(([label,value])=><div key={label}><span>{label}</span><strong className={value.startsWith("-")?"negative":"positive"}>{value}</strong></div>)}
                </section>
                <section className="market-orderbook">
                  <div className="market-order-tabs" role="tablist" aria-label="Market order data">
                    {[["book","Book"],["depth","Kedalaman"],["trades","Perdagangan"]].map(([id,label])=><button type="button" role="tab" aria-selected={marketOrderTab===id} className={marketOrderTab===id?"selected":""} key={id} onClick={()=>setMarketOrderTab(id)}>{label}</button>)}
                  </div>
                  {marketOrderTab==="book" && <><div className="market-book-ratio"><span>{marketOrderBook.bids.length ? ((marketOrderBook.bids.reduce((sum,item)=>sum+Number(item.quantity||0),0)/Math.max(1,marketOrderBook.bids.reduce((sum,item)=>sum+Number(item.quantity||0),0)+marketOrderBook.asks.reduce((sum,item)=>sum+Number(item.quantity||0),0)))*100).toFixed(2)+"%" : "—"}</span><span>{marketOrderBook.asks.length ? ((marketOrderBook.asks.reduce((sum,item)=>sum+Number(item.quantity||0),0)/Math.max(1,marketOrderBook.bids.reduce((sum,item)=>sum+Number(item.quantity||0),0)+marketOrderBook.asks.reduce((sum,item)=>sum+Number(item.quantity||0),0)))*100).toFixed(2)+"%" : "—"}</span></div><div className="market-book-bar"><i/><i/></div><div className="market-book-columns"><span>Bid</span><span>Price</span><span>Ask</span></div>{Array.from({length:4},(_,index)=>({bid:marketOrderBook.bids[index],ask:marketOrderBook.asks[index]})).map(({bid,ask},index)=><div className="market-book-row" key={String(bid?.price||"bid")+"-"+String(ask?.price||"ask")}><span>{bid?Number(bid.quantity).toFixed(2):"—"}</span><strong>{bid?Number(bid.price).toFixed(8):ask?Number(ask.price).toFixed(8):"—"}</strong><span>{ask?Number(ask.quantity).toFixed(2):"—"}</span></div>)}</>}
                  {marketOrderTab==="depth" && <div className="market-depth-placeholder"><Activity size={23}/><strong>Market Depth</strong><span>Bid and ask liquidity visualization</span><div className="market-book-bar"><i/><i/></div></div>}
                  {marketOrderTab==="trades" && <div className="market-trade-list">{marketRecentTrades.slice(0,4).map((trade,index)=><div key={String(trade.id??trade.time)+"-"+index}><span>{new Date(Number(trade.time)).toLocaleTimeString(language,{hour12:false})}</span><strong className={trade.isBuyerMaker?"negative":"positive"}>{Number(trade.price).toFixed(8)}</strong><span>{Number(trade.quantity).toFixed(2)}</span></div>)}</div>}
                </section>
              </>
            )}
            {marketDetailTab==="info" && <section className="market-info-panel"><h2>{selectedMarket.name} ({selectedMarket.symbol})</h2><p>Market descriptions, network information, and contract details will be populated when the asset data provider is connected.</p><div><span>Pair</span><strong>{selectedMarket.symbol}/USDT</strong></div><div><span>Market Type</span><strong>Perpetual</strong></div><div><span>Quote Asset</span><strong>USDT</strong></div><div><span>Base Asset</span><strong>{selectedMarket.symbol}</strong></div></section>}
            {marketDetailTab==="trading-data" && <section className="market-info-panel"><h2>Data Perdagangan</h2><div><span>24h Change</span><strong className={selectedMarket.positive?"positive":"negative"}>{selectedMarket.change}</strong></div><div><span>24h Volume</span><strong>{selectedMarket.volume}</strong></div><div><span>24h High</span><strong>{selectedMarket.high||"—"}</strong></div><div><span>24h Low</span><strong>{selectedMarket.low||"—"}</strong></div><div><span>Quote Volume</span><strong>{selectedMarket.quoteVolume||"—"}</strong></div></section>}
            {marketDetailTab==="trades" && <section className="market-info-panel"><h2>{t("Recent Trades")}</h2><p>{t("Live public trades for {{symbol}}.", { symbol: selectedMarket.symbol + "/USDT" })}</p>{marketRecentTrades.map((trade,index)=><div key={String(trade.id ?? trade.time) + "-" + index}><span>{new Date(Number(trade.time)).toLocaleTimeString(language, { hour12: false })}</span><strong className={trade.isBuyerMaker?"negative":"positive"}>{Number(trade.price).toLocaleString(language, { maximumFractionDigits: 8 })}</strong><span>{Number(trade.quantity).toLocaleString(language, { maximumFractionDigits: 4 })} {selectedMarket.symbol}</span></div>)}{!marketRecentTrades.length && <div className="market-live-empty">{t("Waiting for recent trades...")}</div>}</section>}
            <div className="market-create-sticky"><button type="button" onClick={()=>setNotice("Create Strategy for "+selectedMarket.symbol+"USDT is coming soon")}><Layers size={19}/> Create Strategy <span>{selectedMarket.symbol}USDT</span></button></div>
            <p className="market-data-disclaimer">Live ticker figures are supplied by Binance USDⓈ-M Futures. Candlestick history, order book, depth, and recent trades are supplied by Beanance Market Backend.</p>
          </section>
        )}

        {active === "profile" && (
          <section className="page page-enter trader-profile-page portfolio-profile-page portfolio-strategy-page">
            <section className="trader-profile-hero portfolio-profile-hero">
              <div className="trader-profile-cover portfolio-profile-cover">
                <span>{t("BEANANCE TRADER")}</span>
                <div className="trader-profile-cover-mark">B</div>
              </div>
              <div className="trader-profile-identity portfolio-profile-identity">
                <div className="trader-profile-avatar portfolio-profile-avatar">
                  {profilePhoto ? <img src={profilePhoto} alt={t("Profile photo")} /> : (profileName.trim()[0] || "E").toUpperCase()}
                </div>
                <div className="trader-profile-name portfolio-profile-name">
                  <div><h1>{profileName || "Ezy"}</h1><span className="portfolio-account-badge">{t("Trader")}</span></div>
                  <p>@{(profileName || "ezy").toLowerCase().replace(/\s+/g, "")}</p>
                </div>
                <button type="button" className="trader-follow-button portfolio-edit-button" onClick={() => setActive("edit-profile")}>{t("Edit profile")}</button>
              </div>
              <p className="trader-profile-bio portfolio-profile-bio">{t("Builder · Trader · DeFi & Bot Strategy")}</p>
              <div className="trader-profile-meta portfolio-profile-meta">
                <span><Users size={14}/><strong>128</strong> {t("Followers")}</span>
                <span><Users size={14}/><strong>56</strong> {t("Following")}</span>
                <span><Layers size={14}/><strong>12</strong> {t("Strategies")}</span>
              </div>
              {/* [MODIFIED] Portfolio tabs are integrated into the profile card footer. */}
              <div className="portfolio-icon-tabs" role="tablist" aria-label={t("Portfolio sections")}>
                <button type="button" role="tab" aria-selected={portfolioTab === "strategy"} className={portfolioTab === "strategy" ? "selected" : ""} onClick={() => setPortfolioTab("strategy")} aria-label={t("Strategy")} title={t("Strategy")}><Layers size={20}/>{portfolioTab === "strategy" && <span>{t("Strategy")}</span>}</button>
                <button type="button" role="tab" aria-selected={portfolioTab === "wallet"} className={portfolioTab === "wallet" ? "selected" : ""} onClick={() => setPortfolioTab("wallet")} aria-label={t("Web3 Wallet")} title={t("Web3 Wallet")}><Wallet size={20}/>{portfolioTab === "wallet" && <span>{t("Web3 Wallet")}</span>}</button>
                <button type="button" role="tab" aria-selected={portfolioTab === "history"} className={portfolioTab === "history" ? "selected" : ""} onClick={() => setPortfolioTab("history")} aria-label={t("History")} title={t("History")}><Clock3 size={20}/>{portfolioTab === "history" && <span>{t("History")}</span>}</button>
              </div>
            </section>

            <div className="portfolio-strategy-content">
              {portfolioTab === "strategy" && (
                <>
                  {/* [MODIFIED] Strategy cards mirror the trader profile performance layout. */}
                  <section className="portfolio-strategy-list-section portfolio-owned-strategies-section">
                    <div className="portfolio-content-heading portfolio-strategy-heading"></div>
                    {/* [MODIFIED] Keep all strategy filters on one horizontal tab row. */}
                    <div className="portfolio-strategy-filters portfolio-strategy-all-filters" role="tablist" aria-label={t("Filter strategies")}>
                      <button type="button" role="tab" aria-selected={strategyFilter === "all"} className={strategyFilter === "all" ? "selected" : ""} onClick={() => setStrategyFilter("all")}>{t("All")}</button>
                      <button type="button" role="tab" aria-selected={strategyFilter === "mine"} className={strategyFilter === "mine" ? "selected" : ""} onClick={() => setStrategyFilter("mine")}>{t("My Strategy")}</button>
                      <button type="button" role="tab" aria-selected={strategyFilter === "following"} className={strategyFilter === "following" ? "selected" : ""} onClick={() => setStrategyFilter("following")}>{t("Following")}</button>
                      <button type="button" role="tab" aria-selected={strategyFilter === "inactive"} className={strategyFilter === "inactive" ? "selected" : ""} onClick={() => setStrategyFilter("inactive")}>{t("Inactive")} <span>1</span></button>
                    </div>
                    <div className="trader-strategy-performance-list portfolio-owned-strategy-list">
                      {[
                        {name:"Scalping BNB",pair:"BNBUSDT",type:"Scalping",timeframe:"5m",returns:"+18.32%",win:"74%",trades:"428",risk:"Medium Risk",owner:"mine",status:"active",chart:0},
                        {name:"Trend Catcher",pair:"BTCUSDT",type:"Trend Following",timeframe:"15m",returns:"+9.74%",win:"68%",trades:"215",risk:"Low Risk",owner:"mine",status:"active",chart:1},
                        {name:"ETH Momentum",pair:"ETHUSDT",type:"Momentum",timeframe:"1h",returns:"+7.21%",win:"65%",trades:"186",risk:"Medium Risk",owner:"mine",status:"active",chart:0},
                        {name:"BTC Trend Master",pair:"BTCUSDT",type:"Trend Following",timeframe:"1h",returns:"+24.80%",win:"71%",trades:"680",risk:"Medium Risk",owner:"following",status:"active",chart:1},
                        {name:"ETH Quick Moves",pair:"ETHUSDT",type:"Momentum",timeframe:"15m",returns:"-2.40%",win:"48%",trades:"92",risk:"High Risk",owner:"following",status:"inactive",chart:0}
                      ].filter((s) => strategyFilter === "inactive" ? s.status === "inactive" : (strategyFilter === "all" || s.owner === strategyFilter)).map((strategy,index) => (
                        <article className="trader-strategy-performance-card portfolio-owned-strategy-card" key={strategy.name} role="button" tabIndex={0} aria-label={`View ${strategy.name} strategy details`} onClick={() => openStrategy({ ...strategy, user: strategy.owner === "mine" ? "@ezy" : "@tradewiz", symbol: strategy.pair.replace("USDT", "") })} onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); openStrategy({ ...strategy, user: strategy.owner === "mine" ? "@ezy" : "@tradewiz", symbol: strategy.pair.replace("USDT", "") }); } }}>
                          <div className="trader-strategy-performance-heading">
                            <div className="trader-owned-strategy-icon"><Layers size={21} strokeWidth={1.75} /></div>
                            <div className="trader-owned-strategy-main"><div className="trader-strategy-name-line"><strong>{strategy.name}</strong><span className={"trader-strategy-risk-inline " + strategy.risk.toLowerCase().replace(" risk","")}>{t(strategy.risk)}</span></div><span>{t(strategy.type)} · {strategy.pair} · {strategy.timeframe}</span></div>
                            <div className="trader-strategy-actions"><span className={"strategy-status-pill " + strategy.status}>{t(strategy.status === "active" ? "Active" : "Inactive")}</span>{strategy.status === "active" && <button type="button" className="trader-copy-button" onClick={(event) => { event.stopPropagation(); setNotice("Copy trading for " + strategy.name + " is coming soon"); }}><Copy size={14}/> {t("Copy")}</button>}</div>
                          </div>
                          <div className="trader-strategy-metrics"><div><span>{t("30D Return")}</span><strong className={strategy.returns.startsWith("-") ? "negative" : "positive"}>{strategy.returns}</strong></div><div><span>{t("Win Rate")}</span><strong>{strategy.win}</strong></div><div><span>{t("Total Trades")}</span><strong>{strategy.trades}</strong></div></div>
                          <div className="trader-strategy-chart trader-strategy-chart-compact">
                            <svg viewBox="0 0 600 90" preserveAspectRatio="none" role="img" aria-label={strategy.name + " performance chart"}>
                              <defs><linearGradient id={"portfolio-strategy-fill-" + index} x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={strategy.status === "active" ? "#20bd68" : "#e45b5b"} stopOpacity=".2"/><stop offset="100%" stopColor={strategy.status === "active" ? "#20bd68" : "#e45b5b"} stopOpacity="0"/></linearGradient></defs>
                              <path d={strategy.chart === 1 ? "M0 72 L40 64 L80 69 L120 49 L160 55 L200 42 L240 50 L280 31 L320 39 L360 25 L400 32 L440 17 L480 23 L520 13 L560 18 L600 6 L600 90 L0 90 Z" : "M0 77 L40 68 L80 72 L120 54 L160 60 L200 43 L240 51 L280 34 L320 40 L360 24 L400 31 L440 19 L480 25 L520 12 L560 17 L600 5 L600 90 L0 90 Z"} fill={"url(#portfolio-strategy-fill-" + index + ")"} />
                              <path d={strategy.chart === 1 ? "M0 72 L40 64 L80 69 L120 49 L160 55 L200 42 L240 50 L280 31 L320 39 L360 25 L400 32 L440 17 L480 23 L520 13 L560 18 L600 6" : "M0 77 L40 68 L80 72 L120 54 L160 60 L200 43 L240 51 L280 34 L320 40 L360 24 L400 31 L440 19 L480 25 L520 12 L560 17 L600 5"} fill="none" stroke="#20bd68" strokeWidth="2.5" vectorEffect="non-scaling-stroke"/>
                            </svg>
                            <div className="trader-chart-axis"><span>{t("30D ago")}</span><span>{t("Today")}</span></div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                </>
              )}

              {portfolioTab === "wallet" && (
                <section className="portfolio-wallet-panel portfolio-tab-panel portfolio-wallet-modern">
                  {!web3Connected && !walletPreviewMode ? (
                    <div className="portfolio-wallet-onboarding">
                      <div className="portfolio-wallet-onboarding-icon"><Wallet size={25}/></div>
                      <div className="portfolio-wallet-onboarding-actions">
                        <button type="button" className="portfolio-wallet-primary-action" onClick={() => setNotice("Secure wallet creation is coming soon")}><Plus size={16}/>{t("Create wallet")}</button>
                        <div className="portfolio-wallet-or"><span></span><small>{t("or")}</small><span></span></div>
                        <button type="button" className="portfolio-wallet-secondary-action" onClick={() => setNotice("Secure wallet import is coming soon")}><ArrowDownLeft size={16}/>{t("Import wallet")}</button>
                      </div>
                      <button type="button" className="portfolio-wallet-preview-link" onClick={() => setWalletPreviewMode(true)}>{t("Preview connected wallet")}</button>
                    </div>
                  ) : (
                    <>
                      <div className="portfolio-wallet-balance-card">
                        <div className="portfolio-wallet-balance-top"><span>{t("Wallet balance")}</span>{walletPreviewMode ? <button type="button" className="portfolio-wallet-preview-exit" onClick={() => setWalletPreviewMode(false)}>{t("Exit preview")}</button> : <span className="portfolio-wallet-connected-label"><CheckCircle2 size={13}/>{t("Connected")}</span>}</div>
                        <strong>$2,480.65</strong>
                        <small className="portfolio-wallet-address">0x71C7...8976F <button type="button" onClick={() => setNotice("Wallet address copied")}><Copy size={13}/></button></small>
                        <div className="portfolio-wallet-actions">
                          <button type="button" onClick={() => setNotice("Deposit is coming soon")}><ArrowDownLeft size={17}/><span>{t("Deposit")}</span></button>
                          <button type="button" onClick={() => setNotice("Withdraw is coming soon")}><ArrowUpRight size={17}/><span>{t("Withdraw")}</span></button>
                          <button type="button" onClick={() => setNotice("Swap is coming soon")}><Activity size={17}/><span>{t("Swap")}</span></button>
                        </div>
                      </div>
                      <div className="portfolio-wallet-token-heading"><h3>{t("Assets")}</h3><button type="button" onClick={() => setNotice("Add token is coming soon")}><Plus size={16}/>{t("Add Token")}</button></div>
                      <div className="portfolio-wallet-token-list">
                        <article className="portfolio-wallet-token-card"><span className="portfolio-wallet-token-logo bnb"><CoinLogo symbol="BNB" /></span><span className="portfolio-wallet-token-info"><strong>BNB</strong><small>BNB Chain</small></span><span className="portfolio-wallet-token-value"><strong>4.25 BNB</strong><small>$2,465.00</small></span></article>
                        <article className="portfolio-wallet-token-card"><span className="portfolio-wallet-token-logo bean"><CoinLogo symbol="BEAN" /></span><span className="portfolio-wallet-token-info"><strong>BEAN</strong><small>Beanance Token</small></span><span className="portfolio-wallet-token-value"><strong>1,250 BEAN</strong><small>$15.65</small></span></article>
                      </div>
                    </>
                  )}
                </section>
              )}

              {portfolioTab === "history" && (
                <section className="portfolio-strategy-list-section portfolio-tab-panel portfolio-history-panel">
                  <div className="portfolio-history-tabs portfolio-history-icon-tabs" role="tablist" aria-label={t("History filters")}>
                    <button type="button" role="tab" aria-label={t("Pending orders")} title={t("Pending orders")} aria-selected={historyFilter === "not-running"} className={historyFilter === "not-running" ? "selected" : ""} onClick={() => setHistoryFilter("not-running")}><Clock3 size={18}/><span>2</span></button>
                    <button type="button" role="tab" aria-label={t("Open positions")} title={t("Open positions")} aria-selected={historyFilter === "running"} className={historyFilter === "running" ? "selected" : ""} onClick={() => setHistoryFilter("running")}><Activity size={18}/><span>2</span></button>
                    <button type="button" role="tab" aria-label={t("Closed positions")} title={t("Closed positions")} aria-selected={historyFilter === "closed"} className={historyFilter === "closed" ? "selected" : ""} onClick={() => setHistoryFilter("closed")}><CheckCircle2 size={18}/><span>3</span></button>
                    <button type="button" role="tab" aria-label={t("Wallet transactions")} title={t("Wallet transactions")} aria-selected={historyFilter === "wallet"} className={historyFilter === "wallet" ? "selected" : ""} onClick={() => setHistoryFilter("wallet")}><Wallet size={18}/><span>3</span></button>
                  </div>
                  {historyFilter === "wallet" ? (
                    <div className="portfolio-history-list">
                      {[
                        {type:"Swap",asset:"BNB → BEAN",amount:"0.15 BNB",date:"Nov 01, 2026 · 18:42",status:"Completed",icon:"swap"},
                        {type:"Deposit",asset:"BNB",amount:"+0.80 BNB",date:"Oct 30, 2026 · 12:16",status:"Completed",icon:"deposit"},
                        {type:"Withdraw",asset:"BEAN",amount:"-250 BEAN",date:"Oct 28, 2026 · 09:35",status:"Completed",icon:"withdraw"}
                      ].map((item,index) => (
                        <article className="portfolio-history-item" key={item.type + item.date}>
                          <span className={"portfolio-history-icon " + item.icon}>{item.icon === "swap" ? <Activity size={17}/> : item.icon === "deposit" ? <ArrowDownLeft size={17}/> : <ArrowUpRight size={17}/>}</span>
                          <span className="portfolio-history-main"><strong>{t(item.type)} · {item.asset}</strong><small>{item.date}</small></span>
                          <span className="portfolio-history-value"><strong>{item.amount}</strong><small className="completed">{t(item.status)}</small></span>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="portfolio-history-list">
                      {(
                        historyFilter === "not-running" ? [
                          {name:"BTC Limit Order",pair:"BTCUSDT",date:"Limit · $67,500 · Nov 01, 2026",status:"Pending",detail:"Waiting for fill"},
                          {name:"BNB Limit Order",pair:"BNBUSDT",date:"Limit · $590 · Oct 29, 2026",status:"Pending",detail:"Waiting for fill"}
                        ] : historyFilter === "running" ? [
                          {name:"BTCUSDT",pair:"Long · 10x",date:"Entry $67,250 · Mark $68,120",status:"Open Position",detail:"+$87.00"},
                          {name:"ETHUSDT",pair:"Short · 5x",date:"Entry $3,420 · Mark $3,390",status:"Open Position",detail:"+$42.50"}
                        ] : [
                          {name:"BTCUSDT",pair:"Long · 10x",date:"Closed Nov 01, 2026",status:"Closed",detail:"+$124.50"},
                          {name:"ETHUSDT",pair:"Short · 5x",date:"Closed Oct 30, 2026",status:"Closed",detail:"+$68.20"},
                          {name:"BNBUSDT",pair:"Long · 3x",date:"Closed Oct 28, 2026",status:"Closed",detail:"-$18.40"}
                        ]
                      ).map((item) => (
                        <article className="portfolio-history-item portfolio-strategy-history-item" key={item.name}>
                          <span className={"portfolio-history-icon " + historyFilter}><CoinLogo symbol={item.name} /></span>
                          <span className="portfolio-history-main"><strong>{item.name}</strong><small>{item.pair} · {item.date}</small></span>
                          <span className="portfolio-history-value"><strong className={item.detail.startsWith("+") ? "positive" : ""}>{item.detail}</strong><small className={"history-status " + historyFilter}>{t(item.status)}</small></span>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              )}            </div>
          </section>
        )}

        {active === "edit-profile" && (
          <section className="page page-enter simple-page edit-profile-page">
            <div className="edit-profile-heading">
              <button type="button" className="edit-profile-back" onClick={() => setActive("profile")} aria-label={t("Back to profile")}><ArrowLeft size={19} /></button>
              <div><p className="eyebrow">{t("ACCOUNT")}</p><h1>{t("Edit profile")}</h1></div>
            </div>
            <form className="edit-profile-form" onSubmit={saveProfile}>
              <div className="edit-profile-photo-section">
                <div className="edit-profile-photo">
                  {profilePhoto ? <img src={profilePhoto} alt="Profile preview" /> : <span>{(profileName.trim()[0] || "E").toUpperCase()}</span>}
                </div>
                <div className="edit-profile-photo-copy">
                  <strong>{t("Profile photo")}</strong>
                  <small>{t("JPG, PNG or WEBP · Max 5 MB")}</small>
                  <button type="button" className="edit-profile-photo-button" onClick={() => profilePhotoInputRef.current?.click()}><Camera size={16} /> {t("Change photo")}</button>
                  <input ref={profilePhotoInputRef} className="profile-photo-input" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleProfilePhotoChange} />
                </div>
              </div>
              <label className="edit-profile-field">
                <span>{t("Username")}</span>
                <input type="text" value={profileName} maxLength={30} onChange={(event) => setProfileName(event.target.value)} placeholder={t("Enter username")} autoComplete="nickname" />
              </label>
              <button type="submit" className="edit-profile-save"><Save size={17} /> {t("Save changes")}</button>
            </form>
          </section>
        )}

      </div>

      <nav className={`bottom-nav ${active === "trader-profile" || active === "edit-profile" || active === "help-center" || active === "about" || active === "market-detail" ? "bottom-nav-hidden" : ""}`} aria-label={t("Main navigation")}>
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          if (item.primary) {
            return <button className="nav-item nav-create" key={item.id} onClick={() => selectTab(item)} aria-label="Create"><span className="create-orb"><Icon size={24} strokeWidth={2.4} /></span><span className="nav-label">{t("Create")}</span></button>;
          }
          return (
            <button className={`nav-item ${isActive ? "active" : ""}`} key={item.id} onClick={() => selectTab(item)} aria-label={item.label} aria-current={isActive ? "page" : undefined}>
              <Icon size={21} strokeWidth={isActive ? 2.3 : 1.8} />
              <span className="nav-label">{t(item.label)}</span>
            </button>
          );
        })}
      </nav>

      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)}>
          <aside className="app-sidebar" role="dialog" aria-modal="true" aria-label={t("Main menu")} onClick={(event) => event.stopPropagation()}>
            <div className="sidebar-heading">
              <div className="sidebar-brand">{/* [MODIFIED] Use the official Beanance logo asset. */}<img className="sidebar-brand-logo" src="/icons/logo.png" alt="Beanance" /><strong>beanance</strong></div>
              <button className="icon-button" type="button" aria-label="Close menu" onClick={() => setSidebarOpen(false)}><X size={19} /></button>
            </div>
            <button className="sidebar-account" type="button" onClick={() => {setSidebarOpen(false);selectTab({ id: "edit-profile" });}}>
              <span className="sidebar-avatar">{profilePhoto ? <img src={profilePhoto} alt="" /> : (profileName.trim()[0] || "E").toUpperCase()}</span>
              <span className="sidebar-account-copy">
                <strong>{profileName}</strong>
                <small>{profileEmail || t("Email not added")}</small>
                <span className="sidebar-account-connections">
                  <span className={binanceConnected ? "is-connected" : ""}>{binanceConnected ? <CheckCircle2 size={12} /> : <Circle size={12} />} Binance</span>
                  <span className={web3Connected ? "is-connected" : ""}>{web3Connected ? <CheckCircle2 size={12} /> : <Circle size={12} />} Web3</span>
                </span>
              </span>
              <ChevronRight size={18} />
            </button>
            <p className="eyebrow sidebar-section-label">{sidebarText.account}</p>
            <nav className="sidebar-navigation" aria-label="Account settings">
              {/* [MODIFIED] Remove the Profile item from the sidebar; keep Language as the first account menu item. */}
              <button type="button" className="sidebar-nav-item" aria-expanded={languageOpen} onClick={() => setLanguageOpen((open) => !open)}>
                <Languages size={19} /><span>{sidebarText.language}</span><small className="sidebar-current-language">{selectedLanguage.native}</small><ChevronRight className={languageOpen ? "sidebar-chevron-open" : "sidebar-item-chevron"} size={17} />
              </button>
              {languageOpen && (
                <div className="sidebar-language-list">
                  {supportedLanguages.map((item) => (
                    <button key={item.code} type="button" className={language === item.code ? "selected" : ""} onClick={() => {setLanguage(item.code);setLanguageOpen(false);}}>
                      <span>{item.flag}</span><span>{item.label}</span><small>{item.native}</small>{language === item.code && <Check size={13} strokeWidth={1.75} aria-label="Selected" />}
                    </button>
                  ))}
                </div>
              )}
              <button type="button" className="sidebar-nav-item" onClick={() => {setSidebarOpen(false);setNotice("Security settings are coming soon");}}>
                <ShieldCheck size={19} /><span>{sidebarText.security}</span><ChevronRight className="sidebar-item-chevron" size={17} />
              </button>
            </nav>
            <p className="eyebrow sidebar-section-label">{sidebarText.preferences}</p>
            <nav className="sidebar-navigation" aria-label="Preferences">
              <button type="button" className="sidebar-nav-item" onClick={() => {setSidebarOpen(false);setNotice("Notification settings are coming soon");}}>
                <Bell size={19} /><span>{sidebarText.notifications}</span><ChevronRight className="sidebar-item-chevron" size={17} />
              </button>
              <button type="button" className="sidebar-nav-item" onClick={toggleTheme}>
                <Palette size={19} /><span>{sidebarText.appearance}</span><small className="sidebar-current-language">{theme === "dark" ? "Dark" : "Light"}</small><ChevronRight className="sidebar-item-chevron" size={17} />
              </button>
            </nav>
            <p className="eyebrow sidebar-section-label">{sidebarText.support}</p>
            <nav className="sidebar-navigation" aria-label="Support">
              <button type="button" className={`sidebar-nav-item ${active === "help-center" ? "selected" : ""}`} onClick={() => {setHelpReturnTo(active);setActive("help-center");setHelpSearch("");setHelpCategory("All");setSidebarOpen(false);window.scrollTo({top:0,behavior:"instant"});}}>
                <CircleHelp size={19} /><span>{sidebarText.help}</span><ChevronRight className="sidebar-item-chevron" size={17} />
              </button>
              <button type="button" className={`sidebar-nav-item ${active === "about" ? "selected" : ""}`} onClick={() => {setAboutReturnTo(active);setActive("about");setSidebarOpen(false);window.scrollTo({top:0,behavior:"instant"});}}>
                <Info size={19} /><span>{sidebarText.about}</span><ChevronRight className="sidebar-item-chevron" size={17} />
              </button>
            </nav>
            <div className="sidebar-footer">
              <span>{sidebarText.community}</span>
              <small>{sidebarText.footer}</small>
            </div>
          </aside>
        </div>
      )}

      {showCreate && (
        <div className="modal-backdrop" onClick={() => setShowCreate(false)}>
          <section className="create-sheet" onClick={(event) => event.stopPropagation()}>
            <div className="sheet-handle" />
            <div className="sheet-heading"><div><p className="eyebrow">{t("QUICK ACTION")}</p><h2>{t("What would you like to do?")}</h2></div><button className="icon-button" onClick={() => setShowCreate(false)} aria-label="Close"><X size={20} /></button></div>
            <button className="sheet-option" onClick={() => { setShowCreate(false); setNotice("Swap flow is coming soon"); }}><span className="sheet-option-icon"><ArrowUpRight /></span><span><strong>{t("Swap tokens")}</strong><small>{t("Exchange one asset for another")}</small></span><ChevronRight /></button>
            <button className="sheet-option" onClick={() => { setShowCreate(false); setNotice("Buy crypto flow is coming soon"); }}><span className="sheet-option-icon"><Plus /></span><span><strong>{t("Buy crypto")}</strong><small>{t("Add crypto to your wallet")}</small></span><ChevronRight /></button>
            <button className="sheet-option" onClick={() => { setShowCreate(false); setNotice("Connect dApp flow is coming soon"); }}><span className="sheet-option-icon"><Compass /></span><span><strong>{t("Connect dApp")}</strong><small>{t("Explore decentralized apps")}</small></span><ChevronRight /></button>
          </section>
        </div>
      )}

      {/* [ADDED] Centered Strategy Detail modal with a fixed viewport height and internal scrolling. */}
      {selectedStrategy && (
        <div className="strategy-detail-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeStrategy(); }}>
          <section className="strategy-detail-modal" role="dialog" aria-modal="true" aria-labelledby="strategy-detail-title">
            <header className="strategy-detail-header">
              <div className="strategy-detail-heading">
                <div className={`strategy-detail-icon ${selectedStrategy.tone || "bitcoin"}`}><Layers size={21} strokeWidth={1.8}/></div>
                <div className="strategy-detail-title-wrap">
                  <h2 id="strategy-detail-title">{selectedStrategy.name}</h2>
                  <button type="button" className="strategy-detail-owner-link" onClick={() => { closeStrategy(); openTrader(selectedStrategy.owner); }}>@{selectedStrategy.owner} · {t(selectedStrategy.type)}</button>
                </div>
                <span className="strategy-detail-status">{t("Active")}</span>
              </div>
              <button type="button" className="strategy-detail-close" aria-label={t("Close")} onClick={closeStrategy}><X size={19}/></button>
            </header>

            <div className="strategy-detail-scroll">
              <section className="strategy-detail-performance">
                <div className="strategy-detail-return-row">
                  <div><span>{t("Total Return")}</span><strong className={String(selectedStrategy.returns).startsWith("-") ? "negative" : "positive"}>{selectedStrategy.returns}</strong></div>
                  <div className="strategy-detail-pnl"><span>{t("Total PnL")}</span><strong className="positive">${(selectedStrategy.currentBalance - selectedStrategy.initialBalance).toLocaleString(language, { maximumFractionDigits: 2 })}</strong></div>
                </div>
                <div className="strategy-detail-chart-heading"><span>{t("Performance")}</span><small>{t("Cumulative return")}</small></div>
                <div className="strategy-detail-timeframes" role="tablist" aria-label={t("Chart timeframe")}>
                  {["1D","7D","1M","3M","6M","1Y","ALL"].map((period) => (
                    <button type="button" role="tab" aria-selected={strategyTimeframe === period} className={strategyTimeframe === period ? "selected" : ""} key={period} onClick={() => setStrategyTimeframe(period)}>{period}</button>
                  ))}
                </div>
                <div className="strategy-detail-chart">
                  <svg viewBox="0 0 640 170" preserveAspectRatio="none" role="img" aria-label={selectedStrategy.name + " " + strategyTimeframe + " performance chart"}>
                    <defs><linearGradient id="strategy-detail-chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#20bd68" stopOpacity=".22"/><stop offset="100%" stopColor="#20bd68" stopOpacity="0"/></linearGradient></defs>
                    {[30,70,110,150].map((y) => <line key={y} x1="0" y1={y} x2="640" y2={y} stroke="currentColor" opacity=".10" strokeDasharray="4 5"/>)}
                    <path d={strategyTimeframe === "1D" ? "M0 128 L40 120 L80 126 L120 96 L160 103 L200 91 L240 98 L280 70 L320 82 L360 61 L400 70 L440 48 L480 57 L520 36 L560 44 L600 20 L640 25 L640 170 L0 170 Z" : strategyTimeframe === "7D" ? "M0 138 L40 125 L80 130 L120 112 L160 116 L200 92 L240 101 L280 83 L320 90 L360 65 L400 73 L440 52 L480 61 L520 38 L560 45 L600 23 L640 15 L640 170 L0 170 Z" : "M0 145 L40 132 L80 137 L120 111 L160 119 L200 89 L240 98 L280 73 L320 84 L360 54 L400 65 L440 43 L480 52 L520 28 L560 37 L600 16 L640 8 L640 170 L0 170 Z"} fill="url(#strategy-detail-chart-fill)"/>
                    <path d={strategyTimeframe === "1D" ? "M0 128 L40 120 L80 126 L120 96 L160 103 L200 91 L240 98 L280 70 L320 82 L360 61 L400 70 L440 48 L480 57 L520 36 L560 44 L600 20 L640 25" : strategyTimeframe === "7D" ? "M0 138 L40 125 L80 130 L120 112 L160 116 L200 92 L240 101 L280 83 L320 90 L360 65 L400 73 L440 52 L480 61 L520 38 L560 45 L600 23 L640 15" : "M0 145 L40 132 L80 137 L120 111 L160 119 L200 89 L240 98 L280 73 L320 84 L360 54 L400 65 L440 43 L480 52 L520 28 L560 37 L600 16 L640 8"} fill="none" stroke="#20bd68" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"/>
                  </svg>
                  <div className="strategy-detail-chart-axis"><span>{strategyTimeframe === "1D" ? "00:00" : strategyTimeframe === "7D" ? "7D ago" : strategyTimeframe === "ALL" ? "Start" : strategyTimeframe + " ago"}</span><span>{t("Today")}</span></div>
                </div>
              </section>

              <nav className="strategy-detail-tabs" role="tablist" aria-label={t("Strategy detail sections")}>
                {[
                  {id:"overview",label:"Overview",icon:Activity},
                  {id:"analytics",label:"Analytics",icon:BarChart3},
                  {id:"trades",label:"Trades",icon:ArrowUpDown},
                  {id:"owner",label:"Owner",icon:UserRound}
                ].map((tab) => {
                  const TabIcon = tab.icon;
                  return <button type="button" role="tab" aria-selected={strategyDetailTab === tab.id} className={strategyDetailTab === tab.id ? "selected" : ""} key={tab.id} onClick={() => setStrategyDetailTab(tab.id)}><TabIcon size={15}/><span>{t(tab.label)}</span></button>;
                })}
              </nav>

              {strategyDetailTab === "overview" && (
                <div className="strategy-detail-tab-content">
                  <div className="strategy-detail-section-title"><h3>{t("Key Statistics")}</h3><span>{t("All time")}</span></div>
                  <div className="strategy-detail-stat-grid">
                    <div><span>{t("Win Rate")}</span><strong>{selectedStrategy.win}</strong></div>
                    <div><span>{t("Total Trades")}</span><strong>{Number(selectedStrategy.trades).toLocaleString(language)}</strong></div>
                    <div><span>{t("Max Drawdown")}</span><strong className="negative">{selectedStrategy.maxDrawdown}</strong></div>
                    <div><span>{t("Profit Factor")}</span><strong>{selectedStrategy.profitFactor}</strong></div>
                  </div>
                  <div className="strategy-detail-section-title"><h3>{t("Capital & AUM")}</h3><span>{t("Strategy account")}</span></div>
                  <div className="strategy-detail-capital-grid">
                    <div><span>{t("Initial Balance")}</span><strong>${selectedStrategy.initialBalance.toLocaleString(language)}</strong></div>
                    <div><span>{t("Current Balance")}</span><strong>${selectedStrategy.currentBalance.toLocaleString(language, { maximumFractionDigits: 2 })}</strong></div>
                    <div><span>{t("Current AUM")}</span><strong>${selectedStrategy.aum.toLocaleString(language)}</strong></div>
                    <div><span>{t("Active Copiers")}</span><strong>{selectedStrategy.copiers}</strong></div>
                  </div>
                  <div className="strategy-detail-section-title"><h3>{t("Trading Information")}</h3></div>
                  <div className="strategy-detail-info-list">
                    <div><span>{t("Trading Pair")}</span><strong>{selectedStrategy.pair}</strong></div>
                    <div><span>{t("Strategy Type")}</span><strong>{t(selectedStrategy.type)}</strong></div>
                    <div><span>{t("Risk Level")}</span><strong>{t(selectedStrategy.risk)}</strong></div>
                    <div><span>{t("Leverage")}</span><strong>{selectedStrategy.leverage}</strong></div>
                    <div><span>{t("Strategy Age")}</span><strong>{selectedStrategy.age} {t("days")}</strong></div>
                  </div>
                </div>
              )}

              {strategyDetailTab === "analytics" && (
                <div className="strategy-detail-tab-content">
                  <div className="strategy-detail-section-title"><h3>{t("Risk & Returns")}</h3><span>{t("All time")}</span></div>
                  <div className="strategy-detail-stat-grid">
                    <div><span>{t("Sharpe Ratio")}</span><strong>{selectedStrategy.sharpe}</strong></div>
                    <div><span>{t("Profit Factor")}</span><strong>{selectedStrategy.profitFactor}</strong></div>
                    <div><span>{t("Average Win")}</span><strong className="positive">{selectedStrategy.avgWin}</strong></div>
                    <div><span>{t("Average Loss")}</span><strong className="negative">{selectedStrategy.avgLoss}</strong></div>
                  </div>
                  <div className="strategy-detail-section-title"><h3>{t("Monthly Returns")}</h3><span>{t("Illustrative data")}</span></div>
                  <div className="strategy-detail-month-bars">
                    {["Jun","Jul","Aug","Sep","Oct","Nov"].map((month,index) => <div key={month}><span>{month}</span><i style={{height:[38,55,46,72,62,88][index] + "%"}}/><b>{["+4.2%","+7.1%","+5.8%","+9.4%","+8.1%","+12.8%"][index]}</b></div>)}
                  </div>
                  <p className="strategy-detail-note">{t("Strategy performance metrics are illustrative demo data and are not live trading results.")}</p>
                </div>
              )}

              {strategyDetailTab === "trades" && (
                <div className="strategy-detail-tab-content">
                  <div className="strategy-detail-section-title"><h3>{t("Recent Trade History")}</h3><span>{t("Latest activity")}</span></div>
                  <div className="strategy-detail-trade-list">
                    {[
                      {pair:selectedStrategy.pair,side:"LONG",entry:"$67,420.50",exit:"$70,286.87",pnl:"+4.25%",time:"Today · 10:32"},
                      {pair:selectedStrategy.pair,side:"SHORT",entry:"$69,120.00",exit:"$68,290.56",pnl:"+1.20%",time:"Yesterday · 18:20"},
                      {pair:selectedStrategy.pair,side:"LONG",entry:"$66,800.00",exit:"$65,864.80",pnl:"-1.40%",time:"Yesterday · 09:15"},
                      {pair:selectedStrategy.pair,side:"LONG",entry:"$64,250.00",exit:"$66,176.50",pnl:"+3.00%",time:"Oct 30 · 14:45"}
                    ].map((trade,index) => <div className="strategy-detail-trade-row" key={trade.time}><div><strong>{trade.pair}</strong><span>{trade.side} · {trade.time}</span><small>{t("Entry")}: {trade.entry} · {t("Exit")}: {trade.exit}</small></div><b className={trade.pnl.startsWith("-") ? "negative" : "positive"}>{trade.pnl}</b></div>)}
                  </div>
                  <p className="strategy-detail-note">{t("Recent trades shown are sample data for the Beanance demo.")}</p>
                </div>
              )}

              {strategyDetailTab === "owner" && (
                <div className="strategy-detail-tab-content strategy-detail-owner-panel">
                  <div className="strategy-detail-owner-card">
                    <div className={`strategy-detail-owner-avatar trader-avatar-${["tradewiz","cryptofox","moontrade","quantalab","solking"].indexOf(selectedStrategy.owner)+1}`}>{selectedStrategy.owner.charAt(0).toUpperCase()}</div>
                    <div className="strategy-detail-owner-main"><strong>{selectedStrategy.ownerName}</strong><span>@{selectedStrategy.owner}</span><small><BadgeCheck size={13}/> {t("Verified trader")}</small></div>
                    <button type="button" onClick={() => { const owner = selectedStrategy.owner; closeStrategy(); openTrader(owner); }}>{t("View Profile")}</button>
                  </div>
                  <p className="strategy-detail-owner-bio">{selectedStrategy.ownerBio}</p>
                  <div className="strategy-detail-stat-grid">
                    <div><span>{t("Followers")}</span><strong>{selectedStrategy.ownerFollowers}</strong></div>
                    <div><span>{t("Strategies")}</span><strong>{traderProfiles[selectedStrategy.owner]?.strategies.length || 1}</strong></div>
                    <div><span>{t("Win Rate")}</span><strong>{selectedStrategy.win}</strong></div>
                    <div><span>{t("Active for")}</span><strong>{selectedStrategy.age}d</strong></div>
                  </div>
                </div>
              )}
            </div>

            <footer className="strategy-detail-footer">
              <span>{t("Demo statistics")}</span>
              <button type="button" className="strategy-detail-copy-button" onClick={() => setNotice(`Copy trading for ${selectedStrategy.name} is coming soon`)}><Copy size={15}/>{t("Copy Strategy")}</button>
            </footer>
          </section>
        </div>
      )}


      {notice && <div className="toast" role="status">{notice}</div>}
    </main>
  );
}

export default App;
