import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Juvenile Ranking";
const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: `${APP_NAME} - リアルタイムランキング`,
    template: `%s | ${APP_NAME}`,
  },
  description: "ジュブナイル競技のリアルタイムランキングシステム。チームの得点状況をリアルタイムで確認できます。",
  keywords: ["ランキング", "競技", "スコア", "ジュブナイル", "リアルタイム", "順位"],
  authors: [{ name: "Juvenile Ranking Team" }],
  creator: "Juvenile Ranking Team",
  publisher: "Juvenile Ranking Team",
  applicationName: APP_NAME,
  generator: `Next.js ${APP_VERSION}`,
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    title: `${APP_NAME} - リアルタイムランキング`,
    description: "ジュブナイル競技のリアルタイムランキングシステム",
    siteName: APP_NAME,
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: `${APP_NAME} - ランキング画面`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} - リアルタイムランキング`,
    description: "ジュブナイル競技のリアルタイムランキングシステム",
    images: ["/images/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
      },
    ],
  },
  manifest: "/manifest.json",
  category: "sports",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  colorScheme: "light dark",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://script.google.com" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#3CB371" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={`${notoSansJP.className} antialiased`}>
        <noscript>
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '8px',
            margin: '1rem'
          }}>
            ⚠️ このアプリケーションはJavaScriptが有効である必要があります。
            ブラウザでJavaScriptを有効にしてページを再読み込みしてください。
          </div>
        </noscript>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
