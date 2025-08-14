import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Juvenile Ranking",
  description: "ランキング表示アプリケーション",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ★静的なHTMLのみ
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
