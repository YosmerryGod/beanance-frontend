import { useState } from "react";
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
  ChartNoAxesCombined,
  Bitcoin,
} from "lucide-react";

const navigation = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "dapps", label: "dApps", icon: Grid2X2 },
  { id: "create", label: "Create", icon: Plus, primary: true },
  { id: "market", label: "Market", icon: ChartNoAxesCombined },
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

  const selectTab = (item) => {
    if (item.id === "create") {
      setShowCreate(true);
      return;
    }
    setActive(item.id);
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
    <main className="app-shell">
      <div className="app-content">
        <header className="topbar">
          <a className="brand" href="#home" onClick={() => setActive("dashboard")} aria-label="Beanance home">
            <span className="brand-mark"><span /></span>
            <span>beanance</span>
          </a>
          <div className="top-actions">
            <button className="icon-button" aria-label="Search" onClick={() => setNotice("Search is coming soon")}>
              <Search size={19} />
            </button>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => setNotice("You're all caught up")}>
              <Bell size={19} />
              <i />
            </button>
            <button className="avatar-button" aria-label="Open profile" onClick={() => setActive("profile")}>E</button>
          </div>
        </header>

        {active === "dashboard" && (
          <section className="page page-enter">
            <div className="welcome-row">
              <div>
                <p className="eyebrow">SATURDAY, OCTOBER 31</p>
                <h1>Welcome back, Ezy <span>✦</span></h1>
                <p className="muted">Here’s what’s happening with your wallet.</p>
              </div>
              <span className="status-pill"><i /> Wallet connected</span>
            </div>

            <section className="balance-card">
              <div className="balance-card-top">
                <div className="balance-label"><Wallet size={16} /> Total balance</div>
                <button className="visibility-button" onClick={() => setBalanceVisible(!balanceVisible)} aria-label="Toggle balance visibility">
                  {balanceVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              <div className="balance-value">{balanceVisible ? "$12,840.50" : "••••••••"}</div>
              <div className="balance-change"><span>↗ 8.42%</span><small>+$997.24 this month</small></div>
              <div className="balance-glow glow-one" />
              <div className="balance-glow glow-two" />
              <div className="balance-watermark">B</div>
              <div className="wallet-address">
                <span><i /> 0x71C7...976F</span>
                <button onClick={copyAddress} aria-label="Copy wallet address"><Copy size={14} /></button>
              </div>
            </section>

            <div className="quick-actions">
              <button onClick={() => setNotice("Receive flow is coming soon")}><span><ArrowDownLeft size={20} /></span>Receive</button>
              <button onClick={() => setNotice("Send flow is coming soon")}><span><ArrowUpRight size={20} /></span>Send</button>
              <button onClick={() => setShowCreate(true)}><span><Plus size={20} /></span>Buy crypto</button>
              <button onClick={() => setActive("dapps")}><span><Compass size={20} /></span>Explore</button>
            </div>

            <section className="section-block">
              <div className="section-heading">
                <div><p className="eyebrow">YOUR PORTFOLIO</p><h2>Your assets</h2></div>
                <button className="text-link" onClick={() => setActive("market")}>View market <ChevronRight size={15} /></button>
              </div>
              <div className="asset-list">
                {assets.map((asset) => (
                  <article className="asset-row" key={asset.symbol}>
                    <div className={`asset-icon ${asset.tone}`}>{asset.icon}</div>
                    <div className="asset-info"><strong>{asset.name}</strong><span>{asset.amount}</span></div>
                    <div className="asset-values"><strong>{balanceVisible ? asset.value : "••••"}</strong><span className={asset.positive ? "positive" : "negative"}>{asset.change}</span></div>
                  </article>
                ))}
              </div>
            </section>

            <section className="promo-card">
              <div className="promo-icon"><ShieldCheck size={21} /></div>
              <div><strong>Your assets, your control.</strong><p>Keep your wallet secure. Never share your recovery phrase.</p></div>
              <ChevronRight size={18} />
            </section>
          </section>
        )}

        {active === "dapps" && (
          <section className="page page-enter simple-page">
            <p className="eyebrow">DISCOVER WEB3</p><h1>Explore dApps</h1>
            <p className="muted">Find decentralized apps across your favorite networks.</p>
            <div className="search-field"><Search size={18} /><span>Search decentralized apps</span></div>
            <div className="feature-tile"><div className="feature-symbol"><Compass /></div><div><strong>Discover something new</strong><p>Explore DeFi, games, NFT and more.</p></div><ChevronRight /></div>
            <div className="dapp-list">{dapps.map((dapp) => <article className="dapp-row" key={dapp.name}><div className={`dapp-icon ${dapp.color}`}>{dapp.icon}</div><div className="dapp-info"><strong>{dapp.name}</strong><span>{dapp.category}</span><small>{dapp.description}</small></div><button className="dapp-connect" onClick={() => setNotice(`Connecting to ${dapp.name} is a demo action`)}>Open</button></article>)}</div>
          </section>
        )}

        {active === "market" && (
          <section className="page page-enter simple-page">
            <p className="eyebrow">LIVE OVERVIEW</p><h1>Market</h1>
            <p className="muted">A quick look at the crypto market.</p>
            <div className="market-summary"><span>Market sentiment</span><strong>Optimistic <b>↗</b></strong><small>Demo market data</small></div>
            <div className="section-heading market-heading"><div><p className="eyebrow">WATCHLIST</p><h2>Top assets</h2></div><button className="text-link" onClick={() => setNotice("Full market is coming soon")}>See all <ChevronRight size={15} /></button></div>
            <div className="asset-list">{marketAssets.map((asset) => <article className="asset-row market-asset-row" key={asset.symbol}><div className={`asset-icon ${asset.tone}`}>{asset.icon}</div><div className="asset-info"><strong>{asset.name}</strong><span>{asset.symbol} · Vol {asset.volume}</span></div><div className="asset-values"><strong>{asset.price}</strong><span className={asset.positive ? "positive" : "negative"}>{asset.change}</span></div></article>)}</div>
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
            return <button className="nav-item nav-create" key={item.id} onClick={() => selectTab(item)} aria-label="Create"><span className="create-orb"><Icon size={24} strokeWidth={2.4} /></span></button>;
          }
          return (
            <button className={`nav-item ${isActive ? "active" : ""}`} key={item.id} onClick={() => selectTab(item)} aria-label={item.label} aria-current={isActive ? "page" : undefined}>
              <Icon size={21} strokeWidth={isActive ? 2.3 : 1.8} />
              {isActive && <span className="nav-label">{item.label}</span>}
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
