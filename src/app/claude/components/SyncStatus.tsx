/**
 * リアルタイム同期ステータス表示コンポーネント
 */
interface SyncStatusProps {
  isSyncing: boolean;
  lastSyncTime: Date;
}

export const SyncStatus: React.FC<SyncStatusProps> = ({
  isSyncing,
  lastSyncTime,
}) => {
  return (
    <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
      {isSyncing ? (
        <span className="flex items-center gap-2 text-green-600">
          <span className="animate-spin">🔄</span>
          データを同期中...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <span className="text-green-500">✓</span>
          最終同期: {lastSyncTime.toLocaleTimeString("ja-JP")}
        </span>
      )}
    </div>
  );
};
