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
  { id: "dapps", label: "dApps", icon: Grid2X2 },
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

            <section className="dashboard-section">
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

            <section className="dashboard-section market-overview-section">
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
          <section className="page page-enter simple-page">
            <p className="eyebrow">DISCOVER WEB3</p><h1>Explore dApps</h1>
            <p className="muted">Find decentralized apps across your favorite networks.</p>
            <div className="search-field"><Search size={18} /><span>Search decentralized apps</span></div>
            <div className="feature-tile"><div className="feature-symbol"><Compass /></div><div><strong>Discover something new</strong><p>Explore DeFi, games, NFT and more.</p></div><ChevronRight /></div>
            <div className="dapp-list">{dapps.filter((dapp) => `${dapp.name} ${dapp.category} ${dapp.description}`.toLowerCase().includes(searchQuery.toLowerCase())).map((dapp) => <article className="dapp-row" key={dapp.name}><div className={`dapp-icon ${dapp.color}`}>{dapp.icon}</div><div className="dapp-info"><strong>{dapp.name}</strong><span>{dapp.category}</span><small>{dapp.description}</small></div><button className="dapp-connect" onClick={() => setNotice(`Connecting to ${dapp.name} is a demo action`)}>Open</button></article>)}</div>
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
