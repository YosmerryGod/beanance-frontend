import "./globals.css";
import "../styles/tokens.css";
import "../styles/design-system.css";
import "../styles/design-system-pages.css"; /* keep LAST: page coverage + yellow-on-yellow fixes */
import { DM_Sans, Manrope } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata = {
  title: "MILION",
  description: "MILION — your crypto dashboard.",
  applicationName: "MILION",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/favicon.ico" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const themeBootstrap = `(function(){try{var saved=localStorage.getItem("milion-theme");var theme=saved==="light"||saved==="dark"?saved:(window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");document.documentElement.dataset.theme=theme;var language=localStorage.getItem("milion-language");if(["en","id","zh","ja","vi"].indexOf(language)>=0){document.documentElement.lang=language;}document.documentElement.style.colorScheme=theme;var meta=document.querySelector('meta[name="theme-color"]');if(meta){meta.setAttribute("content",theme==="light"?"#FFFFFF":"#111111");}}catch(error){document.documentElement.dataset.theme="dark";}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#111111" />
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className={dmSans.variable + " " + manrope.variable}>{children}</body>
    </html>
  );
}
