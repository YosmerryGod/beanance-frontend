"use client";

import { useEffect, useRef, useState } from "react";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
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
  Eye,
  EyeOff,
  Grid2X2,
  LayoutDashboard,
  Languages, // [ADDED] Language settings icon
  Palette, // [ADDED] Appearance settings icon
  Info, // [ADDED] About Beanance icon
  Menu, // [ADDED] Sidebar menu icon
  Plus,
  Search,
  Star,
  SlidersHorizontal,
  Settings,
  ShieldCheck,
  UserRound,
  Wallet,
  X,
  BarChart3,
  Layers, // [ADDED] Portfolio strategy tab icon
  TrendingUp, // [ADDED] Portfolio performance icon
  Clock3, // [ADDED] Portfolio transaction history icon
  Target, // [ADDED] Portfolio win-rate metric icon
  Bitcoin,
  Moon,
  Sun,
} from "lucide-react";


const supportedLanguages = [
  { code: "en", label: "English", native: "English", flag: "🇬🇧" },
  { code: "zh", label: "Chinese", native: "简体中文", flag: "🇨🇳" },
  { code: "id", label: "Indonesian", native: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "ja", label: "Japanese", native: "日本語", flag: "🇯🇵" },
  { code: "vi", label: "Vietnamese", native: "Tiếng Việt", flag: "🇻🇳" },
];

const sidebarTranslations = {
  en: { account: "ACCOUNT", preferences: "PREFERENCES", support: "SUPPORT", profile: "Profile", language: "Language", security: "Security", notifications: "Notifications", appearance: "Appearance", help: "Help Center", about: "About Beanance", menu: "MENU", community: "BEANANCE COMMUNITY", footer: "Explore markets and trading strategies" },
  zh: { account: "账户", preferences: "偏好设置", support: "支持", profile: "个人资料", language: "语言", security: "安全", notifications: "通知", appearance: "外观", help: "帮助中心", about: "关于 Beanance", menu: "菜单", community: "BEANANCE 社区", footer: "探索市场和交易策略" },
  id: { account: "AKUN", preferences: "PREFERENSI", support: "BANTUAN", profile: "Profil", language: "Bahasa", security: "Keamanan", notifications: "Notifikasi", appearance: "Tampilan", help: "Pusat Bantuan", about: "Tentang Beanance", menu: "MENU", community: "KOMUNITAS BEANANCE", footer: "Jelajahi market dan strategi trading" },
  ja: { account: "アカウント", preferences: "設定", support: "サポート", profile: "プロフィール", language: "言語", security: "セキュリティ", notifications: "通知", appearance: "外観", help: "ヘルプセンター", about: "Beananceについて", menu: "メニュー", community: "BEANANCE コミュニティ", footer: "市場と取引戦略をチェック" },
  vi: { account: "TÀI KHOẢN", preferences: "TÙY CHỈNH", support: "HỖ TRỢ", profile: "Hồ sơ", language: "Ngôn ngữ", security: "Bảo mật", notifications: "Thông báo", appearance: "Giao diện", help: "Trung tâm trợ giúp", about: "Về Beanance", menu: "DANH MỤC", community: "CỘNG ĐỒNG BEANANCE", footer: "Khám phá thị trường và chiến lược giao dịch" },
};

