import "./globals.css";

export const metadata = {
  title: "Beanance",
  description: "Beanance — your crypto dashboard.",
  applicationName: "Beanance",
  themeColor: "#0c0f14",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0c0f14",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
