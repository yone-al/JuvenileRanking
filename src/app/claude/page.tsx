"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { type ScoreData } from "@/lib/database";

// 定数とユーティリティをインポート
import {
  LOADING_MIN_DURATION,
  POLLING_INTERVAL,
  SYNC_INDICATOR_DURATION,
  INPUT_STYLES,
  BUTTON_STYLES,
} from "./constants";
import {
  FormData,
  initialFormData,
  SortColumn,
  SortDirection,
  RankedData,
  LatestScoreInfo,
} from "./types";
import { generateDataHash, formatDateTimeLocal, getTimeAgo } from "./utils";

// カスタムフックをインポート
import { useToast } from "./hooks/useToast";
import { useGameSelection } from "./hooks/useGameSelection";

// コンポーネントをインポート
import { Loading } from "./components/Loading";
import { SyncStatus } from "./components/SyncStatus";
import { GameSelector } from "./components/GameSelector";
import { ToastContainer } from "./components/Toast";

/**
 * ランキング表示ページのメインコンポーネント
 */
export default function ClaudePage() {
  // データ管理のステート
  const [data, setData] = useState<ScoreData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingScore, setEditingScore] = useState<ScoreData | null>(null);
  const [showCreatedAtField, setShowCreatedAtField] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [sortColumn, setSortColumn] = useState<SortColumn>("total");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // カスタムフック
  const { toasts, showToast, removeToast } = useToast();
  const { selectedGames, handleGameToggle, calculateSelectedTotal } =
    useGameSelection();

  // リアルタイム同期のステート
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());

  // フォームデータを追加と編集で分離
  const [addFormData, setAddFormData] = useState<FormData>(initialFormData);
  const [editFormData, setEditFormData] = useState<FormData>(initialFormData);

  // タイマーの参照を保持
  const loadingTimer = useRef<NodeJS.Timeout | null>(null);
  const pollingTimer = useRef<NodeJS.Timeout | null>(null);
  const syncIndicatorTimer = useRef<NodeJS.Timeout | null>(null);
  const lastDataHash = useRef<string>("");

  // データ読み込み関数
  const loadData = useCallback(
    async (showLoading = true, isSync = false) => {
      try {
        if (showLoading) {
          setIsLoading(true);
          // Ensure minimum loading time to show the loading screen only on initial load
          const startTime = Date.now();

          const response = await fetch("/api/scores");
          if (response.ok) {
            const scores = await response.json();

            // Ensure loading screen shows for at least LOADING_MIN_DURATION
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(
              0,
              LOADING_MIN_DURATION - elapsedTime,
            );

            if (remainingTime > 0) {
              await new Promise((resolve) => {
                loadingTimer.current = setTimeout(resolve, remainingTime);
              });
            }

            // データ変更チェック
            const newHash = generateDataHash(scores);
            if (
              lastDataHash.current &&
              lastDataHash.current !== newHash &&
              isSync
            ) {
              setIsSyncing(true);
              showToast("新しいデータが見つかりました", "info");
              // 同期インジケーターを一時的に表示
              if (syncIndicatorTimer.current) {
                clearTimeout(syncIndicatorTimer.current);
              }
              syncIndicatorTimer.current = setTimeout(() => {
                setIsSyncing(false);
              }, SYNC_INDICATOR_DURATION);
            }
            lastDataHash.current = newHash;

            setData(scores);
            setLastSyncTime(new Date());
          } else {
            console.error("Failed to fetch scores");
          }
        } else {
          // Quick reload without loading screen for CRUD operations
          const response = await fetch("/api/scores");
          if (response.ok) {
            const scores = await response.json();

            // データ変更チェック
            const newHash = generateDataHash(scores);
            if (
              lastDataHash.current &&
              lastDataHash.current !== newHash &&
              isSync
            ) {
              setIsSyncing(true);
              showToast("新しいデータが見つかりました", "info");
              // 同期インジケーターを一時的に表示
              if (syncIndicatorTimer.current) {
                clearTimeout(syncIndicatorTimer.current);
              }
              syncIndicatorTimer.current = setTimeout(() => {
                setIsSyncing(false);
              }, SYNC_INDICATOR_DURATION);
            }
            lastDataHash.current = newHash;

            setData(scores);
            setLastSyncTime(new Date());
          } else {
            console.error("Failed to fetch scores");
          }
        }
      } catch (error) {
        console.error("Error fetching scores:", error);
      } finally {
        if (showLoading) {
          setIsLoading(false);
        }
      }
    },
    [showToast],
  );

  // 初回データ読み込みとクリーンアップ
  useEffect(() => {
    const loadingTimerRef = loadingTimer.current;
    const pollingTimerRef = pollingTimer.current;
    const syncIndicatorTimerRef = syncIndicatorTimer.current;

    loadData();

    // コンポーネントアンマウント時のクリーンアップ
    return () => {
      if (loadingTimerRef) {
        clearTimeout(loadingTimerRef);
      }
      if (pollingTimerRef) {
        clearInterval(pollingTimerRef);
      }
      if (syncIndicatorTimerRef) {
        clearTimeout(syncIndicatorTimerRef);
      }
    };
  }, [loadData]);

  // ポーリングのセットアップ
  useEffect(() => {
    // ポーリングを開始
    pollingTimer.current = setInterval(() => {
      if (
        document.visibilityState === "visible" &&
        !isLoading &&
        !showAddForm &&
        !editingScore
      ) {
        loadData(false, true);
      }
    }, POLLING_INTERVAL);

    // Visibility change イベントハンドラー
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // タブがアクティブになったら即座に同期
        loadData(false, true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (pollingTimer.current) {
        clearInterval(pollingTimer.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isLoading, showAddForm, editingScore, loadData]);

  // フォーム送信の共通ロジック
  const submitForm = async (url: string, method: string, data: FormData) => {
    const submitData = {
      name: data.name,
      game1: data.game1,
      game2: data.game2,
      game3: data.game3,
      ...(data.created_at && { created_at: data.created_at }),
    };

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submitData),
    });

    if (!response.ok) {
      throw new Error(`Failed to ${method.toLowerCase()} score`);
    }

    return response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await submitForm("/api/scores", "POST", addFormData);
      setAddFormData(initialFormData);
      setShowAddForm(false);
      setShowCreatedAtField(false);
      await loadData(false); // Don't show loading screen for add operation
      showToast("スコアを追加しました", "success");

      // 新しく追加したデータへ自動スクロール（少し遅延を入れる）
      setTimeout(() => {
        const element = document.getElementById(`score-row-${result.id}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 500);
    } catch (error) {
      console.error("Error adding score:", error);
      showToast("スコアの追加に失敗しました", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (score: ScoreData) => {
    setEditingScore(score);
    setEditFormData({
      name: score.name,
      game1: score.game1,
      game2: score.game2,
      game3: score.game3,
      created_at: formatDateTimeLocal(score.created_at),
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScore) return;

    setIsSubmitting(true);
    try {
      await submitForm(`/api/scores/${editingScore.id}`, "PUT", editFormData);
      setEditingScore(null);
      setEditFormData(initialFormData);
      await loadData(false); // Don't show loading screen for update operation
      showToast("変更を保存しました", "success");
    } catch (error) {
      console.error("Error updating score:", error);
      showToast("スコアの更新に失敗しました", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ソート処理のハンドラー
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // 同じカラムをクリックした場合は方向を切り替える
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // 異なるカラムをクリックした場合は降順から始める
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  // 順位計算を最適化 (O(n)に改善)
  const rankedData = useMemo((): RankedData[] => {
    // データに選択されたゲームの合計を追加
    const dataWithSelectedTotal = data.map((row) => ({
      ...row,
      selectedTotal: calculateSelectedTotal(row),
    }));

    // データをソート
    const sortedData = [...dataWithSelectedTotal].sort((a, b) => {
      let aValue, bValue;

      if (sortColumn === "created_at") {
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
      } else if (sortColumn === "total") {
        // totalカラムのソートは選択されたゲームの合計を使用
        aValue = a.selectedTotal;
        bValue = b.selectedTotal;
      } else {
        aValue = a[sortColumn];
        bValue = b[sortColumn];
      }

      // 第一ソート: 選択されたカラムの値で比較
      let primarySort;
      if (sortDirection === "desc") {
        primarySort = bValue - aValue;
      } else {
        primarySort = aValue - bValue;
      }

      // 同点の場合は登録時間で比較（最新が上）
      // ただし、created_atでソートしている場合はスキップ
      if (primarySort === 0 && sortColumn !== "created_at") {
        const aTime = new Date(a.created_at).getTime();
        const bTime = new Date(b.created_at).getTime();
        return bTime - aTime; // 降順（新しい方が上）
      }

      return primarySort;
    });

    // スコアでグループ化（ソートカラムの値でグループ化）
    const scoreGroups = new Map<number | string, number[]>();
    sortedData.forEach((row, index) => {
      let scoreValue: number | string;
      if (sortColumn === "created_at") {
        scoreValue = String(row.created_at);
      } else if (sortColumn === "total") {
        scoreValue = row.selectedTotal;
      } else {
        scoreValue = row[sortColumn];
      }
      if (!scoreGroups.has(scoreValue)) {
        scoreGroups.set(scoreValue, []);
      }
      scoreGroups.get(scoreValue)!.push(index);
    });

    // 順位を計算
    let currentRank = 1;
    const rankedItems = sortedData.map((row, index) => {
      let scoreValue: number | string;
      if (sortColumn === "created_at") {
        scoreValue = String(row.created_at);
      } else if (sortColumn === "total") {
        scoreValue = row.selectedTotal;
      } else {
        scoreValue = row[sortColumn];
      }
      const groupIndices = scoreGroups.get(scoreValue)!;
      const isFirstInGroup = groupIndices[0] === index;
      const isTie = groupIndices.length > 1 && !isFirstInGroup;

      if (isFirstInGroup) {
        currentRank = index + 1;
      }

      // 順位表示のフォーマット（totalの場合のみメダルを表示）
      let displayRank = "";
      if (sortColumn === "total") {
        if (currentRank === 1) displayRank = "🥇 1位";
        else if (currentRank === 2) displayRank = "🥈 2位";
        else if (currentRank === 3) displayRank = "🥉 3位";
        else displayRank = `${currentRank}位`;
      } else {
        displayRank = `${currentRank}位`;
      }

      if (isTie) {
        displayRank += " (同点)";
      }

      return {
        ...row,
        rank: currentRank,
        displayRank,
      };
    });

    return rankedItems;
  }, [data, sortColumn, sortDirection, calculateSelectedTotal]);

  // 最新スコアを判定（最新データが24時間以内なら表示）
  const latestScoreId = useMemo(() => {
    if (data.length === 0) return null;

    // created_atで降順ソート（最新が先頭）
    const sortedByDate = [...data].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    const newest = sortedByDate[0];
    const now = new Date();
    const newestTime = new Date(newest.created_at);
    const timeDiff = now.getTime() - newestTime.getTime();

    // 最新データが24時間以内なら表示
    if (timeDiff <= 24 * 60 * 60 * 1000) {
      return newest.id;
    }

    return null;
  }, [data]);

  // 最新スコアの情報を取得
  const latestScoreInfo = useMemo((): LatestScoreInfo | null => {
    if (!latestScoreId || rankedData.length === 0) return null;

    const scoreData = rankedData.find((item) => item.id === latestScoreId);
    if (!scoreData) return null;

    // 登録からの経過時間を計算
    const timeAgo = getTimeAgo(scoreData.created_at);
    const minutesDiff = Math.floor(
      (new Date().getTime() - new Date(scoreData.created_at).getTime()) /
        (1000 * 60),
    );

    // 選択されたゲームの合計を計算
    const selectedTotal = calculateSelectedTotal(scoreData);

    return {
      ...scoreData,
      selectedTotal,
      rankPosition:
        rankedData.findIndex((item) => item.id === latestScoreId) + 1,
      timeAgo,
      isVeryRecent: minutesDiff <= 5, // 5分以内は特に新しい
    };
  }, [latestScoreId, rankedData, calculateSelectedTotal]);

  // 最新スコアへスクロール
  const scrollToLatest = () => {
    if (!latestScoreId) return;
    const element = document.getElementById(`score-row-${latestScoreId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("本当に削除しますか？")) return;

    setIsDeleting(id);
    try {
      const response = await fetch(`/api/scores/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadData(false); // Don't show loading screen for delete operation
        showToast("削除しました", "success");
      } else {
        console.error("Failed to delete score");
        showToast("スコアの削除に失敗しました", "error");
      }
    } catch (error) {
      console.error("Error deleting score:", error);
      showToast("スコアの削除に失敗しました", "error");
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">
          🎮 スコア ランキング
        </h1>
        <SyncStatus isSyncing={isSyncing} lastSyncTime={lastSyncTime} />
      </div>

      <GameSelector
        selectedGames={selectedGames}
        onGameToggle={handleGameToggle}
      />

      <div className="mb-6">
        <button
          onClick={() => {
            if (!showAddForm) {
              setAddFormData(initialFormData);
              setShowCreatedAtField(false);
            }
            setShowAddForm(!showAddForm);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          新しいスコアを追加
        </button>
      </div>

      {showAddForm && (
        <div className="mb-8 bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            スコア追加
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                プレイヤー名
              </label>
              <input
                type="text"
                value={addFormData.name}
                onChange={(e) =>
                  setAddFormData({ ...addFormData, name: e.target.value })
                }
                className={INPUT_STYLES}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Game 1 スコア
              </label>
              <input
                type="number"
                value={addFormData.game1}
                onChange={(e) =>
                  setAddFormData({
                    ...addFormData,
                    game1: parseInt(e.target.value) || 0,
                  })
                }
                className={INPUT_STYLES}
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Game 2 スコア
              </label>
              <input
                type="number"
                value={addFormData.game2}
                onChange={(e) =>
                  setAddFormData({
                    ...addFormData,
                    game2: parseInt(e.target.value) || 0,
                  })
                }
                className={INPUT_STYLES}
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Game 3 スコア
              </label>
              <input
                type="number"
                value={addFormData.game3}
                onChange={(e) =>
                  setAddFormData({
                    ...addFormData,
                    game3: parseInt(e.target.value) || 0,
                  })
                }
                className={INPUT_STYLES}
                min="0"
              />
            </div>
            <div className="md:col-span-4">
              <button
                type="button"
                onClick={() => setShowCreatedAtField(!showCreatedAtField)}
                className="mb-2 text-sm text-blue-600 hover:text-blue-800 underline"
              >
                {showCreatedAtField ? "登録時間を隠す" : "登録時間を設定する"}
              </button>
              {showCreatedAtField && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    登録時間
                  </label>
                  <input
                    type="datetime-local"
                    value={addFormData.created_at}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        created_at: e.target.value,
                      })
                    }
                    className={INPUT_STYLES}
                  />
                </div>
              )}
            </div>
            <div className="md:col-span-4 flex gap-2">
              <button
                type="submit"
                className={BUTTON_STYLES.success}
                disabled={isSubmitting}
              >
                {isSubmitting ? "追加中..." : "追加"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setShowCreatedAtField(false);
                  setAddFormData(initialFormData);
                }}
                className={BUTTON_STYLES.secondary}
                disabled={isSubmitting}
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      )}

      {data.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-12">
          <div className="text-center">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-500 text-lg mb-2">
              まだデータが登録されていません
            </p>
            <p className="text-gray-400">
              上の「新しいスコアを追加」ボタンから始めましょう！
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* 最新スコアカード */}
          {latestScoreInfo && (
            <div
              className={`mb-6 p-4 rounded-lg shadow-md ${
                latestScoreInfo.isVeryRecent
                  ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-orange-400"
                  : "bg-gradient-to-r from-blue-50 to-green-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {latestScoreInfo.isVeryRecent ? "🔥" : "🎉"} 最新スコア
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({latestScoreInfo.timeAgo})
                    </span>
                  </h3>
                  <p className="text-gray-600">
                    {latestScoreInfo.name}さん -
                    <span className="text-2xl font-bold text-blue-600 mx-2">
                      {latestScoreInfo.displayRank}
                    </span>
                    （{latestScoreInfo.selectedTotal.toLocaleString()}点）
                  </p>
                </div>
                <button
                  onClick={scrollToLatest}
                  className="px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  表で確認 →
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      順位
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      プレイヤー名
                    </th>
                    {selectedGames.includes("game1") && (
                      <th
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort("game1")}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>Game 1</span>
                          {sortColumn === "game1" && (
                            <span className="text-blue-600">
                              {sortDirection === "desc" ? "▼" : "▲"}
                            </span>
                          )}
                        </div>
                      </th>
                    )}
                    {selectedGames.includes("game2") && (
                      <th
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort("game2")}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>Game 2</span>
                          {sortColumn === "game2" && (
                            <span className="text-blue-600">
                              {sortDirection === "desc" ? "▼" : "▲"}
                            </span>
                          )}
                        </div>
                      </th>
                    )}
                    {selectedGames.includes("game3") && (
                      <th
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort("game3")}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>Game 3</span>
                          {sortColumn === "game3" && (
                            <span className="text-blue-600">
                              {sortDirection === "desc" ? "▼" : "▲"}
                            </span>
                          )}
                        </div>
                      </th>
                    )}
                    <th
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("total")}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>合計スコア</span>
                        {sortColumn === "total" && (
                          <span className="text-blue-600">
                            {sortDirection === "desc" ? "▼" : "▲"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("created_at")}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>登録日時</span>
                        {sortColumn === "created_at" && (
                          <span className="text-blue-600">
                            {sortDirection === "desc" ? "▼" : "▲"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rankedData.map((row) => {
                    return (
                      <tr
                        key={row.id}
                        id={`score-row-${row.id}`}
                        className={`
                        hover:bg-gray-50 transition-all duration-300
                        ${
                          row.id === latestScoreId
                            ? latestScoreInfo?.isVeryRecent
                              ? "bg-yellow-50 border-l-4 border-orange-400"
                              : "bg-blue-50 border-l-4 border-blue-300"
                            : ""
                        }
                      `}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="text-lg font-semibold">
                              {row.displayRank}
                            </div>
                            {row.id === latestScoreId && (
                              <span
                                className={`px-2 py-1 text-xs font-bold text-white rounded-full ${
                                  latestScoreInfo?.isVeryRecent
                                    ? "bg-red-500 animate-pulse"
                                    : "bg-blue-500"
                                }`}
                              >
                                NEW
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">
                            {row.name}
                          </div>
                        </td>
                        {selectedGames.includes("game1") && (
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-sm text-gray-900">
                              {row.game1.toLocaleString()}
                            </span>
                          </td>
                        )}
                        {selectedGames.includes("game2") && (
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-sm text-gray-900">
                              {row.game2.toLocaleString()}
                            </span>
                          </td>
                        )}
                        {selectedGames.includes("game3") && (
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-sm text-gray-900">
                              {row.game3.toLocaleString()}
                            </span>
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-lg font-bold text-blue-600">
                            {calculateSelectedTotal(row).toLocaleString()}点
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm text-gray-500">
                            {new Date(row.created_at).toLocaleDateString(
                              "ja-JP",
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleEdit(row)}
                              className={BUTTON_STYLES.warning}
                              disabled={isDeleting === row.id}
                            >
                              編集
                            </button>
                            <button
                              onClick={() => handleDelete(row.id)}
                              className={BUTTON_STYLES.danger}
                              disabled={isDeleting === row.id}
                            >
                              {isDeleting === row.id ? "削除中..." : "削除"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          総レコード数:{" "}
          <span className="font-semibold text-blue-600">{data.length}</span>
        </p>
      </div>

      {editingScore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              スコア編集
            </h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  プレイヤー名
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  className={INPUT_STYLES}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Game 1 スコア
                </label>
                <input
                  type="number"
                  value={editFormData.game1}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      game1: parseInt(e.target.value) || 0,
                    })
                  }
                  className={INPUT_STYLES}
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Game 2 スコア
                </label>
                <input
                  type="number"
                  value={editFormData.game2}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      game2: parseInt(e.target.value) || 0,
                    })
                  }
                  className={INPUT_STYLES}
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Game 3 スコア
                </label>
                <input
                  type="number"
                  value={editFormData.game3}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      game3: parseInt(e.target.value) || 0,
                    })
                  }
                  className={INPUT_STYLES}
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  登録時間
                </label>
                <input
                  type="datetime-local"
                  value={editFormData.created_at}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      created_at: e.target.value,
                    })
                  }
                  className={INPUT_STYLES}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className={`flex-1 ${BUTTON_STYLES.primary}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "更新中..." : "更新"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingScore(null);
                    setEditFormData(initialFormData);
                  }}
                  className={`flex-1 ${BUTTON_STYLES.secondary}`}
                  disabled={isSubmitting}
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
