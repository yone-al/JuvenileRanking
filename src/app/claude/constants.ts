/**
 * アプリケーション全体で使用する定数
 */

// タイマー関連の定数
export const TOAST_DURATION = 3000; // トースト通知の表示時間（3秒）
export const LOADING_MIN_DURATION = 500; // 最小ローディング時間（0.5秒）
export const POLLING_INTERVAL = 5000; // データポーリング間隔（5秒）
export const SYNC_INDICATOR_DURATION = 2000; // 同期インジケーターの表示時間（2秒）

// スタイル定数
export const INPUT_STYLES =
  "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

export const BUTTON_STYLES = {
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
} as const;