const appTranslations = {
  "en": {},
  "id": {
    "Dashboard": "Beranda",
    "Discover": "Jelajahi",
    "Create": "Buat",
    "Market": "Pasar",
    "Profile": "Profil",
    "Strategies": "Strategi",
    "Traders": "Trader",
    "All Market": "Semua Pasar",
    "Top Movers": "Pergerakan Teratas",
    "Notifications": "Notifikasi",
    "Wallet connected": "Dompet terhubung",
    "Your demo wallet is ready to use.": "Dompet demo kamu siap digunakan.",
    "Just now": "Baru saja",
    "Market update": "Pembaruan pasar",
    "Bitcoin is up 2.45% in the demo market.": "Bitcoin naik 2,45% di pasar demo.",
    "Welcome to Beanance": "Selamat datang di Beanance",
    "Explore assets and discover Web3 apps.": "Jelajahi aset dan aplikasi Web3.",
    "12 minutes ago": "12 menit lalu",
    "Today": "Hari ini",
    "Mark all as read": "Tandai semua sudah dibaca",
    "Top Strategies": "Strategi Teratas",
    "Best performing strategies from our community": "Strategi dengan performa terbaik dari komunitas kami",
    "See All": "Lihat Semua",
    "Total Return": "Total Return",
    "Win Rate": "Tingkat Kemenangan",
    "Follow": "Ikuti",
    "Top Traders": "Trader Teratas",
    "Most consistent and successful traders": "Trader paling konsisten dan sukses",
    "Trader": "Trader",
    "Followers": "Pengikut",
    "Return": "Return",
    "Equity Curve": "Kurva Ekuitas",
    "Action": "Aksi",
    "Market Overview": "Ringkasan Pasar",
    "Top futures pairs by volume": "Pasangan futures berdasarkan volume",
    "Pair": "Pasangan",
    "Price": "Harga",
    "24h Change": "Perubahan 24 Jam",
    "24h Volume": "Volume 24 Jam",
    "Chart": "Grafik",
    "Explore Strategies": "Jelajahi Strategi",
    "Explore Traders": "Jelajahi Trader",
    "Pilih strategi sesuai gaya trading kamu.": "Pilih strategi sesuai gaya trading kamu.",
    "Kenali trader dan performa mereka.": "Kenali trader dan performa mereka.",
    "View strategy": "Lihat strategi",
    "View profile": "Lihat profil",
    "Filter": "Filter",
    "Minimum win rate": "Minimal tingkat kemenangan",
    "Any win rate": "Semua tingkat kemenangan",
    "Above 50%": "Di atas 50%",
    "Above 60%": "Di atas 60%",
    "Above 70%": "Di atas 70%",
    "Above 80%": "Di atas 80%",
    "Trader age": "Usia trader",
    "Any age": "Semua usia",
    "30+ days": "30+ hari",
    "90+ days": "90+ hari",
    "6+ months": "6+ bulan",
    "1+ year": "1+ tahun",
    "Minimum total trades": "Minimal total transaksi",
    "Any trades": "Semua transaksi",
    "50+ trades": "50+ transaksi",
    "100+ trades": "100+ transaksi",
    "500+ trades": "500+ transaksi",
    "1,000+ trades": "1.000+ transaksi",
    "Minimum return": "Minimal return",
    "Any return": "Semua return",
    "Above 20%": "Di atas 20%",
    "Above 100%": "Di atas 100%",
    "Risk level": "Tingkat risiko",
    "All risk levels": "Semua tingkat risiko",
    "Low risk": "Risiko rendah",
    "Medium risk": "Risiko sedang",
    "High risk": "Risiko tinggi",
    "Sort by": "Urutkan",
    "Most popular": "Terpopuler",
    "Newest": "Terbaru",
    "Highest win rate": "Tingkat kemenangan tertinggi",
    "Highest return": "Return tertinggi",
    "Reset": "Atur ulang",
    "Apply filters": "Terapkan filter",
    "Back": "Kembali",
    "BEANANCE TRADER": "TRADER BEANANCE",
    "Follow Trader": "Ikuti Trader",
    "Activity": "Aktivitas",
    "Trade history": "Riwayat trading",
    "Demo activity": "Aktivitas demo",
    "Open positions": "Posisi terbuka",
    "Closed trades": "Transaksi ditutup",
    "Entry price": "Harga masuk",
    "Position size": "Ukuran posisi",
    "Active": "Aktif",
    "Inactive": "Tidak aktif",
    "No inactive strategies": "Tidak ada strategi nonaktif",
    "Copy": "Salin",
    "30D Return": "Return 30 Hari",
    "Total Trades": "Total Transaksi",
    "Pasangan": "Pasangan",
    "Perubahan / Status": "Perubahan / Status",
    "Perp": "Perpetual",
    "Belum ada pergerakan untuk kategori ini.": "Belum ada pergerakan untuk kategori ini.",
    "YOUR ACCOUNT": "AKUN KAMU",
    "Hey, Ezy": "Hai, Ezy",
    "Welcome back, Ezy": "Selamat datang kembali, Ezy",
    "Name": "Nama",
    "Vol": "Volume",
    "Last price": "Harga terakhir",
    "24h change": "Perubahan 24 jam",
    "Semua": "Semua",
    "Kenaikan": "Kenaikan",
    "Penurunan": "Penurunan",
    "Pullback": "Pullback",
    "Rally": "Rally",
    "High Baru": "High Baru",
    "Low Baru": "Low Baru",
    "Wallet management": "Pengelolaan dompet",
    "Security & privacy": "Keamanan & privasi",
    "Preferences": "Preferensi",
    "Help center": "Pusat bantuan",
    "QUICK ACTION": "AKSI CEPAT",
    "What would you like to do?": "Apa yang ingin kamu lakukan?",
    "Swap tokens": "Tukar token",
    "Exchange one asset for another": "Tukar satu aset dengan aset lainnya",
    "Buy crypto": "Beli kripto",
    "Add crypto to your wallet": "Tambahkan kripto ke dompet",
    "Connect dApp": "Hubungkan dApp",
    "Explore decentralized apps": "Jelajahi aplikasi terdesentralisasi",
    "Search strategies or traders...": "Cari strategi atau trader...",
    "Search assets...": "Cari aset...",
    "Search strategies and traders": "Cari strategi dan trader",
    "Search market assets": "Cari aset pasar",
    "GOOD EVENING": "SELAMAT SORE",
    "Switch to light mode": "Ubah ke mode terang",
    "Switch to dark mode": "Ubah ke mode gelap",
    "All": "Semua",
    "Favorites": "Favorit",
    "Futures": "Futures",
    "Crypto": "Kripto",
    "Verified": "Terverifikasi",
    "Most Followers": "Pengikut terbanyak",
    "Trade history and strategy performance shown here are sample data for the Beanance demo.": "Riwayat trading dan performa strategi di sini merupakan data contoh Beanance demo.",
    "Trader ini belum memiliki strategi yang dinonaktifkan.": "Trader ini belum memiliki strategi yang dinonaktifkan."
  },
  "zh": {
    "Dashboard": "首页",
    "Discover": "发现",
    "Create": "创建",
    "Market": "市场",
    "Profile": "个人资料",
    "Strategies": "策略",
    "Traders": "交易员",
    "All Market": "全部市场",
    "Top Movers": "涨幅榜",
    "Notifications": "通知",
    "Top Strategies": "热门策略",
    "See All": "查看全部",
    "Total Return": "总回报",
    "Win Rate": "胜率",
    "Follow": "关注",
    "Top Traders": "热门交易员",
    "Market Overview": "市场概览",
    "Pair": "交易对",
    "Price": "价格",
    "24h Change": "24小时涨跌",
    "24h Volume": "24小时成交量",
    "Explore Strategies": "探索策略",
    "Explore Traders": "探索交易员",
    "Back": "返回",
    "Trade history": "交易记录",
    "Open positions": "未平仓位",
    "Closed trades": "已平仓交易",
    "Entry price": "入场价格",
    "Position size": "仓位大小",
    "Name": "名称",
    "Vol": "成交量",
    "Last price": "最新价格",
    "Search assets...": "搜索资产...",
    "Search strategies or traders...": "搜索策略或交易员...",
    "Wallet management": "钱包管理",
    "Security & privacy": "安全与隐私",
    "Preferences": "偏好设置",
    "Help center": "帮助中心",
    "QUICK ACTION": "快捷操作",
    "What would you like to do?": "你想做什么？",
    "Swap tokens": "兑换代币",
    "Buy crypto": "购买加密货币",
    "Connect dApp": "连接 dApp",
    "All": "全部",
    "Favorites": "收藏",
    "Futures": "合约",
    "Crypto": "加密货币",
    "Reset": "重置",
    "Apply filters": "应用筛选"
  },
  "ja": {
    "Dashboard": "ホーム",
    "Discover": "見つける",
    "Create": "作成",
    "Market": "市場",
    "Profile": "プロフィール",
    "Strategies": "戦略",
    "Traders": "トレーダー",
    "All Market": "すべての市場",
    "Top Movers": "値上がりランキング",
    "Notifications": "通知",
    "Top Strategies": "人気の戦略",
    "See All": "すべて表示",
    "Total Return": "総リターン",
    "Win Rate": "勝率",
    "Follow": "フォロー",
    "Top Traders": "トップトレーダー",
    "Market Overview": "市場概要",
    "Pair": "取引ペア",
    "Price": "価格",
    "24h Change": "24時間変動",
    "24h Volume": "24時間取引量",
    "Explore Strategies": "戦略を探す",
    "Explore Traders": "トレーダーを探す",
    "Back": "戻る",
    "Trade history": "取引履歴",
    "Open positions": "保有ポジション",
    "Closed trades": "決済済み取引",
    "Entry price": "エントリー価格",
    "Position size": "ポジションサイズ",
    "Name": "名前",
    "Vol": "出来高",
    "Last price": "現在価格",
    "Search assets...": "資産を検索...",
    "Search strategies or traders...": "戦略やトレーダーを検索...",
    "Wallet management": "ウォレット管理",
    "Security & privacy": "セキュリティとプライバシー",
    "Preferences": "設定",
    "Help center": "ヘルプセンター",
    "QUICK ACTION": "クイック操作",
    "What would you like to do?": "何をしますか？",
    "Swap tokens": "トークン交換",
    "Buy crypto": "暗号資産を購入",
    "Connect dApp": "dAppに接続",
    "All": "すべて",
    "Favorites": "お気に入り",
    "Futures": "先物",
    "Crypto": "暗号資産",
    "Reset": "リセット",
    "Apply filters": "フィルターを適用"
  },
  "vi": {
    "Dashboard": "Trang chủ",
    "Discover": "Khám phá",
    "Create": "Tạo",
    "Market": "Thị trường",
    "Profile": "Hồ sơ",
    "Strategies": "Chiến lược",
    "Traders": "Nhà giao dịch",
    "All Market": "Tất cả thị trường",
    "Top Movers": "Biến động mạnh",
    "Notifications": "Thông báo",
    "Top Strategies": "Chiến lược hàng đầu",
    "See All": "Xem tất cả",
    "Total Return": "Tổng lợi nhuận",
    "Win Rate": "Tỷ lệ thắng",
    "Follow": "Theo dõi",
    "Top Traders": "Nhà giao dịch hàng đầu",
    "Market Overview": "Tổng quan thị trường",
    "Pair": "Cặp giao dịch",
    "Price": "Giá",
    "24h Change": "Biến động 24h",
    "24h Volume": "Khối lượng 24h",
    "Explore Strategies": "Khám phá chiến lược",
    "Explore Traders": "Khám phá nhà giao dịch",
    "Back": "Quay lại",
    "Trade history": "Lịch sử giao dịch",
    "Open positions": "Vị thế đang mở",
    "Closed trades": "Giao dịch đã đóng",
    "Entry price": "Giá vào lệnh",
    "Position size": "Kích thước vị thế",
    "Name": "Tên",
    "Vol": "Khối lượng",
    "Last price": "Giá gần nhất",
    "Search assets...": "Tìm tài sản...",
    "Search strategies or traders...": "Tìm chiến lược hoặc nhà giao dịch...",
    "Wallet management": "Quản lý ví",
    "Security & privacy": "Bảo mật & quyền riêng tư",
    "Preferences": "Tùy chọn",
    "Help center": "Trung tâm trợ giúp",
    "QUICK ACTION": "THAO TÁC NHANH",
    "What would you like to do?": "Bạn muốn làm gì?",
    "Swap tokens": "Hoán đổi token",
    "Buy crypto": "Mua tiền mã hóa",
    "Connect dApp": "Kết nối dApp",
    "All": "Tất cả",
    "Favorites": "Yêu thích",
    "Futures": "Hợp đồng tương lai",
    "Crypto": "Tiền mã hóa",
    "Reset": "Đặt lại",
    "Apply filters": "Áp dụng bộ lọc"
  }
};


