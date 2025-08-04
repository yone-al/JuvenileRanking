# Juvenile Ranking

チーム競技のスコアランキングを表示するNext.jsアプリケーション

## 概要

このアプリケーションは、Google Apps Scriptからチームのスコアデータを取得し、リアルタイムでランキングを表示します。3つのゲーム（落下物・調理・レジ）のスコアと総合ランキングを自動で切り替えながら表示します。

## 機能

- **複数カテゴリーのランキング表示**
  - トップ5: 総合スコアの上位5チーム
  - 総スコア: 全チームの総合スコアランキング
  - Game1スコア: 落下物ゲームのランキング
  - Game2スコア: 調理ゲームのランキング
  - Game3スコア: レジゲームのランキング

- **自動切り替え機能**
  - 初回ロード時: 20秒間トップ5で静止
  - その後: 5秒ごとに自動でタブ切り替え
  - 手動選択時: 30秒後に自動切り替えを再開

- **リアルタイム更新**
  - Google Apps Scriptから最新データを取得
  - 最新チーム情報の表示

- **視覚的な演出**
  - 1-3位のメダル表示（🥇🥈🥉）
  - 上位チームのスタイリング（背景色・影・太字）
  - 装飾画像の配置

## 技術スタック

- **フレームワーク**: Next.js 15.3.0
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS 4.0
- **UI**: React 19.0.0
- **データソース**: Google Apps Script API

## セットアップ

1. 依存関係のインストール:

```bash
npm install
```

2. 開発サーバーの起動:

```bash
npm run dev
```

3. ブラウザで <http://localhost:3000> にアクセス

## プロジェクト構造

```text
src/
├── app/
│   ├── page.tsx          # メインページコンポーネント
│   ├── layout.tsx        # レイアウトコンポーネント
│   └── globals.css       # グローバルスタイル
├── func.ts               # データ取得関数
└── interface.ts          # 型定義

public/
└── images/
    ├── Apple.png         # 装飾画像
    └── ApplePie.jpeg     # 装飾画像
```

## スクリプト

- `npm run dev`: 開発サーバー起動
- `npm run build`: プロダクションビルド
- `npm run start`: プロダクションサーバー起動
- `npm run lint`: ESLintチェック

## データ形式

Google Apps Scriptから以下の形式でデータを受信:

```typescript
{
  名前: string,      // チーム名
  落下物: number,    // Game1スコア
  調理: number,      // Game2スコア
  レジ: number,      // Game3スコア
  総計: number       // 総合スコア
}
```

## カスタマイズ

- タイマー設定: `src/app/page.tsx` の `startAuto()` 関数
- スタイリング: インラインスタイルまたは `globals.css`
- データ上限: `src/func.ts` の `clampData()` 関数
