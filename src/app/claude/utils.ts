/**
 * ユーティリティ関数
 */
import { type ScoreData } from "@/lib/database";

/**
 * データのハッシュを生成（変更検出用）
 * @param data スコアデータの配列
 * @returns ハッシュ文字列
 */
export const generateDataHash = (data: ScoreData[]): string => {
  return JSON.stringify(
    data.map((d) => ({
      id: d.id,
      name: d.name,
      game1: d.game1,
      game2: d.game2,
      game3: d.game3,
      created_at: d.created_at,
    })),
  );
};

/**
 * 日時を datetime-local input用にフォーマット
 * @param dateValue 日時文字列またはDateオブジェクト
 * @returns フォーマット済み日時文字列
 */
export const formatDateTimeLocal = (dateValue: string | Date): string => {
  const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * 経過時間を人間が読みやすい形式に変換
 * @param createdAt 作成日時
 * @returns フォーマット済み経過時間
 */
export const getTimeAgo = (createdAt: string | Date): string => {
  const now = new Date();
  const createdTime =
    typeof createdAt === "string" ? new Date(createdAt) : createdAt;
  const timeDiff = now.getTime() - createdTime.getTime();
  const minutesDiff = Math.floor(timeDiff / (1000 * 60));
  const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));

  if (minutesDiff < 1) {
    return "たった今";
  } else if (minutesDiff < 60) {
    return `${minutesDiff}分前`;
  } else if (hoursDiff < 24) {
    return `${hoursDiff}時間前`;
  } else {
    return `${Math.floor(hoursDiff / 24)}日前`;
  }
};