Object.assign(appTranslations.en, {
  "Trades": "Trades", "Active": "Active", "Inactive": "Inactive", "30D ago": "30D ago",
  "Trade history and strategy performance shown here are sample data for the Beanance demo.": "Trade history and strategy performance shown here are sample data for the Beanance demo.",
  "Profile": "Profile", "Beanance Account": "Beanance Account"
});
Object.assign(appTranslations.id, {
  "Trades": "Transaksi", "Active": "Aktif", "Inactive": "Tidak aktif", "30D ago": "30 hari lalu",
  "Trade history and strategy performance shown here are sample data for the Beanance demo.": "Riwayat trading dan performa strategi ini merupakan data contoh Beanance.",
  "Profile": "Profil", "Beanance Account": "Akun Beanance", "Security": "Keamanan", "Language": "Bahasa"
});
Object.assign(appTranslations.zh, {
  "Trades": "交易", "Active": "进行中", "Inactive": "未启用", "30D ago": "30天前",
  "Trade history and strategy performance shown here are sample data for the Beanance demo.": "此处的交易记录和策略表现为 Beanance 演示数据。",
  "Profile": "个人资料", "Beanance Account": "Beanance 账户", "Security": "安全", "Language": "语言"
});
Object.assign(appTranslations.ja, {
  "Trades": "取引", "Active": "有効", "Inactive": "無効", "30D ago": "30日前",
  "Trade history and strategy performance shown here are sample data for the Beanance demo.": "ここに表示される取引履歴と戦略実績はBeananceのデモデータです。",
  "Profile": "プロフィール", "Beanance Account": "Beananceアカウント", "Security": "セキュリティ", "Language": "言語"
});
Object.assign(appTranslations.en, {
  "Profile settings":"Profile settings","Profile photo":"Profile photo","JPG, PNG or WEBP · Max 5 MB":"JPG, PNG or WEBP · Max 5 MB","Change photo":"Change photo","Username":"Username","Enter username":"Enter username","Email address":"Email address","Email not added":"Email not added","Save changes":"Save changes","Connected accounts":"Connected accounts","Connection status is shown only after a verified connection.":"Connection status is shown only after a verified connection.","Connected":"Connected","Not connected":"Not connected"
});
Object.assign(appTranslations.id, {
  "Profile settings":"Pengaturan profil","Profile photo":"Foto profil","JPG, PNG or WEBP · Max 5 MB":"JPG, PNG atau WEBP · Maks. 5 MB","Change photo":"Ganti foto","Username":"Username","Enter username":"Masukkan username","Email address":"Alamat email","Email not added":"Email belum ditambahkan","Save changes":"Simpan perubahan","Connected accounts":"Akun terhubung","Connection status is shown only after a verified connection.":"Status hanya ditampilkan setelah koneksi terverifikasi.","Connected":"Terhubung","Not connected":"Belum terhubung"
});
Object.assign(appTranslations.zh, {
  "Profile settings":"个人资料设置","Profile photo":"头像","JPG, PNG or WEBP · Max 5 MB":"JPG、PNG 或 WEBP · 最大 5 MB","Change photo":"更换照片","Username":"用户名","Enter username":"输入用户名","Email address":"电子邮件","Email not added":"尚未添加邮箱","Save changes":"保存更改","Connected accounts":"已连接账户","Connection status is shown only after a verified connection.":"仅显示已验证的连接状态。","Connected":"已连接","Not connected":"未连接"
});
Object.assign(appTranslations.ja, {
  "Profile settings":"プロフィール設定","Profile photo":"プロフィール写真","JPG, PNG or WEBP · Max 5 MB":"JPG、PNG、WEBP · 最大5MB","Change photo":"写真を変更","Username":"ユーザー名","Enter username":"ユーザー名を入力","Email address":"メールアドレス","Email not added":"メール未登録","Save changes":"変更を保存","Connected accounts":"接続済みアカウント","Connection status is shown only after a verified connection.":"確認済みの接続のみ表示されます。","Connected":"接続済み","Not connected":"未接続"
});
Object.assign(appTranslations.vi, {
  "Profile settings":"Cài đặt hồ sơ","Profile photo":"Ảnh hồ sơ","JPG, PNG or WEBP · Max 5 MB":"JPG, PNG hoặc WEBP · Tối đa 5 MB","Change photo":"Đổi ảnh","Username":"Tên người dùng","Enter username":"Nhập tên người dùng","Email address":"Địa chỉ email","Email not added":"Chưa thêm email","Save changes":"Lưu thay đổi","Connected accounts":"Tài khoản đã kết nối","Connection status is shown only after a verified connection.":"Chỉ hiển thị trạng thái sau khi xác minh kết nối.","Connected":"Đã kết nối","Not connected":"Chưa kết nối"
});

Object.assign(appTranslations.vi, {
  "Trades": "Giao dịch", "Active": "Đang hoạt động", "Inactive": "Không hoạt động", "30D ago": "30 ngày trước",
  "Trade history and strategy performance shown here are sample data for the Beanance demo.": "Lịch sử giao dịch và hiệu suất chiến lược ở đây là dữ liệu mẫu của Beanance.",
  "Profile": "Hồ sơ", "Beanance Account": "Tài khoản Beanance", "Security": "Bảo mật", "Language": "Ngôn ngữ"
});


