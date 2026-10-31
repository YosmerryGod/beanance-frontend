"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
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
  const [discoverListTab, setDiscoverListTab] = useState("strategies");
  const [discoverFilter, setDiscoverFilter] = useState("All");
  const searchInputRef = useRef(null);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("beanance-theme");
    if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("beanance-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((current) => current === "dark" ? "light" : "dark");

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
        <header className={`topbar ${searchOpen ? "search-expanded" : ""}`}>
          <div className="nav-greeting">
            <p className="eyebrow">{active === "profile" ? "YOUR ACCOUNT" : "GOOD EVENING"}</p>
            <strong>{active === "profile" ? "Hey, Ezy" : "Welcome back, Ezy"}</strong>
          </div>
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
                  aria-label={active === "dapps" ? "Search dApps" : "Search market assets"}
                  placeholder={active === "dapps" ? "Search dApps..." : "Search assets..."}
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
                      <div className="strategy-identity"><strong>{strategy.name}</strong><span>{strategy.user}</span></div>
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
                    ].map((trader,index) => <tr key={trader[0]}><td><span className="rank-cell">{index+1}</span></td><td><div className="trader-name"><span className={`trader-avatar trader-avatar-${index+1}`}>{["T","C","M","Q","S"][index]}</span><strong>{trader[0]}</strong><span className="verified-mark">✓</span></div></td><td>{trader[1]}</td><td className="positive">{trader[2]}</td><td>{trader[3]}</td><td><svg className="table-sparkline" viewBox="0 0 110 28" preserveAspectRatio="none"><path d="M1 24 L10 19 L18 21 L27 13 L36 16 L45 10 L54 13 L63 8 L72 11 L81 5 L90 8 L100 2 L109 4" fill="none" stroke="#20bd68" strokeWidth="1.8"/></svg></td><td><button className="table-follow" onClick={() => setNotice(`Following @${trader[0]} is a demo action`)}>Follow</button></td></tr>)}
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
            <div className="discover-intro">
              <p className="eyebrow">BEANANCE COMMUNITY</p>
              <h1>Discover</h1>
              <p className="muted">Temukan strategi trading dan trader terbaik dari komunitas.</p>
            </div>

            <section className="discover-top-section">
              <div className="discover-section-heading">
                <div><h2>Top 3</h2><p className="muted">Peringkat terbaik komunitas</p></div>
                <div className="discover-switch" role="tablist" aria-label="Top ranking">
                  <button className={discoverTopTab === "strategies" ? "selected" : ""} onClick={() => setDiscoverTopTab("strategies")}>Strategies</button>
                  <button className={discoverTopTab === "traders" ? "selected" : ""} onClick={() => setDiscoverTopTab("traders")}>Traders</button>
                </div>
              </div>
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
                <div><h2>{discoverListTab === "strategies" ? "Explore Strategies" : "Explore Traders"}</h2><p className="muted">{discoverListTab === "strategies" ? "Pilih strategi sesuai gaya trading kamu." : "Kenali trader dan performa mereka."}</p></div>
                <div className="discover-switch discover-list-switch" role="tablist" aria-label="Discover list">
                  <button className={discoverListTab === "strategies" ? "selected" : ""} onClick={() => {setDiscoverListTab("strategies");setDiscoverFilter("All");}}>Strategies</button>
                  <button className={discoverListTab === "traders" ? "selected" : ""} onClick={() => {setDiscoverListTab("traders");setDiscoverFilter("All");}}>Traders</button>
                </div>
              </div>
              <div className="discover-filters" aria-label="Filter discover results">
                {(discoverListTab === "strategies" ? ["All","Trending","Low Risk","High Return"] : ["All","Verified","Most Followers","Top Return"]).map((filter) => (
                  <button key={filter} className={discoverFilter === filter ? "selected" : ""} onClick={() => setDiscoverFilter(filter)}>{filter}</button>
                ))}
              </div>
              <div className="discover-card-list">
                {discoverListTab === "strategies" ? [
                  {name:"BTC Trend Master",user:"@tradewiz",type:"Trend Following",risk:"Medium Risk",returns:"+124.5%",win:"68%",tone:"bitcoin",symbol:"₿",tag:"Trending"},
                  {name:"Scalping AI v2",user:"@cryptofox",type:"Scalping",risk:"Low Risk",returns:"+89.2%",win:"72%",tone:"ethereum",symbol:"◆",tag:"Low Risk"},
                  {name:"ETH Breakout",user:"@moontrade",type:"Breakout",risk:"Medium Risk",returns:"+68.1%",win:"63%",tone:"solana",symbol:"◎",tag:"Trending"},
                  {name:"BNB Momentum",user:"@quantalab",type:"Momentum",risk:"Low Risk",returns:"+54.3%",win:"58%",tone:"bnb",symbol:"◆",tag:"Low Risk"}
                ].filter((item) => discoverFilter === "All" || (discoverFilter === "Trending" ? item.tag === "Trending" : discoverFilter === "Low Risk" ? item.risk === "Low Risk" : Number(item.returns.replace(/[+%]/g,"")) >= 80)).map((item) => (
                  <article className="discover-list-card" key={item.name}>
                    <div className={`discover-avatar ${item.tone}`}>{item.symbol}</div>
                    <div className="discover-card-main"><strong>{item.name}</strong><span>{item.user} · {item.type}</span><small>{item.risk}</small></div>
                    <div className="discover-card-stats"><strong className="positive">{item.returns}</strong><span>{item.win} win rate</span></div>
                    <button onClick={() => setNotice(`Following ${item.name} is a demo action`)}>Follow</button>
                  </article>
                )) : [
                  {name:"tradewiz",followers:"342",returns:"+124.5%",win:"68%",avatar:"T",tone:"trader-avatar-1",verified:true},
                  {name:"cryptofox",followers:"1.2K",returns:"+89.2%",win:"72%",avatar:"C",tone:"trader-avatar-2",verified:true},
                  {name:"moontrade",followers:"856",returns:"+68.1%",win:"63%",avatar:"M",tone:"trader-avatar-3",verified:true},
                  {name:"quantalab",followers:"432",returns:"+54.3%",win:"58%",avatar:"Q",tone:"trader-avatar-4",verified:true},
                  {name:"solking",followers:"321",returns:"+48.7%",win:"61%",avatar:"S",tone:"trader-avatar-5",verified:true}
                ].filter((item) => discoverFilter === "All" || discoverFilter === "Verified" || (discoverFilter === "Most Followers" ? parseFloat(item.followers) >= 800 : Number(item.returns.replace(/[+%]/g,"")) >= 80)).map((item) => (
                  <article className="discover-list-card" key={item.name}>
                    <div className={`discover-avatar ${item.tone}`}>{item.avatar}</div>
                    <div className="discover-card-main"><strong>{item.name} <span className="verified-mark">✓</span></strong><span>{item.followers} followers</span><small>Consistent trader</small></div>
                    <div className="discover-card-stats"><strong className="positive">{item.returns}</strong><span>{item.win} win rate</span></div>
                    <button onClick={() => setNotice(`Following @${item.name} is a demo action`)}>Follow</button>
                  </article>
                ))}
              </div>
            </section>
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

      <nav className="bottom-nav" aria-label="Main navigation">
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
