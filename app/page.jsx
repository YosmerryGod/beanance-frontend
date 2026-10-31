"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  Users,
  CalendarDays,
  Activity,
  Bell,
  ChevronRight,
  CircleHelp,
  Compass,
  Copy,
  Eye,
  EyeOff,
  Grid2X2,
  LayoutDashboard,
  Plus,
  Search,
  SlidersHorizontal,
  Settings,
  ShieldCheck,
  UserRound,
  Wallet,
  X,
  BarChart3,
  Bitcoin,
  Moon,
  Sun,
} from "lucide-react";

const navigation = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "dapps", label: "Discover", icon: Compass },
  { id: "create", label: "Create", icon: Plus, primary: true },
  { id: "market", label: "Market", icon: BarChart3 },
  { id: "profile", label: "Profile", icon: UserRound },
];

const assets = [
  { symbol: "BTC", name: "Bitcoin", amount: "0.08421 BTC", value: "$5,482.20", change: "+2.45%", positive: true, icon: "₿", tone: "bitcoin" },
  { symbol: "ETH", name: "Ethereum", amount: "1.2840 ETH", value: "$3,820.40", change: "+1.82%", positive: true, icon: "Ξ", tone: "ethereum" },
  { symbol: "BNB", name: "BNB", amount: "4.520 BNB", value: "$2,945.60", change: "-0.64%", positive: false, icon: "◆", tone: "bnb" },
];

const dapps = [
  { name: "PancakeSwap", category: "DeFi · Exchange", description: "Swap tokens and provide liquidity.", icon: "🥞", color: "dapp-yellow", users: "2.4M" },
  { name: "Venus", category: "DeFi · Lending", description: "Supply and borrow digital assets.", icon: "☄", color: "dapp-purple", users: "840K" },
  { name: "OpenSea", category: "NFT · Marketplace", description: "Discover digital collectibles.", icon: "🌊", color: "dapp-blue", users: "1.2M" },
  { name: "Galxe", category: "Web3 · Community", description: "Explore quests and Web3 campaigns.", icon: "✦", color: "dapp-pink", users: "960K" },
];

const traderProfiles = {
  tradewiz: { name: "TradeWiz", bio: "Trend trader focused on disciplined entries, market structure, and consistent risk management.", followers: "342", returns: "+124.5%", win: "68%", trades: "680", age: "240 days", strategies: [{ name: "BTC Trend Master", type: "Trend Following", risk: "Medium Risk", returns: "+124.5%", win: "68%", trades: "680" }, { name: "BTC Momentum", type: "Momentum", risk: "Medium Risk", returns: "+42.8%", win: "65%", trades: "214" }, { name: "Market Structure Pro", type: "Swing Trading", risk: "Low Risk", returns: "+28.4%", win: "71%", trades: "96" }] },
  cryptofox: { name: "CryptoFox", bio: "Systematic scalper looking for high-probability setups across major crypto pairs.", followers: "1.2K", returns: "+89.2%", win: "72%", trades: "1,240", age: "120 days", strategies: [{ name: "Scalping AI v2", type: "Scalping", risk: "Low Risk", returns: "+89.2%", win: "72%", trades: "1,240" }, { name: "ETH Quick Moves", type: "Scalping", risk: "Medium Risk", returns: "+36.7%", win: "69%", trades: "328" }] },
  moontrade: { name: "MoonTrade", bio: "Breakout trader combining momentum and volatility to capture market opportunities.", followers: "856", returns: "+68.1%", win: "63%", trades: "310", age: "75 days", strategies: [{ name: "ETH Breakout", type: "Breakout", risk: "Medium Risk", returns: "+68.1%", win: "63%", trades: "310" }, { name: "SOL Momentum", type: "Momentum", risk: "High Risk", returns: "+31.2%", win: "61%", trades: "184" }] },
  quantalab: { name: "QuantaLab", bio: "Quant-minded trader exploring rule-based strategies and measurable market edges.", followers: "432", returns: "+54.3%", win: "58%", trades: "92", age: "35 days", strategies: [{ name: "BNB Momentum", type: "Momentum", risk: "Low Risk", returns: "+54.3%", win: "58%", trades: "92" }] },
  solking: { name: "SolKing", bio: "Solana ecosystem trader focused on momentum and trend continuation.", followers: "321", returns: "+48.7%", win: "61%", trades: "45", age: "18 days", strategies: [{ name: "SOL Trend Rider", type: "Trend Following", risk: "Medium Risk", returns: "+48.7%", win: "61%", trades: "45" }] }
};

const marketAssets = [
  { symbol: "BTC", name: "Bitcoin", price: "$65,120.40", change: "+2.45%", positive: true, icon: "₿", tone: "bitcoin", volume: "$28.4B" },
  { symbol: "ETH", name: "Ethereum", price: "$2,976.80", change: "+1.82%", positive: true, icon: "Ξ", tone: "ethereum", volume: "$14.2B" },
  { symbol: "BNB", name: "BNB", price: "$651.23", change: "-0.64%", positive: false, icon: "◆", tone: "bnb", volume: "$1.8B" },
  { symbol: "SOL", name: "Solana", price: "$158.72", change: "+4.21%", positive: true, icon: "◎", tone: "solana", volume: "$3.9B" },
  { symbol: "XRP", name: "XRP", price: "$0.6241", change: "-1.12%", positive: false, icon: "X", tone: "xrp", volume: "$1.1B" },
];