/* [ADDED] Complete common page translations for all supported locales. */
Object.assign(appTranslations.id, {
  "Trend Following":"Mengikuti Tren","Scalping":"Scalping","Breakout":"Breakout","Medium Risk":"Risiko Menengah","Low Risk":"Risiko Rendah","High Risk":"Risiko Tinggi",
  "Total return":"Total return","30D return":"Return 30 Hari","Return (30D)":"Return (30 Hari)","All":"Semua","Favorites":"Favorit","Futures":"Futures","Crypto":"Kripto",
  "View strategy":"Lihat strategi","View profile":"Lihat profil","Filter":"Filter","Filter strategies":"Filter strategi","Filter traders":"Filter trader","Open filters":"Buka filter",
  "Trending":"Tren","Low Risk":"Risiko Rendah","win rate":"tingkat kemenangan","followers":"pengikut","days active":"hari aktif",
  "Strategies by":"Strategi oleh","Verified trader":"Trader terverifikasi","Active for":"Aktif selama","strategies":"strategi",
  "Mark price":"Harga mark","Exit price":"Harga keluar","Unrealized PnL":"PnL belum terealisasi","Realized PnL":"PnL terealisasi","Opened":"Dibuka","Closed":"Ditutup","Isolated · 5x":"Isolated · 5x","Trade completed":"Transaksi selesai","Copy":"Salin",
  "Return (30D)":"Return (30 Hari)","Wallet address copied":"Alamat wallet disalin","Wallet settings are coming soon":"Pengaturan wallet segera hadir",
  "Semua":"Semua","Kenaikan":"Kenaikan","Penurunan":"Penurunan","Pullback":"Pullback","Rally":"Rally","High Baru":"High Baru","Low Baru":"Low Baru",
  "Pasangan":"Pasangan","Perubahan / Status":"Perubahan / Status","Perp":"Perpetual","Belum ada pergerakan untuk kategori ini.":"Belum ada pergerakan untuk kategori ini.",
  "Contoh tampilan sinyal pergerakan jangka pendek. Data perlu dihubungkan ke feed market real-time.":"Contoh sinyal pergerakan jangka pendek. Data perlu dihubungkan ke feed market real-time.",
  "Pilih strategi sesuai gaya trading kamu.":"Pilih strategi sesuai gaya trading kamu.","Kenali trader dan performa mereka.":"Kenali trader dan performa mereka."
});
Object.assign(appTranslations.zh, {
  "Dashboard":"首页","Discover":"发现","Create":"创建","Market":"市场","Profile":"个人资料","Strategies":"策略","Traders":"交易员",
  "Top Strategies":"热门策略","Best performing strategies from our community":"社区表现最佳的策略","See All":"查看全部","Total Return":"总回报","Win Rate":"胜率","Follow":"关注","Top Traders":"顶级交易员","Most consistent and successful traders":"表现最稳定、最成功的交易员",
  "Trader":"交易员","Followers":"关注者","Equity Curve":"权益曲线","Action":"操作","Market Overview":"市场概览","Top futures pairs by volume":"按成交量排名的热门合约交易对","Pair":"交易对","Price":"价格","24h Change":"24小时涨跌","24h Volume":"24小时成交量","Chart":"图表",
  "Explore Strategies":"探索策略","Explore Traders":"探索交易员","Pilih strategi sesuai gaya trading kamu.":"选择适合你交易风格的策略。","Kenali trader dan performa mereka.":"了解交易员及其表现。","View strategy":"查看策略","View profile":"查看资料",
  "Filter":"筛选","Filter strategies":"筛选策略","Filter traders":"筛选交易员","Minimum win rate":"最低胜率","Any win rate":"不限胜率","Above 50%":"高于50%","Above 60%":"高于60%","Above 70%":"高于70%","Above 80%":"高于80%",
  "Trader age":"交易员活跃时间","Any age":"不限时间","30+ days":"超过30天","90+ days":"超过90天","6+ months":"超过6个月","1+ year":"超过1年","Minimum total trades":"最低交易次数","Any trades":"不限交易次数","50+ trades":"超过50笔","100+ trades":"超过100笔","500+ trades":"超过500笔","1,000+ trades":"超过1,000笔",
  "Minimum return":"最低回报","Any return":"不限回报","Above 20%":"高于20%","Above 100%":"高于100%","Risk level":"风险等级","All risk levels":"所有风险等级","Low risk":"低风险","Medium risk":"中风险","High risk":"高风险","Sort by":"排序方式","Most popular":"最受欢迎","Newest":"最新","Highest win rate":"最高胜率","Highest return":"最高回报","Reset":"重置","Apply filters":"应用筛选",
  "Back":"返回","BEANANCE TRADER":"BEANANCE交易员","Follow Trader":"关注交易员","Activity":"动态","Trades":"交易","Trade history":"交易记录","Demo activity":"演示活动","Open positions":"未平仓位","Closed trades":"已平仓交易","Entry price":"入场价格","Position size":"仓位大小","Active":"启用","Inactive":"停用","No inactive strategies":"没有停用的策略","Copy":"复制","30D Return":"30天回报","Total Trades":"总交易次数","30D ago":"30天前","Today":"今天",
  "Name":"名称","Vol":"成交量","Last price":"最新价格","24h change":"24小时涨跌","All Market":"全部市场","Top Movers":"热门波动","Pasangan":"交易对","Perubahan / Status":"涨跌 / 状态","Perp":"永续合约","Semua":"全部","Kenaikan":"上涨","Penurunan":"下跌","Pullback":"回调","Rally":"反弹","High Baru":"新高","Low Baru":"新低","Belum ada pergerakan untuk kategori ini.":"此类别暂无价格变动。","Contoh tampilan sinyal pergerakan jangka pendek. Data perlu dihubungkan ke feed market real-time.":"短期价格信号示例。需要连接实时市场数据源。",
  "YOUR ACCOUNT":"您的账户","Hey, Ezy":"你好，Ezy","Welcome back, Ezy":"欢迎回来，Ezy","Wallet management":"钱包管理","Security & privacy":"安全与隐私","Preferences":"偏好设置","Help center":"帮助中心","QUICK ACTION":"快捷操作","What would you like to do?":"您想做什么？","Swap tokens":"兑换代币","Exchange one asset for another":"兑换不同资产","Buy crypto":"购买加密货币","Add crypto to your wallet":"向钱包添加加密货币","Connect dApp":"连接 dApp","Explore decentralized apps":"探索去中心化应用","Search strategies or traders...":"搜索策略或交易员...","Search assets...":"搜索资产...","Favorites":"收藏","Futures":"合约","Crypto":"加密货币","Verified":"已验证","Most Followers":"最多关注者","Mark price":"标记价格","Exit price":"退出价格","Unrealized PnL":"未实现盈亏","Realized PnL":"已实现盈亏","Strategies by":"策略创建者","Verified trader":"已验证交易员","Active for":"活跃时间","followers":"关注者","days active":"活跃天数","win rate":"胜率","Return (30D)":"30天回报","Total return":"总回报","Trend Following":"趋势跟踪","Scalping":"剥头皮","Breakout":"突破","Medium Risk":"中风险","Low Risk":"低风险","High Risk":"高风险","Trending":"热门趋势","All":"全部","1M":"1个月","3M":"3个月","6M":"6个月","1Y":"1年"
});
Object.assign(appTranslations.ja, {
  "Top Strategies":"人気の戦略","Best performing strategies from our community":"コミュニティで高い成果を上げている戦略","See All":"すべて表示","Total Return":"総リターン","Win Rate":"勝率","Follow":"フォロー","Top Traders":"トップトレーダー","Most consistent and successful traders":"安定した実績を持つトレーダー","Trader":"トレーダー","Followers":"フォロワー","Equity Curve":"資産曲線","Action":"操作","Market Overview":"マーケット概要","Top futures pairs by volume":"取引量上位の先物ペア","Pair":"取引ペア","Price":"価格","24h Change":"24時間変動","24h Volume":"24時間取引量","Chart":"チャート",
  "Explore Strategies":"戦略を探す","Explore Traders":"トレーダーを探す","Pilih strategi sesuai gaya trading kamu.":"自分の取引スタイルに合う戦略を選びましょう。","Kenali trader dan performa mereka.":"トレーダーと実績を確認しましょう。","View strategy":"戦略を見る","View profile":"プロフィールを見る","Filter":"フィルター","Minimum win rate":"最低勝率","Any win rate":"指定なし","Trader age":"運用期間","Any age":"指定なし","Minimum total trades":"最低取引回数","Minimum return":"最低リターン","Risk level":"リスクレベル","All risk levels":"すべてのリスク","Low risk":"低リスク","Medium risk":"中リスク","High risk":"高リスク","Sort by":"並び替え","Most popular":"人気順","Newest":"新着順","Highest win rate":"勝率順","Highest return":"リターン順","Reset":"リセット","Apply filters":"適用",
  "Back":"戻る","BEANANCE TRADER":"BEANANCEトレーダー","Follow Trader":"フォローする","Activity":"アクティビティ","Trades":"取引","Trade history":"取引履歴","Demo activity":"デモ取引","Open positions":"未決済ポジション","Closed trades":"決済済み取引","Entry price":"エントリー価格","Position size":"ポジションサイズ","Active":"有効","Inactive":"無効","No inactive strategies":"無効な戦略はありません","Copy":"コピー","30D Return":"30日リターン","Total Trades":"総取引数","30D ago":"30日前","Today":"今日",
  "Name":"銘柄名","Vol":"出来高","Last price":"最終価格","24h change":"24時間変動","All Market":"すべての市場","Top Movers":"値動きランキング","Pasangan":"取引ペア","Perubahan / Status":"変動 / 状態","Perp":"無期限","Semua":"すべて","Kenaikan":"上昇","Penurunan":"下落","Pullback":"押し目","Rally":"反発","High Baru":"新高値","Low Baru":"新安値","Belum ada pergerakan untuk kategori ini.":"このカテゴリーに値動きはありません。","Contoh tampilan sinyal pergerakan jangka pendek. Data perlu dihubungkan ke feed market real-time.":"短期的な値動きシグナルの例です。リアルタイム市場データへの接続が必要です。",
  "YOUR ACCOUNT":"アカウント","Hey, Ezy":"こんにちは、Ezy","Welcome back, Ezy":"おかえりなさい、Ezy","Wallet management":"ウォレット管理","Security & privacy":"セキュリティとプライバシー","Preferences":"設定","Help center":"ヘルプセンター","QUICK ACTION":"クイック操作","What would you like to do?":"何をしますか？","Swap tokens":"トークン交換","Exchange one asset for another":"資産を交換","Buy crypto":"暗号資産を購入","Add crypto to your wallet":"ウォレットに暗号資産を追加","Connect dApp":"dAppに接続","Explore decentralized apps":"分散型アプリを探す","Search strategies or traders...":"戦略やトレーダーを検索...","Search assets...":"資産を検索...","Favorites":"お気に入り","Futures":"先物","Crypto":"暗号資産","Verified":"認証済み","Most Followers":"フォロワー数順","Mark price":"マーク価格","Exit price":"決済価格","Unrealized PnL":"未実現損益","Realized PnL":"実現損益","Strategies by":"戦略作成者","Verified trader":"認証済みトレーダー","Active for":"活動期間","followers":"フォロワー","days active":"活動日数","win rate":"勝率","Return (30D)":"30日リターン","Total return":"総リターン","Trend Following":"トレンドフォロー","Scalping":"スキャルピング","Breakout":"ブレイクアウト","Medium Risk":"中リスク","Low Risk":"低リスク","High Risk":"高リスク","Trending":"トレンド","All":"すべて","1M":"1か月","3M":"3か月","6M":"6か月","1Y":"1年"
});
Object.assign(appTranslations.vi, {
  "Top Strategies":"Chiến lược hàng đầu","Best performing strategies from our community":"Các chiến lược có hiệu suất tốt nhất từ cộng đồng","See All":"Xem tất cả","Total Return":"Tổng lợi nhuận","Win Rate":"Tỷ lệ thắng","Follow":"Theo dõi","Top Traders":"Nhà giao dịch hàng đầu","Most consistent and successful traders":"Những nhà giao dịch ổn định và thành công nhất","Trader":"Nhà giao dịch","Followers":"Người theo dõi","Equity Curve":"Đường vốn","Action":"Thao tác","Market Overview":"Tổng quan thị trường","Top futures pairs by volume":"Các cặp futures có khối lượng cao nhất","Pair":"Cặp giao dịch","Price":"Giá","24h Change":"Biến động 24h","24h Volume":"Khối lượng 24h","Chart":"Biểu đồ",
  "Explore Strategies":"Khám phá chiến lược","Explore Traders":"Khám phá nhà giao dịch","Pilih strategi sesuai gaya trading kamu.":"Chọn chiến lược phù hợp với phong cách giao dịch của bạn.","Kenali trader dan performa mereka.":"Tìm hiểu nhà giao dịch và hiệu suất của họ.","View strategy":"Xem chiến lược","View profile":"Xem hồ sơ","Filter":"Bộ lọc","Minimum win rate":"Tỷ lệ thắng tối thiểu","Any win rate":"Mọi tỷ lệ thắng","Trader age":"Thời gian hoạt động","Any age":"Bất kỳ","Minimum total trades":"Số giao dịch tối thiểu","Minimum return":"Lợi nhuận tối thiểu","Risk level":"Mức độ rủi ro","All risk levels":"Tất cả mức rủi ro","Low risk":"Rủi ro thấp","Medium risk":"Rủi ro trung bình","High risk":"Rủi ro cao","Sort by":"Sắp xếp","Most popular":"Phổ biến nhất","Newest":"Mới nhất","Highest win rate":"Tỷ lệ thắng cao nhất","Highest return":"Lợi nhuận cao nhất","Reset":"Đặt lại","Apply filters":"Áp dụng bộ lọc",
  "Back":"Quay lại","BEANANCE TRADER":"NHÀ GIAO DỊCH BEANANCE","Follow Trader":"Theo dõi nhà giao dịch","Activity":"Hoạt động","Trades":"Giao dịch","Trade history":"Lịch sử giao dịch","Demo activity":"Hoạt động demo","Open positions":"Vị thế đang mở","Closed trades":"Giao dịch đã đóng","Entry price":"Giá vào lệnh","Position size":"Kích thước vị thế","Active":"Đang hoạt động","Inactive":"Không hoạt động","No inactive strategies":"Không có chiến lược không hoạt động","Copy":"Sao chép","30D Return":"Lợi nhuận 30 ngày","Total Trades":"Tổng số giao dịch","30D ago":"30 ngày trước","Today":"Hôm nay",
  "Name":"Tên","Vol":"Khối lượng","Last price":"Giá gần nhất","24h change":"Biến động 24h","All Market":"Tất cả thị trường","Top Movers":"Biến động mạnh","Pasangan":"Cặp giao dịch","Perubahan / Status":"Biến động / Trạng thái","Perp":"Vĩnh cửu","Semua":"Tất cả","Kenaikan":"Tăng","Penurunan":"Giảm","Pullback":"Điều chỉnh","Rally":"Phục hồi","High Baru":"Đỉnh mới","Low Baru":"Đáy mới","Belum ada pergerakan untuk kategori ini.":"Chưa có biến động trong danh mục này.","Contoh tampilan sinyal pergerakan jangka pendek. Data perlu dihubungkan ke feed market real-time.":"Ví dụ tín hiệu biến động ngắn hạn. Cần kết nối nguồn dữ liệu thị trường thời gian thực.",
  "YOUR ACCOUNT":"TÀI KHOẢN CỦA BẠN","Hey, Ezy":"Xin chào, Ezy","Welcome back, Ezy":"Chào mừng trở lại, Ezy","Wallet management":"Quản lý ví","Security & privacy":"Bảo mật & quyền riêng tư","Preferences":"Tùy chọn","Help center":"Trung tâm trợ giúp","QUICK ACTION":"THAO TÁC NHANH","What would you like to do?":"Bạn muốn làm gì?","Swap tokens":"Hoán đổi token","Exchange one asset for another":"Đổi tài sản này sang tài sản khác","Buy crypto":"Mua tiền mã hóa","Add crypto to your wallet":"Thêm tiền mã hóa vào ví","Connect dApp":"Kết nối dApp","Explore decentralized apps":"Khám phá ứng dụng phi tập trung","Search strategies or traders...":"Tìm chiến lược hoặc nhà giao dịch...","Search assets...":"Tìm tài sản...","Favorites":"Yêu thích","Futures":"Hợp đồng tương lai","Crypto":"Tiền mã hóa","Verified":"Đã xác minh","Most Followers":"Nhiều người theo dõi nhất","Mark price":"Giá đánh dấu","Exit price":"Giá thoát","Unrealized PnL":"PnL chưa thực hiện","Realized PnL":"PnL đã thực hiện","Strategies by":"Chiến lược của","Verified trader":"Nhà giao dịch đã xác minh","Active for":"Hoạt động trong","followers":"người theo dõi","days active":"ngày hoạt động","win rate":"tỷ lệ thắng","Return (30D)":"Lợi nhuận 30 ngày","Total return":"Tổng lợi nhuận","Trend Following":"Theo xu hướng","Scalping":"Lướt sóng","Breakout":"Đột phá","Medium Risk":"Rủi ro trung bình","Low Risk":"Rủi ro thấp","High Risk":"Rủi ro cao","Trending":"Xu hướng","All":"Tất cả","1M":"1 tháng","3M":"3 tháng","6M":"6 tháng","1Y":"1 năm"
});

