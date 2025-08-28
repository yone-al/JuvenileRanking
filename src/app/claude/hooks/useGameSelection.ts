/**
 * ゲーム選択を管理するカスタムフック
 */
import { useState, useCallback } from "react";
import { type ScoreData } from "@/lib/database";

export const useGameSelection = () => {
  // デフォルトはすべて選択
  const [selectedGames, setSelectedGames] = useState<string[]>([
    "game1",
    "game2",
    "game3",
  ]);

  /**
   * ゲームの選択状態をトグル
   */
  const handleGameToggle = useCallback((game: string) => {
    setSelectedGames((prev) => {
      if (prev.includes(game)) {
        // 最低1つは選択されている必要がある
        if (prev.length > 1) {
          return prev.filter((g) => g !== game);
        }
        return prev;
      }
      return [...prev, game];
    });
  }, []);

  /**
   * 選択されたゲームの合計スコアを計算
   */
  const calculateSelectedTotal = useCallback(
    (row: ScoreData) => {
      let total = 0;
      if (selectedGames.includes("game1")) total += row.game1;
      if (selectedGames.includes("game2")) total += row.game2;
      if (selectedGames.includes("game3")) total += row.game3;
      return total;
    },
    [selectedGames],
  );

  return { selectedGames, handleGameToggle, calculateSelectedTotal };
};
