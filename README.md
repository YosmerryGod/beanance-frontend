# Beanance Frontend

Frontend komunitas trading dan discovery strategi Beanance.

## Dashboard — Backend API Requirements

Dokumen ini menjadi kontrak kebutuhan API untuk halaman Dashboard agar backend dapat menyiapkan database, service, dan endpoint sesuai kebutuhan UI.

> Status saat ini: Dashboard masih menggunakan data demo/hardcoded. Endpoint di bawah adalah rancangan kontrak API, bukan endpoint yang sudah tersedia. Sesuaikan prefix dan autentikasi dengan standar backend Beanance.

### 1. Komponen Dashboard

| Bagian | Data yang dibutuhkan |
| --- | --- |
| Top Strategies | Strategi unggulan, trader pemilik, return, win rate, tipe strategi, risk level, dan grafik performa |
| Top Traders | Leaderboard trader, followers, return berdasarkan periode, win rate, dan equity curve |
| Market Overview | Pair market, harga terakhir, perubahan 24 jam, volume 24 jam, sparkline, dan status favorit |

Semua data harus berasal dari API. Frontend tidak boleh memakai array demo sebagai sumber data produksi.

### 2. Rekomendasi Endpoint

Gunakan prefix /api/v1 sebagai contoh. Backend boleh memakai prefix berbeda selama kontrak respons konsisten.

| Method | Endpoint | Fungsi | Auth |
| --- | --- | --- | --- |
| GET | /api/v1/dashboard/strategies | Mengambil Top Strategies | Public atau sesuai kebijakan |
| GET | /api/v1/dashboard/traders | Mengambil Top Traders | Public atau sesuai kebijakan |
| GET | /api/v1/dashboard/market | Mengambil Market Overview | Public atau sesuai kebijakan |
| PUT | /api/v1/strategies/:strategyId/follow | Follow strategi | Required |
| DELETE | /api/v1/strategies/:strategyId/follow | Unfollow strategi | Required |
| PUT | /api/v1/traders/:traderId/follow | Follow trader | Required |
| DELETE | /api/v1/traders/:traderId/follow | Unfollow trader | Required |
| PUT | /api/v1/market/favorites/:symbol | Menambahkan pair ke favorit | Required |
| DELETE | /api/v1/market/favorites/:symbol | Menghapus pair dari favorit | Required |

Follow/favorite harus idempotent: request berulang tidak boleh membuat relasi duplikat.

### 3. Top Strategies

Request:

    GET /api/v1/dashboard/strategies?limit=3&sort=return_30d

Query:
- limit: jumlah strategi; default 3.
- sort: return_30d, win_rate, atau total_trades.
- period: opsional, 7d, 30d, 90d, atau 1y.

Contoh response:

    {
      "success": true,
      "data": [
        {
          "id": "strategy_001",
          "name": "BTC Trend Master",
          "slug": "btc-trend-master",
          "owner": {
            "id": "trader_001",
            "username": "tradewiz",
            "display_name": "TradeWiz",
            "avatar_url": null,
            "verified": true
          },
          "asset": { "symbol": "BTC", "name": "Bitcoin" },
          "strategy_type": "trend_following",
          "risk_level": "medium",
          "metrics": {
            "return_30d": 124.5,
            "win_rate": 68.0,
            "total_trades": 680
          },
          "performance": [
            { "timestamp": "2026-10-01T00:00:00Z", "value": 100 },
            { "timestamp": "2026-10-02T00:00:00Z", "value": 102.4 }
          ],
          "is_following": false,
          "status": "active"
        }
      ],
      "meta": { "limit": 3, "sort": "return_30d" }
    }

Ketentuan:
- performance adalah titik grafik mini, urut timestamp menaik.
- Return dan win_rate berupa angka persentase, bukan string dengan tanda persen.
- risk_level: low, medium, atau high.
- status: active atau inactive.
- Ranking dihitung backend berdasarkan aturan yang disepakati.

### 4. Top Traders

Request:

    GET /api/v1/dashboard/traders?period=30d&limit=5&sort=return

Query:
- period: all, 30d, 90d, 180d, atau 1y.
- limit: jumlah trader; default 5.
- sort: return, win_rate, atau followers.