// [ADDED] Translate the Portfolio navigation label in all five supported languages.
Object.assign(appTranslations.en, { "Portfolio": "Portfolio" });
Object.assign(appTranslations.id, { "Portfolio": "Portofolio" });
Object.assign(appTranslations.zh, { "Portfolio": "投资组合" });
Object.assign(appTranslations.ja, { "Portfolio": "ポートフォリオ" });
Object.assign(appTranslations.vi, { "Portfolio": "Danh mục đầu tư" });

// [ADDED] Portfolio dashboard translations for all supported languages.
Object.assign(appTranslations.en, {
  "YOUR PORTFOLIO":"YOUR PORTFOLIO","Portfolio overview":"Portfolio overview","DEMO DATA":"DEMO DATA","Total portfolio value":"Total portfolio value","Past 24 hours":"Past 24 hours","Illustrative portfolio performance chart":"Illustrative portfolio performance chart","Portfolio value trend":"Portfolio value trend","Total assets":"Total assets","24h PnL":"24h PnL","Portfolio sections":"Portfolio sections","Overview":"Overview","Assets":"Assets","Positions":"Positions","History":"History","Your assets":"Your assets","Spot asset allocation":"Spot asset allocation","Open positions":"Open positions","Your active trading positions":"Your active trading positions","open":"open","Entry":"Entry","Mark":"Mark","Recent activity":"Recent activity","Your latest portfolio transactions":"Your latest portfolio transactions","Bought":"Bought","Sold":"Sold","Received":"Received","Portfolio figures and activity are illustrative demo data. Connect an exchange or wallet to show your real balances.":"Portfolio figures and activity are illustrative demo data. Connect an exchange or wallet to show your real balances."
});
Object.assign(appTranslations.id, {
  "YOUR PORTFOLIO":"PORTOFOLIO ANDA","Portfolio overview":"Ringkasan portofolio","DEMO DATA":"DATA DEMO","Total portfolio value":"Total nilai portofolio","Past 24 hours":"24 jam terakhir","Illustrative portfolio performance chart":"Grafik performa portofolio ilustrasi","Portfolio value trend":"Tren nilai portofolio","Total assets":"Total aset","24h PnL":"PnL 24 jam","Portfolio sections":"Bagian portofolio","Overview":"Ringkasan","Assets":"Aset","Positions":"Posisi","History":"Riwayat","Your assets":"Aset Anda","Spot asset allocation":"Alokasi aset spot","Open positions":"Posisi terbuka","Your active trading positions":"Posisi trading aktif Anda","open":"terbuka","Entry":"Entry","Mark":"Harga mark","Recent activity":"Aktivitas terbaru","Your latest portfolio transactions":"Transaksi portofolio terbaru","Bought":"Beli","Sold":"Jual","Received":"Diterima","Portfolio figures and activity are illustrative demo data. Connect an exchange or wallet to show your real balances.":"Angka dan aktivitas portofolio ini merupakan data demo. Hubungkan exchange atau wallet untuk menampilkan saldo asli Anda."
});
Object.assign(appTranslations.zh, {
  "YOUR PORTFOLIO":"你的投资组合","Portfolio overview":"投资组合概览","DEMO DATA":"演示数据","Total portfolio value":"投资组合总价值","Past 24 hours":"过去24小时","Illustrative portfolio performance chart":"投资组合表现示意图","Portfolio value trend":"投资组合价值趋势","Total assets":"总资产","24h PnL":"24小时盈亏","Portfolio sections":"投资组合栏目","Overview":"概览","Assets":"资产","Positions":"持仓","History":"历史记录","Your assets":"你的资产","Spot asset allocation":"现货资产配置","Open positions":"未平仓头寸","Your active trading positions":"当前交易头寸","open":"未平仓","Entry":"入场价","Mark":"标记价格","Recent activity":"最近活动","Your latest portfolio transactions":"最新投资组合交易","Bought":"买入","Sold":"卖出","Received":"收到","Portfolio figures and activity are illustrative demo data. Connect an exchange or wallet to show your real balances.":"投资组合数据为示例数据。连接交易所或钱包以显示真实余额。"
});
Object.assign(appTranslations.ja, {
  "YOUR PORTFOLIO":"ポートフォリオ","Portfolio overview":"ポートフォリオ概要","DEMO DATA":"デモデータ","Total portfolio value":"ポートフォリオ総額","Past 24 hours":"過去24時間","Illustrative portfolio performance chart":"ポートフォリオ推移のサンプルチャート","Portfolio value trend":"ポートフォリオ価値の推移","Total assets":"総資産","24h PnL":"24時間損益","Portfolio sections":"ポートフォリオ項目","Overview":"概要","Assets":"資産","Positions":"ポジション","History":"履歴","Your assets":"保有資産","Spot asset allocation":"現物資産の配分","Open positions":"保有中のポジション","Your active trading positions":"現在の取引ポジション","open":"保有中","Entry":"エントリー","Mark":"マーク価格","Recent activity":"最近のアクティビティ","Your latest portfolio transactions":"最新のポートフォリオ取引","Bought":"購入","Sold":"売却","Received":"受取","Portfolio figures and activity are illustrative demo data. Connect an exchange or wallet to show your real balances.":"ポートフォリオの数値と履歴はデモデータです。実際の残高を表示するには取引所またはウォレットを接続してください。"
});
Object.assign(appTranslations.vi, {
  "YOUR PORTFOLIO":"DANH MỤC ĐẦU TƯ","Portfolio overview":"Tổng quan danh mục","DEMO DATA":"DỮ LIỆU DEMO","Total portfolio value":"Tổng giá trị danh mục","Past 24 hours":"24 giờ qua","Illustrative portfolio performance chart":"Biểu đồ hiệu suất danh mục minh họa","Portfolio value trend":"Xu hướng giá trị danh mục","Total assets":"Tổng tài sản","24h PnL":"PnL 24 giờ","Portfolio sections":"Mục danh mục","Overview":"Tổng quan","Assets":"Tài sản","Positions":"Vị thế","History":"Lịch sử","Your assets":"Tài sản của bạn","Spot asset allocation":"Phân bổ tài sản spot","Open positions":"Vị thế đang mở","Your active trading positions":"Các vị thế giao dịch đang hoạt động","open":"đang mở","Entry":"Giá vào","Mark":"Giá đánh dấu","Recent activity":"Hoạt động gần đây","Your latest portfolio transactions":"Giao dịch danh mục gần đây","Bought":"Đã mua","Sold":"Đã bán","Received":"Đã nhận","Portfolio figures and activity are illustrative demo data. Connect an exchange or wallet to show your real balances.":"Số liệu và hoạt động danh mục là dữ liệu demo. Kết nối sàn giao dịch hoặc ví để hiển thị số dư thực."
});

