"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { type ScoreData } from "@/lib/database";

// 定数
const TOAST_DURATION = 3000; // 3秒
const LOADING_MIN_DURATION = 500; // 最小ローディング時間

// 共通スタイル定数
const INPUT_STYLES =
  "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
const BUTTON_STYLES = {
  primary:
    "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors",
  success:
    "bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors",
  warning:
    "bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-1 px-3 rounded text-sm transition-colors",
  danger:
    "bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded text-sm transition-colors",
  secondary:
    "bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors",
};

// Toast notification types
type ToastType = "success" | "error" | "info";
type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

// フォームデータの型
type FormData = {
  name: string;
  game1: number;
  game2: number;
  game3: number;
  created_at: string;
};

const initialFormData: FormData = {
  name: "",
  game1: 0,
  game2: 0,
  game3: 0,
  created_at: "",
};

export default function ClaudePage() {
  const [data, setData] = useState<ScoreData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingScore, setEditingScore] = useState<ScoreData | null>(null);
  const [showCreatedAtField, setShowCreatedAtField] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // フォームデータを追加と編集で分離
  const [addFormData, setAddFormData] = useState<FormData>(initialFormData);
  const [editFormData, setEditFormData] = useState<FormData>(initialFormData);

  // タイマーの参照を保持
  const toastTimers = useRef<Map<number, NodeJS.Timeout>>(new Map());
  const loadingTimer = useRef<NodeJS.Timeout | null>(null);

  // クリーンアップ
  useEffect(() => {
    loadData();

    // コンポーネントアンマウント時のクリーンアップ
    return () => {
      // すべてのタイマーをクリア
      toastTimers.current.forEach((timer) => clearTimeout(timer));
      toastTimers.current.clear();

      if (loadingTimer.current) {
        clearTimeout(loadingTimer.current);
      }
    };
  }, []);

  // Toast notification functions with cleanup
  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = Date.now();
      const newToast = { id, message, type };
      setToasts((prev) => [...prev, newToast]);

      // タイマーを設定して参照を保持
      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
        toastTimers.current.delete(id);
      }, TOAST_DURATION);

      toastTimers.current.set(id, timer);
    },
    []
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));

    // タイマーが存在する場合はクリア
    const timer = toastTimers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      toastTimers.current.delete(id);
    }
  }, []);

  const loadData = async (showLoading = true) => {
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
          const remainingTime = Math.max(0, LOADING_MIN_DURATION - elapsedTime);

          if (remainingTime > 0) {
            await new Promise((resolve) => {
              loadingTimer.current = setTimeout(resolve, remainingTime);
            });
          }
          setData(scores);
        } else {
          console.error("Failed to fetch scores");
        }
      } else {
        // Quick reload without loading screen for CRUD operations
        const response = await fetch("/api/scores");
        if (response.ok) {
          const scores = await response.json();
          setData(scores);
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
  };

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

    return response;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitForm("/api/scores", "POST", addFormData);
      setAddFormData(initialFormData);
      setShowAddForm(false);
      setShowCreatedAtField(false);
      await loadData(false); // Don't show loading screen for add operation
      showToast("スコアを追加しました", "success");
    } catch (error) {
      console.error("Error adding score:", error);
      showToast("スコアの追加に失敗しました", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (score: ScoreData) => {
    setEditingScore(score);
    // Convert UTC to local time for datetime-local input
    const date = new Date(score.created_at);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const localDateTimeString = `${year}-${month}-${day}T${hours}:${minutes}`;

    setEditFormData({
      name: score.name,
      game1: score.game1,
      game2: score.game2,
      game3: score.game3,
      created_at: localDateTimeString,
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

  // 順位計算を最適化 (O(n)に改善)
  const rankedData = useMemo(() => {
    // スコアでグループ化
    const scoreGroups = new Map<number, number[]>();
    data.forEach((row, index) => {
      if (!scoreGroups.has(row.total)) {
        scoreGroups.set(row.total, []);
      }
      scoreGroups.get(row.total)!.push(index);
    });

    // 順位を計算
    let currentRank = 1;
    const rankedItems = data.map((row, index) => {
      const groupIndices = scoreGroups.get(row.total)!;
      const isFirstInGroup = groupIndices[0] === index;
      const isTie = groupIndices.length > 1 && !isFirstInGroup;

      if (isFirstInGroup) {
        currentRank = index + 1;
      }

      // 順位表示のフォーマット
      let displayRank = "";
      if (currentRank === 1) displayRank = "🥇 1位";
      else if (currentRank === 2) displayRank = "🥈 2位";
      else if (currentRank === 3) displayRank = "🥉 3位";
      else displayRank = `${currentRank}位`;

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
  }, [data]);

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          {/* メインローディングアニメーション */}
          <div className="relative mb-6">
            <div className="animate-bounce text-6xl mb-4">🍎</div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto"></div>
          </div>

          {/* ローディングテキスト */}
          <p className="text-lg text-gray-600">
            ランキングデータを読み込み中...
          </p>

          {/* ドットアニメーション */}
          <div className="flex justify-center mt-4 space-x-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            <div
              className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">
          🎮 スコア ランキング
        </h1>
      </div>

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
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Game 1
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Game 2
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Game 3
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    合計スコア
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    登録日時
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rankedData.map((row) => {
                  return (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-semibold">
                          {row.displayRank}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          {row.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm text-gray-900">
                          {row.game1.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm text-gray-900">
                          {row.game2.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm text-gray-900">
                          {row.game3.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-lg font-bold text-blue-600">
                          {row.total.toLocaleString()}点
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
                            }
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

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300
              animate-slide-in cursor-pointer min-w-[250px] max-w-[400px]
              ${toast.type === "success" ? "bg-green-500 text-white" : ""}
              ${toast.type === "error" ? "bg-red-500 text-white" : ""}
              ${toast.type === "info" ? "bg-blue-500 text-white" : ""}
              hover:opacity-90
            `}
            onClick={() => removeToast(toast.id)}
          >
            <div className="flex items-center">
              <span className="mr-2 text-lg">
                {toast.type === "success" && "✓"}
                {toast.type === "error" && "✕"}
                {toast.type === "info" && "ℹ"}
              </span>
              <span className="flex-1">{toast.message}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
