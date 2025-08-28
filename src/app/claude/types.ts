/**
 * アプリケーションで使用する型定義
 */
import { type ScoreData } from "@/lib/database";

// トースト通知の型
export type ToastType = "success" | "error" | "info";

export type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

// フォームデータの型
export type FormData = {
  name: string;
  game1: number;
  game2: number;
  game3: number;
  created_at: string;
};

// ランク付けされたデータの型
export type RankedData = ScoreData & {
  selectedTotal: number;
  rank: number;
  displayRank: string;
};

// ソートカラムの型
export type SortColumn = "game1" | "game2" | "game3" | "total" | "created_at";

// ソート方向の型
export type SortDirection = "asc" | "desc";

// 最新スコア情報の型
export type LatestScoreInfo = RankedData & {
  rankPosition: number;
  timeAgo: string;
  isVeryRecent: boolean;
};

// 初期フォームデータ
export const initialFormData: FormData = {
  name: "",
  game1: 0,
  game2: 0,
  game3: 0,
  created_at: "",
};