// [ADDED] Initialize one shared i18next instance from the existing five-language catalog.
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: Object.fromEntries(
      Object.entries(appTranslations).map(([code, translation]) => [code, { translation }])
    ),
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    initImmediate: false,
  });
}

const navigation = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "dapps", label: "Discover", icon: Compass },
  { id: "create", label: "Create", icon: Plus, primary: true },
  { id: "market", label: "Market", icon: BarChart3 },
  { id: "profile", label: "Portfolio", icon: Wallet }, // [MODIFIED] Rename the bottom navigation destination label and icon.
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


/* [ADDED] Reusable cryptocurrency brand marks powered by Simple Icons CDN. */
const cryptoIconSlugs = {
  BTC: "bitcoin", XBT: "bitcoin", ETH: "ethereum", BNB: "binance",
  SOL: "solana", XRP: "xrp", USDT: "tether", USDC: "circle",
  DOGE: "dogecoin", ADA: "cardano", AVAX: "avalanche", DOT: "polkadot",
  LINK: "chainlink", LTC: "litecoin", TRX: "tron", XLM: "stellar",
  UNI: "uniswap", MATIC: "polygon", POL: "polygon", TON: "ton",
  SUI: "sui", APT: "aptos", ATOM: "cosmos", NEAR: "near",
  ARB: "arbitrum", OP: "optimism", SHIB: "shibainu", PEPE: "pepe",
  FIL: "filecoin", ICP: " 인터넷computer", RENDER: "render"
};

function CryptoIcon({ symbol, className = "" }) {
  const normalizedSymbol = String(symbol || "").toUpperCase().replace(/USDT$/, "").replace(/USD$/, "");
  const slug = cryptoIconSlugs[normalizedSymbol];
  return (
    <span className={`crypto-brand-icon ${className}`} data-symbol={normalizedSymbol}>
      {slug && <img src={`https://cdn.simpleicons.org/${slug}`} alt={normalizedSymbol} loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} />}
      <span>{normalizedSymbol.slice(0, 1) || "?"}</span>
    </span>
  );
}

