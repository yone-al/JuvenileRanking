import React, { useEffect, useState } from "react";
import styles from "./StatusIndicator.module.css";

interface StatusIndicatorProps {
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  onRefresh: () => void;
}

export function StatusIndicator({
  isLoading,
  error,
  lastUpdated,
  onRefresh,
}: StatusIndicatorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering time on server
  const formattedTime = mounted && lastUpdated ? 
    lastUpdated.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) : '';

  return (
    <div className={styles.container}>
      {isLoading && (
        <div className={styles.loadingIndicator} role="status" aria-live="polite">
          📊 データを読み込み中...
        </div>
      )}
      
      {error && (
        <div className={styles.errorIndicator} role="alert" aria-live="assertive">
          ❌ {error}
        </div>
      )}
      
      {lastUpdated && !isLoading && mounted && (
        <div className={styles.updateInfo}>
          最終更新: {formattedTime}
          <button
            onClick={onRefresh}
            className={styles.refreshButton}
            aria-label="データを更新"
            type="button"
          >
            🔄 更新
          </button>
        </div>
      )}
    </div>
  );
}