Contoh response:

    {
      "success": true,
      "data": [
        {
          "rank": 1,
          "trader": {
            "id": "trader_001",
            "username": "tradewiz",
            "display_name": "TradeWiz",
            "avatar_url": null,
            "verified": true
          },
          "followers_count": 342,
          "return_percent": 124.5,
          "win_rate": 68.0,
          "equity_curve": [
            { "timestamp": "2026-10-01T00:00:00Z", "value": 1000 },
            { "timestamp": "2026-10-02T00:00:00Z", "value": 1024 }
          ],
          "is_following": false
        }
      ],
      "meta": { "period": "30d", "limit": 5, "sort": "return" }
    }

Ketentuan:
- Perubahan periode di UI harus memanggil ulang endpoint dengan period yang dipilih.
- equity_curve berisi titik historis untuk sparkline.
- Return harus dihitung sesuai periode yang diminta, bukan selalu 30 hari.
- Ranking konsisten untuk parameter dan periode yang sama.

### 5. Market Overview

Request:

    GET /api/v1/dashboard/market?category=favorites&limit=10

Query:
- category: favorites, all, futures, atau crypto.
- limit: jumlah pair.
- favorites harus berdasarkan user login. Untuk pengunjung publik, is_favorite dapat bernilai false.

Contoh response:

    {
      "success": true,
      "data": [
        {
          "symbol": "BTCUSDT",
          "base_asset": "BTC",
          "quote_asset": "USDT",
          "price": 65120.4,
          "change_24h_percent": 2.45,
          "volume_24h": 28400000000,
          "sparkline": [64200.0, 64500.0, 64350.0, 65120.4],
          "market_type": "futures",
          "is_favorite": true,
          "updated_at": "2026-10-31T12:00:00Z"
        }
      ],
      "meta": { "category": "favorites", "limit": 10 }
    }

Ketentuan:
- price, change_24h_percent, dan volume_24h berupa angka.
- volume_24h menggunakan nilai quote asset (contoh USDT).
- sparkline adalah urutan harga untuk grafik mini.
- Favorit disimpan per user, bukan global.
- Market data berasal dari provider/exchange yang dipilih backend.

### 6. Follow dan Favorite Actions

Follow strategi:

    PUT /api/v1/strategies/strategy_001/follow
    Authorization: Bearer <access_token>

Unfollow strategi:

    DELETE /api/v1/strategies/strategy_001/follow
    Authorization: Bearer <access_token>

Follow trader dan favorite pair menggunakan pola endpoint yang sama seperti tabel endpoint.

Contoh response:

    { "success": true, "data": { "following": true } }

Backend perlu memvalidasi user dan target, mencegah relasi duplikat, memperbarui jumlah followers, dan mengembalikan status HTTP yang sesuai (401, 404, 409, dan sebagainya).

### 7. Format Response dan Error

Response sukses:

    { "success": true, "data": {}, "meta": {} }

Response error:

    {
      "success": false,
      "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid period parameter"
      }
    }

Standar:
- Timestamp menggunakan ISO 8601 UTC.
- Nilai finansial dan persentase dikirim sebagai angka.
- Field opsional yang tidak tersedia dikirim null, bukan string kosong.
- Endpoint list mendukung limit dan pagination jika data berkembang.
- Terapkan cache untuk ranking dan market sesuai kebutuhan freshness.
- Jangan mengirim private key, credential exchange, atau data sensitif ke frontend.

### 8. Urutan Implementasi Backend

1. Dashboard read APIs: strategies, traders, dan market.
2. Data aggregation: hitung return, win rate, total trades, followers, ranking, dan equity curve dari sumber data trading.
3. Follow/favorite: simpan relasi user ke strategy, trader, dan market pair.
4. Market refresh: integrasi provider, cache, dan jadwal update.
5. Realtime (opsional): WebSocket untuk harga market dan data yang memang perlu live.

### 9. Checklist Integrasi Frontend

- [ ] Ganti data demo Top Strategies dengan API.
- [ ] Ganti data demo Top Traders dengan API.
- [ ] Ganti data demo Market Overview dengan API.
- [ ] Hubungkan filter periode Top Traders ke query API.
- [ ] Hubungkan filter kategori Market Overview ke query API.
- [ ] Hubungkan Follow/Unfollow strategi.
- [ ] Hubungkan Follow/Unfollow trader.
- [ ] Hubungkan Favorite/Unfavorite pair.
- [ ] Tambahkan loading, empty, dan error state.
- [ ] Pastikan tampilan tetap responsif untuk semua kondisi data.

## Development Notes

- Angka demo di UI bukan data produksi.
- Backend menjadi sumber kebenaran untuk ranking, status strategi, performa, dan jumlah followers.
- Frontend bertanggung jawab pada rendering, interaksi, loading state, dan error handling.