function App() {
  const { t: translate, i18n: translator } = useTranslation(); // [ADDED] Subscribe every page section to global language changes.
  const [active, setActive] = useState("dashboard");
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [notice, setNotice] = useState("");
  const [theme, setTheme] = useState("dark");
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
  const [languageReady, setLanguageReady] = useState(false); // [ADDED] Wait for saved language before persisting
  const [languageOpen, setLanguageOpen] = useState(false); // [ADDED] Language picker visibility
  const [traderPeriod, setTraderPeriod] = useState("All");
  const [marketFilter, setMarketFilter] = useState("Favorites");
  const [marketNavTab, setMarketNavTab] = useState("all-market"); // [ADDED] Market navbar tabs
  const [moverCategory, setMoverCategory] = useState("Semua"); // [ADDED] Top Movers short-term filters
  const [marketSort, setMarketSort] = useState("volume"); // [ADDED] Market table sorting
  const [marketSortDirection, setMarketSortDirection] = useState("desc"); // [ADDED] Market sort direction
  const [pinnedMarketSymbols, setPinnedMarketSymbols] = useState([]); // [ADDED] Pinned market assets
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
  const [portfolioTab, setPortfolioTab] = useState("strategy"); // [MODIFIED] Default to the Strategy overview
  const [strategyFilter, setStrategyFilter] = useState("all"); // [ADDED] Filter strategies inside the Strategy tab
  const [historyFilter, setHistoryFilter] = useState("not-running"); // [ADDED] Filter portfolio strategy and wallet activity history
  const [portfolioStrategyStatus, setPortfolioStrategyStatus] = useState("active"); // [ADDED] Active/inactive strategy filter
  const searchInputRef = useRef(null);

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
    if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("beanance-theme", theme);
  }, [theme]);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("beanance-language");
    if (supportedLanguages.some((item) => item.code === savedLanguage)) setLanguage(savedLanguage);
    setLanguageReady(true);
  }, []);

  useEffect(() => {
    if (!languageReady) return;
    window.localStorage.setItem("beanance-language", language);
    document.documentElement.lang = language;
    translator.changeLanguage(language); // [ADDED] Update the shared translation engine across all rendered pages.
  }, [language, languageReady]);

  const t = (value) => translate(value, { defaultValue: value }); // [MODIFIED] Use the shared i18next catalog instead of a local-only lookup.
  const sidebarText = sidebarTranslations[language] || sidebarTranslations.en;
  const selectedLanguage = supportedLanguages.find((item) => item.code === language) || supportedLanguages[0];



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
        {active !== "edit-profile" && <header style={active === "profile" ? { display: "none" } : undefined} className={`topbar ${searchOpen ? "search-expanded" : ""} ${active === "trader-profile" ? "trader-profile-topbar-hidden" : ""} ${active === "profile" ? "portfolio-topbar-hidden" : ""}`}>
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
              <strong>{active === "profile" ? t("Portfolio overview") : t("Welcome back, Ezy")}</strong>
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
                    <div className="notification-item"><span className="notification-symbol">↗</span><div><strong>{t("Market update")}</strong><p>{t("Bitcoin is up 2.45% in the demo market.")}</p><small>{t("12 minutes ago")}</small></div></div>
                    <div className="notification-item"><span className="notification-symbol">✦</span><div><strong>{t("Welcome to Beanance")}</strong><p>{t("Explore assets and discover Web3 apps.")}</p><small>{t("Today")}</small></div></div>
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

        {active === "dashboard" && (
          <section className="page page-enter dashboard-page">
            <section className="dashboard-section">
              <div className="section-heading dashboard-section-heading">
                <div><h2>{t("Top Strategies")}</h2><p className="muted">{t("Best performing strategies from our community")}</p></div>
                <button className="text-link" onClick={() => selectTab({ id: "dapps" })}>{t("See All")} <ChevronRight size={15} /></button>
              </div>
              <div className="strategy-grid">
                {[
                  {name:"BTC Trend Master",user:"@tradewiz",symbol:"₿",tone:"bitcoin",returns:"+124.5%",win:"68%",type:"Trend Following",risk:"Medium Risk",riskTone:"medium",chart:"M2 40 L18 31 L34 35 L50 23 L66 29 L82 19 L98 27 L114 17 L130 23 L146 12 L162 18 L178 9 L194 16 L210 5 L226 12 L242 3 L258 10 L274 0"},
                  {name:"Scalping AI v2",user:"@cryptofox",symbol:"◆",tone:"ethereum",returns:"+89.2%",win:"72%",type:"Scalping",risk:"Low Risk",riskTone:"low",chart:"M2 42 L18 35 L34 38 L50 28 L66 31 L82 20 L98 26 L114 18 L130 22 L146 13 L162 18 L178 8 L194 13 L210 5 L226 10 L242 2 L258 7 L274 -1"},
                  {name:"ETH Breakout",user:"@moontrade",symbol:"◎",tone:"solana",returns:"+68.1%",win:"63%",type:"Breakout",risk:"Medium Risk",riskTone:"medium",chart:"M2 43 L18 35 L34 39 L50 29 L66 34 L82 24 L98 29 L114 19 L130 24 L146 14 L162 20 L178 10 L194 15 L210 7 L226 12 L242 3 L258 8 L274 -2"}
                ].map((strategy) => (
                  <article className="strategy-card" key={strategy.name}>
                    <div className="strategy-card-head">
                      <div className={`strategy-coin ${strategy.tone}`}><CryptoIcon symbol={strategy.tone === "bitcoin" ? "BTC" : strategy.tone === "ethereum" ? "ETH" : "SOL"} /></div>
                      <div className="strategy-identity"><strong>{strategy.name}</strong><button className="strategy-owner-link" onClick={() => openTrader(strategy.user)}>{strategy.user}</button></div>
                      <button className="strategy-more" aria-label={`More about ${strategy.name}`} onClick={() => setNotice(`${strategy.name} details are coming soon`)}>•••</button>
                    </div>
                    <svg className="strategy-chart" viewBox="0 0 276 48" preserveAspectRatio="none" aria-label="Strategy performance chart">
                      <defs><linearGradient id={`strategy-fill-${strategy.name.replaceAll(" ","-")}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#20c56a" stopOpacity=".24"/><stop offset="100%" stopColor="#20c56a" stopOpacity="0"/></linearGradient></defs>
                      <path d={`${strategy.chart} L274 48 L2 48 Z`} fill={`url(#strategy-fill-${strategy.name.replaceAll(" ","-")})`}/>
                      <path d={strategy.chart} fill="none" stroke="#20bd68" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                    </svg>
                    <div className="strategy-metrics"><div><strong className="positive">{strategy.returns}</strong><span>{t("Total Return")}</span></div><div><strong>{strategy.win}</strong><span>{t("Win Rate")}</span></div></div>
                    <div className="strategy-card-footer"><span className="strategy-tag">{t(strategy.type)}</span><span className={`risk-tag risk-${strategy.riskTone}`}>{t(strategy.risk)}</span><button onClick={() => setNotice(`Following ${strategy.name} is a demo action`)}>{t("Follow")}</button></div>
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
                      ["tradewiz","342","+124.5%","68%","🥇"],
                      ["cryptofox","1.2K","+89.2%","72%","🥈"],
                      ["moontrade","856","+68.1%","63%","🥉"],
                      ["quantalab","432","+54.3%","58%",""],
                      ["solking","321","+48.7%","61%",""]
                    ].map((trader,index) => <tr key={trader[0]}><td><span className="rank-cell">{index+1}</span></td><td><button className="trader-name trader-name-button" onClick={() => openTrader(trader[0])}><span className={`trader-avatar trader-avatar-${index+1}`}>{["T","C","M","Q","S"][index]}</span><strong>{trader[0]}</strong><span className="verified-mark">✓</span></button></td><td>{trader[1]}</td><td className="positive">{trader[2]}</td><td>{trader[3]}</td><td><svg className="table-sparkline" viewBox="0 0 110 28" preserveAspectRatio="none"><path d="M1 24 L10 19 L18 21 L27 13 L36 16 L45 10 L54 13 L63 8 L72 11 L81 5 L90 8 L100 2 L109 4" fill="none" stroke="#20bd68" strokeWidth="1.8"/></svg></td><td><button className="table-follow" onClick={() => setNotice(`Following @${trader[0]} is a demo action`)}>{t("Follow")}</button></td></tr>)}
                  </tbody>
                </table>
              </div>
            </section>

            <section className={`dashboard-section market-overview-section mobile-tab-panel mobile-market-panel ${mobileDashboardTab === "market" ? "mobile-tab-active" : ""}`}>
              <div className="section-heading dashboard-section-heading">
                <div><h2>{t("Market Overview")}</h2><p className="muted">{t("Top futures pairs by volume")}</p></div>
                <div className="section-tools"><div className="period-tabs market-tabs">{["Favorites","All","Futures","Crypto"].map((filter) => <button className={marketFilter === filter ? "selected" : ""} key={filter} onClick={() => setMarketFilter(filter)}>{filter}</button>)}</div><button className="text-link" onClick={() => setActive("market")}>{t("See All")} <ChevronRight size={15} /></button></div>
              </div>
              <div className="dashboard-table-wrap">
                <table className="dashboard-table market-table">
                  <thead><tr><th>#</th><th>{t("Pair")}</th><th>{t("Price")}</th><th>{t("24h Change")}</th><th>{t("24h Volume")}</th><th>{t("Chart")}</th><th>★</th></tr></thead>
                  <tbody>
                    {marketAssets.filter((asset) => marketFilter !== "Favorites" || ["BTC","BNB"].includes(asset.symbol)).map((asset,index) => <tr key={asset.symbol}><td>{index+1}</td><td><div className="market-pair"><span className={`asset-icon ${asset.tone}`}><CryptoIcon symbol={asset.symbol} /></span><div><strong>{asset.symbol}USDT</strong><small>{asset.symbol}</small></div></div></td><td>{asset.price.replace("$","")}</td><td className={asset.positive ? "positive" : "negative"}>{asset.change}</td><td>{asset.volume}</td><td><svg className="table-sparkline" viewBox="0 0 110 28" preserveAspectRatio="none"><path d={asset.positive ? "M1 24 L10 19 L18 21 L27 13 L36 16 L45 10 L54 13 L63 8 L72 11 L81 5 L90 8 L100 2 L109 4" : "M1 3 L10 8 L18 5 L27 12 L36 9 L45 15 L54 12 L63 18 L72 15 L81 21 L90 18 L100 25 L109 23"} fill="none" stroke={asset.positive ? "#20bd68" : "#e45b5b"} strokeWidth="1.8"/></svg></td><td><button className="favorite-star" onClick={() => setNotice(`${asset.symbol} favorites are demo only`)}>☆</button></td></tr>)}
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
                    <span className="podium-detail">{t(item.detail)}</span>
                    <button onClick={() => setNotice(discoverTopTab === "strategies" ? `Strategy ${item.name} selected` : `Opening @${item.name} profile`)}>{discoverTopTab === "strategies" ? t("View strategy") : t("View profile")}</button>
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
                  {name:"BTC Trend Master",user:"@tradewiz",type:"Trend Following",risk:"Medium Risk",returns:"+124.5%",win:"68%",age:240,trades:680,tone:"bitcoin",symbol:"₿",tag:"Trending"},
                  {name:"Scalping AI v2",user:"@cryptofox",type:"Scalping",risk:"Low Risk",returns:"+89.2%",win:"72%",age:120,trades:1240,tone:"ethereum",symbol:"◆",tag:"Low Risk"},
                  {name:"ETH Breakout",user:"@moontrade",type:"Breakout",risk:"Medium Risk",returns:"+68.1%",win:"63%",age:75,trades:310,tone:"solana",symbol:"◎",tag:"Trending"},
                  {name:"BNB Momentum",user:"@quantalab",type:"Momentum",risk:"Low Risk",returns:"+54.3%",win:"58%",age:35,trades:92,tone:"bnb",symbol:"◆",tag:"Low Risk"}
                ].filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.user.toLowerCase().includes(searchQuery.toLowerCase())).filter((item) => Number(item.win.replace("%","")) >= Number(discoverCriteria.minWinRate) && item.age >= Number(discoverCriteria.minAge) && item.trades >= Number(discoverCriteria.minTrades) && Number(item.returns.replace(/[+%]/g,"")) >= Number(discoverCriteria.minReturn) && (discoverCriteria.risk === "All" || item.risk === discoverCriteria.risk) && (discoverFilter === "All" || (discoverFilter === "Trending" ? item.tag === "Trending" : discoverFilter === "Low Risk" ? item.risk === "Low Risk" : Number(item.returns.replace(/[+%]/g,"")) >= 80))).sort((a,b) => discoverCriteria.sort === "win" ? Number(b.win.replace("%","")) - Number(a.win.replace("%","")) : discoverCriteria.sort === "return" ? Number(b.returns.replace(/[+%]/g,"")) - Number(a.returns.replace(/[+%]/g,"")) : discoverCriteria.sort === "newest" ? a.age - b.age : 0).map((item) => (
                  <article className="discover-list-card" key={item.name}>
                    <div className={`discover-avatar ${item.tone}`}><CryptoIcon symbol={item.tone === "bitcoin" ? "BTC" : item.tone === "ethereum" ? "ETH" : item.tone === "solana" ? "SOL" : item.tone === "bnb" ? "BNB" : item.symbol} /></div>
                    <div className="discover-card-main"><strong>{item.name}</strong><button className="discover-owner-link" onClick={() => openTrader(item.user)}>{item.user} · {t(item.type)}</button><small>{t(item.risk)}</small></div>
                    <div className="discover-card-stats"><strong className="positive">{item.returns}</strong><span>{item.win} {t("win rate")}</span></div>
                    <button onClick={() => setNotice(`Following ${item.name} is a demo action`)}>{t("Follow")}</button>
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
                    <div className="discover-card-main"><strong>{item.name} <span className="verified-mark">✓</span></strong><span>{item.followers} {t("followers")}</span><small>{t("Consistent trader")} · {item.age} {t("days active")}</small></div>
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
                <div className="trader-profile-name"><div><h1>@{selectedTrader}</h1><span className="verified-mark">✓</span></div><p>{traderProfiles[selectedTrader].name} · Verified trader</p></div>
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
                          <div className="trader-trade-pair"><span className={`trader-trade-coin trader-trade-coin-${trade.pair.startsWith("BTC") ? "btc" : trade.pair.startsWith("ETH") ? "eth" : trade.pair.startsWith("SOL") ? "sol" : "bnb"}`}>{trade.pair.startsWith("BTC") ? "₿" : trade.pair.startsWith("ETH") ? "Ξ" : trade.pair.startsWith("SOL") ? "◎" : "◆"}</span><div><strong>{trade.pair}</strong><small>{trade.strategy}</small></div></div>
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
                      <article className="trader-strategy-performance-card" key={strategy.name}>
                        <div className="trader-strategy-performance-heading">
                          <div className="trader-owned-strategy-icon"><Activity size={18}/></div>
                          <div className="trader-owned-strategy-main"><div className="trader-strategy-name-line"><strong>{strategy.name}</strong><span className={`trader-strategy-risk-inline ${strategy.risk.toLowerCase().replace(" risk","")}`}>{t(strategy.risk)}</span></div><span>{t(strategy.type)}</span></div>
                          <div className="trader-strategy-actions">
                            <span className={`strategy-status-pill ${traderStrategyFilter}`}>{traderStrategyFilter === "active" ? "Active" : "Inactive"}</span>
                            {traderStrategyFilter === "active" && <button className="trader-copy-button" onClick={() => setNotice(`Copy trading for ${strategy.name} is coming soon`)}><Copy size={13}/> Copy</button>}
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
            {marketNavTab === "all-market" ? (
              <div className="market-table-flat">
                <div className="market-table market-table-head">
                  <span className="market-star-column" aria-hidden="true">★</span>
                  <button className={marketSort === "name" ? "market-sort active" : "market-sort"} onClick={() => {setMarketSort("name");setMarketSortDirection((direction) => marketSort === "name" && direction === "asc" ? "desc" : "asc");}}>{t("Name")} <span>{marketSort === "name" ? (marketSortDirection === "asc" ? "↑" : "↓") : "↕"}</span></button>
                  <button className={marketSort === "volume" ? "market-sort active" : "market-sort"} onClick={() => {setMarketSort("volume");setMarketSortDirection((direction) => marketSort === "volume" && direction === "desc" ? "asc" : "desc");}}>{t("Vol")} <span>{marketSort === "volume" ? (marketSortDirection === "asc" ? "↑" : "↓") : "↕"}</span></button>
                  <button className={marketSort === "price" ? "market-sort active" : "market-sort"} onClick={() => {setMarketSort("price");setMarketSortDirection((direction) => marketSort === "price" && direction === "desc" ? "asc" : "desc");}}>{t("Last price")} <span>{marketSort === "price" ? (marketSortDirection === "asc" ? "↑" : "↓") : "↕"}</span></button>
                  <button className={marketSort === "change" ? "market-sort active" : "market-sort"} onClick={() => {setMarketSort("change");setMarketSortDirection((direction) => marketSort === "change" && direction === "desc" ? "asc" : "desc");}}>{t("24h change")} <span>{marketSort === "change" ? (marketSortDirection === "asc" ? "↑" : "↓") : "↕"}</span></button>
                </div>
                <div className="market-table-body">
                  {[...marketAssets].filter((asset) => `${asset.name} ${asset.symbol}`.toLowerCase().includes(searchQuery.toLowerCase())).sort((a,b) => {
                    const aPinned = pinnedMarketSymbols.includes(a.symbol);
                    const bPinned = pinnedMarketSymbols.includes(b.symbol);
                    if (aPinned !== bPinned) return aPinned ? -1 : 1;
                    const values = {
                      name: [a.name.toLowerCase(), b.name.toLowerCase()],
                      volume: [Number(a.volume.replace(/[^0-9.]/g, "")) * (a.volume.includes("B") ? 1000 : a.volume.includes("M") ? 1 : 0.001), Number(b.volume.replace(/[^0-9.]/g, "")) * (b.volume.includes("B") ? 1000 : b.volume.includes("M") ? 1 : 0.001)],
                      price: [Number(a.price.replace(/[^0-9.]/g, "")), Number(b.price.replace(/[^0-9.]/g, ""))],
                      change: [Number(a.change.replace("%", "")), Number(b.change.replace("%", ""))]
                    }[marketSort];
                    const comparison = typeof values[0] === "string" ? values[0].localeCompare(values[1]) : values[0] - values[1];
                    return comparison * (marketSortDirection === "asc" ? 1 : -1);
                  }).map((asset) => (
                    <article className="market-table market-table-row" key={asset.symbol}>
                      <button className={pinnedMarketSymbols.includes(asset.symbol) ? "favorite-star is-pinned" : "favorite-star"} aria-label={pinnedMarketSymbols.includes(asset.symbol) ? `Unpin ${asset.symbol}` : `Pin ${asset.symbol}`} aria-pressed={pinnedMarketSymbols.includes(asset.symbol)} onClick={() => setPinnedMarketSymbols((current) => current.includes(asset.symbol) ? current.filter((symbol) => symbol !== asset.symbol) : [...current, asset.symbol])}><Star size={18} fill={pinnedMarketSymbols.includes(asset.symbol) ? "currentColor" : "none"} /></button>
                      <div className="market-pair"><div className={`asset-icon ${asset.tone}`}><CryptoIcon symbol={asset.symbol} /></div><div><strong>{asset.symbol}<span className="market-quote">/USDT</span><small>{asset.name}</small></strong></div></div>
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
                  {["Semua", "Kenaikan", "Penurunan", "Pullback", "Rally", "High Baru", "Low Baru"].map((category) => (
                    <button key={category} type="button" role="tab" aria-selected={moverCategory === category} className={moverCategory === category ? "selected" : ""} onClick={() => setMoverCategory(category)}>{t(category)}</button>
                  ))}
                </div>
                <div className="top-movers-list-head"><span>{t("Pasangan")}</span><span>{t("Perubahan / Status")}</span></div>
                <div className="top-movers-list">
                  {topMoverEvents.filter((event) => (moverCategory === "Semua" || event.category === moverCategory) && `${event.name} ${event.symbol}`.toLowerCase().includes(searchQuery.toLowerCase())).map((event, index) => (
                    <article className="top-mover-row" key={`${event.symbol}-${event.time}-${index}`}>
                      <div className="top-mover-pair"><div className="top-mover-asset"><CryptoIcon symbol={event.symbol} /><strong>{event.symbol}USDT</strong></div><span className="perp-tag">{t("Perp")}</span><small>{event.time} · {event.timeframe} lalu</small></div>
                      <div className="top-mover-movement"><strong className={event.positive ? "positive" : "negative"}>{event.change}</strong><span>{t(event.status)}</span></div>
                    </article>
                  ))}
                  {topMoverEvents.filter((event) => (moverCategory === "Semua" || event.category === moverCategory) && `${event.name} ${event.symbol}`.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <div className="top-movers-empty">{t("Belum ada pergerakan untuk kategori ini.")}</div>
                  )}
                </div>
                <p className="top-movers-disclaimer">{t("Contoh tampilan sinyal pergerakan jangka pendek. Data perlu dihubungkan ke feed market real-time.")}</p>
              </section>
            )}
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
                        <article className="trader-strategy-performance-card portfolio-owned-strategy-card" key={strategy.name}>
                          <div className="trader-strategy-performance-heading">
                            <div className="trader-owned-strategy-icon"><CryptoIcon symbol={strategy.pair} /></div>
                            <div className="trader-owned-strategy-main"><div className="trader-strategy-name-line"><strong>{strategy.name}</strong><span className={"trader-strategy-risk-inline " + strategy.risk.toLowerCase().replace(" risk","")}>{t(strategy.risk)}</span></div><span>{t(strategy.type)} · {strategy.pair} · {strategy.timeframe}</span></div>
                            <div className="trader-strategy-actions"><span className={"strategy-status-pill " + strategy.status}>{t(strategy.status === "active" ? "Active" : "Inactive")}</span>{strategy.status === "active" && <button type="button" className="trader-copy-button" onClick={() => setNotice("Copy trading for " + strategy.name + " is coming soon")}><Copy size={14}/> {t("Copy")}</button>}</div>
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
                        <article className="portfolio-wallet-token-card"><span className="portfolio-wallet-token-logo bnb"><CryptoIcon symbol="BNB" /></span><span className="portfolio-wallet-token-info"><strong>BNB</strong><small>BNB Chain</small></span><span className="portfolio-wallet-token-value"><strong>4.25 BNB</strong><small>$2,465.00</small></span></article>
                        <article className="portfolio-wallet-token-card"><span className="portfolio-wallet-token-logo bean"><CryptoIcon symbol="BEAN" /></span><span className="portfolio-wallet-token-info"><strong>BEAN</strong><small>Beanance Token</small></span><span className="portfolio-wallet-token-value"><strong>1,250 BEAN</strong><small>$15.65</small></span></article>
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
                          <span className={"portfolio-history-icon " + historyFilter}><CryptoIcon symbol={item.name} /></span>
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

      <nav className={`bottom-nav ${active === "trader-profile" || active === "edit-profile" ? "bottom-nav-hidden" : ""}`} aria-label={t("Main navigation")}>
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
              <div className="sidebar-brand"><span className="brand-mark"><span /></span><strong>beanance</strong></div>
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
              <button type="button" className="sidebar-nav-item" onClick={() => {setSidebarOpen(false);selectTab({ id: "profile" });}}>
                <UserRound size={19} /><span>{sidebarText.profile}</span><ChevronRight className="sidebar-item-chevron" size={17} />
              </button>
              <button type="button" className="sidebar-nav-item" aria-expanded={languageOpen} onClick={() => setLanguageOpen((open) => !open)}>
                <Languages size={19} /><span>{sidebarText.language}</span><small className="sidebar-current-language">{selectedLanguage.native}</small><ChevronRight className={languageOpen ? "sidebar-chevron-open" : "sidebar-item-chevron"} size={17} />
              </button>
              {languageOpen && (
                <div className="sidebar-language-list">
                  {supportedLanguages.map((item) => (
                    <button key={item.code} type="button" className={language === item.code ? "selected" : ""} onClick={() => {setLanguage(item.code);setLanguageOpen(false);}}>
                      <span>{item.flag}</span><span>{item.label}</span><small>{item.native}</small>{language === item.code && <span className="sidebar-language-check">✓</span>}
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
              <button type="button" className="sidebar-nav-item" onClick={() => {setSidebarOpen(false);setNotice("Help center is coming soon");}}>
                <CircleHelp size={19} /><span>{sidebarText.help}</span><ChevronRight className="sidebar-item-chevron" size={17} />
              </button>
              <button type="button" className="sidebar-nav-item" onClick={() => {setSidebarOpen(false);setNotice("Beanance · Community trading platform");}}>
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
      {notice && <div className="toast" role="status">{notice}</div>}
    </main>
  );
}

export default App;