function App() {
  const [active, setActive] = useState("dashboard");
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [notice, setNotice] = useState("");
  const [theme, setTheme] = useState("dark");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [traderPeriod, setTraderPeriod] = useState("All");
  const [marketFilter, setMarketFilter] = useState("Favorites");
  const [mobileDashboardTab, setMobileDashboardTab] = useState("traders");
  const [discoverTopTab, setDiscoverTopTab] = useState("strategies");
  const [discoverFilter, setDiscoverFilter] = useState("All");
  const [showDiscoverFilter, setShowDiscoverFilter] = useState(false);
  const [discoverCriteria, setDiscoverCriteria] = useState({ minWinRate: "0", minAge: "0", minTrades: "0", minReturn: "0", risk: "All", sort: "popular" });
  const [selectedTrader, setSelectedTrader] = useState("tradewiz");
  const [traderReturnTo, setTraderReturnTo] = useState("dashboard");
  const [traderProfileTab, setTraderProfileTab] = useState("trades");
  const [traderTradeFilter, setTraderTradeFilter] = useState("open");
  const [traderStrategyFilter, setTraderStrategyFilter] = useState("active");
  const searchInputRef = useRef(null);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("beanance-theme");
    if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("beanance-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((current) => current === "dark" ? "light" : "dark");

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
    if (item.id === "create") {
      setShowCreate(true);
      return;
    }
    setActive(item.id);
    setSearchOpen(false);
    setSearchQuery("");
    setShowNotifications(false);
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
        <header className={`topbar ${searchOpen ? "search-expanded" : ""} ${active === "trader-profile" ? "trader-profile-topbar-hidden" : ""}`}>
          {active === "trader-profile" ? (
            <div className="trader-profile-header-placeholder" />
          ) : (
            <div className={`nav-greeting ${active === "dapps" ? "discover-greeting-hidden" : ""}`}>
              <p className="eyebrow">{active === "profile" ? "YOUR ACCOUNT" : "GOOD EVENING"}</p>
              <strong>{active === "profile" ? "Hey, Ezy" : "Welcome back, Ezy"}</strong>
            </div>
          )}
          {active === "dapps" && (
            <div className={`discover-nav-tabs ${searchOpen ? "is-hidden" : ""}`} role="tablist" aria-label="Discover category">
              <button className={discoverTopTab === "strategies" ? "selected" : ""} onClick={() => {setDiscoverTopTab("strategies");setDiscoverFilter("All");}}>Strategies</button>
              <button className={discoverTopTab === "traders" ? "selected" : ""} onClick={() => {setDiscoverTopTab("traders");setDiscoverFilter("All");}}>Traders</button>
            </div>
          )}
          <div className="top-actions">
            {active === "dashboard" && (
              <div className="notification-wrap">
                <button className="icon-button notification-button" aria-label="Notifications" aria-expanded={showNotifications} onClick={() => setShowNotifications((current) => !current)}>
                  <Bell size={19} />
                  <i />
                </button>
                {showNotifications && (
                  <div className="notification-popover">
                    <div className="notification-heading"><strong>Notifications</strong><button onClick={() => setShowNotifications(false)} aria-label="Close notifications"><X size={16} /></button></div>
                    <div className="notification-item unread"><span className="notification-dot" /><div><strong>Wallet connected</strong><p>Your demo wallet is ready to use.</p><small>Just now</small></div></div>
                    <div className="notification-item"><span className="notification-symbol">↗</span><div><strong>Market update</strong><p>Bitcoin is up 2.45% in the demo market.</p><small>12 minutes ago</small></div></div>
                    <div className="notification-item"><span className="notification-symbol">✦</span><div><strong>Welcome to Beanance</strong><p>Explore assets and discover Web3 apps.</p><small>Today</small></div></div>
                    <button className="notification-footer" onClick={() => setShowNotifications(false)}>Mark all as read</button>
                  </div>
                )}
              </div>
            )}
            {(active === "dapps" || active === "market") && (
              <div className={`header-search ${searchOpen ? "is-open" : ""}`}>
                <Search size={18} />
                <input
                  ref={searchInputRef}
                  aria-label={active === "dapps" ? "Search strategies and traders" : "Search market assets"}
                  placeholder={active === "dapps" ? "Search strategies or traders..." : "Search assets..."}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => { if (event.key === "Escape") { setSearchOpen(false); setSearchQuery(""); } }}
                  tabIndex={searchOpen ? 0 : -1}
                />
                {searchOpen && <button className="search-close" onClick={() => { setSearchOpen(false); setSearchQuery(""); }} aria-label="Close search"><X size={17} /></button>}
                {!searchOpen && <button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="Open search" />}
              </div>
            )}
            {active !== "profile" && (
              <button className="icon-button theme-toggle" aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} onClick={toggleTheme}>
                {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
              </button>
            )}
          </div>
        </header>

        {active === "dashboard" && (
          <section className="page page-enter dashboard-page">
            <section className="dashboard-section">
              <div className="section-heading dashboard-section-heading">
                <div><h2>Top Strategies</h2><p className="muted">Best performing strategies from our community</p></div>
                <button className="text-link" onClick={() => setNotice("All strategies are coming soon")}>See All <ChevronRight size={15} /></button>
              </div>
              <div className="strategy-grid">
                {[
                  {name:"BTC Trend Master",user:"@tradewiz",symbol:"₿",tone:"bitcoin",returns:"+124.5%",win:"68%",type:"Trend Following",risk:"Medium Risk",riskTone:"medium",chart:"M2 40 L18 31 L34 35 L50 23 L66 29 L82 19 L98 27 L114 17 L130 23 L146 12 L162 18 L178 9 L194 16 L210 5 L226 12 L242 3 L258 10 L274 0"},
                  {name:"Scalping AI v2",user:"@cryptofox",symbol:"◆",tone:"ethereum",returns:"+89.2%",win:"72%",type:"Scalping",risk:"Low Risk",riskTone:"low",chart:"M2 42 L18 35 L34 38 L50 28 L66 31 L82 20 L98 26 L114 18 L130 22 L146 13 L162 18 L178 8 L194 13 L210 5 L226 10 L242 2 L258 7 L274 -1"},
                  {name:"ETH Breakout",user:"@moontrade",symbol:"◎",tone:"solana",returns:"+68.1%",win:"63%",type:"Breakout",risk:"Medium Risk",riskTone:"medium",chart:"M2 43 L18 35 L34 39 L50 29 L66 34 L82 24 L98 29 L114 19 L130 24 L146 14 L162 20 L178 10 L194 15 L210 7 L226 12 L242 3 L258 8 L274 -2"}
                ].map((strategy) => (
                  <article className="strategy-card" key={strategy.name}>
                    <div className="strategy-card-head">
                      <div className={`strategy-coin ${strategy.tone}`}>{strategy.symbol}</div>
                      <div className="strategy-identity"><strong>{strategy.name}</strong><button className="strategy-owner-link" onClick={() => openTrader(strategy.user)}>{strategy.user}</button></div>
                      <button className="strategy-more" aria-label={`More about ${strategy.name}`} onClick={() => setNotice(`${strategy.name} details are coming soon`)}>•••</button>
                    </div>
                    <svg className="strategy-chart" viewBox="0 0 276 48" preserveAspectRatio="none" aria-label="Strategy performance chart">
                      <defs><linearGradient id={`strategy-fill-${strategy.name.replaceAll(" ","-")}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#20c56a" stopOpacity=".24"/><stop offset="100%" stopColor="#20c56a" stopOpacity="0"/></linearGradient></defs>
                      <path d={`${strategy.chart} L274 48 L2 48 Z`} fill={`url(#strategy-fill-${strategy.name.replaceAll(" ","-")})`}/>
                      <path d={strategy.chart} fill="none" stroke="#20bd68" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                    </svg>
                    <div className="strategy-metrics"><div><strong className="positive">{strategy.returns}</strong><span>Total Return</span></div><div><strong>{strategy.win}</strong><span>Win Rate</span></div></div>
                    <div className="strategy-card-footer"><span className="strategy-tag">{strategy.type}</span><span className={`risk-tag risk-${strategy.riskTone}`}>{strategy.risk}</span><button onClick={() => setNotice(`Following ${strategy.name} is a demo action`)}>Follow</button></div>
                  </article>
                ))}
              </div>
            </section>

            <div className="mobile-dashboard-tabs" role="tablist" aria-label="Dashboard data">
              <button role="tab" aria-selected={mobileDashboardTab === "traders"} className={mobileDashboardTab === "traders" ? "selected" : ""} onClick={() => setMobileDashboardTab("traders")}>Top Traders</button>
              <button role="tab" aria-selected={mobileDashboardTab === "market"} className={mobileDashboardTab === "market" ? "selected" : ""} onClick={() => setMobileDashboardTab("market")}>Market Overview</button>
            </div>
            <section className={`dashboard-section mobile-tab-panel mobile-traders-panel ${mobileDashboardTab === "traders" ? "mobile-tab-active" : ""}`}>
              <div className="section-heading dashboard-section-heading traders-heading">
                <div><h2>Top Traders</h2><p className="muted">Most consistent and successful traders</p></div>
                <div className="section-tools"><div className="period-tabs">{["All","1M","3M","6M","1Y"].map((period) => <button className={traderPeriod === period ? "selected" : ""} key={period} onClick={() => setTraderPeriod(period)}>{period}</button>)}</div><button className="text-link" onClick={() => setNotice("All traders are coming soon")}>See All <ChevronRight size={15} /></button></div>
              </div>
              <div className="dashboard-table-wrap">
                <table className="dashboard-table trader-table">
                  <thead><tr><th>#</th><th>Trader</th><th>Followers</th><th>Return ({traderPeriod === "All" ? "30D" : traderPeriod})</th><th>Win Rate</th><th>Equity Curve</th><th>Action</th></tr></thead>
                  <tbody>
                    {[
                      ["tradewiz","342","+124.5%","68%","🥇"],
                      ["cryptofox","1.2K","+89.2%","72%","🥈"],
                      ["moontrade","856","+68.1%","63%","🥉"],
                      ["quantalab","432","+54.3%","58%",""],
                      ["solking","321","+48.7%","61%",""]
                    ].map((trader,index) => <tr key={trader[0]}><td><span className="rank-cell">{index+1}</span></td><td><button className="trader-name trader-name-button" onClick={() => openTrader(trader[0])}><span className={`trader-avatar trader-avatar-${index+1}`}>{["T","C","M","Q","S"][index]}</span><strong>{trader[0]}</strong><span className="verified-mark">✓</span></button></td><td>{trader[1]}</td><td className="positive">{trader[2]}</td><td>{trader[3]}</td><td><svg className="table-sparkline" viewBox="0 0 110 28" preserveAspectRatio="none"><path d="M1 24 L10 19 L18 21 L27 13 L36 16 L45 10 L54 13 L63 8 L72 11 L81 5 L90 8 L100 2 L109 4" fill="none" stroke="#20bd68" strokeWidth="1.8"/></svg></td><td><button className="table-follow" onClick={() => setNotice(`Following @${trader[0]} is a demo action`)}>Follow</button></td></tr>)}
                  </tbody>
                </table>
              </div>
            </section>

            <section className={`dashboard-section market-overview-section mobile-tab-panel mobile-market-panel ${mobileDashboardTab === "market" ? "mobile-tab-active" : ""}`}>
              <div className="section-heading dashboard-section-heading">
                <div><h2>Market Overview</h2><p className="muted">Top futures pairs by volume</p></div>
                <div className="section-tools"><div className="period-tabs market-tabs">{["Favorites","All","Futures","Crypto"].map((filter) => <button className={marketFilter === filter ? "selected" : ""} key={filter} onClick={() => setMarketFilter(filter)}>{filter}</button>)}</div><button className="text-link" onClick={() => setActive("market")}>See All <ChevronRight size={15} /></button></div>
              </div>
              <div className="dashboard-table-wrap">
                <table className="dashboard-table market-table">
                  <thead><tr><th>#</th><th>Pair</th><th>Price</th><th>24h Change</th><th>24h Volume</th><th>Chart</th><th>★</th></tr></thead>
                  <tbody>
                    {marketAssets.filter((asset) => marketFilter !== "Favorites" || ["BTC","BNB"].includes(asset.symbol)).map((asset,index) => <tr key={asset.symbol}><td>{index+1}</td><td><div className="market-pair"><span className={`asset-icon ${asset.tone}`}>{asset.icon}</span><div><strong>{asset.symbol}USDT</strong><small>{asset.symbol}</small></div></div></td><td>{asset.price.replace("$","")}</td><td className={asset.positive ? "positive" : "negative"}>{asset.change}</td><td>{asset.volume}</td><td><svg className="table-sparkline" viewBox="0 0 110 28" preserveAspectRatio="none"><path d={asset.positive ? "M1 24 L10 19 L18 21 L27 13 L36 16 L45 10 L54 13 L63 8 L72 11 L81 5 L90 8 L100 2 L109 4" : "M1 3 L10 8 L18 5 L27 12 L36 9 L45 15 L54 12 L63 18 L72 15 L81 21 L90 18 L100 25 L109 23"} fill="none" stroke={asset.positive ? "#20bd68" : "#e45b5b"} strokeWidth="1.8"/></svg></td><td><button className="favorite-star" onClick={() => setNotice(`${asset.symbol} favorites are demo only`)}>☆</button></td></tr>)}
                  </tbody>
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
                  {rank:2,name:"BTC Trend Master",user:"@tradewiz",metric:"+124.5%",detail:"Total return",avatar:"₿",tone:"bitcoin"},
                  {rank:1,name:"Scalping AI v2",user:"@cryptofox",metric:"+89.2%",detail:"Total return",avatar:"◆",tone:"ethereum"},
                  {rank:3,name:"ETH Breakout",user:"@moontrade",metric:"+68.1%",detail:"Total return",avatar:"◎",tone:"solana"}
                ] : [
                  {rank:2,name:"cryptofox",user:"1.2K followers",metric:"+89.2%",detail:"30D return",avatar:"C",tone:"trader-avatar-2"},
                  {rank:1,name:"tradewiz",user:"342 followers",metric:"+124.5%",detail:"30D return",avatar:"T",tone:"trader-avatar-1"},
                  {rank:3,name:"moontrade",user:"856 followers",metric:"+68.1%",detail:"30D return",avatar:"M",tone:"trader-avatar-3"}
                ]).map((item) => (
                  <article className={`discover-podium-card podium-rank-${item.rank}`} key={item.name}>
                    <span className="podium-rank">{item.rank}</span>
                    <div className={`discover-avatar ${item.tone}`}>{item.avatar}</div>
                    <strong>{item.name}</strong>
                    <small>{item.user}</small>
                    <b className="positive">{item.metric}</b>
                    <span className="podium-detail">{item.detail}</span>
                    <button onClick={() => setNotice(discoverTopTab === "strategies" ? `Strategy ${item.name} selected` : `Opening @${item.name} profile`)}>{discoverTopTab === "strategies" ? "View strategy" : "View profile"}</button>
                  </article>
                ))}
              </div>
            </section>

            <section className="discover-list-section">
              <div className="discover-section-heading discover-list-heading">
                <div><h2>{discoverTopTab === "strategies" ? "Explore Strategies" : "Explore Traders"}</h2><p className="muted">{discoverTopTab === "strategies" ? "Pilih strategi sesuai gaya trading kamu." : "Kenali trader dan performa mereka."}</p></div>
                <div className="discover-filter-wrap">
                  <button className={`discover-filter-icon ${showDiscoverFilter ? "selected" : ""}`} aria-label="Open filters" aria-expanded={showDiscoverFilter} onClick={() => setShowDiscoverFilter((value) => !value)}><SlidersHorizontal size={17} /></button>
                  {showDiscoverFilter && (
                    <div className="discover-filter-popover">
                      <div className="discover-filter-popover-head"><strong>Filter {discoverTopTab === "strategies" ? "strategies" : "traders"}</strong><button aria-label="Close filters" onClick={() => setShowDiscoverFilter(false)}><X size={16} /></button></div>
                      <label>Minimum win rate<select value={discoverCriteria.minWinRate} onChange={(event) => setDiscoverCriteria((value) => ({ ...value, minWinRate: event.target.value }))}><option value="0">Any win rate</option><option value="50">Above 50%</option><option value="60">Above 60%</option><option value="70">Above 70%</option><option value="80">Above 80%</option></select></label>
                      <label>Trader age<select value={discoverCriteria.minAge} onChange={(event) => setDiscoverCriteria((value) => ({ ...value, minAge: event.target.value }))}><option value="0">Any age</option><option value="30">30+ days</option><option value="90">90+ days</option><option value="180">6+ months</option><option value="365">1+ year</option></select></label>
                      <label>Minimum total trades<select value={discoverCriteria.minTrades} onChange={(event) => setDiscoverCriteria((value) => ({ ...value, minTrades: event.target.value }))}><option value="0">Any trades</option><option value="50">50+ trades</option><option value="100">100+ trades</option><option value="500">500+ trades</option><option value="1000">1,000+ trades</option></select></label>
                      {discoverTopTab === "strategies" && <><label>Minimum return<select value={discoverCriteria.minReturn} onChange={(event) => setDiscoverCriteria((value) => ({ ...value, minReturn: event.target.value }))}><option value="0">Any return</option><option value="20">Above 20%</option><option value="50">Above 50%</option><option value="80">Above 80%</option><option value="100">Above 100%</option></select></label><label>Risk level<select value={discoverCriteria.risk} onChange={(event) => setDiscoverCriteria((value) => ({ ...value, risk: event.target.value }))}><option value="All">All risk levels</option><option value="Low Risk">Low risk</option><option value="Medium Risk">Medium risk</option><option value="High Risk">High risk</option></select></label></>}
                      <label>Sort by<select value={discoverCriteria.sort} onChange={(event) => setDiscoverCriteria((value) => ({ ...value, sort: event.target.value }))}><option value="popular">Most popular</option><option value="newest">Newest</option><option value="win">Highest win rate</option><option value="return">Highest return</option></select></label>
                      <div className="discover-filter-actions"><button onClick={() => { setDiscoverCriteria({ minWinRate: "0", minAge: "0", minTrades: "0", minReturn: "0", risk: "All", sort: "popular" }); setDiscoverFilter("All"); }}>Reset</button><button className="apply" onClick={() => setShowDiscoverFilter(false)}>Apply filters</button></div>
                    </div>
                  )}
                </div>
              </div>
              <div className="discover-card-list">
                {discoverTopTab === "strategies" ? [
                  {name:"BTC Trend Master",user:"@tradewiz",type:"Trend Following",risk:"Medium Risk",returns:"+124.5%",win:"68%",age:240,trades:680,tone:"bitcoin",symbol:"₿",tag:"Trending"},
                  {name:"Scalping AI v2",user:"@cryptofox",type:"Scalping",risk:"Low Risk",returns:"+89.2%",win:"72%",age:120,trades:1240,tone:"ethereum",symbol:"◆",tag:"Low Risk"},
                  {name:"ETH Breakout",user:"@moontrade",type:"Breakout",risk:"Medium Risk",returns:"+68.1%",win:"63%",age:75,trades:310,tone:"solana",symbol:"◎",tag:"Trending"},
                  {name:"BNB Momentum",user:"@quantalab",type:"Momentum",risk:"Low Risk",returns:"+54.3%",win:"58%",age:35,trades:92,tone:"bnb",symbol:"◆",tag:"Low Risk"}
                ].filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.user.toLowerCase().includes(searchQuery.toLowerCase())).filter((item) => Number(item.win.replace("%","")) >= Number(discoverCriteria.minWinRate) && item.age >= Number(discoverCriteria.minAge) && item.trades >= Number(discoverCriteria.minTrades) && Number(item.returns.replace(/[+%]/g,"")) >= Number(discoverCriteria.minReturn) && (discoverCriteria.risk === "All" || item.risk === discoverCriteria.risk) && (discoverFilter === "All" || (discoverFilter === "Trending" ? item.tag === "Trending" : discoverFilter === "Low Risk" ? item.risk === "Low Risk" : Number(item.returns.replace(/[+%]/g,"")) >= 80))).sort((a,b) => discoverCriteria.sort === "win" ? Number(b.win.replace("%","")) - Number(a.win.replace("%","")) : discoverCriteria.sort === "return" ? Number(b.returns.replace(/[+%]/g,"")) - Number(a.returns.replace(/[+%]/g,"")) : discoverCriteria.sort === "newest" ? a.age - b.age : 0).map((item) => (
                  <article className="discover-list-card" key={item.name}>
                    <div className={`discover-avatar ${item.tone}`}>{item.symbol}</div>
                    <div className="discover-card-main"><strong>{item.name}</strong><button className="discover-owner-link" onClick={() => openTrader(item.user)}>{item.user} · {item.type}</button><small>{item.risk}</small></div>
                    <div className="discover-card-stats"><strong className="positive">{item.returns}</strong><span>{item.win} win rate</span></div>
                    <button onClick={() => setNotice(`Following ${item.name} is a demo action`)}>Follow</button>
                  </article>
                )) : [
                  {name:"tradewiz",followers:"342",returns:"+124.5%",win:"68%",age:240,trades:680,avatar:"T",tone:"trader-avatar-1",verified:true},
                  {name:"cryptofox",followers:"1.2K",returns:"+89.2%",win:"72%",age:120,trades:1240,avatar:"C",tone:"trader-avatar-2",verified:true},
                  {name:"moontrade",followers:"856",returns:"+68.1%",win:"63%",age:75,trades:310,avatar:"M",tone:"trader-avatar-3",verified:true},
                  {name:"quantalab",followers:"432",returns:"+54.3%",win:"58%",age:35,trades:92,avatar:"Q",tone:"trader-avatar-4",verified:true},
                  {name:"solking",followers:"321",returns:"+48.7%",win:"61%",age:18,trades:45,avatar:"S",tone:"trader-avatar-5",verified:true}
                ].filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())).filter((item) => Number(item.win.replace("%","")) >= Number(discoverCriteria.minWinRate) && item.age >= Number(discoverCriteria.minAge) && item.trades >= Number(discoverCriteria.minTrades) && Number(item.returns.replace(/[+%]/g,"")) >= Number(discoverCriteria.minReturn) && (discoverFilter === "All" || discoverFilter === "Verified" || (discoverFilter === "Most Followers" ? parseFloat(item.followers) >= 800 : Number(item.returns.replace(/[+%]/g,"")) >= 80))).sort((a,b) => discoverCriteria.sort === "win" ? Number(b.win.replace("%","")) - Number(a.win.replace("%","")) : discoverCriteria.sort === "return" ? Number(b.returns.replace(/[+%]/g,"")) - Number(a.returns.replace(/[+%]/g,"")) : discoverCriteria.sort === "newest" ? a.age - b.age : discoverCriteria.sort === "popular" ? parseFloat(b.followers) - parseFloat(a.followers) : 0).map((item) => (
                  <article className="discover-list-card trader-discover-card" key={item.name} onClick={() => openTrader(item.name)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) openTrader(item.name); }}>
                    <div className={`discover-avatar ${item.tone}`}>{item.avatar}</div>
                    <div className="discover-card-main"><strong>{item.name} <span className="verified-mark">✓</span></strong><span>{item.followers} followers</span><small>Consistent trader · {item.age} days active</small></div>
                    <div className="discover-card-stats"><strong className="positive">{item.returns}</strong><span>{item.win} win rate</span></div>
                    <button onClick={(event) => { event.stopPropagation(); setNotice(`Following @${item.name} is a demo action`); }}>Follow</button>
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
                <button className="trader-profile-back trader-profile-inline-back" onClick={closeTraderProfile}><ArrowLeft size={17} /><span>Back</span></button>
                <span>BEANANCE TRADER</span><div className="trader-profile-cover-mark">B</div>
              </div>
              <div className="trader-profile-identity">
                <div className={`trader-profile-avatar trader-avatar-${["tradewiz","cryptofox","moontrade","quantalab","solking"].indexOf(selectedTrader)+1}`}>{selectedTrader.charAt(0).toUpperCase()}</div>
                <div className="trader-profile-name"><div><h1>@{selectedTrader}</h1><span className="verified-mark">✓</span></div><p>{traderProfiles[selectedTrader].name} · Verified trader</p></div>
                <button className="trader-follow-button" onClick={() => setNotice(`Following @${selectedTrader} is a demo action`)}>Follow Trader</button>
              </div>
              <p className="trader-profile-bio">{traderProfiles[selectedTrader].bio}</p>
              <div className="trader-profile-meta">
                <span><Users size={14}/>{traderProfiles[selectedTrader].followers} followers</span>
                <span><CalendarDays size={14}/>Active for {traderProfiles[selectedTrader].age}</span>
                <span><Activity size={14}/>{traderProfiles[selectedTrader].strategies.length} strategies</span>
              </div>
            </div>

            <div className="trader-profile-workspace">
              <div className="trader-profile-tabs" role="tablist" aria-label="Trader activity">
                <button role="tab" aria-selected={traderProfileTab === "trades"} className={traderProfileTab === "trades" ? "selected" : ""} onClick={() => setTraderProfileTab("trades")}>Trades <span>Activity</span></button>
                <button role="tab" aria-selected={traderProfileTab === "strategies"} className={traderProfileTab === "strategies" ? "selected" : ""} onClick={() => setTraderProfileTab("strategies")}>Strategies <span>{traderProfiles[selectedTrader].strategies.length}</span></button>
              </div>

              {traderProfileTab === "trades" && (
                <section className="trader-profile-section trader-activity-section">
                  <div className="trader-profile-section-heading">
                    <div><h2>Trade history</h2></div>
                    <span className="trader-strategy-count">Demo activity</span>
                  </div>
                  <div className="trader-subtabs" role="tablist" aria-label="Trade status">
                    <button className={traderTradeFilter === "open" ? "selected" : ""} onClick={() => setTraderTradeFilter("open")}>Open positions <span>2</span></button>
                    <button className={traderTradeFilter === "closed" ? "selected" : ""} onClick={() => setTraderTradeFilter("closed")}>Closed trades <span>4</span></button>
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
                          <div className="trader-trade-pair"><span className={`trader-trade-coin trader-trade-coin-${trade.pair.startsWith("BTC") ? "btc" : trade.pair.startsWith("ETH") ? "eth" : trade.pair.startsWith("SOL") ? "sol" : "bnb"}`}>{trade.pair.startsWith("BTC") ? "₿" : trade.pair.startsWith("ETH") ? "Ξ" : trade.pair.startsWith("SOL") ? "◎" : "◆"}</span><div><strong>{trade.pair}</strong><small>{trade.strategy}</small></div></div>
                          <div className="trader-trade-badges"><span className={`trade-side-badge ${trade.side.toLowerCase()}`}>{trade.side}</span><span className={`trade-status-badge ${traderTradeFilter}`}>{traderTradeFilter === "open" ? "OPEN" : "CLOSED"}</span></div>
                        </div>
                        <div className="trader-trade-data">
                          <div><span>Entry price</span><strong>{trade.entry}</strong></div>
                          <div><span>{traderTradeFilter === "open" ? "Mark price" : "Exit price"}</span><strong>{trade.mark}</strong></div>
                          <div><span>Position size</span><strong>{trade.size}</strong></div>
                          <div><span>{traderTradeFilter === "open" ? "Unrealized PnL" : "Realized PnL"}</span><strong className={trade.pnl.startsWith("-") ? "negative" : "positive"}>{trade.pnl}<small>{trade.change}</small></strong></div>
                        </div>
                        <div className="trader-trade-footer"><span>{trade.date}</span><span>{traderTradeFilter === "open" ? "Isolated · 5x" : "Trade completed"}</span></div>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {traderProfileTab === "strategies" && (
                <section className="trader-profile-section trader-strategy-overview-section">
                  <div className="trader-profile-section-heading"><div><h2>Strategies by @{selectedTrader}</h2></div><span className="trader-strategy-count">{traderProfiles[selectedTrader].strategies.length} total</span></div>
                  <div className="trader-subtabs" role="tablist" aria-label="Strategy status">
                    <button className={traderStrategyFilter === "active" ? "selected" : ""} onClick={() => setTraderStrategyFilter("active")}>Active <span>{Math.max(1,traderProfiles[selectedTrader].strategies.length-1)}</span></button>
                    <button className={traderStrategyFilter === "inactive" ? "selected" : ""} onClick={() => setTraderStrategyFilter("inactive")}>Inactive <span>{Math.max(0,traderProfiles[selectedTrader].strategies.length-Math.max(1,traderProfiles[selectedTrader].strategies.length-1))}</span></button>
                  </div>
                  <div className="trader-strategy-performance-list">
                    {traderProfiles[selectedTrader].strategies.filter((strategy,index) => traderStrategyFilter === "active" ? index < Math.max(1,traderProfiles[selectedTrader].strategies.length-1) : index >= Math.max(1,traderProfiles[selectedTrader].strategies.length-1)).length === 0 ? (
                      <div className="trader-empty-state"><Activity size={20}/><strong>No inactive strategies</strong><span>Trader ini belum memiliki strategi yang dinonaktifkan.</span></div>
                    ) : traderProfiles[selectedTrader].strategies.filter((strategy,index) => traderStrategyFilter === "active" ? index < Math.max(1,traderProfiles[selectedTrader].strategies.length-1) : index >= Math.max(1,traderProfiles[selectedTrader].strategies.length-1)).map((strategy,index) => (
                      <article className="trader-strategy-performance-card" key={strategy.name}>
                        <div className="trader-strategy-performance-heading">
                          <div className="trader-owned-strategy-icon"><Activity size={18}/></div>
                          <div className="trader-owned-strategy-main"><div className="trader-strategy-name-line"><strong>{strategy.name}</strong><span className={`trader-strategy-risk-inline ${strategy.risk.toLowerCase().replace(" risk","")}`}>{strategy.risk}</span></div><span>{strategy.type}</span></div>
                          <div className="trader-strategy-actions">
                            <span className={`strategy-status-pill ${traderStrategyFilter}`}>{traderStrategyFilter === "active" ? "Active" : "Inactive"}</span>
                            {traderStrategyFilter === "active" && <button className="trader-copy-button" onClick={() => setNotice(`Copy trading for ${strategy.name} is coming soon`)}><Copy size={13}/> Copy</button>}
                          </div>
                        </div>
                        <div className="trader-strategy-metrics">
                          <div><span>30D Return</span><strong className="positive">{strategy.returns}</strong></div>
                          <div><span>Win Rate</span><strong>{strategy.win}</strong></div>
                          <div><span>Total Trades</span><strong>{strategy.trades}</strong></div>
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
                          <div className="trader-chart-axis"><span>30D ago</span><span>Today</span></div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </div>
            <p className="trader-profile-disclaimer">Trade history and strategy performance shown here are sample data for the Beanance demo.</p>
          </section>
        )}

        {active === "market" && (
          <section className="page page-enter simple-page">
            <p className="eyebrow">LIVE OVERVIEW</p><h1>Market</h1>
            <p className="muted">A quick look at the crypto market.</p>
            <div className="market-summary"><span>Market sentiment</span><strong>Optimistic <b>↗</b></strong><small>Demo market data</small></div>
            <div className="section-heading market-heading"><div><p className="eyebrow">WATCHLIST</p><h2>Top assets</h2></div><button className="text-link" onClick={() => setNotice("Full market is coming soon")}>See all <ChevronRight size={15} /></button></div>
            <div className="asset-list">{marketAssets.filter((asset) => `${asset.name} ${asset.symbol}`.toLowerCase().includes(searchQuery.toLowerCase())).map((asset) => <article className="asset-row market-asset-row" key={asset.symbol}><div className={`asset-icon ${asset.tone}`}>{asset.icon}</div><div className="asset-info"><strong>{asset.name}</strong><span>{asset.symbol} · Vol {asset.volume}</span></div><div className="asset-values"><strong>{asset.price}</strong><span className={asset.positive ? "positive" : "negative"}>{asset.change}</span></div></article>)}</div>
          </section>
        )}

        {active === "profile" && (
          <section className="page page-enter simple-page">
            <p className="eyebrow">YOUR ACCOUNT</p><h1>Profile</h1>
            <div className="profile-card"><div className="profile-avatar">E</div><div><strong>Ezy</strong><span>0x71C7...976F</span></div><button onClick={copyAddress}><Copy size={16} /></button></div>
            <div className="settings-list">
              <button onClick={() => setNotice("Wallet settings are coming soon")}><Wallet /><span>Wallet management</span><ChevronRight /></button>
              <button onClick={() => setNotice("Security settings are coming soon")}><ShieldCheck /><span>Security & privacy</span><ChevronRight /></button>
              <button onClick={() => setNotice("Preferences are coming soon")}><Settings /><span>Preferences</span><ChevronRight /></button>
              <button onClick={() => setNotice("Help center is coming soon")}><CircleHelp /><span>Help center</span><ChevronRight /></button>
            </div>
          </section>
        )}
      </div>

      <nav className={`bottom-nav ${active === "trader-profile" ? "bottom-nav-hidden" : ""}`} aria-label="Main navigation">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          if (item.primary) {
            return <button className="nav-item nav-create" key={item.id} onClick={() => selectTab(item)} aria-label="Create"><span className="create-orb"><Icon size={24} strokeWidth={2.4} /></span><span className="nav-label">Create</span></button>;
          }
          return (
            <button className={`nav-item ${isActive ? "active" : ""}`} key={item.id} onClick={() => selectTab(item)} aria-label={item.label} aria-current={isActive ? "page" : undefined}>
              <Icon size={21} strokeWidth={isActive ? 2.3 : 1.8} />
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {showCreate && (
        <div className="modal-backdrop" onClick={() => setShowCreate(false)}>
          <section className="create-sheet" onClick={(event) => event.stopPropagation()}>
            <div className="sheet-handle" />
            <div className="sheet-heading"><div><p className="eyebrow">QUICK ACTION</p><h2>What would you like to do?</h2></div><button className="icon-button" onClick={() => setShowCreate(false)} aria-label="Close"><X size={20} /></button></div>
            <button className="sheet-option" onClick={() => { setShowCreate(false); setNotice("Swap flow is coming soon"); }}><span className="sheet-option-icon"><ArrowUpRight /></span><span><strong>Swap tokens</strong><small>Exchange one asset for another</small></span><ChevronRight /></button>
            <button className="sheet-option" onClick={() => { setShowCreate(false); setNotice("Buy crypto flow is coming soon"); }}><span className="sheet-option-icon"><Plus /></span><span><strong>Buy crypto</strong><small>Add crypto to your wallet</small></span><ChevronRight /></button>
            <button className="sheet-option" onClick={() => { setShowCreate(false); setNotice("Connect dApp flow is coming soon"); }}><span className="sheet-option-icon"><Compass /></span><span><strong>Connect dApp</strong><small>Explore decentralized apps</small></span><ChevronRight /></button>
          </section>
        </div>
      )}
      {notice && <div className="toast" role="status">{notice}</div>}
    </main>
  );
}

export default App;
