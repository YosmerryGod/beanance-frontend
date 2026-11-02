// [ADDED] Keep the market backend private and proxy browser requests through Next.js.
const marketApiOrigin = (process.env.MARKET_API_INTERNAL_URL || "http://127.0.0.1:3030").replace(/\\/$/, "");

/** @type {import("next").NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/market-api/:path*",
        destination: marketApiOrigin + "/api/v1/market/:path*",
      },
    ];
  },
};

export default nextConfig;
